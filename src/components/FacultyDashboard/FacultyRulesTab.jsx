import React from "react";
import { Gavel, CheckCircle2, ShieldCheck, Award } from "lucide-react";

export default function FacultyRulesTab() {
  return (
    <section className="bg-[#161d16]/70 backdrop-blur-xl rounded-2xl p-5 sm:p-7 border border-white/10 space-y-6">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#acf847] flex items-center gap-2">
          <Gavel size={20} />
          <span>Challenge Guidelines & Official Rules</span>
        </h3>
        <p className="text-xs text-[#bccbb9] mt-0.5">
          Standard protocols for submitting botanical research specimens and video progress logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#242c24] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-[#4be277] font-bold text-sm">
            <CheckCircle2 size={16} />
            <h4>1. Video Requirements</h4>
          </div>
          <p className="text-xs text-[#bccbb9] leading-relaxed">
            All video entries must document authentic plant specimens grown under
            faculty supervision. Supported formats: MP4, MOV, WebM with a maximum
            file size of 50MB.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#242c24] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-[#4be277] font-bold text-sm">
            <ShieldCheck size={16} />
            <h4>2. Automated Verification</h4>
          </div>
          <p className="text-xs text-[#bccbb9] leading-relaxed">
            Uploaded specimens undergo automated AI botanical health analysis to
            verify genus classification, foliage vibrancy, and time-lapse continuity.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#242c24] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-[#4be277] font-bold text-sm">
            <CheckCircle2 size={16} />
            <h4>3. Community Peer Review</h4>
          </div>
          <p className="text-xs text-[#bccbb9] leading-relaxed">
            Authenticated campus researchers, students, and faculty can cast one
            vote per submission. Spam or artificial rating manipulation results
            in entry disqualification.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#242c24] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-[#4be277] font-bold text-sm">
            <Award size={16} />
            <h4>4. Grants & Recognition</h4>
          </div>
          <p className="text-xs text-[#bccbb9] leading-relaxed">
            At the close of Season 4 (14 days remaining), top 3 faculty leaders
            receive departmental sustainability research grants and the GreenQuest
            Eco-Leader Trophy.
          </p>
        </div>
      </div>
    </section>
  );
}
