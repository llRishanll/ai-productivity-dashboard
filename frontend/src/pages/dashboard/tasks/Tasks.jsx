import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { initFadeInOnScroll } from "../../../utils/fadeInModule";
import TaskListSection from "../../../components/dashboard/TaskList";
import AIGenerateTask from "../../../components/dashboard/AIGenerate";
import AIPrioritizedPlan from "../../../components/dashboard/AIPriority";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  useEffect(() => {
    initFadeInOnScroll();
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks?sort_by=created_at&order=desc&limit=6`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  return (
    <motion.div
      className="p-6 text-white space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="fade-in-group space-y-6" data-stagger-delay="100">
        <AIGenerateTask onTaskAdded={() => setRefreshTrigger((prev) => prev + 1)} />
        <TaskListSection refreshTrigger={refreshTrigger} />
        <AIPrioritizedPlan onReprioritized={() => setRefreshTrigger((prev) => prev + 1)} />
      </div>
    </motion.div>
  );
}
