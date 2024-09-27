// socket.js
import { io } from "socket.io-client";
console.log("from socket");

const socket = io("http://localhost:5000/", {
    autoConnect: false,
    reconnection: true,          // Auto-reconnect on failure
    reconnectionAttempts: 10,     // Try 10 times before giving up
    reconnectionDelay: 500,       // Wait 500ms before first reconnection attempt
    reconnectionDelayMax: 2000,   // Max delay between reconnections
});

// Example: Define a custom event handler
socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
    socket.auth="bharat jagoar"
});

socket.on("reconnect_attempt", (attempt) => {
    console.log(`Attempting to reconnect: ${attempt}`);
});

// Handle reconnection success
socket.on("reconnect", (attemptNumber) => {
    console.log(`Reconnected after ${attemptNumber} attempts`);
});

// Handle reconnection error/failure
socket.on("reconnect_error", (error) => {
    console.log("Reconnection failed:", error);
});
socket.on("message", (data) => {
    console.log("Message from server:", data);
});

// You can define more events and emitters here
const sendMessage = (msg) => {
    socket.emit("message", msg);
};

export { socket};
