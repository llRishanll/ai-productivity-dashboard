import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { motion } from "framer-motion";

const baseUrl = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", form.username);
    formData.append("password", form.password);
    formData.append("scope", ""); // Optional but included for spec compliance
    formData.append("client_id", "");
    formData.append("client_secret", "");

    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (res.status === 200) {
        const token = await res.json().then(data => data.access_token); 
        localStorage.setItem("token", token);
        navigate("/"); // or your dashboard route
      } else if (res.status === 401) {
        setError("Invalid login credentials. Please try again.");
      } else if (res.status === 403) {
        setError("Email not verified. Please check your inbox.");
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${baseUrl}/auth/google-login`;
  };

  return (
    <div style={{ backgroundColor: "black", overflow: "hidden" }}>
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{ duration: 0.5}}
    >
    <div className="relative min-h-screen w-full bg-[#1e3226] text-white">
      <Header />
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#132418] px-4 py-12">
        <div className="absolute inset-0 z-0">
          {/* Vertical lines */}
          <div className="absolute inset-6 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
          {/* Horizontal lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
        </div>
        <div className="relative bg-[#213527]/80 flex flex-col items-center text-white w-full max-w-lg rounded-4xl shadow-lg p-8 space-y-6">
          <h1 className="text-5xl md:text-6xl font-josefin font-bold text-yellow-700 text-center">Login <br /> TaskMaster AI</h1>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className=" bg-white/90 w-full px-6 py-2 rounded-xl hover:bg-gray-300 hover:scale-105 transition duration-300 flex items-center justify-center gap-3 mt-6 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48"><path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"></path><path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"></path><path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"></path><path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"></path></svg>
        </button>

        <div className="text-center text-white/60 font-inter text-xl">or</div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-[#132418] text-white text-lg md:text-xl font-inter font-light border-2 border-white/20 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-[#132418] text-white text-lg md:text-xl font-inter font-light border-2 border-white/20 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
          />

            <div className="flex justify-end text-md font-inter px-1 mb-6">
            <span
                className="text-yellow-700 hover:underline cursor-pointer"
                onClick={() => navigate("/forgot-password")}
            >
                Forgot Password?
            </span>
            </div>

            {error && <p className="text-red-500 text-md">{error}</p>}
            <button
            type="submit"
            className="w-full bg-yellow-700 text-white px-6 py-3 rounded-xl hover:bg-yellow-800 hover:scale-105 transition duration-300 font-inter text-2xl cursor-pointer"
            >
            Sign in
            </button>

        </form>

        <p className="text-center text-white/50 text-md">
          Don’t have an account?{" "}
          <span
            className="text-yellow-700 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
    </div>
    </motion.div>
    </div>
  );
}
