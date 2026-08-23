import { useState } from "react";
import { signUp } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { sanitizeTextOnly, sanitizeEmail, sanitizePassword, isValidEmail } from "../lib/validation";
// Using lucide-react for matching layout icons (User, Mail, Lock, ArrowRight, plus tag icons)
import { User, Mail, Lock, ArrowRight, Leaf, Recycle, Zap } from "lucide-react";

export default function SignUpComponent() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // State to manage the clickable interest tags
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!username.trim() || username.trim().length < 2) {
        setError("Please enter a valid name (at least 2 letters, numbers not allowed).");
        setLoading(false);
        return;
      }

      if (!isValidEmail(email)) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
      }

      const result = await signUp(username.trim(), email.trim(), password);

      if (error) {
        setError(error.message);
        return;
      }

      const user = result.data.user;

      if (user) {
        await supabase.from("profiles").insert({
          id: user.id,
          username: username.trim(),
          role: "user",
          interests: selectedInterests, // Saves selected interests to DB if needed
        });
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white flex flex-col justify-between font-mono p-6 selection:bg-[#22c55e]/30">
      {/* Main Form Section */}
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-[460px] bg-[#121815] border border-[#1f2924] rounded-2xl p-8 shadow-2xl flex flex-col items-center">
          <h2 className="text-[28px] font-bold text-center text-[#e8ece9] tracking-tight mb-1">
            Join the Green Quest
          </h2>
          <p className="text-xs text-gray-400 text-center mb-8">
            Start earning rewards for your eco-actions today.
          </p>

          {error && (
            <div className="w-full bg-red-950/40 border border-red-800 text-red-400 p-3 rounded-xl text-xs mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="w-full flex flex-col gap-5">
            {/* Full Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  maxLength={40}
                  value={username}
                  onChange={(e) => setUserName(sanitizeTextOnly(e.target.value, 40, 3))}
                  placeholder="Enter your full name"
                  className="w-full bg-[#17201c] border border-[#23322b] text-sm text-gray-200 placeholder-gray-500 rounded-xl pl-11 pr-4 py-[14px] focus:outline-none focus:border-[#2ecc71] transition"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  maxLength={80}
                  value={email}
                  onChange={(e) => setEmail(sanitizeEmail(e.target.value, 80))}
                  placeholder="you@example.com"
                  className="w-full bg-[#17201c] border border-[#23322b] text-sm text-gray-200 placeholder-gray-500 rounded-xl pl-11 pr-4 py-[14px] focus:outline-none focus:border-[#2ecc71] transition"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  maxLength={64}
                  value={password}
                  onChange={(e) => setPassword(sanitizePassword(e.target.value, 64))}
                  placeholder="••••••••"
                  className="w-full bg-[#17201c] border border-[#23322b] text-sm text-gray-200 placeholder-gray-500 rounded-xl pl-11 pr-4 py-[14px] focus:outline-none focus:border-[#2ecc71] transition"
                  required
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="h-[1px] w-full bg-[#1f2924]"></div>
                <span className="text-[9px] text-gray-500 whitespace-nowrap px-2 tracking-wide">
                  Secure password required
                </span>
              </div>
            </div>

            {/* Interest Tags Section */}
            <div className="flex flex-col gap-3 my-2">
              <label className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                I'm interested in:
              </label>
              <div className="flex flex-wrap gap-2">
                {/* Recycling Tag */}
                <button
                  type="button"
                  onClick={() => toggleInterest("recycling")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition cursor-pointer ${
                    selectedInterests.includes("recycling")
                      ? "bg-[#2ecc71]/20 border-[#2ecc71] text-[#2ecc71]"
                      : "bg-[#17201c] border-[#23322b] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <Recycle className="w-3.5 h-3.5" />
                  <span>Recycling</span>
                </button>

                {/* Renewable Energy Tag */}
                <button
                  type="button"
                  onClick={() => toggleInterest("renewable_energy")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition cursor-pointer ${
                    selectedInterests.includes("renewable_energy")
                      ? "bg-[#2ecc71]/20 border-[#2ecc71] text-[#2ecc71]"
                      : "bg-[#17201c] border-[#23322b] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Renewable Energy</span>
                </button>

                {/* Reforestation Tag */}
                <button
                  type="button"
                  onClick={() => toggleInterest("reforestation")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition cursor-pointer ${
                    selectedInterests.includes("reforestation")
                      ? "bg-[#2ecc71]/20 border-[#2ecc71] text-[#2ecc71]"
                      : "bg-[#17201c] border-[#23322b] text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Reforestation</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2ecc71] hover:bg-[#27ae60] active:scale-[0.99] text-black font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm"
            >
              <span>{loading ? "Creating..." : "Create Account"}</span>
              {!loading && (
                <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
              )}
            </button>
          </form>

          {/* Bottom Login Link */}
          <div className="mt-6 text-xs text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#2ecc71] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Log In
            </button>
          </div>
        </div>
      </main>

      {/* Footer / Stats Section */}
      <footer className="max-w-4xl mx-auto w-full pb-4 flex flex-col gap-10 items-center justify-center text-center">
        {/* Metric Stats Rows */}
        <div className="grid grid-cols-3 gap-12 sm:gap-24 text-center">
          <div>
            <div className="text-[22px] font-bold text-[#2ecc71] tracking-tight">
              50k+
            </div>
            <div className="text-[9px] text-gray-500 tracking-wider uppercase mt-0.5">
              Eco-Warriors
            </div>
          </div>
          <div>
            <div className="text-[22px] font-bold text-[#2ecc71] tracking-tight">
              12M
            </div>
            <div className="text-[9px] text-gray-500 tracking-wider uppercase mt-0.5">
              CO2 Reduced
            </div>
          </div>
          <div>
            <div className="text-[22px] font-bold text-[#2ecc71] tracking-tight">
              A+
            </div>
            <div className="text-[9px] text-gray-500 tracking-wider uppercase mt-0.5">
              Impact Rating
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 gap-4 pt-4 border-t border-[#131a17]">
          <div>© 2024 GreenQuest AI. Accelerating the Global Goals.</div>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-gray-300 transition">
              Privacy Protocol
            </a>
            <a href="#terms" className="hover:text-gray-300 transition">
              Terms of Service
            </a>
            <a href="#status" className="hover:text-gray-300 transition">
              API Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
