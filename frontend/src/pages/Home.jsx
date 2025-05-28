import Header from "../components/Header"
const baseUrl = import.meta.env.VITE_APP_URL

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#1e3226] text-white overflow-x-hidden">
      <Header />

      {/* Landing Section */}
      <section
        className="relative h-screen flex flex-col justify-center items-center bg-fixed bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/landing-bg.png')" }}>
        <div className="bg-transparent p-8 rounded-md text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            Welcome to TaskMaster AI
          </h1>
          <p className="mt-4 text-xl text-white max-w-xl mx-auto">
            Manage your tasks effortlessly with smart assistance
          </p>
          <a
            href="#features"
            className="mt-8 inline-block px-6 py-3 bg-yellow-700 text-white rounded-md shadow-lg hover:bg-yellow-800 hover:scale-105 transition duration-300">
            Explore Features
          </a>
        </div>
      </section>

      <div className="h-24 bg-gradient-to-t from-[#121f17] to-transparent"></div>

      <section
        id="features"
        className="bg-gradient-to-b from-[#121f17] to-[#0c140f] text-white px-6 py-24">
        <div className="h-50 max-w-4xl mx-auto">
          <h2 className="text-7xl font-bold mb-6 text-center">What You Can Do</h2></div>
        <div className="max-w-6xl mx-auto grid gap-32">
          <div className="grid md:grid-cols-2 gap-32 items-center">
            <div className="text-left">
              <h2 className="text-3xl md:text-5xl font-semibold mb-4">1. AI Insights</h2>
              <p className="text-xl leading-relaxed">
                Unlock personalized insights and task suggestions powered by AI. Let smart features help optimize your time.
              </p>
              <a
                href={baseUrl + "/"}
                className="text-yellow-700 text-lg hover:underline font-semibold"
              >
                Explore now →
              </a>
            </div>
            <div className="h-100 flex items-center justify-center">
              <img
                src="/src/assets/OpenAI-logo.png"
                alt="TaskMaster AI"
                className="h-70 w-auto object-contain"
              />
            </div>
          </div>          
          <div className="grid md:grid-cols-2 gap-40 items-center">
            <div className="h-100 flex items-center justify-center">
              <img
                src="/src/assets/add-task.png"
                alt="TaskMaster AI"
                className="h-65 w-auto object-contain"
              />
            </div>
            <div className="text-left">
              <h2 className="text-3xl md:text-5xl font-semibold mb-4">2. Add Tasks</h2>
              <p className="text-xl leading-relaxed">
                Easily add new tasks to your schedule with a streamlined input form. Stay productive and organized without hassle.
              </p>
              <a
                href={baseUrl + "/add-tasks"}
                className="text-yellow-700 text-lg hover:underline font-semibold"
              >
                Explore now →
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-32 items-center md:flex-row-reverse">
            <div className="text-left">
              <h2 className="text-3xl md:text-5xl font-semibold mb-4">3. View & Track</h2>
              <p className="text-xl leading-relaxed">
                Get a clear view of your current and completed tasks. Use visual cues and intuitive filters to track progress.
              </p>
              <a
                href={baseUrl + "/view-tasks"}
                className="text-yellow-700 text-lg hover:underline font-semibold"
              >
                Explore now →
              </a>
            </div>
            <div className="h-100 flex items-center justify-center">
              <img
                src="/src/assets/view-task.png"
                alt="TaskMaster AI"
                className="h-60 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
