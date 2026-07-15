import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
// Using lucide-react for the custom icons layout
import {
  Leaf,
  AtSign,
  Lock,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      const { data: profile, profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
        return;
      }

      if (!profile) {
        setError("Profile not found");
        return;
      }

      if (profile.role === "admin") {
        navigate("/adminDasboard");
      } else {
        navigate("/userDasboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Optional OAuth click handlers
  const handleOAuthSignIn = async (provider) => {
    try {
      await supabase.auth.signInWithOAuth({ provider });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b08] text-white flex items-center justify-center font-mono p-4 selection:bg-[#22c55e]/30">
      {/* Main Container Card Split into Two Sections */}
      <div className="w-full max-w-[840px] bg-[#0d1310] border border-[#1b2520] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Eco-Intelligence Graphic Section */}
        <div className="relative bg-gradient-to-b from-[#111a15] to-[#0a100d] p-10 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#1b2520]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,204,113,0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="w-full flex justify-start opacity-0 md:opacity-100">
            {/* Structural spacer matching design alignment */}
            <div className="h-4"></div>
          </div>

          {/* Leaf Visual Artwork Container */}
          <div className="flex flex-col items-center max-w-[280px] z-10 text-center my-auto">
            <div className="w-56 h-56 rounded-xl bg-[#080d0a] border border-[#1a2620] flex items-center justify-center shadow-inner relative overflow-hidden mb-6 group">
              {/* Green futuristic graphic simulation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2ecc71]/5 to-transparent mix-blend-screen" />
              <Leaf className="w-28 h-28 text-[#52df90] filter drop-shadow-[0_0_15px_rgba(46,204,113,0.4)] transform -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
            </div>

            <h3 className="text-[19px] font-bold text-[#44d382] tracking-tight mb-2">
              Eco-Intelligence Realized
            </h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Harnessing advanced neural grids to optimize global carbon
              sequestration in real-time.
            </p>
          </div>

          {/* Footer Subtext Inside Graphics Side */}
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 tracking-widest uppercase z-10 mt-6 md:mt-0">
            <Link to="/" className="border-b">
              Go Back
            </Link>
          </div>
        </div>

        {/* Right Side: Interactive Login Form Section */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          {/* Form Header */}
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-4 h-4 text-[#2ecc71] fill-[#2ecc71]" />
            <span className="text-xs font-bold text-gray-300 tracking-tight">
              GreenQuest
            </span>
          </div>

          <h2 className="text-[25px] font-bold text-[#e6eae7] tracking-tight mb-1">
            Welcome Back, Guardian
          </h2>
          <p className="text-[11px] text-gray-400 mb-6">
            Continue your mission for a greener Earth.
          </p>

          {error && (
            <div className="w-full bg-red-950/40 border border-red-900/60 text-red-400 p-3 rounded-xl text-[11px] mb-4 text-center">
              {error}
            </div>
          )}

          {/* Core Interactive Login Form */}
          <form onSubmit={handleSignIn} className="w-full flex flex-col gap-4">
            {/* Guardian ID (Email) Input field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Guardian ID (Email)
              </label>
              <div className="relative flex items-center">
                <AtSign className="absolute left-4 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.eco"
                  className="w-full bg-[#111815] border border-[#1f2d26] text-xs text-gray-200 placeholder-gray-600 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#2ecc71] transition"
                  required
                />
              </div>
            </div>

            {/* Password input with nested forgot link styling */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Security Protocol (Password)
                </label>
                <a
                  href="#forgot"
                  className="text-[9px] text-[#2ecc71] hover:underline font-bold tracking-wide"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111815] border border-[#1f2d26] text-xs text-gray-200 placeholder-gray-600 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#2ecc71] transition"
                  required
                />
              </div>
            </div>

            {/* Primary Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2ecc71] hover:bg-[#27ae60] active:scale-[0.99] text-black font-semibold text-xs rounded-xl py-3.5 flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <span>{loading ? "Verifying..." : "Sign In"}</span>
              {!loading && (
                <ArrowRight className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              )}
            </button>
          </form>

          {/* Visual Horizontal Splitter Divider */}
          <div className="flex items-center justify-between my-6">
            <div className="h-[1px] w-full bg-[#19231f]"></div>
            <span className="text-[9px] text-gray-500 whitespace-nowrap px-3 tracking-wider">
              Or verify via
            </span>
            <div className="h-[1px] w-full bg-[#19231f]"></div>
          </div>

          {/* Social OAuth Alternative Login Matrix */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              className="bg-[#111815] hover:bg-[#16201c] border border-[#1f2d26] text-[11px] rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 transition cursor-pointer font-sans"
            >
              {/* Clean Custom inline SVG to closely match brand imagery elements */}
              <svg className="w-3.5 h-3.5 text-current" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.422 1.921 15.564 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.078-1.32-.177-1.71h-10.616z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn("apple")}
              className="bg-[#111815] hover:bg-[#16201c] border border-[#1f2d26] text-[11px] rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 transition cursor-pointer font-sans"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Alternate Route Navigation Action */}
          <div className="mt-8 text-center text-[11px] text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-[#2ecc71] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer ml-1"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
