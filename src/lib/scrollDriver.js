import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mutable, non-reactive store. Three.js components read from this inside
 * useFrame() — we deliberately avoid React state here so scroll/mouse
 * updates never trigger React re-renders (only the WebGL frame updates).
 */
export const scrollState = {
  progress: 0, // 0-1 across the whole page
  velocity: 0, // signed, damped scroll speed
  direction: 1, // 1 = down, -1 = up
  mouseX: 0, // -1..1
  mouseY: 0, // -1..1
  reducedMotion: false,
  isMobile: false,
};

/**
 * Call once near the root of the tree (e.g. in HeroSection). Wires up:
 *  - a ScrollTrigger that tracks normalized page progress + velocity
 *  - a pointer listener for subtle parallax/mouse-follow
 *  - prefers-reduced-motion + coarse-pointer (mobile) detection
 */
export function useScrollDriver() {
  useEffect(() => {
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const applyMedia = () => {
      scrollState.reducedMotion = reduceQuery.matches;
      scrollState.isMobile = mobileQuery.matches;
    };
    applyMedia();
    reduceQuery.addEventListener("change", applyMedia);
    mobileQuery.addEventListener("change", applyMedia);

    let lastY = window.scrollY;
    let lastT = performance.now();

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      scrub: false,
      onUpdate: (self) => {
        const now = performance.now();
        const dt = Math.max(now - lastT, 1);
        const y = window.scrollY;
        const rawVelocity = ((y - lastY) / dt) * 16.67; // normalize to ~px/frame
        lastY = y;
        lastT = now;

        scrollState.progress = self.progress;
        scrollState.direction = rawVelocity >= 0 ? 1 : -1;
        // gentle damping so a single frame spike doesn't whip the plants
        scrollState.velocity = gsap.utils.clamp(-1, 1, scrollState.velocity * 0.85 + rawVelocity * 0.02);
      },
    });

    const onPointerMove = (e) => {
      scrollState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // idle decay of velocity so plants settle to neutral when scrolling stops
    const decay = gsap.ticker.add(() => {
      scrollState.velocity *= 0.94;
    });

    return () => {
      trigger.kill();
      reduceQuery.removeEventListener("change", applyMedia);
      mobileQuery.removeEventListener("change", applyMedia);
      window.removeEventListener("pointermove", onPointerMove);
      gsap.ticker.remove(decay);
    };
  }, []);
}

/**
 * Helper for per-section "grow as you scroll into view" behaviour
 * (How It Works steps, Leaderboard trees). Returns a mutable ref-like
 * object {value} that gets updated 0→1 as `el` crosses the viewport,
 * scrubbed smoothly rather than snapping.
 */
export function bindGrowthToElement(el, { start = "top 75%", end = "top 30%" } = {}, targetState) {
  // Mutate the caller-supplied object (created once via useMemo, not useRef.current
  // read during render) rather than allocating a new one to hand back.
  const state = targetState || { value: 0 };
  const st = ScrollTrigger.create({
    trigger: el,
    start,
    end,
    scrub: 0.6,
    onUpdate: (self) => {
      state.value = self.progress;
    },
  });
  return { state, kill: () => st.kill() };
}

export { gsap, ScrollTrigger };