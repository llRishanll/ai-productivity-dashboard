import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";

const baseUrl = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.status === 201) {
        setMsg("Account created successfully! Please check your email to verify your account.");
        setError("");
      } else if (res.status === 400) {
        setError("Account already exists. Try logging in.");
        setMsg("");
      } else {
        setError("Unexpected error. Please try again.");
        setMsg("");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setMsg("");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${baseUrl}/auth/google-login`;
  };

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: "transparent" }}  // allow black body to show through
      >
        <div className="relative w-full min-h-screen bg-[#1e3226] text-white">
          <Header />
          <div className="min-h-screen flex flex-col justify-center items-center bg-[#132418] px-4 py-12 relative pt-[11rem]">
            
            {/* grid lines */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-6 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
            </div>
            
            {/* signup panel */}
            <div className="relative bg-[#213527]/80 w-full max-w-lg rounded-4xl shadow-lg p-8 space-y-6 z-10">
              <h1 className="text-5xl md:text-6xl font-josefin font-bold text-yellow-700 text-center">
                Sign Up <br /> TaskMaster AI
              </h1>

              <button
                onClick={handleGoogleSignup}
                className="bg-white/90 w-full px-6 py-2 rounded-xl hover:bg-gray-300 hover:scale-105 transition duration-300 flex items-center justify-center gap-3 mt-6"
              >
                {/* Google SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48"><path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"></path><path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"></path><path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"></path><path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"></path></svg>
              </button>

              <div className="text-center text-white/60 font-inter text-xl">or</div>

              <form onSubmit={handleEmailSignup} className="space-y-4 w-full">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg bg-[#132418] text-white text-lg border-2 border-white/20 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-700"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-[#132418] text-white text-lg border-2 border-white/20 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-700"
                />
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={form.password}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg bg-[#132418] text-white text-lg border-2 border-white/20 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-700"
                />
                {error && <p className="text-red-500 text-md">{error}</p>}
                {msg && <p className="text-yellow-700 text-md">{msg}</p>}
                <button
                  type="submit"
                  className="w-full bg-yellow-700 text-white px-6 py-3 rounded-xl hover:bg-yellow-800 hover:scale-105 transition duration-300 font-inter text-2xl"
                >
                  Sign up
                </button>
              </form>

              <p className="text-center text-white/50 text-md">
                Already have an account?{" "}
                <span
                  className="text-yellow-700 hover:underline cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
