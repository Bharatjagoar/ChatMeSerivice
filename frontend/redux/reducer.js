import { createSlice } from '@reduxjs/toolkit'
import instance from '../axios/axiosInstance'
import getSocket from '../src/socket/socket'

const socket = getSocket();
async function LoginStatus(){
    // console.log("hellow from Reducer")
    try {
        const {data} = await instance.get("/test")
        console.log(data.user,"fdafdsafdsafdsa")
        socket.user = data.user
        socket.emit("login",{userid:data.user})
        return data.data
    } catch (error) {
        console.log(error)
    }
}
const counterSlice = createSlice({
    name: 'WhatsApp',
    initialState: {
        IsLogin: await LoginStatus(),
        userId:null
    },
    reducers: {
        LoggedIn: (state, action) => {
            state.IsLogin = action.payload
        },
        Logout: (state, action) => {
            state.IsLogin = action.payload
        },
        setUserId:(state,action)=>{
            state.userId=action.payload
        }
    },
})

export const { LoggedIn , Logout, setUserId } = counterSlice.actions
export default counterSlice.reducer