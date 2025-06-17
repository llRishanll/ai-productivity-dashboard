export default function CallToAction() {
  return (
    <section className="w-full bg-[#213527] text-white px-6 py-24 flex flex-col items-center text-center space-y-8">
      {/* Top Line */}
      <p className="text-yellow-700 text-2xl font-inter">
        Join thousands of productive users
      </p>

      {/* Heading */}
      <h2 className="text-3xl md:text-6xl font-bold font-josefin leading-tight max-w-6xl">
        Ready to transform your productivity?
      </h2>

      {/* Subtext */}
      <p className="text-white/80 text-base md:text-2xl max-w-4xl">
        Experience the power of AI-driven task management with our 14-day free trial.
        <br />
        No credit card required.
      </p>

      {/* Email Input + Button */}
      <form className="mt-6 flex flex-col sm:flex-row items-center gap-4 bg-[#1A1A1A]/90 px-2 py-2 rounded-md w-full max-w-xl">
        <input
          type="email"
          placeholder="Enter your email address"
          className="bg-transparent outline-none text-white/80 text-lg placeholder-white/40 w-full px-2 py-2 font-inter"
        />
        <button
          type="submit"
          className="bg-yellow-700 hover:bg-yellow-800 text-white text-xl px-6 py-2 rounded-md transition font-inter w-full max-w-40"
        >
          Get Started
        </button>
      </form>

      {/* Terms Text */}
      <p className="text-white/40 text-lg mt-[-1rem]">
        By signing up, you agree to our{" "}
        <span className="text-yellow-700 hover:underline cursor-pointer">Terms</span>{" "}
        and{" "}
        <span className="text-yellow-700 hover:underline cursor-pointer">Privacy Policy</span>.
      </p>
    </section>
  );
}
