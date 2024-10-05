import React from "react";
// import { socket } from "../socket/socket";


const Tester = () => {
    console.log("from tester ")
    const EmitSecond = () => {
        socket.emit("second", { id: 1 })
    }
    return <>
        <button onClick={() => { EmitSecond() }} >Testing Socket</button>
        <h1>hello world from Tester</h1>
    </>
}

export default Tester;