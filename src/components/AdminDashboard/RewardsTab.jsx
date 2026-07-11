import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Edit2, Trash2, Ticket, X } from "lucide-react";

export default function RewardsTab({
  rewards,
  handleSaveReward,
  handleDeleteReward
}) {
  // Local state for Reward Modal (Add/Edit)
  const [rewardModal, setRewardModal] = useState({
    isOpen: false,
    reward: null
  });

  const handleOpenRewardModal = (reward = null) => {
    if (reward) {
      setRewardModal({ isOpen: true, reward: { ...reward } });
    } else {
      setRewardModal({
        isOpen: true,
        reward: {
          name: "",
          description: "",
          points_cost: 1000,
          stock: 10,
          image_url: "",
          active: true
        }
      });
    }
  };

  const handleCloseRewardModal = () => {
    setRewardModal({ isOpen: false, reward: null });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseRewardModal();
      }
    };
    if (rewardModal.isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [rewardModal.isOpen]);

  const validateTextSpam = (text, maxLength, allowPunctuation = false) => {
    if (!text || text.trim().length < 3) return "Input must be at least 3 characters long.";
    if (text.length > maxLength) return `Input must not exceed ${maxLength} characters.`;
    
    const pattern = allowPunctuation 
      ? /^[a-zA-Z\s\-.,'()!]+$/ 
      : /^[a-zA-Z\s\-]+$/;
      
    if (!pattern.test(text)) {
      return "Letters only. Numbers/digits are not allowed.";
    }

    if (/(.)\1{4,}/.test(text)) return "Repeating characters spam detected.";
    if (/(.{2,4})\1{3,}/i.test(text)) return "Repetitive syllables/words spam detected.";
    return null;
  };

  const validateUrl = (url) => {
    if (!url) return null;
    if (url.length > 200) return "URL must not exceed 200 characters.";
    if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url)) {
      return "Please enter a valid HTTP/HTTPS URL.";
    }
    return null;
  };

  const onSubmitReward = async (e) => {
    e.preventDefault();

    const nameError = validateTextSpam(rewardModal.reward.name, 40, false);
    if (nameError) {
      alert(`Name Error: ${nameError}`);
      return;
    }

    const descError = validateTextSpam(rewardModal.reward.description, 120, true);
    if (descError) {
      alert(`Description Error: ${descError}`);
      return;
    }

    const cost = parseInt(rewardModal.reward.points_cost);
    if (isNaN(cost) || cost < 1 || cost > 1000000) {
      alert("Point cost must be an integer between 1 and 1,000,000.");
      return;
    }

    const stock = parseInt(rewardModal.reward.stock);
    if (isNaN(stock) || stock < 0 || stock > 99999) {
      alert("Stock allocation must be an integer between 0 and 99,999.");
      return;
    }

    const urlError = validateUrl(rewardModal.reward.image_url);
    if (urlError) {
      alert(`Photo URL Error: ${urlError}`);
      return;
    }

    const cleanedReward = {
      ...rewardModal.reward,
      name: rewardModal.reward.name.trim(),
      description: rewardModal.reward.description.trim(),
      points_cost: cost,
      stock: stock,
      image_url: rewardModal.reward.image_url ? rewardModal.reward.image_url.trim() : ""
    };

    const success = await handleSaveReward(cleanedReward);
    if (success) {
      handleCloseRewardModal();
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#DCE5D9]/5 pb-4 gap-4 w-full">
        <div>
          <h3 className="text-lg font-bold text-[#DCE5D9]">Eco Rewards Catalog</h3>
          <p className="text-xs text-[#BCCBB9]">Configure incentive items, adjust point valuations, and audit stock allocations.</p>
        </div>
        <button
          onClick={() => handleOpenRewardModal()}
          className="flex items-center justify-center gap-2 bg-[#92DB2A] text-[#1F3700] px-5 py-2.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(146,219,42,0.4)] transition-all hover:scale-105 active:scale-95 text-xs uppercase font-mono cursor-pointer w-full sm:w-auto shrink-0"
        >
          <Plus size={14} />
          <span>Add New Reward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rewards.map((r) => (
          <div
            key={r.id}
            className={`glass-card rounded-xl p-5 flex flex-col justify-between group border-l-4 transition-all hover:border-[#4BE277]/50 ${
              r.active ? "border-[#4BE277]" : "border-[#FFB4AB] opacity-60"
            }`}
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-lg bg-[#161D16] flex items-center justify-center border border-[#3D4A3D] overflow-hidden shrink-0">
                {r.image_url ? (
                  <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" />
                ) : (
                  <Ticket className="text-[#4BE277] text-3xl" size={32} />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-sm text-[#DCE5D9] truncate" title={r.name}>
                  {r.name}
                </h4>
                <p className="text-xs text-[#BCCBB9] mt-0.5 line-clamp-2" title={r.description}>
                  {r.description}
                </p>

                <div className="flex items-center justify-between mt-3 font-mono text-[10px]">
                  <div>
                    <span className="text-[#BCCBB9] block text-[9px] uppercase tracking-wider">Point Value</span>
                    <span className="text-[#92DB2A] font-bold text-xs">{(r.points_cost || 0).toLocaleString()} pts</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#BCCBB9] block text-[9px] uppercase tracking-wider">In Stock</span>
                    <span className="text-[#DCE5D9] font-bold text-xs">{r.stock} units</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-[#DCE5D9]/5">
              <button
                onClick={() => handleOpenRewardModal(r)}
                className="flex-grow bg-[#333B33] hover:bg-[#4BE277]/10 hover:text-[#4BE277] transition-all font-mono text-[10px] py-2 rounded-lg text-[#BCCBB9] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit2 size={12} />
                <span>Edit Item</span>
              </button>
              <button
                onClick={() => handleDeleteReward(r.id)}
                className="w-10 bg-[#FFB4AB]/10 text-[#FFB4AB] hover:bg-[#FFB4AB]/20 rounded-lg flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                title="Delete Reward"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards Form Modal */}
      {rewardModal.isOpen && createPortal(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <form onSubmit={onSubmitReward} className="glass-card max-w-md w-full rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#DCE5D9]/10 pb-2">
              <h3 className="font-bold text-sm text-[#DCE5D9]">
                {rewardModal.reward.id ? "Edit Reward Catalog Item" : "Create New Reward Catalog Item"}
              </h3>
              <button type="button" onClick={handleCloseRewardModal} className="text-[#BCCBB9] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#BCCBB9] mb-1 font-mono uppercase tracking-wider">Item Name</label>
                <input
                  type="text"
                  required
                  maxLength={40}
                  value={rewardModal.reward.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 40) {
                      setRewardModal(prev => ({ ...prev, reward: { ...prev.reward, name: val } }));
                    }
                  }}
                  className="w-full bg-[#161D16] border border-[#3D4A3D] rounded-lg p-2.5 text-[#DCE5D9] outline-none focus:border-[#4BE277]"
                />
              </div>

              <div>
                <label className="block text-[#BCCBB9] mb-1 font-mono uppercase tracking-wider">Description</label>
                <textarea
                  required
                  maxLength={120}
                  value={rewardModal.reward.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 120) {
                      setRewardModal(prev => ({ ...prev, reward: { ...prev.reward, description: val } }));
                    }
                  }}
                  className="w-full bg-[#161D16] border border-[#3D4A3D] rounded-lg p-2.5 text-[#DCE5D9] outline-none focus:border-[#4BE277] h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#BCCBB9] mb-1 font-mono uppercase tracking-wider">Point Cost</label>
                  <input
                    type="number"
                    min="1"
                    max="1000000"
                    required
                    value={rewardModal.reward.points_cost}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 7) {
                        setRewardModal(prev => ({ ...prev, reward: { ...prev.reward, points_cost: val } }));
                      }
                    }}
                    className="w-full bg-[#161D16] border border-[#3D4A3D] rounded-lg p-2.5 text-[#DCE5D9] outline-none focus:border-[#4BE277] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#BCCBB9] mb-1 font-mono uppercase tracking-wider">Stock Allocation</label>
                  <input
                    type="number"
                    min="0"
                    max="99999"
                    required
                    value={rewardModal.reward.stock}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 6) {
                        setRewardModal(prev => ({ ...prev, reward: { ...prev.reward, stock: val } }));
                      }
                    }}
                    className="w-full bg-[#161D16] border border-[#3D4A3D] rounded-lg p-2.5 text-[#DCE5D9] outline-none focus:border-[#4BE277] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#BCCBB9] mb-1 font-mono uppercase tracking-wider">Product Photo URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  maxLength={200}
                  value={rewardModal.reward.image_url}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 200) {
                      setRewardModal(prev => ({ ...prev, reward: { ...prev.reward, image_url: val } }));
                    }
                  }}
                  className="w-full bg-[#161D16] border border-[#3D4A3D] rounded-lg p-2.5 text-[#DCE5D9] outline-none focus:border-[#4BE277] font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={rewardModal.reward.active}
                  onChange={(e) => setRewardModal(prev => ({ ...prev, reward: { ...prev.reward, active: e.target.checked } }))}
                  className="rounded bg-[#161D16] border-[#3D4A3D] text-[#4BE277] focus:ring-0"
                />
                <label htmlFor="activeCheck" className="text-[#BCCBB9] font-mono uppercase tracking-wider select-none cursor-pointer">
                  Activate and Show in store
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#DCE5D9]/10">
              <button
                type="submit"
                className="bg-[#92DB2A] text-[#1F3700] font-bold px-5 py-2.5 rounded-lg text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono"
              >
                Save Item
              </button>
              <button
                type="button"
                onClick={handleCloseRewardModal}
                className="bg-[#333B33] text-[#DCE5D9] px-5 py-2.5 rounded-lg text-xs hover:bg-[#333B33]/85 transition-colors cursor-pointer"
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
