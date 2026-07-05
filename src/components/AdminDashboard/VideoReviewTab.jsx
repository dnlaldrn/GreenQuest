import React, { useState } from "react";
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
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-card max-w-2xl w-full rounded-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#DCE5D9]/10 pb-2">
              <h3 className="font-bold text-sm text-[#DCE5D9]">Evidence Video Preview</h3>
              <button onClick={() => setSelectedVideo(null)} className="text-[#BCCBB9] hover:text-white cursor-pointer">
                <CloseIcon size={20} />
              </button>
            </div>
            
            <div className="aspect-video bg-black rounded-lg overflow-hidden border border-[#3D4A3D]">
              <video src={selectedVideo.video_url} controls autoPlay className="w-full h-full object-contain" />
            </div>

            <div className="text-xs space-y-1 font-mono">
              <p className="text-[#DCE5D9]">
                <span className="font-semibold text-[#BCCBB9]">Description:</span> {selectedVideo.description}
              </p>
              <p className="text-[#DCE5D9]">
                <span className="font-semibold text-[#BCCBB9]">Estimated Points:</span> {selectedVideo.points_awarded || 150} pts
              </p>
              {selectedVideo.ai_feedback && (
                <p className="text-[#FFB4AB]">
                  <span className="font-semibold text-[#BCCBB9]">AI Feedback:</span> {selectedVideo.ai_feedback}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#DCE5D9]/10">
              {selectedVideo.status !== "approved" && selectedVideo.status !== "rejected" && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedVideo.id, selectedVideo.user_id, selectedVideo.points_awarded || 150);
                      setSelectedVideo(null);
                    }}
                    className="bg-[#4BE277] text-[#003915] font-bold px-4 py-2 rounded-lg text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <Check size={14} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedVideo.id);
                      setSelectedVideo(null);
                    }}
                    className="bg-[#FFB4AB] text-[#690005] font-bold px-4 py-2 rounded-lg text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedVideo(null)}
                className="bg-[#333B33] text-[#DCE5D9] px-4 py-2 rounded-lg text-xs hover:bg-[#333B33]/85 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
