import { useEffect } from "react";
import { motion } from "framer-motion";
import { initFadeInOnScroll } from "../../../utils/fadeInModule";
import WeeklyPlan from "../../../components/dashboard/WeeklyPlan";
import DailyPlan from "../../../components/dashboard/DailyPlan";
import DueTasksPanel from "../../../components/dashboard/TasksDue";

export default function Planner() {
  useEffect(() => {
    initFadeInOnScroll();
  }, []);

  return (
    <motion.div
      className="p-6 text-white space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="fade-in-group space-y-6" data-stagger-delay="100">
        <DailyPlan />
      </div>
      <div className="fade-in-group space-y-6" data-stagger-delay="100">
        <WeeklyPlan />
      </div>
      <div className="fade-in-group space-y-6" data-stagger-delay="100">
        <DueTasksPanel />
      </div>
    </motion.div>
  );
}
