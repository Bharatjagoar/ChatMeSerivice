import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { faBars, faComment, faPhone ,faCircleNotch} from "@fortawesome/free-solid-svg-icons"
import MessageCSS from "./messages.module.css"
import { icon } from "@fortawesome/fontawesome-svg-core";
import Contacts from "./MainScreen/Contacts";
import {motion} from "framer-motion"

const Message = () => {
    const arr = [
        {
            name:"Navigate",
            icon:faBars
        },
        {
            name:"chats",
            icon:faComment
        },
        {
            name:"call",
            icon:faPhone
        },
        {
            name:"cirlce notch",
            icon:faCircleNotch
        }
        
    ]

    return <>
        <div className={MessageCSS.base}>
            <div className={MessageCSS.Logo}>
                <FontAwesomeIcon icon={faWhatsapp} color={"rgb(36, 189, 93)"} />
                <p>WhatsApp</p>
            </div>
            <div className={MessageCSS.Maincontainer}>
            <div className={MessageCSS.leftMenu}>
            {
                arr.map((index,key)=>(
                    <motion.div key={key} whileHover={{backgroundColor:"rgb(35, 39, 46)"}} className={MessageCSS.leftMenutop}>
                        <FontAwesomeIcon icon={index.icon}/>
                    </motion.div>
                    
                ))
            }
            {/* <FontAwesomeIcon icon={faBars} />
            <FontAwesomeIcon icon={faComment}/>
            <FontAwesomeIcon icon={faPhone}/> */}

            </div>

            {/* <h1>hello from Messages</h1> */}
            <div className={MessageCSS.chatsContainer}>
                <Contacts/>
            </div>
            
            </div>
            
       </div>

    </>
}

export default Message;