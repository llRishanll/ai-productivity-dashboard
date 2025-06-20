import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Features2 from "../components/Features2";
import Stats from "../components/Stats";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

const baseUrl = import.meta.env.VITE_APP_URL;

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full bg-[#1e3226] text-white">
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

      {/* Call to Action Section */}
      <CallToAction />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
