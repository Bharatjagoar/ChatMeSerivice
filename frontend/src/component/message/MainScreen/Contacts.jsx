import React, { useEffect, useState } from 'react'
import ContactsCss from "./Contacts.module.css"
import {socket} from "../../../socket/socket"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook, faLariSign } from '@fortawesome/free-solid-svg-icons'
import instance from "../../../../axios/axiosInstance"
import Displaypicture from '../../displayPicture/Displaypicture'



const debounce = (func, delay) => {
    let time;

    return function (...args) {
        if (time) clearTimeout(time);
        time = setTimeout(() => {
            let context = this;
            func.apply(context, args)
        }, delay)
    }
}



const Contacts = () => {
    const [Searchstring, setSearchstring] = useState();
    const [Chats, SetChats] = useState();
    const [isanimate, setanimate] = useState(false);


    const btnclicked = async () => {
        setanimate(!isanimate)
        socket.emit("hel",{good:"message"})
        try {
            const respo = await instance.get("/test")
            console.log(respo)
        } catch (error) {
            console.log(error)
        }
    }
    const Search = async () => {
        console.log("inside the Function")
        try {
            // if()
            const response = await instance.get("/test")
            console.log(response)
        } catch (error) {
            console.log(error, "this is error")
        }
    }
    const searchStringChange = debounce(async (e) => {
        try {
            if (!e.target.value) {
                SetChats(null)
                return
            }
            const respo = await instance.post("/SearchString", { search: e.target.value })
            console.log(respo.data.data)
            SetChats(respo.data.data)
        } catch (error) {
            console.log(error)
        }
    }, 1200)

    const placeholder = `${<FontAwesomeIcon icon={faAddressBook} />}Search or start a new chat`
    return <div className={ContactsCss.ChatandMessage}>
        <motion.div className={ContactsCss.Contacts}>
            <h2>Chats</h2>
            <FontAwesomeIcon className={ContactsCss.book} icon={faAddressBook} />
            <div className={ContactsCss.Searcg}>
                <input type="text"
                    placeholder={"Search contacts and chat"}
                    onChange={(e) => { searchStringChange(e) }}
                />
            </div>
            <div>
                {
                    Chats ? Chats.map((item, key) => <motion.div
                        whileHover={{ backgroundColor: "rgb(56, 56, 56)" }}
                        key={key}
                        className={ContactsCss.ChatsfromSearch}
                    >
                        <span>{item.UserName}</span>
                    </motion.div>) : null
                }
            </div>

        </motion.div>

        <div className={ContactsCss.mainchatscreens}>
            <div className={ContactsCss.Navbar}>
                <div className={ContactsCss.dpContainer}>
                    <Displaypicture />
                    <motion.p
                        animate={{ y: isanimate ? -10 : 10 }}>
                        bharat
                    </motion.p>
                    {/* <p>{isanimate?"typing....":null}</p> */}
                </div>

            </div>
            <div className={ContactsCss.scrollloader}>
            </div>
            <button onClick={(e) => { btnclicked() }}>click</button>
        </div>
    </div>
}

export default Contacts
