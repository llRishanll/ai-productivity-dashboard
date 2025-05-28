import useAuth from "../hooks/useAuth";
import { logout } from "../utils/auth";
const baseUrl = import.meta.env.VITE_APP_URL

export default function Header() {
    const {user} = useAuth()

    return(
        <header className="fixed top-0 left-0 w-full z-50 px-6 py-7 bg-[#121f17]/80 backdrop-blur-xs flex justify-between items-center">
        <a href={baseUrl + "/"} className="text-white">
          <img
          src="/src/assets/logo.png"
          alt="TaskMaster AI"
          className="h-9 w-auto object-contain hover:scale-105 transition-transform"
          />
        </a>

      {user && (
        <nav className="flex items-center gap-6">
          <a href={baseUrl + "/"} className="text-white text-md font-medium hover:text-yellow-700 hover:scale-110 transition">
            Home
          </a>
          <a href={baseUrl + "/add-tasks"} className="text-white text-md font-medium hover:text-yellow-700 hover:scale-110 transition">
            Add Tasks
          </a>
          <a href={baseUrl + "/view-tasks"} className="text-white text-md font-medium hover:text-yellow-700 hover:scale-110 transition">
            View Tasks
          </a>
          <a href={baseUrl + "/profile"} className="text-white hover:text-yellow-700 transition">
            <svg width="24" height="24" fill="currentColor" className="hover:scale-110 transition-transform">
              <path d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0-2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Z" />
              <path d="M17.93 20.06A9.95 9.95 0 0 0 22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 3.3 1.61 6.21 4.07 8.06C7.13 21.37 9.48 22 12 22s4.87-.63 5.93-1.94ZM7.5 18.06A7.96 7.96 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.32-1 4.41-2.5 6.06C16 16.27 14.11 15 12 15s-4 1.27-4.5 3.06Z" />
            </svg>
          </a>
          <a
            onClick={logout}
            className="text-md text-red-400 font-medium hover:text-red-600 hover:scale-110 transition cursor-pointer"
          >
            Logout
          </a>
        </nav>
      )}
    </header>
  );
}
    