import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { createLeafShape, createLeafTexture, createSoilTexture } from "./proceduralAssets";
import { createRng } from "./rng";

const LEAF_PALETTES = [
  { baseColor: "#265732", tipColor: "#4a8f4f" },
  { baseColor: "#2f6b3a", tipColor: "#5aa257" },
  { baseColor: "#255e3f", tipColor: "#3f7e4c" },
];

/**
 * One leaf: its own texture variant, its own sway phase/speed (derived from
 * a stable per-leaf seed, not Math.random) so no two leaves ever move
 * identically, and a pivot at the base so it bends from the stem rather than
 * rotating around its own center.
 */
function Leaf({ position, rotationY, tilt, scale, windRef, velocityRef, paletteIndex, seed }) {
  const pivot = useRef();
  const mesh = useRef();

  const { shape, texture, phase, freq, sizeFactor } = useMemo(() => {
    const rng = createRng(seed);
    const shape = createLeafShape({
      length: 1,
      width: 0.4 + rng.next() * 0.14,
      asymmetry: (rng.next() - 0.5) * 0.35,
      tipSharpness: 0.82 + rng.next() * 0.16,
    });
    const palette = LEAF_PALETTES[paletteIndex % LEAF_PALETTES.length];
    const texture = createLeafTexture({ ...palette, seed: seed * 7 + 3 });
    const phase = rng.next() * Math.PI * 2;
    const freq = 0.35 + rng.next() * 0.5;
    const sizeFactor = 0.6 + rng.next() * 0.8; // bigger leaves sway less
    return { shape, texture, phase, freq, sizeFactor };
  }, [paletteIndex, seed]);

  useFrame((state) => {
    if (!pivot.current) return;
    const t = state.clock.elapsedTime;
    const wind = windRef.current; // 0..1+ ambient breeze strength
    const velocity = velocityRef.current; // scroll-driven kick

    const swayAmplitude = (0.05 + wind * 0.09) * (1 / sizeFactor) + velocity * 0.12;
    const sway = Math.sin(t * freq + phase) * swayAmplitude;
    const flutter = Math.sin(t * freq * 3.1 + phase * 1.7) * swayAmplitude * 0.25;

    pivot.current.rotation.z = tilt.z + sway;
    pivot.current.rotation.x = tilt.x + flutter * 0.6;
    pivot.current.rotation.y = rotationY + flutter * 0.3;
  });

  return (
    <group position={position} ref={pivot} rotation={[tilt.x, rotationY, tilt.z]}>
      <mesh ref={mesh} scale={scale} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <shapeGeometry args={[shape, 24]} />
        <meshPhysicalMaterial
          map={texture.map}
          roughnessMap={texture.roughnessMap}
          roughness={0.75}
          metalness={0}
          side={THREE.DoubleSide}
          transmission={0.18}
          thickness={0.15}
          ior={1.35}
          sheen={0.25}
          sheenColor={"#8fd18f"}
          clearcoat={0.05}
        />
      </mesh>
    </group>
  );
}

function Stem({ curve, radiusTop = 0.02, radiusBottom = 0.05 }) {
  const geometry = useMemo(() => {
    const tube = new THREE.TubeGeometry(curve, 24, 1, 8, false);
    // Taper the tube by scaling radii along its length
    const pos = tube.attributes.position;
    const segCount = 25;
    for (let i = 0; i < pos.count; i++) {
      const t = Math.floor(i / 8) / segCount;
      const r = THREE.MathUtils.lerp(radiusBottom, radiusTop, t);
      const cx = curve.getPoint(t);
      const vx = pos.getX(i) - cx.x;
      const vy = pos.getY(i) - cx.y;
      const vz = pos.getZ(i) - cx.z;
      const len = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
      pos.setXYZ(i, cx.x + (vx / len) * r, cx.y + (vy / len) * r, cx.z + (vz / len) * r);
    }
    tube.computeVertexNormals();
    return tube;
  }, [curve, radiusTop, radiusBottom]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#3f5a2f" roughness={0.85} metalness={0} />
    </mesh>
  );
}

