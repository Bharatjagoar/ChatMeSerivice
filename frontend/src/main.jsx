import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Router from './route.jsx'
import {Provider} from "react-redux"
import store from '../redux/store.js'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <Router />
    </Provider>
)
