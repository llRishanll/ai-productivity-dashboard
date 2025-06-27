import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom"; // ✅ REQUIRED for nested routes to show

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <div className="flex min-h-screen bg-[#1e3226] text-white">
        <Sidebar />
        <div className="p-8">
          <Outlet /> {/* ✅ This renders the selected nested route */}
        </div>
      </div>
    </div>
  );
}
