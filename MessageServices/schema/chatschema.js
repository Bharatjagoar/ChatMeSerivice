const mongoose = require("mongoose")

const chatCollectionSchema = new mongoose.Schema({
    participant: [{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    LastMessage:{
        type:String
    },
    Time:{
        type:Date
    },
    unreadCount:{
      user1:{type:Number,default:0},
      user2:{type:Number,default:0}
    },
    chatId:{
        type:String
    }
})

const Chatscollection = mongoose.model("ChatsCollectionModel",chatCollectionSchema)

module.exports = Chatscollection