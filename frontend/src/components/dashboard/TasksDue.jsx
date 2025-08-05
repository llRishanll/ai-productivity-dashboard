import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";

export default function DueTasksPanel() {
  const [dueToday, setDueToday] = useState([]);
  const [dueThisWeek, setDueThisWeek] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDueTasks();
  }, []);

  const fetchDueTasks = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const allTasks = data.tasks || [];

        const todayTasks = allTasks.filter((t) => t.due_date === today);

        const thisWeekTasks = allTasks.filter((t) => {
          if (!t.due_date) return false;
          const due = new Date(t.due_date);
          const now = new Date();
          const dayDiff = (due - now) / (1000 * 60 * 60 * 24);
          return dayDiff >= 0 && dayDiff < 7;
        });

        setDueToday(todayTasks);
        setDueThisWeek(thisWeekTasks);
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to fetch tasks.");
      }
    } catch (err) {
      console.error("Task fetch error", err);
      setError("Server error. Try again later.");
    }
  };

  const renderTaskList = (tasks) =>
    tasks.length ? (
      <ul className="list-disc list-inside text-white/90 space-y-1">
        {tasks.map((task) => (
          <li key={task.id} className="truncate">
            {task.title}
          </li>
        ))}
      </ul>
    ) : (
      <p className="italic text-white/60">No tasks found.</p>
    );

  return (
    <div className="fade-in-group grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="fade-in-item bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] p-6 rounded-2xl shadow-lg min-h-[180px]">
        <h3 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2 font-josefin">
          <Clock size={18} /> Tasks Due Today
        </h3>
        {error ? <p className="text-red-500 text-sm">{error}</p> : renderTaskList(dueToday)}
      </div>

      <div className="fade-in-item bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] p-6 rounded-2xl shadow-lg min-h-[180px]">
        <h3 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2 font-josefin">
          <CalendarDays size={18} /> Tasks Due This Week
        </h3>
        {error ? <p className="text-red-500 text-sm">{error}</p> : renderTaskList(dueThisWeek)}
      </div>
    </div>
  );
}
