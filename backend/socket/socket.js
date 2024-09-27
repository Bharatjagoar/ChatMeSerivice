
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

    socket.on("disconnect",(data)=>{
        console.log("disconnected now",socket.id)

    })
    socket.on("hel",async(data)=>{
        console.log("from hello")
        console.log(socket)
        // const sockets = await io.fetchSockets();
        // const winodws = sockets.map(socket => socket.id);
        // console.log(winodws)
        // io.to(winodws[1]).emit("bharat",{message:"this is for you !!"})
    })
}


