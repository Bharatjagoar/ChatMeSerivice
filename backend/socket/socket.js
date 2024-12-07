const redis = require("../config/redis")
const {getChannel} = require("../config/RabbitMQ")

module.exports = async (socket, io) => {
    socket.on("clickme", (data) => {
        console.log("hello world", socket.id)
        socket.emit("checkthis", { name: "bharat" })
    })
    socket.on("second", (data) => {
        console.log(data, socket.id)
    })
    socket.on("newMessage", (data) => {
        console.log(data)
        socket.broadcast.emit("setNewMessaging", data.mesageString)
    })

    // socket.on("disconnect",async (data)=>{
    //     console.log("disconnected now",socket.id)
    //     try {
    //         const res = await redis.del(`socekt:${userId}`);
    //         console.log(res);
    //     } catch (error) {
    //         console.log("error from redis scoket storage part ",error);
    //     }
    // })

    socket.on("custome_disconnect", (data) => {
        console.log("Logout write the logic here ")

    })
    socket.on("hel", async (data) => {
        console.log("from hello")
        console.log(socket)
        // const sockets = await io.fetchSockets();
        // const winodws = sockets.map(socket => socket.id);
        // console.log(winodws)
        // io.to(winodws[1]).emit("bharat",{message:"this is for you !!"})
    })
    socket.on("login", async (data) => {
        console.log("datafrom socket login", data.userid)
        let userId = data.userid

        // console.log
        if (userId) {
            try {
                socket.user = userId
                const res = await redis.hSet(`socekt:${userId}`, "socket", socket.id);
                console.log(res, "from socket res this is the data from socket");
                let res2 = await redis.hGetAll(`socekt:${userId}`)
                console.log(res2.socket, "666656565656565656565656565")
            } catch (error) {
                console.log("error from redis scoket storage part ", error);
            }
        }

    })
    socket.on("getthesocketID-forMessage",async (data,callback)=>{
        console.log(data)
        try {
            const userid = data.userid
            const getSocketID = await redis.hGet(`socekt:${userid}`,"socket")
            console.log(getSocketID,"lllllllllllllllllllllllllllllll")
            if (getSocketID){
                callback(getSocketID)
            }else{
                callback(null)
            }
        } catch (error) {
            console.log("erororororor",error)
        }
    })



    socket.on("get_the_Reaceiver_id", async (data, callback) => {
        console.log("hello from get reciever id", data)
        try {
            const checkSocketId = await redis.hGetAll(`socekt:${data}`)
            console.log(checkSocketId.socket)
            if (checkSocketId.socket) {
                io.to(checkSocketId.socket).emit("hellofromUser", { mes: socket.id })

            }
            console.log(checkSocketId, "thee socekt")
            checkSocketId.socket ? callback({ respo: checkSocketId.socket }) : null
        } catch (error) {
            console.log("hellow this is from get socket if of reciever")
            console.log(error)
        }
    })

    socket.on("message_to", async (data) => {
        let date  = new Date()
        console.log(date, "thi sis")
        console.log(socket.user,data, "this is the output of socket user here ")
        let channel= await getChannel();
        data.time = date
        let message=data;
        message.RecieverId = socket.user
        await channel.publish("MessageExchange","Sendmessage",Buffer.from(JSON.stringify(message)))
        
        let ids = data.RecieversocketId
        io.to(ids).emit("MessageRecieved", { data })
    })
    socket.on("disconnect", async () => {
        
        try {
            const user = socket.user; // Ensure this has the correct value
            console.log(`Trying to delete socket for user: ${user}`);
            const deleting = await redis.hDel(`socekt:${user}`, "socket");
            console.log(deleting ? 'Field deleted successfully' : 'Field deletion failed', deleting);

        } catch (error) {
            console.log("Error in deleting the socket field:", error);
        }
    });

    socket.on("typing",(data)=>{
        console.log(data,socket.id,"the data")
        io.to(data.userId).emit("types")
    })

}


