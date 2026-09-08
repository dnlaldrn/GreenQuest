import React, { useState, useEffect, useCallback } from "react";
import {
  Vote,
  Leaf,
  CheckCircle2,
  XCircle,
  Play,
  ThumbsUp,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function GreenMateVotesTab({ showToast }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("faculty_entries")
        .select(
          `
          id, user_id, title, specimen, video_path, video_url,
          is_verified, duration, created_at,
          profiles ( username ),
          faculty_votes ( id, user_id )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map((entry) => ({
        ...entry,
        author: entry.profiles?.username || "Unknown Faculty",
        votesCount: entry.faculty_votes?.length || 0,
      }));

      setEntries(formatted);
    } catch (err) {
      console.error("Failed to load GreenMate entries for admin:", err);
      showToast?.("Failed to fetch GreenMate Challenge entries.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Admin toggle for entry verification status
  const handleToggleVerify = async (entry) => {
    setUpdatingId(entry.id);
    const newStatus = !entry.is_verified;
    try {
      const { error } = await supabase
        .from("faculty_entries")
        .update({ is_verified: newStatus })
        .eq("id", entry.id);

      if (error) throw error;

      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, is_verified: newStatus } : e))
      );
      showToast?.(
        `Entry "${entry.title}" ${newStatus ? "verified" : "marked unverified"}.`,
        "success"
      );
    } catch (err) {
      console.error("Error updating entry verification:", err);
      showToast?.("Failed to update status: " + err.message, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = entries.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.specimen?.toLowerCase().includes(q) ||
      e.author?.toLowerCase().includes(q)
    );
  });

  const totalVotes = entries.reduce((acc, curr) => acc + curr.votesCount, 0);
  const verifiedCount = entries.filter((e) => e.is_verified).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & KPI Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161D16]/90 border border-[#3D4A3D]/40 rounded-2xl p-4">
          <div className="flex items-center justify-between text-[#BCCBB9] text-xs font-mono mb-2">
            <span>Total Entries</span>
            <Leaf size={16} className="text-[#4BE277]" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {entries.length}
          </div>
          <div className="text-[10px] text-[#BCCBB9] mt-1">
            Faculty botanical submissions
          </div>
        </div>

        <div className="bg-[#161D16]/90 border border-[#3D4A3D]/40 rounded-2xl p-4">
          <div className="flex items-center justify-between text-[#BCCBB9] text-xs font-mono mb-2">
            <span>Total Student Votes</span>
            <ThumbsUp size={16} className="text-[#4BE277]" />
          </div>
          <div className="text-2xl font-bold text-[#4BE277] tracking-tight">
            {totalVotes}
          </div>
          <div className="text-[10px] text-[#BCCBB9] mt-1">
            Cast by authenticated students
          </div>
        </div>

        <div className="bg-[#161D16]/90 border border-[#3D4A3D]/40 rounded-2xl p-4">
          <div className="flex items-center justify-between text-[#BCCBB9] text-xs font-mono mb-2">
            <span>Verified Entries</span>
            <ShieldCheck size={16} className="text-[#8bd79b]" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {verifiedCount}
          </div>
          <div className="text-[10px] text-[#BCCBB9] mt-1">
            Approved for challenge rewards
          </div>
        </div>

        <div className="bg-[#161D16]/90 border border-[#3D4A3D]/40 rounded-2xl p-4">
          <div className="flex items-center justify-between text-[#BCCBB9] text-xs font-mono mb-2">
            <span>Verification Rate</span>
            <Vote size={16} className="text-[#92DB2A]" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {entries.length > 0
              ? `${Math.round((verifiedCount / entries.length) * 100)}%`
              : "0%"}
          </div>
          <div className="text-[10px] text-[#BCCBB9] mt-1">
            Faculty challenge completion
          </div>
        </div>
      </div>

      {/* Main List Section */}
      <div className="bg-[#161D16]/90 border border-[#3D4A3D]/40 rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-bold text-[#DCE5D9] flex items-center gap-2">
              <Vote size={18} className="text-[#4BE277]" />
              <span>GreenMate Challenge Submissions & Votes</span>
            </h3>
            <p className="text-xs text-[#BCCBB9]">
              Review faculty uploads, monitor student voting integrity, and manage specimen verification.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BCCBB9]"
              />
              <input
                type="text"
                placeholder="Search specimen or faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121912] border border-[#3D4A3D] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#DCE5D9] placeholder-[#BCCBB9]/40 focus:border-[#4BE277] outline-none"
              />
            </div>

            <button
              onClick={fetchEntries}
              disabled={loading}
              className="p-2 bg-[#121912] border border-[#3D4A3D] hover:bg-[#333B33]/40 rounded-lg text-[#BCCBB9] hover:text-white transition-colors cursor-pointer"
              title="Refresh entries"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Entries Table */}
        {loading ? (
          <div className="p-12 text-center text-[#BCCBB9] text-xs font-mono flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-[#4BE277]" />
            Loading challenge submissions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[#3D4A3D]/40 rounded-xl space-y-2">
            <AlertCircle size={28} className="mx-auto text-[#BCCBB9]" />
            <p className="text-xs text-[#BCCBB9]">No challenge entries match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#DCE5D9]">
              <thead className="bg-[#121912]/80 border-b border-[#3D4A3D]/40 text-[#BCCBB9] font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Specimen & Title</th>
                  <th className="p-3">Faculty Contributor</th>
                  <th className="p-3">Student Votes</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3D4A3D]/20">
                {filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-[#333B33]/15 transition-colors"
                  >
                    <td className="p-3">
                      <div className="font-semibold text-white truncate max-w-xs">
                        {entry.title}
                      </div>
                      <div className="text-[11px] text-[#4BE277] font-mono">
                        {entry.specimen}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[#BCCBB9]">
                      {entry.author}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#4BE277]/15 text-[#4BE277] border border-[#4BE277]/30">
                        <ThumbsUp size={11} />
                        {entry.votesCount}
                      </span>
                    </td>
                    <td className="p-3">
                      {entry.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#78be00] bg-[#78be00]/10 px-2 py-0.5 rounded border border-[#78be00]/30">
                          <CheckCircle2 size={12} />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#BCCBB9]">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleVerify(entry)}
                        disabled={updatingId === entry.id}
                        className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-50 ${
                          entry.is_verified
                            ? "border-[#FFB4AB]/40 text-[#FFB4AB] hover:bg-[#FFB4AB]/10"
                            : "border-[#4BE277]/40 text-[#4BE277] hover:bg-[#4BE277]/10"
                        }`}
                      >
                        {updatingId === entry.id
                          ? "Saving..."
                          : entry.is_verified
                          ? "Revoke"
                          : "Verify"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
