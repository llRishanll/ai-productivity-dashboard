import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
        setDropdownOpen(false);
      }
    }

    function handleScroll() {
      setIsMobileMenuOpen(false);
      setDropdownOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = ["home","features", "dashboard", "about", "contact Us"];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="fixed top-0 z-50 bg-[#213527] text-white w-full px-6 sm:px-10 lg:px-20 xl:px-24 py-7">
      <div className="flex items-center justify-between w-full">
        <Link className="text-yellow-700 font-bold text-md sm:text-lg md:text-xl lg:text-xl xl:text-2xl"
          to="/">LOGO</Link>

          <nav className="hidden lg:flex space-x-8 text-lg font-inter font-light absolute left-1/2 -translate-x-1/2">
            {navLinks.map((route) => {
              const label = route.charAt(0).toUpperCase() + route.slice(1);

              if (route === "features") {
                return (
                  <a
                    key={route}
                    href="/#features"
                    className="hover:text-yellow-700 hover:scale-105 transition"
                  >
                    {label}
                  </a>
                );
              } else if (route === "home") {
                return (
                  <Link
                    key={route}
                    to="/"
                    className="hover:text-yellow-700 hover:scale-105 transition"
                  >
                    Home
                  </Link>
                );
              } else {
                return (
                  <Link
                    key={route}
                    to={`/${route}`}
                    className="hover:text-yellow-700 hover:scale-105 transition"
                  >
                    {label}
                  </Link>
                );
              }
            })}

          </nav>


        <div className="relative flex items-center space-x-4 text-md">
          <button
            ref={buttonRef}
            className={`lg:hidden transition-colors duration-200 ${
              isMobileMenuOpen ? "text-yellow-700" : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:scale-105 hover:text-yellow-700 transition duration-300 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {!loggedIn ? (
            <>
              <Link to="/login" className="hidden lg:flex items-center gap-1 hover:scale-105 transition hover:text-yellow-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
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
            </>
          ) : (
            <div className="hidden lg:flex items-center gap-1 relative">
              <button
                ref={buttonRef}
                className={`transition flex items-center duration-300 gap-1 hover:scale-105 hover:text-yellow-700 cursor-pointer ${
                  dropdownOpen ? "text-yellow-700" : "text-white"
                }`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.084 15.812a7 7 0 1 0-10.168 0A6 6 0 0 1 12 13a6 6 0 0 1 5.084 2.812M12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zM12 12a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
                </svg>
                <span className="text-lg font-inter font-light">Account</span>
                <span className="text-lg font-inter font-light"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.25 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg></span>
              </button>
                <div ref={dropdownRef} 
                className={`absolute top-full right-[-0.75rem] mt-7.5 w-40 bg-[#213527] shadow-lg transition-all duration-300 ease-in-out py-2
                ${dropdownOpen ? "opacity-100 max-h-60" : "opacity-0 max-h-0 overflow-hidden"}`}>
                  <Link to="/profile" className="block text-lg text-center font-inter font-light px-4 py-2 hover:text-yellow-700 transition">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-center text-lg font-inter font-light px-4 py-2 hover:text-yellow-700 transition cursor-pointer">Logout</button>
                </div>
            </div>
          )}
        </div>
      </div>

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
        {navLinks.map((route) => {
          const label = route.charAt(0).toUpperCase() + route.slice(1);

          if (route === "features") {
            return (
              <a
                key={route}
                href="/#features"
                className="hover:text-yellow-700 hover:scale-105 transition"
              >
                {label}
              </a>
            );
          } else if (route === "home") {
            return (
              <Link
                key={route}
                to="/"
                className="hover:text-yellow-700 hover:scale-105 transition"
              >
                Home
              </Link>
            );
          } else {
            return (
              <Link
                key={route}
                to={`/${route}`}
                className="hover:text-yellow-700 hover:scale-105 transition"
              >
                {label}
              </Link>
            );
          }
        })}



        {!loggedIn ? (
          <>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="transition-colors duration-200 hover:text-yellow-700 active:text-yellow-800"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-yellow-700 text-white px-6 py-2 rounded-md hover:bg-yellow-800 active:bg-yellow-800 font-normal transition"
            >
              Get Started
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-yellow-700 font-inter text-lg hover:underline"
            >
              Account
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="text-yellow-700 font-inter text-lg hover:underline cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
