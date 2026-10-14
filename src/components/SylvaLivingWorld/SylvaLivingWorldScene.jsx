import { useEffect, useMemo, useRef, useState } from "react";
import innerGreenSource from "./inner-green-3d.html?raw";
import threeRuntime from "./three.min.js?raw";
const SYLVA_LIVING_WORLD_VARIANTS = ["living-green", "sakura-sunset", "maple-autumn", "sequoia-mist"];
const SCENE_ONLY_MARKUP = (label) => `<main class="hero" id="hero">
  <canvas id="scene" role="img" aria-label="${label}"></canvas>
  <div class="stage" id="stage" aria-hidden="true"></div>
</main>`;
const SCENE_ONLY_STYLE = `<style data-threeui-sylva-scene>
html,
body {
  width: 100% !important;
  height: 100% !important;
  min-height: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}

body {
  position: relative !important;
  background: #4a4d44 !important;
}

.hero {
  height: 100% !important;
  min-height: 0 !important;
}

#scene {
  pointer-events: auto !important;
}
</style>`;
const SAKURA_SUNSET_STYLE = `<style data-threeui-sylva-sakura-sunset>
html,
body {
  background: #3c2c36 !important;
}

/* The backdrop carries one pool of light and nothing else \u2014 the same way the
   authored world reads a near-flat field corner to corner. No sun, no bands:
   the boughs and the blossom are the subject, and everything that models them
   comes from the light they sit in. */
.hero {
  background:
    radial-gradient(66% 56% at 26% 90%, rgba(255, 226, 212, 0.125) 0%, rgba(255, 226, 212, 0) 74%),
    radial-gradient(74% 64% at 92% 2%, rgba(18, 10, 18, 0.30) 0%, rgba(18, 10, 18, 0) 72%),
    #3c2c36 !important;
}

/* the floor of light the boughs hang over */
.hero::after {
  background:
    radial-gradient(76% 48% at 44% 118%, rgba(255, 218, 208, 0.28) 0%, rgba(255, 208, 200, 0.095) 44%, rgba(255, 202, 196, 0) 86%),
    linear-gradient(180deg, rgba(255, 214, 206, 0) 56%, rgba(255, 210, 202, 0.030) 78%, rgba(255, 214, 206, 0.078) 100%) !important;
}
</style>`;
const MAPLE_AUTUMN_STYLE = `<style data-threeui-sylva-maple-autumn>
html,
body {
  background: #313a41 !important;
}

/* The same near-flat field the authored world uses, in the cold half of the
   year: a slate dusk with one pool of low light in it. Red leaf wants a cool
   ground behind it \u2014 on a warm field the whole frame goes to rust. */
.hero {
  background:
    radial-gradient(66% 56% at 26% 90%, rgba(255, 216, 176, 0.115) 0%, rgba(255, 216, 176, 0) 74%),
    radial-gradient(74% 64% at 92% 2%, rgba(10, 15, 20, 0.30) 0%, rgba(10, 15, 20, 0) 72%),
    #313a41 !important;
}

/* the floor of light the boughs hang over */
.hero::after {
  background:
    radial-gradient(76% 48% at 44% 118%, rgba(255, 206, 158, 0.24) 0%, rgba(255, 194, 150, 0.08) 44%, rgba(255, 188, 146, 0) 86%),
    linear-gradient(180deg, rgba(255, 206, 160, 0) 56%, rgba(255, 200, 156, 0.028) 78%, rgba(255, 206, 160, 0.070) 100%) !important;
}
</style>`;
const BOUGH_BUILDERS = `  /* Both tree variants grow the same world out of the authored root's own
     systems \u2014 swept limbs, bark, moss cushion, fur, ferns, scattered leaf or
     flower, wind, scan, pointer, butterfly \u2014 at the same close range. What
     changes between them is the leaf on the twigs, the palette they are lit
     in, and the field behind them; the wood underneath is one thing. */
  var BOUGH_SEGS   = [200, 44, 28, 18, 12];
  var BOUGH_RADIAL = [26, 16, 11, 8, 6];

  function boughLimb(pts, r0, r1, depth, flare) {
    var curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
    var segs = BOUGH_SEGS[depth] || 12, radial = BOUGH_RADIAL[depth] || 6;
    var taper = flare || 1.0;
    /* every limb draws its last few percent down to a point: tubes are open
       ended, and a twig that simply stops shows a hollow cap in the air */
    var rw = function (t) {
      var r = r1 + (r0 - r1) * Math.pow(1 - t, taper);
      return r * knot(t, 0.030, 0.013) * (1 - 0.92 * sstep(0.90, 1.0, t));
    };
    /* The cushion sits ON the bough rather than around it, and thins with the
       wood: moss packs deep in the old crotches where rain sits and is gone
       by the time a twig is pencil thin. */
    var moss = function (t) { return rw(t) * (0.50 - 0.28 * t) * (depth === 0 ? 1.0 : 0.58); };
    var L = {
      curve: curve, segs: segs, radial: radial,
      rw: rw, moss: moss,
      blade: function (t) { return moss(t) * 0.145 + 0.016; },
      sink: 0
    };
    L.fr = transportFrames(curve, segs);
    L.len = curve.getLength();
    L.vScale = Math.max(10, L.len * 7.0);
    /* blossom breaks from young wood \u2014 the flower pass reads this so a bough
       does not come out flowering along its bark like fungus */
    L.young = depth >= 1 ? 1 : 0;
    return L;
  }

  function growBranch(list, start, dir, len, r0, depth, maxDepth) {
    var side = new THREE.Vector3().crossVectors(dir, UP);
    if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
    side.normalize();
    var up = new THREE.Vector3().crossVectors(side, dir).normalize();
    /* Young cherry wood leaves the fork climbing and eases over as it thins,
       so the outer third of a spray hangs under its own blossom. */
    var lift = rand(0.12, 0.26) - depth * 0.05;
    var sway = rand(-0.30, 0.30);
    function node(f, u2, k) {
      return start.clone().addScaledVector(dir, len * f)
        .addScaledVector(up, len * u2).addScaledVector(side, len * k);
    }
    var L = boughLimb([
      start.clone(),
      node(0.34, lift * 0.46, sway * 0.34),
      node(0.69, lift * 0.98, sway * 0.82),
      node(1.00, lift * 0.72, sway)
    ], r0, r0 * 0.56, depth);
    list.push(L);
    if (depth >= maxDepth) return;

    var kids = depth <= 1 ? 3 : (rng() < 0.58 ? 3 : 2);
    for (var i = 0; i < kids; i++) {
      var tt = Math.min(0.99, 0.42 + (i / kids) * 0.58 + rand(-0.05, 0.05));
      var pt = L.curve.getPointAt(tt);
      var tan = L.curve.getTangentAt(tt).normalize();
      var ax = new THREE.Vector3().crossVectors(tan, UP);
      if (ax.lengthSq() < 1e-6) ax.set(1, 0, 0);
      ax.normalize().applyAxisAngle(tan, rng() * TAU);
      var kdir = tan.clone().applyAxisAngle(ax, rand(0.42, 1.00));
      /* every fork still reaches for the light, or a spray grows sideways
         into a bush instead of up into a branch */
      kdir.addScaledVector(UP, 0.16 - depth * 0.03).normalize();
      growBranch(list, pt, kdir, len * rand(0.56, 0.74),
                       r0 * 0.56 * rand(0.62, 0.84), depth + 1, maxDepth);
    }
  }

  /* Twigs are seated on the bough's own surface, the same way the authored
     build seats its stub offshoots \u2014 a spray that starts on the axis reads as
     a wire pushed through the branch once the cushion is on. */
  function sproutTwigs(list, host, count, len, r0, maxDepth) {
    var hp = new THREE.Vector3(), hn = new THREE.Vector3();
    for (var i = 0, guard = 0; i < count && guard < count * 40; guard++) {
      var t = clamp01(0.04 + 0.92 * ((i + rand(-0.45, 1.45)) / count));
      var th = rng() * TAU;
      limbSurface(host, t, th, hp, hn);
      if (hn.y < -0.32) continue;                   /* not off the underside */
      limbFrame(host, t);
      var dir = hn.clone().multiplyScalar(rand(0.75, 1.25))
        .addScaledVector(UP, rand(0.10, 0.52))
        .addScaledVector(_ft, rand(-0.95, 1.15)).normalize();
      hp.addScaledVector(hn, -host.rw(t) * 0.5);
      growBranch(list, hp.clone(), dir, len * rand(0.55, 1.42),
                       r0 * rand(0.68, 1.30), 1, maxDepth);
      i++;
    }
  }

  function buildBoughs() {
    var P = makeP(ARCH.aspect);
    var narrow = NARROW.matches;
    var limbs = [];
    /* the near bough: enters low left, crests at 40%, and runs out of frame
       on the right \u2014 the authored root's own path, read as cherry wood */
    var boughA = boughLimb(narrow ? [
      /* a tall frame wants the boughs raked across it, or the composition
         sits in a band with empty sky above and below */
      P(-0.26, 1.18, -0.42), P(0.00, 1.04, -0.16), P(0.26, 0.90, 0.08),
      P(0.52, 0.79, 0.20), P(0.78, 0.71, 0.10), P(1.12, 0.66, -0.30)
    ] : [
      P(-0.18, 1.05, -0.42), P(0.02, 0.99, -0.16), P(0.22, 0.92, 0.08),
      P(0.43, 0.88, 0.20), P(0.64, 0.87, 0.12), P(0.86, 0.90, -0.08),
      P(1.16, 0.96, -0.38)
    ], 0.42, 0.25, 0);
    /* the far bough: crosses the other way and sits back, so the two read as
       one tree seen from under it rather than as a pair of pipes */
    var boughB = boughLimb(narrow ? [
      P(-0.22, 0.74, -0.66), P(0.06, 0.60, -0.50), P(0.34, 0.46, -0.36),
      P(0.62, 0.33, -0.40), P(0.94, 0.22, -0.62)
    ] : [
      P(-0.16, 0.78, -0.66), P(0.10, 0.68, -0.50), P(0.36, 0.56, -0.36),
      P(0.62, 0.44, -0.40), P(0.86, 0.34, -0.54), P(1.14, 0.26, -0.76)
    ], 0.235, 0.13, 0);
    /* a limb climbing out of the top right corner, to close the frame */
    var boughC = boughLimb(narrow ? [
      P(1.08, 1.12, 0.16), P(0.94, 0.98, 0.24), P(0.82, 0.84, 0.20),
      P(0.74, 0.68, 0.06), P(0.70, 0.52, -0.14)
    ] : [
      P(0.30, 0.94, 0.16), P(0.37, 0.78, 0.24), P(0.47, 0.63, 0.20),
      P(0.60, 0.50, 0.06), P(0.76, 0.40, -0.14)
    ], 0.165, 0.078, 0);
    limbs.push(boughA, boughB, boughC);

    sproutTwigs(limbs, boughA, 15, 0.94, 0.070, 4);
    sproutTwigs(limbs, boughB, 10, 0.76, 0.050, 4);
    sproutTwigs(limbs, boughC, 8, 0.64, 0.039, 3);
    return limbs;
  }

  /* the far layer: a stand of small trees on the horizon, hazed back into the
     sky so the near boughs have depth behind them */
  function buildGrove() {
    var P = makeP(FAR.aspect);
    var limbs = [];
    var TREES = [[-0.04, 0.46, -0.5], [0.27, 0.60, 0.2], [0.56, 0.40, -0.3],
                 [0.82, 0.54, 0.1], [1.07, 0.44, -0.4]];
    for (var i = 0; i < TREES.length; i++) {
      var t = TREES[i], s = t[1];
      var base = P(t[0], 1.04 + (i % 2) * 0.03, t[2]);
      var top  = P(t[0] + (i - 2) * 0.008, 1.02 - 0.22 * s, t[2] + 0.1);
      var trunk = boughLimb([base, base.clone().lerp(top, 0.42),
                              base.clone().lerp(top, 0.76), top], 0.10 * s, 0.042 * s, 1);
      limbs.push(trunk);
      /* a stand reads as a stand only if no two crowns are the same width,
         and a crown reads as a crown only if its limbs leave the trunk at
         different heights \u2014 level spokes come out as a lollipop */
      var spread = 0.60 + (i % 3) * 0.17;
      for (var k = 0; k < 6; k++) {
        var a = (k / 6) * TAU + i * 0.7;
        var from = trunk.curve.getPointAt(0.72 + (k % 3) * 0.14);
        growBranch(limbs, from,
          new THREE.Vector3(Math.cos(a) * 0.82, 0.34 + (k % 2) * 0.40, Math.sin(a) * 0.46).normalize(),
          spread * 0.50 * s, 0.034 * s, 2, 3);
      }
    }
    return limbs;
  }`;
