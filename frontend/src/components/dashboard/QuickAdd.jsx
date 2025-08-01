import { useState } from "react";

export default function QuickAdd({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        if (onTaskAdded) onTaskAdded();
      } else {
        console.error("Failed to add task");
      }
    } catch (err) {
      console.error("Error adding task", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in-item bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] rounded-2xl p-8 shadow-lg h-full">
      <h3 className="text-xl font-josefin font-bold text-yellow-700 mb-4">
        Quick Add Task
      </h3>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#2e4736] text-white placeholder-white/60 p-3 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-yellow-700 transition "
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-[#2e4736] text-white placeholder-white/60 p-3 rounded-lg font-inter text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-700 transition"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-yellow-700 hover:bg-yellow-800 transition text-white font-inter text-sm font-medium rounded-xl px-4 py-2 
          cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>
    </div>
  );
}
