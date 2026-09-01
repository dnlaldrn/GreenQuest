import React from "react";
import {
  LayoutDashboard,
  Leaf,
  Trophy,
  Gavel,
  HelpCircle,
  Plus,
  LogOut,
  X,
} from "lucide-react";

export default function FacultySidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  onLogout,
  onNewEntryClick,
}) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-entries", label: "My Entries", icon: Leaf },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "rules", label: "Rules", icon: Gavel },
    { id: "support", label: "Support", icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 w-64 bg-[#0e150e] md:bg-[#0e150e]/90 backdrop-blur-2xl border-r border-white/10
          p-4 flex flex-col justify-between z-50 shrink-0
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 h-screen
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-2 py-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4be277] to-[#22c55e] flex items-center justify-center text-[#003915] font-black text-sm shadow-[0_0_15px_rgba(75,226,119,0.35)] shrink-0">
                GM
              </div>
              <div>
                <h2 className="text-base font-bold text-[#4be277] leading-tight">
                  GreenQuest
                </h2>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#bccbb9] block">
                  Faculty Dashboard
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 text-[#bccbb9] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="space-y-1.5 flex-1 overflow-y-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? "bg-[#22c55e] text-[#004b1e] font-bold shadow-[0_0_15px_rgba(34,197,94,0.25)]"
                      : "text-[#bccbb9] hover:bg-[#2f372e]/50 hover:text-[#4be277]"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-white/10 space-y-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setIsSidebarOpen(false);
                if (onNewEntryClick) onNewEntryClick();
              }}
              className="w-full bg-gradient-to-r from-[#4be277] to-[#22c55e] hover:shadow-[0_0_18px_rgba(75,226,119,0.4)] text-[#003915] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-xs uppercase font-mono"
            >
              <Plus size={16} />
              <span>New Entry</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono text-[#bccbb9] hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-800/40 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
