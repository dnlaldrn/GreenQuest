/**
 * Deterministic pseudo-random in [0, 1), seeded by a number (e.g. an index).
 * Used instead of Math.random() for cosmetic per-instance variation (leaf
 * sway phase, particle scatter) so the value is stable and calling it during
 * render is pure — same seed always produces the same output.
 */
export function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}