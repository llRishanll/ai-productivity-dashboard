import { useState } from "react";
import { RefreshCcw, Info } from "lucide-react";

export default function AIDailyPlanner() {
  const [plan, setPlan] = useState({ highPriority: [], schedule: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDailyPlan = async () => {
    setLoading(true);
    setError("");
    setPlan({ highPriority: [], schedule: [] });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/ai-daily-plan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const parsed = parseDailyPlan(data.plan || "");
        setPlan(parsed);
      } else {
        const errData = await res.json();
        setError(errData.detail || "Failed to fetch daily plan.");
      }
    } catch (err) {
      console.error("Daily plan fetch error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseDailyPlan = (rawText) => {
    const lines = rawText.split("\n");
    const result = { highPriority: [], schedule: [] };
    let currentSection = null;

    lines.forEach((line) => {
      if (line.startsWith("**High Priority**")) {
        currentSection = "highPriority";
      } else if (line.startsWith("**Schedule**")) {
        currentSection = "schedule";
      } else if (line.trim().startsWith("-") && currentSection) {
        result[currentSection].push(line.replace(/^-/, "").trim());
      }
    });

    return result;
  };

  return (
    <div className="fade-in-item bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] rounded-2xl p-6 shadow-lg w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold text-yellow-700 font-josefin">Today’s Plan</h2>
          <div className="relative group cursor-pointer">
            <Info size={18} className="text-white/70 hover:text-yellow-700 transition" />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[250px] text-xs bg-black/80 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-10">
              This plan shows your top-priority tasks and suggested time blocks for today.
            </div>
          </div>
        </div>

        <button
          onClick={fetchDailyPlan}
          disabled={loading}
          className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-xl transition flex items-center gap-2 text-sm font-inter cursor-pointer disabled:opacity-50"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/90 text-sm font-inter">
        <div className="border border-white/10 rounded-xl p-4 bg-[#213527] min-h-[140px]">
          <h4 className="text-yellow-700 font-semibold text-base mb-2">High Priority Tasks</h4>
          {plan.highPriority.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {plan.highPriority.map((task, idx) => (
                <li key={idx}>{task}</li>
              ))}
            </ul>
          ) : (
            <p className="italic text-white/60">No tasks listed.</p>
          )}
        </div>

        <div className="border border-white/10 rounded-xl p-4 bg-[#213527] min-h-[140px]">
          <h4 className="text-yellow-700 font-semibold text-base mb-2">Suggested Schedule</h4>
          {plan.schedule.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {plan.schedule.map((slot, idx) => (
                <li key={idx}>{slot}</li>
              ))}
            </ul>
          ) : (
            <p className="italic text-white/60">No schedule available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
