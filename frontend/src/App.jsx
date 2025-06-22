import{BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import Login from './pages/Login'
import ViewTasks from './pages/ViewTasks'
import Profile from './pages/Profile'
import VerifyEmail from './pages/VerifyEmail' 
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token && window.location.pathname !== "/verify-email") {
    localStorage.setItem("token", token);
    window.location.href = "/"
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Landing />} />
        <Route path="/view-tasks" element={<ProtectedRoute><ViewTasks /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}