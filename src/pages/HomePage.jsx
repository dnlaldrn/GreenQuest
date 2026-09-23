import LivingHero from "../components/PlantScene/LivingHero";

export default function HeroSection() {
  // Features and Leaderboard content now live inside LivingHero as
  // Stage 3 (top-down camera) and Stage 4 (zoomed-in camera) of the pinned
  // scroll experience, so this page is just the one component.
  return (
    <div id="home" className="min-h-screen bg-[#070b09] text-white font-sans relative selection:bg-emerald-500 selection:text-black">
      <LivingHero />
    </div>
  );
}