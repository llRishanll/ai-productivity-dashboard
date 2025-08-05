import { useState } from "react";
import { RefreshCcw, Info } from "lucide-react";

export default function AIWeeklyPlanner() {
  const [weekPlan, setWeekPlan] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const fetchWeekPlan = async () => {
    setLoading(true);
    setError("");
    setWeekPlan({});
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/ai-week-plan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.week_plan;
        const parsed = parseWeekPlan(raw);
        setWeekPlan(parsed);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to fetch weekly plan");
      }
    } catch (err) {
      console.error("Week plan fetch failed", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const parseWeekPlan = (rawText) => {
    const lines = rawText.split("\n");
    const plan = {};
    let currentDay = null;

    lines.forEach((line) => {
      if (line.startsWith("- ")) {
        const day = line.slice(2).replace(":", "").trim();
        if (days.includes(day)) {
          currentDay = day;
          plan[day] = [];
        }
      } else if (line.startsWith("  - ") && currentDay) {
        plan[currentDay].push(line.slice(4).trim());
      }
    });

    return plan;
  };

  return (
    <div className="fade-in-item bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] rounded-2xl p-6 shadow-lg w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold text-yellow-700 font-josefin">
            Week's Plan
          </h2>
          <div className="relative group cursor-pointer">
            <Info size={18} className="text-white/70 hover:text-yellow-700 transition" />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[240px] text-xs bg-black/80 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-10">
              Click “Generate” to let the AI analyze your tasks and map out your upcoming week.
            </div>
          </div>
        </div>

        <button
          onClick={fetchWeekPlan}
          disabled={loading}
          className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-xl transition flex items-center gap-2 text-sm font-inter cursor-pointer disabled:opacity-50"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="fade-in-group grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 text-sm text-white font-inter">
        {days.map((day) => (
          <div
            key={day}
            className="fade-in-item border border-white/10 rounded-xl p-4 min-h-[140px] bg-[#213527]"
          >
            <h4 className="font-semibold text-yellow-700 text-base mb-2">{day}</h4>
            {weekPlan[day] && weekPlan[day].length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {weekPlan[day].map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            ) : (
              <p className="italic text-white/60">No tasks planned.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
