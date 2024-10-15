import React, { useEffect, useState } from 'react'
import ChattingWindowCSS from "./ChattingWindow.module.css"
import Displaypicture from '../../../displayPicture/Displaypicture'
import { motion } from "framer-motion"
import getSocket from '../../../../socket/socket'
import instance from '../../../../../axios/axiosInstance'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
// import { motion } from 'framer-motion'


const ChattingWindow = (user) => {
    const [isanimate, setanimate] = useState(false);
    const [messageRecieved, setmessageRecieved] = useState([]);
    let RecieversocketId;
    const socket = getSocket();
    const nav = useNavigate();
    let userdata = user.user
    const [Message, setMessage] = useState();
    useEffect(() => {
        RecieversocketId = user.recieverId ? user.recieverId : null
        socket.on("MessageRecieved", (data) => {
            console.log(data)
            setmessageRecieved(prev => [...prev, { Message: data.data.Message, userid: data.data.id, username: data.data.username }])
            console.log(data)
        })
        console.log(messageRecieved)
        return () => {
            socket.off("MessageRecieved")
        }
    }, [messageRecieved])

    console.log(user, "from the chatwindows component")
    // RecieversocketId = user.recieverId?user.recieverId:null
    console.log("Reciever__socketID :::", RecieversocketId)
    // console.log(userdata.UserName, 99999999999999999999,socketId)
    const logoutBtn = async () => {
        try {
            const respo = await instance.post("/logout")
            nav("/login")
            console.log(respo)
        } catch (error) {
            console.log(error)
        }
    }

    const btnclicked = async () => {
        console.log("hello world", user.user._id, user.user.UserName)

        let id = user.user._id
        let username = user.user.UserName
        console.log(user.user._id, "this is the user name i got")
        setmessageRecieved(prev => [...prev, { Message, userid: user.user._id, username: user.user.UserName }])
        socket.emit("getthesocketID-forMessage", { userid: user.user._id }, (response) => {
            console.log(response, "resp")
            socket.emit("message_to", { RecieversocketId: response, Message, username, id })
        })
        setMessage("")
        // console.log(user.user._id)

    }


    return <div className={ChattingWindowCSS.mainchatscreens}>
        <div className={ChattingWindowCSS.Navbar}>
            <div className={ChattingWindowCSS.dpContainer}>
                <Displaypicture />
                <motion.p
                    animate={{ y: isanimate ? -10 : 0 }}>
                    {userdata.UserName}
                </motion.p>
                {/* <p>{isanimate?"typing....":null}</p> */}
            </div>
            <button onClick={() => { logoutBtn() }}>logout</button>
        </div>
        <div className={ChattingWindowCSS.Displaychat}>
            fdsa
            <div className={ChattingWindowCSS.Message}>
                <div className={ChattingWindowCSS.MyDiv}>
                    <h1>me</h1>
                </div>
            </div>
            <div className={ChattingWindowCSS.Message}>
                <div>
                    <h1>Sender</h1>
                </div>
            </div>
            {

                messageRecieved.map((message, index) => {
                    console.log(message.userid, user.user._id)
                    return <div key={index}
                        className={
                            user.user._id == message.userid ? ChattingWindowCSS.Message : ChattingWindowCSS.MyDiv
                        }
                    >
                        <p>{message.username}</p>
                        <h3>{message.Message}</h3>

                    </div>
                })
            }

        </div>
        <div className={ChattingWindowCSS.SendMessageDiv}>
            <input type="text" onChange={(e) => { setMessage(e.target.value) }}
            value={Message}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    btnclicked();  // Submit the message on pressing Enter
                }
            }} placeholder='type a message' />
            <motion.div className={ChattingWindowCSS.SendBtn}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { btnclicked() }}
            >
                <FontAwesomeIcon icon={faPaperPlane} />
            </motion.div>

            {/* <button>Submit</button> */}
        </div>

        {/* <button onClick={(e) => { btnclicked() }}>click</button> */}
    </div>

}

export default ChattingWindow
