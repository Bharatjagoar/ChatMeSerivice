import React, { useCallback, useState } from 'react';
import logo from "../../../images/logo.png";
import RegisterCss from "./Register.module.css"; // Import the CSS module
import instance from '../../../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';

function debounce(func, delay) {
    let timer;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            let context = this;
            func.apply(context, args);
        }, delay);
    };
}

const CheckTheEmail = (string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(string);
};

const Register = () => {
    const nav = useNavigate();
    const [userName, setuserName] = useState();
    const [isausername, setisausername] = useState();
    const [email, setemail] = useState();
    const [password, setpassword] = useState();
    const [cnfPassword, setcnfpassword] = useState();

    const changeusername = debounce(async (e) => {
        try {
            if (e.target.value) {
                let { data } = await instance.post("/checkUserName", {
                    userName: e.target.value
                });
                console.log(data)
                data = data?.data?.data;

                setisausername(data);
            }
        } catch (error) {
            console.log(error);
        }
        setuserName(e.target.value);
    }, 700);

    const btnclicked = async (e) => {
        if (!CheckTheEmail(email)) {
            console.log("Invalid email");
            return;
        }

        if (cnfPassword !== password) {
            console.log("Password didn't match");
            return;
        }

        if (isausername) {
            console.log("Not a valid username");
            return;
        }

        try {
            const respo = await instance.post("/getrespo", {
                UserName: userName,
                EmailId: email,
                Password: password
            });
            console.log(respo);
            nav("/login")
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={RegisterCss.mainContainer}>
            <div className={RegisterCss.logoDiv}>
                <img src={logo} className={RegisterCss.logos} alt="Logo" />
                <h1>Create an Account !</h1>
            </div>
            <div className={RegisterCss.registerationForm}>
                <input
                    type="text"
                    onChange={(e) => changeusername(e)}
                    placeholder="Username"
                    className={RegisterCss.userName}
                />
                <input
                    type="text"
                    onChange={(e) => setemail(e.target.value)}
                    placeholder="Email"
                    className={RegisterCss.userName}
                />
                <input
                    type="password"
                    onChange={(e) => setpassword(e.target.value)}
                    placeholder="Password"
                    className={RegisterCss.userName}
                />
                <input
                    type="password"
                    onChange={(e) => setcnfpassword(e.target.value)}
                    placeholder="Confirm Password"
                    className={RegisterCss.userName}
                />
                <button onClick={btnclicked} className={RegisterCss.submitButton}>Submit</button>
                <button onClick={(e)=>{nav("/message")}}>chatting</button>
            </div>
        </div>
    );
};

export default Register;
