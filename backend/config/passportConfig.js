const localStrategy = require("passport-local").Strategy;
const Userdb = require("../schema/userSchema")


module.exports.initailizingPassport = (passport) => {
    passport.use(new localStrategy(async (username, password, done) => {
        try {
            const user = await Userdb.findOne({ UserName: username })
            if (!user) return done(null, false, { message: "user not found" })
            if (user.Password != password) return done(null, false, { message: "Incorrect password" })
            return done(null, user, { message: "User authenticated" })
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
    console.log("hello world from passport config")
}