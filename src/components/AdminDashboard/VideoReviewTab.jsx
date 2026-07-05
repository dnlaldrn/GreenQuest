import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Play, Check, X, RefreshCw, X as CloseIcon } from "lucide-react";

export default function VideoReviewTab({
  filteredSubmissions,
  handleApprove,
  handleReject,
  handleRecalculateAI
}) {
  // Local state for Video Player Modal
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <section className="glass-card rounded-xl overflow-hidden border border-[#DCE5D9]/10">
      <div className="p-6 border-b border-[#DCE5D9]/10">
        <h3 className="text-lg font-bold text-[#DCE5D9]">Eco Video Verification Queue</h3>
        <p className="text-xs text-[#BCCBB9]">Review pending video evidence where AI checks flagged confidence criteria.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#161D16] text-[#BCCBB9] font-mono text-[10px] uppercase tracking-wider border-b border-[#DCE5D9]/10">
              <th className="px-6 py-4">Participant</th>
              <th className="px-6 py-4">Submission details</th>
              <th className="px-6 py-4">Evidence Preview</th>
              <th className="px-6 py-4">AI Confidence</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Moderator Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE5D9]/5">
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-xs text-[#BCCBB9] font-mono">
                  No submissions currently in the verification queue.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((s) => (
                <tr key={s.id} className="hover:bg-[#333B33]/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1A221A] border border-[#4BE277]/20 flex items-center justify-center font-bold text-xs uppercase text-[#4BE277]">
                        {s.profiles?.username ? s.profiles.username.slice(0, 2) : "GQ"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#DCE5D9]">{s.profiles?.username || "Eco Participant"}</p>
                        <span className="text-[10px] text-[#BCCBB9] font-mono">Points: {s.profiles?.total_points || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-xs text-[#DCE5D9] line-clamp-2">{s.description || "No description provided."}</p>
                    <span className="text-[9px] text-[#BCCBB9] font-mono block mt-1">
                      {new Date(s.created_at || Date.now()).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedVideo(s)}
                      className="relative w-24 h-14 rounded-lg overflow-hidden border border-[#3D4A3D] group block cursor-pointer bg-black/40"
                    >
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                        <Play size={16} className="text-white fill-white shadow-lg scale-100 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="w-full h-full bg-[#161D16] flex items-center justify-center font-mono text-[9px] text-[#BCCBB9]">
                        Video Preview
                      </div>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-mono">
                      <div className="w-16 h-1.5 bg-[#333B33] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            (s.ai_score || 0) < 50 ? "bg-[#FFB4AB]" : "bg-[#92DB2A]"
                          }`}
                          style={{ width: `${s.ai_score || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold">{s.ai_score || 0}%</span>
                    </div>
                    {s.ai_feedback && (
                      <span className="text-[9px] text-[#BCCBB9] block mt-0.5 line-clamp-1 truncate max-w-[150px]" title={s.ai_feedback}>
                        {s.ai_feedback}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      s.status === "approved"
                        ? "bg-[#4BE277]/10 text-[#4BE277] border border-[#4BE277]/30"
                        : s.status === "rejected"
                        ? "bg-[#FFB4AB]/10 text-[#FFB4AB] border border-[#FFB4AB]/30"
                        : "bg-[#FFB4AB]/20 text-[#FFB4AB] animate-pulse border border-[#FFB4AB]/40"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${s.status === "approved" ? "bg-[#4BE277]" : "bg-[#FFB4AB]"}`}></span>
                      {s.status === "manual_review" ? "Manual Review" : s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                    {s.status !== "approved" && s.status !== "rejected" && (
                      <>
                        <button
                          onClick={() => handleApprove(s.id, s.user_id, s.points_awarded || 150)}
                          className="w-8 h-8 rounded-lg bg-[#4BE277]/10 text-[#4BE277] border border-[#4BE277]/20 hover:bg-[#4BE277]/20 transition-all flex items-center justify-center active:scale-90 inline-flex cursor-pointer"
                          title="Approve Verification"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(s.id)}
                          className="w-8 h-8 rounded-lg bg-[#FFB4AB]/10 text-[#FFB4AB] border border-[#FFB4AB]/20 hover:bg-[#FFB4AB]/20 transition-all flex items-center justify-center active:scale-90 inline-flex cursor-pointer"
                          title="Reject Evidence"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleRecalculateAI(s.id)}
                      className="w-8 h-8 rounded-lg bg-[#333B33] text-[#BCCBB9] hover:bg-[#4BE277]/10 hover:text-[#4BE277] border border-[#3D4A3D] transition-all flex items-center justify-center active:scale-90 inline-flex cursor-pointer"
                      title="Recalculate with Gemini API"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && createPortal(
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#161D16] border border-[#4BE277]/30 shadow-[0_0_40px_rgba(74,225,118,0.15)] max-w-2xl w-full rounded-2xl overflow-hidden p-5 space-y-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#DCE5D9]/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4BE277] animate-pulse"></span>
                <h3 className="font-bold text-sm text-[#DCE5D9] uppercase tracking-wider font-mono">
                  Evidence Verification Console
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-[#BCCBB9] hover:text-[#FFB4AB] hover:bg-[#FFB4AB]/10 p-1.5 rounded-lg transition-all cursor-pointer"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            
            {/* Sleek Cinematic Video Box with Max Height Capped */}
            <div className="aspect-video bg-black/90 rounded-xl overflow-hidden border border-[#3D4A3D] shadow-inner relative flex items-center justify-center max-h-[240px] md:max-h-[260px] mx-auto w-full">
              <video
                src={selectedVideo.video_url}
                controls
                autoPlay
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Structured Metadata Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-black/30 border border-[#3D4A3D]/50 p-3 rounded-xl font-mono text-[11px] text-[#BCCBB9]">
              <div className="space-y-2">
                <div>
                  <span className="text-[#4BE277]/70 font-semibold uppercase block text-[9px] tracking-wider">
                    Participant
                  </span>
                  <p className="text-xs font-semibold text-[#DCE5D9]">
                    {selectedVideo.profiles?.username || "Eco Participant"}
                  </p>
                </div>
                <div>
                  <span className="text-[#4BE277]/70 font-semibold uppercase block text-[9px] tracking-wider">
                    Estimated Points
                  </span>
                  <p className="text-xs font-bold text-[#92DB2A]">
                    +{selectedVideo.points_awarded || 150} pts
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[#4BE277]/70 font-semibold uppercase block text-[9px] tracking-wider">
                    Evidence Description
                  </span>
                  <p className="text-xs text-[#DCE5D9] leading-relaxed">
                    {selectedVideo.description || "No description provided."}
                  </p>
                </div>
                {selectedVideo.ai_feedback && (
                  <div>
                    <span className="text-[#FFB4AB]/70 font-semibold uppercase block text-[9px] tracking-wider">
                      AI Feedback & Diagnostics
                    </span>
                    <p className="text-[10px] text-[#FFB4AB] leading-relaxed">
                      {selectedVideo.ai_feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-[#DCE5D9]/10">
              <div className="text-[9px] text-[#BCCBB9] font-mono">
                Status: <span className="uppercase text-[#FFB4AB]">{selectedVideo.status}</span>
              </div>
              <div className="flex gap-2">
                {selectedVideo.status !== "approved" && selectedVideo.status !== "rejected" && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedVideo.id, selectedVideo.user_id, selectedVideo.points_awarded || 150);
                        setSelectedVideo(null);
                      }}
                      className="bg-[#4BE277] text-[#003915] font-bold px-4 py-2 rounded-lg text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer font-mono shadow-[0_0_15px_rgba(75,226,119,0.2)]"
                    >
                      <Check size={12} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedVideo.id);
                        setSelectedVideo(null);
                      }}
                      className="bg-[#FFB4AB]/10 text-[#FFB4AB] border border-[#FFB4AB]/30 hover:bg-[#FFB4AB]/20 font-bold px-4 py-2 rounded-lg text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer font-mono"
                    >
                      <X size={12} />
                      <span>Reject</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="bg-[#333B33] text-[#DCE5D9] border border-[#3D4A3D] px-4 py-2 rounded-lg text-[10px] hover:bg-[#333B33]/80 transition-colors cursor-pointer font-mono"
                >
                  Dismiss Console
                </button>
              </div>
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
