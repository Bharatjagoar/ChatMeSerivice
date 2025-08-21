const amqplib = require("amqplib")

let connection
let channel

async function Rabbit_MQ_connection() {
    console.log("hello from RabbitMQ")
    connection = await amqplib.connect("amqp://127.0.0.1:5672");
    channel = await connection.createChannel();
    const Exchange = "MessageExchange";
    const routingKey = "Sendmessage";
    await channel.assertExchange(Exchange, "direct", { durable: false })
    
    // storing new message to database
    await channel.assertQueue("message",{durable:false});
    await channel.bindQueue("message",Exchange,routingKey)
    
    
}


async function getChannel(params) {
    if (!channel || !connection) await Rabbit_MQ_connection();
    return channel;
}

async function sendMessage() {
    console.log("hello from RabbitMQ send Message,")
}

module.exports = { getChannel, Rabbit_MQ_connection }