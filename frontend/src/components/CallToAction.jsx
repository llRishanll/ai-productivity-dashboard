import { useNavigate } from "react-router-dom";

export default function CallToAction() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailInput = e.target.elements.email;
    const email = emailInput.value.trim();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    // browser will enforce basic pattern because type="email"
    navigate(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="w-full bg-[#213527] text-white px-6 py-24 flex flex-col items-center text-center space-y-8 fade-in-group" data-stagger-delay="150">
      {/* Top Line */}
      <p className="fade-in-item text-yellow-700 text-[1.1rem] md:text-2xl font-inter">
        Join thousands of productive users
      </p>

      {/* Heading */}
      <h2 className="fade-in-item text-[1.82rem] md:text-6xl font-bold font-josefin leading-tight max-w-6xl">
        Ready to transform your productivity?
      </h2>

      {/* Subtext */}
      <p className="fade-in-item text-white/80 text-[1.1rem] md:text-2xl max-w-4xl">
        Experience the power of AI-driven task management with our 14-day free trial.
        <br />
        No credit card required.
      </p>

      {/* Email Input + Button */}
      <form
        onSubmit={handleSubmit}
        className="fade-in-item mt-6 flex flex-col sm:flex-row items-center gap-4 bg-[#1A1A1A]/90 px-2 py-2 rounded-md w-full max-w-xl"
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
          className="bg-transparent outline-none text-white/80 text-[1.1rem] text-center md:text-left md:text-lg placeholder-white/40 w-full px-2 py-2 font-inter md:border-none border-2 border-white/10 rounded-md transition duration-300 focus:border-yellow-700 focus:ring-2 focus:ring-yellow-700 focus:ring-opacity-50"
        />
        <button
          type="submit"
          className="bg-yellow-700 hover:bg-yellow-800 text-white text-md md:text-xl px-6 py-2 rounded-md transition duration-300 font-inter md:w-full max-w-65 md:max-w-40 cursor-pointer hover:scale-105"
        >
          Get Started
        </button>
      </form>

      {/* Terms Text */}
      <p className="fade-in-item text-white/40 text-xs md:text-lg mt-[-1rem]">
        By signing up, you agree to our{" "}
        <span className="text-yellow-700 hover:underline cursor-pointer">Terms</span>{" "}
        and{" "}
        <span className="text-yellow-700 hover:underline cursor-pointer">Privacy Policy</span>.
      </p>
    </section>
  );
}
