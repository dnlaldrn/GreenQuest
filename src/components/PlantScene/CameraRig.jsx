import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

// Four camera "stops", one per page/stage of the scroll experience. Spherical
// coordinates: phi is the polar angle from the +Y axis (90° = level with the
// plant / side-on, small = looking straight down), theta is rotation around Y.
// lookYFactor scales targetHeight to decide how high/low the camera looks —
// lower for the top-down stage so the canopy stays framed instead of the pot.
const STOPS = [
  // Stage 1 — Hero: wide establishing shot
  { radius: 5.6, phi: THREE.MathUtils.degToRad(80), theta: THREE.MathUtils.degToRad(18), lookYFactor: 1.0 },
  // Stage 2 — How It Works: clean side-on profile of the plant
  { radius: 5.0, phi: THREE.MathUtils.degToRad(88), theta: THREE.MathUtils.degToRad(42), lookYFactor: 1.0 },
  // Stage 3 — Features: top-down view
  { radius: 4.3, phi: THREE.MathUtils.degToRad(12), theta: THREE.MathUtils.degToRad(60), lookYFactor: 0.5 },
  // Stage 4 — Leaderboard: zoomed in close on the canopy
  { radius: 2.6, phi: THREE.MathUtils.degToRad(55), theta: THREE.MathUtils.degToRad(95), lookYFactor: 0.85 },
];

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// Given progress 0..1 and N stops, find which pair of stops it falls between
// and the local (0..1) progress across that pair.
function getSegment(p, stops) {
  const scaled = THREE.MathUtils.clamp(p, 0, 1) * (stops.length - 1);
  const index = Math.min(Math.floor(scaled), stops.length - 2);
  const localT = scaled - index;
  return { index, localT };
}

/**
 * progressRef: ref<{ current: number }> 0..1 driven by GSAP ScrollTrigger.
 * velocityRef: ref<{ current: number }> smoothed |d(progress)/dt|, used to
 *   nudge leaf sway and camera responsiveness on fast scrolls.
 * targetHeight: base height the camera looks at (center of the plant canopy).
 */
export default function CameraRig({ progressRef, velocityRef, targetHeight = 1.05, isMobile = false, stops = STOPS }) {
  const { camera } = useThree();
  const current = useRef(new THREE.Spherical(stops[0].radius, stops[0].phi, stops[0].theta));
  const lastProgress = useRef(0);
  const lookTarget = useRef(new THREE.Vector3(0, targetHeight * stops[0].lookYFactor, 0));

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0;

    // Track scroll velocity for the "fast scroll = livelier plant" behavior.
    const rawVelocity = Math.abs(p - lastProgress.current) / Math.max(delta, 0.001);
    lastProgress.current = p;
    velocityRef.current = THREE.MathUtils.damp(velocityRef.current, THREE.MathUtils.clamp(rawVelocity * 0.6, 0, 1.4), 5, delta);

    const { index, localT } = getSegment(p, stops);
    const eased = easeInOutCubic(localT);
    const from = stops[index];
    const to = stops[index + 1];

    const mobileShrink = isMobile ? 0.82 : 1;
    const targetSpherical = {
      radius: THREE.MathUtils.lerp(from.radius, to.radius, eased) * mobileShrink,
      phi: THREE.MathUtils.lerp(from.phi, to.phi, eased),
      theta: THREE.MathUtils.lerp(from.theta, to.theta, eased),
    };
    const lookYFactor = THREE.MathUtils.lerp(from.lookYFactor, to.lookYFactor, eased);

    // Critically-damped follow so the camera settles smoothly rather than
    // snapping directly to scroll position — this is what makes it feel
    // like a real orbit instead of a slider.
    const smoothing = 6 + velocityRef.current * 3;
    current.current.radius = THREE.MathUtils.damp(current.current.radius, targetSpherical.radius, smoothing, delta);
    current.current.phi = THREE.MathUtils.damp(current.current.phi, targetSpherical.phi, smoothing, delta);
    current.current.theta = THREE.MathUtils.damp(current.current.theta, targetSpherical.theta, smoothing, delta);

    const pos = new THREE.Vector3().setFromSpherical(current.current);
    lookTarget.current.set(0, targetHeight * lookYFactor, 0);

    camera.position.set(pos.x, pos.y + targetHeight, pos.z);
    camera.lookAt(lookTarget.current);
  });

  return null;
}