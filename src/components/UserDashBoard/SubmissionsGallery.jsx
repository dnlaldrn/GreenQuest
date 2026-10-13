import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSubmissionVotes } from "../../hooks/SubmissionVoteHandler";
import { Leaf, ThumbsUp, CheckCircle2, Play, X, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function SubmissionsGallery({ showToast }) {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubmission, setActiveSubmission] = useState(null); // submission currently open in modal
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const [isResolvingVideo, setIsResolvingVideo] = useState(false);

  const { toggleVote, votingId } = useSubmissionVotes(
    submissions,
    setSubmissions,
    showToast,
  );

  // Fetch submissions + vote counts from submissions / submission_votes
  const fetchSubmissions = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("submissions")
      .select(
        `
        id, user_id, title, category, description, video_path, video_url,
        status, ai_score, ai_feedback, points_awarded, created_at,
        profiles ( username ),
        submission_votes ( user_id )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((submission) => ({
      ...submission,
      votes: submission.submission_votes.length,
      hasVoted: user
        ? submission.submission_votes.some((v) => v.user_id === user.id)
        : false,
    }));
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const data = await fetchSubmissions();
        if (isMounted) setSubmissions(data ?? []);
      } catch (err) {
        console.error("Failed to load submissions:", err);
        showToast?.("Failed to load submissions.", "error");
        if (isMounted) setSubmissions([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchSubmissions]);

  // Resolve a playable URL for the clicked submission, then open the modal
  const handleOpenVideo = async (submission) => {
    setActiveSubmission(submission);
    setPlaybackUrl(null);
    setIsResolvingVideo(true);

    try {
      const { data, error } = await supabase.storage
        .from("eco-videos")
        .createSignedUrl(submission.video_path, 3600); // valid for 1 hour

      if (error) throw error;
      if (!data?.signedUrl) throw new Error("Could not resolve video URL.");

      setPlaybackUrl(data.signedUrl);
    } catch (err) {
      console.error("Failed to resolve video:", err);
      showToast?.("Couldn't load this video. Please try again.", "error");
      setActiveSubmission(null);
    } finally {
      setIsResolvingVideo(false);
    }
  };

  const handleCloseModal = () => {
    setActiveSubmission(null);
    setPlaybackUrl(null);
  };

  // Close on Escape key
  useEffect(() => {
    if (!activeSubmission) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSubmission]);

  return (
    <div className="space-y-6 p-5">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#8bd79b] flex items-center gap-2">
          <Leaf size={20} />
          <span>Eco Submissions</span>
        </h3>
        <p className="text-xs text-[#bccbb9] mt-0.5">
          View and vote on eco-friendly submissions from the community.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-[#161d16]/70 rounded-2xl border border-white/10">
          <Loader2 size={28} className="mx-auto text-[#4be277] animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center bg-[#161d16]/70 rounded-2xl border border-white/10 space-y-3">
          <Leaf size={40} className="mx-auto text-[#bccbb9]" />
          <h4 className="text-base font-bold text-[#dce5d9]">No Submissions Yet</h4>
          <p className="text-xs text-[#bccbb9] max-w-sm mx-auto">
            Submissions will appear here once users start uploading.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wide text-[#8bd79b] border-b border-white/10 pb-2">
              All Submissions ({submissions.length})
            </h4>
            {submissions.length === 0 ? (
              <p className="text-xs text-[#bccbb9] italic">
                No submissions yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {submissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    votingId={votingId}
                    toggleVote={toggleVote}
                    handleOpenVideo={handleOpenVideo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {activeSubmission && (
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
                {activeSubmission.category || 'Eco Activity'}
              </div>
              <h4 className="font-bold text-base text-[#dce5d9]">
                {activeSubmission.title}
              </h4>
              <div className="flex items-center justify-between pt-1">
                {activeSubmission.profiles?.username && (
                  <span className="text-xs text-[#bccbb9] font-mono">
                    by {activeSubmission.profiles.username}
                  </span>
                )}
                <button
                  onClick={() => toggleVote(activeSubmission.id)}
                  disabled={votingId === activeSubmission.id}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeSubmission.hasVoted
                      ? "bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30"
                      : "text-[#bccbb9] hover:text-[#4be277] hover:bg-white/5 border border-white/10"
                  }`}
                >
                  {activeSubmission.hasVoted ? "Voted" : "Vote"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SubmissionCard({ submission, votingId, toggleVote, handleOpenVideo }) {
  // Determine if submission is processed/approved based on status
  const isProcessed = submission.status === 'approved' || submission.status === 'rejected';
  const isVerified = submission.status === 'approved';

  return (
    <div className="text-left bg-[#161d16]/70 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 p-4 space-y-3 shadow-lg hover:border-[#4be277]/40 transition-colors group flex flex-col justify-between">
      <div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleOpenVideo(submission)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOpenVideo(submission);
          }}
          className="relative aspect-video rounded-lg overflow-hidden bg-[#091009] cursor-pointer"
          title="Watch submission video"
        >
          <img
            src="https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&auto=format&fit=crop&q=80"
            alt={submission.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-[#4be277]/90 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
              <Play size={18} className="text-[#003915] fill-current ml-0.5" />
            </div>
          </div>
          {/* Verified badge - based on approval status */}
          {isVerified && (
            <div className="absolute top-2.5 left-2.5 bg-[#78be00]/85 text-[#2a4700] font-mono text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>Verified</span>
            </div>
          )}
          {/* Processing overlay - for pending/manual_review status */}
          {!isProcessed && submission.status !== 'rejected' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/60">
              <RefreshCw size={20} className="text-[#4be277] animate-spin mb-1" />
              <span className="font-mono text-[11px] text-[#dce5d9]">
                Processing...
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="font-mono text-[10px] text-[#4be277] uppercase">
            {submission.category}
          </div>
          <h4
            onClick={() => handleOpenVideo(submission)}
            className="font-bold text-sm text-[#dce5d9] truncate cursor-pointer hover:text-[#4be277] transition-colors"
          >
            {submission.title}
          </h4>
          {submission.profiles?.username && (
            <p className="text-[11px] text-[#bccbb9] font-mono truncate">
              by {submission.profiles.username}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleVote(submission.id);
            }}
            disabled={votingId === submission.id}
            className={`px-4 py-1.5 rounded-md font-mono text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              submission.hasVoted
                ? "bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30"
                : "text-[#bccbb9] hover:text-[#4be277] hover:bg-white/5 border border-white/10"
            }`}
          >
            {submission.hasVoted ? "Voted" : "Vote"}
          </button>
          <span className="flex items-center gap-1.5 text-xs font-mono text-[#4be277]">
            <ThumbsUp
              size={13}
              className={submission.hasVoted ? "fill-current" : ""}
            />
            {submission.votes}
          </span>
        </div>
      </div>
    </div>
  );
}