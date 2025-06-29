import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { initFadeInOnScroll } from "../utils/fadeInModule";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Features2 from "../components/Features2";
import Stats from "../components/Stats";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    initFadeInOnScroll();
  }, []);

  useEffect(() => {
    if (location.hash === "#features") {
      // Wait for fade transition (0.5s) before scrolling
      const scrollTimeout = setTimeout(() => {
        const el = document.getElementById("features");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 500);

      return () => clearTimeout(scrollTimeout);
    }
  }, [location]);

  return (
    <div style={{ backgroundColor: "black", overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative min-h-screen w-full bg-[#1e3226] text-white">
          <Header />
          <Hero />
          <section id="features">
            <Features />
          </section>
          <Features2 />
          <Stats />
          <CallToAction />
          <Footer />
        </div>
      </motion.div>
    </div>
  );
}
