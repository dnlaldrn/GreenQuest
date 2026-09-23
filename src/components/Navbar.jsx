import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Tracks which link was clicked so the color updates immediately,
  // independent of (and in sync with) the URL hash.
  const [activeLink, setActiveLink] = useState(location.hash || "");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keep activeLink in sync if the hash changes some other way
  // (back/forward navigation, direct link, etc.)
  useEffect(() => {
    setActiveLink(location.hash || "");
  }, [location.hash]);

  const navLinks = [
    { name: "How it Works", path: "#how-it-works" },
    { name: "Features", path: "#features" },
    { name: "Leaderboard", path: "#leaderboard" },
  ];

  const checkIsActive = (path) => {
    if (path.startsWith("#")) {
      return activeLink === path;
    }
    return location.pathname === path && !activeLink;
  };

  const handleLinkClick = (path) => {
    if (path.startsWith("#")) {
      setActiveLink(path);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#070b09]/80 backdrop-blur-xl border-b border-emerald-500/15 py-3 shadow-xl shadow-black/40"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link
          to="/"
          onClick={() => setActiveLink("")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-400/60 group-hover:bg-emerald-500/20 transition-all duration-300 shadow-lg shadow-emerald-500/10">
            <svg
              className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
            Green<span className="text-emerald-400">Quest</span>
          </span>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#101714]/60 border border-emerald-500/10 p-1.5 rounded-full backdrop-blur-md shadow-inner">
          {navLinks.map((link) => {
            const isAnchor = link.path.startsWith("#");
            const isActive = checkIsActive(link.path);

            return isAnchor ? (
              <a
                key={link.name}
                href={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`relative px-4 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 shadow-sm shadow-emerald-500/20"
                    : "text-gray-300 border border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`relative px-4 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 shadow-sm shadow-emerald-500/20"
                    : "text-gray-300 border border-transparent hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions / Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-xs font-semibold tracking-wide text-gray-300 hover:text-emerald-400 active:text-emerald-500 transition-colors px-3 py-2"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-bold rounded-lg group bg-gradient-to-br from-emerald-400 to-emerald-600 group-hover:from-emerald-400 group-hover:to-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 transition-all duration-300 hover:scale-[1.02]"
          >
            <span className="px-4 py-2 transition-all ease-in duration-75 rounded-md bg-opacity-0">
              Get Started
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-emerald-400 active:text-emerald-500 p-2 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b09]/95 border-b border-emerald-500/15 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isAnchor = link.path.startsWith("#");
              const isActive = checkIsActive(link.path);

              return isAnchor ? (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors active:bg-emerald-500/25 ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors active:bg-emerald-500/25 ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 border-t border-emerald-950/80 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white bg-white/5"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}