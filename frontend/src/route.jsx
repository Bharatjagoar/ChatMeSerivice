import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from './App.jsx'; // Import the App component
import Tester from "./component/instance.jsx";
import Message from "./component/message/mesage.jsx";
import Register from "./component/Register/Register.jsx";
const Router = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to={"/Register"}></Navigate>} />
                    <Route path="/Tester" element={<Tester />} />
                    <Route path="/message" element={<Message />} />
                    <Route path="/Register" element={<Register/>}/>
                    <Route path="*" element={<h1>path not found</h1>}/>
        </Routes>
            </BrowserRouter>
        </>
    );
};

export default Router;