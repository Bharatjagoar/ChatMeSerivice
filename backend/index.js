require("dotenv").config()
const express = require("express");
const app = express();
const http = require("http");
// const bodyParser = require("body-parser");
const socketio = require("socket.io");
const bodyParser = require("body-parser")
const expressSession = require("express-session")
const MongoStore = require('connect-mongo');
const cors = require('cors');
const port = process.env.PORT || 5000;
const path = require("path")
const passport = require("passport")
const passportConfig = require("./config/passportConfig")
const mongodb = require("./config/mongoose")
const createQueue = require("./Services/Messaages")
const {Rabbit_MQ_connection} = require("./config/RabbitMQ")

// console.log(process.env.keys)


app.use(cors({
    origin: "http://localhost:3000",  // Replace with your frontend's origin
    methods: ["GET", "POST"],  // Allow specific HTTP methods
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.) to be sent
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(expressSession({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.MongodbURL,
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true,
        secure: false,  // true in production with HTTPS
        maxAge: 1000 * 24 * 60 * 60 // 24 hours
    }
}));
passportConfig.initailizingPassport(passport)
app.use(passport.initialize())
app.use(passport.session())

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
    require("./socket/socket")(socket,io)
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
app.use("/", require("./Route/index"))
// Start the server
server.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    // await createQueue();
    await Rabbit_MQ_connection();
});

// Export the io instance to use in other modules
module.exports = io;