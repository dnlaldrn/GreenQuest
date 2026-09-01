import React from "react";

export default function FacultyFooter({ setActiveTab, showToast }) {
  return (
    <footer className="w-full py-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 mt-auto font-mono text-xs text-[#bccbb9] gap-4 bg-[#0e150e]/60">
      <div className="text-center sm:text-left text-[11px] sm:text-xs">
        © 2026 GreenMate Challenge. Empowering Sustainable Campus Life.
      </div>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-[10px] sm:text-[11px]">
        <button
          onClick={() => showToast("Displaying Privacy Policy terms.")}
          className="hover:text-[#4be277] transition-colors py-1 px-1.5 cursor-pointer"
        >
          Privacy Policy
        </button>
        <button
          onClick={() => showToast("Displaying Terms of Service.")}
          className="hover:text-[#4be277] transition-colors py-1 px-1.5 cursor-pointer"
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActiveTab("support")}
          className="hover:text-[#4be277] transition-colors py-1 px-1.5 cursor-pointer"
        >
          Challenge FAQ
        </button>
        <button
          onClick={() => setActiveTab("support")}
          className="hover:text-[#4be277] transition-colors py-1 px-1.5 cursor-pointer"
        >
          Contact Admin
        </button>
      </div>
    </footer>
  );
}
