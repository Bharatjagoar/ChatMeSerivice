require('dotenv').config();
const mongoose = require("./src/config/mongoose")
const UserModel = require("./src/schema/messageSchema")
const MessageSent = require('./src/consumer/sendmessage')
const {createChannel} = require("./src/config/RabbitMQ");
    (async () => {
        try {
            console.log("hello from index.js from message services")
            await createChannel();
            await MessageSent();
        } catch (error) {
            console.log(error)
        }
    })()
