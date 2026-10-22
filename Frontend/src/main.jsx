import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store.js'
import {Provider} from "react-redux"
import axios from 'axios'

// Automatically attach Bearer token to all outgoing requests as a fallback for browsers blocking cross-domain cookies
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
)
