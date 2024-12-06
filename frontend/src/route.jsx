import React, { useEffect, useState } from "react";
import getSocket from "./socket/socket.js";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from './App.jsx'; // Import the App component
import Tester from "./component/instance.jsx";
// import Message from "./component/message/mesage.jsx";
import Register from "./component/Register/Register.jsx";
import Login from "./component/login/login.jsx";
import Home from "./component/Home/Home.jsx";
import Message from "./component/message/mesage.jsx";
import { checkLoginStatus } from "../redux/reducer.js";
// import { useDispatch } from "react-redux";
import { useDispatch, useSelector } from "react-redux"
// import LoadingPage from "./loadingComponent.jsx";


const Router = () => {
    const dispatch = useDispatch()
    const socket = getSocket();
    const [isloading,setisloading] = useState(true);

    useEffect(() => {
        dispatch(checkLoginStatus(setisloading))
        console.log("from the Router component")
        socket.on("bharat", (data) => {
            console.log(data)
        })
        return ()=>{
            console.log("from unmount")
        }
    }, [])

    const isLogin = useSelector((state) => {
        console.log(state)
        return state.WhatsApp.IsLogin
    }
    )
    if(isloading){
        return <>
            <h1>loading ..!!</h1>
        </>
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to={"/register"} />} />
                    <Route path="/Tester" element={<Tester />} />
                    <Route path="/message" element={isLogin ? <Message/> : <Navigate to={"/login"} />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="*" element={<h1>path not found</h1>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/Chatting" element={isLogin ? <h1>from chatting screen </h1> : <Navigate to={"/login"} />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default Router;