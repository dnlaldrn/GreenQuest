import * as THREE from "three";
import { createRng } from "./rng";

/**
 * Builds a natural, slightly asymmetric leaf silhouette as a THREE.Shape.
 * `asymmetry` and `serration` let every leaf instance look subtly different,
 * which is what sells "real plant" over "clip-art leaf".
 */
export function createLeafShape({ length = 1, width = 0.42, asymmetry = 0, tipSharpness = 0.9 } = {}) {
  const shape = new THREE.Shape();
  const hw = width / 2;

  shape.moveTo(0, 0);
  // Left edge (base to tip)
  shape.bezierCurveTo(
    -hw * (1.05 + asymmetry), length * 0.18,
    -hw * (0.55 + asymmetry * 0.6), length * 0.62,
    0, length * tipSharpness
  );
  // Right edge (tip back to base)
  shape.bezierCurveTo(
    hw * (0.55 - asymmetry * 0.6), length * 0.62,
    hw * (1.05 - asymmetry), length * 0.18,
    0, 0
  );

  return shape;
}

/**
 * Draws a leaf color/vein/imperfection map on a canvas at runtime.
 * Returns { map, roughnessMap } textures. Deterministic per `seed`, so it's
 * safe to call from a useMemo/render body (no Math.random inside).
 */
export function createLeafTexture({
  baseColor = "#2f6b3a",
  tipColor = "#4c8f52",
  veinColor = "rgba(20,50,25,0.55)",
  size = 512,
  seed = 1,
} = {}) {
  const rng = createRng(seed);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Base gradient — slightly lighter toward the tip, natural, not neon.
  const grad = ctx.createLinearGradient(0, size, 0, 0);
  grad.addColorStop(0, baseColor);
  grad.addColorStop(1, tipColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Soft mottling / chlorophyll variation
  for (let i = 0; i < 140; i++) {
    const x = rng.next() * size;
    const y = rng.next() * size;
    const r = 6 + rng.next() * 26;
    const shade = rng.bool() ? "rgba(255,255,255,0.03)" : "rgba(10,30,10,0.05)";
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Midrib
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = size * 0.012;
  ctx.beginPath();
  ctx.moveTo(size / 2, size * 0.02);
  ctx.lineTo(size / 2, size * 0.98);
  ctx.stroke();

  // Side veins, alternating, gently curved
  ctx.lineWidth = size * 0.005;
  const veinCount = 7;
  for (let i = 1; i <= veinCount; i++) {
    const t = i / (veinCount + 1);
    const y = size * (0.08 + t * 0.82);
    const spread = size * 0.34 * (1 - t * 0.55);
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(size / 2, y);
      ctx.quadraticCurveTo(
        size / 2 + dir * spread * 0.5,
        y - size * 0.03,
        size / 2 + dir * spread,
        y - size * 0.08
      );
      ctx.stroke();
    }
  }

  // Small imperfections — a nibble mark, a browning speck
  ctx.fillStyle = "rgba(120,90,40,0.35)";
  for (let i = 0; i < 3; i++) {
    if (rng.bool()) continue;
    const x = size * (0.2 + rng.next() * 0.6);
    const y = size * (0.1 + rng.next() * 0.7);
    ctx.beginPath();
    ctx.arc(x, y, 3 + rng.next() * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;

  // A rough grayscale variant reused as a roughness map so leaves aren't uniformly glossy.
  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rctx = roughCanvas.getContext("2d");
  rctx.fillStyle = "#8a8a8a";
  rctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 200; i++) {
    rctx.fillStyle = `rgba(${rng.bool() ? 255 : 0},${rng.bool() ? 255 : 0},${rng.bool() ? 255 : 0},0.04)`;
    rctx.beginPath();
    rctx.arc(rng.next() * size, rng.next() * size, 10 + rng.next() * 30, 0, Math.PI * 2);
    rctx.fill();
  }
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);

  return { map, roughnessMap };
}

/** Speckled dirt texture for the soil surface. Deterministic per `seed`. */
export function createSoilTexture({ size = 512, seed = 1 } = {}) {
  const rng = createRng(seed);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#2b2018";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 2200; i++) {
    const x = rng.next() * size;
    const y = rng.next() * size;
    const r = 0.6 + rng.next() * 2.4;
    const v = 20 + rng.next() * 45;
    ctx.fillStyle = `rgba(${v + 25},${v + 15},${v},${0.25 + rng.next() * 0.35})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // occasional lighter mineral fleck / bark chip
  for (let i = 0; i < 60; i++) {
    const x = rng.next() * size;
    const y = rng.next() * size;
    ctx.fillStyle = rng.bool() ? "rgba(150,120,90,0.5)" : "rgba(90,70,50,0.6)";
    ctx.fillRect(x, y, 1 + rng.next() * 3, 1 + rng.next() * 3);
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);
  return map;
}