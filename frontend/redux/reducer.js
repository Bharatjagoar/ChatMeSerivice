import { createSlice } from '@reduxjs/toolkit';
import instance from '../axios/axiosInstance';
import getSocket from '../src/socket/socket';

const socket = getSocket();

// Helper function for checking login status
async function LoginStatus() {
    try {
        const { data } = await instance.get("/test");
        console.log(data.user, "fdafdsafdsafdsa");
        socket.user = data.user;
        socket.emit("login", { userid: data.user });
        return [data.data,data.user];
    } catch (error) {
        console.log(error);
        return false; // Return a default value in case of error
    }
}

const counterSlice = createSlice({
    name: 'WhatsApp',
    initialState: {
        IsLogin: null,  // Set initial state as null or a default value
        userId: null
    },
    reducers: {
        LoggedIn: (state, action) => {
            state.IsLogin = action.payload;
        },
        Logout: (state, action) => {
            state.IsLogin = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        }
    },
});

export const { LoggedIn, Logout, setUserId } = counterSlice.actions;

export const checkLoginStatus = (setfunction) => async (dispatch) => {
    const [isLoggedIn,dat] = await LoginStatus();
    console.log(isLoggedIn,dat)
    setfunction(false)
    dispatch(LoggedIn(isLoggedIn));
    dispatch(setUserId(dat))
};

export default counterSlice.reducer;
