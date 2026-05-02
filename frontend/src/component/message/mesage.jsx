import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faBars, faComment, faPhone, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import MessageCSS from "./messages.module.css";
import Contacts from "./MainScreen/Contacts";
import { motion } from "framer-motion";

const Message = () => {

    const [isChatOpen, setIsChatOpen] = useState(true);
    const [activeIcon, setActiveIcon] = useState(1);

    const arr = [
        { name: "Navigate", icon: faBars },
        { name: "Chats", icon: faComment },
        { name: "Call", icon: faPhone },
        { name: "Status", icon: faCircleNotch }
    ];

    const handleIconClick = (index) => {
        setActiveIcon(index);

        // Toggle chat sidebar when clicking first icon
        if (index === 0) {
            setIsChatOpen(prev => !prev);
        }
    };

    return (
        <div className={MessageCSS.base}>
            <div className={MessageCSS.Logo}>
                <FontAwesomeIcon icon={faWhatsapp} />
                <p>WhatsApp</p>
            </div>

            <div className={MessageCSS.Maincontainer}>

                {/* ICON SIDEBAR */}
                <div className={MessageCSS.leftMenu}>
                    {arr.map((item, index) => (
                        <motion.div
                            key={index}
                            onClick={() => handleIconClick(index)}
                            whileHover={{ scale: 1.1 }}
                            className={`${MessageCSS.leftMenutop} 
                            ${activeIcon === index ? MessageCSS.active : ""}`}
                        >
                            <FontAwesomeIcon icon={item.icon} />
                        </motion.div>
                    ))}
                </div>

                {/* Contacts takes up ALL remaining space */}
                <Contacts isChatOpen={isChatOpen} />

            </div>
        </div>
    );
};

export default Message;
