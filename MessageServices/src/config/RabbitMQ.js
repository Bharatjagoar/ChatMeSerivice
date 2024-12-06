const amqplib = require("amqplib");

let channel
let connection

async function createChannel(){
    console.log("creating channel ...!! ");
    
    connection = await amqplib.connect("amqp://localhost")
    channel = await connection.createChannel();
}

async function getchannel(){
    console.log("getting channel !!");
    if(!channel || !connection) await createChannel();
    return channel
}



module.exports = {createChannel,getchannel};