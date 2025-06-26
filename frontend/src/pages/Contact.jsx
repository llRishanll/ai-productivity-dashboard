import Header from "../components/Header";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Footer from "../components/Footer";

export default function Contact() {
  const formRef = useRef();
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState("");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    emailjs
      .sendForm(
        "service_xrij15p",
        "template_d4u9tli",
        formRef.current,
        "009DWM0A-Vgm3nHjE"
      )
      .then(
        () => setStatus("Message sent successfully!"),
        () => setStatus("Something went wrong. Please try again.")
      );

    e.target.reset();
    setTimeout(() => setStatus(""), 4000);
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-[#132418] text-white px-6 py-20 flex flex-col items-center">
      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Vertical lines */}
          <div className="absolute inset-6 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
          {/* Horizontal lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />

      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto grid grid-cols-1 gap-12 items-start font-inter animate-fade-in">
        {/* Contact Info */}
        <div className="bg-[#213527] rounded-2xl p-8 space-y-6 shadow-xl border border-white/10 animate-fade-in-scale">
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-700 font-josefin">Contact Info</h2>
          <div className="space-y-4 text-white/80">
            {/* Email */}
            <div
              className="group flex items-center justify-between cursor-pointer"
              onClick={() => handleCopy("rishandeshmukh2@gmail.com")}
            >
              <div>
                <p className="text-white text-lg font-semibold">Email</p>
                <p className="text-yellow-700 group-hover:underline">
                  rishandeshmukh2@gmail.com
                </p>
              </div>
              <div className="pt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                {copied === "rishandeshmukh2@gmail.com" ? (
                  // ✅ Check Icon SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white/50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  // 📋 Copy Icon SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white/50 hover:text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </div>
            </div>

            {/* Phone */}
            <div
              className="group flex items-center justify-between cursor-pointer"
              onClick={() => handleCopy("+1 (647) 830-5142")}
            >
              <div>
                <p className="text-white text-lg font-semibold">Phone</p>
                <p className="text-yellow-700 group-hover:underline">
                  +1 (647) 830-5142
                </p>
              </div>
              <div className="pt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                {copied === "+1 (647) 830-5142" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white/50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white/50 hover:text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          ref={formRef}
          onSubmit={sendEmail}
          className="space-y-6 bg-[#213527] p-8 rounded-2xl shadow-xl border border-white/10 animate-fade-in-scale"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-700 font-josefin text-center">
            Send a Message
          </h2>
          <div>
            <label className="block text-white/80 mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 rounded-md bg-[#132418] border border-white/20 text-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-700"
            />
          </div>
          <div>
            <label className="block text-white/80 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 rounded-md bg-[#132418] border border-white/20 text-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-700"
            />
          </div>
          <div>
            <label className="block text-white/80 mb-1">Subject</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-2 rounded-md bg-[#132418] border border-white/20 text-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-700"
            />
          </div>
          <div>
            <label className="block text-white/80 mb-1">Message</label>
            <textarea
              name="message"
              required
              rows="4"
              className="w-full px-4 py-2 rounded-md bg-[#132418] border border-white/20 text-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-700"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-700 hover:bg-yellow-800 py-2 rounded-md text-white font-semibold hover:scale-105 transition duration-300 cursor-pointer"
          >
            Send Message
          </button>
          {status && (
            <p className="text-center text-yellow-700 mt-2 animate-fade-slide-up">
              {status}
            </p>
          )}
        </form>
      </div>
      </div>
      <Footer />
    </>
  );
}
