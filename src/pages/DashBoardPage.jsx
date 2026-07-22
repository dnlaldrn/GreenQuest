import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { signOut, getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import OverviewTab from "../components/UserDashBoard/Overview";
import UploadVideoTab from "../components/UserDashBoard/UploadVideotab";
import ImpactHubTab from "../components/UserDashBoard/Impacthub";
import LeaderboardsTab from "../components/UserDashBoard/Leaderboard";
import QuestsTab from "../components/UserDashBoard/Quests";
import ProfileTab from "../components/UserDashBoard/SettingsTab";

/* ---------------------------------------------------------------- */
/*  Skeleton primitives                                              */
/* ---------------------------------------------------------------- */

// Base pulsing block. Every skeleton piece below is built from this.
function Bone({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#14231C] ${className}`}
    />
  );
}

// Skeleton for the sidebar logo block (icon + title + subtitle).
// Mirrors the real logo's layout: w-8 h-8 icon, title line, subtitle line.
function LogoSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Bone className="w-8 h-8 rounded-lg shrink-0" />
      <div className="space-y-1.5">
        <Bone className="h-4 w-28" />
        <Bone className="h-2.5 w-20" />
      </div>
    </div>
  );
}

// Skeleton for the sidebar nav links list (Overview, Upload Video, etc.)
function SidebarNavSkeleton() {
  return (
    <nav className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Bone className="w-[18px] h-[18px] rounded-md shrink-0" />
          <Bone className="h-3 w-24" />
        </div>
      ))}
    </nav>
  );
}

// Skeleton for the profile / weekly-goal widgets in the sidebar footer.
function SidebarFooterSkeleton() {
  return (
    <div className="space-y-4 mt-6 md:mt-0">
      <div className="bg-[#111A16] border border-[#14231C] p-3 rounded-xl">
        <Bone className="h-3 w-24 mb-3" />
        <Bone className="h-1.5 w-full mb-2" />
        <Bone className="h-2.5 w-32" />
      </div>
      <div className="flex items-center justify-between bg-[#111A16] border border-[#14231C] p-2 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Bone className="w-9 h-9 rounded-lg" />
          <div className="space-y-1.5">
            <Bone className="h-3 w-20" />
            <Bone className="h-2.5 w-16" />
          </div>
        </div>
        <Bone className="w-7 h-7 rounded-lg" />
      </div>
    </div>
  );
}

// Skeleton for the header title block + search bar.
function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="space-y-2 p-3">
        <Bone className="h-4 w-32" />
        <Bone className="hidden sm:block h-2.5 w-56" />
      </div>
      <div className="space-y-2 p-3 flex">
        <Bone className="h-8 w-50 mr-3 " />
        <Bone className="h-8 w-13 mr-3 " />
        <Bone className="h-8 w-13 mr-3 " />
      </div>
    </div>
  );
}

// Generic content skeleton shown in <main> while a tab's data is "loading".
// Deliberately generic (stat cards + a table-ish block) since it stands in
// for five different tabs with different real content.
function MainContentSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Stat card row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#111A16] border border-[#14231C] rounded-xl p-4 space-y-3"
          >
            <Bone className="h-3 w-16" />
            <Bone className="h-6 w-20" />
            <Bone className="h-2 w-24" />
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div className="bg-[#111A16] border border-[#14231C] rounded-xl p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Bone className="h-4 w-40" />
          <Bone className="h-4 w-20" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Bone className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone className="h-3 w-1/3" />
              <Bone className="h-2.5 w-2/3" />
            </div>
            <Bone className="h-3 w-12 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Main component                                                   */
/* ---------------------------------------------------------------- */

const MIN_SKELETON_MS = 500; // avoids flash-of-skeleton on instant loads

// Thin, themed scrollbar so md+ (desktop) matches the slim overlay-style
// scrollbar mobile browsers show by default. Applied via className below.
const scrollbarStyles = `
  .gq-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #14231C transparent;
  }
  .gq-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .gq-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .gq-scrollbar::-webkit-scrollbar-thumb {
    background-color: #14231C;
    border-radius: 9999px;
  }
  .gq-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #1A2E24;
  }
`;

