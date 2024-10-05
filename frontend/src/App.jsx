import { useEffect, useState } from 'react';
// import { socket } from './socket/socket';
import {useNavigate} from "react-router-dom"
// import { socket } from './socket/socket';

function App() {
    const [status, setStatus] = useState("Not connected");
    const nav = useNavigate()
    useEffect(() => {
        // Listen for the connected event from the server
        socket.on("connected", (message) => {
            console.log(message);
            setStatus("Connected to the server!");
        });
        socket.on("checkthis",(data)=>{
            console.log("hello world",data)
        })
        // Cleanup event listener on unmount
        
    }, []);
    const btnclicked=()=>{
        socket.emit("clickme",{helo:"bharat"})
        console.log("hello wrod")
    }


    return (
        <>
            <h1>Socket.IO React App</h1>
            <p>Status: {status}</p>
            <button onClick={()=>{btnclicked()}}>heloow</button>
            <button onClick={()=>{nav("/message")}}>message</button>
        </>
    );
}

export default App;
