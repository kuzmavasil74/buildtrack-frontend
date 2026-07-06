import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Main from './pages/Main.jsx'
import Records from './pages/Records.jsx'
import Sites from './pages/Sites.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/records" element={<Records />} />
        <Route path="/sites" element={<Sites />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
