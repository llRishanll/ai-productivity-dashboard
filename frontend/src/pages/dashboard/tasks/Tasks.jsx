import { useEffect } from "react";
import { motion } from "framer-motion";
import { initFadeInOnScroll } from "../../../utils/fadeInModule";
import TaskListSection from "../../../components/dashboard/TaskList";
import AIGenerateTask from "../../../components/dashboard/AIGenerate";
import AIPrioritizedPlan from "../../../components/dashboard/AIPriority";

export default function Tasks() {
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

        {/* Task List Section */}
        <TaskListSection />

        {/* AI Section Header */}
        <h2 className="fade-in-item text-3xl font-bold text-white font-josefin mt-12 mb-2">
          Let AI Lighten the Load...
        </h2>

        {/* AI Features Row */}
        <div className="fade-in-item flex flex-col lg:flex-row gap-6 w-full">
          <AIGenerateTask />
          <AIPrioritizedPlan />
        </div>
      </div>
    </motion.div>
  );
}
