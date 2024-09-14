
const mongo = require("mongoose");
mongo.connect('mongodb://0.0.0.0:27017/WhatsApp');
  
const connect = mongo.connection
connect.on("error",function(err){console.log("error connecting to database !!",err)})
connect.once("open",function(){
    console.log("successfully connected to the Database !!")
})
// hellow orldsa


module.exports=mongo

