import React, { useEffect, useState ,useMemo} from "react";
import ContactsCss from "./Contacts.module.css";
// import { socket } from "../../../socket/socket"
import getSocket from "../../../socket/socket";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faLariSign } from "@fortawesome/free-solid-svg-icons";
import instance from "../../../../axios/axiosInstance";
import EmptyChat from "./RightChattingwindows/EmptyChat";
import Displaypicture from "../../displayPicture/Displaypicture";
import ChattingWindow from "./RightChattingwindows/ChattingWindow";
import { useSelector } from "react-redux";
import { formatContactTime } from "../../../../Utility/utils";

const debounce = (func, delay) => {
  let time;

  return function (...args) {
    if (time) clearTimeout(time);
    time = setTimeout(() => {
      let context = this;
      func.apply(context, args);
    }, delay);
  };
};

const Contacts = ({ isChatOpen }) => {
  const [Searchstring, setSearchstring] = useState();
  const [Chats, SetChats] = useState();
  const [userData, setuserData] = useState();
  const [isanimate, setanimate] = useState(false);
  const [receiver, setreciever] = useState();
  const [conversation, setconversation] = useState(null);
  const socket = getSocket();
  const UserId = useSelector((state) => state.WhatsApp.userId);
  const reduxConversations = useSelector((state) => state.chat.conversations);

  const enrichedConversations = useMemo(() => {
    if (!conversation) return [];

    const apiChatIds = new Set(
      conversation.map((item) =>
        [item.participant._id, UserId].sort().join("_"),
      ),
    );

    const fromApi = conversation.map((item) => {
      const chatId = [item.participant._id, UserId].sort().join("_");
      const reduxConv = reduxConversations[chatId];
      return {
        ...item,
        LastMessage:
          reduxConv?.lastMessage?.message ||
          reduxConv?.lastMessage?.Message ||
          item.LastMessage,
        Time: reduxConv?.lastMessage?.time || item.Time,
      };
    });

    const fromReduxOnly = Object.keys(reduxConversations)
      .filter((chatId) => !apiChatIds.has(chatId))
      .map((chatId) => {
        const lastMsg = reduxConversations[chatId].lastMessage;
        if (!lastMsg) return null;
        return {
          _id: chatId,
          participant: {
            _id: lastMsg.senderId,
            UserName:
              UserId === lastMsg.senderId
                ? lastMsg.receiverusername
                : lastMsg.senderUsername,
          },
          LastMessage: lastMsg.Message || lastMsg.message,
          Time: lastMsg.time,
        };
      })
      .filter(Boolean);

    return [...fromApi, ...fromReduxOnly].sort(
      (a, b) => new Date(b.Time) - new Date(a.Time),
    );
  }, [conversation, reduxConversations, UserId]);

  // console.log(enrichedConversations);

  const MessageRecievedACK = (data) => {
    console.log("message !", data);
  };

  useEffect(() => {
    console.log("hellow from useEffect of contacts");

    async function fetchConversation() {
      console.log("this is the user data", userData, UserId);
      try {
        const { data } = await instance.get("/LoadConversation/" + UserId);
        // console.log
        console.log("inside fetchConversation", data);
        setconversation(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchConversation();
    return () => {
      console.log("from contact unmount");
    };
  }, [UserId]);

  async function handleDivClick(data) {
    console.log("fda", data);
    try {
      let chatid = [data._id, UserId].sort().join("_");

      console.log(chatid);

      let respo = await instance.get("/getMessages/" + chatid);
      console.log(respo);
    } catch (error) {
      console.log(error);
    }
    console.log(data);
    setuserData(data);
  }

  const Search = async () => {
    console.log("inside the Function");
    try {
      // if()
      const response = await instance.get("/test");
      console.log(response);
    } catch (error) {
      console.log(error, "this is error");
    }
  };
  const searchStringChange = debounce(async (e) => {
    try {
      if (!e.target.value) {
        SetChats(null);
        return;
      }
      const respo = await instance.post("/SearchString", {
        search: e.target.value,
      });
      console.log(respo.data.data);
      SetChats(respo.data.data);
    } catch (error) {
      console.log(error);
    }
  }, 1200);
  const logout = (e) => {
    console.log("hellow world ");
  };
  return (
    <div className={ContactsCss.ChatandMessage}>
      {/* LEFT PANEL — toggle based on prop */}
      {isChatOpen && (
        <motion.div className={ContactsCss.Contacts}>
          <h2>Chats</h2>
          <FontAwesomeIcon className={ContactsCss.book} icon={faAddressBook} />
          <div className={ContactsCss.Searcg}>
            <input
              type="text"
              placeholder={"Search contacts and chat"}
              onChange={(e) => {
                searchStringChange(e);
              }}
            />
          </div>
          <div>
            {Chats ? (
              Chats.map((item, key) => (
                <motion.div
                  whileHover={{ backgroundColor: "rgb(56, 56, 56)" }}
                  key={item._id}
                  className={ContactsCss.ChatsfromSearch}
                  onClick={() => {
                    handleDivClick(item);
                  }}
                >
                  <br />
                  <span>{item.UserName}</span>
                </motion.div>
              ))
            ) : (
              <AnimatePresence>
                {enrichedConversations?.map((item, key) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    layout // this handles bubbling/reorder animation
                    whileHover={{ backgroundColor: "rgb(56, 56, 56)" }}
                    className={ContactsCss.ChatsfromSearch}
                    onClick={() => handleDivClick(item?.participant)}
                  >
                    <div className={ContactsCss.contactRow}>
                      <div className={ContactsCss.avatar}>
                        {item.participant?.UserName?.charAt(0).toUpperCase()}
                      </div>
                      <div className={ContactsCss.contactInfo}>
                        <div className={ContactsCss.contactTop}>
                          <span className={ContactsCss.contactName}>
                            {item.participant?.UserName}
                          </span>
                          <span className={ContactsCss.contactTime}>
                            {formatContactTime(item.Time)}
                          </span>
                        </div>
                        <div className={ContactsCss.lastMessage}>
                          {item.LastMessage}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      )}

      {/* RIGHT PANEL — always visible */}
      {userData ? (
        <ChattingWindow
          user={userData}
          removesearchresult={SetChats}
          senderId={UserId}
        />
      ) : (
        <EmptyChat />
      )}
    </div>
  );
};

export default Contacts;
