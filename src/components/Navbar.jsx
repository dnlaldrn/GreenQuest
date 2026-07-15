import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#0a0f0d] border-b border-emerald-950/30 px-6 py-4 flex items-center justify-between text-white backdrop-blur-md bg-opacity-95 shadow-lg shadow-emerald-950/5">
      {/* Left: Brand Logo */}
      <div className="flex items-center">
        <span className="text-xl font-semibold tracking-wide text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors">
          GreenQuest
        </span>
      </div>

      {/* Right: Actions, Navigation, and Profile */}
      <div className="flex items-center space-x-6">
        {/* Auth Buttons */}
        <div className="flex items-center space-x-4 mr-2">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-neutral-950 px-4 py-2 rounded-md font-semibold shadow-md shadow-emerald-900/20 transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