const MAPLE_OUTLINE = `  /* One palmate five-lobe silhouette, traced once and shared by the leaves on
     the twigs and the ones coming down: three lobes forward, two out to the
     sides, with a deep sinus cut between each pair. Half of it is authored and
     the other half is that half mirrored \u2014 a maple leaf is symmetric, and two
     hand-traced halves never quite are. */
  var MAPLE_HALF = [
    [0.00, -1.00], [0.21, -0.64], [0.52, -0.72], [0.45, -0.32],
    [0.84, -0.24], [0.50, 0.06], [0.70, 0.36], [0.31, 0.31],
    [0.15, 0.60], [0.05, 0.98]
  ];

  function mapleOutline(g, r) {
    var pts = [], i;
    for (i = 0; i < MAPLE_HALF.length; i++) pts.push([MAPLE_HALF[i][0] * r, MAPLE_HALF[i][1] * r]);
    for (i = MAPLE_HALF.length - 1; i >= 0; i--) pts.push([-MAPLE_HALF[i][0] * r, MAPLE_HALF[i][1] * r]);
    /* Drawn as a closed quadratic spline rather than as segments: straight
       lines between the lobe tips and the sinuses come out as a paper star at
       the size these are seen, and a maple lobe is a curve on both sides. */
    var n = pts.length;
    function mid(a, b) { return [(a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5]; }
    var m = mid(pts[n - 1], pts[0]);
    g.beginPath();
    g.moveTo(m[0], m[1]);
    for (i = 0; i < n; i++) {
      var cur = pts[i], nxt = pts[(i + 1) % n];
      m = mid(cur, nxt);
      g.quadraticCurveTo(cur[0], cur[1], m[0], m[1]);
    }
    g.closePath();
  }`;
const SAKURA_FALLING_SPRITE = `  /* one petal, for the fall through the frame and for the trail the pointer
     lifts off the cushion */
  function fallingSprite() {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d');
    g.translate(32, 32);
    var r = 27;
    var grad = g.createLinearGradient(0, -r, 0, r);
    grad.addColorStop(0, 'rgba(255, 248, 246, 0.98)');
    grad.addColorStop(0.55, 'rgba(255, 198, 212, 0.94)');
    grad.addColorStop(1, 'rgba(244, 146, 172, 0.74)');
    g.fillStyle = grad;
    /* narrow at the stem, broad at the shoulders, notched at the tip \u2014 the
       notch is the whole silhouette of a cherry petal */
    g.beginPath();
    g.moveTo(0, r);
    g.bezierCurveTo(-r * 0.70, r * 0.42, -r * 0.82, -r * 0.44, -r * 0.30, -r * 0.92);
    g.quadraticCurveTo(0, -r * 0.62, r * 0.30, -r * 0.92);
    g.bezierCurveTo(r * 0.82, -r * 0.44, r * 0.70, r * 0.42, 0, r);
    g.fill();
    var t = new THREE.CanvasTexture(c);
    t.minFilter = THREE.LinearFilter;
    if ('sRGBEncoding' in THREE) t.encoding = THREE.sRGBEncoding;
    return t;
  }`;
const MAPLE_FALLING_SPRITE = `  /* one maple leaf, for the fall through the frame and for the trail the
     pointer lifts off the cushion */
  function fallingSprite() {
    var c = document.createElement('canvas'); c.width = c.height = 96;
    var g = c.getContext('2d');
    g.translate(48, 50);
    var r = 42;
    var grad = g.createLinearGradient(0, -r, 0, r);
    grad.addColorStop(0, 'rgba(255, 206, 122, 0.98)');
    grad.addColorStop(0.48, 'rgba(226, 104, 52, 0.96)');
    grad.addColorStop(1, 'rgba(158, 46, 38, 0.88)');
    g.fillStyle = grad;
    mapleOutline(g, r);
    g.fill();
    var t = new THREE.CanvasTexture(c);
    t.minFilter = THREE.LinearFilter;
    if ('sRGBEncoding' in THREE) t.encoding = THREE.sRGBEncoding;
    return t;
  }`;
const SEQUOIA_MIST_STYLE = `<style data-threeui-sylva-sequoia-mist>
html,
body {
  background: #5f6d63 !important;
}

/* A redwood grove is read through its air, not against a night sky: the field
   is a pale drift of fog with the light coming down through it, and the same
   haze the scene mixes its distance into. Everything reads as a silhouette
   standing in front of the fog rather than a lit thing on a dark ground. */
.hero {
  background:
    radial-gradient(70% 60% at 34% 12%, rgba(226, 234, 220, 0.30) 0%, rgba(226, 234, 220, 0) 72%),
    radial-gradient(76% 66% at 88% 96%, rgba(30, 40, 32, 0.26) 0%, rgba(30, 40, 32, 0) 74%),
    #5f6d63 !important;
}

/* the shaft of light the boughs hang in */
.hero::after {
  background:
    radial-gradient(60% 74% at 40% -12%, rgba(238, 244, 230, 0.30) 0%, rgba(232, 240, 224, 0.09) 46%, rgba(228, 238, 220, 0) 84%),
    linear-gradient(180deg, rgba(226, 236, 218, 0.055) 0%, rgba(226, 236, 218, 0) 46%, rgba(24, 32, 26, 0.055) 100%) !important;
}
</style>`;
const SEQUOIA_FALLING_SPRITE = `  /* one shed sprig, for the drift through the frame and for the trail the
     pointer lifts off the cushion \u2014 the same ordered needle rank as the crown,
     at the size one sprig is actually read at */
  function fallingSprite() {
    var c = document.createElement('canvas'); c.width = c.height = 96;
    var g = c.getContext('2d');
    g.translate(48, 48);
    var grad = g.createLinearGradient(0, 36, 0, -36);
    grad.addColorStop(0, 'rgb(74, 96, 56)');
    grad.addColorStop(1, 'rgb(158, 182, 112)');
    g.strokeStyle = 'rgb(84, 78, 52)';
    g.lineCap = 'round';
    g.lineWidth = 2.4;
    g.beginPath(); g.moveTo(0, 34); g.lineTo(0, -30); g.stroke();
    for (var i = 0; i < 11; i++) {
      var f = i / 10, y = 32 - 60 * f;
      var taper = 1 - 0.7 * Math.max(0, (f - 0.74) / 0.26);
      var len = 26 * taper, wid = 2.8 * taper;
      for (var sgn = -1; sgn <= 1; sgn += 2) {
        g.save();
        g.translate(0, y);
        g.rotate(sgn * 0.86);
        g.beginPath();
        g.moveTo(-wid * 0.5, 0);
        g.quadraticCurveTo(-wid * 0.24, -len * 0.6, 0, -len);
        g.quadraticCurveTo(wid * 0.24, -len * 0.6, wid * 0.5, 0);
        g.closePath();
        g.fillStyle = grad;
        g.fill();
        g.restore();
      }
    }
    var t = new THREE.CanvasTexture(c);
    t.minFilter = THREE.LinearFilter;
    if ('sRGBEncoding' in THREE) t.encoding = THREE.sRGBEncoding;
    return t;
  }`;
