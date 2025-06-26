import { Link } from "react-router-dom";
import bgImage from "../assets/landing-bg.png";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen w-full md:bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Translucent Box */}
      <div className="bg-[#213527]/70 rounded-3xl px-5 md:px-10 py-5 md:py-12 max-w-[720px] w-full mx-auto flex flex-col items-center gap-10 z-10 text-center -translate-y-6">
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-bold text-yellow-700 font-josefin leading-tight">
          AI-Powered
        </h1>

        {/* Subtext */}
        <p className="text-white/80 text-md md:text-xl font-inter font-normal leading-relaxed max-w-[95%] sm:max-w-[85%]">
          Plan smarter, act faster, and stay on track with intelligent task automation.
        </p>

        {/* CTA Button */}
        <Link
          to="/dashboard"
          className="bg-yellow-700 text-white px-6 py-2 text-base md:text-xl rounded-md hover:bg-yellow-800 hover:scale-105 transition duration-300 font-inter"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
