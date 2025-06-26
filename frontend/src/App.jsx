import{BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Profile from './pages/Profile'
import VerifyEmail from './pages/VerifyEmail' 
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import ForgotPassword from './pages/ForgotPassword'

export default function App() {
  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const pathname = window.location.pathname;

  // Only redirect if on /verify-email
  if (token && pathname === "/verify-email") {
    localStorage.setItem("token", token);
    window.location.href = "/"; // or wherever you want to land after email verification
  }
}, []);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact Us" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}