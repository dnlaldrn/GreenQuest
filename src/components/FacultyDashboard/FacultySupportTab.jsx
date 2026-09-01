import React, { useState } from "react";
import { HelpCircle, Mail, Send, CheckCircle2 } from "lucide-react";
import { sanitizeAlphanumeric } from "../../lib/validation";

export default function FacultySupportTab({ showToast }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast("Please enter a message.", "error");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubject("");
      setMessage("");
      showToast("Support inquiry submitted to administration.", "success");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#8bd79b] flex items-center gap-2">
          <HelpCircle size={20} />
          <span>Faculty Challenge Support & FAQ</span>
        </h3>
        <p className="text-xs text-[#bccbb9] mt-0.5">
          Frequently asked questions and direct assistance for faculty challenge participants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ Accordion List */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-[#161d16]/70 border border-white/10 space-y-1.5">
            <h4 className="font-bold text-sm text-[#dce5d9]">
              How do I update an existing video submission?
            </h4>
            <p className="text-xs text-[#bccbb9] leading-relaxed">
              Navigate to the "My Entries" tab in your sidebar, select your specimen
              entry, and upload updated footage to reflect recent plant growth.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#161d16]/70 border border-white/10 space-y-1.5">
            <h4 className="font-bold text-sm text-[#dce5d9]">
              What if my video fails the AI verification check?
            </h4>
            <p className="text-xs text-[#bccbb9] leading-relaxed">
              Ensure proper lighting, clear focus on foliage, and minimal camera
              shake. You can re-upload any time without losing existing profile score.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#161d16]/70 border border-white/10 space-y-1.5">
            <h4 className="font-bold text-sm text-[#dce5d9]">
              How are vote ties resolved at the end of the season?
            </h4>
            <p className="text-xs text-[#bccbb9] leading-relaxed">
              In case of tied community votes, verified video resolution and
              documentation frequency will serve as the secondary tie-breaker.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <section className="p-5 rounded-2xl bg-[#161d16]/70 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#4be277]">
            <Mail size={16} />
            <span>Contact Challenge Coordinator</span>
          </div>

          <form onSubmit={handleSupportSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-[#bccbb9] mb-1 uppercase">
                Subject
              </label>
              <input
                type="text"
                maxLength={60}
                value={subject}
                onChange={(e) =>
                  setSubject(sanitizeAlphanumeric(e.target.value, 60, 3))
                }
                placeholder="e.g., Specimen Reclassification"
                className="w-full bg-[#242c24] border border-white/10 rounded-lg p-2.5 text-xs text-[#dce5d9] placeholder-[#bccbb9]/40 focus:border-[#4be277] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#bccbb9] mb-1 uppercase">
                Message
              </label>
              <textarea
                rows={4}
                maxLength={400}
                value={message}
                onChange={(e) =>
                  setMessage(sanitizeAlphanumeric(e.target.value, 400, 3))
                }
                placeholder="Describe your question or issue..."
                className="w-full bg-[#242c24] border border-white/10 rounded-lg p-2.5 text-xs text-[#dce5d9] placeholder-[#bccbb9]/40 focus:border-[#4be277] focus:outline-none resize-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#22c55e] text-[#003915] font-bold px-6 py-2 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50"
              >
                <Send size={14} />
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
