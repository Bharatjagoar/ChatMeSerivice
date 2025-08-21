const localStrategy = require("passport-local").Strategy;
const Userdb = require("../schema/userSchema")


module.exports.initailizingPassport = (passport) => {
    
    passport.use(new localStrategy(async (username, password, done) => {
        try {
            const user = await Userdb.findOne({ EmailId: username });
            console.log("fda****************************",user,username,password);
            if (!user) return done(null, false, { message: "user not found" })
            if (user.Password != password) return done(null, false, { message: "Incorrect password" })
            data = {
                id: user.id,
                username: username,
                emailid: user.EmailId
            }
            return done(null, data, { message: "User authenticated" })
        } catch (error) {
            return done(error, false)
        }
    }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Userdb.findById(id)
            done(null, user)
        } catch (error) {
            done(error, false)
        }
    })
    console.log("hello world from passport config",process.env.redisKey)
}