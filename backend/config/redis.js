const redis = require("redis")
const client = redis.createClient({
    url:process.env.redisURL,
    socket: {
        tls: false,
        // rejectUnauthorized: false, // Use with caution; set to true in production
    }
})



client.on("connect", () => {
    console.log("Connecting to Redis...");
});

client.on("ready", () => {
    console.log("Connected to Redis");
});

client.on("error", (error) => {
    console.error("Error connecting to Redis:", error);
});

// Connect to Redis
client.connect()
    .catch((error) => {
        console.error("Redis connection error:", error);
    });

module.exports = client;