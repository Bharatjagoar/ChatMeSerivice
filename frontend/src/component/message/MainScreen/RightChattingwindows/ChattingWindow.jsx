import React, { useState } from 'react'
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
    const socket = getSocket();
    const nav = useNavigate();
    let userdata = user.user
    const [Message, setMessage] = useState()
    const socketId = user.recieverId
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
    const MessageUpdate = (e) => {
        setMessage(e.target.value)
    }
    const btnclicked = async () => {
        // console.log(socket.connected);
        // socket.emit("bharatjagoar",{message:"windowsAlert"})
        console.log("socket id :: ", socket.id)
        // socket.connect()
        setanimate(!isanimate)
        // socket.connect()
        try {
            const respo = await instance.get("/test")
            // console.log(respo)
        } catch (error) {
            console.log(error)
        }
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
        <div className={ChattingWindowCSS.scrollloader}>
            fdsa
        </div>
        <div className={ChattingWindowCSS.SendMessageDiv}>
            <input type="text" onChange={(e) => { setMessage(e.target.value) }} placeholder='type a message' />
            <motion.div className={ChattingWindowCSS.SendBtn}
                whileTap={{ scale: 0.9 }}
            >
                <FontAwesomeIcon icon={faPaperPlane} />
            </motion.div>

            {/* <button>Submit</button> */}
        </div>

        {/* <button onClick={(e) => { btnclicked() }}>click</button> */}
    </div>

}

export default ChattingWindow
