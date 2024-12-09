const mongo = require("mongoose");
mongo.connect(process.env.MongodbURL);

const connect = mongo.connection;
connect.on("error", function (err) {
  console.log("error connecting to database !!", err);
});
connect.once("open", function () {
  console.log(
    "successfully connected to[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] the Database !!"
  );
});

module.exports = mongo;
