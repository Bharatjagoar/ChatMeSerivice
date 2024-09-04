// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000/");

// Example: Define a custom event handler
socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
    socket.auth="bharat jagoar"
});

socket.on("message", (data) => {
    console.log("Message from server:", data);
});

// You can define more events and emitters here
const sendMessage = (msg) => {
    socket.emit("message", msg);
};

export { socket};
