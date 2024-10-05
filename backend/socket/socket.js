const redis = require("../config/redis")

module.exports = async (socket,io) => {
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

    socket.on("custome_disconnect",(data)=>{
        console.log("Logout write the logic here ")
                
    })
    socket.on("hel",async(data)=>{
        console.log("from hello")
        console.log(socket)
        // const sockets = await io.fetchSockets();
        // const winodws = sockets.map(socket => socket.id);
        // console.log(winodws)
        // io.to(winodws[1]).emit("bharat",{message:"this is for you !!"})
    })
    socket.on("login", async (data)=>{
        console.log("datafrom socket login", socket.id)
        let userId = data.userid

        // console.log
        if(userId){
            try {
                const res = await redis.hSet(`socekt:${userId}`,"socket",socket.id);
                console.log(res,"from socket res this is the data from socket");
                let res2 = await redis.hGetAll(`socekt:${userId}`)
                console.log(res2.socket)
            } catch (error) {
                console.log("error from redis scoket storage part ",error);
            }
        }
        
    })
    socket.on("get_the_Reaceiver_id", async (data,callback)=>{
        console.log("hello from get reciever id",data)
        try {
            const checkSocketId = await redis.hGetAll(`socekt:${data}`)
            console.log(checkSocketId.socket)
            if(checkSocketId.socket){
                io.to(checkSocketId.socket).emit("hellofromUser",{mes:socket.id})

            }
            checkSocketId.socket?callback({respo:checkSocketId.socket}):null
        } catch (error) {
            console.log("hellow this is from get socket if of reciever")
            console.log(error)
        }
    })
}


