import React, { useEffect, useState } from "react";
import ChattingWindowCSS from "./ChattingWindow.module.css";
import Displaypicture from "../../../displayPicture/Displaypicture";
import { motion } from "framer-motion";
import getSocket from "../../../../socket/socket";
import instance from "../../../../../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// import instance from "../../../../../axios/axiosInstance";
// import { motion } from 'framer-motion'

const ChattingWindow = (user) => {
  const [isanimate, setanimate] = useState(false);
  const [messageRecieved, setmessageRecieved] = useState([]);
  let RecieversocketId;
  const socket = getSocket();
  const nav = useNavigate();
  console.log("user :: ", user);
  let userdata = user.user;
  const [Message, setMessage] = useState();
  useEffect(() => {
    const fetchConversation = async () => {
      if (!user.user) return;

      const chatId = [user.user._id, user.senderId].sort().join("_");
      try {
        const response = await instance.get(`/getMessages/${chatId}`);
        if (response?.data?.messages) {
          setmessageRecieved(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchConversation();
    const handleIncomingMessage = (data) => {
      console.log("New message:", data);
      setmessageRecieved((prev) => [
        ...prev,
        {
          Message: data.data.Message,
          userid: data.data.id,
          username: data.data.username,
          time: data.data.time,
        },
      ]);
    };

    socket.off("MessageRecieved");
    socket.on("MessageRecieved", handleIncomingMessage);

    return () => {
      socket.off("MessageRecieved", handleIncomingMessage);
    };
  }, [user.user?._id]); // Only re-run if user ID changes

  console.log(user, "from the chatwindows component");
  // RecieversocketId = user.recieverId?user.recieverId:null
  console.log("Reciever__socketID :::", RecieversocketId);
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
    console.log("hello world", user.user._id, user.user.UserName);

    let id = user.user._id;
    let username = user.user.UserName;

    if (!Message || Message.trim() === "") return;

    const currentTime = new Date().toISOString(); // Current timestamp in ISO format

    // Update the UI immediately with the new message
    setmessageRecieved((prev) => [
      ...prev,
      {
        Message, // Message text
        userid: id, // Sender ID
        username, // Sender username
        time: currentTime, // Add timestamp
      },
    ]);

    // Send the message to the server
    socket.emit("getthesocketID-forMessage", { userid: id }, (response) => {
      console.log(response, "resp");
      socket.emit("message_to", {
        RecieversocketId: response,
        Message,
        username,
        id,
      });
    });

    // Clear the input field
    setMessage("");

    // Additional cleanup (if required)
    user.removesearchresult("");
  };

  const inputchange = (e) => {
    socket.emit(
      "getthesocketID-forMessage",
      { userid: user.user._id },
      (response) => {
        console.log("repso", response);
        response &&
          socket.emit("typing", {
            Reciever_socketid: response,
            userID: user.user._id,
          });
      }
    );
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
            {messageRecieved.map((message, index) => {
              const isMine = message.userid === user.user._id || message.senderId === user.user._id;
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
