const redis = require("redis")
const client = redis.createClient({
    url:"redis://localhost:6379",
})


client.connect()
.then(()=>{
    console.log("connected Redis")
})
.catch((error)=>{
    console.log("error in connecting to redis",error)
})


module.exports = client