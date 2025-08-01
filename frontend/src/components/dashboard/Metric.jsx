import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  Hourglass,
  ListTodo,
} from "lucide-react";

export default function Metrics() {
  const [metrics, setMetrics] = useState({
    today: 0,
    completed: 0,
    pending: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const resAnalytics = await fetch(`${import.meta.env.VITE_API_URL}/tasks/analytics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        let analyticsData = {
          total_tasks: 0,
          completed_tasks: 0,
        };

        if (resAnalytics.ok) {
          analyticsData = await resAnalytics.json();
        }

        setMetrics((prev) => ({
          ...prev,
          completed: analyticsData.completed_tasks || 0,
          pending:
            (analyticsData.total_tasks || 0) - (analyticsData.completed_tasks || 0),
          total: analyticsData.total_tasks || 0,
        }));

        const resTasks = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (resTasks.ok) {
          const data = await resTasks.json();
          const today = new Date().toISOString().split("T")[0];
          const todayCount = data.tasks.filter(
            (task) => task.due_date === today
          ).length;

          setMetrics((prev) => ({
            ...prev,
            today: todayCount,
          }));
        }
      } catch (err) {
        console.error("Error fetching metrics", err);
      }
    };

    fetchMetrics();
  }, []);

  const cards = [
    { label: "Today's Tasks", value: metrics.today, icon: <Clock size={28} /> },
    { label: "Completed Tasks", value: metrics.completed, icon: <CheckCircle2 size={28} /> },
    { label: "Pending Tasks", value: metrics.pending, icon: <Hourglass size={26} /> },
    { label: "Total Tasks", value: metrics.total, icon: <ListTodo size={28} /> },
  ];

  return (
    <div className="fade-in-group grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-stagger-delay="100">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="fade-in-item bg-[#213527] border border-white/10 rounded-2xl px-5 py-4 flex justify-between items-center"
        >
          <div>
            <p className="text-white/50 text-sm font-inter">{card.label}</p>
            <p className="text-white/90 text-lg tracking-widest font-inter">
              {String(card.value).padStart(4, "0")}
            </p>
          </div>
          <div className="bg-yellow-700 rounded-xl w-10 h-10 flex items-center justify-center">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
