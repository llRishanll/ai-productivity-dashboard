import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#132418] text-white font-inter">
        <div className="text-center animate-fade-in-scale">
          <svg
            className="w-10 h-10 mb-4 text-yellow-700 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <p className="text-lg text-white/80">Checking session...</p>
        </div>
      </div>
    );
  }

  return user ? children : null;
}
