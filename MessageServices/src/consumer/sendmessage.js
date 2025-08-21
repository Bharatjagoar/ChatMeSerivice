const { getchannel } = require("../config/RabbitMQ");
const messageDB = require("../../schema/messageSchema");
const chatCollectionDB = require("../../schema/chatschema");

async function MessageSent() {
  console.log("from message sent ")
  const channel = await getchannel();
  await channel.assertQueue("messageSent", { durable: false });

  channel.consume("messageSent", async (message) => {
    if (!message) return;
    console.log("Yes consuming !! ",message);
    let data;
    try {
      data = JSON.parse(message.content.toString());
      console.log("📩 Received message:", data);
    } catch (err) {
      console.error("❌ Failed to parse message:", err);
      channel.nack(message, false, false); // drop bad message
      return;
    }

    try {
      const chatId = [data.RecieverId, data.id].sort().join("_");

      // Save the new message
      const savedMessage = await messageDB.create({
        chatId,
        message: data.Message,
        senderId: data.id,
        recieverID: data.RecieverId,
        time: data.time,
      });
      console.log("✅ Message saved to DB:", savedMessage);

      // Update or create chat collection
      let chatDoc = await chatCollectionDB.findOne({ chatId });

      if (chatDoc) {
        console.log("🔄 Updating chat collection:", chatId);
        if (data.RecieverId < data.id) {
          chatDoc.unreadCount.user1 += 1;
        } else {
          chatDoc.unreadCount.user2 += 1;
        }
        chatDoc.Time = data.time;
        chatDoc.LastMessage = data.Message;
        await chatDoc.save();
      } else {
        console.log("🆕 Creating new chat collection:", chatId);
        const createCollection = await chatCollectionDB.create({
          chatId,
          LastMessage: data.Message,
          participant: [data.id, data.RecieverId],
          Time: data.time,
        });
        if (data.RecieverId < data.id) {
          createCollection.unreadCount.user1 += 1;
        } else {
          createCollection.unreadCount.user2 += 1;
        }
        await createCollection.save();
      }

      channel.ack(message);
    } catch (error) {
      console.error("❌ Error in MessageSent consumer:", error);
      channel.nack(message, false, true); // requeue for retry
    }
  });
}

module.exports = MessageSent;
