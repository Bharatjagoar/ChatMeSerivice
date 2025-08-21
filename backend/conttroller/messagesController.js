const { json } = require("body-parser");
const { getChannel } = require("../config/RabbitMQ");
const { v4: uuidv4 } = require("uuid");
const Userdb = require("../schema/userSchema");

module.exports.Readmessage = async (req, res) => {
  const channel = await getChannel();
  const correlationId = uuidv4();
  console.log(req.params, "hare krishna !!❤️❤️❤️❤️");
  await channel.assertQueue("ReadConvos", { durable: false });
  await channel.assertQueue("ResponseReadConvos", { durable: false });
  let reply = "ResponseReadConvos";
  let message = { id: req.params.id };
  channel.sendToQueue("ReadConvos", Buffer.from(JSON.stringify(message)), {
    correlationId,
    replyTo: reply,
  });

  let consumerTag = await channel.consume(reply, async (Message) => {
    // console.log("dsa", Message.properties.correlationId, correlationId);
    let count = 0;
    if (Message.properties.correlationId == correlationId) {
      const messageContent = JSON.parse(Message.content.toString());
      let resarr = [];
      for (let element of messageContent.resultArr) {
        // console.log(messageContent.resultArr[0], "thfdskalkl");
        let participant;
        if (req.params.id == element.participant[0]) {
          // console.log("yes", req.params.id);
          participant = await Userdb.findById(element.participant[1]);
          messageContent.resultArr[count].participant = participant;
          console.log(count, participant);
          resarr.push(messageContent.resultArr[count]);
          // console.log(messageContent.resultArr);
        } else {
          participant = await Userdb.findById(element.participant[0]);

          messageContent.resultArr[count].participant = participant;
          console.log(count, participant);
          resarr.push(messageContent.resultArr[count]);
          // console.log("No", req.params.id, element.participant[0]);
        }
        count++;
      }
      console.log("this ifdsamkfdsankfdsmallfdmsalfdsa,lfds,al", resarr);
      res.send(resarr);
      channel.ack(Message);
      await channel.cancel(consumerTag.consumerTag);
    } else {
      console.log("Nothing to send !!");
      channel.ack(Message);
    }
  });
};

module.exports.ReadConvo = async (req, res) => {
  console.log("fromfad conrolldsafdsafdsafdaf");
  const channel = await getChannel();
  const correlationId = uuidv4();
  let { ChatId } = req.params;
  await channel.assertQueue("ReadfromDBMessages", { durable: false });
  await channel.assertQueue("SendChatId", { durable: false });
  // console.log({ChatId:ChatId});
  let obj={id:ChatId}
  let replyQueue = "ReadfromDBMessages";
  channel.sendToQueue("SendChatId", Buffer.from(JSON.stringify(obj)), {
    correlationId: correlationId,
    replyTo: replyQueue
  });
  const consumerTag = await channel.consume(replyQueue, async (Message) => {
    console.log("replyto of sent chat id", Message.properties.correlationId,correlationId);
    if (Message.properties.correlationId == correlationId) {
      const messageContent = JSON.parse(Message.content.toString());
      console.log("message :: ", messageContent);
      res.send(messageContent);
      channel.ack(Message);
      await channel.cancel(consumerTag.consumerTag);
    }
  });
  // res.send("hellow  world");
  
};
