const getchannel = require("../config/RabbitMQ");


const MarkDelivery = async ()=>{
    console.log("Marking deliveries");
    const channel = await getchannel.getchannel();
    channel.assertQueue("markdeliver",{ durable: true });
    channel.consume("markdeliver",async (message)=>{
        if(!message) return;
        let data;
        try {
            data = JSON.parse(message.content.toString());
            console.log("message :-> ",data);
            channel.ack(message);
        } catch (error) {
            console.log("error in marking delivery :- " , error);
            channel.nack()
        }
    })
}

module.exports = MarkDelivery;