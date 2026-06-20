require('dotenv').config();
const mongoose = require("./src/config/mongoose")
// const UserModel = require("./src/schema/messageSchema")//
const MessageSent = require('./src/consumer/sendmessage')
const {Rabbit_MQ_connection } = require("./src/config/RabbitMQ");
const ReadConversations = require("./src/consumer/readConversation");
const ReadConvo = require('./src/consumer/checkConvo');
const MarkDelivery = require("./src/consumer/MarkDelivery");
const updateDeliveryStatus = require("./src/consumer/updateDeliveryStatus");

    (async () => {
        try {
            console.log("hello from index.js from message services");
            await MarkDelivery();
            await Rabbit_MQ_connection();
            await MessageSent();
            await ReadConversations();
            await ReadConvo();
            await updateDeliveryStatus();
            
        } catch (error) {
            console.log(error)
        }
    })()
