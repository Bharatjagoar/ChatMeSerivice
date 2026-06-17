const express = require("express");
const UserController = require("../conttroller/usercontroller");
// const MessageController = require("../conttroller/messagesController")
const Router = express.Router();
const passport = require("passport");
const messagesController = require("../conttroller/messagesController");
const redis = require("../config/redis");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const verifyJWT = require("../middleware/verifyJWT");

Router.get("/Create", (req, res) => {
  console.log("hello world ");
  res.status(200).send("hello wrold");
});
Router.post("/createUser", UserController.CreateUser);
Router.post("/checkUserName", UserController.checkUserName);
Router.post("/SearchString", UserController.Searchstring);
Router.get("/LoadConversation/:id", messagesController.Readmessage);
Router.get("/getMessages/:ChatId", messagesController.ReadConvo);

Router.get("/me", verifyJWT, (req, res) => {
  res.json({ userId: req.user.id });
});
Router.post("/login", passport.authenticate("local",{session:false}), (req, res) => {
  const token = jwt.sign(
    {
      id: req.user.id,
      email: req.user.emailid,
    },
    "secrate",
    {
      expiresIn: "7d",
    },
  );
  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production https
    })
    .status(200)
    .json({
      userId: req.user.id,
    });
});

Router.get("/test", (req, res) => {
  // console.log("from test", req.isAuthenticated(),req.user)

  res.status(200).send({
    message: "successful",
    data: req.isAuthenticated(),
    user: req?.user?.id,
  });
});
Router.post("/logout", (req, res) => {
  const userId = req.user?._id || req.user?.id; // grab before logOut clears it

  req.logOut(async (err) => {
    if (err)
      return res
        .status(400)
        .send({ message: "Logged out failed", data: false });

    try {
      if (userId) {
        await redis.del(`socket:${userId}`); // clean up redis
      }
    } catch (redisErr) {
      console.log("Redis cleanup failed:", redisErr);
    }

    res.status(200).send({ message: "successfully logged out", data: false });
  });
});
module.exports = Router;
