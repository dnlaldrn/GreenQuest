import React, { useState } from "react";
import {
  Trophy,
  Crown,
  ArrowUpRight,
  Zap,
  Search,
  Globe,
  Map,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { sanitizeAlphanumeric } from "../../lib/validation";

export default function LeaderboardsTab() {
  const [timeframe, setTimeframe] = useState("weekly");
  const [scope, setScope] = useState("global");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock Global Rankings Array
  const leaders = [
    {
      rank: 1,
      name: "Elena Rostova",
      points: 14820,
      actions: 124,
      region: "EU",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    {
      rank: 2,
      name: "Marcus Chen",
      points: 13950,
      actions: 98,
      region: "APAC",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    {
      rank: 3,
      name: "Amara Diallo",
      points: 12110,
      actions: 112,
      region: "AF",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    {
      rank: 4,
      name: "Zephyr Green",
      points: 9840,
      actions: 76,
      region: "NA",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    {
      rank: 5,
      name: "Sora Takahashi",
      points: 9410,
      actions: 84,
      region: "APAC",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    },
    {
      rank: 14,
      name: "You (EcoGuard_71)",
      points: 4120,
      actions: 34,
      region: "NA",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      isUser: true,
    },
  ];

  const podium = leaders.slice(0, 3);
  const rows = leaders
    .slice(3)
    .filter((player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6 bg-[#0B120F] text-slate-200">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            Node Leaderboards
          </h3>
          <p className="text-xs text-slate-400">
            Track elite citizens optimizing planetary health metrics. Global
            tiers distribute monthly yield incentives.
          </p>
        </div>

        {/* Double Toggle Controller Switch */}
        <div className="flex bg-[#111A16] border border-[#14231C] p-1 rounded-xl gap-1 self-start sm:self-auto font-mono text-[10px]">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-3 py-1 rounded-lg transition-colors ${timeframe === "weekly" ? "bg-[#14281E] text-[#10B981]" : "text-slate-400"}`}
          >
            Weekly Epoch
          </button>
          <button
            onClick={() => setTimeframe("alltime")}
            className={`px-3 py-1 rounded-lg transition-colors ${timeframe === "alltime" ? "bg-[#14281E] text-[#10B981]" : "text-slate-400"}`}
          >
            All-Time Accumulation
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#111A16] border border-[#14231C] p-3 rounded-xl">
        <div className="flex bg-[#0B120F] border border-[#14231C] p-1 rounded-lg w-full sm:w-auto font-mono text-[11px]">
          <button
            onClick={() => setScope("global")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${scope === "global" ? "bg-[#14281E] text-[#10B981]" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Globe size={12} /> Global
          </button>
          <button
            onClick={() => setScope("regional")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${scope === "regional" ? "bg-[#14281E] text-[#10B981]" : "text-slate-500 hover:text-slate-300"}`}
          >
            <Map size={12} /> Regional Cluster
          </button>
        </div>

        <div className="relative w-full sm:flex-1">
          <Search
            size={14}
            className="absolute left-3 top-2.5 text-slate-600"
          />
          <input
            type="text"
            maxLength={40}
            value={searchQuery}
            onChange={(e) => setSearchQuery(sanitizeAlphanumeric(e.target.value, 40, 3))}
            placeholder="Search citizen or alias parameters..."
            className="w-full bg-[#0B120F] border border-[#14231C] rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-700"
          />
        </div>
      </div>

      {/* PODIUM DISPLAY GRID (TOP 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 items-end">
        {/* SECOND PLACE */}
        {podium[1] && (
          <div className="bg-[#111A16] border border-[#14231C] rounded-xl p-5 text-center order-2 sm:order-1 relative group hover:border-[#10B981]/20 transition-colors">
            <div className="w-14 h-14 mx-auto relative mb-3">
              <img
                src={podium[1].avatar}
                alt=""
                className="w-full h-full object-cover rounded-xl border-2 border-slate-400"
              />
              <div className="absolute -bottom-1 -right-1 bg-slate-400 text-[#0B120F] font-mono font-bold text-[10px] w-5 h-5 rounded-md flex items-center justify-center">
                2
              </div>
            </div>
            <h4 className="font-bold text-white text-sm truncate">
              {podium[1].name}
            </h4>
            <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">
              {podium[1].region} Node • {podium[1].actions} Claims
            </p>
            <div className="text-sm font-mono font-black text-slate-300 mt-2">
              {podium[1].points.toLocaleString()}{" "}
              <span className="text-[10px] font-normal text-slate-500">
                pts
              </span>
            </div>
          </div>
        )}

        {/* FIRST PLACE */}
        {podium[0] && (
          <div className="bg-[#14281E]/30 border border-amber-500/20 rounded-xl p-6 text-center order-1 sm:order-2 relative group sm:-translate-y-2 shadow-[0_4px_20px_rgba(245,158,11,0.05)]">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-amber-500">
              <Crown size={18} fill="currentColor" />
            </div>
            <div className="w-18 h-18 mx-auto relative mb-3 mt-2">
              <img
                src={podium[0].avatar}
                alt=""
                className="w-full h-full object-cover rounded-xl border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-[#0B120F] font-mono font-bold text-[11px] w-5 h-5 rounded-md flex items-center justify-center">
                1
              </div>
            </div>
            <h4 className="font-black text-white text-base truncate tracking-tight">
              {podium[0].name}
            </h4>
            <p className="text-[10px] font-mono text-amber-500/80 uppercase mt-0.5">
              {podium[0].region} Node • {podium[0].actions} Claims
            </p>
            <div className="text-base font-mono font-black text-amber-400 mt-2 flex items-center justify-center gap-1">
              <Sparkles size={14} />
              <span>
                {podium[0].points.toLocaleString()}{" "}
                <span className="text-[10px] font-normal text-amber-500/60">
                  pts
                </span>
              </span>
            </div>
          </div>
        )}

        {/* THIRD PLACE */}
        {podium[2] && (
          <div className="bg-[#111A16] border border-[#14231C] rounded-xl p-5 text-center order-3 relative group hover:border-[#10B981]/20 transition-colors">
            <div className="w-14 h-14 mx-auto relative mb-3">
              <img
                src={podium[2].avatar}
                alt=""
                className="w-full h-full object-cover rounded-xl border-2 border-amber-700"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-700 text-[#0B120F] font-mono font-bold text-[10px] w-5 h-5 rounded-md flex items-center justify-center">
                3
              </div>
            </div>
            <h4 className="font-bold text-white text-sm truncate">
              {podium[2].name}
            </h4>
            <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">
              {podium[2].region} Node • {podium[2].actions} Claims
            </p>
            <div className="text-sm font-mono font-black text-amber-700 mt-2">
              {podium[2].points.toLocaleString()}{" "}
              <span className="text-[10px] font-normal text-slate-500">
                pts
              </span>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED REMAINING ROWS LIST */}
      <div className="bg-[#111A16] border border-[#14231C] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#0B120F]/60 border-b border-[#14231C] text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Rank</div>
          <div className="col-span-6">Citizen Profile</div>
          <div className="col-span-2 text-right">Actions</div>
          <div className="col-span-2 text-right">Total Yield</div>
        </div>

        <div className="divide-y divide-[#14231C]/40">
          {rows.map((player) => (
            <div
              key={player.rank}
              className={`grid grid-cols-12 gap-2 px-4 py-3 items-center text-xs transition-colors ${
                player.isUser
                  ? "bg-[#14281E]/30 border-y border-[#10B981]/20"
                  : "hover:bg-[#14231C]/20"
              }`}
            >
              {/* Rank column */}
              <div className="col-span-2 font-mono text-slate-400 font-bold">
                #{player.rank}
              </div>

              {/* Citizen Details column */}
              <div className="col-span-6 flex items-center gap-2.5 min-w-0">
                <img
                  src={player.avatar}
                  alt=""
                  className="w-6 h-6 rounded object-cover border border-[#14231C] shrink-0"
                />
                <div className="truncate">
                  <span
                    className={`font-bold block truncate ${player.isUser ? "text-[#10B981]" : "text-slate-200"}`}
                  >
                    {player.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                    {player.region} Node Hub
                  </span>
                </div>
              </div>

              {/* Verified actions column */}
              <div className="col-span-2 text-right font-mono text-slate-400">
                {player.actions}
              </div>

              {/* Total points column */}
              <div className="col-span-2 text-right font-mono font-black text-white flex items-center justify-end gap-1">
                <span>{player.points.toLocaleString()}</span>
                <ArrowUpRight
                  size={10}
                  className="text-[#10B981]/50 hidden sm:inline"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DISQUALIFICATION COMPLIANCE FOOTER NOTE */}
      <div className="bg-[#0B120F] border border-[#231A14] p-3 rounded-lg flex items-start gap-2.5 text-amber-500/80 text-[10px] leading-normal font-mono">
        <ShieldAlert size={14} className="shrink-0 mt-0.5 text-amber-600" />
        <span>
          Anti-spoof algorithms parse telemetry continuously. Suspicious
          activity logs automatically trigger verification freezes.
        </span>
      </div>
    </div>
  );
}
