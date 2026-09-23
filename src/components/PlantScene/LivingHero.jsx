import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlantScene from "./PlantScene";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    id: 1,
    title: "1. Upload",
    description: "Capture your eco-action in a short video clip.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "2. AI Analysis",
    description: "Our AI verifies the authenticity of your action.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "3. Earn Points",
    description: "Receive Green Points based on the impact score.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "4. Redeem",
    description: "Swap points for rewards or carbon offsets.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0H4v13a2 2 0 002 2h12a2 2 0 002-2V8H12z" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: "AI Verification",
    description: "Real-time computer vision to validate recycling, composting, and planting activities.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Gamified Rewards",
    description: "Level up your sustainability profile and unlock exclusive eco-perks.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0H4v13a2 2 0 002 2h12a2 2 0 002-2V8H12z" />
      </svg>
    ),
  },
  {
    title: "Leaderboards",
    description: "Compete globally or locally to see who makes the biggest impact.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "Achievement Badges",
    description: "Collect unique on-chain badges for sustainability milestones.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.588 1.81l-3.974 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.77-.558-.371-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: "Sustainability Analytics",
    description: "Dive into your carbon footprint data and reduction trends.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Secure Profiles",
    description: "Your data and identity are protected with industry-standard encryption.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

const LEADERBOARD = [
  { rank: "01", initials: "EL", name: "Elena Rivers", quests: 142, points: "45,200" },
  { rank: "02", initials: "MK", name: "Marcus K.", quests: 128, points: "41,800" },
  { rank: "03", initials: "SJ", name: "Sarah Jenkins", quests: 115, points: "38,500" },
];

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Trapezoid opacity: fades in between (inStart, inEnd) and out between (outStart, outEnd).
function stageOpacity(p, inStart, inEnd, outStart, outEnd) {
  return smoothstep(inStart, inEnd, p) * (1 - smoothstep(outStart, outEnd, p));
}

export default function LivingHero() {
  const containerRef = useRef(null);
  const heroCopyRef = useRef(null);
  const scrollCueRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const leaderboardRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          applyOverlayStyles(p);
        },
      });

      function setStage(ref, opacity, translateY, activeThreshold = 0.4) {
        if (!ref.current) return;
        ref.current.style.opacity = opacity;
        ref.current.style.transform = `translateY(${translateY}px)`;
        ref.current.style.pointerEvents = opacity > activeThreshold ? "auto" : "none";
      }

      function applyOverlayStyles(p) {
        // Stage 1 — Hero copy: visible early, fades out heading into stage 2.
        const heroOpacity = 1 - smoothstep(0.14, 0.22, p);
        setStage(heroCopyRef, heroOpacity, (1 - heroOpacity) * -30, 0.05);

        if (scrollCueRef.current) {
          scrollCueRef.current.style.opacity = 1 - smoothstep(0, 0.05, p);
        }

        // Stage 2 — How It Works (side-on camera).
        const howOpacity = stageOpacity(p, 0.18, 0.26, 0.44, 0.52);
        setStage(howItWorksRef, howOpacity, (1 - howOpacity) * 30);

        // Stage 3 — Features (top-down camera).
        const featuresOpacity = stageOpacity(p, 0.48, 0.56, 0.74, 0.82);
        setStage(featuresRef, featuresOpacity, (1 - featuresOpacity) * 30);

        // Stage 4 — Leaderboard (zoomed-in camera). Stays visible to the end.
        const leaderboardOpacity = smoothstep(0.78, 0.86, p);
        setStage(leaderboardRef, leaderboardOpacity, (1 - leaderboardOpacity) * 30);
      }

      applyOverlayStyles(0);

      return () => trigger.kill();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: "420vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#070b09]">
        {/* Plant Scene (3D Canvas in background, shared across all 4 stages) */}
        <PlantScene progressRef={progressRef} className="absolute inset-0 h-full w-full pointer-events-none" />

        {/* Ambient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b09]/90 via-transparent to-[#070b09]/60" />

        {/* STAGE 1 — Hero Copy */}
        <div ref={heroCopyRef} className="absolute inset-0 z-10 flex items-center transition-none pointer-events-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="max-w-xl space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Turn Sustainable <br />
                  <span className="text-[#22C55E]">Actions Into Rewards</span>
                </h1>
                <p className="text-white text-base md:text-lg max-w-xl leading-relaxed">
                  Upload eco-friendly videos, let AI verify your impact, and earn
                  Green Points for a greener future. Join thousands making a real
                  difference.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 px-6 py-3 rounded-lg font-semibold tracking-wide shadow-lg shadow-emerald-400/20 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Upload Video</span>
                </Link>
                <button className="border border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 px-6 py-3 rounded-lg font-semibold tracking-wide transition-all duration-200">
                  Learn More
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 max-w-2xl">
                <div className="bg-[#101714]/60 border border-emerald-950/60 p-4 rounded-xl backdrop-blur-sm">
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-1">Total Points</span>
                  <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-100">1.2M+</span>
                </div>
                <div className="bg-[#101714]/60 border border-emerald-950/60 p-4 rounded-xl backdrop-blur-sm">
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-1">Videos Analyzed</span>
                  <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-100">85k+</span>
                </div>
                <div className="bg-[#101714]/60 border border-emerald-950/60 p-4 rounded-xl backdrop-blur-sm">
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-1">CO2 Saved</span>
                  <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-100">
                    450 <span className="text-xs font-normal text-gray-400">Tons</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollCueRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-emerald-400/70"
        >
          <span className="text-[11px] tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* STAGE 2 — How It Works (side camera angle) */}
        <div id="how-it-works" ref={howItWorksRef} className="absolute inset-0 z-10 opacity-0 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-100">How It Works</h2>
            <p className="text-gray-300 text-sm mt-1">Your impact, verified from upload to reward.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl w-full">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#0d1612]/80 border border-emerald-500/20 backdrop-blur-md text-left shadow-xl shadow-black/40"
              >
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border border-emerald-500/30 bg-emerald-950/60 text-emerald-400">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-wide text-neutral-100 mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STAGE 3 — Features (top-down camera angle) */}
        <div ref={featuresRef} className="absolute inset-0 z-10 opacity-0 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-100">Future-Ready Features</h2>
            <div className="w-16 h-[3px] bg-emerald-500 mt-3 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#0d1612]/80 border border-emerald-500/20 backdrop-blur-md p-4 rounded-2xl flex flex-col gap-2 shadow-xl shadow-black/40"
              >
                <div className="text-emerald-400">{feature.icon}</div>
                <h3 className="text-sm font-bold tracking-wide text-neutral-100">{feature.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed hidden sm:block">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STAGE 4 — Leaderboard (zoomed-in camera angle) */}
        <div ref={leaderboardRef} className="absolute inset-0 z-10 opacity-0 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-100">Impact Leaderboard</h2>
            <p className="text-gray-300 text-sm mt-1">Celebrating this month's top Earth Champions.</p>
          </div>

          <div className="w-full max-w-2xl bg-[#0d1612]/80 border border-emerald-500/20 backdrop-blur-md rounded-2xl shadow-xl shadow-black/40 overflow-hidden">
            {LEADERBOARD.map((row, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 px-6 py-4 ${index !== LEADERBOARD.length - 1 ? "border-b border-emerald-950/40" : ""}`}
              >
                <span className="text-emerald-400 font-bold tracking-wide w-6">{row.rank}</span>
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-emerald-950 flex items-center justify-center text-[11px] font-bold text-gray-300 tracking-wider shrink-0">
                  {row.initials}
                </div>
                <span className="font-semibold text-neutral-200 flex-1">{row.name}</span>
                <span className="text-gray-400 text-sm hidden sm:block">{row.quests} quests</span>
                <span className="text-gray-200 font-medium">{row.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}