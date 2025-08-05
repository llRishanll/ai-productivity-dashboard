import { useState, useEffect } from "react";
import { Sparkles, Loader2, Info } from "lucide-react";

export default function AIGenerateTask({ onTaskAdded }) {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/ai-generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input)
      });

      if (res.ok) {
        setMessage("Task added successfully!");
        setInput("");
        onTaskAdded?.(); // optional chaining for callback
      } else {
        const errorData = await res.json();
        const detail = Array.isArray(errorData.detail)
          ? errorData.detail.map((e) => e.msg).join(" ")
          : errorData.detail || "Something went wrong.";
        setMessage(`${detail}`);
      }
    } catch (err) {
      console.error("AI Task generation failed:", err);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="fade-in-item bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] rounded-2xl p-6 shadow-lg w-full min-h-[180px]">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h2 className="text-3xl font-bold text-yellow-700 font-josefin text-center">
          AI Generate Task
        </h2>
        <div className="relative group cursor-pointer">
          <Info size={18} className="text-white/70 hover:text-yellow-700 transition" />
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[240px] text-xs bg-black/80 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-10">
            Include important details like deadlines, priority, or recurrence to help the AI structure your task better.
          </div>
        </div>
      </div>

      <div className="fade-in-group flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your task..."
          className="fade-in-item w-full bg-[#2e4736] text-white px-4 py-3 rounded-xl placeholder-white/50 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-yellow-700 transition"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="fade-in-item bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-xl transition flex items-center gap-2 font-inter text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate
            </>
          )}
        </button>
      </div>

      <div
        className={`mt-4 text-center text-white/80 text-sm font-inter transition-opacity duration-500 ${
          message ? "opacity-100" : "opacity-0"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
