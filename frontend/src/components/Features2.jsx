import { useState } from "react";
import placeholder from "../assets/ai-placeholder.jpg";

export default function UpcomingFeatures() {
  return (
    <section className="relative w-full bg-[#213527] text-white px-6 md:px-24 py-24 overflow-hidden">
      {/* Background 02 */}
      <div className="hidden md:block absolute text-[36rem] font-semibold font-josefin text-white/5 bottom-[-6.6rem] right-[4rem] select-none z-0">
        02
      </div>

      {/* Background 02 for small screens as SVG */}
      <svg
        className="block md:hidden absolute z-0 select-none"
        viewBox="0 0 500 500"
        style={{
          width: "45rem",
          height: "45rem",
          right: "-2rem",
          bottom: "22rem",
        }}
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fillOpacity="0.05"
          fontFamily="Josefin Sans, sans-serif"
          fontWeight="630"
          fontSize="400"
        >
          02
        </text>
      </svg>


      {/* Grid Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-18 items-center">
        {/* Left Image */}
        <div className="flex order-2 md:order-1 justify-center lg:justify-start min-h-[380px] md:min-h-[470px] w-full max-w-[345px] md:max-w-[500px] mx-auto pt-12">
          <img
            src={placeholder}
            alt="Coming Soon Preview"
            className="rounded-3xl object-cover w-full shadow-2xl"
          />
        </div>

        {/* Right Content */}
        <div className=" order-1 md:order-2 space-y-8 max-w-4xl mx-auto lg:mx-0">
          <h2 className="text-[1.65rem] sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold font-josefin leading-tight">
            We're Just Getting Started
          </h2>

          <p className="text-[1.1rem] sm:[1.1rem] md:text-lg lg:text-lg xl:text-xl font-inter text-white/80 max-w-4xl">
            TaskMaster AI is constantly evolving with your needs in mind. Here is a glimpse of what's coming soon:
          </p>

          {/* Feature List */}
          <div className="space-y-6 pt-4">
            {/* Item 1 */}
            <div className="group flex items-center gap-4 md:pl-4 md:pt-4 md:pb-4 sh rounded-xl transition hover:scale-105 hover:bg-[#253d2a] hover:shadow-xl">
              <div className="text-yellow-700 text-xl flex items-center justify-center w-11 h-11 md:w-13 md:h-13 p-1 md:p-2 rounded-full bg-white/15">
                <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 20 20"><path fill="currentColor" d="M12.5 4.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m5 .5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-13 2a2 2 0 1 0 0-4a2 2 0 0 0 0 4M6 9.25C6 8.56 6.56 8 7.25 8h5.5c.69 0 1.25.56 1.25 1.25V14a4 4 0 0 1-8 0zm-1 0c0-.463.14-.892.379-1.25H3.25C2.56 8 2 8.56 2 9.25V13a3 3 0 0 0 3.404 2.973A5 5 0 0 1 5 14zM15 14c0 .7-.144 1.368-.404 1.973Q14.794 16 15 16a3 3 0 0 0 3-3V9.25C18 8.56 17.44 8 16.75 8h-2.129c.24.358.379.787.379 1.25z"></path></svg>
              </div>
              <div>
                <h4 className="text-white font-semibold font-inter text-[1.1rem] sm:text-[1.1rem] md:text-lg lg:text-lg xl:text-xl">
                  Team collaboration boards
                </h4>
                <p className="text-white/80 text-[1.1rem] sm:text-[1.1rem] md:text-lg lg:text-lg xl:text-xl">
                  Work together seamlessly with shared workspaces and real-time updates.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="group flex flex-row-reverse md:flex-row items-center gap-4 pt-2 pb-2 md:pl-4 md:pt-4 md:pb-4 rounded-xl transition hover:scale-105 hover:bg-[#253d2a] hover:shadow-xl">
              <div className="text-yellow-700 text-xl flex items-center justify-center w-11 h-11 md:w-13 md:h-13 p-1 md:p-2 rounded-full bg-white/15">
                <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 48 48"><defs><mask id="ipSTimer0"><g fill="none" strokeWidth={4}><circle cx={24} cy={28} r={16} fill="#fff" stroke="#fff"></circle><path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M28 4h-8m4 0v8m11 4l3-3"></path><path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M24 28v-6m0 6h-6"></path></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSTimer0)"></path></svg>
              </div>
              <div>
                <h4 className="text-white font-semibold font-inter text-[1.1rem] sm:text-[1.1rem] md:text-lg lg:text-lg xl:text-xl">
                  Pomodoro & focus timer integrations
                </h4>
                <p className="text-white/80 text-[1.1rem] sm:text-[1.1rem] md:text-lg lg:text-lg xl:text-xl">
                  Stay focused and productive with built-in time management tools.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="group flex items-center gap-4 md:pl-4
              md:pt-4 md:pb-4 rounded-xl transition hover:scale-105 hover:bg-[#253d2a] hover:shadow-xl">
              <div className="text-yellow-700 text-xl flex items-center justify-center w-11 h-11 md:w-13 md:h-13 p-1 md:p-2 rounded-full bg-white/15">
                <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24"><path fill="currentColor" d="M12.5 6.5a5 5 0 1 1 10 0a5 5 0 0 1-10 0M2 2h9v9H2zm0 11h9v9H2zm11 0h9v9h-9z"></path></svg>
              </div>
              <div>
                <h4 className="text-white font-semibold font-inter text-[1.1rem] sm:text-[1.1rem] md:text-lg lg:text-lg xl:text-xl">
                  Third-party app sync
                </h4>
                <p className="text-white/80 text-[1.1rem] sm:text-[1.1rem] md:text-lg lg:text-lg xl:text-xl">
                  Seamlessly connect with Google Calendar, Slack, and more of your favorite tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
