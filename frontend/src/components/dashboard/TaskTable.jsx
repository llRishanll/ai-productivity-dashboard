export default function TaskTable({ tasks = [] }) {
  return (
    <div className="fade-in-item bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] rounded-2xl p-6 shadow-lg overflow-x-auto h-full min-h-[320px]">
      <h3 className="text-xl font-bold text-yellow-700 mb-4 font-josefin">
        Recent Tasks
      </h3>

      <table className="min-w-full text-left text-sm text-white/90 font-inter">
        <thead className="border-b border-white/20 text-white/70 text-xs uppercase tracking-wide">
          <tr>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id} className="border-b border-white/10 hover:bg-white/5 transition">
                <td className="py-3 px-4">{task.title}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      task.completed
                        ? "bg-green-700 text-white"
                        : "bg-yellow-700 text-white"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 px-4 text-center text-white/70 italic">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
