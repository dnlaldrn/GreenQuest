
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

        {/* Divider line */}
        <div className="h-5 w-[1px] bg-emerald-900/40" />

        {/* Notification Bell SVG */}
        <button className="text-emerald-500/80 hover:text-emerald-400 transition-colors p-1 rounded-full hover:bg-emerald-950/30">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* Settings Gear SVG */}
        <button className="text-emerald-500/80 hover:text-emerald-400 transition-colors p-1 rounded-full hover:bg-emerald-950/30">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* Profile Avatar */}
        <div className="relative group cursor-pointer">
          <div className="w-9 h-9 rounded-full ring-2 ring-emerald-500/40 overflow-hidden bg-emerald-950 flex items-center justify-center transition-all group-hover:ring-emerald-400">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
