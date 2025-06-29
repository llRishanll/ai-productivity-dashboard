import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom"; // ✅ REQUIRED for nested routes to show
import { useEffect } from "react";
import { initFadeInOnScroll } from "../../utils/fadeInModule";
import { motion } from "framer-motion";

export default function Dashboard() {

  useEffect(() => {
    initFadeInOnScroll();
  }, []);

  return (
    <div style={{ backgroundColor: "black", overflow: "hidden" }}>
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{ duration: 0.5}}
    >
    <Header />
    <div className="flex-1 flex flex-col pt-[5.5rem]">
      <div className="flex min-h-screen bg-[#1e3226] text-white">
        <Sidebar />
        <div className="p-8">
          <Outlet /> {/* ✅ This renders the selected nested route */}
        </div>
      </div>
    </div>
    <Footer />
    </motion.div>
    </div>
    
  );
}
