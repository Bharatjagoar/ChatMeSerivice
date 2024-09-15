import React, { useState } from 'react'
import instance from "../../../axios/axiosInstance"

const Login = () => {
    const [username,setusername] = useState();
    const [password,setpassword] = useState();
    const btnclicked = async ()=>{
        console.log("clicked")
        try {
            const respo = await instance.post("/login",{username:username,password:password})
            console.log(respo,"respo")
        } catch (error) {
            console.log(error,"errr")
        }
    }

    const btnclicked2 = async ()=>{
        console.log("clicked22222222222222")
        try {
            const respo = await instance.get("/test")
            console.log(respo,"respo")
        } catch (error) {
            console.log(error,"errr")
        }
    }


    return <div>
        <h1>Login</h1>
        <input type="text" placeholder='username' onChange={(e)=>{setusername(e.target.value)}}/>
        <input type="text" placeholder='password' onChange={(e)=>{setpassword(e.target.value)}}/>
        <button onClick={()=>{btnclicked()}}>submit</button>
        <button onClick={()=>{btnclicked2()}}>submitthis that </button>
    </div>
}

export default Login;
