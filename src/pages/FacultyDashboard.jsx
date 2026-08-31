import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  Trophy,
  Gavel,
  HelpCircle,
  Plus,
  Search,
  Bell,
  Settings,
  UploadCloud,
  Send,
  ThumbsUp,
  Clock,
  Video,
  CheckCircle2,
  Play,
  Grid,
  List,
  Loader2,
  RefreshCw,
  X,
  Menu,
  LogOut,
  Sparkles,
  Award,
  AlertCircle,
} from "lucide-react";
import { getCurrentUser, signOut } from "../services/authService";
import { sanitizeAlphanumeric } from "../lib/validation";

export default function FacultyDashboard() {
  const navigate = useNavigate();

  // Navigation and View state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Upload Form State
  const [specimen, setSpecimen] = useState("Monstera Deliciosa (Variegated)");
  const [entryTitle, setEntryTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Recent Entries dynamic list
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
      image:
        "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "ent-3",
      specimen: "Ficus Elastica",
      title: "Root System Development",
      votes: 0,
      hasVoted: false,
      timestamp: "Just now",
      duration: "--:--",
      isVerified: false,
      isProcessing: true,
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
      isUser: false,
    },
    {
      rank: 2,
      name: "Prof. Michael Chen",
      dept: "Ecology",
      pts: "1.8k",
      isUser: false,
    },
    {
      rank: 3,
      name: "Dr. Elena Rostova",
      dept: "Bio-Eng",
      pts: "1.5k",
      isUser: false,
    },
    {
      rank: 4,
      name: "You",
      dept: "Biology",
      pts: "1.4k",
      isUser: true,
    },
  ]);

  // Fetch logged in user
  useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await getCurrentUser();
        if (data?.user) {
          setCurrentUser(data.user);
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

  // Vote toggle handler
  const handleToggleVote = (id) => {
    setEntries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedVoted = !item.hasVoted;
          return {
            ...item,
            hasVoted: updatedVoted,
            votes: updatedVoted ? item.votes + 1 : item.votes - 1,
          };
        }
        return item;
      })
    );
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      showToast("Please upload a valid MP4 or MOV video file.", "error");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      showToast("Video file exceeds the 50MB size limit.", "error");
      return;
    }
    setSelectedFile(file);
    showToast(`Loaded: ${file.name}`, "success");
  };

  // Upload Submission Handler
  const handleSubmitEntry = (e) => {
    if (e) e.preventDefault();

    if (!entryTitle.trim() || entryTitle.trim().length < 3) {
      showToast("Please enter an entry title (at least 3 characters).", "error");
      return;
    }

    if (!selectedFile) {
      showToast("Please select or drop a video file first.", "error");
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      const newEntry = {
        id: `ent-${Date.now()}`,
        specimen: specimen.split("(")[0].trim(),
        title: entryTitle.trim(),
        votes: 1,
        hasVoted: true,
        timestamp: "Just now",
        duration: "0:30",
        isVerified: true,
        isProcessing: false,
        image:
          "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&auto=format&fit=crop&q=80",
      };

      setEntries((prev) => [newEntry, ...prev]);
      setIsUploading(false);
      setEntryTitle("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast("Challenge entry uploaded successfully!", "success");
    }, 1200);
  };

  // Filtered entries based on top search bar
  const filteredEntries = entries.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.specimen.toLowerCase().includes(q)
    );
  });

  const facultyDisplayName =
    currentUser?.user_metadata?.username || "Dr. Aris";

  return (
    <div className="min-h-screen bg-[#0e150e] text-[#dce5d9] font-sans flex flex-col selection:bg-[#22c55e] selection:text-[#004b1e]">
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

      {/* Top Header Bar */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-[#0e150e]/90 md:bg-[#0e150e]/80 backdrop-blur-xl flex flex-col justify-center px-4 sm:px-8 md:px-10 h-20 border-b border-white/10 transition-all">
        <div className="flex justify-between items-center w-full">
          {/* Mobile Header Left with Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg bg-[#161d16] border border-white/10 text-[#4be277] hover:bg-[#242c24] cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4be277] to-[#22c55e] flex md:hidden items-center justify-center text-[#003915] font-black text-xs shadow-[0_0_10px_rgba(75,226,119,0.3)]">
                GM
              </div>
              <h1 className="text-base sm:text-2xl font-bold text-[#4be277] tracking-tight truncate">
                GreenMate Challenge
              </h1>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Desktop Search Input with anti-spam & length limits */}
            <div className="relative hidden md:block focus-within:ring-1 focus-within:ring-[#4be277] rounded-full transition-all">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bccbb9]"
              />
              <input
                type="text"
                maxLength={40}
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(sanitizeAlphanumeric(e.target.value, 40, 3))
                }
                placeholder="Search entries..."
                className="bg-[#242c24] border border-white/10 text-[#dce5d9] placeholder-[#bccbb9]/50 rounded-full pl-10 pr-4 py-2 text-xs w-48 lg:w-64 focus:outline-none focus:border-[#4be277] transition-all"
              />
            </div>

            {/* Mobile Search Toggle Icon */}
            <button
              onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
              className="md:hidden text-[#bccbb9] hover:text-[#4be277] p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Search"
            >
              <Search size={18} />
            </button>

            {/* Notifications button */}
            <button
              onClick={() =>
                showToast("No new unread challenge alerts.", "success")
              }
              className="text-[#bccbb9] hover:text-[#4be277] p-2 rounded-lg hover:bg-white/5 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4be277] rounded-full animate-pulse"></span>
            </button>

            {/* Settings button */}
            <button
              onClick={() => setActiveTab("support")}
              className="text-[#bccbb9] hover:text-[#4be277] p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Challenge Settings"
            >
              <Settings size={18} />
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/20 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt="Faculty Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Input dropdown */}
        {isSearchOpenMobile && (
          <div className="md:hidden pt-2 pb-1 w-full animate-fade-in">
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
                className="w-full bg-[#242c24] border border-white/15 text-[#dce5d9] placeholder-[#bccbb9]/50 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#4be277]"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Backdrop Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#0e150e]/95 md:bg-[#0e150e]/80 backdrop-blur-2xl border-r border-white/10 shadow-[0_0_20px_rgba(75,226,119,0.04)] flex flex-col p-4 z-50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4be277] to-[#22c55e] flex items-center justify-center text-[#003915] font-black text-sm shadow-[0_0_12px_rgba(75,226,119,0.35)]">
              GM
            </div>
            <div>
              <div className="text-base font-bold text-[#4be277] leading-tight">
                GreenQuest
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#bccbb9]">
                Faculty Dashboard
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 text-[#bccbb9] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#22c55e] text-[#004b1e] font-bold shadow-[0_0_15px_rgba(34,197,94,0.25)] scale-[1.01]"
                : "text-[#bccbb9] hover:bg-[#2f372e]/50 hover:text-[#4be277]"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("my-entries");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              activeTab === "my-entries"
                ? "bg-[#22c55e] text-[#004b1e] font-bold shadow-[0_0_15px_rgba(34,197,94,0.25)] scale-[1.01]"
                : "text-[#bccbb9] hover:bg-[#2f372e]/50 hover:text-[#4be277]"
            }`}
          >
            <Leaf size={18} />
            <span>My Entries</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("leaderboard");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              activeTab === "leaderboard"
                ? "bg-[#22c55e] text-[#004b1e] font-bold shadow-[0_0_15px_rgba(34,197,94,0.25)] scale-[1.01]"
                : "text-[#bccbb9] hover:bg-[#2f372e]/50 hover:text-[#4be277]"
            }`}
          >
            <Trophy size={18} />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("rules");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              activeTab === "rules"
                ? "bg-[#22c55e] text-[#004b1e] font-bold shadow-[0_0_15px_rgba(34,197,94,0.25)] scale-[1.01]"
                : "text-[#bccbb9] hover:bg-[#2f372e]/50 hover:text-[#4be277]"
            }`}
          >
            <Gavel size={18} />
            <span>Rules</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("support");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              activeTab === "support"
                ? "bg-[#22c55e] text-[#004b1e] font-bold shadow-[0_0_15px_rgba(34,197,94,0.25)] scale-[1.01]"
                : "text-[#bccbb9] hover:bg-[#2f372e]/50 hover:text-[#4be277]"
            }`}
          >
            <HelpCircle size={18} />
            <span>Support</span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsSidebarOpen(false);
              const el = document.getElementById("upload-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full bg-gradient-to-r from-[#4be277] to-[#22c55e] hover:shadow-[0_0_18px_rgba(75,226,119,0.4)] text-[#003915] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-sm"
          >
            <Plus size={18} />
            <span>New Entry</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-mono text-[#bccbb9] hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-800/40 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 mt-20 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Welcome Hero Banner */}
          <section className="bg-[#161d16]/70 backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4be277]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4be277]/10 border border-[#4be277]/20 text-[#4be277] font-mono text-[11px] sm:text-xs">
                  <Sparkles size={12} />
                  <span>Faculty Challenge Season 4</span>
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#dce5d9] tracking-tight">
                  Welcome back, {facultyDisplayName}.
                </h2>
                <p className="text-xs sm:text-sm text-[#bccbb9] leading-relaxed">
                  Your botanical submissions are currently ranking in the top
                  15% of the faculty challenge. Keep uploading high-quality
                  specimens to maintain your streak.
                </p>
                <p className="text-xs text-[#bccbb9]/80 leading-relaxed hidden sm:block">
                  The GreenMate Challenge empowers faculty to showcase botanical
                  innovation through video documentation. Compete for the top spot
                  by sharing your plant's growth journey and gathering votes from
                  the global research community.
                </p>
              </div>

              {/* Big Stat Counters */}
              <div className="flex gap-4 sm:gap-8 w-full md:w-auto justify-around md:justify-end bg-[#0e150e]/60 p-3 sm:p-4 rounded-xl border border-white/5">
                <div className="text-center md:text-right">
                  <div className="text-[#bccbb9] font-mono text-[9px] sm:text-[10px] uppercase tracking-widest mb-1">
                    Total Entries
                  </div>
                  <div className="text-2xl sm:text-4xl font-black text-[#4be277] drop-shadow-[0_0_12px_rgba(75,226,119,0.35)]">
                    12
                  </div>
                </div>

                <div className="text-center md:text-right border-l border-white/10 pl-4 sm:pl-6">
                  <div className="text-[#bccbb9] font-mono text-[9px] sm:text-[10px] uppercase tracking-widest mb-1">
                    Total Votes
                  </div>
                  <div className="text-2xl sm:text-4xl font-black text-[#8bd79b] drop-shadow-[0_0_12px_rgba(139,215,155,0.35)]">
                    1,492
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dashboard Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (Overview & Upload Form) */}
            <div className="lg:col-span-8 space-y-6">
              {/* 4 Stats Bento Mini Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-28 sm:h-32 border border-white/10 border-t-2 border-t-[#4be277] shadow-lg">
                  <Video className="text-[#4be277]" size={20} />
                  <div>
                    <div className="text-[#bccbb9] font-mono text-[10px] sm:text-[11px] mb-0.5">
                      Entries
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-[#dce5d9]">
                      12
                    </div>
                  </div>
                </div>

                <div className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-28 sm:h-32 border border-white/10 shadow-lg">
                  <ThumbsUp className="text-[#8bd79b]" size={20} />
                  <div>
                    <div className="text-[#bccbb9] font-mono text-[10px] sm:text-[11px] mb-0.5">
                      Votes Received
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-[#dce5d9]">
                      1.4k
                    </div>
                  </div>
                </div>

                <div className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-28 sm:h-32 border border-white/10 shadow-lg">
                  <Trophy className="text-[#acf847]" size={20} />
                  <div>
                    <div className="text-[#bccbb9] font-mono text-[10px] sm:text-[11px] mb-0.5">
                      Current Rank
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-[#dce5d9]">
                      #4
                    </div>
                  </div>
                </div>

                <div className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-28 sm:h-32 border border-white/10 shadow-lg">
                  <Clock className="text-[#ffb4ab]" size={20} />
                  <div>
                    <div className="text-[#bccbb9] font-mono text-[10px] sm:text-[11px] mb-0.5">
                      Days Remaining
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-[#ffb4ab]">
                      14
                    </div>
                  </div>
                </div>
              </div>

              {/* New Entry Upload Box */}
              <section
                id="upload-section"
                className="bg-[#1a221a]/80 backdrop-blur-2xl rounded-2xl p-5 sm:p-6 border border-white/10 shadow-[0_0_25px_rgba(75,226,119,0.05)]"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#4be277]/20 flex items-center justify-center text-[#4be277]">
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#dce5d9]">
                      New Entry Upload
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#bccbb9]">
                      Document and submit your botanical specimen for peer review.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmitEntry} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-[#bccbb9] mb-1.5 uppercase tracking-wider">
                        Plant Specimen
                      </label>
                      <select
                        value={specimen}
                        onChange={(e) => setSpecimen(e.target.value)}
                        className="w-full bg-[#242c24] border border-white/10 rounded-lg p-2.5 sm:p-3 text-xs text-[#dce5d9] focus:border-[#4be277] focus:ring-1 focus:ring-[#4be277] transition-all outline-none"
                      >
                        <option value="Monstera Deliciosa (Variegated)">
                          Monstera Deliciosa (Variegated)
                        </option>
                        <option value="Philodendron Pink Princess">
                          Philodendron Pink Princess
                        </option>
                        <option value="Ficus Elastica Tineke">
                          Ficus Elastica Tineke
                        </option>
                        <option value="Bonsai Ficus Retusa">
                          Bonsai Ficus Retusa
                        </option>
                        <option value="Other / Unclassified">
                          Other / Unclassified
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-[#bccbb9] mb-1.5 uppercase tracking-wider">
                        Entry Title
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        value={entryTitle}
                        onChange={(e) =>
                          setEntryTitle(
                            sanitizeAlphanumeric(e.target.value, 50, 3)
                          )
                        }
                        placeholder="e.g., Spring Growth Timelapse"
                        className="w-full bg-[#242c24] border border-white/10 rounded-lg p-2.5 sm:p-3 text-xs text-[#dce5d9] placeholder-[#bccbb9]/40 focus:border-[#4be277] focus:ring-1 focus:ring-[#4be277] transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 sm:p-8 text-center transition-all bg-[#161d16]/50 relative overflow-hidden group cursor-pointer ${
                      isDragging
                        ? "border-[#4be277] bg-[#4be277]/10"
                        : "border-white/15 hover:border-[#4be277]/60"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) =>
                        e.target.files && handleFileSelected(e.target.files[0])
                      }
                      accept="video/mp4,video/quicktime,video/webm"
                      className="hidden"
                    />

                    <div className="absolute inset-0 bg-[#4be277]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                    <UploadCloud
                      size={32}
                      className="mx-auto text-[#bccbb9] mb-2.5 group-hover:text-[#4be277] transition-colors"
                    />

                    {selectedFile ? (
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-bold text-[#4be277] truncate">
                          Selected: {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-[#bccbb9] font-mono">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-medium text-[#dce5d9]">
                          Drag and drop your video file here
                        </p>
                        <p className="text-[11px] font-mono text-[#bccbb9]">
                          MP4 or MOV, max 50MB
                        </p>
                        <div className="pt-2 sm:pt-3">
                          <span className="inline-block px-4 py-1.5 border border-white/20 rounded-full font-mono text-[11px] text-[#dce5d9] group-hover:bg-[#2f372e] transition-colors">
                            Browse Files
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Submit CTA */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full sm:w-auto bg-gradient-to-r from-[#4be277] to-[#22c55e] hover:shadow-[0_0_20px_rgba(75,226,119,0.4)] text-[#003915] font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-xs uppercase font-mono disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit to Challenge</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </section>
            </div>

            {/* Right Column (Leaderboard & Quick Ranking) */}
            <div className="lg:col-span-4 space-y-6">
              <section className="bg-[#161d16]/70 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col h-full shadow-2xl">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                  <h3 className="text-base font-bold flex items-center gap-2 text-[#dce5d9]">
                    <Trophy className="text-[#92db2a]" size={18} />
                    <span>Top Leaders</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("leaderboard")}
                    className="text-[#4be277] font-mono text-xs hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3 flex-1">
                  {leaders.map((leader) => (
                    <div
                      key={leader.rank}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        leader.isUser
                          ? "bg-[#2f372e]/50 border border-[#4be277]/40 shadow-[0_0_15px_rgba(75,226,119,0.1)]"
                          : "bg-[#242c24]/50 border border-white/5 hover:border-[#4be277]/20"
                      }`}
                    >
                      {/* Rank indicator */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          leader.rank === 1
                            ? "bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30"
                            : "bg-[#2f372e] text-[#bccbb9]"
                        }`}
                      >
                        {leader.rank}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-bold text-xs sm:text-sm truncate ${
                            leader.isUser ? "text-[#4be277]" : "text-[#dce5d9]"
                          }`}
                        >
                          {leader.name}
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-mono text-[#bccbb9] truncate">
                          {leader.dept}
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="font-bold text-xs sm:text-sm text-[#4be277] font-mono">
                          {leader.pts}
                        </div>
                        <div className="text-[9px] sm:text-[10px] font-mono text-[#bccbb9]">
                          pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Challenge rules tip card */}
                <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-[#091009]/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#acf847]">
                    <Award size={14} />
                    <span>Challenge Tip</span>
                  </div>
                  <p className="text-[11px] text-[#bccbb9] leading-relaxed">
                    Faculty entries with higher resolution time-lapses gain 2.4x
                    more peer votes and AI verification accuracy.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Recent Entries Grid Section */}
          <section className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-[#8bd79b]">
                <Leaf size={18} />
                <span>Recent Challenge Entries</span>
              </h3>

              {/* Grid / List Switcher */}
              <div className="flex gap-1.5 bg-[#161d16] p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#2f372e] text-[#4be277]"
                      : "text-[#bccbb9] hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-[#2f372e] text-[#4be277]"
                      : "text-[#bccbb9] hover:text-white"
                  }`}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Entries Cards */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl overflow-hidden group border border-white/10 hover:border-[#4be277]/40 transition-all shadow-xl hover:-translate-y-1"
                  >
                    {/* Media Thumbnail Container */}
                    <div className="relative h-44 sm:h-48 w-full bg-[#091009] overflow-hidden">
                      <img
                        src={entry.image}
                        alt={entry.title}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          entry.isProcessing
                            ? "grayscale opacity-40 blur-[1px]"
                            : "opacity-85 group-hover:opacity-100"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e150e] via-transparent to-transparent"></div>

                      {/* Badges */}
                      {entry.isVerified && (
                        <div className="absolute top-3 left-3 bg-[#78be00]/80 text-[#2a4700] font-mono text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm border border-[#92db2a]/40 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>Verified</span>
                        </div>
                      )}

                      {!entry.isProcessing && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#2f372e]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-mono border border-white/10">
                          <Play size={10} className="text-[#4be277] fill-current" />
                          <span>{entry.duration}</span>
                        </div>
                      )}

                      {/* Processing Overlay if in progress */}
                      {entry.isProcessing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                          <RefreshCw
                            size={28}
                            className="text-[#4be277] animate-spin mb-2"
                          />
                          <span className="font-mono text-xs text-[#dce5d9] font-bold">
                            Processing AI Analysis...
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2">
                      <div className="font-mono text-[11px] text-[#4be277] uppercase tracking-wider">
                        {entry.specimen}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-[#dce5d9] truncate group-hover:text-[#4be277] transition-colors">
                        {entry.title}
                      </h4>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleToggleVote(entry.id)}
                          className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            entry.hasVoted
                              ? "bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30"
                              : "text-[#bccbb9] hover:text-[#4be277] hover:bg-white/5"
                          }`}
                        >
                          <ThumbsUp size={14} className={entry.hasVoted ? "fill-current" : ""} />
                          <span>{entry.votes > 0 ? entry.votes : "--"}</span>
                        </button>
                        <span className="text-[11px] font-mono text-[#bccbb9]/70">
                          {entry.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl border border-white/10 divide-y divide-white/5 overflow-hidden">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-[#091009] relative">
                        <img
                          src={entry.image}
                          alt={entry.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-[#4be277] uppercase tracking-wider block">
                          {entry.specimen}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-[#dce5d9] truncate">
                          {entry.title}
                        </h4>
                        <span className="text-[11px] text-[#bccbb9] font-mono">
                          {entry.timestamp} • {entry.duration}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleToggleVote(entry.id)}
                        className={`flex items-center gap-1.5 text-xs font-mono px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          entry.hasVoted
                            ? "bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30"
                            : "text-[#bccbb9] hover:text-[#4be277] hover:bg-white/5"
                        }`}
                      >
                        <ThumbsUp size={14} className={entry.hasVoted ? "fill-current" : ""} />
                        <span>{entry.votes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 md:px-12 mt-auto ml-0 md:ml-64 font-mono text-xs text-[#bccbb9] gap-4">
        <div className="text-center md:text-left text-[11px] sm:text-xs">
          © 2026 GreenMate Challenge. Empowering Sustainable Campus Life.
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-[10px] sm:text-[11px]">
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              showToast("Displaying Privacy Policy terms.");
            }}
            className="hover:text-[#4be277] transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              showToast("Displaying Terms of Service.");
            }}
            className="hover:text-[#4be277] transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              showToast("Challenge FAQ section.");
            }}
            className="hover:text-[#4be277] transition-colors"
          >
            Challenge FAQ
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              showToast("Support email: admin@greenquest.ai");
            }}
            className="hover:text-[#4be277] transition-colors"
          >
            Contact Admin
          </a>
        </div>
      </footer>
    </div>
  );
}
