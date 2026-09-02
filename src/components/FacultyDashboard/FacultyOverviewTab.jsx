import React, { useRef, useState, useEffect } from "react";
import {
  Sparkles,
  Video,
  ThumbsUp,
  Trophy,
  Clock,
  UploadCloud,
  FileVideo,
  Trash2,
  Loader2,
  Send,
  Leaf,
  Grid,
  List,
  CheckCircle2,
  Play,
  RefreshCw,
  Award,
} from "lucide-react";
import { sanitizeAlphanumeric } from "../../lib/validation";

export default function FacultyOverviewTab({
  facultyDisplayName,
  entries,
  setEntries,
  leaders,
  setActiveTab,
  showToast,
}) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [specimen, setSpecimen] = useState("Monstera Deliciosa (Variegated)");
  const [entryTitle, setEntryTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [daysLeft, setDaysLeft] = useState(0);

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
      showToast("Please upload a valid MP4, MOV, or WebM video file.", "error");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      showToast("Video file exceeds the 50MB size limit.", "error");
      return;
    }
    setSelectedFile(file);
    showToast(`Loaded: ${file.name}`, "success");
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitEntry = (e) => {
    if (e) e.preventDefault();

    if (!entryTitle.trim() || entryTitle.trim().length < 3) {
      showToast(
        "Please enter an entry title (at least 3 characters).",
        "error",
      );
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
        isOwner: true,
        image:
          "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&auto=format&fit=crop&q=80",
      };

      setEntries((prev) => [newEntry, ...prev]);
      setIsUploading(false);
      setEntryTitle("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast("Challenge entry uploaded successfully!", "success");
    }, 1000);
  };

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
      }),
    );
  };

  useEffect(() => {
    const now = new Date();
    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    setDaysLeft(lastDay - now.getDate());
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Welcome Hero Banner (Clean, non-redundant) */}
      <section className="bg-[#161d16]/70 backdrop-blur-xl rounded-2xl p-5 sm:p-7 border border-white/10 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#4be277]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4be277]/10 border border-[#4be277]/20 text-[#4be277] font-mono text-[11px] sm:text-xs">
            <Sparkles size={12} />
            <span>Faculty Challenge Season 4</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-[#dce5d9] tracking-tight">
            Welcome back, {facultyDisplayName}.
          </h2>
          <p className="text-xs sm:text-sm text-[#bccbb9] max-w-3xl leading-relaxed">
            Your botanical video submissions are currently ranking in the top
            15% of the faculty sustainability challenge. Document specimen
            growth milestones to accumulate community peer votes.
          </p>
        </div>
      </section>

      {/* 2. 4 Bento Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-24 sm:h-28 border border-white/10 border-t-2 border-t-[#4be277] shadow-lg">
          <Video className="text-[#4be277]" size={18} />
          <div>
            <div className="text-[#bccbb9] font-mono text-[10px] sm:text-[11px] mb-0.5">
              Total Entries
            </div>
            <div className="text-lg sm:text-2xl font-bold text-[#dce5d9]">
              {entries.length}
            </div>
          </div>
        </div>

        <div className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-24 sm:h-28 border border-white/10 border-t-2 border-t-[#8bd79b] shadow-lg">
          <ThumbsUp className="text-[#8bd79b]" size={18} />
          <div>
            <div className="text-[#bccbb9] font-mono text-[10px] sm:text-[11px] mb-0.5">
              Votes Received
            </div>
            <div className="text-lg sm:text-2xl font-bold text-[#dce5d9]">
              1.4k
            </div>
          </div>
        </div>

        <div className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-24 sm:h-28 border border-white/10 border-t-2 border-t-[#acf847] shadow-lg">
          <Trophy className="text-[#acf847]" size={18} />
          <div>
            <div className="text-[#bccbb9] font-mono text-[10px] sm:text-[11px] mb-0.5">
              Current Rank
            </div>
            <div className="text-lg sm:text-2xl font-bold text-[#dce5d9]">
              #4
            </div>
          </div>
        </div>

        <div className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-24 sm:h-28 border border-white/10 border-t-2 border-t-[#ffb4ab] shadow-lg">
          <Clock className="text-[#ffb4ab]" size={18} />
          <div>
            <div className="text-[#bccbb9] font-mono text-[10px] sm:text-[11px] mb-0.5">
              Days Remaining
            </div>
            <div className="text-lg sm:text-2xl font-bold text-[#ffb4ab]">
              {daysLeft}
            </div>
          </div>
        </div>
      </div>

      {/* 3. 2-Column Grid: Upload Form + Top Leaders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Form */}
        <div className="lg:col-span-8">
          <section
            id="upload-section"
            className="bg-[#1a221a]/80 backdrop-blur-2xl rounded-2xl p-5 sm:p-6 border border-white/10 shadow-[0_0_25px_rgba(75,226,119,0.05)] h-full flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#4be277]/20 flex items-center justify-center text-[#4be277] shrink-0">
                  <UploadCloud size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#dce5d9]">
                    New Specimen Upload
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#bccbb9]">
                    Submit botanical footage for peer review and challenge
                    voting.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitEntry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-[#bccbb9] mb-1.5 uppercase tracking-wider">
                      Plant Specimen
                    </label>
                    <select
                      value={specimen}
                      onChange={(e) => setSpecimen(e.target.value)}
                      className="w-full bg-[#242c24] border border-white/10 rounded-lg p-2.5 text-xs text-[#dce5d9] focus:border-[#4be277] focus:ring-1 focus:ring-[#4be277] transition-all outline-none"
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
                          sanitizeAlphanumeric(e.target.value, 50, 3),
                        )
                      }
                      placeholder="e.g., Week 4 Leaf Unfurling"
                      className="w-full bg-[#242c24] border border-white/10 rounded-lg p-2.5 text-xs text-[#dce5d9] placeholder-[#bccbb9]/40 focus:border-[#4be277] focus:ring-1 focus:ring-[#4be277] transition-all outline-none"
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
                  className={`border-2 border-dashed rounded-xl p-5 sm:p-7 text-center transition-all bg-[#161d16]/50 relative overflow-hidden group cursor-pointer ${
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

                  {selectedFile ? (
                    <div className="flex flex-col items-center justify-center space-y-2 py-1">
                      <FileVideo size={36} className="text-[#4be277]" />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#4be277] truncate max-w-xs sm:max-w-md">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-[#bccbb9] font-mono">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-mono pt-1 cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Remove file</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <UploadCloud
                        size={32}
                        className="mx-auto text-[#bccbb9] mb-2 group-hover:text-[#4be277] transition-colors"
                      />
                      <p className="text-xs sm:text-sm font-medium text-[#dce5d9]">
                        Drag and drop your video file here
                      </p>
                      <p className="text-[11px] font-mono text-[#bccbb9]">
                        MP4, MOV, or WebM (max 50MB)
                      </p>
                      <div className="pt-2">
                        <span className="inline-block px-4 py-1.5 border border-white/20 rounded-full font-mono text-[11px] text-[#dce5d9] group-hover:bg-[#2f372e] transition-colors">
                          Browse Files
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Submit Button */}
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#4be277] to-[#22c55e] hover:shadow-[0_0_20px_rgba(75,226,119,0.4)] text-[#003915] font-bold px-7 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-xs uppercase font-mono disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Uploading Video...</span>
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
            </div>
          </section>
        </div>

        {/* Right Column: Quick Leaderboard */}
        <div className="lg:col-span-4">
          <section className="bg-[#161d16]/70 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between h-full shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/10">
                <h3 className="text-sm sm:text-base font-bold flex items-center gap-2 text-[#dce5d9]">
                  <Trophy className="text-[#92db2a]" size={18} />
                  <span>Top Leaders</span>
                </h3>
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className="text-[#4be277] font-mono text-xs hover:underline cursor-pointer"
                >
                  Full Board →
                </button>
              </div>

              <div className="space-y-2.5">
                {leaders.slice(0, 4).map((leader) => (
                  <div
                    key={leader.rank}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                      leader.isUser
                        ? "bg-[#2f372e]/50 border border-[#4be277]/40 shadow-[0_0_15px_rgba(75,226,119,0.1)]"
                        : "bg-[#242c24]/50 border border-white/5 hover:border-[#4be277]/20"
                    }`}
                  >
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
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
                    <div className="text-right shrink-0">
                      <div className="font-bold text-xs sm:text-sm text-[#4be277] font-mono">
                        {leader.pts}
                      </div>
                      <div className="text-[9px] font-mono text-[#bccbb9]">
                        pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge Tip */}
            <div className="mt-4 p-3 rounded-xl bg-[#091009]/80 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#acf847]">
                <Award size={13} />
                <span>Challenge Tip</span>
              </div>
              <p className="text-[11px] text-[#bccbb9] leading-relaxed">
                High-resolution 1080p time-lapses gain 2.4x more peer votes.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* 4. Recent Challenge Submissions */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-[#8bd79b]">
            <Leaf size={18} />
            <span>Recent Challenge Submissions</span>
          </h3>

          {/* Grid / List View Toggle */}
          <div className="flex gap-1 bg-[#161d16] p-1 rounded-lg border border-white/10">
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

        {/* Cards Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl overflow-hidden group border border-white/10 hover:border-[#4be277]/40 transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Media Thumbnail */}
                <div className="relative aspect-video w-full bg-[#091009] overflow-hidden">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      entry.isProcessing
                        ? "grayscale opacity-40 blur-[1px]"
                        : "opacity-90 group-hover:opacity-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e150e] via-transparent to-transparent"></div>

                  {/* Badges */}
                  {entry.isVerified && (
                    <div className="absolute top-2.5 left-2.5 bg-[#78be00]/85 text-[#2a4700] font-mono text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm border border-[#92db2a]/40 flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      <span>Verified</span>
                    </div>
                  )}

                  {!entry.isProcessing && (
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-[#2f372e]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-mono border border-white/10">
                      <Play size={10} className="text-[#4be277] fill-current" />
                      <span>{entry.duration}</span>
                    </div>
                  )}

                  {/* Processing AI overlay */}
                  {entry.isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                      <RefreshCw
                        size={24}
                        className="text-[#4be277] animate-spin mb-1.5"
                      />
                      <span className="font-mono text-xs text-[#dce5d9] font-bold">
                        Processing AI Analysis...
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-[10px] text-[#4be277] uppercase tracking-wider">
                      {entry.specimen}
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-[#dce5d9] truncate group-hover:text-[#4be277] transition-colors">
                      {entry.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleToggleVote(entry.id)}
                      className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        entry.hasVoted
                          ? "bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30"
                          : "text-[#bccbb9] hover:text-[#4be277] hover:bg-white/5"
                      }`}
                    >
                      <ThumbsUp
                        size={13}
                        className={entry.hasVoted ? "fill-current" : ""}
                      />
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
            {entries.map((entry) => (
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
                    className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      entry.hasVoted
                        ? "bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30"
                        : "text-[#bccbb9] hover:text-[#4be277] hover:bg-white/5"
                    }`}
                  >
                    <ThumbsUp
                      size={13}
                      className={entry.hasVoted ? "fill-current" : ""}
                    />
                    <span>{entry.votes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
