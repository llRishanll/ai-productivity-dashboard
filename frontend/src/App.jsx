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
import Analytics from './pages/dashboard/tasks/Analytics';
import Generate from './pages/dashboard/ai/Generate';
import Prioritize from './pages/dashboard/ai/Prioritize';
import DailyPlan from './pages/dashboard/ai/DailyPlan';
import WeekPlan from './pages/dashboard/ai/WeekPlan';
import Summary from './pages/dashboard/ai/Summary';
import UserManage from './pages/dashboard/admin/UserManagement';
import AdminStats from './pages/dashboard/admin/Stats';

export default function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/"; // redirect to landing or dashboard after storing token
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
        <Route path="/about" element={<About />} />
        <Route path="/contact Us" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Dashboard Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="tasks/tasks" element={<Tasks />} />
          <Route path="tasks/analytics" element={<Analytics />} />

          {/* AI Tools */}
          <Route path="ai/generate" element={<Generate />} />
          <Route path="ai/prioritize" element={<Prioritize />} />
          <Route path="ai/daily" element={<DailyPlan />} />
          <Route path="ai/week" element={<WeekPlan />} />
          <Route path="ai/summary" element={<Summary />} />

          {/* Admin */}
          <Route path="admin/users" element={<UserManage />} />
          <Route path="admin/stats" element={<AdminStats />} />
        </Route>
      </Routes>
    </Router>
  );
}
