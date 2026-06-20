const {getChannel}= require("../config/RabbitMQ");
const Message = require("../../schema/messageSchema"); // adjust path
const mongoose = require("mongoose");

const MarkDelivery = async () => {
  console.log("Marking deliveries");
  const channel = await getChannel();
  channel.assertQueue("markdeliver", { durable: true });

  channel.consume("markdeliver", async (message) => {
    if (!message) return;
    try {
      const { userid, replyTo, correlationId } = JSON.parse(
        message.content.toString(),
      );

      const messages = await Message.find({
        recieverID: new mongoose.Types.ObjectId(userid), // ← cast
        status: "sent",
      })
        .sort({ createdAt: 1 })
        .limit(100);
      console.log("here after login from ",userid);
      channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(messages)), {
        correlationId,
      });

      channel.ack(message);
    } catch (error) {
      console.log("error in marking delivery :- ", error);
      channel.nack(message, false, false);
    }
  });
};

module.exports = MarkDelivery;
