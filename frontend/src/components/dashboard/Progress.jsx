import { useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Progress() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/analytics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPercent(data.completion_rate || 0);
        }
      } catch (err) {
        console.error("Error fetching analytics", err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="fade-in-item bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] rounded-2xl p-8 shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-bold text-yellow-700 mb-6 font-josefin">
        Progress Tracking
      </h3>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-50 h-50">
          <CircularProgressbarWithChildren
            value={percent}
            styles={buildStyles({
              pathColor: "#45d48a",
              trailColor: "#2e4736",
            })}
          >
            <div className="text-center">
              <p className="text-5xl font-bold text-white mb-2 font-josefin">{percent.toFixed(1)}</p>
              <p className="text-white/60 text-sm font-inter mt-1 leading-tight">
                Completion<br />Rate
              </p>
            </div>
          </CircularProgressbarWithChildren>
        </div>
      </div>
    </div>
  );
}
