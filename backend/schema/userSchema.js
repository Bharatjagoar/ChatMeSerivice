const mongoose = require("mongoose")

const UserSchema =new mongoose.Schema({
    UserName:{
        type:String,
        required:true
    },
    EmailId:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
},{timestamp:true})

const UserModel = mongoose.model("User",UserSchema);
module.exports = UserModel;