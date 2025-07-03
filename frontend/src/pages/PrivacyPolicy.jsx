import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { initFadeInOnScroll } from "../utils/fadeInModule";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {

  useEffect(() => {
    initFadeInOnScroll();
  }, []);

  return (
    <div style={{ backgroundColor: "black", overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        <div className="relative min-h-screen bg-[#132418] text-white px-6 py-20 flex flex-col items-center pt-[10.5rem]">
          {/* Decorative Grid Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-6 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
          </div>

          {/* Content */}
          <main className="relative z-10 px-6 md:px-16 py-20 max-w-5xl mx-auto space-y-6 font-inter text-lg leading-relaxed text-white/80">
            <h1 className="text-5xl md:text-7xl font-josefin font-bold text-yellow-700 mb-16 text-center">
              Privacy Policy
            </h1>

            <section>
              <p>
                <strong className="text-yellow-700">TaskMaster AI</strong> is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform and related services.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mt-10 mb-4">1. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-2 marker:text-yellow-700">
                <li>Your email, name, and profile picture during account signup or Google OAuth login.</li>
                <li>Task data you create on TaskMaster AI (titles, descriptions, due dates, priorities).</li>
                <li>Google Calendar event data, if you choose to connect your calendar.</li>
                <li>Log data and usage analytics to improve our services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mt-10 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 marker:text-yellow-700">
                <li>To provide and improve our productivity features.</li>
                <li>To sync your tasks with your Google Calendar, if connected.</li>
                <li>To generate AI-powered suggestions, summaries, and schedules.</li>
                <li>To maintain system security and performance.</li>
              </ul>
              <p className="mt-4">We do not sell or share your data with third-party advertisers.</p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mt-10 mb-4">3. Data Sharing</h2>
              <p>
                We only share data with trusted third-party services that are required for core features, like Google Calendar. These services comply with industry-standard data protection and security practices.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mt-10 mb-4">4. Data Security</h2>
              <p>
                We use secure protocols, encryption, and modern best practices to protect your personal data. Sensitive tokens and passwords are stored securely and never shared with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mt-10 mb-4">5. Your Choices</h2>
              <ul className="list-disc list-inside space-y-2 marker:text-yellow-700">
                <li>You can disconnect Google Calendar anytime from your account settings.</li>
                <li>You can delete your account permanently by contacting our support team.</li>
                <li>You can manage which tasks sync to Google Calendar through provided toggles.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mt-10 mb-4">6. Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. We will notify you if significant changes are made.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mt-10 mb-4">7. Contact</h2>
              <p>
                If you have any questions about this Privacy Policy, please email us at</p> 
                <a
                href="mailto:rishandeshmukh2@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-700 underline"
                >
                 rishandeshmukh2@gmail.com
                </a>.
            </section>
          </main>
        </div>
        <Footer />
      </motion.div>
    </div>
  );
}
