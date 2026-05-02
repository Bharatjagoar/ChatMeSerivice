import React from "react";
import styles from "./EmptyChat.module.css";
import logo from "../../../../../images/logo.png";  // adjust path if needed

const EmptyChat = () => {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.contentBox}>
        <img
          src={logo}
          alt="WhatsApp"
          className={styles.illustration}
        />
        <h1>WhatsApp Web</h1>
        <p>
          Send and receive messages without keeping your phone online.
          <br />
          Use WhatsApp on up to 4 linked devices.
        </p>
      </div>
    </div>
  );
};

export default EmptyChat;
