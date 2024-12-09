const { getchannel } = require("../config/RabbitMQ");
const messageDB = require("../../schema/messageSchema");
const chatCollectionDB = require("../../schema/chatschema");

async function MessageSent() {
  const channel = await getchannel();
  await channel.assertQueue("messageSent", { durable: false });
  channel.consume("message", async (message) => {
    console.log("inside the message from consumer!!!!!! !");
    if (message != null) {
      let data = JSON.parse(message.content.toString());
      let chatId = [data.RecieverId, data.id].sort().join("_");
      if (data.RecieverId < data.id) {
        try {
          const findChatCollection = await chatCollectionDB.findOne({
            chatId: chatId,
          });

          console.log("this is the Findscollection :: ", findChatCollection);
          if (findChatCollection) {
            console.log("we got chat collection");
            findChatCollection.unreadCount.user1 += 1;
            let savedoc = await findChatCollection.save();
            console.log("saved ::",savedoc)
            // const findOneAndUpdate = await
          } else {
            // const createOneCollection =

            console.log("from else :: ");
            const createCollection = await chatCollectionDB.create({
              chatId: chatId,
              LastMessage: data.Message,
              participant: [data.id, data.RecieverId],
              Time: data.time,
            });
            createCollection.unreadCount.user1 += 1;
            let savedoc = await createCollection.save();
            console.log("saved ::",savedoc)
          }
        } catch (error) {
          console.log("err :: ", error);
        }
      } else {
        console.log("no");
        try {
            const findChatCollection = await chatCollectionDB.findOne({
              chatId: chatId,
            });
  
            console.log("this is the Findscollection :: ", findChatCollection);
            if (findChatCollection) {
              console.log("we got chat collection");
              findChatCollection.unreadCount.user2 += 1;
              let savedoc = await findChatCollection.save();
              console.log("saved ::",savedoc)
              // const findOneAndUpdate = await
            } else {
              // const createOneCollection =
  
              console.log("from else :: ");
              const createCollection = await chatCollectionDB.create({
                chatId: chatId,
                LastMessage: data.Message,
                participant: [data.id, data.RecieverId],
                Time: data.time,
              });
              createCollection.unreadCount.user2 += 1;
              let savedoc = await createCollection.save();
              console.log("saved ::",savedoc)
            }
          } catch (error) {
            console.log("err :: ", error);
          }
      }
      console.log(chatId);
      console.log(JSON.parse(message.content.toString()));
      try {
        // const messageData = await messageDB.create({chatId:chatId,message:data.Message,sender:})
      } catch (error) {}
      channel.ack(message);
    }
  });
}

module.exports = MessageSent;
