import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutGroup, motion } from "framer-motion";
import {
  Home,
  ListChecks,
  CalendarCheck,
  User,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const isAdmin = true;

  return (
    <aside className="h-240 w-64 min-w-[16rem] flex-shrink-0 bg-gradient-to-b from-[#55974E66] via-[#20432abd] to-[#213527BD] text-white flex flex-col justify-between px-6 py-6 rounded-3xl shadow-lg mt-6 ml-2 mb-6">
      <LayoutGroup>
        <nav className="space-y-6">
          <Section title="">
            <NavItem to="/dashboard" icon={<Home />} label="Dashboard" />
          </Section>

          <Section title="Tasks">
            <NavItem to="/dashboard/tasks/tasks" icon={<ListChecks />} label="Tasks" />
          </Section>

          <Section title="Planner">
            <NavItem to="/dashboard/planner/ai-planner" icon={<CalendarCheck />} label="AI Planner" />
          </Section>

          <Section title="My Account">
            <NavItem to="/profile" icon={<User />} label="Profile Settings" />
            <NavItem to="/logout" icon={<LogOut />} label="Sign Out" isLogout />
          </Section>
        </nav>
      </LayoutGroup>

      <p className="text-xs text-white/30 text-center">2025 © TaskMaster AI</p>
    </aside>
  );
}

function NavItem({ to, icon, label, isLogout = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === to;

  const handleClick = (e) => {
    if (isLogout) {
      e.preventDefault();
      localStorage.removeItem("token");
      navigate("/"); // Redirect to landing/login page
    }
  };

  return (
    <div className="relative">
      {isActive && (
        <motion.div
          layoutId="active-tile"
          className="absolute inset-0 bg-[#213527] rounded-xl z-0"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <NavLink
        to={to}
        onClick={handleClick}
        className={`relative z-10 flex items-center gap-4 px-4 py-3 rounded-xl transition group ${
          isActive
            ? "text-yellow-700 font-semibold"
            : "text-white/80 hover:bg-[#1e3224]"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
            isActive ? "bg-white text-yellow-700" : "bg-yellow-700 text-white"
          }`}
        >
          {icon}
        </div>
        <span className="text-md">{label}</span>
      </NavLink>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      {title && (
        <h3 className="text-xs text-white/40 mb-2 font-semibold uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}
