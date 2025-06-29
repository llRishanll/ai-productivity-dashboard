import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { initFadeInOnScroll } from "../utils/fadeInModule";
import { motion } from "framer-motion";

export default function About() {

  useEffect(() => {
    initFadeInOnScroll();
  }, []);

  return (
    <div style={{ backgroundColor: "black", overflow: "hidden" }}>
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{ duration: 0.5}}
    >
      <Header />
      <div className="relative min-h-screen bg-[#132418] text-white px-6 py-20 flex flex-col items-center pt-[10.5rem]">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-6 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
      </div>

      {/* Content */}
      <main className="relative z-10 px-6 md:px-16 py-20 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-josefin font-bold text-yellow-700 mb-16 text-center">
          About TaskMaster AI
        </h1>

        <section className="mb-16 space-y-6 text-white/80 font-inter text-lg leading-relaxed">
          <p>
            <strong className="text-yellow-700">TaskMaster AI</strong> is a
            next-generation productivity platform designed to simplify your daily workflow
            with smart automation. Whether you're managing tasks, planning your day, or
            staying organized, our AI helps you do it faster — and better.
          </p>
          <p>
            Built with a vision to merge <em>intelligent planning</em> with beautiful design,
            TaskMaster AI ensures that staying productive never feels overwhelming.
          </p>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-josefin font-bold text-white mb-6">
            Why We Built It
          </h2>
          <ul className="list-disc list-inside space-y-3 text-white/80 font-inter text-lg leading-relaxed marker:text-yellow-700">
            <li>To automate repetitive planning and scheduling decisions</li>
            <li>To help users regain control over their daily goals</li>
            <li>To provide intelligent suggestions without overwhelming the user</li>
            <li>To create an intuitive, beautiful UI experience powered by modern tech</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-4xl font-josefin font-bold text-white mb-4">
            Core Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#213527] rounded-xl p-6 shadow-lg hover:shadow-2xl transition animate-fade-in-scale">
              <h3 className="text-xl font-bold mb-2 text-white"><p className="inline-block text-yellow-700">AI </p> Task Generation</h3>
              <p>Create structured tasks from vague prompts using natural language.</p>
            </div>
            <div className="bg-[#213527] rounded-xl p-6 shadow-lg hover:shadow-2xl transition animate-fade-in-scale">
              <h3 className="text-xl font-bold mb-2 text-white"><p className="inline-block text-yellow-700">Task </p> Generation</h3>
              <p>Create structured tasks from vague prompts using natural language.</p>
            </div>
            <div className="bg-[#213527] rounded-xl p-6 shadow-lg hover:shadow-2xl transition animate-fade-in-scale">
              <h3 className="text-xl font-bold mb-2 text-white"><p className="inline-block text-yellow-700">Daily </p> Plans</h3>
              <p>Get dynamic, timestamped schedules tailored to your day’s tasks.</p>
            </div>
            <div className="bg-[#213527] rounded-xl p-6 shadow-lg hover:shadow-2xl transition animate-fade-in-scale">
              <h3 className="text-xl font-bold mb-2 text-white"><p className="inline-block text-yellow-700">Email </p> Reminders</h3>
              <p>Stay on track with personalized reminders directly in your inbox.</p>
            </div>
          </div>
        </section>
      </main>
      </div>
      <Footer />
    </motion.div>
    </div>
  );
}
