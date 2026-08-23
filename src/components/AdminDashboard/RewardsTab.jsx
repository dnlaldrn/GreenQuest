import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, Edit2, Trash2, Ticket, X, Upload, ImageOff } from "lucide-react";

export default function RewardsTab({
  rewards,
  handleSaveReward,
  handleDeleteReward,
  showToast
}) {
  // Local state for Reward Modal (Add/Edit)
  const [rewardModal, setRewardModal] = useState({
    isOpen: false,
    reward: null
  });

  const fileInputRef = useRef(null);

  const handleOpenRewardModal = (reward = null) => {
    if (reward) {
      setRewardModal({ isOpen: true, reward: { ...reward } });
    } else {
      setRewardModal({
        isOpen: true,
        reward: {
          name: "",
          description: "",
          points_cost: 1,
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

  const notify = (message, type = "error") => {
    if (showToast) {
      showToast(message, type);
    } else {
      alert(message);
    }
  };

  const validateText = (text, minLength, maxLength, fieldName) => {
    if (!text || text.trim().length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long.`;
    }
    if (text.length > maxLength) {
      return `${fieldName} must not exceed ${maxLength} characters.`;
    }
    // Block consecutive repeating character spam (e.g. "aaaaaa")
    if (/(.)\1{5,}/.test(text)) {
      return `${fieldName} contains repetitive character spam.`;
    }
    return null;
  };

  const getRankLabel = (rank) => {
    switch (rank) {
      case 1: return "1st Place";
      case 2: return "2nd Place";
      case 3: return "3rd Place";
      default: return `${rank}th Place`;
    }
  };

  // Max rank/place option shown in the dropdown
  const MAX_RANK = 3;
  const rankOptions = Array.from({ length: MAX_RANK }, (_, i) => i + 1);

  const MAX_IMAGE_SIZE_MB = 3;

  const handleImageUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please upload a valid image file (PNG, JPG, etc).", "error");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      notify(`Image must not exceed ${MAX_IMAGE_SIZE_MB}MB.`, "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setRewardModal((prev) => ({
        ...prev,
        reward: { ...prev.reward, image_url: e.target.result }
      }));
      notify("Image selected successfully.", "success");
    };
    reader.onerror = () => {
      notify("Failed to read image file. Please try again.", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setRewardModal((prev) => ({ ...prev, reward: { ...prev.reward, image_url: "" } }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmitReward = async (e) => {
    e.preventDefault();

    if (!rewardModal.reward) return;

    const nameError = validateText(rewardModal.reward.name, 2, 60, "Item Name");
    if (nameError) {
      notify(nameError, "error");
      return;
    }

    const descError = validateText(rewardModal.reward.description, 3, 200, "Description");
    if (descError) {
      notify(descError, "error");
      return;
    }

    const rank = parseInt(rewardModal.reward.points_cost);
    if (isNaN(rank) || rank < 1 || rank > MAX_RANK) {
      notify(`Place must be a whole number between 1 and ${MAX_RANK}.`, "error");
      return;
    }

    const cleanedReward = {
      ...rewardModal.reward,
      name: rewardModal.reward.name.trim(),
      description: rewardModal.reward.description ? rewardModal.reward.description.trim() : "",
      points_cost: rank,
      image_url: rewardModal.reward.image_url || "",
      active: rewardModal.reward.active !== undefined ? Boolean(rewardModal.reward.active) : true
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
          <p className="text-xs text-[#BCCBB9]">Configure incentive items and assign the leaderboard place required to unlock them.</p>
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
                    <span className="text-[#BCCBB9] block text-[9px] uppercase tracking-wider">Rank Required</span>
                    <span className="text-[#92DB2A] font-bold text-xs">{getRankLabel(r.points_cost)}</span>
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

              <div>
                <label className="block text-[#BCCBB9] mb-1 font-mono uppercase tracking-wider">Place Required</label>
                <select
                  required
                  value={rewardModal.reward.points_cost}
                  onChange={(e) => {
                    setRewardModal(prev => ({ ...prev, reward: { ...prev.reward, points_cost: e.target.value } }));
                  }}
                  className="w-full bg-[#161D16] border border-[#3D4A3D] rounded-lg p-2.5 text-[#DCE5D9] outline-none focus:border-[#4BE277] font-mono"
                >
                  {rankOptions.map((rank) => (
                    <option key={rank} value={rank}>
                      {getRankLabel(rank)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#BCCBB9] mb-1 font-mono uppercase tracking-wider">Product Photo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                />

                {rewardModal.reward.image_url ? (
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-[#161D16] border border-[#3D4A3D] overflow-hidden shrink-0">
                      <img
                        src={rewardModal.reward.image_url}
                        alt="Reward preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#333B33] text-[#DCE5D9] px-3 py-1.5 rounded-lg text-[10px] font-mono hover:bg-[#333B33]/85 transition-colors cursor-pointer"
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-[#FFB4AB]/10 text-[#FFB4AB] px-3 py-1.5 rounded-lg text-[10px] font-mono hover:bg-[#FFB4AB]/20 transition-colors cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 border border-dashed border-[#3D4A3D] rounded-lg p-5 text-[#BCCBB9] hover:border-[#4BE277] hover:text-[#4BE277] transition-colors cursor-pointer"
                  >
                    <Upload size={20} />
                    <span className="font-mono text-[10px] uppercase tracking-wider">Click to upload image</span>
                    <span className="text-[9px] text-[#BCCBB9]/70">PNG, JPG up to {MAX_IMAGE_SIZE_MB}MB</span>
                  </button>
                )}
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