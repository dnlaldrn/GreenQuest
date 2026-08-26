import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Users, Coins, X } from "lucide-react";
import { sanitizeInteger, sanitizeTextOnly } from "../../lib/validation";

export default function UserManagementTab({
  filteredUsers,
  handleAdjustPoints,
  handleToggleUserRole,
  showToast
}) {
  // Local state for Points Adjustment Modal
  const [pointsModal, setPointsModal] = useState({
    isOpen: false,
    user: null,
    amount: "",
    reason: ""
  });

  const handleOpenPointsModal = (user) => {
    setPointsModal({ isOpen: true, user, amount: "", reason: "" });
  };

  const handleClosePointsModal = () => {
    setPointsModal({ isOpen: false, user: null, amount: "", reason: "" });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClosePointsModal();
      }
    };
    if (pointsModal.isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pointsModal.isOpen]);

  const validateTextSpam = (text) => {
    if (!text || text.trim().length < 3) return "Input must be at least 3 characters long.";
    if (text.length > 80) return "Input must not exceed 80 characters.";
    if (/\d/.test(text)) return "Letters only. Numbers/digits are not allowed.";
    if (!/[a-zA-Z]/.test(text)) return "Input must contain alphabetical characters.";
    return null;
  };

  const validatePointsDelta = (amount) => {
    const pointsChange = parseInt(amount);
    if (isNaN(pointsChange) || pointsChange === 0) {
      return "Please enter a valid non-zero points adjustment.";
    }
    if (pointsChange > 999999 || pointsChange < -999999) {
      return "Points adjustment delta must be between -999,999 and 999,999.";
    }
    if (!/^-?\d+$/.test(amount)) {
      return "Points must be a whole integer without decimal points or exponent symbols.";
    }
    return null;
  };

  const onSubmitPoints = async (e) => {
    e.preventDefault();

    const pointsError = validatePointsDelta(pointsModal.amount);
    if (pointsError) {
      if (showToast) {
        showToast(pointsError, "error");
      } else {
        alert(pointsError);
      }
      return;
    }

    const textError = validateTextSpam(pointsModal.reason);
    if (textError) {
      if (showToast) {
        showToast(`Reason error: ${textError}`, "error");
      } else {
        alert(`Reason error: ${textError}`);
      }
      return;
    }

    const success = await handleAdjustPoints(
      pointsModal.user.id,
      parseInt(pointsModal.amount),
      pointsModal.reason.trim()
    );

    if (success) {
      handleClosePointsModal();
    }
  };

  return (
    <section className="glass-card rounded-xl overflow-hidden border border-[#DCE5D9]/10">
      <div className="p-6 border-b border-[#DCE5D9]/10">
        <h3 className="text-lg font-bold text-[#DCE5D9]">Users Registry</h3>
        <p className="text-xs text-[#BCCBB9]">Review role allocations, account creation dates, and reward balances.</p>
      </div>

      {/* Desktop view: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#161D16] text-[#BCCBB9] font-mono text-[10px] uppercase tracking-wider border-b border-[#DCE5D9]/10">
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Points Balance</th>
              <th className="px-6 py-4">Registration Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE5D9]/5">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-xs text-[#BCCBB9] font-mono">
                  No user accounts matched the query filter.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#333B33]/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#333B33] flex items-center justify-center font-bold text-xs uppercase text-[#4BE277]">
                        {u.username ? u.username.slice(0, 2) : "GQ"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#DCE5D9]">{u.username || "Unknown"}</p>
                        <span className="text-[10px] text-[#BCCBB9] font-mono uppercase tracking-widest">
                          ID: {u.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#BCCBB9]">
                    {u.email || "no-email@greenquest.ai"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      u.role === "admin"
                        ? "bg-[#4BE277]/20 text-[#4BE277] border border-[#4BE277]/30"
                        : "bg-[#333B33] text-[#BCCBB9]"
                    }`}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#92DB2A] font-mono">
                    {(u.total_points || 0).toLocaleString()} pts
                  </td>
                  <td className="px-6 py-4 text-xs text-[#BCCBB9] font-mono">
                    {new Date(u.created_at || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenPointsModal(u)}
                      className="bg-[#92DB2A]/10 text-[#92DB2A] hover:bg-[#92DB2A]/20 transition-all font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold border border-[#92DB2A]/30 active:scale-95 cursor-pointer"
                    >
                      Adjust Points
                    </button>
                    <button
                      onClick={() => handleToggleUserRole(u)}
                      className="bg-[#333B33] hover:bg-[#4BE277]/10 hover:text-[#4BE277] transition-all font-mono text-[10px] px-3 py-1.5 rounded-lg text-[#BCCBB9] cursor-pointer active:scale-95"
                    >
                      Toggle Role
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view: Card stack */}
      <div className="block md:hidden divide-y divide-[#DCE5D9]/5">
        {filteredUsers.length === 0 ? (
          <div className="px-6 py-8 text-center text-xs text-[#BCCBB9] font-mono">
            No user accounts matched the query filter.
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div key={u.id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#333B33] flex items-center justify-center font-bold text-xs uppercase text-[#4BE277]">
                    {u.username ? u.username.slice(0, 2) : "GQ"}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#DCE5D9]">{u.username || "Unknown"}</h4>
                    <span className="text-[9px] text-[#BCCBB9] font-mono uppercase tracking-widest block">
                      ID: {u.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
                
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                  u.role === "admin"
                    ? "bg-[#4BE277]/20 text-[#4BE277] border border-[#4BE277]/30"
                    : "bg-[#333B33] text-[#BCCBB9]"
                }`}>
                  {u.role || "user"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#161D16]/40 p-3 rounded-lg border border-[#DCE5D9]/5 font-mono text-[10px]">
                <div>
                  <span className="text-[#BCCBB9] block text-[9px] uppercase tracking-wider mb-0.5">Points Balance</span>
                  <span className="text-sm font-bold text-[#92DB2A]">
                    {(u.total_points || 0).toLocaleString()} pts
                  </span>
                </div>
                <div>
                  <span className="text-[#BCCBB9] block text-[9px] uppercase tracking-wider mb-0.5">Registered</span>
                  <span className="text-slate-300">
                    {new Date(u.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-span-2 mt-1 pt-1 border-t border-[#DCE5D9]/5">
                  <span className="text-[#BCCBB9] block text-[9px] uppercase tracking-wider mb-0.5">Email Address</span>
                  <span className="text-slate-300 text-[10px] break-all">{u.email || "no-email@greenquest.ai"}</span>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={() => handleOpenPointsModal(u)}
                  className="flex-grow bg-[#92DB2A]/10 text-[#92DB2A] hover:bg-[#92DB2A]/20 transition-all font-mono text-[10px] py-2 rounded-lg font-bold border border-[#92DB2A]/30 active:scale-95 cursor-pointer text-center"
                >
                  Adjust Points
                </button>
                <button
                  onClick={() => handleToggleUserRole(u)}
                  className="flex-grow bg-[#333B33] hover:bg-[#4BE277]/10 hover:text-[#4BE277] transition-all font-mono text-[10px] py-2 rounded-lg text-[#BCCBB9] cursor-pointer active:scale-95 text-center"
                >
                  Toggle Role
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Points Adjustment Modal */}
      {pointsModal.isOpen && createPortal(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <form onSubmit={onSubmitPoints} className="glass-card max-w-sm w-full rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#DCE5D9]/10 pb-2">
              <h3 className="font-bold text-sm text-[#DCE5D9]">
                Modify points for {pointsModal.user?.username}
              </h3>
              <button type="button" onClick={handleClosePointsModal} className="text-[#BCCBB9] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#BCCBB9] mb-1 font-mono uppercase tracking-wider">
                  Points Delta (Positive or Negative)
                </label>
                <input
                  type="text"
                  required
                  maxLength={7}
                  placeholder="e.g. 500 or -200"
                  value={pointsModal.amount}
                  onChange={(e) => setPointsModal(prev => ({ ...prev, amount: sanitizeInteger(e.target.value, 7, true) }))}
                  className="w-full bg-[#161D16] border border-[#3D4A3D] rounded-lg p-2.5 text-[#DCE5D9] outline-none focus:border-[#4BE277] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#BCCBB9] mb-1 font-mono uppercase tracking-wider">Adjustment Reason</label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="e.g. Manual moderation review bonus"
                  value={pointsModal.reason}
                  onChange={(e) => setPointsModal(prev => ({ ...prev, reason: sanitizeTextOnly(e.target.value, 80, 3) }))}
                  className="w-full bg-[#161D16] border border-[#3D4A3D] rounded-lg p-2.5 text-[#DCE5D9] outline-none focus:border-[#4BE277]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#DCE5D9]/10">
              <button
                type="submit"
                className="bg-[#4BE277] text-[#003915] font-bold px-5 py-2.5 rounded-lg text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono"
              >
                Confirm Adjustment
              </button>
              <button
                type="button"
                onClick={handleClosePointsModal}
                className="bg-[#333B33] text-[#DCE5D9] px-5 py-2.5 rounded-lg text-xs hover:bg-[#333B33]/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </section>
  );
}
