import TaskCard from "../components/TaskCard"
import Header from "../components/Header"
import { useEffect, useState } from "react"
import {fetchTasks} from "../api/tasks"

export default function ViewTasks() {
    const [tasks, setTasks] = useState([])
    const [loading,setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(()=> {
        fetchTasks().then(setTasks).catch((err) => setError(err.message)).finally(()=> setLoading(false))
    },[])

    if (loading) return <p className="text-center mt-8">Loading tasks...</p>
    if (error) return <p className="text-center mt-8">Error: {error}</p>

    return( 
        <>
            <Header/>
            <main className="p-0.5 max-w-3x1 mx-auto">
                <div className="min-h-screen bg-orange-50 p-6">
                    <div className="bg-white p-6 rounded-xl w-full max-w-xl mx-auto drop-shadow-lg mb-4">
                    <h1 className="text-xl font-medium text-center mb-6">My Tasks</h1>
                    {tasks.length === 0 ? 
                        (<p className="text-center text-gray-500">No tasks found.</p>):(tasks.map((task) => <TaskCard key={task.id} task={task}/>))
                    }
                    </div>
                </div>
            </main>    
        </>        
    )
}