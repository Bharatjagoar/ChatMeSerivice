const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const socketio = require("socket.io");
const cors = require('cors');
const port = process.env.PORT || 5000;
const path = require("path")





app.use(cors({
    origin: "*", // Allow only your frontend origin
    methods: ["GET", "POST"], // Allow specific HTTP methods
    credentials: false, // Allow credentials such as cookies to be sent
}));
app.use(bodyParser.urlencoded({ extended: true }));

// Create the HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

// Define a route to test the server
// app.get("/", (req, res) => {
//     console.log("Hello");
//     res.status(200).send();
// });

// const authusers = io.fe
// Socket.IO connection handler
io.on("connection", (socket) => {

    console.log("Socket connection established", socket.id);
    // console.log(socket.handshake)
    // console.log("Socket connection established",socket.id);
    // Emit a confirmation message to the client
    require("./socket/socket")(socket)
    // socket.on("clickme",()=>{
    //     console.log("hedsafdfadaf")
    // })
});


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}
// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Export the io instance to use in other modules
module.exports = io;
