import { useState, useEffect } from "react";
import { User, Mail, ShieldAlert, CheckCircle, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { getCurrentUser } from "../../services/authService";
import { supabase } from "../../lib/supabase";
import { sanitizeTextOnly, sanitizeEmail, sanitizePassword, isValidEmail } from "../../lib/validation";

export default function AdminProfileTab() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function getUser() {
      const { data, error } = await getCurrentUser();
      if (error) {
        console.error(error);
        return;
      }
      setUserData(data.user);
      setProfile((prev) => ({
        ...prev,
        name: data.user.user_metadata?.username ?? "",
        email: data.user.email ?? "",
      }));
    }
    getUser();
  }, []);

  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedVal = value;
    if (name === "name") sanitizedVal = sanitizeTextOnly(value, 40, 3);
    else if (name === "email") sanitizedVal = sanitizeEmail(value, 80);
    else if (name.includes("Password") || name.includes("password")) sanitizedVal = sanitizePassword(value, 64);
    setProfile((prev) => ({ ...prev, [name]: sanitizedVal }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!profile.name || profile.name.trim().length < 2) {
      setStatus({ type: "error", message: "Please enter a valid full name (at least 2 letters, numbers not allowed)." });
      return;
    }

    if (!isValidEmail(profile.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (profile.newPassword && !profile.currentPassword) {
      setStatus({ type: "error", message: "Please provide your current password to authorize changes." });
      return;
    }

    setIsSaving(true);

    const updates = {
      data: { username: profile.name }, // merges into user_metadata
    };
    if (profile.email !== userData?.email) updates.email = profile.email;
    if (profile.newPassword) updates.password = profile.newPassword;

    const { data, error } = await supabase.auth.updateUser(updates);

    setIsSaving(false);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setUserData(data.user);
    setStatus({ type: "success", message: "Profile updated successfully!" });
    setProfile((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  const role = userData?.user_metadata?.role ?? "Administrator";
  const permissions = userData?.user_metadata?.permissions ?? ["Review submissions", "Manage users", "Full access"];

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Admin Account Settings</h2>
        <p className="text-xs text-slate-400 font-mono">
          Update your admin identity, account details, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <div className="bg-[#111A16] border border-[#14231C] p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-[#1A2E24] border-2 border-[#10B981] flex items-center justify-center text-3xl font-black text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0B120F] border border-[#10B981] flex items-center justify-center">
              <ShieldCheck size={13} className="text-[#10B981]" />
            </div>
          </div>
          <div>
            {userData ? (
              <div>
                <h3 className="font-bold text-white text-base">{userData.user_metadata?.username}</h3>
                <p className="text-xs font-mono text-slate-400">{userData.email}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-mono text-slate-400">Loading..</p>
              </div>
            )}
          </div>
          <div className="w-full bg-[#0B120F] border border-[#14231C] p-3 rounded-lg text-left">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
              Access Level
            </div>
            <div className="text-xs font-bold text-[#10B981] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              {role}
            </div>
          </div>
          <div className="w-full bg-[#0B120F] border border-[#14231C] p-3 rounded-lg text-left">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
              Permissions
            </div>
            <ul className="space-y-1">
              {permissions.map((perm) => (
                <li key={perm} className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <CheckCircle size={11} className="text-[#10B981] shrink-0" />
                  {perm}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="lg:col-span-2 bg-[#111A16] border border-[#14231C] rounded-xl overflow-hidden">
          <form onSubmit={handleSave} className="p-5 md:p-6 space-y-6">
            {/* Notifications */}
            {status.message && (
              <div
                className={`p-3.5 rounded-lg border text-xs font-mono flex items-start gap-2.5 ${
                  status.type === "error"
                    ? "bg-red-950/20 border-red-500/20 text-red-400"
                    : "bg-[#142E24] border-[#10B981]/20 text-[#10B981]"
                }`}
              >
                {status.type === "error" ? (
                  <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 border-b border-[#14231C] pb-2">
                Admin Information
              </h3>

              {userData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 uppercase">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                      <input
                        type="text"
                        name="name"
                        maxLength={40}
                        value={profile.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full bg-[#0B120F] border border-[#14231C] rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                      <input
                        type="email"
                        name="email"
                        maxLength={80}
                        value={profile.email}
                        onChange={handleChange}
                        placeholder="name@domain.com"
                        className="w-full bg-[#0B120F] border border-[#14231C] rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs font-mono text-slate-500">Loading</p>
              )}
            </div>

            {/* Password Security Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 border-b border-[#14231C] pb-2 flex items-center gap-1.5">
                <KeyRound size={12} />
                Security & Passwords
              </h3>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  maxLength={64}
                  value={profile.currentPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0B120F] border border-[#14231C] rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    maxLength={64}
                    value={profile.newPassword}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className="w-full bg-[#0B120F] border border-[#14231C] rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    maxLength={64}
                    value={profile.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat new password"
                    className="w-full bg-[#0B120F] border border-[#14231C] rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end pt-2 border-t border-[#14231C]">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#10B981] hover:bg-emerald-600 text-[#050B08] font-bold text-xs py-2.5 px-5 rounded-lg flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? "Saving changes..." : "Save Profile"}
                {!isSaving && <ArrowRight size={14} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}