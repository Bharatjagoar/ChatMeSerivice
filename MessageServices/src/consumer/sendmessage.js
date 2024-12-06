const { getchannel } = require("../config/RabbitMQ")
const messageDB = require("../schema/messageSchema");

async function MessageSent() {
    const channel = await getchannel();
    await channel.assertQueue("messageSent", { durable: false });
    channel.consume("message", (message) => {
        console.log("inside the message from consumer!!!!!! !")
        if (message != null) {
            let data = JSON.parse(message.content.toString())
            let chatId = [data.RecieverId,data.id].sort().join("_")
            console.log(arr);
            console.log(JSON.parse(message.content.toString()));
            try {
                const messageData = await messageDB.create({chatId:chatId,message:data.Message,sender:})
            } catch (error) {
                
            }
            channel.ack(message);
        }
    })
}


module.exports= MessageSent;