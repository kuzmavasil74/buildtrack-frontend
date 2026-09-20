import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Main from './pages/Main.jsx'
import Records from './pages/Records.jsx'
import Sites from './pages/Sites.jsx'
import Receipts from './pages/Receipts.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/records"
          element={
            <ProtectedRoute>
              <Records />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sites"
          element={
            <ProtectedRoute>
              <Sites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipts"
          element={
            <ProtectedRoute>
              <Receipts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
