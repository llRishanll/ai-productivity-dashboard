import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Features2 from "../components/Features2";
import Stats from "../components/Stats";

const baseUrl = import.meta.env.VITE_APP_URL;

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-[#1e3226] text-white overflow-x-hidden">
      {/* Sticky header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Features Section 2 */}
      <Features2 />
      {/* Stats Section */}
      <Stats />

      {/* Footer Section */}
    </div>
  );
}
