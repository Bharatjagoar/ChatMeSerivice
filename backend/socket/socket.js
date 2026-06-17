const redis = require("../config/redis");
const { getChannel } = require("../config/RabbitMQ");
const { json } = require("body-parser");

module.exports = async (socket, io) => {
  try {
    const userid = socket.handshake.query.user;
    console.log("userid 😅😅:: ", socket.handshake.query.user);
    console.log("query:", socket.handshake.query);
    console.log("userid:", socket.handshake.query.user);
    if (userid) {
      socket.user = userid;
      await redis.hSet(`socket:${userid}`, "socket", socket.id);
      let res2 = await redis.hGetAll(`socket:${userid}`);
      let channel = await getChannel();
      channel.assertQueue("markdeliver", { durable: true });
      channel.sendToQueue("markdeliver", Buffer.from(JSON.stringify(userid)), {
        persistent: true,
      });
    } else {
      console.log("no user ID");
    }
  } catch (error) {
    console.log("error from socket section:: \n", error);
  }

  socket.on("clickme", (data) => {
    console.log("hello world", socket.id);
    socket.emit("checkthis", { name: "bharat" });
  });
  socket.on("second", (data) => {
    console.log(data, socket.id);
  });

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
      checkSocketId.socket ? callback({ respo: checkSocketId.socket }) : null;
    } catch (error) {
      console.log("hellow this is from get socket if of reciever");
      console.log(error);
    }
  });

  socket.on("disconnect", async () => {
    const user = socket.user;
    if (!user) return;
    const current = await redis.hGet(`socket:${user}`, "socket");
    if (current === socket.id) {
      await redis.hDel(`socket:${user}`, "socket");
    }
  });

  socket.on("typing", (data) => {
    console.log(data, socket.id, "the data");
    io.to(data.userId).emit("types");
  });
};
