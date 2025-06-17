import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <header
      className={`${
        isLandingPage ? "" : "sticky top-0 z-50"
      } bg-[#213527] text-white w-full px-6 sm:px-10 lg:px-20 xl:px-24 py-7`}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="text-yellow-700 font-bold text-2xl">LOGO</div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-lg font-inter font-light absolute left-1/2 -translate-x-1/2">
          <Link to="/features" className="hover:text-yellow-700 hover:scale-105 transition">Features</Link>
          <Link to="/pricing" className="hover:text-yellow-700 hover:scale-105 transition">Pricing</Link>
          <Link to="/resources" className="hover:text-yellow-700 hover:scale-105 transition">Resources</Link>
          <Link to="/about" className="hover:text-yellow-700 hover:scale-105 transition">About Us</Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4 text-md">
          <Link to="/login" className="flex items-center gap-1 hover:scale-105 transition hover:text-yellow-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.084 15.812a7 7 0 1 0-10.168 0A6 6 0 0 1 12 13a6 6 0 0 1 5.084 2.812M12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zM12 12a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
            </svg>
            <span className="text-lg font-inter font-light">Login</span>
          </Link>
          <Link
            to="/signup"
            className="bg-yellow-700 text-white text-lg font-inter px-6 py-1.5 rounded-md hover:scale-105 hover:bg-yellow-800 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
