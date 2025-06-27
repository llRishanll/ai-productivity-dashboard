import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  ListChecks,
  BarChart2,
  Brain,
  CalendarCheck,
  ClipboardList,
  User,
  Users,
  LineChart,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const isAdmin = true;

  return (
    <aside className="h-screen w-64 bg-[#132418]/90 text-white flex flex-col py-8 px-6 shadow-lg rounded-3xl">
      <nav className="flex-1 space-y-2">
        <Section title="Dashboard">
          <NavItem to="/dashboard" icon={<Home />} label="Dashboard" />
        </Section>

        <Section title="Tasks">
          <NavItem to="/dashboard/tasks/tasks" icon={<ListChecks />} label="All Tasks" />
          <NavItem to="/dashboard/tasks/analytics" icon={<BarChart2 />} label="Analytics" />
        </Section>

        <Section title="AI Tools">
          <NavItem to="/dashboard/ai/generate" icon={<Brain />} label="AI Generate" />
          <NavItem to="/dashboard/ai/prioritize" icon={<ClipboardList />} label="AI Prioritize" />
          <NavItem to="/dashboard/ai/daily" icon={<CalendarCheck />} label="AI Daily Plan" />
          <NavItem to="/dashboard/ai/week" icon={<CalendarCheck />} label="AI Week Plan" />
          <NavItem to="/dashboard/ai/summary" icon={<LineChart />} label="AI Summary" />
        </Section>

        {isAdmin && (
          <Section title="Admin">
            <NavItem to="/dashboard/admin/users" icon={<Users />} label="Manage Users" />
            <NavItem to="/dashboard/admin/stats" icon={<BarChart2 />} label="Stats" />
          </Section>
        )}

        <Section title="Account">
          <NavItem to="/profile" icon={<User />} label="Profile" />
          <NavItem to="/logout" icon={<LogOut />} label="Logout" />
        </Section>
      </nav>

      <div className="mt-auto text-sm text-white/50 pt-6 border-t border-white/10">
        2025 © TaskMaster AI
      </div>
    </aside>
  );
}

function NavItem({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <div className="relative">
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 rounded-lg bg-[#213527]"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <NavLink
        to={to}
        className={`relative z-10 flex items-center gap-4 px-4 py-3 rounded-lg transition ${
          isActive ? "text-yellow-700" : "text-white/80 hover:bg-[#213527]"
        }`}
      >
        <div className="w-5 h-5">{icon}</div>
        <span className="font-inter text-lg">{label}</span>
      </NavLink>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm text-white/50 mb-1 font-semibold uppercase tracking-wide">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
