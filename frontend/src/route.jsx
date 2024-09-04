import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App.jsx'; // Import the App component
import Tester from "./component/instance.jsx";
import Message from "./component/message/mesage.jsx";
const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Tester" element={<Tester/>}/>
          <Route path="/message" element={<Message/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;