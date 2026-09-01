import React, { useState } from "react";
import { Search, Bell, Settings, Menu, X } from "lucide-react";
import { sanitizeAlphanumeric } from "../../lib/validation";

export default function FacultyHeader({
  searchQuery,
  setSearchQuery,
  onNotificationClick,
  onSettingsClick,
  facultyDisplayName,
  onMenuToggle,
}) {
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);

  return (
    <header className="sticky top-0 w-full z-30 bg-[#0e150e]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-col justify-center">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Hamburger & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg bg-[#161d16] border border-white/10 text-[#4be277] hover:bg-[#242c24] cursor-pointer shrink-0"
            aria-label="Toggle Navigation"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4be277] to-[#22c55e] flex md:hidden items-center justify-center text-[#003915] font-black text-xs shrink-0">
              GM
            </div>
            <h1 className="text-base sm:text-xl font-bold text-[#4be277] tracking-tight truncate">
              GreenMate Challenge
            </h1>
          </div>
        </div>

        {/* Right: Search, Notifications, Settings, Profile */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Desktop Search Bar */}
          <div className="relative hidden md:block focus-within:ring-1 focus-within:ring-[#4be277] rounded-full transition-all">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bccbb9]"
            />
            <input
              type="text"
              maxLength={40}
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(sanitizeAlphanumeric(e.target.value, 40, 3))
              }
              placeholder="Search challenge entries..."
              className="bg-[#242c24] border border-white/10 text-[#dce5d9] placeholder-[#bccbb9]/50 rounded-full pl-9 pr-4 py-1.5 text-xs w-44 lg:w-60 focus:outline-none focus:border-[#4be277] transition-all"
            />
          </div>

          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
            className="md:hidden text-[#bccbb9] hover:text-[#4be277] p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Search"
          >
            {isSearchOpenMobile ? <X size={18} /> : <Search size={18} />}
          </button>

          {/* Notifications button */}
          <button
            onClick={onNotificationClick}
            className="text-[#bccbb9] hover:text-[#4be277] p-2 rounded-lg hover:bg-white/5 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4be277] rounded-full animate-pulse"></span>
          </button>

          {/* Settings button */}
          <button
            onClick={onSettingsClick}
            className="text-[#bccbb9] hover:text-[#4be277] p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Challenge Support & Settings"
          >
            <Settings size={18} />
          </button>

          {/* Faculty Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#4be277]/40 shadow-sm shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Faculty Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-[#dce5d9] truncate max-w-[110px]">
                {facultyDisplayName}
              </div>
              <div className="text-[10px] font-mono text-[#4be277] leading-none">
                Faculty
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {isSearchOpenMobile && (
        <div className="pt-3 pb-1 md:hidden animate-fade-in">
          <div className="relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bccbb9]"
            />
            <input
              type="text"
              maxLength={40}
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(sanitizeAlphanumeric(e.target.value, 40, 3))
              }
              placeholder="Search entries..."
              className="w-full bg-[#242c24] border border-white/15 text-[#dce5d9] placeholder-[#bccbb9]/50 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#4be277]"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
