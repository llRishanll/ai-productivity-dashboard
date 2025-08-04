export default function Welcome({ user, summary }) {
  return (
    <div className="fade-in-item bg-gradient-to-br from-[#213527BD] via-[#20432abd] to-[#55974E66] rounded-2xl p-8 shadow-lg h-full">
      {user ? (
        <>
          <p className="text-white/70 text-sm mb-2 font-inter font-light">Welcome back,</p>
          <h2 className="text-3xl font-josefin font-bold text-yellow-700 mb-8">
            {user.name || "User"}
          </h2>
          <p className="text-white/80 text-md mb-2 font-inter font-light">Glad to see you again!</p>
          {summary ? (
            <p className="text-white/90 leading-relaxed text-md font-inter font-light">{summary}</p>
          ) : (
            <p className="text-white/60 italic">Loading summary...</p>
          )}
        </>
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </div>
  );
}
