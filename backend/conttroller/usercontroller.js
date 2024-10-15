const UserDB = require("../schema/userSchema")


module.exports.CreateUser = async (req,res) =>{
    console.log("from controller of create user",req.body)
    const {UserName} = req.body
    try {
        const founduser = await UserDB.findOne({UserName:UserName})
        if(founduser){
            return res.status(200).send({message:"successfull",data:"found the user already"})
        }
        const createdUser = await UserDB.create(req.body)
        console.log(createdUser,"from created user")
        res.status(200).send({message:"successful",data:createdUser})
    } catch (error) {
        console.log("error from created user",error)
        res.status(400).send({message:"unsuccessful",data:null})
    }
}

module.exports.checkUserName = async (req,res)=>{
    try {
        const {userName} = req.body
        const userFound = await UserDB.findOne({UserName:userName})
        console.log(userFound,"if user found or not")
        userFound
        ?res.status(200).send({message:"succesfull",data:0})
        :res.status(200).send({message:"succesfull",data:1})
    } catch (error) {
        console.log(error)
        res.status(400).send({message:"Failed",data:error})
    }
    // res.status(200).send({message:"succesfull",data:null})
}

module.exports.login=(req,res)=>{
    console.log("hello world")
    res.send()
}

module.exports.Searchstring = async(req,res)=>{
    
    console.log("hello world",req.body.search)
    try {
        const data = await UserDB.find({UserName:{$regex:req.body.search}})
        // console.log("this is res:::",data)
        if(data[0]){
            res.send({message:"successfull",data})
        }else{
            res.send({message:"successfull",data:null})
        }
        
    } catch (error) {
        console.log(error)
    }
    
}