export default function GreenQuestDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Logged-in user's data (email, name, etc.) fetched from authService.
  const [userData, setUserData] = useState(null);

  // Two independent loading flags: the sidebar/profile data, and the
  // active tab's own content. Kept separate so switching tabs doesn't
  // re-flash the sidebar, and initial mount doesn't re-flash on tab change.
  const [isShellLoading, setIsShellLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(true);
  const tabRequestId = useRef(0);

  // Initial shell load: fetch the current user, then reveal the sidebar.
  // A minimum display time is enforced so the skeleton doesn't flash by
  // instantly on very fast responses.
  useEffect(() => {
    let isMounted = true;
    const start = Date.now();

    async function fetchUser() {
      try {
       const { data, error } = await getCurrentUser()
    if (error) {
      console.error(error)
      return
    }
    setUserData(data.user) // st
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = Math.max(MIN_SKELETON_MS - elapsed, 0);
        setTimeout(() => {
          if (isMounted) setIsShellLoading(false);
        }, remaining);
      }
    }

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  // Simulate fetching whatever data the active tab needs. Replace the
  // setTimeout below with a real data fetch and resolve isTabLoading
  // when it completes.
  useEffect(() => {
    const requestId = ++tabRequestId.current;
    setIsTabLoading(true);
    const timer = setTimeout(() => {
      if (tabRequestId.current === requestId) setIsTabLoading(false);
    }, MIN_SKELETON_MS);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleSignOut = () => {
    requestConfirm(
      "Confirm Log Out",
      "Are you sure you want to sign out of GreenQuest? You'll need to log back in to continue tracking your impact.",
      async () => {
        await signOut();
        navigate("/login");
      }
    );
  };

  const handleNav = (value, bool) => {
    setActiveTab(value);
    setIsSidebarOpen(bool);
  };

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const requestConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    };
    if (confirmModal.isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [confirmModal.isOpen]);

  return (
    <div className="min-h-screen bg-[#0B120F] text-slate-200 font-sans flex flex-col md:flex-row text-xs md:text-sm selection:bg-[#10B981] selection:text-black relative overflow-hidden">
      <style>{scrollbarStyles}</style>

      {/* SIDEBAR */}
      <aside
        className={`
          gq-scrollbar
          fixed inset-y-0 left-0 w-64 bg-[#080D0B] border-r border-[#14231C] p-4 flex flex-col justify-between shrink-0 z-50 overflow-y-auto
          transition-transform duration-300 transform md:translate-x-0 md:static
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between px-2 py-4 mb-6">
            {isShellLoading ? (
              <LogoSkeleton />
            ) : (
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
            )}

            {/* Close sidebar on mobile */}
            <button
              className="md:hidden p-1 text-slate-400 hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          {isShellLoading ? (
            <SidebarNavSkeleton />
          ) : (
            <nav className="space-y-1">
              <button
                onClick={() => handleNav("overview", false)}
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
                onClick={() => handleNav("upload-video", false)}
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
                onClick={() => handleNav("impact-hub", false)}
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
                onClick={() => handleNav("quests", false)}
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
                onClick={() => handleNav("leaderboard", false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer w-full ${
                  activeTab === "leaderboard"
                    ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                    : "text-[#BCCBB9] hover:bg-[#333B33]/20"
                }`}
              >
                <Trophy size={18} />
                <span>Leaderboard</span>
              </button>

              <hr className="border-[#14231C] my-6" />

              {/* Settings */}
              <button
                onClick={() => handleNav("settings", false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer w-full ${
                  activeTab === "settings"
                    ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                    : "text-[#BCCBB9] hover:bg-[#333B33]/20"
                }`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </nav>
          )}
        </div>

        {/* Sidebar Footer Widgets */}
        {isShellLoading ? (
          <SidebarFooterSkeleton />
        ) : (
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
                    alt={userData?.email || "User avatar"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-white leading-tight text-xs truncate max-w-[110px]">
                    {userData.user_metadata?.username|| "Loading..."}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Level 24 Guardian
                  </div>
                </div>
              </div>
              <button
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg transition-colors"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* RIGHT CONTAINER: Flex setup allows header to claim remaining screen width */}
      <div className="gq-scrollbar flex-1 flex flex-col h-screen min-w-0 overflow-auto relative">
        {isShellLoading ? (
          <HeaderSkeleton />
        ) : (
          <header className="h-16 w-full border-b border-[#14231C] px-4 md:px-6 flex items-center justify-between bg-[#0B120F]/80 backdrop-blur top-0 z-30 shrink-0">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu Icon for Mobile */}
              <button
                className="md:hidden p-2 bg-[#111A16] border border-[#14231C] rounded-lg text-slate-400 hover:text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={18} />
              </button>

              {/* Title Block */}
              <div>
                <h2 className="text-base md:text-lg font-bold text-white tracking-tight capitalize">
                  {activeTab.replace("-", " ")}
                </h2>
                <p className="hidden sm:block text-[11px] md:text-xs text-slate-400">
                  Welcome back{userData?.email ? `, ${userData.email}` : ""}. Your
                  impact is growing.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Search Bar */}
              <div className="relative w-40 lg:w-64 hidden sm:block">
                <Search
                  className="absolute left-3 top-2.5 text-slate-500"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search quests..."
                  className="w-full bg-[#111A16] border border-[#14231C] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-600"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 bg-[#111A16] border border-[#14231C] text-slate-400 hover:text-white rounded-lg relative transition-colors">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
              </button>

              {/* Upload Action Button */}
              <button
                onClick={() => setActiveTab("upload-video")}
                className="bg-[#10B981] hover:bg-[#0ea5e9] text-[#0B120F] font-bold px-3 md:px-4 py-1.5 rounded-lg flex items-center gap-2 transition-colors shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
              >
                <UploadCloud size={16} />
                <span className="hidden xs:inline">Upload Video</span>
              </button>
            </div>
          </header>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 bg-[#0B120F]">
          {isTabLoading ? (
            <MainContentSkeleton />
          ) : (
            <>
              {activeTab === "overview" && <OverviewTab />}
              {activeTab === "upload-video" && <UploadVideoTab />}
              {activeTab === "impact-hub" && <ImpactHubTab />}
              {activeTab === "quests" && <QuestsTab />}
              {activeTab === "leaderboard" && <LeaderboardsTab />}
              {activeTab === "settings" && <ProfileTab />}
            </>
          )}
        </main>
      </div>
      {confirmModal.isOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[10000] animate-fade-in">
            <div className="bg-[#161D16] border border-[#FFB4AB]/30 shadow-[0_0_50px_rgba(255,180,171,0.1)] max-w-sm w-full rounded-2xl p-5 space-y-4 font-mono text-xs">
              {/* Modal Header */}
              <div className="flex items-center gap-2 text-[#FFB4AB] border-b border-[#DCE5D9]/10 pb-2">
                <ShieldAlert size={18} className="shrink-0" />
                <h3 className="font-bold text-sm text-[#DCE5D9] uppercase tracking-wider">
                  {confirmModal.title}
                </h3>
              </div>

              {/* Modal Body */}
              <p className="text-[#BCCBB9] leading-relaxed text-left">
                {confirmModal.message}
              </p>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className="bg-[#FFB4AB]/15 text-[#FFB4AB] border border-[#FFB4AB]/30 hover:bg-[#FFB4AB]/25 font-bold px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono"
                >
                  Confirm Action
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                  }
                  className="bg-[#333B33] text-[#DCE5D9] border border-[#3D4A3D] px-4 py-2 rounded-lg hover:bg-[#333B33]/85 transition-colors cursor-pointer font-mono"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}