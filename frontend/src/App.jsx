import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardHome from './pages/dashboard/DashboardHome';
import Tasks from './pages/dashboard/tasks/Tasks';
import Planner from './pages/dashboard/planner/Planner';
import UserManage from './pages/dashboard/admin/UserManagement';
import AdminStats from './pages/dashboard/admin/Stats';
import PrivacyPolicy from './pages/PrivacyPolicy';

export default function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const currentPath = window.location.pathname;

    if (token && currentPath !== "/verify-email" && currentPath != "/forgot-password") {
      localStorage.setItem("token", token);
      window.location.href = "/dashboard"; 
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact Us" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Dashboard Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="tasks/tasks" element={<Tasks />} />

          {/* AI Tools */}
          <Route path="planner/ai-planner" element={<Planner />} />

          {/* Admin */}
          <Route path="admin/users" element={<UserManage />} />
          <Route path="admin/stats" element={<AdminStats />} />
        </Route>
      </Routes>
    </Router>
  );
}
