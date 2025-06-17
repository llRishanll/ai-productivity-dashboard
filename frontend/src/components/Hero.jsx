import { Link } from "react-router-dom";
import bgImage from "../assets/landing-bg.png";

export default function Hero() {
  return (
    <section
      className="relative h-screen w-screen bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed bg-no-repeat z-[-1]" />

      {/* Translucent Box - slightly smaller */}
      <div className="bg-[#213527]/70 rounded-3xl px-5 md:px-10 py-5 md:py-12 max-w-[720px] w-full mx-auto flex flex-col items-center gap-10 z-10 text-center -translate-y-6">
        {/* Title */}
        <h1 className="text-[1.85rem] md:text-8xl font-bold text-yellow-700 font-josefin leading-tight">
          AI-Powered
        </h1>

        {/* Subtext */}
        <p className="text-white/80 text-sm md:text-xl font-inter font-normal leading-relaxed max-w-[90%]">
          Plan smarter, act faster, and stay on track with intelligent task automation.
        </p>

        {/* CTA Button */}
        <Link
          to="/#features"
          className="bg-yellow-700 text-white px-6 py-2 text-sm md:text-xl rounded-md hover:bg-yellow-800 hover:scale-105 transition duration-300 font-inter"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
