import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid or expired verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${baseUrl}/auth/verify-email/?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.detail || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    verify();
  }, [params, navigate]);

  const handleResend = async () => {
    if (!resendEmail) return;

    try {
      const res = await fetch(`${baseUrl}/resend-verification?email=${encodeURIComponent(resendEmail)}`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setResendMsg("Verification email resent. Please check your inbox.");
      } else {
        setResendMsg(data.detail || "Resend failed.");
      }
    } catch {
      setResendMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#132418] px-4 py-12">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-6 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
      </div>

      <div className="relative bg-[#213527]/80 text-white w-full max-w-xl p-8 rounded-4xl shadow-lg text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-josefin font-bold text-yellow-700">
          Email Verification
        </h1>

        {status === "loading" && (
          <div className="flex items-center justify-center gap-3 text-white/80 font-inter text-xl">
            <svg className="animate-spin h-6 w-6 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Verifying your email...
          </div>
        )}

        {status !== "loading" && (
          <>
            <p className={`mt-16 text-2xl font-inter ${status === "success" ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          </>
        )}

        {status === "error" && (
          <div className="mt-16 space-y-3">
            <p className="text-white/80 text-md">Didn’t get a link? Enter your email to resend:</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-[#132418] text-white text-md border-2 border-white/20 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
            />
            {resendMsg && (
              <p className="text-sm font-inter text-white/70">{resendMsg}</p>
            )}
            <button
              onClick={handleResend}
              className="w-full mt-2 bg-yellow-700 text-white px-6 py-3 rounded-xl hover:bg-yellow-800 hover:scale-105 transition duration-300 font-inter text-xl"
            >
              Resend Verification
            </button>
            <div className="flex flex-row items-center justify-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-2 bg-yellow-700 text-white px-8 py-2 rounded-xl hover:bg-yellow-800 hover:scale-105 transition duration-300 font-inter text-xl"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full mt-2 bg-yellow-700 text-white px-6 py-2 rounded-xl hover:bg-yellow-800 hover:scale-105 transition duration-300 font-inter text-xl"
            >
              Go to Signup
            </button>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
