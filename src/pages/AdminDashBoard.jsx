import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { signOut } from "../services/authService";

// Subcomponents import
import AnalyticsTab from "../components/AdminDashboard/AnalyticsTab";
import UserManagementTab from "../components/AdminDashboard/UserManagementTab";
import VideoReviewTab from "../components/AdminDashboard/VideoReviewTab";
import RewardsTab from "../components/AdminDashboard/RewardsTab";
import AiLogsTab from "../components/AdminDashboard/AiLogsTab";
import ReportsTab from "../components/AdminDashboard/ReportsTab";

import {
  LayoutDashboard,
  Users,
  Video,
  BrainCircuit,
  Gift,
  BarChart3,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  ShieldAlert,
  Loader2,
  Sparkles,
  X
} from "lucide-react";
import { createPortal } from "react-dom";

export default function AdminDashBoard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(true);
  const [isMocked, setIsMocked] = useState(false);
  const [isAdminBypassed, setIsAdminBypassed] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Custom Confirmation Modal state
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
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    };
    if (confirmModal.isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [confirmModal.isOpen]);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // DB Data States
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    approvalRate: 0,
    pointsDistributed: 0,
  });
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [aiLogs, setAiLogs] = useState([]);

  // Current admin details
  const [adminUser, setAdminUser] = useState(null);

  // MOCK DATA FALLBACKS (Loaded if PGRST205 Table Cache Error is hit)
  const mockStats = {
    totalUsers: 1284,
    totalVideos: 452,
    approvalRate: 94.8,
    pointsDistributed: 124000,
  };

  const mockUsers = [
    { id: "1", username: "Elena J.", email: "elena.j@eco.org", role: "user", total_points: 12500, created_at: "2026-01-10T08:00:00Z", avatar_url: null },
    { id: "2", username: "Marcus K.", email: "marcus.k@sustain.com", role: "user", total_points: 8200, created_at: "2026-02-14T09:12:00Z", avatar_url: null },
    { id: "3", username: "Sophia L.", email: "sophia.l@green.net", role: "user", total_points: 5400, created_at: "2026-03-01T14:33:00Z", avatar_url: null },
    { id: "4", username: "Admin.Sustain", email: "admin@greenquest.ai", role: "admin", total_points: 150, created_at: "2026-01-01T00:00:00Z", avatar_url: null },
  ];

  const mockSubmissions = [
    {
      id: "sub-1",
      user_id: "1",
      video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: "Recycling sorting at local park cleanup.",
      status: "manual_review",
      ai_score: 42,
      ai_feedback: "AI flag: Container detection confidence low. Manual review suggested.",
      points_awarded: 250,
      created_at: "2026-07-04T12:00:00Z",
      profiles: { username: "Elena J.", total_points: 12500 }
    },
    {
      id: "sub-2",
      user_id: "2",
      video_url: "https://www.w3schools.com/html/movie.mp4",
      description: "Planting a native seedling in biodegradable pot.",
      status: "pending",
      ai_score: 68,
      ai_feedback: "Sprout recognized. Confidence score 68%. Points estimated: 120 pts.",
      points_awarded: 120,
      created_at: "2026-07-05T08:30:00Z",
      profiles: { username: "Marcus K.", total_points: 8200 }
    }
  ];

  const mockRewards = [
    { id: "rew-1", name: "Eco-Tech Water Bottle", description: "Smart temperature tracking.", image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300", points_cost: 5000, stock: 42, active: true },
    { id: "rew-2", name: "Forest Restoration Bond", description: "Plant 50 trees in the Amazon.", image_url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300", points_cost: 12500, stock: 9999, active: true },
    { id: "rew-3", name: "Sustainable Yoga Mat", description: "Hemp & Natural Rubber.", image_url: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=300", points_cost: 8200, stock: 15, active: true }
  ];

  const mockLogs = [
    { timestamp: "2026-07-05T10:11:42Z", message: "[GreenQuest AI] Initializing Admin Monitor..." },
    { timestamp: "2026-07-05T10:12:05Z", message: "[GreenQuest AI] Scanning active sessions: 1,402 active." },
    { timestamp: "2026-07-05T10:14:18Z", message: "[GreenQuest AI] Database schema check completed." },
    { timestamp: "2026-07-05T10:15:00Z", message: "[GreenQuest AI] Edge functions status: 200 OK." }
  ];

  // Auth Guard and Loading Initial Data
  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        setLoading(true);
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          navigate("/login");
          return;
        }

        setAdminUser(user);

        // Verify Admin Role in profiles table
        const { data: profile, error: pError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (pError || !profile || profile.role !== "admin") {
          console.warn("User is not an admin in the database. Enabling temporary admin bypass for local development.");
          setIsAdminBypassed(true);
        }

        // Fetch DB data
        await loadAllData();
      } catch (err) {
        console.error("Auth initialization failed:", err);
        setIsMocked(true);
        loadMockData();
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndLoad();
  }, [navigate]);

  // Load Real Data from Supabase
  const loadAllData = async () => {
    try {
      let mockNeeded = false;

      // 1. Fetch profiles (users)
      const { data: profilesData, error: uError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (uError) {
        if (uError.code === "PGRST205") mockNeeded = true;
        else throw uError;
      } else {
        setUsers(profilesData || []);
      }

      // 2. Fetch submissions
      const { data: subsData, error: sError } = await supabase
        .from("submissions")
        .select("*, profiles(username, total_points)")
        .order("created_at", { ascending: false });

      if (sError) {
        if (sError.code === "PGRST205") mockNeeded = true;
        else throw sError;
      } else {
        setSubmissions(subsData || []);
      }

      // 3. Fetch rewards
      const { data: rewardsData, error: rError } = await supabase
        .from("rewards")
        .select("*")
        .order("name", { ascending: true });

      if (rError) {
        if (rError.code === "PGRST205") mockNeeded = true;
        else throw rError;
      } else {
        setRewards(rewardsData || []);
      }

      if (mockNeeded) {
        setIsMocked(true);
        loadMockData();
      } else {
        setIsMocked(false);
        // Calculate Stats
        const totalU = profilesData?.length || 0;
        const totalS = subsData?.length || 0;
        const approvedS = subsData?.filter(s => s.status === "approved").length || 0;
        const rate = totalS > 0 ? ((approvedS / totalS) * 100).toFixed(1) : 0;
        const totalPoints = profilesData?.reduce((acc, curr) => acc + (curr.total_points || 0), 0) || 0;

        setStats({
          totalUsers: totalU,
          totalVideos: totalS,
          approvalRate: rate,
          pointsDistributed: totalPoints,
        });

        setAiLogs([
          { timestamp: new Date().toISOString(), message: `Loaded ${totalU} users, ${totalS} submissions from Supabase.` },
          { timestamp: new Date().toISOString(), message: "Database tables verified successfully." }
        ]);
      }
    } catch (error) {
      console.error("Database fetch failed. Falling back to mock data.", error);
      setIsMocked(true);
      loadMockData();
    }
  };

  const loadMockData = () => {
    setStats(mockStats);
    setUsers(mockUsers);
    setSubmissions(mockSubmissions);
    setRewards(mockRewards);
    setAiLogs(mockLogs);
  };

  // Sign out handler
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  // Video review handlers
  const handleApprove = async (subId, userId, estPoints) => {
    try {
      if (isMocked) {
        // Mock State Update
        setSubmissions(prev =>
          prev.map(s => (s.id === subId ? { ...s, status: "approved", points_awarded: estPoints } : s))
        );
        setUsers(prev =>
          prev.map(u => (u.id === userId ? { ...u, total_points: (u.total_points || 0) + estPoints } : u))
        );
        setStats(prev => ({
          ...prev,
          pointsDistributed: prev.pointsDistributed + estPoints,
        }));
        showToast(`Approved submission in mock mode! Awarded ${estPoints} points.`, "success");
        return;
      }

      // 1. Update submission status in Supabase
      const { error: subError } = await supabase
        .from("submissions")
        .update({ status: "approved", points_awarded: estPoints })
        .eq("id", subId);

      if (subError) throw subError;

      // 2. Award points using RPC function
      const { error: rpcError } = await supabase.rpc("add_points", {
        p_user_id: userId,
        p_points: estPoints,
        p_reason: "Eco-video verification approved by Admin",
        p_reference_id: subId
      });

      if (rpcError) throw rpcError;

      showToast(`Submission approved successfully and ${estPoints} points credited.`, "success");
      await loadAllData();
    } catch (err) {
      console.error("Failed to approve submission:", err);
      showToast("Error approving submission: " + err.message, "error");
    }
  };

  const handleReject = async (subId) => {
    try {
      if (isMocked) {
        setSubmissions(prev =>
          prev.map(s => (s.id === subId ? { ...s, status: "rejected" } : s))
        );
        showToast("Rejected submission in mock mode.", "success");
        return;
      }

      const { error } = await supabase
        .from("submissions")
        .update({ status: "rejected" })
        .eq("id", subId);

      if (error) throw error;

      showToast("Submission rejected successfully.", "success");
      await loadAllData();
    } catch (err) {
      console.error("Failed to reject submission:", err);
      showToast("Error rejecting submission: " + err.message, "error");
    }
  };

  const handleRecalculateAI = async (subId) => {
    try {
      if (isMocked) {
        showToast("AI Recalculation mocked! Score updated to 78%.", "success");
        setSubmissions(prev =>
          prev.map(s => (s.id === subId ? { ...s, ai_score: 78, status: "pending" } : s))
        );
        return;
      }

      showToast("Invoking validate-video Edge Function. Please wait...", "warning");
      const { data, error } = await supabase.functions.invoke("validate-video", {
        body: { submissionId: subId }
      });

      if (error) throw error;

      showToast("Recalculation complete.", "success");
      await loadAllData();
    } catch (err) {
      console.error("AI recalculation failed:", err);
      showToast("Recalculation error: " + err.message, "error");
    }
  };

  // Rewards Actions
  const handleSaveReward = async (r) => {
    try {
      if (isMocked) {
        if (r.id) {
          setRewards(prev => prev.map(item => (item.id === r.id ? r : item)));
        } else {
          const newR = { ...r, id: `rew-${Date.now()}` };
          setRewards(prev => [...prev, newR]);
        }
        showToast("Reward inventory saved in mock mode!", "success");
        return true;
      }

      let error;
      if (r.id) {
        const { error: editError } = await supabase
          .from("rewards")
          .update({
            name: r.name,
            description: r.description,
            points_cost: parseInt(r.points_cost),
            stock: parseInt(r.stock),
            image_url: r.image_url,
            active: r.active
          })
          .eq("id", r.id);
        error = editError;
      } else {
        const { error: addError } = await supabase
          .from("rewards")
          .insert([
            {
              name: r.name,
              description: r.description,
              points_cost: parseInt(r.points_cost),
              stock: parseInt(r.stock),
              image_url: r.image_url,
              active: r.active
            }
          ]);
        error = addError;
      }

      if (error) throw error;
      showToast("Reward saved successfully.", "success");
      await loadAllData();
      return true;
    } catch (err) {
      console.error("Failed to save reward:", err);
      showToast("Error saving reward: " + err.message, "error");
      return false;
    }
  };

  const handleDeleteReward = (rewardId) => {
    requestConfirm(
      "Confirm Deletion",
      "Are you sure you want to delete this reward catalog item? This action is permanent.",
      async () => {
        try {
          if (isMocked) {
            setRewards(prev => prev.filter(r => r.id !== rewardId));
            showToast("Deleted reward item in mock mode.", "success");
            return;
          }

          const { error } = await supabase
            .from("rewards")
            .delete()
            .eq("id", rewardId);

          if (error) throw error;
          showToast("Reward deleted successfully.", "success");
          await loadAllData();
        } catch (err) {
          console.error("Failed to delete reward:", err);
          showToast("Error deleting reward: " + err.message, "error");
        }
      }
    );
  };

  // User details & points adjust handlers
  const handleAdjustPoints = async (userId, pointsChange, reason) => {
    try {
      if (isMocked) {
        setUsers(prev =>
          prev.map(u => (u.id === userId ? { ...u, total_points: (u.total_points || 0) + pointsChange } : u))
        );
        setStats(prev => ({
          ...prev,
          pointsDistributed: prev.pointsDistributed + pointsChange
        }));
        showToast(`Adjusted points by ${pointsChange} in mock mode.`, "success");
        return true;
      }

      const { error } = await supabase.rpc("add_points", {
        p_user_id: userId,
        p_points: pointsChange,
        p_reason: reason || "Admin direct adjustment",
      });

      if (error) throw error;

      showToast(`Successfully adjusted points.`, "success");
      await loadAllData();
      return true;
    } catch (err) {
      console.error("Failed to adjust points:", err);
      showToast("Error adjusting points: " + err.message, "error");
      return false;
    }
  };

  const handleToggleUserRole = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    requestConfirm(
      "Change User Role",
      `Are you sure you want to update the role of user ${user.username} to ${newRole}?`,
      async () => {
        try {
          if (isMocked) {
            setUsers(prev =>
              prev.map(u => (u.id === user.id ? { ...u, role: newRole } : u))
            );
            showToast(`User role updated to ${newRole} in mock mode.`, "success");
            return;
          }

          const { error } = await supabase
            .from("profiles")
            .update({ role: newRole })
            .eq("id", user.id);

          if (error) throw error;

          showToast("User role updated successfully.", "success");
          await loadAllData();
        } catch (err) {
          console.error("Failed to update user role:", err);
          showToast("Error updating user role: " + err.message, "error");
        }
      }
    );
  };

  // Rendering screen loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E150E] flex flex-col items-center justify-center text-[#DCE5D9]">
        <Loader2 className="animate-spin text-[#4BE277] mb-4" size={40} />
        <p className="font-mono text-sm tracking-widest text-[#BCCBB9] uppercase">Initializing GreenQuest Admin Panel...</p>
      </div>
    );
  }

  // Filter lists based on search query
  const filteredUsers = users.filter(
    u => u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubmissions = submissions.filter(
    s => s.profiles?.username?.toLowerCase().includes(searchQuery.toLowerCase()) || s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0E150E] text-[#DCE5D9] font-sans selection:bg-[#4BE277]/30 flex flex-col md:flex-row antialiased overflow-x-hidden">
      
      {/* Side Navigation Bar */}
      <aside className="w-full md:w-64 bg-[#161D16]/50 backdrop-blur-2xl border-b md:border-b-0 md:border-r border-[#DCE5D9]/10 shadow-xl flex flex-col p-4 gap-6 shrink-0 z-45">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-[#4BE277] flex items-center justify-center text-[#003915]">
            <BrainCircuit size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#4BE277]">GreenQuest</h1>
            <p className="text-[10px] text-[#BCCBB9] uppercase tracking-widest font-mono">Admin Panel</p>
          </div>
        </div>

        {/* Sidebar Tabs */}
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scroll-hide flex-grow">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer ${
              activeTab === "analytics"
                ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                : "text-[#BCCBB9] hover:bg-[#333B33]/20"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer ${
              activeTab === "users"
                ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                : "text-[#BCCBB9] hover:bg-[#333B33]/20"
            }`}
          >
            <Users size={18} />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveTab("moderation")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer ${
              activeTab === "moderation"
                ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                : "text-[#BCCBB9] hover:bg-[#333B33]/20"
            }`}
          >
            <Video size={18} />
            <span>Video Review</span>
            {submissions.filter(s => s.status === "pending" || s.status === "manual_review").length > 0 && (
              <span className="ml-auto bg-[#FFB4AB] text-[#690005] font-bold text-[10px] px-2 py-0.5 rounded-full font-mono">
                {submissions.filter(s => s.status === "pending" || s.status === "manual_review").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("rewards")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer ${
              activeTab === "rewards"
                ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                : "text-[#BCCBB9] hover:bg-[#333B33]/20"
            }`}
          >
            <Gift size={18} />
            <span>Rewards Management</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-logs")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer ${
              activeTab === "ai-logs"
                ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                : "text-[#BCCBB9] hover:bg-[#333B33]/20"
            }`}
          >
            <BrainCircuit size={18} />
            <span>AI logs</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all whitespace-nowrap active:translate-x-0.5 cursor-pointer ${
              activeTab === "reports"
                ? "bg-[#4BE277]/10 text-[#4BE277] border-l-4 border-[#4BE277]"
                : "text-[#BCCBB9] hover:bg-[#333B33]/20"
            }`}
          >
            <BarChart3 size={18} />
            <span>Reports</span>
          </button>
        </nav>

        {/* Sidebar bottom */}
        <div className="pt-4 border-t border-[#3D4A3D] flex flex-col gap-1">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-2 text-xs text-[#BCCBB9] hover:text-[#92DB2A] transition-all"
          >
            <HelpCircle size={14} />
            <span className="font-mono uppercase tracking-wider">Help Center</span>
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2 text-xs text-[#BCCBB9] hover:text-[#FFB4AB] transition-all w-full text-left cursor-pointer font-mono"
          >
            <LogOut size={14} />
            <span className="font-mono uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow min-h-screen p-4 md:p-8 space-y-6">
        
        {/* Status Alerts Bar */}
        {isMocked && (
          <div className="p-4 bg-[#FFB4AB]/10 border border-[#FFB4AB]/30 text-[#FFB4AB] rounded-xl flex items-center gap-3 animate-pulse">
            <ShieldAlert size={20} className="shrink-0" />
            <div className="text-xs">
              <span className="font-bold uppercase tracking-wider">Mock Offline Mode Active</span>: Supabase database tables (`submissions`, `rewards`) were not found. Using local sandbox state. To connect live features, run SQL scripts in <a href="file:///c:/Users/HP%20LAPTOP%2015s/GreenQuest/schema.sql" className="underline font-semibold hover:text-[#4BE277]">schema.sql</a>.
            </div>
            <button onClick={loadAllData} className="ml-auto text-xs border border-[#FFB4AB]/40 px-2 py-0.5 rounded hover:bg-[#FFB4AB]/20 transition-all font-mono cursor-pointer">
              Retry DB
            </button>
          </div>
        )}

        {isAdminBypassed && (
          <div className="p-3 bg-[#92DB2A]/10 border border-[#92DB2A]/30 text-[#92DB2A] rounded-xl flex items-center gap-2">
            <ShieldAlert size={16} className="shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Development Mode</span>: You are currently bypass-authenticated because your user record is not marked as `admin` in the `profiles` table. Run the alter commands in `schema.sql` and set `role = 'admin'` to secure access.
            </div>
          </div>
        )}

        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#DCE5D9]/5 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#DCE5D9] capitalize">{activeTab} Panel</h2>
            <p className="text-xs text-[#BCCBB9]">GreenQuest system administrator controls and ecological statistics.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BCCBB9]" size={16} />
              <input
                type="text"
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-60 bg-[#161D16] border border-[#3D4A3D] rounded-lg pl-9 pr-4 py-2 text-xs text-[#DCE5D9] placeholder-[#BCCBB9]/40 focus:border-[#4BE277] focus:ring-1 focus:ring-[#4BE277] outline-none transition-all"
              />
            </div>

            {/* Notification Button */}
            <button className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:bg-[#333B33]/40 transition-colors text-[#BCCBB9]">
              <Bell size={18} />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-3 border-l border-[#DCE5D9]/10">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100"
                alt="Admin Avatar"
                className="w-9 h-9 rounded-full border border-[#4BE277]/30 object-cover"
              />
              <div className="hidden lg:block text-left leading-none">
                <p className="text-xs font-semibold text-[#DCE5D9]">Admin.Sustain</p>
                <span className="text-[10px] text-[#4BE277] font-mono tracking-widest uppercase">Superuser</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Panel Selection Render */}
        {activeTab === "analytics" && (
          <AnalyticsTab stats={stats} />
        )}

        {activeTab === "users" && (
          <UserManagementTab
            filteredUsers={filteredUsers}
            handleAdjustPoints={handleAdjustPoints}
            handleToggleUserRole={handleToggleUserRole}
            showToast={showToast}
          />
        )}

        {activeTab === "moderation" && (
          <VideoReviewTab
            filteredSubmissions={filteredSubmissions}
            handleApprove={handleApprove}
            handleReject={handleReject}
            handleRecalculateAI={handleRecalculateAI}
            showToast={showToast}
          />
        )}

        {activeTab === "rewards" && (
          <RewardsTab
            rewards={rewards}
            handleSaveReward={handleSaveReward}
            handleDeleteReward={handleDeleteReward}
            showToast={showToast}
          />
        )}

        {activeTab === "ai-logs" && (
          <AiLogsTab aiLogs={aiLogs} />
        )}

        {activeTab === "reports" && (
          <ReportsTab />
        )}

      </main>

      {/* Floating Toasts container */}
      {toasts.length > 0 && createPortal(
        <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
          {toasts.map(t => (
            <div
              key={t.id}
              className={`p-4 rounded-xl border bg-[#161D16]/95 backdrop-blur-md shadow-2xl flex items-start gap-3 transition-all duration-300 pointer-events-auto animate-slide-in ${
                t.type === "error"
                  ? "border-[#FFB4AB] text-[#FFB4AB] shadow-[0_0_20px_rgba(255,180,171,0.15)]"
                  : t.type === "warning"
                  ? "border-[#92DB2A] text-[#92DB2A]"
                  : "border-[#4BE277] text-[#4BE277] shadow-[0_0_20px_rgba(74,225,118,0.15)]"
              }`}
            >
              {t.type === "error" ? (
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              ) : t.type === "warning" ? (
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              ) : (
                <Sparkles size={18} className="shrink-0 mt-0.5" />
              )}
              <div className="text-xs font-mono font-medium leading-normal flex-grow">
                {t.message}
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="text-[#BCCBB9] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}

      {/* Premium Custom Confirm Dialog Modal */}
      {confirmModal.isOpen && createPortal(
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
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
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