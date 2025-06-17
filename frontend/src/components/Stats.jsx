export default function Stats() {
  return (
    <section className="relative w-full min-h-[34rem] bg-[#132418] py-31 px-6 md:px-12 lg:px-32 overflow-hidden flex items-center justify-center">
      {/* Grid Overlay Background */}
      <div className="absolute inset-0 z-0">
        {/* Vertical lines */}
        <div className="absolute inset-6 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
        {/* Horizontal lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px]" />
        {/* Green Diagonal overlay */}
        <div className="absolute inset-0 bg-linear-to-l from-transparent via-[#132418]/50 to-[#132418] rotate-135 scale-110 opacity-100" />
        {/* White Diagonal overlay */}
        <div className="absolute inset-0 bg-linear-to-l from-transparent via-white/40 to-white rotate-136 scale-95 opacity-5 mr-40" />
      </div>

      {/* Stats Content */}
      <div className="relative z-10 bg-[#213527] rounded-2xl px-6 py-10 md:px-26 md:py-12 w-full max-w-[87rem] min-h-[20rem] max-h-[20rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 items-center justify-items-center text-center md:text-left">
        {/* Stat 1 */}
        <div className="flex flex-col items-start">
          <h3 className="text-5xl md:text-7xl font-bold text-white font-inter">
            98<span className="text-yellow-700">%</span>
          </h3>
          <div className="w-28 h-0.75 mt-6 mb-2 bg-white/90 mx-auto md:mx-0" />
          <p className="text-white/90 text-[1.65rem] leading-tight font-inter font-light">User<br />satisfaction</p>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col items-start">
          <h3 className="text-5xl md:text-7xl font-inter font-bold text-white">
            32<span className="text-yellow-700">%</span>
          </h3>
          <div className="w-28 h-0.75 mt-6 mb-2 bg-white/90 mx-auto md:mx-0" />
          <p className="text-white/90 text-[1.65rem] leading-tight font-inter font-light">Productivity<br />increase</p>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col items-start ml-10">
          <h3 className="text-5xl md:text-7xl font-bold font-inter text-white">
            250<span className="text-yellow-700">K+</span>
          </h3>
          <div className="w-28 h-0.75 mt-6 mb-2 bg-white/90 mx-auto md:mx-0" />
          <p className="text-white/90 text-[1.65rem] leading-tight font-inter font-light">Active<br />users</p>
        </div>

        {/* Stat 4 */}
        <div className="flex flex-col items-start">
          <h3 className="text-5xl md:text-7xl font-bold font-inter text-white">
            4.8<span className="text-yellow-700">+</span>
          </h3>
          <div className="w-28 h-0.75 mt-6 mb-2 bg-white/90 mx-auto md:mx-0" />
          <p className="text-white/90 text-[1.65rem] leading-tight font-inter font-light">App Store<br />rating</p>
        </div>
      </div>
    </section>
  );
}
