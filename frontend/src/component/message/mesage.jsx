import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { faBars, faComment, faPhone ,faCircleNotch} from "@fortawesome/free-solid-svg-icons"
import MessageCSS from "./messages.module.css"
import { icon } from "@fortawesome/fontawesome-svg-core";


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
            <div className={MessageCSS.leftMenu}>
            <div className={MessageCSS.topleft}>
            </div>
            {
                arr.map((index,key)=>(
                    <div className={MessageCSS.leftMenutop}>
                        <FontAwesomeIcon icon={index.icon}/>
                    </div>
                    
                ))
            }
            {/* <FontAwesomeIcon icon={faBars} />
            <FontAwesomeIcon icon={faComment}/>
            <FontAwesomeIcon icon={faPhone}/> */}

            </div>

            {/* <h1>hello from Messages</h1> */}
        </div>

    </>
}

export default Message;