export default function Footer() {
  return (
    <footer className="bg-[#213527] text-white px-6 md:px-26 py-4 text-sm pt-10 fade-in-group" data-stagger-delay="150">
      <div className="fade-in-item max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2.75fr_1fr_1fr_1fr] gap-10 lg:gap-50 border-b border-white/50 pb-10">

        {/* Left Column */}
        <div className="max-w-100">
          <h2 className="text-yellow-700 text-[1.1rem] md:text-2xl font-inter font-bold mb-4">LOGO</h2>
          <p className="text-white/90 font-inter font-light text-[1.1rem] md:text-xl mb-6">
            Intelligent task management powered by AI to help you achieve more with less effort.
          </p>

          <div className="flex items-center gap-4">
            {/* Social Icons */}
            <span className="w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M5 1a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4zm-.334 3.5a.75.75 0 0 0-.338 1.154l5.614 7.45l-5.915 6.345l-.044.051H6.03l4.83-5.179l3.712 4.928a.75.75 0 0 0 .337.251h4.422a.75.75 0 0 0 .336-1.154l-5.614-7.45L20.017 4.5h-2.05l-4.83 5.18l-3.714-4.928a.75.75 0 0 0-.337-.252z"></path>
              </svg>
            </span>
            <span className="w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width={31} height={31} viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.303 2.25H6.697A4.447 4.447 0 0 0 2.25 6.697v10.606a4.447 4.447 0 0 0 4.447 4.447h10.606a4.447 4.447 0 0 0 4.447-4.447V6.697a4.447 4.447 0 0 0-4.447-4.447m-8.46 15.742a.4.4 0 0 1-.4.423h-1.78a.41.41 0 0 1-.4-.412V10.6a.4.4 0 0 1 .4-.411h1.78a.4.4 0 0 1 .4.411zM7.52 8.632a1.467 1.467 0 1 1 .022-2.935A1.467 1.467 0 0 1 7.52 8.63m10.817 9.35a.39.39 0 0 1-.378.388H16.08a.39.39 0 0 1-.378-.389v-3.424c0-.511.156-2.223-1.356-2.223c-1.179 0-1.412 1.2-1.457 1.734v3.991a.39.39 0 0 1-.378.39h-1.823a.39.39 0 0 1-.389-.39v-7.493a.39.39 0 0 1 .39-.378h1.822a.39.39 0 0 1 .39.378v.645a2.59 2.59 0 0 1 2.434-1.112c3.035 0 3.024 2.835 3.024 4.447z"></path>
              </svg>
            </span>
            <span className="w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 16 16">
                <path fill="currentColor" d="M8 5.67C6.71 5.67 5.67 6.72 5.67 8S6.72 10.33 8 10.33S10.33 9.28 10.33 8S9.28 5.67 8 5.67M15 8c0-.97 0-1.92-.05-2.89c-.05-1.12-.31-2.12-1.13-2.93c-.82-.82-1.81-1.08-2.93-1.13C9.92 1 8.97 1 8 1s-1.92 0-2.89.05c-1.12.05-2.12.31-2.93 1.13C1.36 3 1.1 3.99 1.05 5.11C1 6.08 1 7.03 1 8s0 1.92.05 2.89c.05 1.12.31 2.12 1.13 2.93c.82.82 1.81 1.08 2.93 1.13C6.08 15 7.03 15 8 15s1.92 0 2.89-.05c1.12-.05 2.12-.31 2.93-1.13c.82-.82 1.08-1.81 1.13-2.93c.06-.96.05-1.92.05-2.89m-7 3.59c-1.99 0-3.59-1.6-3.59-3.59S6.01 4.41 8 4.41s3.59 1.6 3.59 3.59s-1.6 3.59-3.59 3.59m3.74-6.49c-.46 0-.84-.37-.84-.84s.37-.84.84-.84s.84.37.84.84a.8.8 0 0 1-.24.59a.8.8 0 0 1-.59.24Z"></path>
              </svg>
            </span>
            <span className="w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width={29} height={29} viewBox="0 0 32 32">
                <path fill="currentColor" d="M25.566 2.433H6.433c-2.2 0-4 1.8-4 4v19.135c0 2.2 1.8 4 4 4h19.135c2.2 0 4-1.8 4-4V6.433c-.002-2.2-1.8-4-4.002-4m-.257 14.483h-3.22v11.65h-4.818v-11.65h-2.41V12.9h2.41v-2.41c0-3.276 1.36-5.225 5.23-5.225h3.217V9.28h-2.012c-1.504 0-1.604.563-1.604 1.61l-.013 2.01h3.645l-.426 4.016z"></path>
              </svg>
            </span>
          </div>
        </div>

        {/* Product */}
        <div className="fade-in-item">
          <h3 className="font-semibold font-inter text-[1.1rem] md:text-2xl text-white mb-4">Product</h3>
          <ul className="space-y-4 text-white/70 text-sm md:text-lg font-inter font-light">
            <li>Features</li>
            <li>Pricing</li>
            <li>Integrations</li>
            <li>Enterprise</li>
            <li>Security</li>
          </ul>
        </div>

        {/* Resources */}
        <div className="fade-in-item">
          <h3 className="font-semibold font-inter text-[1.1rem] md:text-2xl text-white mb-4">Resources</h3>
          <ul className="space-y-4 text-white/70 text-sm md:text-lg font-inter font-light">
            <li>Blog</li>
            <li>Help Center</li>
            <li>Guides</li>
            <li>API Docs</li>
            <li>Community</li>
          </ul>
        </div>

        {/* Company */}
        <div className="fade-in-item">
          <h3 className="font-semibold font-inter text-[1.1rem] md:text-2xl text-white mb-4">Company</h3>
          <ul className="space-y-4 text-white/70 text-sm md:text-lg font-inter font-light">
            <li>Careers</li>
            <li>Press</li>
            <li>Contact</li>
            <li>Partners</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="fade-in-item max-w-[90rem] mx-auto flex flex-col md:flex-row justify-between items-center pt-6 text-white/50 text-sm md:text-lg gap-2 md:gap-0">
        <p>© 2025 TaskMaster AI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-yellow-700">Privacy Policy</a>
          <a href="#" className="hover:text-yellow-700">Terms of Service</a>
          <a href="#" className="hover:text-yellow-700">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
