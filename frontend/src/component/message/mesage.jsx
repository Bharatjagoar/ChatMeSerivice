import React, { useEffect, useState } from "react";
import { socket } from "../../socket/socket";

const Message = () => {
    const [message, setmessage] = useState([]);
    const [mesageString, setmesageString] = useState();
    useEffect(() => {
        console.log("hellow from useEffect")
        socket.on("setNewMessaging", (data) => { 
            console.log(data) 
            setmessage(prev=>[...prev,data])
        })
    }, [socket])
    console.log("hello world ")
    const btnClicked = () => {
        setmessage(prev => [...prev, mesageString])
        socket.emit("newMessage", { mesageString })
    }
    return <>
        <p>meesages are here :-</p>
        <input type="text" onChange={(e) => { setmesageString(e.target.value) }} />
        <button onClick={() => { btnClicked() }}>send</button>

        <div >
                {message?.map((item, index) => (
                    <h6 key={index}>{item}</h6>
                ))}
        </div>
    </>
}

export default Message;