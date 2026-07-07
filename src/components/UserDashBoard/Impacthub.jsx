import React, { useState } from "react";
import {
  Globe,
  Flame,
  ShieldCheck,
  Leaf,
  Heart,
  MessageSquare,
  Share2,
  TrendingUp,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function ImpactHubTab() {
  const [likedFeeds, setLikedFeeds] = useState({});

  const toggleLike = (id) => {
    setLikedFeeds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Mock Data for Community Feed
  const feedItems = [
    {
      id: 1,
      user: "Elena Rostova",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      location: "Berlin, DE",
      badge: "Solar Vanguard",
      action: "Installed 4KW Micro-Solar Array",
      thumbnail:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&auto=format&fit=crop&q=80",
      impact: "Reduces 1.2 tons CO2 / year",
      points: 450,
      likes: 142,
      comments: 24,
    },
    {
      id: 2,
      user: "Marcus Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      location: "Singapore, SG",
      badge: "Ocean Protector",
      action: "Cleared 15kg Marine Plastics",
      thumbnail:
        "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=500&auto=format&fit=crop&q=80",
      impact: "Prevented localized microplastic runoff",
      points: 180,
      likes: 98,
      comments: 12,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6 bg-[#0B120F] text-slate-200">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Globe size={20} className="text-[#10B981]" />
            Global Impact Hub
          </h3>
          <p className="text-xs text-slate-400">
            Connect with collective eco-guardians, stream real-time
            verifications, and observe macro-environmental telemetry.
          </p>
        </div>

        {/* Dynamic Streak Tracker Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#14281E] border border-[#10B981]/20 rounded-xl self-start sm:self-auto">
          <Flame size={16} className="text-amber-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-[#10B981] uppercase tracking-wider">
            14 Day Network Hotstreak
          </span>
        </div>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111A16] border border-[#14231C] p-4 rounded-xl">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
            CO2 Offset Collectively
          </div>
          <div className="text-xl font-black text-white tracking-tight">
            142,804.5{" "}
            <span className="text-xs text-[#10B981] font-normal">Tons</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-1 flex items-center gap-1">
            <TrendingUp size={10} className="text-[#10B981]" /> +3.4% vs last
            week
          </div>
        </div>
        <div className="bg-[#111A16] border border-[#14231C] p-4 rounded-xl">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
            Total Verified Actions
          </div>
          <div className="text-xl font-black text-white tracking-tight">
            892,412
          </div>
          <div className="text-[9px] text-[#10B981] font-mono mt-1 flex items-center gap-1">
            <ShieldCheck size={10} /> 99.8% Protocol Authenticated
          </div>
        </div>
        <div className="bg-[#111A16] border border-[#14231C] p-4 rounded-xl">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
            Active Eco-Guardians
          </div>
          <div className="text-xl font-black text-white tracking-tight">
            41,205{" "}
            <span className="text-xs text-slate-500 font-normal">Online</span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full inline-block animate-ping" />{" "}
            Node updates synchronized
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT TWO COLUMNS: LIVE VERIFICATION FEED */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono px-1">
            Live Actions Stream
          </h4>

          {feedItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#111A16] border border-[#14231C] rounded-xl overflow-hidden p-4 space-y-3"
            >
              {/* User Profile Info Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.avatar}
                    alt={item.user}
                    className="w-8 h-8 rounded-lg object-cover border border-[#14231C]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs leading-none">
                        {item.user}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#14281E] border border-[#10B981]/20 rounded text-[#10B981]">
                        {item.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {item.location}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-[#10B981] block">
                    +{item.points} PTS
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                    Verified Yield
                  </span>
                </div>
              </div>

              {/* Action Description */}
              <p className="text-xs text-slate-200 font-medium">
                {item.action}
              </p>

              {/* Content Video Frame Simulation */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-[#0B120F] border border-[#14231C] group">
                <img
                  src={item.thumbnail}
                  alt="Impact verification timeline"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-[1.02] transition-transform duration-500"
                />

                {/* Simulated AI Overlays */}
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur border border-[#14231C] px-2 py-1 rounded text-[9px] font-mono text-slate-300 flex items-center gap-1.5">
                  <Leaf size={10} className="text-[#10B981]" />
                  <span>{item.impact}</span>
                </div>
              </div>

              {/* Feed Action Bar Buttons */}
              <div className="flex items-center gap-6 pt-1 text-slate-400 text-xs font-mono">
                <button
                  onClick={() => toggleLike(item.id)}
                  className={`flex items-center gap-1.5 transition-colors ${likedFeeds[item.id] ? "text-rose-400" : "hover:text-white"}`}
                >
                  <Heart
                    size={14}
                    fill={likedFeeds[item.id] ? "currentColor" : "transparent"}
                  />
                  <span>
                    {likedFeeds[item.id] ? item.likes + 1 : item.likes}
                  </span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <MessageSquare size={14} />
                  <span>{item.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-white transition-colors ml-auto">
                  <Share2 size={14} />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: REVENUE SECTORS & LOCAL TARGETS */}
        <div className="space-y-6">
          {/* REGIONAL ALLIANCES MINI-LEADERBOARD */}
          <div className="bg-[#111A16] border border-[#14231C] p-4 rounded-xl space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
              Top Regional Clusters
            </h4>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 bg-[#0B120F] border border-[#14231C] rounded-lg">
                <span className="text-slate-400">1. EU-Central Node</span>
                <span className="text-[#10B981] font-bold">1.2M pts</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#0B120F] border border-[#14231C] rounded-lg">
                <span className="text-slate-400">2. APAC-South Node</span>
                <span className="text-white font-bold">984K pts</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#0B120F] border border-[#14231C] rounded-lg">
                <span className="text-slate-400">3. NA-Pacific Node</span>
                <span className="text-white font-bold">811K pts</span>
              </div>
            </div>
          </div>

          {/* GLOBAL MILESTONE PROGRESS WIDGET */}
          <div className="bg-[#111A16] border border-[#14231C] p-4 rounded-xl space-y-4">
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                Active Global Project
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide font-mono">
                UN Goal 13: Climate Action Alliance
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">
                  Mangrove Forestation target
                </span>
                <span className="text-[#10B981] font-bold">84%</span>
              </div>
              <div className="w-full bg-[#1A2E24] rounded-full h-2">
                <div
                  className="bg-[#10B981] h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  style={{ width: "84%" }}
                ></div>
              </div>
              <div className="text-[9px] text-slate-500 font-mono text-right">
                42,000 / 50,000 Saplings Planted
              </div>
            </div>

            <a
              href="#learn-more"
              className="w-full bg-[#0B120F] hover:bg-[#14231C] border border-[#14231C] py-2 px-3 text-[11px] text-slate-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Review Node Allocation</span>
              <ExternalLink size={12} className="text-slate-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
