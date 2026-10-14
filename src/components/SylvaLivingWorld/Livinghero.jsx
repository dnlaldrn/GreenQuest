import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SylvaLivingWorldScene } from "./SylvaLivingWorldScene";
import "./threeui.css";

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

const CARD = "bg-[#0d1612]/60 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/30 ring-1 ring-inset ring-white/5";

/* Smooth scroll-in: fades/slides an element in once it enters the viewport.
   Plain IntersectionObserver + CSS transitions (no scroll triggers, no GSAP). */
function Reveal({ children, className = "", delay = 0, variant = "up" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden =
    variant === "left" ? "opacity-0 -translate-x-6" : variant === "grow" ? "opacity-0 scale-x-0 origin-left" : "opacity-0 translate-y-8";
  const visible = variant === "grow" ? "opacity-100 scale-x-100 origin-left" : "opacity-100 translate-x-0 translate-y-0";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`${className} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] ${shown ? visible : hidden}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <Reveal className="text-center max-w-2xl mx-auto mb-10">
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-white">{title}</h2>
      {subtitle && <p className="mt-2 text-sm md:text-base text-gray-300">{subtitle}</p>}
    </Reveal>
  );
}

export default function LivingHero() {
  // podium order: 2nd, 1st, 3rd
  const podium = [LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].filter(Boolean);

  return (
    <div className="relative">
      {/* Shader background pinned behind the whole hero area with plain CSS (no scroll triggers) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#070b09]">
          <div className="absolute inset-0">
            <SylvaLivingWorldScene variant="living-green" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b09]/70 via-transparent to-[#070b09]/40" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">
        {/* Hero */}
        <section className="flex min-h-[85vh] items-center py-12">
          <div className="max-w-xl space-y-7">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              Turn Sustainable <br />
              <span className="bg-gradient-to-r from-emerald-300 to-[#22C55E] bg-clip-text text-transparent">Actions Into Rewards</span>
            </h1>
            <p className="text-gray-100 text-base md:text-lg max-w-xl leading-relaxed">
              Upload eco-friendly videos, let AI verify your impact, and earn Green Points for a greener future. Join thousands making a real difference.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 font-semibold tracking-wide text-neutral-950 shadow-lg shadow-emerald-400/25 transition hover:-translate-y-0.5 hover:bg-emerald-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Upload Video
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold tracking-wide text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Learn More
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              {[
                ["Total Points", "1.2M+"],
                ["Videos Analyzed", "85k+"],
                ["CO2 Saved", "450"],
              ].map(([label, value]) => (
                <div key={label} className={`rounded-2xl p-4 ${CARD}`}>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">{label}</span>
                  <span className="text-2xl font-extrabold tracking-tight text-white">
                    {value}
                    {label === "CO2 Saved" && <span className="text-xs font-normal text-gray-400"> Tons</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works: connected timeline */}
        <section id="how-it-works" className="scroll-mt-20 py-12 md:py-16">
          <SectionHeader eyebrow="How it works" title="From upload to reward" subtitle="Your impact, verified from upload to reward." />
          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="pointer-events-none absolute left-[12%] right-[12%] top-[2.1rem] hidden h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent lg:block" />
            {STEPS.map((step, i) => (
              <Reveal key={step.id} delay={i * 100} className={`relative rounded-2xl p-5 ${CARD}`}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                  {step.icon}
                </div>
                <h3 className="mb-1 text-base font-bold tracking-wide text-white">{step.title}</h3>
                <p className="text-xs leading-relaxed text-gray-300">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Features: bento grid */}
        <section className="py-12 md:py-16">
          <SectionHeader eyebrow="Features" title="Future-ready features" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, idx) => (
              <Reveal
                key={idx}
                delay={idx * 70}
                className={`group flex flex-col gap-3 rounded-2xl p-5 transition-colors hover:border-emerald-400/30 ${CARD}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-bold tracking-wide text-white">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-gray-300">{feature.description}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Leaderboard: podium */}
        <section className="py-12 pb-20 md:py-16 md:pb-24">
          <SectionHeader eyebrow="Leaderboard" title="Impact leaderboard" subtitle="Celebrating this month's top Earth Champions." />
          <div className="mx-auto grid max-w-3xl grid-cols-1 items-end gap-4 sm:grid-cols-3">
            {podium.map((row, i) => {
              const first = row.rank === "01";
              return (
                <Reveal
                  key={row.rank}
                  delay={i * 120}
                  className={`flex flex-col items-center rounded-2xl p-6 text-center ${CARD} ${
                    first ? "sm:-translate-y-4 border-emerald-400/40 shadow-emerald-500/10 sm:order-none order-first" : ""
                  }`}
                >
                  <span className={`mb-3 text-xs font-bold tracking-widest ${first ? "text-emerald-300" : "text-gray-400"}`}>#{row.rank}</span>
                  <div
                    className={`mb-3 flex items-center justify-center rounded-full bg-neutral-900 font-bold text-gray-200 ${
                      first ? "h-16 w-16 ring-2 ring-emerald-400 text-lg" : "h-12 w-12 ring-1 ring-white/20 text-sm"
                    }`}
                  >
                    {row.initials}
                  </div>
                  <span className="font-semibold text-white">{row.name}</span>
                  <span className="mt-0.5 text-xs text-gray-400">{row.quests} quests</span>
                  <span className={`mt-3 text-xl font-extrabold ${first ? "text-emerald-300" : "text-gray-100"}`}>
                    {row.points} <span className="text-xs font-medium text-gray-400">pts</span>
                  </span>
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}