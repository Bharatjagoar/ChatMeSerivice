import React ,{useEffect}from "react";
import { socket } from "./socket/socket.js";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from './App.jsx'; // Import the App component
import Tester from "./component/instance.jsx";
// import Message from "./component/message/mesage.jsx";
import Register from "./component/Register/Register.jsx";
import Login from "./component/login/login.jsx";
import Home from "./component/Home/Home.jsx";
import Message from "./component/message/mesage.jsx";
import { useDispatch, useSelector } from "react-redux"


const Router = () => {
    useEffect(()=>{
        socket.on("bharat",(data)=>{
            console.log(data)
        })
    },[])
    const isLogin = useSelector((state)=>{
        console.log(state)
        return state.WhatsApp.IsLogin}
    )

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to={"/register"}/>} />
                    <Route path="/Tester" element={<Tester />} />
                    <Route path="/message" element={<Message />} />
                    <Route path="/Register" element={<Register/>}/>
                    <Route path="*" element={<h1>path not found</h1>}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/Chatting" element = {isLogin?<h1>from chatting screen </h1>:<Navigate to={"/register"}/>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default Router;