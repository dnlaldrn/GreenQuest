import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { createRng } from "./rng";

/** Soft drifting dust/particle motes — subtle, not sparkly. */
function AtmosphereParticles({ velocityRef, count = 90 }) {
  const points = useRef();

  const { positions, seeds } = useMemo(() => {
    const rng = createRng(9001);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng.next() - 0.5) * 4.5;
      positions[i * 3 + 1] = rng.next() * 3.2;
      positions[i * 3 + 2] = (rng.next() - 0.5) * 4.5;
      seeds[i] = rng.next() * Math.PI * 2;
    }
    return { positions, seeds };
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    const arr = points.current.geometry.attributes.position.array;
    const t = state.clock.elapsedTime;
    const kick = 1 + velocityRef.current * 4;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.02 * kick;
      arr[i * 3] += Math.sin(t * 0.2 + seeds[i]) * 0.0006 * kick;
      if (arr[i * 3 + 1] > 3.4) arr[i * 3 + 1] = 0;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#cfead0" transparent opacity={0.35} depthWrite={false} />
    </points>
  );
}

/** Tiny rocks, bark chips and moss scattered around the pot base. */
function GroundScatter({ radius = 1.6 }) {
  const items = useMemo(() => {
    const rng = createRng(4242);
    const list = [];
    for (let i = 0; i < 14; i++) {
      const a = rng.next() * Math.PI * 2;
      const r = 0.75 + rng.next() * radius;
      list.push({
        type: "rock",
        pos: [Math.cos(a) * r, 0, Math.sin(a) * r],
        scale: 0.03 + rng.next() * 0.05,
        rot: [rng.next(), rng.next(), rng.next()],
      });
    }
    for (let i = 0; i < 10; i++) {
      const a = rng.next() * Math.PI * 2;
      const r = 0.7 + rng.next() * radius * 0.8;
      list.push({
        type: "moss",
        pos: [Math.cos(a) * r, 0.005, Math.sin(a) * r],
        scale: 0.06 + rng.next() * 0.08,
      });
    }
    return list;
  }, [radius]);

  return (
    <group position={[0, -0.68, 0]}>
      {items.map((item, i) =>
        item.type === "rock" ? (
          <mesh key={i} position={item.pos} rotation={item.rot} castShadow receiveShadow>
            <dodecahedronGeometry args={[item.scale, 0]} />
            <meshStandardMaterial color="#6b6b64" roughness={0.9} />
          </mesh>
        ) : (
          <mesh key={i} position={item.pos} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[item.scale, 10]} />
            <meshStandardMaterial color="#3d6b3f" roughness={1} />
          </mesh>
        )
      )}
    </group>
  );
}

export default function SceneEnvironment({ velocityRef }) {
  return (
    <>
      {/* Primary soft area light, front/above — the key light of the "studio shoot" */}
      <directionalLight
        position={[2.4, 4.2, 3.2]}
        intensity={1.6}
        color="#fff3df"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0015}
      />
      {/* Green bounce fill from below/side */}
      <pointLight position={[-1.6, 0.4, -1.2]} intensity={0.35} color="#6fae6b" />
      {/* Rim light to separate leaves from the dark background */}
      <spotLight position={[-2.2, 2.6, -2.8]} angle={0.5} intensity={0.6} color="#bfe8c9" penumbra={1} />
      <ambientLight intensity={0.18} />

      <Environment preset="apartment" environmentIntensity={0.35} />

      <fog attach="fog" args={["#0a120c", 4, 11]} />

      <ContactShadows position={[0, -1.02, 0]} opacity={0.55} scale={6} blur={2.2} far={2.5} color="#01120a" />

      <GroundScatter />
      <AtmosphereParticles velocityRef={velocityRef} />
    </>
  );
}