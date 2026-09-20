import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

// Spherical camera path: phi is the polar angle from the +Y axis (90° = level
// with the plant, small = looking straight down), theta is rotation around Y.
const START = { radius: 5.6, phi: THREE.MathUtils.degToRad(80), theta: THREE.MathUtils.degToRad(18) };
const END = { radius: 4.7, phi: THREE.MathUtils.degToRad(14), theta: THREE.MathUtils.degToRad(58) };

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * progressRef: ref<{ current: number }> 0..1 driven by GSAP ScrollTrigger.
 * velocityRef: ref<{ current: number }> smoothed |d(progress)/dt|, used to
 *   nudge leaf sway and camera responsiveness on fast scrolls.
 * targetHeight: where the camera looks (center of the plant canopy).
 */
export default function CameraRig({ progressRef, velocityRef, targetHeight = 1.05, isMobile = false }) {
  const { camera } = useThree();
  const current = useRef(new THREE.Spherical(START.radius, START.phi, START.theta));
  const lastProgress = useRef(0);
  const lookTarget = useRef(new THREE.Vector3(0, targetHeight, 0));

  useFrame((state, delta) => {
    const p = progressRef.current ?? 0;
    const eased = easeInOutCubic(THREE.MathUtils.clamp(p, 0, 1));

    // Track scroll velocity for the "fast scroll = livelier plant" behavior.
    const rawVelocity = Math.abs(p - lastProgress.current) / Math.max(delta, 0.001);
    lastProgress.current = p;
    velocityRef.current = THREE.MathUtils.damp(velocityRef.current, THREE.MathUtils.clamp(rawVelocity * 0.6, 0, 1.4), 5, delta);

    const mobileShrink = isMobile ? 0.82 : 1;
    const targetSpherical = {
      radius: THREE.MathUtils.lerp(START.radius, END.radius, eased) * mobileShrink,
      phi: THREE.MathUtils.lerp(START.phi, END.phi, eased),
      theta: THREE.MathUtils.lerp(START.theta, END.theta, eased),
    };

    // Critically-damped follow so the camera settles smoothly rather than
    // snapping directly to scroll position — this is what makes it feel
    // like a real orbit instead of a slider.
    const smoothing = 6 + velocityRef.current * 3;
    current.current.radius = THREE.MathUtils.damp(current.current.radius, targetSpherical.radius, smoothing, delta);
    current.current.phi = THREE.MathUtils.damp(current.current.phi, targetSpherical.phi, smoothing, delta);
    current.current.theta = THREE.MathUtils.damp(current.current.theta, targetSpherical.theta, smoothing, delta);

    const pos = new THREE.Vector3().setFromSpherical(current.current);
    // A gentle downward drift of the look target as we go top-down, so the
    // canopy stays framed instead of the pot dominating the top view.
    const lookY = THREE.MathUtils.lerp(targetHeight, targetHeight * 0.55, eased);
    lookTarget.current.set(0, lookY, 0);

    camera.position.set(pos.x, pos.y + targetHeight, pos.z);
    camera.lookAt(lookTarget.current);
  });

  return null;
}