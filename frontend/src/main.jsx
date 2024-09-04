import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Router from './route.jsx'


createRoot(document.getElementById('root')).render(
    <Router />
)
