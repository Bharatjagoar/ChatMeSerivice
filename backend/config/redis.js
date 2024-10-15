const redis = require("redis")
const client = redis.createClient({
    url:process.env.redisURL,
    socket: {
        tls: true,
        // rejectUnauthorized: false, // Use with caution; set to true in production
    }
})



client.on("connect", () => {
    console.log("Connecting to Upstash Redis...");
});

client.on("ready", () => {
    console.log("Connected to Upstash Redis");
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