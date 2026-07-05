import React from "react";
import WebGLShader from "./WebGLShader";
import {
  Users,
  Video,
  Check,
  Coins,
  TrendingUp,
  Sparkles,
  HeartHandshake
} from "lucide-react";

export default function AnalyticsTab({ stats }) {
  return (
    <div className="space-y-6">
      
      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl space-y-2 relative overflow-hidden group hover:border-[#4BE277]/40 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] text-[#BCCBB9] uppercase tracking-wider">Total Users</span>
            <Users className="text-[#4BE277]" size={16} />
          </div>
          <p className="text-3xl font-bold tracking-tight text-[#DCE5D9]">
            {stats.totalUsers.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[#4BE277] text-xs">
            <TrendingUp size={12} />
            <span>+12.5% this month</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#4BE277]/10">
            <div className="h-full bg-[#4BE277] w-2/3 shadow-[0_0_10px_rgba(74,225,118,0.5)]"></div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2 relative overflow-hidden group hover:border-[#8BD79B]/40 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] text-[#BCCBB9] uppercase tracking-wider">Total Videos</span>
            <Video className="text-[#8BD79B]" size={16} />
          </div>
          <p className="text-3xl font-bold tracking-tight text-[#DCE5D9]">
            {stats.totalVideos.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[#4BE277] text-xs">
            <span>+18 today</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#8BD79B]/10">
            <div className="h-full bg-[#8BD79B] w-1/2 shadow-[0_0_10px_rgba(139,215,155,0.5)]"></div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2 relative overflow-hidden group hover:border-[#92DB2A]/40 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] text-[#BCCBB9] uppercase tracking-wider">Approval Rate</span>
            <Check size={16} className="text-[#92DB2A]" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-[#DCE5D9]">{stats.approvalRate}%</p>
          <div className="flex items-center gap-1 text-[#BCCBB9] text-xs">
            <Sparkles size={12} className="text-[#92DB2A]" />
            <span>AI Automated Verification</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#92DB2A]/10">
            <div className="h-full bg-[#92DB2A]" style={{ width: `${stats.approvalRate}%` }}></div>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2 relative overflow-hidden group hover:border-[#4BE277]/40 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] text-[#BCCBB9] uppercase tracking-wider">Points Dist.</span>
            <Coins className="text-[#4BE277]" size={16} />
          </div>
          <p className="text-3xl font-bold tracking-tight text-[#DCE5D9]">
            {stats.pointsDistributed.toLocaleString()} pts
          </p>
          <div className="flex items-center gap-1 text-[#92DB2A] text-xs">
            <HeartHandshake size={12} />
            <span>High Community Engagement</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#4BE277]/10">
            <div className="h-full bg-[#4BE277] w-3/4 shadow-[0_0_10px_rgba(74,225,118,0.5)]"></div>
          </div>
        </div>
      </div>

      {/* Performance charts and metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* WebGL Shader growth chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 relative overflow-hidden flex flex-col justify-between border-t-2 border-[#4BE277] min-h-[350px]">
          <WebGLShader />
          
          <div className="flex justify-between items-center z-10">
            <div>
              <h3 className="text-lg font-bold text-[#DCE5D9]">Global Growth Analytics</h3>
              <p className="text-xs text-[#BCCBB9]">Interactive neon vectors mapping real-time upload speed metrics.</p>
            </div>
            <select className="bg-[#161D16] border border-[#3D4A3D] rounded-lg text-xs px-3 py-1.5 outline-none text-[#DCE5D9]">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          {/* Mock Chart Visual Nodes */}
          <div className="h-44 flex items-end justify-between gap-4 px-2 pb-2 relative z-10">
            <div className="flex-1 bg-[#4BE277]/15 rounded-lg group relative h-[30%] hover:h-[40%] hover:bg-[#4BE277]/30 transition-all cursor-pointer">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">12k</span>
            </div>
            <div className="flex-1 bg-[#4BE277]/15 rounded-lg group relative h-[50%] hover:h-[60%] hover:bg-[#4BE277]/30 transition-all cursor-pointer">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">24k</span>
            </div>
            <div className="flex-1 bg-[#4BE277]/15 rounded-lg group relative h-[45%] hover:h-[55%] hover:bg-[#4BE277]/30 transition-all cursor-pointer">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">18k</span>
            </div>
            <div className="flex-1 bg-[#4BE277]/15 rounded-lg group relative h-[80%] hover:h-[90%] hover:bg-[#4BE277]/30 transition-all cursor-pointer">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">32k</span>
            </div>
            <div className="flex-1 bg-[#4BE277]/15 rounded-lg group relative h-[65%] hover:h-[75%] hover:bg-[#4BE277]/30 transition-all cursor-pointer">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">28k</span>
            </div>
            <div className="flex-1 bg-[#4BE277]/15 rounded-lg group relative h-[95%] hover:h-[100%] hover:bg-[#4BE277]/30 transition-all cursor-pointer">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">40k</span>
            </div>
            <div className="flex-1 bg-[#4BE277] rounded-lg relative h-[85%] shadow-[0_0_15px_rgba(74,225,118,0.3)]">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-[#4BE277]">35k</span>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-[#BCCBB9] font-mono px-2 z-10">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </div>

        {/* AI performance details */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between border-t-2 border-[#92DB2A]">
          <h3 className="text-lg font-bold text-[#DCE5D9]">AI Verification Accuracy</h3>
          
          {/* SVG Progress Ring */}
          <div className="flex-grow flex items-center justify-center py-6 relative">
            <div className="w-40 h-40 rounded-full border-4 border-[#333B33] flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="76"
                  stroke="#92DB2A"
                  strokeDasharray="477.5"
                  strokeDashoffset={477.5 - (477.5 * 98.2) / 100}
                  strokeWidth="8"
                  className="shadow-[0_0_15px_rgba(146,219,42,0.4)]"
                />
              </svg>
              <div className="text-center">
                <span className="text-4xl font-extrabold text-[#92DB2A] font-mono leading-none">98.2%</span>
                <p className="text-[10px] text-[#BCCBB9] font-mono tracking-widest mt-1">CONFIDENCE</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#BCCBB9]">False Positives</span>
              <span className="text-[#DCE5D9] font-bold">0.4%</span>
            </div>
            <div className="w-full h-1.5 bg-[#333B33] rounded-full overflow-hidden">
              <div className="bg-[#FFB4AB] h-full w-[2%]"></div>
            </div>

            <div className="flex justify-between">
              <span className="text-[#BCCBB9]">Processing Speed</span>
              <span className="text-[#DCE5D9] font-bold">142ms / vid</span>
            </div>
            <div className="w-full h-1.5 bg-[#333B33] rounded-full overflow-hidden">
              <div className="bg-[#4BE277] h-full w-[85%]"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
