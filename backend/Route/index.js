const express = require("express")
const UserController = require("../conttroller/usercontroller")
const Router =  express.Router()


Router.get("/Create",(req,res)=>{
    console.log("hello world ")

    res.status(200).send("hello wrold")
})
Router.post("/getrespo",UserController.CreateUser);
Router.post("/checkUserName",UserController.checkUserName)

module.exports = Router