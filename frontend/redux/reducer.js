import { createSlice } from "@reduxjs/toolkit";
import instance from "../axios/axiosInstance";
import getSocket from "../src/socket/socket";

// Helper function for checking login status
async function LoginStatus() {
  try {
    const { data } = await instance.get("/me"); // JWT-based, reliable
    const socket = getSocket();

    if (!socket.connected) {
      socket.io.opts.query = { user: data.userId };
      socket.connect();
    }

    return [true, data.userId];
  } catch (error) {
    return [false, null];
  }
}

const counterSlice = createSlice({
  name: "WhatsApp",
  initialState: {
    IsLogin: null, // Set initial state as null or a default value
    userId: null,
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
  },
});

export const { LoggedIn, Logout, setUserId } = counterSlice.actions;

export const checkLoginStatus = (setfunction) => async (dispatch) => {
  const [isLoggedIn, dat] = await LoginStatus();
  console.log(isLoggedIn, dat);
  setfunction(false);
  dispatch(LoggedIn(isLoggedIn));
  dispatch(setUserId(dat));
};

export default counterSlice.reducer;
