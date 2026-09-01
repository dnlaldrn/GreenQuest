import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getCurrentUser, signOut } from "../services/authService";

import FacultySidebar from "../components/FacultyDashboard/FacultySidebar";
import FacultyHeader from "../components/FacultyDashboard/FacultyHeader";
import FacultyOverviewTab from "../components/FacultyDashboard/FacultyOverviewTab";
import FacultyMyEntriesTab from "../components/FacultyDashboard/FacultyMyEntriesTab";
import FacultyLeaderboardTab from "../components/FacultyDashboard/FacultyLeaderboardTab";
import FacultyRulesTab from "../components/FacultyDashboard/FacultyRulesTab";
import FacultySupportTab from "../components/FacultyDashboard/FacultySupportTab";
import FacultyFooter from "../components/FacultyDashboard/FacultyFooter";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation and View state persisted via URL tab query
  const tabFromUrl = searchParams.get("tab") || "dashboard";
  const [activeTab, setActiveTabState] = useState(tabFromUrl);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (tab === "dashboard") {
          next.delete("tab");
        } else {
          next.set("tab", tab);
        }
        return next;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    const tab = searchParams.get("tab") || "dashboard";
    setActiveTabState(tab);
  }, [searchParams]);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Recent Entries dynamic state
  const [entries, setEntries] = useState([
    {
      id: "ent-1",
      specimen: "Monstera Deliciosa",
      title: "Morning Dew Timelapse",
      votes: 142,
      hasVoted: false,
      timestamp: "2 days ago",
      duration: "0:45",
      isVerified: true,
      isProcessing: false,
      isOwner: true,
      image:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "ent-2",
      specimen: "Philodendron PPP",
      title: "Variegation Progress Week 3",
      votes: 89,
      hasVoted: false,
      timestamp: "5 days ago",
      duration: "1:12",
      isVerified: true,
      isProcessing: false,
      isOwner: false,
      image:
        "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "ent-3",
      specimen: "Ficus Elastica",
      title: "Root System Development",
      votes: 34,
      hasVoted: false,
      timestamp: "Just now",
      duration: "--:--",
      isVerified: false,
      isProcessing: true,
      isOwner: true,
      image:
        "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&auto=format&fit=crop&q=80",
    },
  ]);

  // Leaderboard data
  const [leaders] = useState([
    {
      rank: 1,
      name: "Dr. Sarah Jenkins",
      dept: "Botany Dept",
      pts: "2.1k",
      entriesCount: 18,
      isUser: false,
    },
    {
      rank: 2,
      name: "Prof. Michael Chen",
      dept: "Ecology Dept",
      pts: "1.8k",
      entriesCount: 15,
      isUser: false,
    },
    {
      rank: 3,
      name: "Dr. Elena Rostova",
      dept: "Bio-Engineering",
      pts: "1.5k",
      entriesCount: 14,
      isUser: false,
    },
    {
      rank: 4,
      name: "You",
      dept: "Biology Dept",
      pts: "1.4k",
      entriesCount: 12,
      isUser: true,
    },
    {
      rank: 5,
      name: "Dr. Marcus Thorne",
      dept: "Plant Physiology",
      pts: "1.1k",
      entriesCount: 9,
      isUser: false,
    },
  ]);

  // Fetch logged in user once
  useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setCurrentUser(data.session.user);
        }
      } catch (err) {
        console.error("Error loading faculty session:", err);
      }
    }
    loadUser();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleNewEntryClick = () => {
    setActiveTab("dashboard");
    setTimeout(() => {
      const el = document.getElementById("upload-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Filtered entries based on search query
  const filteredEntries = entries.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.specimen.toLowerCase().includes(q)
    );
  });

  const facultyDisplayName =
    currentUser?.user_metadata?.username ||
    currentUser?.email?.split("@")[0] ||
    "Dr. Aris";

  return (
    <div className="min-h-screen w-full bg-[#0e150e] text-[#dce5d9] font-sans flex flex-col md:flex-row text-xs sm:text-sm selection:bg-[#22c55e] selection:text-[#004b1e] relative overflow-x-hidden">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce max-w-[90vw]">
          <div
            className={`px-4 py-3 rounded-xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 text-xs font-mono ${
              toast.type === "error"
                ? "bg-red-950/90 border-red-500/40 text-red-300"
                : "bg-[#162018]/90 border-[#4be277]/40 text-[#4be277]"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={16} className="text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="text-[#4be277] shrink-0" />
            )}
            <span className="truncate">{toast.message}</span>
          </div>
        </div>
      )}

      {/* 1. Modular Sidebar */}
      <FacultySidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onLogout={handleLogout}
        onNewEntryClick={handleNewEntryClick}
      />

      {/* 2. Main Container (Sidebar sibling with full width & dedicated scrolling) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Modular Sticky Header */}
        <FacultyHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNotificationClick={() =>
            showToast("No new unread challenge alerts.")
          }
          onSettingsClick={() => setActiveTab("support")}
          facultyDisplayName={facultyDisplayName}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Tab Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <FacultyOverviewTab
              facultyDisplayName={facultyDisplayName}
              entries={filteredEntries}
              setEntries={setEntries}
              leaders={leaders}
              setActiveTab={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === "my-entries" && (
            <FacultyMyEntriesTab
              entries={filteredEntries}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "leaderboard" && (
            <FacultyLeaderboardTab leaders={leaders} />
          )}

          {activeTab === "rules" && <FacultyRulesTab />}

          {activeTab === "support" && (
            <FacultySupportTab showToast={showToast} />
          )}
        </main>

        {/* Modular Footer */}
        <FacultyFooter setActiveTab={setActiveTab} showToast={showToast} />
      </div>
    </div>
  );
}
