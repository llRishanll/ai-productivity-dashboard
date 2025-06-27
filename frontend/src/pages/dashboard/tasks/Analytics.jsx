import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar
} from "recharts";

const COLORS = ["#A85F00", "#C3711A", "#DEA24D"]; // yellow shades

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchAnalytics();
  }, []);

  if (!stats) return <div className="p-6 text-white">Loading analytics...</div>;

  const priorityData = [
    { name: "High", value: stats.high_priority ?? 0 },
    { name: "Medium", value: stats.medium_priority ?? 0 },
    { name: "Low", value: stats.low_priority ?? 0 },
  ];

  const taskData = [
    { name: "Total", value: stats.total_tasks },
    { name: "Completed", value: stats.completed_tasks },
  ];

  const completionRate = stats.completion_rate ?? 0;
  const chartData = [
    { name: "Completion", value: stats.completion_rate, fill: "#A85F00" }, // visible ring
    { name: "Remaining", value: 100 - stats.completion_rate, fill: "#213527" }, // same as background
  ];

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-8">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 📊 Priority Pie Chart */}
        <div className="bg-[#213527] p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Task Priorities</h3>
          <PieChart width={250} height={250}>
            <Pie
              data={priorityData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {priorityData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* 📊 Bar Chart */}
        <div className="bg-[#213527] p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Task Overview</h3>
          <BarChart width={300} height={250} data={taskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#A85F00" />
          </BarChart>
        </div>

        {/* 📈 Completion Radial Chart */}
        <div className="bg-[#213527] p-4 rounded-xl flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold mb-4">Completion Rate</h3>
          <div className="relative w-[200px] h-[200px]">
            <RadialBarChart
              width={200}
              height={200}
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="105%"
              barSize={20}
              data={chartData}
              startAngle={90}
              endAngle={450}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                clockWise
                background={false} // hide default background
              />
            </RadialBarChart>

            <div className="mb-2 absolute inset-0 flex items-center justify-center text-yellow-700 text-2xl font-bold">
              {stats.completion_rate}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
