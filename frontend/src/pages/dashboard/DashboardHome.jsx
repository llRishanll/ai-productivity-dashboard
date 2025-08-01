import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { initFadeInOnScroll } from "../../utils/fadeInModule";

import Metrics from "../../components/dashboard/Metric";
import Welcome from "../../components/dashboard/Welcome";
import QuickAdd from "../../components/dashboard/QuickAdd";
import Progress from "../../components/dashboard/Progress";
import TaskTable from "../../components/dashboard/TaskTable";

export default function DashboardHome() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    initFadeInOnScroll();
    fetchTasks(); // Initial load
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks?sort_by=created_at&order=desc&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      className="p-6 text-white space-y-6 mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="fade-in-group space-y-6" data-stagger-delay="100">
        <Metrics />

        <div className="flex flex-col md:flex-row gap-6 items-stretch fade-in-item">
          <div className="flex-1 fade-in-item">
            <Welcome />
          </div>
          <div className="w-full md:w-1/4 fade-in-item">
            <QuickAdd onTaskAdded={fetchTasks} />
          </div>
          <div className="w-full md:w-1/4 fade-in-item">
            <Progress />
          </div>
        </div>

        <div className="fade-in-item">
          <TaskTable tasks={tasks} />
        </div>
      </div>
    </motion.div>
  );
}
