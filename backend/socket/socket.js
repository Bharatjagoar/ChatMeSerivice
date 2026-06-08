const redis = require("../config/redis");
const { getChannel } = require("../config/RabbitMQ");
const { json } = require("body-parser");

module.exports = async (socket, io) => {
  socket.on("clickme", (data) => {
    console.log("hello world", socket.id);
    socket.emit("checkthis", { name: "bharat" });
  });
  socket.on("second", (data) => {
    console.log(data, socket.id);
  });
  socket.on("newMessage", (data) => {
    console.log(data);
    socket.broadcast.emit("setNewMessaging", data.mesageString);
  });

  // socket.on("disconnect",async (data)=>{
  //     console.log("disconnected now",socket.id)
  //     try {
  //         const res = await redis.del(`socket:${userId}`);
  //         console.log(res);
  //     } catch (error) {
  //         console.log("error from redis scoket storage part ",error);
  //     }
  // })

  socket.on("custome_disconnect", (data) => {
    console.log("Logout write the logic here ");
  });
  socket.on("hel", async (data) => {
    console.log("from hello");
    console.log(socket);
    // const sockets = await io.fetchSockets();
    // const winodws = sockets.map(socket => socket.id);
    // console.log(winodws)
    // io.to(winodws[1]).emit("bharat",{message:"this is for you !!"})
  });
  socket.on("login", async (data) => {
    console.log("datafrom socket login", data.userid);
    let userId = data.userid;

    console.log(userId, "this is userId");
    if (userId) {
      try {
        socket.user = userId;
        const res = await redis.hSet(`socket:${userId}`, "socket", socket.id);
        let res2 = await redis.hGetAll(`socket:${userId}`);
        let channel = await getChannel();
        channel.assertQueue("markdeliver", { durable: true });
        channel.sendToQueue(
          "markdeliver",
          Buffer.from(JSON.stringify(userId)),
          { persistent: true },
        );
      } catch (error) {
        console.log("error from redis scoket storage part ", error);
      }
    }
  });
  socket.on("getthesocketID-forMessage", async (data, callback) => {
    console.log("the data we are getting  :: ", data);

    try {
      let channel = await getChannel();
      const userid = data.userid;
      let time = new Date();
      const getSocketID = await redis.hGet(`socket:${userid}`, "socket");

      data.time = time;
      let message = data;
      message.status = "sent";
      if (getSocketID) {
        const response = await io
          .timeout(5000)
          .to(getSocketID)
          .emitWithAck("MessageRecieved", { data });
        console.log("ack raw:", JSON.stringify(response));
        if (response?.[0]?.received) message.status = "delivered";
      }
      channel.sendToQueue(
        "messageSent",
        Buffer.from(JSON.stringify(message)),
        {},
        (err, ok) => {
          console.log("CONFIRM CALLBACK CALLED");
          if (err) {
            console.log("RabbitMQ rejected message", err);
            callback({ time, status: "error" });
          } else {
            console.log("RabbitMQ confirmed message");
            callback({ time, status: message.status });
          }
        },
      );
    } catch (error) {
      console.log("error while getting recievers socket ID :-\n", error);
      callback({ status: "error" }); // <-- so the sender doesn't hang
    }
  });

  socket.on("get_the_Reaceiver_id", async (data, callback) => {
    console.log("hello from get reciever id", data);
    try {
      const checkSocketId = await redis.hGetAll(`socket:${data}`);
      console.log(checkSocketId.socket, "response from redis socket");
      if (checkSocketId.socket) {
        io.to(checkSocketId.socket).emit("hellofromUser", { mes: socket.id });
      }
      console.log(checkSocketId, "thee socket");
      checkSocketId.socket ? callback({ respo: checkSocketId.socket }) : null;
    } catch (error) {
      console.log("hellow this is from get socket if of reciever");
      console.log(error);
    }
  });

  socket.on("message_to", async (data) => {
    let date = new Date();
    console.log(date, "thi sis");
    console.log(socket.user, data, "this is the output of socket user here ");
    let channel = await getChannel();
    data.time = date;
    let message = data;
    message.RecieverId = socket.user;
    console.log(socket.user);
    // await channel.publish("MessageExchange","Sendmessage",Buffer.from(JSON.stringify(message)))
    console.log(message);
    channel.sendToQueue("messageSent", Buffer.from(JSON.stringify(message)));
    let ids = data.RecieversocketId;
    io.to(ids).emit("MessageRecieved", { data });
  });
  socket.on("disconnect", async () => {
    console.log("disconnected ! ");
    try {
      const user = socket.user; // Ensure this has the correct value
      console.log(`Trying to delete socket for user: ${user}`);
      const deleting = await redis.hDel(`socket:${user}`, "socket");
      console.log(
        deleting ? "Field deleted successfully" : "Field deletion failed",
        deleting,
      );
    } catch (error) {
      console.log("Error in deleting the socket field:", error);
    }
  });

  socket.on("typing", (data) => {
    console.log(data, socket.id, "the data");
    io.to(data.userId).emit("types");
  });
};
