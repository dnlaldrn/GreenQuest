import React, { useState } from "react";
import {
  UploadCloud,
  Video,
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Leaf,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { sanitizeAlphanumeric } from "../../lib/validation";

export default function UploadVideoTab() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("recycling");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadSuccess(false);
      setUploadError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setUploadError("Please select a video file first.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("You must be logged in to submit.");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: storageError } = await supabase.storage
        .from("eco-videos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from("eco-videos")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("submissions").insert({
        user_id: user.id,
        title,
        category,
        description,
        video_path: fileName,
        video_url: urlData.publicUrl,
        status: "pending_review",
      });

      if (insertError) throw insertError;

      // Success — show banner and reset form
      setUploadSuccess(true);
      setFile(null);
      setTitle("");
      setDescription("");

      // Auto-hide the success banner after a few seconds
      setTimeout(() => setUploadSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6 bg-[#0B120F] text-slate-200">
      {/* HEADER SECTION */}
      <div>
        <h3 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <UploadCloud size={20} className="text-[#10B981]" />
          Submit Proof of Action
        </h3>
        <p className="text-xs text-slate-400">
          Upload clear video evidence of your green initiative. Our AI
          verification engine reviews metrics automatically.
        </p>
      </div>

      {/* SUCCESS NOTIFICATION */}
      {uploadSuccess && (
        <div className="flex items-center gap-3 bg-[#14281E] border border-[#10B981]/40 text-[#10B981] px-4 py-3 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>
            Video uploaded successfully! Your submission is now pending AI
            review.
          </span>
          <button
            type="button"
            onClick={() => setUploadSuccess(false)}
            className="ml-auto text-[#10B981]/60 hover:text-[#10B981] text-lg leading-none"
          >
            &times;
          </button>
        </div>
      )}

      {/* ERROR NOTIFICATION */}
      {uploadError && (
        <div className="flex items-center gap-3 bg-[#2A1414] border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          <XCircle size={18} className="shrink-0" />
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-400/60 hover:text-red-400 text-lg leading-none"
          >
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: UPLOAD ZONE & FORM */}
        <div className="lg:col-span-2 space-y-6">
          {/* DRAG AND DROP ZONE */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all relative overflow-hidden group
              ${dragActive ? "border-[#10B981] bg-[#14281E]/30" : "border-[#14231C] bg-[#111A16]"}
              ${file ? "border-solid border-[#10B981]/40" : ""}
            `}
          >
            {file ? (
              <div className="space-y-4 w-full max-w-md">
                <div className="w-12 h-12 rounded-xl bg-[#14281E] text-[#10B981] flex items-center justify-center mx-auto border border-[#10B981]/20">
                  <Video size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-[11px] font-mono font-bold text-red-400 hover:underline"
                >
                  Remove Video
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-[#0B120F] text-slate-500 group-hover:text-[#10B981] flex items-center justify-center mb-4 border border-[#14231C] group-hover:border-[#10B981]/30 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all">
                  <UploadCloud size={22} />
                </div>
                <p className="text-slate-300 font-medium mb-1 text-sm">
                  Drag and drop your file here, or{" "}
                  <label className="text-[#10B981] hover:underline cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFile(e.target.files[0]);
                          setUploadSuccess(false);
                          setUploadError(null);
                        }
                      }}
                    />
                  </label>
                </p>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                  MP4  to 50MB
                </p>
              </>
            )}
          </div>

          {/* META DETAILS FORM */}
          <div className="bg-[#111A16] border border-[#14231C] p-5 rounded-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quest Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  Quest / Title
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={title}
                  onChange={(e) => setTitle(sanitizeAlphanumeric(e.target.value, 60, 3))}
                  placeholder="e.g., Neighborhood Clean Up"
                  className="w-full bg-[#0B120F] border border-[#14231C] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-700"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  Impact Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0B120F] border border-[#14231C] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#10B981] transition-colors appearance-none cursor-pointer"
                >
                  <option value="recycling">
                    Recycling & Waste Management
                  </option>
                  <option value="energy">Renewable & Energy Efficiency</option>
                  <option value="reforestation">
                    Reforestation & Biodiverse Action
                  </option>
                  <option value="conservation">Water Conservation</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Action Description (Optional)
              </label>
              <textarea
                rows={4}
                maxLength={300}
                value={description}
                onChange={(e) => setDescription(sanitizeAlphanumeric(e.target.value, 300, 3))}
                placeholder="Describe your environmental impact or resources saved..."
                className="w-full bg-[#0B120F] border border-[#14231C] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-[#10B981] transition-colors placeholder:text-slate-700 resize-none"
              />
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-transparent text-slate-400 hover:text-white font-medium text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading || !file}
                className="bg-[#10B981] hover:bg-[#0ea5e9] text-[#0B120F] font-bold px-5 py-2 text-xs rounded-lg transition-colors shadow-[0_4px_12px_rgba(16,185,129,0.2)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={14} />
                <span>{uploading ? "Uploading..." : "Submit for AI Review"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI VERIFICATION GUIDE & EXPECTED POINTS */}
        <div className="space-y-6">

          {/* CHECKLIST RULES */}
          <div className="bg-[#111A16] border border-[#14231C] p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                Verification Criteria
              </h4>
              <HelpCircle size={14} className="text-slate-500" />
            </div>

            <ul className="space-y-3 text-[11px] text-slate-400">
              <li className="flex items-start gap-2.5">
                <CheckCircle size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                <span>
                  <strong>Unedited continuous sequence:</strong> Spliced,
                  clipped, or heavily filtered videos fail compliance
                  validation.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                <span>
                  <strong>Clear object visibility:</strong> Items (e.g., dynamic
                  labels, compost heaps, solar equipment) must stay visible in
                  standard lighting frames.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                <span>
                  <strong>Geo-tag metadata match:</strong> File location
                  parameters should broadly align with your regional cluster
                  target.
                </span>
              </li>
            </ul>

            <div className="bg-[#0B120F] border border-[#231A14] p-3 rounded-lg flex items-start gap-2.5 text-amber-500/90 text-[10px] leading-normal font-mono">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
              <span>
                Submitting stock/stolen video feeds locks account point yields
                instantly.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}