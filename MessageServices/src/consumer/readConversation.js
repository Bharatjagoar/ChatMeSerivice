const { getchannel } = require("../config/RabbitMQ");
const chatsDB = require("../../schema/chatschema");
const mongoose = require("mongoose");

async function ReadConversations() {
  const channel = await getchannel();
  console.log("here inside the Read convo");

  await channel.assertQueue("ReadConvos", { durable: false });

  channel.consume("ReadConvos", async (mes) => {
    if (!mes) return;

    try {
      const { id } = JSON.parse(mes.content.toString());
      await channel.assertQueue(mes.properties.replyTo, { durable: false });

      console.log("hello world", id);
      const Convos = await chatsDB.find({ participant: id }).sort({ Time: -1 });

      const resultArr = Convos.map((element) => {
        let obj = { ...element._doc };

        if (id == element.participant[0].toString()) {
          obj.unreadCount =
            element.participant[0].toString() > element.participant[1].toString()
              ? element.unreadCount.user2
              : element.unreadCount.user1;
        } else {
          obj.unreadCount =
            element.participant[0].toString() > element.participant[1].toString()
              ? element.unreadCount.user1
              : element.unreadCount.user2;
        }
        return obj;
      });

      const res = JSON.stringify({ resultArr });

      channel.sendToQueue(
        mes.properties.replyTo,
        Buffer.from(res),
        { correlationId: mes.properties.correlationId }
      );

      channel.ack(mes);
    } catch (error) {
      console.error("Error in ReadConversations:", error);
      channel.nack(mes, false, false); // discard bad messages
    }
  });
}

module.exports = ReadConversations;
