
module.exports = (socket) => {
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
}


