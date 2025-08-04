import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { initFadeInOnScroll } from "../../utils/fadeInModule";
import { CheckCircle, Pencil, Trash2, ArrowDownWideNarrow, ChevronLeft, ChevronRight, Search } from "lucide-react";


const baseUrl = import.meta.env.VITE_API_URL;

export default function Tasks({ refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);


  useEffect(() => {
    initFadeInOnScroll();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    fetchTasks();
  }, [filter, sort, order, page, limit, debouncedSearch, refreshTrigger]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "",
    recurring: "none",
  });

  const [editTaskData, setEditTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "",
    completed: false,
    recurring: "none",
  });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({
        limit: limit,
        offset: (page - 1) * limit,
        order: order,
        sort_by: sort,
      });

      if (filter === "completed") query.append("completed", true);
      else if (filter === "pending") query.append("completed", false);
      else if (["Low", "Medium", "High"].includes(filter)) query.append("priority", filter);
      if (debouncedSearch.trim()) query.append("search", debouncedSearch.trim());

      const res = await fetch(`${baseUrl}/tasks?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
        setTotalTasks(data.total_tasks);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const markTaskAsDone = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });

      if (res.ok) {
        fetchTasks(); // Refresh list
      } else {
        console.error("Failed to mark task as completed");
      }
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  const handleConfirm = (message, onConfirm) => {
    setConfirmMessage(message);
    setConfirmAction(() => onConfirm);
    setShowConfirm(true);
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchTasks();
      } else {
        console.error("Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const deleteCompletedTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/tasks/delete-completed`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchTasks();
      } else {
        console.error("Failed to delete completed tasks");
      }
    } catch (err) {
      console.error("Error deleting completed tasks:", err);
    }
  };

  const handleUpdateTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: editTaskData.title || null,
        description: editTaskData.description?.trim() || null,
        due_date: editTaskData.due_date || null,
        priority: editTaskData.priority || null,
        completed: editTaskData.completed === "true",
        recurring: editTaskData.recurring || "none",
      };

      const res = await fetch(`${baseUrl}/tasks/${editTaskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowEditForm(false);
        setEditTaskId(null);
        fetchTasks();
      } else {
        console.error("Failed to update task");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      setTitleError("Title is required.");
      return;
    } else {
      setTitleError(""); // Clear error if valid
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...newTask,
        due_date: newTask.due_date || null,
        description: newTask.description?.trim() || null,
        priority: newTask.priority || null,
        recurring: newTask.recurring || "none",
      };
      const res = await fetch(`${baseUrl}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddForm(false);
        setNewTask({
          title: "",
          description: "",
          due_date: "",
          priority: "",
          recurring: "None",
        });
        setTitleError(""); // Reset on success
        fetchTasks(); // Refresh task list
      } else {
        console.error("Failed to add task");
      }
    } catch (err) {
      console.error("Error adding task", err);
    }
  };



  return (
    <motion.div
      className="text-white space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="fade-in-group space-y-6" data-stagger-delay="100">
        {/* Task List Section */}
        <div className="fade-in-item bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] rounded-2xl p-6 shadow-lg min-h-[300px] relative">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold text-yellow-700 font-josefin">Tasks</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-yellow-700 hover:bg-yellow-800 text-white font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                + Add Task
              </button>
              <button
                onClick={() =>
                  handleConfirm("Are you sure you want to delete all completed tasks?", deleteCompletedTasks)
                }
                className="bg-[#2e4736] hover:bg-[#365c42] text-white px-4 py-2 rounded-xl flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 size={18} />
                Delete Completed
              </button>

            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center py-3 rounded-xl w-fit">
            {/* Search Input */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 bg-[#2e4736] text-white rounded-xl w-64 font-inter placeholder-white/60 focus:ring-2 focus:ring-yellow-700"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
                <Search size={18} />
              </div>
            </div>
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-[#2e4736] text-white font-inter pl-4 pr-10 py-2 rounded-xl w-44 focus:ring-2 focus:ring-yellow-700 transition cursor-pointer"
              >
                <option value="">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-white/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a.75.75 0 0 1-.53-.22l-3-3a.75.75 0 1 1 1.06-1.06L10 10.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3A.75.75 0 0 1 10 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Sort Dropdown + Arrow */}
            <div className="relative flex items-center gap-2">
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-[#2e4736] text-white font-inter pl-4 pr-10 py-2 rounded-xl w-44 focus:ring-2 focus:ring-yellow-700 transition cursor-pointer"
              >
                <option value="created_at">Created Date</option>
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
              </select>
              <div className="absolute inset-y-0 right-9 flex items-center pointer-events-none text-white/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a.75.75 0 0 1-.53-.22l-3-3a.75.75 0 1 1 1.06-1.06L10 10.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3A.75.75 0 0 1 10 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <button
                onClick={() => setOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="text-white hover:text-yellow-700 transition cursor-pointer"
              >
                <ArrowDownWideNarrow
                  size={22}
                  className={`transition-transform duration-200 ${
                    order === "asc" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>


          {/* Task Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pt-4 space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="bg-gradient-to-br from-[#1e4429bd] via-[#20432abd] to-[#55974E66] p-4 rounded-xl shadow-md flex flex-col justify-between">
                <div>
                  {/* Title & Description */}
                  <h3 className="font-semibold font-inter text-2xl text-yellow-700 mb-1 truncate">{task.title}</h3>

                  <p className="text-white/70 text-md mb-3 font-inter font-light line-clamp-2 h-12">{task.description || task.title}</p>


                  {/* Meta Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-md font-inter font-light text-white/80 pt-6">
                    <div><span className="font-bold font-inter text-white/80">Due:</span> {task.due_date || "—"}</div>
                    <div><span className="font-bold font-inter text-white/80">Priority:</span> {task.priority || "—"}</div>
                    <div><span className="font-bold font-inter text-white/80">Completed:</span> {task.completed ? "Yes" : "No"}</div>
                    <div><span className="font-bold font-inter text-white/80">Recurring:</span> {task.recurring || "—"}</div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex justify-center gap-8 mt-4 pt-6">
                  <button
                    onClick={() => markTaskAsDone(task.id)}
                    className="w-24 bg-[#1e4429] rounded-2xl p-2 flex justify-center items-center gap-1 text-white/90 hover:bg-green-700 transition text-md font-inter cursor-pointer"
                  >
                    <CheckCircle size={18} />
                    Done
                  </button>
                  <button 
                  onClick={() => {
                    setEditTaskId(task.id);
                    setEditTaskData({
                      title: task.title || "",
                      description: task.description || "",
                      due_date: task.due_date || "",
                      priority: task.priority || "",
                      completed: task.completed || false,
                      recurring: task.recurring || "none",
                    });
                    setShowEditForm(true);
                  }}
                  className="w-24 bg-[#1e4429] rounded-2xl p-2 flex justify-center items-center gap-1 text-white/90 hover:bg-yellow-700 transition text-md font-inter cursor-pointer">
                    <Pencil size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleConfirm("Are you sure you want to delete this task?", () => deleteTask(task.id))}
                    className="w-24 bg-[#1e4429] rounded-2xl p-2 flex justify-center items-center gap-1 text-white/90 hover:bg-red-700 transition text-md font-inter cursor-pointer"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-white/90 font-inter text-sm">

            {/* Page Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-4 py-2 bg-[#2e4736] rounded-xl hover:bg-[#365c42] transition disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <span className="px-4 py-2 bg-[#1e4429] rounded-xl text-white/90">Page: {page}</span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page * limit >= totalTasks}
                className="flex items-center gap-1 px-4 py-2 bg-[#2e4736] rounded-xl hover:bg-[#365c42] transition disabled:opacity-40 cursor-pointer"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            {/* Limit Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="limit" className="text-white/70">Tasks per page:</label>
              <div className="relative">
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="appearance-none bg-[#2e4736] text-white font-inter text-sm pl-4 pr-10 py-2 rounded-xl w-16 focus:ring-2 focus:ring-yellow-700 transition cursor-pointer"
                >
                  {[3, 6, 9, 12].map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-white/70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 12a.75.75 0 0 1-.53-.22l-3-3a.75.75 0 1 1 1.06-1.06L10 10.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3A.75.75 0 0 1 10 12z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#213527] p-8 rounded-2xl text-center shadow-2xl w-[22rem] space-y-6 border border-white/10">
            <p className="text-white text-lg font-inter leading-relaxed">
              {confirmMessage}
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  confirmAction();
                  setShowConfirm(false);
                }}
                className="bg-yellow-700 hover:bg-yellow-800 text-white font-semibold px-5 py-2 rounded-xl transition font-inter cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-[#2e4736] hover:bg-[#365c42] text-white px-5 py-2 rounded-xl transition font-inter cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#213527] p-8 rounded-2xl w-[26rem] text-white font-inter border border-white/10 shadow-xl">
            <h3 className="text-2xl font-bold font-josefin text-yellow-700">Add New Task</h3>
            <div className="text-sm">
              <p className="text-white/90 font-semibold font-inter pt-6 pb-1 ml-1.5">Title:</p>
              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => {
                  setNewTask({ ...newTask, title: e.target.value });
                  if (titleError) setTitleError(""); // clear on typing
                }}
                className={`w-full p-2 rounded-lg bg-[#2e4736] placeholder-white/60 ${titleError ? "ring-2 ring-red-900" : ""}`}
              />
              {titleError && (
                <p className="text-red-500 text-sm mt-1">{titleError}</p>
              )}
              <p className="text-white/90 font-inter font-semibold pt-6 pb-1 ml-1.5">Description:</p>
              <textarea
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#2e4736] placeholder-white/60 resize-none"
              />
              <p className="text-white/90 font-inter font-semibold pt-6 pb-1 ml-1.5">Due Date:</p>
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#2e4736] text-white/60"
              />
              <p className="text-white/90 font-inter font-semibold pt-6 pb-1 ml-1.5">Priority:</p>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#2e4736] text-white/60"
              >
                <option value="">Priority (optional)</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <p className="text-white/90 font-inter font-semibold pt-6 pb-1 ml-1.5">Recurring:</p>
              <select
                value={newTask.recurring}
                onChange={(e) => setNewTask({ ...newTask, recurring: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#2e4736] text-white/60"
              >
                <option value="none">Not Recurring</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button
                onClick={handleAddTask}
                className="bg-yellow-700 hover:bg-yellow-800 text-white font-semibold px-5 py-2 rounded-xl transition cursor-pointer font-inter"
              >
                + Add Task
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-[#2e4736] hover:bg-[#365c42] text-white px-5 py-2 rounded-xl transition w-33 cursor-pointer font-inter"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#213527] p-8 rounded-2xl w-[26rem] text-white font-inter border border-white/10 shadow-xl">
            <h3 className="text-2xl font-bold font-josefin text-yellow-700">Edit Task</h3>
            <div className="text-sm">
              <p className="text-white/90 font-semibold pt-6 pb-1 ml-1.5">Title:</p>
              <input
                type="text"
                value={editTaskData.title}
                onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#2e4736] placeholder-white/60"
              />

              <p className="text-white/90 font-semibold pt-6 pb-1 ml-1.5">Description:</p>
              <textarea
                value={editTaskData.description}
                onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#2e4736] placeholder-white/60 resize-none"
              />

              <p className="text-white/90 font-semibold pt-6 pb-1 ml-1.5">Due Date:</p>
              <input
                type="date"
                value={editTaskData.due_date}
                onChange={(e) => setEditTaskData({ ...editTaskData, due_date: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#2e4736] text-white/60"
              />

              <p className="text-white/90 font-semibold pt-6 pb-1 ml-1.5">Priority:</p>
              <select
                value={editTaskData.priority}
                onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#2e4736] text-white/60"
              >
                <option value="">Priority (optional)</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <p className="text-white/90 font-semibold pt-6 pb-1 ml-1.5">Completed:</p>
              <select
                value={editTaskData.completed}
                onChange={(e) => setEditTaskData({ ...editTaskData, completed: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#2e4736] text-white/60"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>

              <p className="text-white/90 font-semibold pt-6 pb-1 ml-1.5">Recurring:</p>
              <select
                value={editTaskData.recurring}
                onChange={(e) => setEditTaskData({ ...editTaskData, recurring: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#2e4736] text-white/60"
              >
                <option value="none">Not Recurring</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button
                onClick={handleUpdateTask}
                className="bg-yellow-700 hover:bg-yellow-800 text-white font-semibold px-5 py-2 rounded-xl transition cursor-pointer"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditForm(false)}
                className="bg-[#2e4736] hover:bg-[#365c42] text-white px-5 py-2 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


    </motion.div>
  );
}
