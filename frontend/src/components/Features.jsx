import { Link } from "react-router-dom";
import placeholder from "../assets/image 8.png";

export default function Features() {
  return (
    <section className="relative w-full min-h-screen bg-[#213527] text-white px-6 md:px-24 py-24 overflow-hidden">
      {/* Background 01 */}
      <div className="hidden md:block absolute text-[36rem] font-semibold font-josefin text-white/5 left-[5rem] top-[4.5rem] select-none z-0">
        01
      </div>

      {/* Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-center">

        {/* LEFT */}
        <div className="fade-in-group space-y-6 max-w-4xl mx-auto lg:mx-0" data-stagger-delay="150">
          <h2 className="fade-in-item text-yellow-700 text-xl font-medium">
            Why TaskMaster AI?
          </h2>

          <h3 className="fade-in-item text-4xl md:text-5xl xl:text-6xl font-bold font-josefin leading-tight">
            Smarter Task Management
            <br /> Starts Here
          </h3>

          <p className="fade-in-item text-lg xl:text-xl font-inter text-white/80 max-w-4xl">
            Why juggle sticky notes and scattered to-do lists when TaskMaster AI helps you plan smarter? Our intelligent assistant doesn’t just remind you — it auto-generates tasks, adapts to your habits, and builds schedules that work.
          </p>

          {/* CARDS */}
          <div className="space-y-6 pt-4 fade-in-group" data-stagger-delay="150">
            {/* Card 1 */}
            <div className="fade-in-item">
              <div className="group flex items-center gap-4 md:p-4 rounded-xl transition duration-300 hover:scale-105 hover:bg-[#253d2a] hover:shadow-xl">
                <div className="text-yellow-700 text-xl flex items-center justify-center w-11 h-11 md:w-13 md:h-13 p-1 md:p-2 rounded-full bg-white/15">
                  {/* icon */}
                  <svg width={40} height={40} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 22v-5.925q0-.5.238-.95T4.9 14.4l1.1-.725q.175 2.1.55 3.575t1.175 3.275zm5.225-2q-.875-1.65-1.3-3.5T7.5 12.675q0-3.125 1.238-5.887T12 2.6q2.025 1.425 3.263 4.188t1.237 5.887q0 1.95-.425 3.788T14.775 20zM12 13q.825 0 1.413-.587T14 11t-.587-1.412T12 9t-1.412.588T10 11t.588 1.413T12 13m8 9l-3.725-1.475q.8-1.8 1.175-3.275t.55-3.575l1.1.725q.425.275.663.725t.237.95z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold font-inter text-lg xl:text-xl">
                    AI-Powered Task Creation
                  </h4>
                  <p className="text-white/80 text-lg xl:text-xl">
                    Skip manual entry — just type a vague idea and our AI structures the task with steps and deadlines.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="fade-in-item">
              <div className="group flex flex-row-reverse md:flex-row items-center gap-4 p-4 rounded-xl transition duration-300 hover:scale-105 hover:bg-[#253d2a] hover:shadow-xl">
                <div className="text-yellow-700 text-xl flex items-center justify-center w-11 h-11 md:w-13 md:h-13 p-1 md:p-2 rounded-full bg-white/15">
                  {/* icon */}
                  <svg width={40} height={40} viewBox="0 0 48 48" fill="currentColor">
                    <defs><mask id="ipSSchedule0"><g fill="none" strokeLinecap="round" strokeWidth={4}><rect width={32} height={30} x={8} y={10} fill="#fff" stroke="#fff" strokeLinejoin="round" rx={2}></rect><path stroke="#fff" d="M14 6v8"></path><path stroke="#000" d="M25 23H14m20 8H14"></path><path stroke="#fff" d="M34 6v8"></path></g></mask></defs>
                    <path d="M0 0h48v48H0z" mask="url(#ipSSchedule0)"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold font-inter text-lg xl:text-xl">
                    Adaptive Daily Planning
                  </h4>
                  <p className="text-white/80 text-lg xl:text-xl">
                    Get a timestamped day plan personalized for your work style.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="fade-in-item">
              <div className="group flex items-center gap-4 p-4 rounded-xl transition duration-300 hover:scale-105 hover:bg-[#253d2a] hover:shadow-xl">
                <div className="text-yellow-700 text-xl flex items-center justify-center w-11 h-11 md:w-13 md:h-13 p-1 md:p-2 rounded-full bg-white/15">
                  <svg width={35} height={35} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 6.5c0 1.93-1.57 3.5-3.5 3.5S14 8.43 14 6.5S15.57 3 17.5 3S21 4.57 21 6.5m-2 5.29c-.5.13-1 .21-1.5.21A5.51 5.51 0 0 1 12 6.5c0-1.47.58-2.8 1.5-3.79A1.93 1.93 0 0 0 12 2c-1.1 0-2 .9-2 2v.29C7.03 5.17 5 7.9 5 11v6l-2 2v1h18v-1l-2-2zM12 23c1.11 0 2-.89 2-2h-4a2 2 0 0 0 2 2"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold font-inter text-lg xl:text-xl">
                    Smart Reminders & Insights
                  </h4>
                  <p className="text-white/80 text-lg xl:text-xl">
                    Intelligent reminders with summaries and productivity insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="fade-in-group" data-stagger-delay="150">
          <div className="fade-in-item">
            <Link to="/dashboard">
              <div className="relative bg-gradient-to-b from-[#3d693c] via-[#213527] to-[#213527] rounded-3xl p-6 shadow-2xl flex flex-col justify-between w-full max-w-[345px] md:max-w-[500px] md:min-h-[600px] mx-auto top-5 hover:scale-105 transition duration-300">
                <img
                  src={placeholder}
                  alt="TaskMaster AI Preview"
                  className="object-contain w-full max-h-[250px] md:max-h-[375px] mb-6 mt-5 transition duration-300 ease-in-out"
                />
                <div className="mt-auto">
                  <div className="bg-yellow-700 text-white/80 px-5 rounded-full text-md md:text-lg inline-block mb-2 font-light font-inter">
                    NEW
                  </div>
                  <h4 className="text-2xl font-bold font-josefin text-white/80 mb-1 py-3">
                    AI-Powered Dashboard
                  </h4>
                  <p className="text-lg font-inter text-white/70">
                    Everything you need, exactly when you need it.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
