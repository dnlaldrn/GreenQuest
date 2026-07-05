import React from "react";

export default function ReportsTab() {
  return (
    <section className="glass-card rounded-xl border border-[#DCE5D9]/10 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#DCE5D9]">Ecological Balance Report</h3>
        <p className="text-xs text-[#BCCBB9]">Overview of community actions and cumulative offsets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-center">
        <div className="p-4 bg-[#161D16] border border-[#3D4A3D] rounded-xl">
          <span className="text-[10px] text-[#BCCBB9] uppercase tracking-wider block mb-1">
            Carbon Offset Equivalent
          </span>
          <p className="text-2xl font-bold text-[#4BE277]">14.8 Metric Tons</p>
        </div>
        <div className="p-4 bg-[#161D16] border border-[#3D4A3D] rounded-xl">
          <span className="text-[10px] text-[#BCCBB9] uppercase tracking-wider block mb-1">
            Total Trees Planted
          </span>
          <p className="text-2xl font-bold text-[#92DB2A]">1,280 Seedlings</p>
        </div>
        <div className="p-4 bg-[#161D16] border border-[#3D4A3D] rounded-xl">
          <span className="text-[10px] text-[#BCCBB9] uppercase tracking-wider block mb-1">
            Waste Recycled
          </span>
          <p className="text-2xl font-bold text-[#8BD79B]">3.2 Metric Tons</p>
        </div>
      </div>

      <div className="bg-[#161D16]/50 border border-[#3D4A3D]/30 p-4 rounded-xl space-y-2">
        <h4 className="text-xs uppercase font-bold text-[#DCE5D9] tracking-wider mb-2">
          Sustainable Development Goal (SDG) Target Impact
        </h4>
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#BCCBB9]">SDG 13: Climate Action</span>
              <span className="text-[#4BE277] font-bold">75% Target Reached</span>
            </div>
            <div className="w-full h-2 bg-[#333B33] rounded-full overflow-hidden">
              <div className="bg-[#4BE277] h-full w-[75%]"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#BCCBB9]">SDG 15: Life on Land</span>
              <span className="text-[#92DB2A] font-bold">58% Target Reached</span>
            </div>
            <div className="w-full h-2 bg-[#333B33] rounded-full overflow-hidden">
              <div className="bg-[#92DB2A] h-full w-[58%]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