const VARIANT_LABELS = {
  "living-green": "Interactive procedural moss root world",
  "sakura-sunset": "Interactive mossy Sakura boughs in blossom at dusk",
  "maple-autumn": "Interactive mossy Maple boughs in autumn leaf at dusk",
  "sequoia-mist": "Interactive mossy Sequoia boughs in foliage through grove fog"
};
const VARIANT_BACKGROUNDS = {
  "living-green": "#4a4d44",
  "sakura-sunset": "#3c2c36",
  "maple-autumn": "#313a41",
  "sequoia-mist": "#5f6d63"
};
const VARIANT_STYLES = {
  "sakura-sunset": SAKURA_SUNSET_STYLE,
  "maple-autumn": MAPLE_AUTUMN_STYLE,
  "sequoia-mist": SEQUOIA_MIST_STYLE
};
function replaceRequired(source, needle, replacement, label) {
  if (!source.includes(needle)) {
    throw new Error(`Sylva ${label} adapter no longer matches the canonical scene.`);
  }
  return source.replace(needle, replacement);
}
function applySakuraSunsetVariant(source) {
  const replacements = [
    [
      "  function build() {",
      `${BOUGH_BUILDERS}

${SAKURA_FALLING_SPRITE}

  function build() {`,
      "bough builders"
    ],
    ["var nearLimbs = buildNearRoot();", "var nearLimbs = buildBoughs();", "near bough composition"],
    ["assembleRoot(buildFarRoot(), {", "assembleRoot(buildGrove(), {", "far grove composition"],
    ["var BLADES_NEAR = small ? 70000 : 190000;", "var BLADES_NEAR = small ? 140000 : 260000;", "deep near cushion"],
    ["var BLADES_FAR  = small ? 20000 :  60000;", "var BLADES_FAR  = small ? 9000 :  22000;", "thin far cushion"],
    /* the recursive crown already forks every twig it needs */
    ["for (var i = 0; i < 14; i++) {", "for (var i = 0; i < 0; i++) {", "no stub offshoots"],
    /* ---- blossom ---- */
    [
      "        if (limbSurface(Lw, tt, tth, p, n) < 0.45 || p.x > plantMaxX) continue;",
      "        limbSurface(Lw, tt, tth, p, n);\n        if (p.x > plantMaxX) continue;",
      "blossom on every face of a twig"
    ],
    [
      "      var Lw = host[Math.floor(rng() * host.length)];",
      "      var Lw = host[Math.floor(rng() * host.length)];\n      /* blossom breaks from young wood; a flowering trunk reads as fungus */\n      if (!Lw.young && rng() < 0.93) continue;",
      "blossom on young wood"
    ],
    [
      "      for (var c2 = 0; c2 < 9 && k < opt.flowers; c2++) {",
      "      for (var c2 = 0; c2 < 5 && k < opt.flowers; c2++) {",
      "flowers spaced along one spray"
    ],
    [
      "        var tt = clamp01(t0 + rand(-0.008, 0.008));\n        var tth = th0 + rand(-0.24, 0.24);",
      "        var tt = clamp01(t0 + rand(-0.50, 0.50));\n        var tth = th0 + rand(-3.14, 3.14);",
      "blossom strung along the twig instead of balled at one point"
    ],
    ["p.addScaledVector(n, rand(0.02, 0.16));", "p.addScaledVector(n, rand(0.01, 0.07));", "blossom seated on thin wood"],
    [
      `    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d');
    var FLORETS = [
      [32, 22, 7.4], [22, 33, 6.0], [42, 33, 6.2], [27, 44, 5.0],
      [39, 45, 5.4], [32, 33, 4.4], [46, 22, 4.2], [18, 22, 4.0]
    ];
    for (var f = 0; f < FLORETS.length; f++) {
      var cx = FLORETS[f][0], cy = FLORETS[f][1], r = FLORETS[f][2];
      g.save(); g.translate(cx, cy); g.rotate(f * 1.31);
      for (var p = 0; p < 5; p++) {
        g.save(); g.rotate((p / 5) * TAU);
        g.fillStyle = 'rgba(255,255,251,' + (0.72 + 0.28 * (r / 7.4)) + ')';
        g.beginPath(); g.ellipse(0, -r * 0.55, r * 0.34, r * 0.55, 0, 0, TAU); g.fill();
        g.restore();
      }
      g.fillStyle = '#f0e7bd';
      g.beginPath(); g.arc(0, 0, r * 0.24, 0, TAU); g.fill();
      g.restore();
    }`,
      `    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d');
    /* One instance is a spray of open blossom, drawn at twice the original
       resolution because a cherry petal is read by the notch in its tip and
       at 64 px that notch is gone by the second mip. */
    var BLOOMS = [[64, 64, 56, 0.0]];
    function petal(r) {
      g.beginPath();
      g.moveTo(0, 0);
      g.bezierCurveTo(-r * 0.52, -r * 0.30, -r * 0.46, -r * 0.86, -r * 0.16, -r);
      g.quadraticCurveTo(0, -r * 0.78, r * 0.16, -r);
      g.bezierCurveTo(r * 0.46, -r * 0.86, r * 0.52, -r * 0.30, 0, 0);
      g.fill();
    }
    for (var f = 0; f < BLOOMS.length; f++) {
      var cx = BLOOMS[f][0], cy = BLOOMS[f][1], r = BLOOMS[f][2];
      g.save(); g.translate(cx, cy); g.rotate(BLOOMS[f][3]);
      /* deeper pink at the throat, near-white at the rim \u2014 the gradient is
         what keeps a five-petal sprite from reading as a paper cut-out */
      var grad = g.createRadialGradient(0, 0, r * 0.10, 0, 0, r);
      grad.addColorStop(0, 'rgba(250, 188, 202, 0.98)');
      grad.addColorStop(0.45, 'rgba(255, 220, 228, 0.96)');
      grad.addColorStop(1, 'rgba(255, 248, 250, 0.94)');
      g.fillStyle = grad;
      for (var p = 0; p < 5; p++) { g.save(); g.rotate((p / 5) * TAU); petal(r * 0.96); g.restore(); }
      g.fillStyle = 'rgba(232, 158, 176, 0.62)';
      g.beginPath(); g.arc(0, 0, r * 0.17, 0, TAU); g.fill();
      /* stamens: filaments out of the throat, each tipped with an anther \u2014
         at this range a plain dot in the middle reads as a printed sticker */
      g.strokeStyle = 'rgba(252, 206, 176, 0.80)';
      g.lineWidth = Math.max(1, r * 0.030);
      for (p = 0; p < 11; p++) {
        var sa = (p / 11) * TAU + f, sr = r * (0.30 + 0.16 * ((p % 3) / 2));
        g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(sa) * sr, Math.sin(sa) * sr); g.stroke();
        g.fillStyle = 'rgba(255, 226, 164, 0.96)';
        g.beginPath(); g.arc(Math.cos(sa) * sr, Math.sin(sa) * sr, r * 0.055, 0, TAU); g.fill();
      }
      g.restore();
    }`,
      "Sakura blossom sprite"
    ],
    [
      "        'attribute vec3 iPos;',\n        'attribute vec2 iRnd;',\n        'uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',\n        'void main(){',\n        '  vUv = uv;',",
      "        'attribute vec3 iPos;',\n        'attribute vec2 iRnd;',\n        'uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',\n        'varying float vRnd;',\n        'void main(){',\n        '  vUv = uv;',\n        '  vRnd = iRnd.y;',",
      "per-spray variation carried to the blossom"
    ],
    [
      "'uniform sampler2D uMap;',\n        'uniform float uAlpha; uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',",
      "'uniform sampler2D uMap;',\n        'uniform float uAlpha; uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',\n        'varying float vRnd;',",
      "per-spray variation read by the blossom"
    ],
    [
      "        '  vec4 t = texture2D(uMap, vUv);',\n        '  if (t.a < 0.14) discard;',",
      "        /* every instance turned the same way reads as printed wallpaper */\n        '  float fc = cos(vRnd * 6.2832), fs = sin(vRnd * 6.2832);',\n        '  vec2 fuv = vUv - 0.5;',\n        '  fuv = vec2(fuv.x * fc - fuv.y * fs, fuv.x * fs + fuv.y * fc) + 0.5;',\n        '  vec4 t = texture2D(uMap, fuv);',\n        '  if (t.a < 0.14) discard;',",
      "each blossom faces its own way"
    ],
    [
      "'  vec3 col = t.rgb * t.rgb * (uKeyCol * 0.62 + uAmbCol * 0.9);',",
      `/* Sprays differ: some open white in the light, some still deep pink in
           the shade of the crown. One tone for all of them is what makes a
           canopy read as cotton wool. */
        '  vec3 tone = mix(vec3(1.04, 0.86, 0.91), vec3(1.00, 1.00, 1.02), vRnd);',
        '  vec3 col = t.rgb * t.rgb * tone * (uKeyCol * 0.54 + uAmbCol * 1.10) * (0.66 + 0.56 * vRnd);',
        /* petals are thin enough to pass the low sun straight through */
        '  vec3 V = normalize(cameraPosition - vW);',
        '  col += uKeyCol * pow(max(dot(V, -uKeyDir), 0.0), 3.0) * 0.20 * t.a * (0.5 + 0.9 * vRnd);',`,
      "blossom lit through by the low sun"
    ],
    [
      "    return c * sstep(0.10, 0.50, patch);",
      "    return c * sstep(0.30, 0.72, patch);",
      "patchy cushion, bare bark between"
    ],
    /* ---- bark ---- */
    [
      "'  vec3 silver = mix(vec3(0.020, 0.019, 0.018), vec3(0.290, 0.283, 0.264), grain);',",
      "'  vec3 silver = mix(vec3(0.030, 0.023, 0.024), vec3(0.310, 0.266, 0.258), grain);',",
      "cherry bark greys"
    ],
    [
      "'  vec3 umber  = mix(vec3(0.024, 0.019, 0.016), vec3(0.175, 0.140, 0.110), grain);',",
      "'  vec3 umber  = mix(vec3(0.038, 0.022, 0.018), vec3(0.262, 0.158, 0.120), grain);',",
      "cherry bark reds"
    ],
    [
      "'  wood *= 1.0 - 0.70 * crack;',",
      `'  wood *= 1.0 - 0.70 * crack;',
        /* cherry is read by its lenticels: short dark dashes banding ACROSS
           the limb, where every other feature in this bark runs along it */
        '  float lent = smoothstep(0.58, 0.96, gfbm(vec2(uv.x * 2.4, uv.y * 24.0)) * 0.5 + 0.5);',
        '  wood *= 1.0 - 0.44 * lent;',`,
      "cherry lenticels"
    ],
    [
      "'  vec3 moss = mix(vec3(0.0204, 0.0311, 0.0050), vec3(0.0914, 0.1392, 0.0227), mo);',",
      "'  vec3 moss = mix(vec3(0.0340, 0.0282, 0.0112), vec3(0.1360, 0.1140, 0.0372), mo);',",
      "ochre cushion on the bark shell"
    ],
    ["'  col = mix(col, vec3(0.162, 0.176, 0.132), lich * 0.78);',", "'  col = mix(col, vec3(0.198, 0.176, 0.156), lich * 0.70);',", "lichen crust palette"],
    [
      `'  vec3 deep = vec3(0.0126, 0.0192, 0.0031);',
        '  vec3 mid  = vec3(0.0488, 0.0744, 0.0121);',
        '  vec3 tip  = vec3(0.1222, 0.1860, 0.0304);',
        '  vec3 tipHi = vec3(0.2600, 0.3900, 0.0640);',`,
      `'  vec3 deep = vec3(0.0300, 0.0248, 0.0100);',
        '  vec3 mid  = vec3(0.1150, 0.0960, 0.0320);',
        '  vec3 tip  = vec3(0.2520, 0.2160, 0.0680);',
        '  vec3 tipHi = vec3(0.5100, 0.4420, 0.1420);',`,
      "ochre moss in the fur"
    ],
    [
      "'  vec3 base = mix(vec3(0.0270, 0.0450, 0.0099), vec3(0.0690, 0.1150, 0.0253), vTint);',",
      "'  vec3 base = mix(vec3(0.0380, 0.0250, 0.0100), vec3(0.0980, 0.0640, 0.0220), vTint);',",
      "ochre fronds"
    ],
    [
      "      var Lf = host[Math.floor(rng() * host.length)];",
      "      /* fronds seat on the old boughs only: one on a twig reads as a\n         frond hanging in mid-air */\n      var Lf = host[Math.floor(rng() * Math.min(host.length, 3))];",
      "fronds on the boughs"
    ],
    /* ---- sunset light ---- */
    [
      "  var KEY  = new THREE.Vector3(-0.30, 0.92, 0.28).normalize();\n  var FILL = new THREE.Vector3( 0.12, -0.86, 0.50).normalize();",
      `  /* dusk after the sun has gone: a soft high key that still models the
     cushion, and a cool bounce off the air on the near side */
  var KEY  = new THREE.Vector3(-0.26, 0.90,  0.34).normalize();
  var FILL = new THREE.Vector3( 0.16, -0.82,  0.52).normalize();`,
      "soft dusk directions"
    ],
    ["uKeyCol:  { value: new THREE.Color(1.14, 1.06, 0.88) },", "uKeyCol:  { value: new THREE.Color(1.28, 1.03, 0.90) },", "sunset key light"],
    ["uFillCol: { value: new THREE.Color(0.78, 0.78, 0.62) },", "uFillCol: { value: new THREE.Color(0.74, 0.60, 0.70) },", "dusk sky fill"],
    ["uAmbCol:  { value: new THREE.Color(0.086, 0.090, 0.080) },", "uAmbCol:  { value: new THREE.Color(0.150, 0.112, 0.132) },", "dusk ambient"],
    ["uHazeCol: { value: new THREE.Color(0.176, 0.195, 0.145) },", "uHazeCol: { value: new THREE.Color(0.300, 0.216, 0.240) },", "sunset haze"],
    ["renderer.toneMappingExposure = 1.30;", "renderer.toneMappingExposure = 1.32;", "dusk exposure"],
    /* ---- density and framing ---- */
    [
      "aspect: ARCH.aspect, haze: 0.15, fog: 0.0, alpha: 1.0, order: 2,",
      "aspect: ARCH.aspect, haze: 0.17, fog: 0.0, alpha: 1.0, order: 2,",
      "near air"
    ],
    [
      "      blades: BLADES_NEAR, ferns: small ? 26 : 46, flowers: small ? 120 : 260,\n      fernSize: [0.22, 0.50], flowerSize: [0.055, 0.118], mainLimbs: mainCount, wire: true,",
      "      blades: BLADES_NEAR, ferns: small ? 14 : 26, flowers: small ? 4800 : 7800,\n      fernSize: [0.16, 0.36], flowerSize: [0.170, 0.300], mainLimbs: 0, wire: true,",
      "near tree in full blossom"
    ],
    [
      "aspect: FAR.aspect, haze: 0.16, fog: 0.26, alpha: 1.0, order: 0,",
      "aspect: FAR.aspect, haze: 0.26, fog: 0.82, alpha: 1.0, order: 0,",
      "far grove pushed into the air"
    ],
    ["hazeCol: [0.150, 0.164, 0.120], hazeLift: 0.92,", "hazeCol: [0.300, 0.220, 0.246], hazeLift: 0.94,", "far sunset haze"],
    [
      "      blades: BLADES_FAR, ferns: small ? 8 : 16, flowers: small ? 40 : 90,\n      fernSize: [0.26, 0.56], flowerSize: [0.034, 0.062],\n      mask: [0.4, 3.4, 0.0, 0.42], wire: true,",
      "      blades: BLADES_FAR, ferns: 0, flowers: small ? 3000 : 7000,\n      fernSize: [0.26, 0.56], flowerSize: [0.055, 0.105],\n      mask: [4.6, 5.6, -0.14, 0.20], wire: true,",
      "far grove in blossom"
    ],
    [
      `  var ARCH   = { w: 1900, left: -180, top: 306, aspect: 2800 / 1377 };
  var ARCH_N = { w: 1120, left: -290, top: 555, aspect: 2800 / 1377 };
  var FAR    = { w: 1150, left:  -40, top: 320, aspect: 1600 /  757, z: -260 };
  var FAR_N  = { w:  780, left: -110, top: 600, aspect: 1600 /  757, z: -260 };`,
      `  /* framed on the boughs at the authored close range: the frame is
     branch and blossom, with the grove sitting low behind it */
  var ARCH   = { w: 1500, left:   50, top:  262, aspect: 2800 / 1377 };
  var ARCH_N = { w: 1680, left:  -99, top:  500, aspect: 2800 / 1377 };
  var FAR    = { w: 1240, left:  180, top:  392, aspect: 1600 /  757, z: -260 };
  var FAR_N  = { w:  920, left:  280, top:  902, aspect: 1600 /  757, z: -260 };`,
      "framing boxes"
    ],
    ["place(nearGroup, A, 0.732, 0.06, 0);", "place(nearGroup, A, 0.500, 0.500, 0);", "tree framing"],
    ["place(farGroup,  F, 0.410, 0.32, F.z);", "place(farGroup,  F, 0.500, 0.500, F.z);", "grove framing"],
    /* ---- ambient ---- */
    [
      "map: radialTexture(256, [[0, 'rgba(12,16,10,0.62)'], [0.45, 'rgba(12,16,10,0.26)'], [1, 'rgba(12,16,10,0)']]),",
      "map: radialTexture(256, [[0, 'rgba(28,12,26,0.55)'], [0.45, 'rgba(28,12,26,0.22)'], [1, 'rgba(28,12,26,0)']]),",
      "dusk ground shadow"
    ],
    [
      "    shadowMesh.scale.set(aw * 1.02, ah * 0.72, 1);\n    shadowMesh.position.set(cx, cy - ah * 0.40, -70);",
      "    shadowMesh.scale.set(aw * 2.10, ah * 0.44, 1);\n    shadowMesh.position.set(cx, cy - ah * 0.98, -70);",
      "ground haze instead of a disc on the sky"
    ],
    [
      "    glowMesh.scale.set(aw * 1.15, ah * 1.5, 1);\n    glowMesh.position.set(cx - aw * 0.06, cy - ah * 0.18, -320);",
      "    /* the sky already carries the sun and its bloom; a second glow plane\n       in front of it only draws its own edge across the horizon */\n    glowMesh.visible = false;",
      "sun bloom left to the sky"
    ],
    [
      "'  lit += col * uAmbCol * pow(1.0 - max(dot(N, V), 0.0), 4.0) * 0.85;',",
      "'  lit += (col * uAmbCol * 0.85 + uKeyCol * 0.030) * pow(1.0 - max(dot(N, V), 0.0), 4.0);',",
      "sun rim along the bark"
    ],
    [
      "'  vec3 face = vec3(0.330, 0.560, 0.042);',\n        '  vec3 edge = vec3(0.062, 0.190, 0.014);',",
      "'  vec3 face = vec3(0.620, 0.330, 0.090);',\n        '  vec3 edge = vec3(0.150, 0.058, 0.030);',",
      "amber swallowtail"
    ],
    [
      "'  wing = mix(wing * vec3(0.46, 1.14, 0.30), wing * vec3(1.34, 1.06, 0.16), shim);',",
      "'  wing = mix(wing * vec3(1.18, 0.72, 0.34), wing * vec3(1.42, 0.98, 0.28), shim);',",
      "amber diffraction"
    ],
    [
      "'  lit += mix(vec3(0.86, 0.78, 0.20), vec3(0.34, 0.60, 0.12), border) * back * 0.42;',",
      "'  lit += mix(vec3(0.98, 0.66, 0.26), vec3(0.50, 0.22, 0.12), border) * back * 0.42;',",
      "sun through the wing"
    ],
    /* ---- petal fall: the pollen column becomes blossom coming down ---- */
    [
      "poleTex = radialTexture(64, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(236,244,224,0.5)'], [1, 'rgba(236,244,224,0)']]);",
      "poleTex = fallingSprite();",
      "petal sprite"
    ],
    [
      "var COUNT = (NARROW.matches || (window.innerWidth * window.innerHeight) < 620000) ? 1500 : 4200;",
      "var COUNT = (NARROW.matches || (window.innerWidth * window.innerHeight) < 620000) ? 220 : 520;",
      "petal count"
    ],
    [
      "      transparent: true, depthWrite: false, depthTest: true,\n      blending: THREE.AdditiveBlending,",
      "      transparent: true, depthWrite: false, depthTest: true,\n      blending: THREE.NormalBlending,",
      "petals blend as petals, not as sparks"
    ],
    [
      "        'attribute vec4 seed;',\n        'uniform float uTime, uSize, uScale;',\n        'varying float vFade;',",
      "        'attribute vec4 seed;',\n        'uniform float uTime, uSize, uScale;',\n        'varying float vFade;',\n        'varying float vSpin;',\n        'varying float vFlip;',",
      "petal spin and tumble varyings"
    ],
    [
      "'  p.x += sin(uTime * sp * 0.35 + ph) * 34.0 * am;',",
      `/* A petal does not fall, it flutters: one slow swing carries it across
           the frame and a second, faster one wobbles inside that swing. */
        '  p.x += sin(uTime * sp * 0.30 + ph) * 96.0 * am + sin(uTime * sp * 1.15 + ph * 2.7) * 26.0 * am;',
        '  p.z += sin(uTime * sp * 0.41 + ph * 1.9) * 44.0 * am;',`,
      "petal flutter"
    ],
    [
      "'  float climb = mod(uTime * 11.0 * sp + ph * 60.0, 1500.0) - 750.0;',",
      "'  float climb = 750.0 - mod(uTime * 15.0 * sp + ph * 90.0, 1500.0);',",
      "petals fall, and slowly"
    ],
    [
      "'  float twinkle = 0.55 + 0.45 * sin(uTime * (0.7 + sp * 1.6) + ph * 3.1);',",
      "'  vSpin = uTime * (0.34 + sp * 0.85) + ph * 2.4;',\n        '  vFlip = uTime * (0.55 + sp * 1.25) + ph * 3.7;',\n        '  float twinkle = 0.88 + 0.12 * sin(uTime * (0.7 + sp * 1.6) + ph * 3.1);',",
      "petal spin and tumble"
    ],
    [
      `        'uniform sampler2D uMap;',
        'varying float vFade;',
        'void main(){',
        '  vec4 t = texture2D(uMap, gl_PointCoord);',
        '  gl_FragColor = vec4(t.rgb, t.a * vFade * 0.52);',`,
      `        'uniform sampler2D uMap;',
        'varying float vFade;',
        'varying float vSpin;',
        'varying float vFlip;',
        'void main(){',
        /* A point sprite can only be turned in the fragment, so spin its
           lookup rather than the quad \u2014 and narrow the lookup as the petal
           turns edge-on, which is the whole of why a real one reads as a
           thin thing tumbling rather than a disc sliding down the frame. */
        '  float cs = cos(vSpin), sn = sin(vSpin);',
        '  vec2 uv = gl_PointCoord - 0.5;',
        '  uv = vec2(uv.x * cs - uv.y * sn, uv.x * sn + uv.y * cs);',
        '  uv.x /= max(0.24, abs(cos(vFlip)));',
        '  uv += 0.5;',
        '  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;',
        '  vec4 t = texture2D(uMap, uv);',
        '  gl_FragColor = vec4(t.rgb, t.a * vFade * 0.94);',`,
      "spinning petals"
    ],
    ["uSize: { value: 9 },", "uSize: { value: 46 },", "petal size"],
    ["motes.material.uniforms.uSize.value = Math.max(5, 9 * u);", "motes.material.uniforms.uSize.value = Math.max(24, 54 * u);", "petal size on resize"],
    /* ---- the entrance pulse ---- */
    [
      "'  vec3 col = mix(vec3(0.30, 0.72, 0.46), vec3(0.86, 1.00, 0.90), rim);',",
      "'  vec3 col = mix(vec3(0.92, 0.38, 0.46), vec3(1.00, 0.88, 0.66), rim);',",
      "scan-light palette"
    ]
  ];
  return replacements.reduce(
    (documentSource, [needle, replacement, label]) => replaceRequired(documentSource, needle, replacement, label),
    source
  );
}
function applySequoiaMistVariant(source) {
  const replacements = [
    [
      "  function build() {",
      `${BOUGH_BUILDERS}

${SEQUOIA_FALLING_SPRITE}

  function build() {`,
      "bough builders"
    ],
    ["var nearLimbs = buildNearRoot();", "var nearLimbs = buildBoughs();", "near bough composition"],
    ["assembleRoot(buildFarRoot(), {", "assembleRoot(buildGrove(), {", "far grove composition"],
    ["var BLADES_NEAR = small ? 70000 : 190000;", "var BLADES_NEAR = small ? 140000 : 260000;", "deep near cushion"],
    ["var BLADES_FAR  = small ? 20000 :  60000;", "var BLADES_FAR  = small ? 9000 :  22000;", "thin far cushion"],
    /* the recursive crown already forks every twig it needs */
    ["for (var i = 0; i < 14; i++) {", "for (var i = 0; i < 0; i++) {", "no stub offshoots"],
    /* ---- blossom ---- */
    [
      "        if (limbSurface(Lw, tt, tth, p, n) < 0.45 || p.x > plantMaxX) continue;",
      "        limbSurface(Lw, tt, tth, p, n);\n        if (p.x > plantMaxX) continue;",
      "foliage on every face of a twig"
    ],
    [
      "      var Lw = host[Math.floor(rng() * host.length)];",
      "      var Lw = host[Math.floor(rng() * host.length)];\n      /* foliage breaks from young wood; a leafing trunk reads as fungus */\n      if (!Lw.young && rng() < 0.93) continue;",
      "foliage on young wood"
    ],
    [
      "      for (var c2 = 0; c2 < 9 && k < opt.flowers; c2++) {",
      "      for (var c2 = 0; c2 < 7 && k < opt.flowers; c2++) {",
      "sprays packed along one twig"
    ],
    [
      "        var tt = clamp01(t0 + rand(-0.008, 0.008));\n        var tth = th0 + rand(-0.24, 0.24);",
      "        var tt = clamp01(t0 + rand(-0.50, 0.50));\n        var tth = th0 + rand(-3.14, 3.14);",
      "sprays strung along the twig instead of balled at one point"
    ],
    ["p.addScaledVector(n, rand(0.02, 0.16));", "p.addScaledVector(n, rand(0.01, 0.07));", "spray seated on thin wood"],
    [
      `    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d');
    var FLORETS = [
      [32, 22, 7.4], [22, 33, 6.0], [42, 33, 6.2], [27, 44, 5.0],
      [39, 45, 5.4], [32, 33, 4.4], [46, 22, 4.2], [18, 22, 4.0]
    ];
    for (var f = 0; f < FLORETS.length; f++) {
      var cx = FLORETS[f][0], cy = FLORETS[f][1], r = FLORETS[f][2];
      g.save(); g.translate(cx, cy); g.rotate(f * 1.31);
      for (var p = 0; p < 5; p++) {
        g.save(); g.rotate((p / 5) * TAU);
        g.fillStyle = 'rgba(255,255,251,' + (0.72 + 0.28 * (r / 7.4)) + ')';
        g.beginPath(); g.ellipse(0, -r * 0.55, r * 0.34, r * 0.55, 0, 0, TAU); g.fill();
        g.restore();
      }
      g.fillStyle = '#f0e7bd';
      g.beginPath(); g.arc(0, 0, r * 0.24, 0, TAU); g.fill();
      g.restore();
    }`,
      `    var c = document.createElement('canvas'); c.width = c.height = 192;
    var g = c.getContext('2d');
    /* One instance is one conifer spray, and a conifer spray is an ordered
       thing: needles of one length set at one angle at an even pitch up the
       twig, in two ranks \u2014 a shorter back rank and a full front rank \u2014 so the
       twig reads as round rather than as a flat comb. Drawn at 192 so a needle
       is still a tapered blade with a vein up it rather than a hairline by the
       second mip. */
    g.translate(96, 96);
    var reach = 84;

    function needle(x, y, len, wid, ang, fill, vein) {
      g.save();
      g.translate(x, y);
      g.rotate(ang);
      g.beginPath();
      g.moveTo(-wid * 0.5, 0);
      g.quadraticCurveTo(-wid * 0.24, -len * 0.60, 0, -len);
      g.quadraticCurveTo(wid * 0.24, -len * 0.60, wid * 0.5, 0);
      g.closePath();
      g.fillStyle = fill;
      g.fill();
      if (vein) {
        g.strokeStyle = vein;
        g.lineWidth = Math.max(0.6, wid * 0.16);
        g.beginPath();
        g.moveTo(0, -len * 0.10);
        g.lineTo(0, -len * 0.78);
        g.stroke();
      }
      g.restore();
    }

    var front = g.createLinearGradient(0, reach, 0, -reach);
    front.addColorStop(0, 'rgb(34, 58, 34)');
    front.addColorStop(0.55, 'rgb(58, 96, 52)');
    front.addColorStop(1, 'rgb(122, 158, 86)');
    var back = g.createLinearGradient(0, reach, 0, -reach);
    back.addColorStop(0, 'rgb(20, 36, 22)');
    back.addColorStop(1, 'rgb(46, 74, 42)');

    /* the twig itself, tapering into the leader */
    g.strokeStyle = 'rgb(62, 62, 42)';
    g.lineCap = 'round';
    g.lineWidth = 3.2;
    g.beginPath();
    g.moveTo(0, reach * 0.94);
    g.lineTo(0, -reach * 0.86);
    g.stroke();

    var N = 19, PITCH = reach * 1.72 / N;
    for (var rank = 0; rank < 2; rank++) {
      for (var i = 0; i < N; i++) {
        var f = i / (N - 1);
        var y = reach * 0.86 - PITCH * i;
        /* one length through the middle of the spray, drawn down only over the
           last fifth so the spray ends in a point instead of a cut edge */
        var taper = 1 - 0.74 * Math.max(0, (f - 0.78) / 0.22) * Math.max(0, (f - 0.78) / 0.22);
        var len = reach * (rank ? 0.33 : 0.50) * taper * (0.94 + 0.12 * ((i % 3) / 2));
        var wid = (rank ? 2.6 : 3.4) * taper;
        var ang = (rank ? 1.02 : 0.82) + (i % 2 ? 0.03 : -0.03);
        needle(0, y, len, wid, ang, rank ? back : front, rank ? null : 'rgba(178, 206, 140, 0.30)');
        needle(0, y, len, wid, -ang, rank ? back : front, rank ? null : 'rgba(178, 206, 140, 0.30)');
      }
    }`,
      "sequoia foliage spray"
    ],
    [
      "        'attribute vec3 iPos;',\n        'attribute vec2 iRnd;',\n        'uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',\n        'void main(){',\n        '  vUv = uv;',",
      "        'attribute vec3 iPos;',\n        'attribute vec2 iRnd;',\n        'uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',\n        'varying float vRnd;',\n        'void main(){',\n        '  vUv = uv;',\n        '  vRnd = iRnd.y;',",
      "per-spray variation carried to the foliage"
    ],
    [
      "'uniform sampler2D uMap;',\n        'uniform float uAlpha; uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',",
      "'uniform sampler2D uMap;',\n        'uniform float uAlpha; uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',\n        'varying float vRnd;',",
      "per-spray variation read by the foliage"
    ],
    [
      "        '  vec4 t = texture2D(uMap, vUv);',\n        '  if (t.a < 0.14) discard;',",
      "        /* every instance turned the same way reads as printed wallpaper */\n        '  float fc = cos(vRnd * 6.2832), fs = sin(vRnd * 6.2832);',\n        '  vec2 fuv = vUv - 0.5;',\n        '  fuv = vec2(fuv.x * fc - fuv.y * fs, fuv.x * fs + fuv.y * fc) + 0.5;',\n        '  vec4 t = texture2D(uMap, fuv);',\n        '  if (t.a < 0.14) discard;',",
      "each blossom faces its own way"
    ],
    [
      "'  vec3 col = t.rgb * t.rgb * (uKeyCol * 0.62 + uAmbCol * 0.9);',",
      `/* Sprays differ: the ones in the shaft are half sunlight, the ones behind
           them are almost black-green. One tone across a crown reads as felt. */
        '  vec3 tone = mix(vec3(0.68, 0.82, 0.60), vec3(1.06, 1.04, 0.84), vRnd);',
        '  vec3 col = t.rgb * t.rgb * tone * (uKeyCol * 0.62 + uAmbCol * 1.25) * (0.72 + 0.46 * vRnd);',
        /* a needle is thin enough to pass the fog light straight through */
        '  vec3 V = normalize(cameraPosition - vW);',
        '  col += uKeyCol * pow(max(dot(V, -uKeyDir), 0.0), 3.0) * 0.20 * t.a * (0.5 + 0.9 * vRnd);',`,
      "foliage lit through by the fog light"
    ],
    [
      "    return c * sstep(0.10, 0.50, patch);",
      "    return c * sstep(0.30, 0.72, patch);",
      "patchy cushion, bare bark between"
    ],
    /* ---- bark ---- */
    [
      "'  vec3 silver = mix(vec3(0.020, 0.019, 0.018), vec3(0.290, 0.283, 0.264), grain);',",
      "'  vec3 silver = mix(vec3(0.030, 0.020, 0.016), vec3(0.206, 0.130, 0.096), grain);',",
      "redwood bark greys"
    ],
    [
      "'  vec3 umber  = mix(vec3(0.024, 0.019, 0.016), vec3(0.175, 0.140, 0.110), grain);',",
      "'  vec3 umber  = mix(vec3(0.036, 0.016, 0.011), vec3(0.224, 0.092, 0.056), grain);',",
      "redwood bark cinnamon"
    ],
    [
      "    sproutTwigs(limbs, boughA, 15, 0.94, 0.070, 4);\n    sproutTwigs(limbs, boughB, 10, 0.76, 0.050, 4);\n    sproutTwigs(limbs, boughC, 8, 0.64, 0.039, 3);",
      "    sproutTwigs(limbs, boughA, 24, 0.66, 0.046, 5);\n    sproutTwigs(limbs, boughB, 16, 0.54, 0.034, 5);\n    sproutTwigs(limbs, boughC, 12, 0.46, 0.027, 4);",
      "finer wood: a redwood forks smaller and more often than a cherry"
    ],
    [
      "'vec2 barkDomain(vec2 uv){ return vec2(uv.x * 7.0, uv.y * 0.62); }',",
      "'vec2 barkDomain(vec2 uv){ return vec2(uv.x * 5.4, uv.y * 0.30); }',",
      "fibrous bark: the grain runs twice as long on a redwood"
    ],
    [
      "'  vec3 moss = mix(vec3(0.0204, 0.0311, 0.0050), vec3(0.0914, 0.1392, 0.0227), mo);',",
      "'  vec3 moss = mix(vec3(0.0176, 0.0290, 0.0128), vec3(0.0700, 0.1140, 0.0460), mo);',",
      "moss cushion on the bark shell"
    ],
    ["'  col = mix(col, vec3(0.162, 0.176, 0.132), lich * 0.78);',", "'  col = mix(col, vec3(0.198, 0.176, 0.156), lich * 0.70);',", "lichen crust palette"],
    [
      `'  vec3 deep = vec3(0.0126, 0.0192, 0.0031);',
        '  vec3 mid  = vec3(0.0488, 0.0744, 0.0121);',
        '  vec3 tip  = vec3(0.1222, 0.1860, 0.0304);',
        '  vec3 tipHi = vec3(0.2600, 0.3900, 0.0640);',`,
      `'  vec3 deep = vec3(0.0148, 0.0250, 0.0116);',
        '  vec3 mid  = vec3(0.0560, 0.0940, 0.0410);',
        '  vec3 tip  = vec3(0.1120, 0.1840, 0.0760);',
        '  vec3 tipHi = vec3(0.2380, 0.3760, 0.1460);',`,
      "forest moss in the fur"
    ],
    [
      "'  vec3 base = mix(vec3(0.0270, 0.0450, 0.0099), vec3(0.0690, 0.1150, 0.0253), vTint);',",
      "'  vec3 base = mix(vec3(0.0210, 0.0350, 0.0140), vec3(0.0560, 0.0930, 0.0330), vTint);',",
      "forest fronds"
    ],
    [
      "      var Lf = host[Math.floor(rng() * host.length)];",
      "      /* fronds seat on the old boughs only: one on a twig reads as a\n         frond hanging in mid-air */\n      var Lf = host[Math.floor(rng() * Math.min(host.length, 3))];",
      "fronds on the boughs"
    ],
    /* ---- sunset light ---- */
    [
      "  var KEY  = new THREE.Vector3(-0.30, 0.92, 0.28).normalize();\n  var FILL = new THREE.Vector3( 0.12, -0.86, 0.50).normalize();",
      `  /* dusk after the sun has gone: a soft high key that still models the
     cushion, and a cool bounce off the air on the near side */
  var KEY  = new THREE.Vector3(-0.26, 0.90,  0.34).normalize();
  var FILL = new THREE.Vector3( 0.16, -0.82,  0.52).normalize();`,
      "soft dusk directions"
    ],
    ["uKeyCol:  { value: new THREE.Color(1.14, 1.06, 0.88) },", "uKeyCol:  { value: new THREE.Color(1.12, 1.16, 1.06) },", "sunset key light"],
    ["uFillCol: { value: new THREE.Color(0.78, 0.78, 0.62) },", "uFillCol: { value: new THREE.Color(0.62, 0.70, 0.64) },", "dusk sky fill"],
    ["uAmbCol:  { value: new THREE.Color(0.086, 0.090, 0.080) },", "uAmbCol:  { value: new THREE.Color(0.196, 0.222, 0.196) },", "dusk ambient"],
    ["uHazeCol: { value: new THREE.Color(0.176, 0.195, 0.145) },", "uHazeCol: { value: new THREE.Color(0.520, 0.570, 0.508) },", "sunset haze"],
    ["renderer.toneMappingExposure = 1.30;", "renderer.toneMappingExposure = 1.32;", "dusk exposure"],
    /* ---- density and framing ---- */
    [
      "aspect: ARCH.aspect, haze: 0.15, fog: 0.0, alpha: 1.0, order: 2,",
      "aspect: ARCH.aspect, haze: 0.17, fog: 0.0, alpha: 1.0, order: 2,",
      "near air"
    ],
    [
      "      blades: BLADES_NEAR, ferns: small ? 26 : 46, flowers: small ? 120 : 260,\n      fernSize: [0.22, 0.50], flowerSize: [0.055, 0.118], mainLimbs: mainCount, wire: true,",
      "      blades: BLADES_NEAR, ferns: small ? 14 : 26, flowers: small ? 2800 : 5200,\n      fernSize: [0.16, 0.36], flowerSize: [0.300, 0.520], mainLimbs: 0, wire: true,",
      "near boughs in full foliage"
    ],
    [
      "aspect: FAR.aspect, haze: 0.16, fog: 0.26, alpha: 1.0, order: 0,",
      "aspect: FAR.aspect, haze: 0.30, fog: 0.90, alpha: 1.0, order: 0,",
      "far grove pushed into the air"
    ],
    ["hazeCol: [0.150, 0.164, 0.120], hazeLift: 0.92,", "hazeCol: [0.545, 0.596, 0.532], hazeLift: 0.98,", "far sunset haze"],
    [
      "      blades: BLADES_FAR, ferns: small ? 8 : 16, flowers: small ? 40 : 90,\n      fernSize: [0.26, 0.56], flowerSize: [0.034, 0.062],\n      mask: [0.4, 3.4, 0.0, 0.42], wire: true,",
      "      blades: BLADES_FAR, ferns: 0, flowers: small ? 2000 : 4400,\n      fernSize: [0.26, 0.56], flowerSize: [0.130, 0.240],\n      mask: [4.6, 5.6, -0.14, 0.20], wire: true,",
      "far grove in foliage"
    ],
    [
      `  var ARCH   = { w: 1900, left: -180, top: 306, aspect: 2800 / 1377 };
  var ARCH_N = { w: 1120, left: -290, top: 555, aspect: 2800 / 1377 };
  var FAR    = { w: 1150, left:  -40, top: 320, aspect: 1600 /  757, z: -260 };
  var FAR_N  = { w:  780, left: -110, top: 600, aspect: 1600 /  757, z: -260 };`,
      `  /* framed on the boughs at the authored close range: the frame is
     branch and blossom, with the grove sitting low behind it */
  var ARCH   = { w: 1500, left:   50, top:  262, aspect: 2800 / 1377 };
  var ARCH_N = { w: 1680, left:  -99, top:  500, aspect: 2800 / 1377 };
  var FAR    = { w: 1240, left:  180, top:  392, aspect: 1600 /  757, z: -260 };
  var FAR_N  = { w:  920, left:  280, top:  902, aspect: 1600 /  757, z: -260 };`,
      "framing boxes"
    ],
    ["place(nearGroup, A, 0.732, 0.06, 0);", "place(nearGroup, A, 0.500, 0.500, 0);", "tree framing"],
    ["place(farGroup,  F, 0.410, 0.32, F.z);", "place(farGroup,  F, 0.500, 0.500, F.z);", "grove framing"],
    /* ---- ambient ---- */
    [
      "map: radialTexture(256, [[0, 'rgba(12,16,10,0.62)'], [0.45, 'rgba(12,16,10,0.26)'], [1, 'rgba(12,16,10,0)']]),",
      "map: radialTexture(256, [[0, 'rgba(26,34,28,0.42)'], [0.45, 'rgba(26,34,28,0.17)'], [1, 'rgba(26,34,28,0)']]),",
      "dusk ground shadow"
    ],
    [
      "    shadowMesh.scale.set(aw * 1.02, ah * 0.72, 1);\n    shadowMesh.position.set(cx, cy - ah * 0.40, -70);",
      "    shadowMesh.scale.set(aw * 2.10, ah * 0.44, 1);\n    shadowMesh.position.set(cx, cy - ah * 0.98, -70);",
      "ground haze instead of a disc on the sky"
    ],
    [
      "    glowMesh.scale.set(aw * 1.15, ah * 1.5, 1);\n    glowMesh.position.set(cx - aw * 0.06, cy - ah * 0.18, -320);",
      "    /* the sky already carries the sun and its bloom; a second glow plane\n       in front of it only draws its own edge across the horizon */\n    glowMesh.visible = false;",
      "sun bloom left to the sky"
    ],
    [
      "'  lit += col * uAmbCol * pow(1.0 - max(dot(N, V), 0.0), 4.0) * 0.85;',",
      "'  lit += (col * uAmbCol * 0.85 + uKeyCol * 0.030) * pow(1.0 - max(dot(N, V), 0.0), 4.0);',",
      "sun rim along the bark"
    ],
    [
      "'  vec3 face = vec3(0.330, 0.560, 0.042);',\n        '  vec3 edge = vec3(0.062, 0.190, 0.014);',",
      "'  vec3 face = vec3(0.620, 0.330, 0.090);',\n        '  vec3 edge = vec3(0.150, 0.058, 0.030);',",
      "amber swallowtail"
    ],
    [
      "'  wing = mix(wing * vec3(0.46, 1.14, 0.30), wing * vec3(1.34, 1.06, 0.16), shim);',",
      "'  wing = mix(wing * vec3(1.18, 0.72, 0.34), wing * vec3(1.42, 0.98, 0.28), shim);',",
      "amber diffraction"
    ],
    [
      "'  lit += mix(vec3(0.86, 0.78, 0.20), vec3(0.34, 0.60, 0.12), border) * back * 0.42;',",
      "'  lit += mix(vec3(0.98, 0.66, 0.26), vec3(0.50, 0.22, 0.12), border) * back * 0.42;',",
      "sun through the wing"
    ],
    /* ---- petal fall: the pollen column becomes blossom coming down ---- */
    [
      "poleTex = radialTexture(64, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(236,244,224,0.5)'], [1, 'rgba(236,244,224,0)']]);",
      "poleTex = fallingSprite();",
      "sprig sprite"
    ],
    [
      "var COUNT = (NARROW.matches || (window.innerWidth * window.innerHeight) < 620000) ? 1500 : 4200;",
      "var COUNT = (NARROW.matches || (window.innerWidth * window.innerHeight) < 620000) ? 180 : 420;",
      "sprig count"
    ],
    [
      "      transparent: true, depthWrite: false, depthTest: true,\n      blending: THREE.AdditiveBlending,",
      "      transparent: true, depthWrite: false, depthTest: true,\n      blending: THREE.NormalBlending,",
      "sprigs blend as foliage, not as sparks"
    ],
    [
      "        'attribute vec4 seed;',\n        'uniform float uTime, uSize, uScale;',\n        'varying float vFade;',",
      "        'attribute vec4 seed;',\n        'uniform float uTime, uSize, uScale;',\n        'varying float vFade;',\n        'varying float vSpin;',\n        'varying float vFlip;',",
      "sprig spin and tumble varyings"
    ],
    [
      "'  p.x += sin(uTime * sp * 0.35 + ph) * 34.0 * am;',",
      `/* A petal does not fall, it flutters: one slow swing carries it across
           the frame and a second, faster one wobbles inside that swing. */
        '  p.x += sin(uTime * sp * 0.30 + ph) * 96.0 * am + sin(uTime * sp * 1.15 + ph * 2.7) * 26.0 * am;',
        '  p.z += sin(uTime * sp * 0.41 + ph * 1.9) * 44.0 * am;',`,
      "sprig flutter"
    ],
    [
      "'  float climb = mod(uTime * 11.0 * sp + ph * 60.0, 1500.0) - 750.0;',",
      "'  float climb = 750.0 - mod(uTime * 13.0 * sp + ph * 90.0, 1500.0);',",
      "sprigs fall, and slowly"
    ],
    [
      "'  float twinkle = 0.55 + 0.45 * sin(uTime * (0.7 + sp * 1.6) + ph * 3.1);',",
      "'  vSpin = uTime * (0.34 + sp * 0.85) + ph * 2.4;',\n        '  vFlip = uTime * (0.55 + sp * 1.25) + ph * 3.7;',\n        '  float twinkle = 0.88 + 0.12 * sin(uTime * (0.7 + sp * 1.6) + ph * 3.1);',",
      "sprig spin and tumble"
    ],
    [
      `        'uniform sampler2D uMap;',
        'varying float vFade;',
        'void main(){',
        '  vec4 t = texture2D(uMap, gl_PointCoord);',
        '  gl_FragColor = vec4(t.rgb, t.a * vFade * 0.52);',`,
      `        'uniform sampler2D uMap;',
        'varying float vFade;',
        'varying float vSpin;',
        'varying float vFlip;',
        'void main(){',
        /* A point sprite can only be turned in the fragment, so spin its
           lookup rather than the quad \u2014 and narrow the lookup as the petal
           turns edge-on, which is the whole of why a real one reads as a
           thin thing tumbling rather than a disc sliding down the frame. */
        '  float cs = cos(vSpin), sn = sin(vSpin);',
        '  vec2 uv = gl_PointCoord - 0.5;',
        '  uv = vec2(uv.x * cs - uv.y * sn, uv.x * sn + uv.y * cs);',
        '  uv.x /= max(0.24, abs(cos(vFlip)));',
        '  uv += 0.5;',
        '  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;',
        '  vec4 t = texture2D(uMap, uv);',
        '  gl_FragColor = vec4(t.rgb, t.a * vFade * 0.94);',`,
      "tumbling sprigs"
    ],
    ["uSize: { value: 9 },", "uSize: { value: 30 },", "sprig size"],
    ["motes.material.uniforms.uSize.value = Math.max(5, 9 * u);", "motes.material.uniforms.uSize.value = Math.max(16, 36 * u);", "sprig size on resize"],
    /* ---- the entrance pulse ---- */
    [
      "'  vec3 col = mix(vec3(0.30, 0.72, 0.46), vec3(0.86, 1.00, 0.90), rim);',",
      "'  vec3 col = mix(vec3(0.44, 0.72, 0.42), vec3(0.92, 1.00, 0.88), rim);',",
      "scan-light palette"
    ]
  ];
  return replacements.reduce(
    (documentSource, [needle, replacement, label]) => replaceRequired(documentSource, needle, replacement, label),
    source
  );
}
function applyMapleAutumnVariant(source) {
  const replacements = [
    [
      "  function build() {",
      `${BOUGH_BUILDERS}

${MAPLE_OUTLINE}

${MAPLE_FALLING_SPRITE}

  function build() {`,
      "bough builders"
    ],
    ["var nearLimbs = buildNearRoot();", "var nearLimbs = buildBoughs();", "near bough composition"],
    ["assembleRoot(buildFarRoot(), {", "assembleRoot(buildGrove(), {", "far grove composition"],
    ["var BLADES_NEAR = small ? 70000 : 190000;", "var BLADES_NEAR = small ? 140000 : 260000;", "deep near cushion"],
    ["var BLADES_FAR  = small ? 20000 :  60000;", "var BLADES_FAR  = small ? 9000 :  22000;", "thin far cushion"],
    /* the recursive crown already forks every twig it needs */
    ["for (var i = 0; i < 14; i++) {", "for (var i = 0; i < 0; i++) {", "no stub offshoots"],
    /* ---- blossom ---- */
    [
      "        if (limbSurface(Lw, tt, tth, p, n) < 0.45 || p.x > plantMaxX) continue;",
      "        limbSurface(Lw, tt, tth, p, n);\n        if (p.x > plantMaxX) continue;",
      "leaf on every face of a twig"
    ],
    [
      "      var Lw = host[Math.floor(rng() * host.length)];",
      "      var Lw = host[Math.floor(rng() * host.length)];\n      /* leaf breaks from young wood; a leafing trunk reads as fungus */\n      if (!Lw.young && rng() < 0.93) continue;",
      "leaf on young wood"
    ],
    [
      "      for (var c2 = 0; c2 < 9 && k < opt.flowers; c2++) {",
      "      for (var c2 = 0; c2 < 4 && k < opt.flowers; c2++) {",
      "leaves spaced along one spray"
    ],
    [
      "        var tt = clamp01(t0 + rand(-0.008, 0.008));\n        var tth = th0 + rand(-0.24, 0.24);",
      "        var tt = clamp01(t0 + rand(-0.50, 0.50));\n        var tth = th0 + rand(-3.14, 3.14);",
      "leaves strung along the twig instead of balled at one point"
    ],
    ["p.addScaledVector(n, rand(0.02, 0.16));", "p.addScaledVector(n, rand(0.02, 0.12));", "leaf seated on thin wood"],
    [
      `    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d');
    var FLORETS = [
      [32, 22, 7.4], [22, 33, 6.0], [42, 33, 6.2], [27, 44, 5.0],
      [39, 45, 5.4], [32, 33, 4.4], [46, 22, 4.2], [18, 22, 4.0]
    ];
    for (var f = 0; f < FLORETS.length; f++) {
      var cx = FLORETS[f][0], cy = FLORETS[f][1], r = FLORETS[f][2];
      g.save(); g.translate(cx, cy); g.rotate(f * 1.31);
      for (var p = 0; p < 5; p++) {
        g.save(); g.rotate((p / 5) * TAU);
        g.fillStyle = 'rgba(255,255,251,' + (0.72 + 0.28 * (r / 7.4)) + ')';
        g.beginPath(); g.ellipse(0, -r * 0.55, r * 0.34, r * 0.55, 0, 0, TAU); g.fill();
        g.restore();
      }
      g.fillStyle = '#f0e7bd';
      g.beginPath(); g.arc(0, 0, r * 0.24, 0, TAU); g.fill();
      g.restore();
    }`,
      `    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d');
    /* One instance is one maple leaf. The gradient runs from a hot rim to a
       darker heart rather than the other way round: a leaf is thinnest at its
       lobe tips, so that is where the low light comes through it. */
    g.translate(64, 66);
    var r = 58;
    var grad = g.createRadialGradient(0, r * 0.22, r * 0.06, 0, 0, r);
    grad.addColorStop(0, 'rgba(192, 76, 48, 0.98)');
    grad.addColorStop(0.42, 'rgba(222, 112, 56, 0.97)');
    grad.addColorStop(0.78, 'rgba(238, 158, 80, 0.96)');
    grad.addColorStop(1, 'rgba(248, 206, 130, 0.94)');
    g.fillStyle = grad;
    mapleOutline(g, r);
    g.fill();
    /* the veins: one up each lobe out of the petiole, thinning as they go */
    g.strokeStyle = 'rgba(255, 214, 150, 0.34)';
    g.lineCap = 'round';
    var VEINS = [[0, -1.00], [0.44, -0.72], [-0.44, -0.72], [0.78, -0.24], [-0.78, -0.24]];
    for (var v = 0; v < VEINS.length; v++) {
      g.lineWidth = Math.max(1, r * (v === 0 ? 0.030 : 0.022));
      g.beginPath();
      g.moveTo(0, r * 0.52);
      g.quadraticCurveTo(VEINS[v][0] * r * 0.30, VEINS[v][1] * r * 0.10,
                         VEINS[v][0] * r * 0.86, VEINS[v][1] * r * 0.86);
      g.stroke();
    }
    /* the petiole, so a leaf never reads as a cut-out shape floating free */
    g.strokeStyle = 'rgba(176, 96, 52, 0.72)';
    g.lineWidth = Math.max(1, r * 0.036);
    g.beginPath(); g.moveTo(0, r * 0.52); g.lineTo(0, r * 1.02); g.stroke();`,
      "maple leaf sprite"
    ],
    [
      "        'attribute vec3 iPos;',\n        'attribute vec2 iRnd;',\n        'uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',\n        'void main(){',\n        '  vUv = uv;',",
      "        'attribute vec3 iPos;',\n        'attribute vec2 iRnd;',\n        'uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',\n        'varying float vRnd;',\n        'void main(){',\n        '  vUv = uv;',\n        '  vRnd = iRnd.y;',",
      "per-leaf variation carried to the leaf"
    ],
    [
      "'uniform sampler2D uMap;',\n        'uniform float uAlpha; uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',",
      "'uniform sampler2D uMap;',\n        'uniform float uAlpha; uniform float uBoxH;',\n        'varying vec2 vUv; varying float vH; varying vec3 vL; varying vec3 vW;',\n        'varying float vRnd;',",
      "per-leaf variation read by the leaf"
    ],
    [
      "        '  vec4 t = texture2D(uMap, vUv);',\n        '  if (t.a < 0.14) discard;',",
      "        /* every instance turned the same way reads as printed wallpaper */\n        '  float fc = cos(vRnd * 6.2832), fs = sin(vRnd * 6.2832);',\n        '  vec2 fuv = vUv - 0.5;',\n        '  fuv = vec2(fuv.x * fc - fuv.y * fs, fuv.x * fs + fuv.y * fc) + 0.5;',\n        '  vec4 t = texture2D(uMap, fuv);',\n        '  if (t.a < 0.14) discard;',",
      "each blossom faces its own way"
    ],
    [
      "'  vec3 col = t.rgb * t.rgb * (uKeyCol * 0.62 + uAmbCol * 0.9);',",
      `/* No two leaves turn at the same time: some are still hot red, some
           already gone to gold. One tone across a crown reads as plastic. */
        '  vec3 tone = mix(vec3(0.78, 0.30, 0.22), vec3(1.16, 1.02, 0.58), pow(vRnd, 0.62));',
        '  vec3 col = t.rgb * t.rgb * tone * (uKeyCol * 0.60 + uAmbCol * 1.05) * (0.70 + 0.50 * vRnd);',
        /* a leaf is thin enough to pass the low light straight through */
        '  vec3 V = normalize(cameraPosition - vW);',
        '  col += uKeyCol * pow(max(dot(V, -uKeyDir), 0.0), 3.0) * 0.20 * t.a * (0.5 + 0.9 * vRnd);',`,
      "leaf lit through from behind"
    ],
    [
      "    return c * sstep(0.10, 0.50, patch);",
      "    return c * sstep(0.30, 0.72, patch);",
      "patchy cushion, bare bark between"
    ],
    /* ---- bark ---- */
    [
      "'  vec3 silver = mix(vec3(0.020, 0.019, 0.018), vec3(0.290, 0.283, 0.264), grain);',",
      "'  vec3 silver = mix(vec3(0.028, 0.026, 0.024), vec3(0.296, 0.278, 0.256), grain);',",
      "maple bark greys"
    ],
    [
      "'  vec3 umber  = mix(vec3(0.024, 0.019, 0.016), vec3(0.175, 0.140, 0.110), grain);',",
      "'  vec3 umber  = mix(vec3(0.034, 0.026, 0.020), vec3(0.236, 0.176, 0.126), grain);',",
      "maple bark browns"
    ],
    [
      "'  vec3 moss = mix(vec3(0.0204, 0.0311, 0.0050), vec3(0.0914, 0.1392, 0.0227), mo);',",
      "'  vec3 moss = mix(vec3(0.0268, 0.0306, 0.0120), vec3(0.1080, 0.1240, 0.0398), mo);',",
      "moss cushion on the bark shell"
    ],
    ["'  col = mix(col, vec3(0.162, 0.176, 0.132), lich * 0.78);',", "'  col = mix(col, vec3(0.198, 0.176, 0.156), lich * 0.70);',", "lichen crust palette"],
    [
      `'  vec3 deep = vec3(0.0126, 0.0192, 0.0031);',
        '  vec3 mid  = vec3(0.0488, 0.0744, 0.0121);',
        '  vec3 tip  = vec3(0.1222, 0.1860, 0.0304);',
        '  vec3 tipHi = vec3(0.2600, 0.3900, 0.0640);',`,
      `'  vec3 deep = vec3(0.0230, 0.0268, 0.0104);',
        '  vec3 mid  = vec3(0.0900, 0.1040, 0.0330);',
        '  vec3 tip  = vec3(0.1800, 0.2060, 0.0640);',
        '  vec3 tipHi = vec3(0.3600, 0.4160, 0.1120);',`,
      "green-gold moss in the fur"
    ],
    [
      "'  vec3 base = mix(vec3(0.0270, 0.0450, 0.0099), vec3(0.0690, 0.1150, 0.0253), vTint);',",
      "'  vec3 base = mix(vec3(0.0300, 0.0330, 0.0128), vec3(0.0780, 0.0880, 0.0290), vTint);',",
      "green-gold fronds"
    ],
    [
      "      var Lf = host[Math.floor(rng() * host.length)];",
      "      /* fronds seat on the old boughs only: one on a twig reads as a\n         frond hanging in mid-air */\n      var Lf = host[Math.floor(rng() * Math.min(host.length, 3))];",
      "fronds on the boughs"
    ],
    /* ---- sunset light ---- */
    [
      "  var KEY  = new THREE.Vector3(-0.30, 0.92, 0.28).normalize();\n  var FILL = new THREE.Vector3( 0.12, -0.86, 0.50).normalize();",
      `  /* dusk after the sun has gone: a soft high key that still models the
     cushion, and a cool bounce off the air on the near side */
  var KEY  = new THREE.Vector3(-0.26, 0.90,  0.34).normalize();
  var FILL = new THREE.Vector3( 0.16, -0.82,  0.52).normalize();`,
      "soft dusk directions"
    ],
    ["uKeyCol:  { value: new THREE.Color(1.14, 1.06, 0.88) },", "uKeyCol:  { value: new THREE.Color(1.36, 1.06, 0.76) },", "sunset key light"],
    ["uFillCol: { value: new THREE.Color(0.78, 0.78, 0.62) },", "uFillCol: { value: new THREE.Color(0.50, 0.62, 0.76) },", "dusk sky fill"],
    ["uAmbCol:  { value: new THREE.Color(0.086, 0.090, 0.080) },", "uAmbCol:  { value: new THREE.Color(0.108, 0.130, 0.150) },", "dusk ambient"],
    ["uHazeCol: { value: new THREE.Color(0.176, 0.195, 0.145) },", "uHazeCol: { value: new THREE.Color(0.222, 0.258, 0.288) },", "sunset haze"],
    ["renderer.toneMappingExposure = 1.30;", "renderer.toneMappingExposure = 1.32;", "dusk exposure"],
    /* ---- density and framing ---- */
    [
      "aspect: ARCH.aspect, haze: 0.15, fog: 0.0, alpha: 1.0, order: 2,",
      "aspect: ARCH.aspect, haze: 0.17, fog: 0.0, alpha: 1.0, order: 2,",
      "near air"
    ],
    [
      "      blades: BLADES_NEAR, ferns: small ? 26 : 46, flowers: small ? 120 : 260,\n      fernSize: [0.22, 0.50], flowerSize: [0.055, 0.118], mainLimbs: mainCount, wire: true,",
      "      blades: BLADES_NEAR, ferns: small ? 14 : 26, flowers: small ? 2600 : 5000,\n      fernSize: [0.16, 0.36], flowerSize: [0.230, 0.420], mainLimbs: 0, wire: true,",
      "near boughs in full leaf"
    ],
    [
      "aspect: FAR.aspect, haze: 0.16, fog: 0.26, alpha: 1.0, order: 0,",
      "aspect: FAR.aspect, haze: 0.26, fog: 0.82, alpha: 1.0, order: 0,",
      "far grove pushed into the air"
    ],
    ["hazeCol: [0.150, 0.164, 0.120], hazeLift: 0.92,", "hazeCol: [0.224, 0.260, 0.290], hazeLift: 0.94,", "far sunset haze"],
    [
      "      blades: BLADES_FAR, ferns: small ? 8 : 16, flowers: small ? 40 : 90,\n      fernSize: [0.26, 0.56], flowerSize: [0.034, 0.062],\n      mask: [0.4, 3.4, 0.0, 0.42], wire: true,",
      "      blades: BLADES_FAR, ferns: 0, flowers: small ? 1600 : 3600,\n      fernSize: [0.26, 0.56], flowerSize: [0.100, 0.190],\n      mask: [4.6, 5.6, -0.14, 0.20], wire: true,",
      "far grove in leaf"
    ],
    [
      `  var ARCH   = { w: 1900, left: -180, top: 306, aspect: 2800 / 1377 };
  var ARCH_N = { w: 1120, left: -290, top: 555, aspect: 2800 / 1377 };
  var FAR    = { w: 1150, left:  -40, top: 320, aspect: 1600 /  757, z: -260 };
  var FAR_N  = { w:  780, left: -110, top: 600, aspect: 1600 /  757, z: -260 };`,
      `  /* framed on the boughs at the authored close range: the frame is
     branch and blossom, with the grove sitting low behind it */
  var ARCH   = { w: 1500, left:   50, top:  262, aspect: 2800 / 1377 };
  var ARCH_N = { w: 1680, left:  -99, top:  500, aspect: 2800 / 1377 };
  var FAR    = { w: 1240, left:  180, top:  392, aspect: 1600 /  757, z: -260 };
  var FAR_N  = { w:  920, left:  280, top:  902, aspect: 1600 /  757, z: -260 };`,
      "framing boxes"
    ],
    ["place(nearGroup, A, 0.732, 0.06, 0);", "place(nearGroup, A, 0.500, 0.500, 0);", "tree framing"],
    ["place(farGroup,  F, 0.410, 0.32, F.z);", "place(farGroup,  F, 0.500, 0.500, F.z);", "grove framing"],
    /* ---- ambient ---- */
    [
      "map: radialTexture(256, [[0, 'rgba(12,16,10,0.62)'], [0.45, 'rgba(12,16,10,0.26)'], [1, 'rgba(12,16,10,0)']]),",
      "map: radialTexture(256, [[0, 'rgba(14,20,26,0.55)'], [0.45, 'rgba(14,20,26,0.22)'], [1, 'rgba(14,20,26,0)']]),",
      "dusk ground shadow"
    ],
    [
      "    shadowMesh.scale.set(aw * 1.02, ah * 0.72, 1);\n    shadowMesh.position.set(cx, cy - ah * 0.40, -70);",
      "    shadowMesh.scale.set(aw * 2.10, ah * 0.44, 1);\n    shadowMesh.position.set(cx, cy - ah * 0.98, -70);",
      "ground haze instead of a disc on the sky"
    ],
    [
      "    glowMesh.scale.set(aw * 1.15, ah * 1.5, 1);\n    glowMesh.position.set(cx - aw * 0.06, cy - ah * 0.18, -320);",
      "    /* the sky already carries the sun and its bloom; a second glow plane\n       in front of it only draws its own edge across the horizon */\n    glowMesh.visible = false;",
      "sun bloom left to the sky"
    ],
    [
      "'  lit += col * uAmbCol * pow(1.0 - max(dot(N, V), 0.0), 4.0) * 0.85;',",
      "'  lit += (col * uAmbCol * 0.85 + uKeyCol * 0.030) * pow(1.0 - max(dot(N, V), 0.0), 4.0);',",
      "sun rim along the bark"
    ],
    [
      "'  vec3 face = vec3(0.330, 0.560, 0.042);',\n        '  vec3 edge = vec3(0.062, 0.190, 0.014);',",
      "'  vec3 face = vec3(0.620, 0.330, 0.090);',\n        '  vec3 edge = vec3(0.150, 0.058, 0.030);',",
      "amber swallowtail"
    ],
    [
      "'  wing = mix(wing * vec3(0.46, 1.14, 0.30), wing * vec3(1.34, 1.06, 0.16), shim);',",
      "'  wing = mix(wing * vec3(1.18, 0.72, 0.34), wing * vec3(1.42, 0.98, 0.28), shim);',",
      "amber diffraction"
    ],
    [
      "'  lit += mix(vec3(0.86, 0.78, 0.20), vec3(0.34, 0.60, 0.12), border) * back * 0.42;',",
      "'  lit += mix(vec3(0.98, 0.66, 0.26), vec3(0.50, 0.22, 0.12), border) * back * 0.42;',",
      "sun through the wing"
    ],
    /* ---- petal fall: the pollen column becomes blossom coming down ---- */
    [
      "poleTex = radialTexture(64, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(236,244,224,0.5)'], [1, 'rgba(236,244,224,0)']]);",
      "poleTex = fallingSprite();",
      "leaf sprite"
    ],
    [
      "var COUNT = (NARROW.matches || (window.innerWidth * window.innerHeight) < 620000) ? 1500 : 4200;",
      "var COUNT = (NARROW.matches || (window.innerWidth * window.innerHeight) < 620000) ? 140 : 340;",
      "leaf count"
    ],
    [
      "      transparent: true, depthWrite: false, depthTest: true,\n      blending: THREE.AdditiveBlending,",
      "      transparent: true, depthWrite: false, depthTest: true,\n      blending: THREE.NormalBlending,",
      "leaves blend as leaves, not as sparks"
    ],
    [
      "        'attribute vec4 seed;',\n        'uniform float uTime, uSize, uScale;',\n        'varying float vFade;',",
      "        'attribute vec4 seed;',\n        'uniform float uTime, uSize, uScale;',\n        'varying float vFade;',\n        'varying float vSpin;',\n        'varying float vFlip;',",
      "leaf spin and tumble varyings"
    ],
    [
      "'  p.x += sin(uTime * sp * 0.35 + ph) * 34.0 * am;',",
      `/* A petal does not fall, it flutters: one slow swing carries it across
           the frame and a second, faster one wobbles inside that swing. */
        '  p.x += sin(uTime * sp * 0.30 + ph) * 96.0 * am + sin(uTime * sp * 1.15 + ph * 2.7) * 26.0 * am;',
        '  p.z += sin(uTime * sp * 0.41 + ph * 1.9) * 44.0 * am;',`,
      "leaf flutter"
    ],
    [
      "'  float climb = mod(uTime * 11.0 * sp + ph * 60.0, 1500.0) - 750.0;',",
      "'  float climb = 750.0 - mod(uTime * 11.0 * sp + ph * 90.0, 1500.0);',",
      "leaves fall, and slowly"
    ],
    [
      "'  float twinkle = 0.55 + 0.45 * sin(uTime * (0.7 + sp * 1.6) + ph * 3.1);',",
      "'  vSpin = uTime * (0.26 + sp * 0.62) + ph * 2.4;',\n        '  vFlip = uTime * (0.55 + sp * 1.25) + ph * 3.7;',\n        '  float twinkle = 0.88 + 0.12 * sin(uTime * (0.7 + sp * 1.6) + ph * 3.1);',",
      "leaf spin and tumble"
    ],
    [
      `        'uniform sampler2D uMap;',
        'varying float vFade;',
        'void main(){',
        '  vec4 t = texture2D(uMap, gl_PointCoord);',
        '  gl_FragColor = vec4(t.rgb, t.a * vFade * 0.52);',`,
      `        'uniform sampler2D uMap;',
        'varying float vFade;',
        'varying float vSpin;',
        'varying float vFlip;',
        'void main(){',
        /* A point sprite can only be turned in the fragment, so spin its
           lookup rather than the quad \u2014 and narrow the lookup as the petal
           turns edge-on, which is the whole of why a real one reads as a
           thin thing tumbling rather than a disc sliding down the frame. */
        '  float cs = cos(vSpin), sn = sin(vSpin);',
        '  vec2 uv = gl_PointCoord - 0.5;',
        '  uv = vec2(uv.x * cs - uv.y * sn, uv.x * sn + uv.y * cs);',
        '  uv.x /= max(0.24, abs(cos(vFlip)));',
        '  uv += 0.5;',
        '  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;',
        '  vec4 t = texture2D(uMap, uv);',
        '  gl_FragColor = vec4(t.rgb, t.a * vFade * 0.94);',`,
      "tumbling leaves"
    ],
    ["uSize: { value: 9 },", "uSize: { value: 62 },", "leaf size"],
    ["motes.material.uniforms.uSize.value = Math.max(5, 9 * u);", "motes.material.uniforms.uSize.value = Math.max(30, 70 * u);", "leaf size on resize"],
    /* ---- the entrance pulse ---- */
    [
      "'  vec3 col = mix(vec3(0.30, 0.72, 0.46), vec3(0.86, 1.00, 0.90), rim);',",
      "'  vec3 col = mix(vec3(0.96, 0.52, 0.18), vec3(1.00, 0.90, 0.60), rim);',",
      "scan-light palette"
    ]
  ];
  return replacements.reduce(
    (documentSource, [needle, replacement, label]) => replaceRequired(documentSource, needle, replacement, label),
    source
  );
}
function buildSceneDocument(reducedMotion, variant) {
  const presentationStart = innerGreenSource.indexOf('<main class="hero" id="hero">');
  const runtimeStart = innerGreenSource.indexOf('<script src="inner-green-assets/three.min.js"><\/script>');
  if (presentationStart < 0 || runtimeStart < 0 || runtimeStart <= presentationStart) {
    throw new Error("Sylva scene adapter could not isolate the authored Three.js scene.");
  }
  let documentSource = `${innerGreenSource.slice(0, presentationStart)}${SCENE_ONLY_MARKUP(VARIANT_LABELS[variant])}

${innerGreenSource.slice(runtimeStart)}`.replace("<title>Sylva \u2014 Into the living world</title>", `<title>${VARIANT_LABELS[variant]}</title>`).replace("</head>", `${SCENE_ONLY_STYLE}${VARIANT_STYLES[variant] ?? ""}</head>`).replace(
    '<script src="inner-green-assets/three.min.js"><\/script>',
    `<script data-threeui-three-runtime>${threeRuntime}<\/script>`
  );
  if (variant === "sakura-sunset") documentSource = applySakuraSunsetVariant(documentSource);
  if (variant === "maple-autumn") documentSource = applyMapleAutumnVariant(documentSource);
  if (variant === "sequoia-mist") documentSource = applySequoiaMistVariant(documentSource);
  if (reducedMotion) {
    documentSource = documentSource.replace(
      "(function loop() { requestAnimationFrame(loop); tick(); })();",
      "(function loop() { if (!REDUCED) requestAnimationFrame(loop); tick(); })();"
    );
  }
  return documentSource;
}
function SylvaLivingWorldScene({
  variant = "living-green",
  className = "",
  style
}) {
  const safeVariant = SYLVA_LIVING_WORLD_VARIANTS.includes(variant) ? variant : "living-green";
  const hostRef = useRef(null);
  const [hostVisible, setHostVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return void 0;
    const observer = new IntersectionObserver(([entry]) => setHostVisible(entry?.isIntersecting ?? true));
    observer.observe(host);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return void 0;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return void 0;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const source = useMemo(() => buildSceneDocument(reducedMotion, safeVariant), [reducedMotion, safeVariant]);
  const mounted = hostVisible && documentVisible;
  const label = VARIANT_LABELS[safeVariant];
  const background = VARIANT_BACKGROUNDS[safeVariant];
  useEffect(() => {
    setReady(false);
  }, [mounted, reducedMotion, safeVariant]);
  return <div
    ref={hostRef}
    className={`threeui-background sylva-living-world-scene${className ? ` ${className}` : ""}`}
    role="img"
    aria-label={`${label} with ferns, flowers, pollen, and a butterfly`}
    data-variant={safeVariant}
    data-state={ready ? "ready" : "loading"}
    style={{ background, pointerEvents: "auto", ...style }}
  >
      {mounted ? <iframe
    key={`${safeVariant}-${reducedMotion ? "reduced" : "motion"}`}
    title={label}
    srcDoc={source}
    sandbox="allow-scripts"
    loading="eager"
    onLoad={() => setReady(true)}
    style={{
      position: "absolute",
      inset: 0,
      display: "block",
      width: "100%",
      height: "100%",
      border: 0,
      background
    }}
  /> : null}
    </div>;
}
export {
  MAPLE_AUTUMN_STYLE,
  SAKURA_SUNSET_STYLE,
  SEQUOIA_FALLING_SPRITE,
  SEQUOIA_MIST_STYLE,
  SYLVA_LIVING_WORLD_VARIANTS,
  SylvaLivingWorldScene,
  applyMapleAutumnVariant,
  applySakuraSunsetVariant,
  applySequoiaMistVariant
};