const express = require("express")
const UserController = require("../conttroller/usercontroller")
const Router =  express.Router()
const passport = require("passport")



Router.get("/Create",(req,res)=>{
    console.log("hello world ")

    res.status(200).send("hello wrold")
})
Router.post("/getrespo",UserController.CreateUser);
Router.post("/checkUserName",UserController.checkUserName)


Router.post("/login",passport.authenticate("local"),(req,res)=>{
    console.log("helllo wofdsafd  fda ndfsa",req.user,req.isAuthenticated())
    res.send({mes:"from helfdsa"})
})
Router.get("/test",(req,res)=>{
    console.log("from test",req.isAuthenticated())
    res.send()
})
module.exports = Router