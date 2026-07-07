import React, { useState } from "react";
import {
  Compass,
  Award,
  Clock,
  Flame,
  Zap,
  CheckCircle,
  Lock,
  Filter,
  Users,
} from "lucide-react";

export default function QuestsTab() {
  const [activeFilter, setActiveFilter] = useState("all");

  const quests = [
    {
      id: 1,
      title: "Plastic-Free Velocity",
      category: "recycling",
      description:
        "Collect and safely log 5kg of category 1 & 2 plastics at a recognized community recycling hub.",
      reward: 150,
      multiplier: "1.2x",
      timeLeft: "2 days left",
      progress: 60,
      status: "active",
      participants: 1420,
    },
    {
      id: 2,
      title: "Dawn Photovoltaic Audit",
      category: "energy",
      description:
        "Verify solar baseline generation metrics or submit an optimized consumption report during peak sun hours.",
      reward: 350,
      multiplier: "1.5x",
      timeLeft: "5 days left",
      progress: 0,
      status: "available",
      participants: 620,
    },
    {
      id: 3,
      title: "Urban Reforestation Micro-Drop",
      category: "biodiversity",
      description:
        "Plant a native flora species in a local designated zone and log geo-tagged evidence video.",
      reward: 200,
      multiplier: "1.0x",
      timeLeft: "14 hours left",
      progress: 100,
      status: "completed",
      participants: 3105,
    },
    {
      id: 4,
      title: "Grid Isolation protocol",
      category: "energy",
      description:
        "Achieve net-zero residential pull from public grids for an uninterrupted 4-hour cycle.",
      reward: 500,
      multiplier: "2.0x",
      timeLeft: "Locked",
      progress: 0,
      status: "locked",
      tierRequired: "Eco-Guardian Level 5",
      participants: 0,
    },
  ];

  const filteredQuests =
    activeFilter === "all"
      ? quests
      : quests.filter((q) => q.category === activeFilter);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6 bg-[#0B120F] text-slate-200">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Compass size={20} className="text-[#10B981]" />
            Active Impact Quests
          </h3>
          <p className="text-xs text-slate-400">
            Complete high-yield operations verified by AI to optimize your
            ecological node return parameters.
          </p>
        </div>

        {/* Level Stats Bar */}
        <div className="flex items-center gap-3 bg-[#111A16] border border-[#14231C] px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Award size={16} className="text-[#10B981]" />
          <div className="font-mono text-left">
            <div className="text-[10px] text-slate-500 leading-none uppercase">
              Current Tier
            </div>
            <div className="text-xs font-bold text-white leading-tight">
              Level 4 Citizen
            </div>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#14231C] scrollbar-none">
        <Filter size={12} className="text-slate-500 shrink-0 mr-1" />
        {[
          { id: "all", label: "All Operations" },
          { id: "recycling", label: "Waste Management" },
          { id: "energy", label: "Grid & Energy" },
          { id: "biodiversity", label: "Biodiversity" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1 text-[11px] font-mono rounded-lg transition-colors border whitespace-nowrap ${
              activeFilter === tab.id
                ? "bg-[#14281E] text-[#10B981] border-[#10B981]/30"
                : "bg-transparent text-slate-400 border-transparent hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* QUESTS GRID MAPPING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuests.map((quest) => (
          <div
            key={quest.id}
            className={`bg-[#111A16] border rounded-xl p-5 flex flex-col justify-between transition-all group relative overflow-hidden ${
              quest.status === "locked"
                ? "border-[#231A14] opacity-60"
                : "border-[#14231C] hover:border-[#10B981]/30"
            }`}
          >
            {/* Top State row */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                  quest.status === "completed"
                    ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/30"
                    : quest.status === "active"
                      ? "bg-[#14281E] text-[#10B981] border border-[#10B981]/20"
                      : quest.status === "locked"
                        ? "bg-amber-950/30 text-amber-500 border border-amber-900/20"
                        : "bg-[#0B120F] text-slate-400 border border-[#14231C]"
                }`}
              >
                {quest.status}
              </span>

              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                <Clock size={12} />
                <span>{quest.timeLeft}</span>
              </div>
            </div>

            {/* Core Metadata Information */}
            <div className="space-y-1 mb-4">
              <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                {quest.title}
                {quest.multiplier !== "1.0x" && quest.status !== "locked" && (
                  <span className="text-[9px] text-amber-500 font-mono bg-amber-500/10 px-1 rounded flex items-center gap-0.5">
                    <Zap size={8} fill="currentColor" /> {quest.multiplier}
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {quest.description}
              </p>
            </div>

            {/* Bottom Actions and Progress Metrics */}
            <div className="space-y-4 pt-2 border-t border-[#14231C]/60">
              {/* Dynamic Bottom Metric Rendering depending on quest status */}
              {quest.status === "locked" ? (
                <div className="flex items-center gap-2 text-[11px] font-mono text-amber-500/80">
                  <Lock size={12} />
                  <span>Requires {quest.tierRequired}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 uppercase text-[9px] block">
                      Yield Pool
                    </span>
                    <span className="text-[#10B981] font-black text-sm">
                      +{quest.reward}{" "}
                      <span className="text-[10px] font-normal">PTS</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 uppercase text-[9px] block flex items-center gap-1 justify-end">
                      <Users size={10} /> Deployment
                    </span>
                    <span className="text-white font-medium">
                      {quest.participants.toLocaleString()} active
                    </span>
                  </div>
                </div>
              )}

              {/* Progress Bar rendering */}
              {quest.status !== "locked" && (
                <div className="space-y-1">
                  <div className="w-full bg-[#0B120F] border border-[#14231C] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        quest.status === "completed"
                          ? "bg-[#10B981]"
                          : "bg-[#10B981]/60"
                      }`}
                      style={{ width: `${quest.progress}%` }}
                    />
                  </div>
                  {quest.status === "active" && (
                    <div className="text-right text-[9px] font-mono text-slate-500">
                      Linear Progress: {quest.progress}% Complete
                    </div>
                  )}
                </div>
              )}

              {/* Call to Action Button */}
              {quest.status === "available" && (
                <button
                  type="button"
                  className="w-full bg-[#10B981] hover:bg-[#0ea5e9] text-[#0B120F] font-bold py-2 text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Flame size={12} fill="currentColor" />
                  <span>Initiate Quest Route</span>
                </button>
              )}
              {quest.status === "active" && (
                <button
                  type="button"
                  className="w-full bg-transparent hover:bg-[#14281E] border border-[#10B981]/30 text-[#10B981] font-bold py-2 text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Log Evidence Feed</span>
                </button>
              )}
              {quest.status === "completed" && (
                <div className="w-full bg-[#14281E]/40 border border-[#10B981]/10 text-slate-400 py-1.5 text-xs rounded-lg flex items-center justify-center gap-1.5 font-mono">
                  <CheckCircle size={12} className="text-[#10B981]" />
                  <span>Rewards Minted & Settled</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
