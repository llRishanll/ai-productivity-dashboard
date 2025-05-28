import { useState } from "react";
const baseUrl = import.meta.env.VITE_API_URL

export default function AddTaskForm({onTaskAdded}) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()

        const token = localStorage.getItem("token")
        const response = await fetch(`${baseUrl}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                description,
                due_date : dueDate || null,
            })
        })
        if (!response.ok) {
            alert("Failed to add task")
            return
        }
        const newTask = await response.json()
        onTaskAdded(newTask)
        setTitle("")
        setDescription("")
        setDueDate("")
        setSuccessMessage("Task added successfully!")
        setTimeout(()=>{
            setSuccessMessage("")
        },3000)
    }
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-xl mx-auto drop-shadow-lg mb-4">
            <h2 className="text-lg font-medium text-center mb-4">Add New Task</h2>
            {successMessage && (
                <div className="mb-4 text-green-700 text-center bg-green-100 border border-green-300 rounded p-3 text-sm">
                    {successMessage}
                </div>
            )}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date (optional)
                    </label>
                    <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white drop-shadow-lg px-5 py-3 rounded hover:bg-blue-700 transition mx-auto block">
                    Add Task
                </button>
            </form>
        )
    }