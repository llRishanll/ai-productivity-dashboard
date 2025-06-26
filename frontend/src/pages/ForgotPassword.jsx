import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";

const baseUrl = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const tokenFromURL = params.get("token");
    if (tokenFromURL) setToken(tokenFromURL);
  }, [params]);

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "If this email exists, a reset link has been sent.");
      } else {
        setStatus("error");
        setMessage(data.detail || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords must match and not be empty.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(`${baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("Password has been reset successfully.");
        setTimeout(() => navigate("/login"), 4000);
      } else {
        setStatus("error");
        setMessage(data.detail || "Reset failed. Link may be invalid or expired.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#132418] px-4 py-12">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-6 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
      </div>

      <div className="relative bg-[#213527]/80 text-white w-full max-w-xl p-8 rounded-4xl shadow-lg text-center space-y-6 animate-fade-in-scale">
        <h1 className="text-5xl md:text-6xl font-josefin font-bold text-yellow-700">
          {token ? "Reset Password" : "Forgot Password"}
        </h1>

        {status === "loading" && (
          <div className="flex items-center justify-center gap-3 text-white/80 font-inter text-xl">
            <svg className="animate-spin h-6 w-6 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Processing...
          </div>
        )}

        {/* Reset password form */}
        {token && status !== "loading" && status !== "success" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#132418] text-white border border-white/20 focus:ring-2 focus:ring-yellow-700"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#132418] text-white border border-white/20 focus:ring-2 focus:ring-yellow-700"
              required
            />
            <button
              type="submit"
              className="w-full bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-3 rounded-xl transition hover:scale-105 text-xl"
            >
              Set New Password
            </button>
          </form>
        )}

        {/* Request reset link form */}
        {!token && status === "idle" && (
          <form onSubmit={handleSendResetEmail} className="space-y-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#132418] text-white border border-white/20 focus:ring-2 focus:ring-yellow-700"
              required
            />
            <button
              type="submit"
              className="w-full bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-3 rounded-xl transition hover:scale-105 text-xl"
            >
              Send Reset Link
            </button>
          </form>
        )}

        {/* Message Display */}
        {(status === "success" || status === "error") && (
          <>
            <p className={`mt-4 text-2xl font-inter ${status === "success" ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
            <div className="flex flex-row items-center justify-center gap-4 mt-6">
              <button
                onClick={() => navigate("/login")}
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded-xl font-inter text-lg transition hover:scale-105"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded-xl font-inter text-lg transition hover:scale-105"
              >
                Go to Signup
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
