import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MCQ from './pages/MCQ'
import Chatbot from './pages/Chatbot'
import Teacher from './pages/Teacher'

function PrivateRoute({ children }) {
  const email = localStorage.getItem('email')
  return email ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/mcq"
          element={<PrivateRoute><MCQ /></PrivateRoute>}
        />
        <Route
          path="/chatbot"
          element={<PrivateRoute><Chatbot /></PrivateRoute>}
        />
        <Route
          path="/teacher"
          element={<PrivateRoute><Teacher /></PrivateRoute>}
        />
      </Routes>
    </BrowserRouter>
  )
}
