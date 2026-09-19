import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useFacultyVotes } from "../../hooks/VoteHandler";
import { Leaf, ThumbsUp, CheckCircle2, Play, X, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AllEntriesGallery({ showToast }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeEntry, setActiveEntry] = useState(null); // entry currently open in modal
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const [isResolvingVideo, setIsResolvingVideo] = useState(false);

  const { toggleVote, votingId } = useFacultyVotes(
    entries,
    setEntries,
    showToast,
  );

  // Fetch entries + vote counts from faculty_entries / faculty_votes
  const fetchEntries = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("faculty_entries")
      .select(
        `
        id, user_id, title, specimen, video_path, video_url,
        is_verified, duration, created_at,
        profiles ( username, user_type ),
        faculty_votes ( user_id )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((entry) => ({
      ...entry,
      votes: entry.faculty_votes.length,
      hasVoted: user
        ? entry.faculty_votes.some((v) => v.user_id === user.id)
        : false,
      isVerified: entry.is_verified,
    }));
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchEntries();
        if (isMounted) setEntries(data ?? []);
      } catch (err) {
        console.error("Failed to load faculty entries:", err);
        showToast?.("Failed to load entries.", "error");
        if (isMounted) setEntries([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchEntries]);

  // Split entries into faculty / employee groups, faculty first
  const { facultyEntries, employeeEntries } = useMemo(() => {
    const faculty = [];
    const employee = [];
    for (const entry of entries) {
      const type = entry.profiles?.user_type?.toLowerCase();
      if (type === "faculty") {
        faculty.push(entry);
      } else {
        // treat anything else (e.g. "employee", null, undefined) as employee
        employee.push(entry);
      }
    }
    return { facultyEntries: faculty, employeeEntries: employee };
  }, [entries]);

  // Resolve a playable URL for the clicked entry, then open the modal
  const handleOpenVideo = async (entry) => {
    setActiveEntry(entry);
    setPlaybackUrl(null);
    setIsResolvingVideo(true);

    try {
      const { data, error } = await supabase.storage
        .from("plant-vids")
        .createSignedUrl(entry.video_path, 3600); // valid for 1 hour

      if (error) throw error;
      if (!data?.signedUrl) throw new Error("Could not resolve video URL.");

      setPlaybackUrl(data.signedUrl);
    } catch (err) {
      console.error("Failed to resolve video:", err);
      showToast?.("Couldn't load this video. Please try again.", "error");
      setActiveEntry(null);
    } finally {
      setIsResolvingVideo(false);
    }
  };

  const handleCloseModal = () => {
    setActiveEntry(null);
    setPlaybackUrl(null);
  };

  // Close on Escape key
  useEffect(() => {
    if (!activeEntry) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeEntry]);

  return (
    <div className="space-y-6 p-5">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#8bd79b] flex items-center gap-2">
          <Leaf size={20} />
          <span>Challenge Entries</span>
        </h3>
        <p className="text-xs text-[#bccbb9] mt-0.5">
          Click any entry to watch the full submission.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-[#161d16]/70 rounded-2xl border border-white/10">
          <Loader2 size={28} className="mx-auto text-[#4be277] animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="p-12 text-center bg-[#161d16]/70 rounded-2xl border border-white/10 space-y-3">
          <Leaf size={40} className="mx-auto text-[#bccbb9]" />
          <h4 className="text-base font-bold text-[#dce5d9]">No Entries Yet</h4>
          <p className="text-xs text-[#bccbb9] max-w-sm mx-auto">
            Submissions will appear here once faculty start uploading.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <EntrySection
            label="Faculty"
            entries={facultyEntries}
            votingId={votingId}
            toggleVote={toggleVote}
            handleOpenVideo={handleOpenVideo}
          />
          <EntrySection
            label="Employee"
            entries={employeeEntries}
            votingId={votingId}
            toggleVote={toggleVote}
            handleOpenVideo={handleOpenVideo}
          />
        </div>
      )}

      {/* Video Player Modal */}
      {activeEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-3xl bg-[#161d16] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Close video"
            >
              <X size={18} />
            </button>

            <div className="aspect-video bg-black flex items-center justify-center">
              {isResolvingVideo ? (
                <Loader2 size={32} className="text-[#4be277] animate-spin" />
              ) : playbackUrl ? (
                <video
                  src={playbackUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : (
                <p className="text-sm text-[#bccbb9]">Video unavailable.</p>
              )}
            </div>

            <div className="p-4 sm:p-5 space-y-1.5">
              <div className="font-mono text-[10px] text-[#4be277] uppercase">
                {activeEntry.specimen}
              </div>
              <h4 className="font-bold text-base text-[#dce5d9]">
                {activeEntry.title}
              </h4>
              <div className="flex items-center justify-between pt-1">
                {activeEntry.profiles?.username && (
                  <span className="text-xs text-[#bccbb9] font-mono">
                    by {activeEntry.profiles.username}
                  </span>
                )}
                <button
                  onClick={() => toggleVote(activeEntry.id)}
                  disabled={votingId === activeEntry.id}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeEntry.hasVoted
                      ? "bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30"
                      : "text-[#bccbb9] hover:text-[#4be277] hover:bg-white/5 border border-white/10"
                  }`}
                >
                  {activeEntry.hasVoted ? "Voted" : "Vote"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EntrySection({
  label,
  entries,
  votingId,
  toggleVote,
  handleOpenVideo,
}) {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-xs uppercase tracking-wide text-[#8bd79b] border-b border-white/10 pb-2">
        {label} ({entries.length})
      </h4>
      {entries.length === 0 ? (
        <p className="text-xs text-[#bccbb9] italic">
          No {label.toLowerCase()} entries yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              votingId={votingId}
              toggleVote={toggleVote}
              handleOpenVideo={handleOpenVideo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EntryCard({ entry, votingId, toggleVote, handleOpenVideo }) {
  return (
    <div className="text-left bg-[#161d16]/70 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 p-4 space-y-3 shadow-lg hover:border-[#4be277]/40 transition-colors group flex flex-col justify-between">
      <div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleOpenVideo(entry)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOpenVideo(entry);
          }}
          className="relative aspect-video rounded-lg overflow-hidden bg-[#091009] cursor-pointer"
          title="Watch specimen video"
        >
          <img
            src={
              entry.image ||
              "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&auto=format&fit=crop&q=80"
            }
            alt={entry.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-[#4be277]/90 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
              <Play size={18} className="text-[#003915] fill-current ml-0.5" />
            </div>
          </div>
          {entry.isVerified && (
            <div className="absolute top-2.5 left-2.5 bg-[#78be00]/85 text-[#2a4700] font-mono text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>Verified</span>
            </div>
          )}
          {entry.duration && (
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-[#2f372e]/90 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-mono">
              <span>{entry.duration}</span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="font-mono text-[10px] text-[#4be277] uppercase">
            {entry.specimen}
          </div>
          <h4
            onClick={() => handleOpenVideo(entry)}
            className="font-bold text-sm text-[#dce5d9] truncate cursor-pointer hover:text-[#4be277] transition-colors"
          >
            {entry.title}
          </h4>
          {entry.profiles?.username && (
            <p className="text-[11px] text-[#bccbb9] font-mono truncate">
              by {entry.profiles.username}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-white/5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleVote(entry.id);
          }}
          disabled={votingId === entry.id}
          className={`px-4 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            entry.hasVoted
              ? "bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30"
              : "text-[#bccbb9] hover:text-[#4be277] hover:bg-white/5 border border-white/10"
          }`}
        >
          {entry.hasVoted ? "Voted" : "Vote"}
        </button>
        <span className="flex items-center gap-1.5 text-xs font-mono text-[#4be277]">
          <ThumbsUp
            size={13}
            className={entry.hasVoted ? "fill-current" : ""}
          />
          {entry.votes}
        </span>
      </div>
    </div>
  );
}
