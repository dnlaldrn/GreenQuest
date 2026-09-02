import React from "react";
import {
  Leaf,
  ThumbsUp,
  CheckCircle2,
  Play,
  RefreshCw,
  UploadCloud,
} from "lucide-react";

export default function FacultyMyEntriesTab({ entries, setActiveTab }) {
  const myEntries = entries.filter((e) => e.isOwner);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#8bd79b] flex items-center gap-2">
            <Leaf size={20} />
            <span>My Challenge Submissions</span>
          </h3>
          <p className="text-xs text-[#bccbb9] mt-0.5">
            Manage your documented specimens and monitor peer vote metrics.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("dashboard")}
          className="bg-gradient-to-r from-[#4be277] to-[#22c55e] text-[#003915] font-bold px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider hover:scale-[1.02] transition-transform cursor-pointer"
        >
          + Upload New
        </button>
      </div>

      {myEntries.length === 0 ? (
        <div className="p-12 text-center bg-[#161d16]/70 rounded-2xl border border-white/10 space-y-3">
          <UploadCloud size={40} className="mx-auto text-[#bccbb9]" />
          <h4 className="text-base font-bold text-[#dce5d9]">
            No Submissions Found
          </h4>
          <p className="text-xs text-[#bccbb9] max-w-sm mx-auto">
            You haven't uploaded any challenge entries yet. Share your plant
            growth time-lapse to participate!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {myEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[#161d16]/70 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 p-4 space-y-3 shadow-lg hover:border-[#4be277]/40 transition-colors"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-[#091009]">
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="w-full h-full object-cover"
                />
                {entry.isVerified && (
                  <div className="absolute top-2.5 left-2.5 bg-[#78be00]/85 text-[#2a4700] font-mono text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>Verified</span>
                  </div>
                )}
                {!entry.isProcessing && (
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-[#2f372e]/90 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-mono">
                    <Play size={10} className="text-[#4be277] fill-current" />
                    <span>{entry.duration}</span>
                  </div>
                )}
                {entry.isProcessing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/60">
                    <RefreshCw
                      size={20}
                      className="text-[#4be277] animate-spin mb-1"
                    />
                    <span className="font-mono text-[11px] text-[#dce5d9]">
                      AI Analysis in Progress
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div className="font-mono text-[10px] text-[#4be277] uppercase">
                  {entry.specimen}
                </div>
                <h4 className="font-bold text-sm text-[#dce5d9] truncate">
                  {entry.title}
                </h4>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-[#bccbb9] pt-2 border-t border-white/5">
                <span className="flex items-center gap-1 text-[#4be277]">
                  <ThumbsUp size={13} /> {entry.votes} votes
                </span>
                <span>{entry.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
