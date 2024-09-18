import { createSlice } from '@reduxjs/toolkit'
import instance from '../axios/axiosInstance'
async function LoginStatus(){
    console.log("hellow from Reducer")
    
    try {
        const {data} = await instance.get("/test")
        console.log(data,"fdafdsafdsafdsa")
        return data.data
    } catch (error) {
        console.log(error)
    }
}
const counterSlice = createSlice({
    name: 'WhatsApp',
    initialState: {
        IsLogin: await LoginStatus()
    },
    reducers: {
        LoggedIn: (state, action) => {
            state.IsLogin = action.payload
        },
        Logout: (state, action) => {
            state.IsLogin = action.payload
        }
    },
})

export const { LoggedIn , Logout } = counterSlice.actions
export default counterSlice.reducer