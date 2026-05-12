import React, { useEffect, useState } from "react";
import ChattingWindowCSS from "./ChattingWindow.module.css";
import Displaypicture from "../../../displayPicture/Displaypicture";
import { motion } from "framer-motion";
import getSocket from "../../../../socket/socket";
import instance from "../../../../../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { loadConversationMessages } from "../../../../../redux/chatslice";
// import instance from "../../../../../axios/axiosInstance";
// import { motion } from 'framer-motion'

const ChattingWindow = (user) => {
  const [isanimate, setanimate] = useState(false);
  let RecieversocketId;
  const dispatch = useDispatch();
  const socket = getSocket();
  const nav = useNavigate();
  let userdata = user.user;
  const currentLoggedinUser = useSelector((state)=>{
    console.log(state);
    return state.WhatsApp.userId;
  });
  const [Message, setMessage] = useState();
  const chatId = [user.user._id, user.senderId]
    .sort()
    .join("_");
  const conversations = useSelector((state) => {

    console.log(state.chat.conversations[chatId]?.messages);
    return (
      state.chat.conversations[chatId]?.messages || []
    );
  });
  console.log("convo :: ",conversations);
  useEffect(() => {

    const fetchConversation = async () => {

      if (!user.user) return;
      console.log(user.user._id, user.senderId)
      try {

        // const chatId = [user.user._id, user.senderId].sort().join("_");
        console.log(user);

        const response = await instance.get(`/getMessages/${chatId}`);

        if (response?.data?.messages) {
          console.log(response.data.messages)
          dispatch(
            loadConversationMessages({ chatId, messages: response.data.messages })
          );
        }

      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchConversation();

  }, [user.user?._id, user.senderId]);
  // console.log(user, "from the chatwindows component");
  // RecieversocketId = user.recieverId?user.recieverId:null
  // console.log("Reciever__socketID :::", RecieversocketId);
  // console.log(userdata.UserName, 99999999999999999999,socketId)
  const logoutBtn = async () => {
    try {
      const respo = await instance.post("/logout");
      nav("/login");
      console.log(respo);
    } catch (error) {
      console.log(error);
    }
  };

  const btnclicked = async () => {
    let id = user.user._id;
    let username = user.user.UserName;
    if (!Message || Message.trim() === "") return;

    const currentTime = new Date().toISOString();


    console.log(user)
    let { senderId } = user;
    socket.emit("getthesocketID-forMessage", { userid: id, Message, username, id, senderId });

    setMessage("");

    user.removesearchresult("");
  };

  const inputchange = (e) => {

    setMessage(e.target.value);
  };

  return (
    <div className={ChattingWindowCSS.mainchatscreens}>
      <div className={ChattingWindowCSS.Navbar}>
        <div className={ChattingWindowCSS.dpContainer}>
          <Displaypicture />
          <motion.p animate={{ y: isanimate ? -10 : 0 }}>
            {userdata.UserName}
          </motion.p>
          {/* <p>{isanimate?"typing....":null}</p> */}
        </div>
        <button
          onClick={() => {
            logoutBtn();
          }}
        >
          logout
        </button>
      </div>
      <div className={ChattingWindowCSS.Displaychat}>
        {/* fdsa */}
        {/* <div className={ChattingWindowCSS.Message}>
                <div className={ChattingWindowCSS.MyDiv}>
                    <h1>me</h1>
                </div>
            </div>
            <div className={ChattingWindowCSS.Message}>
                <div>
                    <h1>Sender</h1>
                </div>
            </div> */}
        {
          <div className={ChattingWindowCSS.messagescontainer}>
            {conversations.map((message, index) => {
              const isMine = message.senderId === currentLoggedinUser;
              return (
                <div
                  key={message._id || `${message.userid}-${index}`}
                  className={`${ChattingWindowCSS.messageBubble} ${isMine ? ChattingWindowCSS.myMessage : ChattingWindowCSS.otherMessage}`}
                >
                  <div className={ChattingWindowCSS.messageText}>
                    {message.message || message.Message || "No message content"}
                  </div>
                  <div className={ChattingWindowCSS.messageTime}>
                    {message.time ? new Date(message.time).toLocaleTimeString() : "No time"}
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>
      <div className={ChattingWindowCSS.SendMessageDiv}>
        <input
          type="text"
          onChange={(e) => {
            inputchange(e);
          }}
          value={Message}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              btnclicked(); // Submit the message on pressing Enter
            }
          }}
          placeholder="type a message"
        />
        <motion.div
          className={ChattingWindowCSS.SendBtn}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            btnclicked();
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </motion.div>

        {/* <button>Submit</button> */}
      </div>

      {/* <button onClick={(e) => { btnclicked() }}>click</button> */}
    </div>
  );
};

export default ChattingWindow;
