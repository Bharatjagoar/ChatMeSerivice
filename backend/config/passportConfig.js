const localStrategy = require("passport-local").Strategy;
const Userdb = require("../schema/userSchema")


module.exports.initailizingPassport = (passport) => {
    
    passport.use(new localStrategy(async (username, password, done) => {
        console.log(username,password)
        try {
            const user = await Userdb.findOne({ EmailId: username });
            if (!user) {
                console.log("not found");
                return done(null, false, { message: "user not found" })}
            if (user.Password != password) {
                console.log("password didnt match");
                return done(null, false, { message: "Incorrect password" })}
            data = {
                id: user.id,
                username: username,
                emailid: user.EmailId
            }
            return done(null, data, { message: "User authenticated" })
        } catch (error) {
            console.log(error);
            return done(error, false)
        }
    }))
    
    console.log("hello world from passport config",process.env.redisKey)
}