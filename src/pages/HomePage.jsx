import React from "react";

export default function HeroSection() {
  const steps = [
    {
      id: 1,
      title: "Upload",
      description: "Capture your eco-action in a short video clip.",
      // Cloud upload icon
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "AI Analysis",
      description: "Our AI verifies the authenticity of your action.",
      // AI / Brain outline icon
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Earn Points",
      description: "Receive Green Points based on the impact score.",
      // Currency / Points stack icon
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Redeem",
      description: "Swap points for rewards or carbon offsets.",
      // Giftbox icon
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0H4v13a2 2 0 002 2h12a2 2 0 002-2V8H12z"
          />
        </svg>
      ),
    },
  ];
  const features = [
    {
      title: "AI Verification",
      description:
        "Real-time computer vision processing to validate recycling, composting, and planting activities.",
      // Checkmark Badge Icon
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      title: "Gamified Rewards",
      description:
        "Level up your sustainability profile and unlock exclusive digital and physical eco-perks.",
      // Medal/Trophy Icon
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0H4v13a2 2 0 002 2h12a2 2 0 002-2V8H12z"
          />
        </svg>
      ),
    },
    {
      title: "Leaderboards",
      description:
        "Compete globally or within your local community to see who makes the biggest impact.",
      // Podium / Stats bar outline icon
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      title: "Achievement Badges",
      description:
        "Collect unique on-chain badges for hitting specific sustainability milestones.",
      // Star/Ribbon Award Icon
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.588 1.81l-3.974 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.77-.558-.371-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      title: "Sustainability Analytics",
      description:
        "Deep dive into your personal carbon footprint data and see your reduction trends.",
      // Bar Chart Icon
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Secure Profiles",
      description:
        "Your data and identity are protected with industry-standard encryption protocols.",
      // Shield Icon
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
  ];

  const leaderboardData = [
    {
      rank: "01",
      initials: "EL",
      name: "Elena Rivers",
      quests: 142,
      points: "45,200",
      impact: "12.4t CO2",
    },
    {
      rank: "02",
      initials: "MK",
      name: "Marcus K.",
      quests: 128,
      points: "41,800",
      impact: "10.1t CO2",
    },
    {
      rank: "03",
      initials: "SJ",
      name: "Sarah Jenkins",
      quests: 115,
      points: "38,500",
      impact: "8.9t CO2",
    },
  ];
  return (
    <div className="min-h-screen bg-[#070b09] text-white font-sans overflow-hidden relative selection:bg-emerald-500 selection:text-black">
      {/* Background Decorative Waves (Simulated via gradients/blur) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[60%] bg-gradient-to-br from-emerald-500/20 to-transparent blur-3xl transform rotate-12" />
        <div className="absolute top-[40%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-tl from-green-500/10 via-emerald-600/5 to-transparent blur-3xl transform -rotate-12" />
      </div>

      {/* --- HERO MAIN CONTENT --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Copy and Stats */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Turn Sustainable <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                Actions Into Rewards
              </span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
              Upload eco-friendly videos, let AI verify your impact, and earn
              Green Points for a greener future. Join thousands making a real
              difference.
            </p>
          </div>

          {/* Action Call to Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center space-x-2 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 px-6 py-3 rounded-lg font-semibold tracking-wide shadow-lg shadow-emerald-400/20 transition-all duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Upload Video</span>
            </button>

            <button className="border border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 px-6 py-3 rounded-lg font-semibold tracking-wide transition-all duration-200">
              Learn More
            </button>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 max-w-2xl">
            {/* Stat 1 */}
            <div className="bg-[#101714]/60 border border-emerald-950/60 p-4 rounded-xl backdrop-blur-sm">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-1">
                Total Points
              </span>
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-100">
                1.2M+
              </span>
            </div>

            {/* Stat 2 */}
            <div className="bg-[#101714]/60 border border-emerald-950/60 p-4 rounded-xl backdrop-blur-sm">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-1">
                Videos Analyzed
              </span>
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-100">
                85k+
              </span>
            </div>

            {/* Stat 3 */}
            <div className="bg-[#101714]/60 border border-emerald-950/60 p-4 rounded-xl backdrop-blur-sm">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-1">
                CO2 Saved
              </span>
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-100">
                450{" "}
                <span className="text-xs font-normal text-gray-400">Tons</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: AI Earth Image Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative group w-full max-w-[420px] aspect-square rounded-2xl p-1 bg-gradient-to-b from-emerald-950/50 to-emerald-900/10 border border-emerald-900/40 shadow-2xl shadow-emerald-950/50">
            <div className="w-full h-full rounded-xl overflow-hidden bg-[#0d1210] flex items-center justify-center relative">
              {/* Main AI / Mossy Sphere Image Place Holder */}
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" // Replace this URL with your custom green AI graphic
                alt="AI Sustainability Hub"
                className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              {/* Optional inner glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b09] via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </main>
      <section className="bg-[#090f0c] text-white py-20 px-6 select-none relative overflow-hidden">
        {/* Top Header Group */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-100">
            How It Works
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide">
            Our advanced computer vision verifies your real-world ecological
            actions in seconds.
          </p>
        </div>

        {/* Steps Grid Container */}
        <div className="max-w-6xl mx-auto relative">
          {/* Decorative connecting line behind the elements (Visible on desktop) */}
          <div className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 relative z-10">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center text-center space-y-4 group"
              >
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-full flex items-center justify-center border border-emerald-500/30 bg-[#0d1612] text-emerald-400 shadow-md shadow-emerald-950/40 group-hover:border-emerald-400 group-hover:text-emerald-300 transition-all duration-300 transform group-hover:scale-105">
                  {step.icon}
                </div>

                {/* Text Meta */}
                <div className="space-y-2 max-w-[240px]">
                  <h3 className="text-lg font-bold tracking-wide text-neutral-100">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#090f0c] text-white py-24 px-6 md:px-12 selection:bg-emerald-500 selection:text-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Green Accent Underline */}
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-100">
              Future-Ready Features
            </h2>
            <div className="w-16 h-[3px] bg-emerald-500 mt-3 rounded-full" />
          </div>

          {/* Features 3x2 Grid Setup */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#121915]/60 border border-emerald-950/50 hover:border-emerald-500/30 p-8 rounded-2xl flex flex-col space-y-4 transition-all duration-300 group hover:bg-[#151e19]/80 shadow-lg shadow-black/20"
              >
                {/* Feature Icon Container */}
                <div className="text-emerald-500 group-hover:text-emerald-400 transition-colors duration-200">
                  {feature.icon}
                </div>

                {/* Title & Description Container */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold tracking-wide text-neutral-100 group-hover:text-emerald-400 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-100">
              Impact Leaderboard
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Celebrating this month's top Earth Champions.
            </p>
          </div>
          <div>
            <button className="border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:bg-emerald-950/20 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200">
              View All Rankings
            </button>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="w-full overflow-x-auto bg-[#111815]/50 border border-emerald-950/60 rounded-2xl backdrop-blur-sm shadow-xl">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-emerald-950/40 text-[11px] font-extrabold uppercase tracking-widest text-emerald-500/90">
                <th className="py-5 px-6">Rank</th>
                <th className="py-5 px-6">User</th>
                <th className="py-5 px-6">Quests Done</th>
                <th className="py-5 px-6">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/30">
              {leaderboardData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-emerald-950/10 transition-colors duration-150"
                >
                  {/* Rank column */}
                  <td className="py-5 px-6 text-emerald-400 font-bold tracking-wide">
                    {row.rank}
                  </td>

                  {/* Avatar + User column */}
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 border border-emerald-950 flex items-center justify-center text-[11px] font-bold text-gray-400 tracking-wider">
                        {row.initials}
                      </div>
                      <span className="font-semibold text-neutral-200">
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Quests column */}
                  <td className="py-5 px-6 text-gray-300 font-medium">
                    {row.quests}
                  </td>

                  {/* Points column */}
                  <td className="py-5 px-6 text-gray-300 font-medium">
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
