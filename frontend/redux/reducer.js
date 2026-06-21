import { createSlice } from "@reduxjs/toolkit";
import instance from "../axios/axiosInstance";
import getSocket from "../src/socket/socket";

// Helper function for checking login status
async function LoginStatus() {
  try {
    const { data } = await instance.get("/me");
    const socket = getSocket();
    if (!socket.connected) {
      socket.io.opts.query = { user: data.userId };
      socket.connect();
    }
    return [true, data.userId, data.UserName];
  } catch (error) {
    return [false, null, null];
  }
}

const counterSlice = createSlice({
  name: "WhatsApp",
  initialState: {
    IsLogin: null,
    userId: null,
    userName: null,
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
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
  },
});

export const { LoggedIn, Logout, setUserId ,setUserName} = counterSlice.actions;

export const checkLoginStatus = (setfunction) => async (dispatch) => {
  const [isLoggedIn, userId, userName] = await LoginStatus();
  setfunction(false);
  dispatch(LoggedIn(isLoggedIn));
  dispatch(setUserId(userId));
  dispatch(setUserName(userName));
};


export default counterSlice.reducer;
