export default function AIGenerateTask() {
  return (
    <div className="bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] rounded-2xl p-6 shadow-lg w-full lg:w-1/2 min-h-[200px]">
      <h2 className="text-xl font-bold text-yellow-700 mb-4 font-josefin">
        AI Generate Task
      </h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Describe your task..."
          className="flex-1 bg-[#2e4736] text-white px-4 py-2 rounded-xl placeholder-white/50"
        />
        <button className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-xl transition shrink-0">
          Send
        </button>
      </div>
    </div>
  );
}
