require('dotenv').config();
const mongoose = require("./src/config/mongoose")
// const UserModel = require("./src/schema/messageSchema")//
const MessageSent = require('./src/consumer/sendmessage')
const {createChannel} = require("./src/config/RabbitMQ");
const ReadConversations = require("./src/consumer/readConversation");
const ReadConvo = require('./src/consumer/checkConvo');
    (async () => {
        try {
            console.log("hello from index.js from message services");
            await createChannel();
            await MessageSent();
            await ReadConversations();
            await ReadConvo();
            
        } catch (error) {
            console.log(error)
        }
    })()
