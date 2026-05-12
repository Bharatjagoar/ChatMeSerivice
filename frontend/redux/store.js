import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './reducer'
import chatslice from "./chatslice"

const store = configureStore({
  reducer: {
    WhatsApp: counterReducer,
    chat: chatslice
  },
})

export default store;