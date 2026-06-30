export default function Footer() {
  return (
    <footer className="bg-[#050806] border-t border-emerald-950/40 text-gray-400 pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Footer Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 pb-12 border-b border-emerald-950/30">
          {/* Branding Column */}
          <div className="md:col-span-5 space-y-5">
            <h3 className="text-lg font-bold text-emerald-400 tracking-wide">
              GreenQuest
            </h3>
            <p className="text-sm text-gray-400/80 max-w-sm leading-relaxed">
              Empowering global citizens to reverse climate change through
              data-driven daily actions and AI verification.
            </p>
            {/* Social Icons Stack */}
            <div className="flex items-center space-x-3 pt-2">
              {/* Twitter / X icon */}
              <a
                href="#twitter"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-emerald-950 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram icon */}
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-emerald-950 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" h="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns Layout */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6">
            {/* Platform links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-200 tracking-wider uppercase">
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="#hub"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Impact Hub
                  </a>
                </li>
                <li>
                  <a
                    href="#quests"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Quests
                  </a>
                </li>
                <li>
                  <a
                    href="#leaderboard"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Leaderboard
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-200 tracking-wider uppercase">
                Resources
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="#sdgs"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Sustainability SDGs
                  </a>
                </li>
                <li>
                  <a
                    href="#api"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    API Status
                  </a>
                </li>
                <li>
                  <a
                    href="#guidance"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Eco-Guidance
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-200 tracking-wider uppercase">
                Legal
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="#privacy"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Privacy Protocol
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer Credits Line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium tracking-wide">
          <div>
            <span>
              &copy; 2026 GreenQuest AI. Accelerating the Global Goals.
            </span>
          </div>
          {/* SDG Badges matching your layout color blocks */}
          <div className="flex items-center space-x-3">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              SDGs Impacted:
            </span>
            <div className="flex space-x-1.5 font-bold text-white text-[10px] text-center">
              <span className="w-5 h-5 flex items-center justify-center bg-[#e5243b] rounded-[3px]">
                13
              </span>
              <span className="w-5 h-5 flex items-center justify-center bg-[#4c9f38] rounded-[3px]">
                15
              </span>
              <span className="w-5 h-5 flex items-center justify-center bg-[#26bde2] rounded-[3px]">
                06
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
