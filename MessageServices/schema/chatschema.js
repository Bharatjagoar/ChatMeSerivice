const mongoose = require("mongoose")

const chatCollectionSchema = new mongoose.Schema({
    participant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    LastMessage: {
        type: String
    },
    Time: {
        type: Date
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    },
    chatId: {
        type: String
    }
})

const Chatscollection = mongoose.model("ChatsCollectionModel", chatCollectionSchema)

module.exports = Chatscollection