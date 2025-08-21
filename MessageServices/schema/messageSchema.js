const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recieverID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reaction: {
      type: String,
    },
    time: { type: Date },
  },
  { timestamp: true }
);

const messageModel = mongoose.model("Message", MessageSchema);

module.exports = messageModel;
