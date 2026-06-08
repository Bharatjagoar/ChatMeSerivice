const amqplib = require("amqplib")

let connection
let channel

async function Rabbit_MQ_connection(retries = 5) {
    console.log("hello from RabbitMQ");

    try {
        connection = await amqplib.connect("amqp://127.0.0.1:5672");
        channel = await connection.createConfirmChannel();

        const Exchange = "MessageExchange";
        await channel.assertExchange(Exchange, "direct", { durable: true });

        console.log("RabbitMQ connected ✅");

        connection.on("error", (err) => {
            console.error("RabbitMQ error:", err.message);
        });

        connection.on("close", () => {
            console.warn("RabbitMQ closed, reconnecting...");
            setTimeout(() => Rabbit_MQ_connection(), 5000);
        });

    } catch (err) {
        if (retries > 0) {
            console.log(`RabbitMQ not ready, retrying in 3s... (${retries} left)`);
            await new Promise(res => setTimeout(res, 3000));
            return Rabbit_MQ_connection(retries - 1);
        }
        console.error("RabbitMQ connection failed after all retries:", err.message);
    }
}


async function getChannel(params) {
    if (!channel || !connection) await Rabbit_MQ_connection();
    return channel;
}

async function sendMessage() {
    console.log("hello from RabbitMQ send Message,")
}

module.exports = { getChannel, Rabbit_MQ_connection }