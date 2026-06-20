const {getChannel } = require("../config/RabbitMQ");
const messagedb = require("../../schema/messageSchema");

const updateDeliveryStatus = async () => {
  console.log("Updating message status started ");
  const channel = await getChannel();
  await channel.assertQueue("updateDeliveryStatus", { durable: true });
  channel.consume("updateDeliveryStatus", async (msg) => {
    if (!msg) return;
    try {
      console.log("hellow");
      const { ids } = JSON.parse(msg.content.toString());
      if (!Array.isArray(ids) || ids.length == 0) {
        channel.ack(msg);
        return;
      }
      console.log(ids);
      // const message = await messagedb.updateMany({_id:{$in:ids}},{
      //     $set:{status:"delivered"}
      // })
      const message = await messagedb.updateMany({_id:{$in:ids}},
        {$set:{status:"delivered"}}
      )
      console.log("done updating Message status");
      channel.ack(msg);
    } catch (error) {
        console.log(error)
        channel.ack(msg);
    }
  });
};


module.exports = updateDeliveryStatus