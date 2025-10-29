import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import TodosApp from './apps/todos/TodosApp.jsx'

// index.js
import { HelmetProvider } from "react-helmet-async";


createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
)
