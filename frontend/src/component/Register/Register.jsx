import React, { useCallback, useState } from 'react'
import logo from "./logo.png"
import RegisterCss from "./Register.module.css"
import instance from '../../../axios/axiosInstance'
// import { use } from '../../../../backend/Route';


function debounce(func, delay) {
    let timer;
    return function (...args) {
        if (timer) clearTimeout(timer)
        console.log("this is the timer::", timer)
        timer = setTimeout(() => {
            let context = this
            // console.log("hello world",e)
            func.apply(context, args)
        }, delay)
    }
}


const CheckTheEmail = (string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const res = emailPattern.test(string)
    console.log(res)
    return res
}


const Register = () => {
    const [userName, setuserName] = useState();
    const [isausername, setisausername] = useState();
    const [email, setemail] = useState();
    const [password,setpassword] = useState();
    const [cnfPassword, setcnfpassword] = useState();
    // const 
    const changeusername = debounce(async (e) => {
        try {
            if (e.target.value) {
                let { data } = await instance.post("/checkUserName", {
                    userName: e.target.value
                })
                data = { data }
                data = data?.data?.data
                setisausername(data)
                console.log(data)
            }

        } catch (error) {
            console.log(error)
        }
        setuserName(e.target.value)
    }, 700)
    const btnclicked = async (e) => {
        console.log("windo")
        if(!CheckTheEmail(email)){
            console.log("invalid email");
            return
        }
        
        if(!(cnfPassword==password)){
            console.log("password didnt match")
            return
        }
        if(!isausername){
            console.log("not a valid username")
            return
        }
        if(!CheckTheEmail(email)){
            console.log("invalid email");
            return
        }
        try {
            const respo = await instance.post("/getrespo",{
                UserName:userName,
                EmailId:email,
                Password:password
            })
            console.log(respo)
        } catch (error) {
            console.log(error)
        }
    }

    // const CheckTheEmail=(e)=>{
    //     setemail(e.target.value)
    // }
    return (
        <>
            <div>hello world</div>
            <div className={RegisterCss.mainContainer}>
                <div className={RegisterCss.logoDiv}>
                    <img src={logo} className={RegisterCss.logos} alt='lofdsafdsafdsago' />
                </div>
                <div className={RegisterCss.registerationForm}>
                    <input type="text" onChange={(e) => { changeusername(e, 600) }} placeholder='UserName' className={RegisterCss.userName} />
                    <input type="text" placeholder='Email'onChange={(e)=>{setemail(e.target.value)}} className={RegisterCss.userName} />
                    <input type="password" onChange={(e) => { setpassword(e.target.value) }} placeholder='password' className={RegisterCss.userName} />
                    <input type="password" onChange={(e) => { setcnfpassword(e.target.value) }} placeholder='confirm password' className={RegisterCss.userName} />
                    <button onClick={() => { btnclicked() }}>submit</button>
                </div>
            </div>
        </>

    )
}

export default Register