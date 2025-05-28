import AddTaskForm from "../components/AddTaskForm"
import Header from "../components/Header"
import { useState } from "react";


export default function AddTask() {
    const [tasks, setTasks] = useState([]);
    return( 
        <>
            <Header/>
            <main className="bg-gray-100 p-0.5 max-w-3x1 mx-auto">
                <div className="min-h-screen bg-orange-50 p-6">
                    <AddTaskForm onTaskAdded={(newTask) => setTasks((prev) => [newTask, ...prev])} />  
                </div>
            </main>
        </>        
    )
}