function Soil({ potRadius, seed = 401 }) {
  const soilMap = useMemo(() => createSoilTexture({ seed: seed + 1 }), [seed]);

  const geometry = useMemo(() => {
    const rng = createRng(seed + 2);
    const geo = new THREE.CircleGeometry(potRadius * 0.94, 48);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const bump = Math.sin(x * 9) * Math.cos(y * 9) * 0.012 + (rng.next() - 0.5) * 0.006;
      pos.setZ(i, bump);
    }
    geo.computeVertexNormals();
    return geo;
  }, [potRadius, seed]);

  const crumbs = useMemo(() => {
    const rng = createRng(seed + 3);
    return new Array(26).fill(0).map(() => ({
      pos: [
        (rng.next() - 0.5) * potRadius * 1.6,
        0.01 + rng.next() * 0.02,
        (rng.next() - 0.5) * potRadius * 1.6,
      ],
      scale: 0.01 + rng.next() * 0.02,
      rot: rng.next() * Math.PI,
    }));
  }, [potRadius, seed]);

  return (
    <group>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial map={soilMap} roughness={1} metalness={0} />
      </mesh>
      {crumbs.map((c, i) => (
        <mesh key={i} position={c.pos} rotation={[0, c.rot, 0]} castShadow>
          <dodecahedronGeometry args={[c.scale, 0]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#5a4630" : "#3a2c1e"} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Pot({ radiusTop = 0.62, radiusBottom = 0.46, height = 0.7 }) {
  return (
    <mesh position={[0, -height / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radiusTop, radiusBottom, height, 32, 1, true]} />
      <meshStandardMaterial color="#8a4a32" roughness={0.65} metalness={0.02} side={THREE.DoubleSide} />
    </mesh>
  );
}

/**
 * Full plant: a handful of curved stems fanning from the soil, each carrying
 * several leaves at varied heights/angles, sitting in a terracotta pot.
 * `seed` controls the whole layout deterministically — same seed always
 * produces the same plant (pass a different seed prop if you want variety
 * across multiple plant instances on a page).
 */
export default function Plant({ windRef, velocityRef, seed = 20240521 }) {
  const potRadius = 0.62;

  const stems = useMemo(() => {
    const rng = createRng(seed);
    const stemCount = 4;
    return new Array(stemCount).fill(0).map((_, i) => {
      const baseAngle = (i / stemCount) * Math.PI * 2 + rng.next() * 0.6;
      const baseRadius = 0.05 + rng.next() * 0.12;
      const height = 1.5 + rng.next() * 0.9;
      const lean = (rng.next() - 0.5) * 0.5;

      const p0 = new THREE.Vector3(Math.cos(baseAngle) * baseRadius, 0, Math.sin(baseAngle) * baseRadius);
      const p1 = new THREE.Vector3(p0.x + lean * 0.15, height * 0.4, p0.z + lean * 0.1);
      const p2 = new THREE.Vector3(p0.x + lean * 0.45, height * 0.78, p0.z + lean * 0.32);
      const p3 = new THREE.Vector3(p0.x + lean * 0.7, height, p0.z + lean * 0.5);
      const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);

      const leafCount = 5 + Math.floor(rng.next() * 4);
      const leaves = new Array(leafCount).fill(0).map((_, li) => {
        const t = 0.35 + (li / leafCount) * 0.62 + rng.next() * 0.05;
        const point = curve.getPoint(Math.min(t, 0.98));
        const angle = baseAngle + li * 2.4 + rng.next() * 0.8;
        const droop = THREE.MathUtils.lerp(0.15, 0.55, li / leafCount);
        const s = THREE.MathUtils.lerp(0.85, 0.45, li / leafCount) * (0.85 + rng.next() * 0.3);
        return {
          position: [point.x, point.y, point.z],
          rotationY: angle,
          tilt: { x: droop + rng.next() * 0.15, z: (rng.next() - 0.5) * 0.3 },
          scale: [s, s, s],
          paletteIndex: (i + li) % LEAF_PALETTES.length,
          seed: seed + i * 97 + li * 13 + 11,
          key: `${i}-${li}`,
        };
      });

      return { curve, leaves, key: i };
    });
  }, [seed]);

  return (
    <group>
      <Pot radiusTop={potRadius} radiusBottom={potRadius * 0.74} height={0.7} />
      <group position={[0, -0.34, 0]}>
        <Soil potRadius={potRadius} seed={seed + 401} />
        {stems.map((stem) => (
          <group key={stem.key}>
            <Stem curve={stem.curve} />
            {stem.leaves.map((leaf) => (
              <Leaf key={leaf.key} {...leaf} windRef={windRef} velocityRef={velocityRef} />
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}