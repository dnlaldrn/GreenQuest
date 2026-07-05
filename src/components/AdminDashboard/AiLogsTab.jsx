import React from "react";

export default function AiLogsTab({ aiLogs }) {
  return (
    <section className="glass-card rounded-xl overflow-hidden border border-[#DCE5D9]/10 p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-[#DCE5D9]">Edge Logs Console</h3>
        <p className="text-xs text-[#BCCBB9]">Diagnostics and validation tracking of video streams by Gemini API.</p>
      </div>
      
      <div className="bg-black/50 rounded-xl p-4 font-mono text-xs overflow-y-auto max-h-[400px] border border-[#3D4A3D]/40 space-y-2 text-[#4BE277] scroll-hide">
        {aiLogs.map((log, idx) => (
          <div key={idx} className="flex gap-4">
            <span className="text-[#BCCBB9]/60 shrink-0 select-none">
              [{new Date(log.timestamp).toLocaleTimeString()}]
            </span>
            <span className="text-[#DCE5D9]">{log.message}</span>
          </div>
        ))}
        <div className="text-[10px] text-[#BCCBB9]/40 mt-4 border-t border-[#3D4A3D]/25 pt-2">
          Console initialized. Monitoring hooks active.
        </div>
      </div>
    </section>
  );
}
