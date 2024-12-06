const amqp = require("amqplib")

let channel

async function createQueue() {
    console.log("this is creating queue ");
    const Exchange = "MesssagService";
    const routingKey = "SentMessage";
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertExchange(Exchange, "direct", { durable: false });
    await channel.assertQueue("messageSent", { durable: false });
    await channel.bindQueue("messageSent", Exchange, routingKey);
    const message = {
        name:"AAAAAAAAAAAAAAAAAAAAAAAAAAA",
        surname:"jagoar"
    }
    

    await channel.publish(Exchange,routingKey,Buffer.from(JSON.stringify(message)))

}


module.exports = createQueue