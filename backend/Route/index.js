const express = require("express")
const UserController = require("../conttroller/usercontroller")
// const MessageController = require("../conttroller/messagesController")
const Router = express.Router()
const passport = require("passport")
const messagesController = require("../conttroller/messagesController")



Router.get("/Create", (req, res) => {
    console.log("hello world ")
    res.status(200).send("hello wrold")
})
Router.post("/createUser", UserController.CreateUser);
Router.post("/checkUserName", UserController.checkUserName)
Router.post("/SearchString",UserController.Searchstring)
Router.get("/LoadConversation/:id",messagesController.Readmessage)
Router.get("/getMessages/:ChatId",messagesController.ReadConvo)

Router.post("/login", passport.authenticate("local"), (req, res) => {
    console.log("request ::  ",req.body);
    console.log("helllo wofdsafd  fda ndfsa", req.user, req.isAuthenticated())
    res.status(200).send({ mes: req.user.id })
})


Router.get("/test", (req, res) => {
    // console.log("from test", req.isAuthenticated(),req.user)
    
    res.status(200).send({message:"successful",data:req.isAuthenticated(),user:req?.user?.id})
})
Router.post("/logout", (req, res) => {
    console.log("from logout")
    req.logOut((erro) => {
        if (erro) return res.status(400).send({ message: "Logged out failed", data: false })
        res.status(200).send({message:"successfully logged out",data:false})
    })
})
module.exports = Router