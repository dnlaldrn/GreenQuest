import { useState } from "react";
import {
  LayoutDashboard,
  UploadCloud,
  Globe,
  Award,
  Trophy,
  Settings,
  LogOut,
  Search,
  Bell,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Menu,
  Loader2,
  X,
} from "lucide-react";
import { signOut } from "../services/authService";
import { useNavigate } from "react-router-dom";
import OverviewTab from "../components/UserDashBoard/Overview";
import UploadVideoTab from "../components/UserDashBoard/UploadVideotab";
import ImpactHubTab from "../components/UserDashBoard/Impacthub";
import LeaderboardsTab from "../components/UserDashBoard/Leaderboard";
import QuestsTab from "../components/UserDashBoard/Quests";

export default function GreenQuestDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0B120F] text-slate-200 font-sans flex flex-col md:flex-row text-xs md:text-sm selection:bg-[#10B981] selection:text-black relative overflow-x-hidden">
      {/* MOBILE OVERLAY BACKGROUND */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed inset-y-0 left-0 w-64 bg-[#080D0B] border-r border-[#14231C] p-4 flex flex-col justify-between shrink-0 z-50
        transition-transform duration-300 transform md:translate-x-0 md:static
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div>
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between px-2 py-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <span className="text-[#0B120F] font-black text-xl">Q</span>
              </div>
              <div>
                <h1 className="font-bold text-white tracking-wide text-base leading-none">
                  GreenQuest
                </h1>
                <span className="text-[10px] text-[#10B981] font-mono uppercase tracking-widest">
                  Impact Dashboard
                </span>
              </div>
            </div>

            {/* Close sidebar on mobile */}
            <button
              className="md:hidden p-1 text-slate-400 hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer w-full ${
                activeTab === "overview"
                  ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                  : "text-[#BCCBB9] hover:bg-[#333B33]/20"
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("upload-video")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer w-full ${
                activeTab === "upload-video"
                  ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                  : "text-[#BCCBB9] hover:bg-[#333B33]/20"
              }`}
            >
              <UploadCloud size={18} />
              <span>Upload Video</span>
            </button>
            <button
              onClick={() => setActiveTab("impact-hub")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer w-full ${
                activeTab === "impact-hub"
                  ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                  : "text-[#BCCBB9] hover:bg-[#333B33]/20"
              }`}
            >
              <Globe size={18} />
              <span>Impact Hub</span>
            </button>
            <button
              onClick={() => setActiveTab("quests")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer w-full ${
                activeTab === "quests"
                  ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                  : "text-[#BCCBB9] hover:bg-[#333B33]/20"
              }`}
            >
              <Award size={18} />
              <span>Quests</span>
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer w-full ${
                activeTab === "leaderboard"
                  ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                  : "text-[#BCCBB9] hover:bg-[#333B33]/20"
              }`}
            >
              <Trophy size={18} />
              <span>Leaderboard</span>
            </button>
          </nav>

          <hr className="border-[#14231C] my-6" />

          {/* Settings */}
          <a
            href="#settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111A16] transition-colors"
          >
            <Settings size={18} />
            <span>Settings</span>
          </a>
        </div>

        {/* Sidebar Footer Widgets */}
        <div className="space-y-4 mt-6 md:mt-0">
          {/* Weekly Goal Widget */}
          <div className="bg-[#111A16] border border-[#14231C] p-3 rounded-xl">
            <div className="text-[#10B981] font-bold mb-1 text-[11px] uppercase tracking-wider">
              Weekly Goal
            </div>
            <div className="w-full bg-[#1A2E24] rounded-full h-1.5 mb-2">
              <div
                className="bg-[#10B981] h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                style={{ width: "75%" }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              750 / 1000 Green Points
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center justify-between bg-[#111A16] border border-[#14231C] p-2 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#142E24] overflow-hidden border border-[#10B981]/30">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Alex Green"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-white leading-tight text-xs">
                  Alex Green
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Level 24 Guardian
                </div>
              </div>
            </div>
            <button
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg transition-colors"
              onClick={signOut()}
            >
              <LogOut size={16} onClick={signOut()} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      {activeTab == "overview" && <OverviewTab />}

      {activeTab == "upload-video" && <UploadVideoTab />}

      {activeTab == "impact-hub" && <ImpactHubTab />}

      {activeTab == "quests" && <QuestsTab />}

      {activeTab == "leaderboard" && <LeaderboardsTab />}
    </div>
  );
}
