import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import Plant from "./Plant";
import CameraRig from "./CameraRig";
import SceneEnvironment from "./SceneEnvironment";

/**
 * progressRef / velocityRef are plain refs (not React state) so the R3F
 * render loop can read scroll progress every frame without re-rendering
 * React on every scroll tick.
 */
export default function PlantScene({ progressRef, className = "" }) {
  const velocityRef = useRef(0);
  const windRef = useRef(0.4);
  const [isMobile, setIsMobile] = useState(false);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDpr(mobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Ambient breeze strength drifts slowly on its own, independent of scroll,
  // so the plant still feels alive when the user isn't scrolling at all.
  useEffect(() => {
    let raf;
    const tick = (t) => {
      windRef.current = 0.35 + Math.sin(t * 0.00025) * 0.15;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        shadows
        dpr={dpr}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: isMobile ? 42 : 36 }}
      >
        <color attach="background" args={["#070b09"]} />
        <PerspectiveCamera makeDefault fov={isMobile ? 42 : 36} near={0.1} far={30} />
        <CameraRig progressRef={progressRef} velocityRef={velocityRef} isMobile={isMobile} />
        <Suspense fallback={null}>
          <Plant windRef={windRef} velocityRef={velocityRef} />
          <SceneEnvironment velocityRef={velocityRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}