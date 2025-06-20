import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Auto-close on outside click or scroll
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    function handleScroll() {
      setIsMobileMenuOpen(false);
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className="sticky top-0 z-50 bg-[#213527] text-white w-full px-6 sm:px-10 lg:px-20 xl:px-24 py-7"
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="text-yellow-700 font-bold text-md sm:text-lg md:text-xl lg:text-xl xl:text-2xl">LOGO</div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-8 text-lg font-inter font-light absolute left-1/2 -translate-x-1/2">
          <Link to="/features" className="hover:text-yellow-700 hover:scale-105 transition">Features</Link>
          <Link to="/pricing" className="hover:text-yellow-700 hover:scale-105 transition">Pricing</Link>
          <Link to="/resources" className="hover:text-yellow-700 hover:scale-105 transition">Resources</Link>
          <Link to="/about" className="hover:text-yellow-700 hover:scale-105 transition">About Us</Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4 text-md">
          {/* Hamburger Toggle (Mobile Only) */}
          <button
            className={`lg:hidden transition-colors duration-200 ${
              isMobileMenuOpen ? "text-yellow-700" : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {/* Always show the same hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Login / Signup (Desktop Only) */}
          <Link to="/login" className="hidden lg:flex items-center gap-1 hover:scale-105 transition hover:text-yellow-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.084 15.812a7 7 0 1 0-10.168 0A6 6 0 0 1 12 13a6 6 0 0 1 5.084 2.812M12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zM12 12a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
            </svg>
            <span className="text-lg font-inter font-light">Login</span>
          </Link>
          <Link
            to="/signup"
            className="hidden lg:inline-block bg-yellow-700 text-white text-lg font-inter px-6 py-2 rounded-md hover:scale-105 hover:bg-yellow-800 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        ref={menuRef}
        className={`
          lg:hidden absolute top-full left-0 w-full bg-[#213527]/95
          text-md font-inter font-light text-white shadow-md z-40
          flex flex-col items-center space-y-4 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "max-h-[500px] py-6 opacity-100" : "max-h-0 py-0 opacity-0"}
        `}
      >
        {["features", "pricing", "resources", "about", "login"].map((route) => (
          <Link
            key={route}
            to={`/${route}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="transition-colors duration-200 hover:text-yellow-700 active:text-yellow-700"
          >
            {route.charAt(0).toUpperCase() + route.slice(1)}
          </Link>
        ))}

        <Link
          to="/signup"
          onClick={() => setIsMobileMenuOpen(false)}
          className="bg-yellow-700 text-white px-6 py-2 rounded-md hover:bg-yellow-800 active:bg-yellow-800 font-normal transition-colors duration-200"
        >
          Get Started
        </Link>
      </div>

    </header>
  );
}
