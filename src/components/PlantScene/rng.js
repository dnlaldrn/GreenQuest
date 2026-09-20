// A tiny, fast, deterministic PRNG (mulberry32). Same seed -> same output,
// every time, regardless of how many times React calls the render function
// that uses it. This is what makes it safe to use inside component bodies
// and useMemo factories, unlike Math.random(), which is impure and can
// produce different results across renders/Strict Mode double-invokes.
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * createRng(seed) -> a small helper object with pure, deterministic
 * "random-ish" methods. Use a distinct, stable seed per thing you want to
 * vary (leaf index, particle index, etc.) rather than Math.random().
 */
export function createRng(seed = 1) {
  const next = mulberry32(seed);
  return {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    sign: () => (next() > 0.5 ? 1 : -1),
    bool: (p = 0.5) => next() < p,
  };
}