import React, { useEffect, useState } from "react";
import ContactsCss from "./Contacts.module.css";
// import { socket } from "../../../socket/socket"
import getSocket from "../../../socket/socket";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faLariSign } from "@fortawesome/free-solid-svg-icons";
import instance from "../../../../axios/axiosInstance";
import EmptyChat from "./RightChattingwindows/EmptyChat";
import Displaypicture from "../../displayPicture/Displaypicture";
import ChattingWindow from "./RightChattingwindows/ChattingWindow";
import { useSelector } from "react-redux";

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

const Contacts = () => {
  const [Searchstring, setSearchstring] = useState();
  const [Chats, SetChats] = useState();
  const [userData, setuserData] = useState();
  const [isanimate, setanimate] = useState(false);
  const [receiver, setreciever] = useState();
  const [conversation, setconversation] = useState(null);
  const socket = getSocket();
  const UserId = useSelector((state) => state.WhatsApp.userId);
  console.log(UserId);

  useEffect(() => {
    console.log("hellow from useEffect of contacts");
    // console.log(UserId);
    socket.on("hellofromUser", (data) => {
      console.log(data);
    });
    async function fetchConversation() {
      console.log("this is the user data", userData);
      const { data } = await instance.get("/LoadConversation/" + UserId);
      // let { resultArr } = data;
      try {
        // console.log(UserId,receiver);
        // respo = await instance.get("/getMessages/" + chatid);
        // console.log(respo);
      } catch (error) { 
        console.log(error);
      }
      console.log(data);
      setconversation(data);
    }
    fetchConversation();
    return () => {
      console.log("from contact unmount");
      socket.off("hellofromUser");
    };
  }, []);

  async function handleDivClick(data) {
    
    console.log(data,UserId,"555555555555555555555555")
    try {
      let chatid = [data._id, UserId].sort().join("_");
      console.log(":Fdsa");
      
      let respo = await instance.get("/getMessages/" + chatid);
      console.log(respo);
    } catch (error) { 
      console.log(error);
    }
    setuserData(data);
    
    socket.emit("get_the_Reaceiver_id", data._id, (response) => {
      console.log(response, "from the respofdsafdsafdsafdsa");
      setreciever(response.respo);
    });
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
          {Chats
            ? Chats.map((item, key) => (
                <motion.div
                  whileHover={{ backgroundColor: "rgb(56, 56, 56)" }}
                  key={item._id}
                  className={ContactsCss.ChatsfromSearch}
                  onClick={() => {
                    handleDivClick(item);
                  }}
                >
                  fdas<br></br>
                  <span>{item.UserName}</span>
                </motion.div>
              ))
            : conversation?.map((item, key) => (
                <motion.div
                  whileHover={{ backgroundColor: "rgb(56, 56, 56)" }}
                  key={item._id}
                  className={ContactsCss.ChatsfromSearch}
                  onClick={() => {
                    handleDivClick(item?.participant);
                  }}
                >
                  <span>
                    {item.participant?.UserName}
                  </span>
                </motion.div>
              ))}
        </div>
      </motion.div>

      {/* <div className={ContactsCss.mainchatscreens}>
            <div className={ContactsCss.Navbar}>
                <div className={ContactsCss.dpContainer}>
                    <Displaypicture />
                    <motion.p
                        animate={{ y: isanimate ? -10 : 10 }}>
                        bharat
                    </motion.p>
                    { <p>{isanimate?"typing....":null}</p> }
                </div>
                <button onClick={()=>{logoutBtn()}}>logout</button>
            </div>
            <div className={ContactsCss.scrollloader}>
            
            </div>
            <button onClick={(e) => { btnclicked() }}>click</button>
        </div> */}
      {/* <ChattingWindow user={userData}/> */}
      {userData ? (
        <ChattingWindow
          user={userData}
          recieverId={receiver}
          removesearchresult={SetChats}
          senderId={UserId}
        />
      ) : (
        <EmptyChat />
      )}
      {/* <EmptyChat/> */}
    </div>
  );
};

export default Contacts;
