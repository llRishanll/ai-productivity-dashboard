import { useState, useEffect } from "react";
import { RefreshCcw, Loader2, Info } from "lucide-react";

export default function AIPrioritizedPlan({ onReprioritized }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updatedTasks, setUpdatedTasks] = useState([]);

  const handleReprioritize = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    setUpdatedTasks([]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/ai-prioritize`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to reprioritize tasks.");
        return;
      }

      const data = await res.json();
      const updated = data["Updated priorities"] || [];

      // Fetch full task info to enrich titles
      const fullRes = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fullData = await fullRes.json();
      const allTasks = fullData.tasks || [];
      const enriched = updated.map((u) => {
        const full = allTasks.find((t) => t.id === u.id);
        return {
          ...u,
          title: full?.title || `Task #${u.id}`,
        };
      });

      setUpdatedTasks(enriched);
      setMessage(`Prioritized ${enriched.length} task(s)`);
      onReprioritized?.();
    } catch (err) {
      console.error("AI prioritize error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message || error) {
      const timeout = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message, error]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-700";
      case "Medium":
        return "bg-yellow-700";
      case "Low":
        return "bg-green-700";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] rounded-2xl p-6 shadow-lg w-full min-h-[160px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-yellow-700 font-josefin flex items-center gap-2">
          AI Prioritize Tasks
          <div className="relative group cursor-pointer">
            <Info size={18} className="text-white/70 hover:text-yellow-700 transition" />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[240px] text-xs font-inter font-light bg-black/80 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-10">
              Let the AI analyze and adjust your task priorities.
            </div>
          </div>
        </h2>

        <button
          onClick={handleReprioritize}
          disabled={loading}
          className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-xl transition font-inter text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          Prioritize
        </button>
      </div>

      <div className="text-white/80 font-inter text-sm text-center mt-4">
        {loading ? (
          <div className="flex justify-center gap-2 items-center">
            <Loader2 size={16} className="animate-spin" />
            Updating task priorities...
          </div>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : message ? (
          <span className="text-white/80">{message}</span>
        ) : null}
      </div>

      {updatedTasks.length > 0 && (
        <div className="mt-6 text-white/90 text-sm font-inter overflow-x-auto">
          <h4 className="text-yellow-700 font-semibold mb-3 text-base">Recently Updated Tasks:</h4>
          <table className="min-w-full text-left text-sm text-white/90 font-inter">
            <thead className="border-b border-white/20 text-white/70 text-xs uppercase tracking-wide">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">New Priority</th>
              </tr>
            </thead>
            <tbody>
              {updatedTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="py-3 px-4">{task.title}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full text-white ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
