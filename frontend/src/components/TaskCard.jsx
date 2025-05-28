
export default function TaskCard({task}){
    return(
        <div className="bg-white drop-shadow-lg p-4 rounded-xl w-full max-w-md mx-auto mb-4">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p className="text-sm text-gray-400 mt-2">Due:{task.due_date}</p>
            <span className={`text-xs font-medium mt-2 inline-block ${task.completed ? "text-green-500":"text-red-600"}`}>
                {task.completed ? "Completed":"Pending"}
            </span>
        </div>
    )
}
