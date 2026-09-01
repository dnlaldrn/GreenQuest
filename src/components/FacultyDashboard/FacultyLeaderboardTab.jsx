import React from "react";
import { Trophy, Medal, Award } from "lucide-react";

export default function FacultyLeaderboardTab({ leaders }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#4be277] flex items-center gap-2">
          <Trophy size={20} />
          <span>Faculty Challenge Leaderboard</span>
        </h3>
        <p className="text-xs text-[#bccbb9] mt-0.5">
          Live faculty rankings across university sustainability departments for Season 4.
        </p>
      </div>

      {/* Podium Cards Top 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {leaders.slice(0, 3).map((leader) => (
          <div
            key={leader.rank}
            className={`p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden backdrop-blur-xl ${
              leader.rank === 1
                ? "bg-gradient-to-b from-[#22c55e]/20 to-[#161d16]/80 border-[#4be277]/50 shadow-[0_0_20px_rgba(75,226,119,0.15)]"
                : leader.rank === 2
                ? "bg-[#161d16]/70 border-white/15 shadow-md"
                : "bg-[#161d16]/70 border-white/10 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm font-mono ${
                  leader.rank === 1
                    ? "bg-[#4be277] text-[#003915]"
                    : leader.rank === 2
                    ? "bg-slate-300 text-slate-900"
                    : "bg-amber-600 text-white"
                }`}
              >
                #{leader.rank}
              </div>
              <span className="text-[11px] font-mono text-[#bccbb9] uppercase">
                {leader.entriesCount} entries
              </span>
            </div>

            <div className="my-4">
              <div className="font-bold text-base text-[#dce5d9] truncate">
                {leader.name}
              </div>
              <div className="text-xs font-mono text-[#bccbb9]">
                {leader.dept}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#bccbb9]">Score</span>
              <span className="text-lg font-black text-[#4be277] font-mono">
                {leader.pts} pts
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <section className="bg-[#161d16]/70 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h4 className="font-bold text-sm text-[#dce5d9]">
            All Participating Faculty
          </h4>
          <span className="font-mono text-xs text-[#bccbb9]">
            Ranked by Community Votes
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {leaders.map((leader) => (
            <div
              key={leader.rank}
              className={`py-3.5 px-3 rounded-xl flex items-center justify-between gap-4 transition-colors ${
                leader.isUser
                  ? "bg-[#2f372e]/50 border border-[#4be277]/40 shadow-[0_0_15px_rgba(75,226,119,0.1)]"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    leader.rank === 1
                      ? "bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30"
                      : "bg-[#242c24] text-[#bccbb9]"
                  }`}
                >
                  {leader.rank}
                </div>
                <div className="min-w-0">
                  <div
                    className={`font-bold text-sm truncate ${
                      leader.isUser ? "text-[#4be277]" : "text-[#dce5d9]"
                    }`}
                  >
                    {leader.name} {leader.isUser && "(You)"}
                  </div>
                  <div className="text-xs font-mono text-[#bccbb9]">
                    {leader.dept} • {leader.entriesCount} entries
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-bold text-base text-[#4be277] font-mono">
                  {leader.pts}
                </div>
                <div className="text-[10px] font-mono text-[#bccbb9]">
                  votes
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
