import { useEffect } from 'react';
import { createPortal } from 'react-dom'; // Make sure this is imported!
import { ShieldAlert } from "lucide-react";

// Accept all configuration state and closing handlers via props
function ConfirmModal({ isOpen, title, message, onConfirm, onClose }) {
  
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null; // If not open, render nothing

  return createPortal(
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[10000] animate-fade-in">
      <div className="bg-[#161D16] border border-[#FFB4AB]/30 shadow-[0_0_50px_rgba(255,180,171,0.1)] max-w-sm w-full rounded-2xl p-5 space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-[#FFB4AB] border-b border-[#DCE5D9]/10 pb-2">
          <ShieldAlert size={18} className="shrink-0" />
          <h3 className="font-bold text-sm text-[#DCE5D9] uppercase tracking-wider">
            {title}
          </h3>
        </div>

        <p className="text-[#BCCBB9] leading-relaxed text-left">
          {message}
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => {
              onConfirm(); // Run the action (like signing out)
              onClose();   // Close the modal
            }}
            className="bg-[#FFB4AB]/15 text-[#FFB4AB] border border-[#FFB4AB]/30 hover:bg-[#FFB4AB]/25 font-bold px-4 py-2 rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono"
          >
            Confirm Action
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#333B33] text-[#DCE5D9] border border-[#3D4A3D] px-4 py-2 rounded-lg hover:bg-[#333B33]/85 transition-colors cursor-pointer font-mono"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>,
    document.body // Portal target
  );
}

export default ConfirmModal;