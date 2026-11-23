import * as THREE from 'three';

// All units are arbitrary "studio" units; a bottle is ~2.2 tall.
// Each shape: body (outer glass), liquid (inner volume), cap, collar, label placement.
export const SHAPES = {
  square: { kind: 'rect', W: 1.3, H: 1.5, D: 0.8, r: 0.12, cap: { kind: 'block', W: 0.66, H: 0.52, D: 0.5 } },
  tall: { kind: 'rect', W: 0.98, H: 1.95, D: 0.6, r: 0.1, cap: { kind: 'cyl', R: 0.25, H: 0.7 } },
  round: { kind: 'disc', R: 0.86, D: 0.56, cap: { kind: 'ball', R: 0.3 } },
  slim: { kind: 'cyl', R: 0.42, H: 2.0, cap: { kind: 'cyl', R: 0.3, H: 0.82 } },
};

const WALL = 0.085;   // glass wall thickness
const BASE = 0.24;    // heavy glass base
const FILL = 0.8;     // liquid fill (fraction of inner height)

function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// Extrude a 2D shape so the result has the given outer depth, bevelled edges, centred on the origin.
function extrude(shape, depth, bevel, curveSegments = 24) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(depth - 2 * bevel, 0.001), bevelEnabled: true,
    bevelThickness: bevel, bevelSize: bevel, bevelSegments: 10, curveSegments,
  });
  g.center();
  g.computeVertexNormals();
  return g;
}

// Lathe a rounded cylinder (radius R, height H, corner radius c), centred on the origin.
function roundedCylinder(R, H, c, segments = 96) {
  const pts = [new THREE.Vector2(0, -H / 2)];
  const arc = (cx, cy, a0, a1) => { for (let i = 0; i <= 10; i++) { const a = a0 + (a1 - a0) * (i / 10); pts.push(new THREE.Vector2(cx + c * Math.cos(a), cy + c * Math.sin(a))); } };
  arc(R - c, -H / 2 + c, -Math.PI / 2, 0);
  arc(R - c, H / 2 - c, 0, Math.PI / 2);
  pts.push(new THREE.Vector2(0, H / 2));
  return new THREE.LatheGeometry(pts, segments);
}

const cache = new Map();

/** Geometry + layout for a shape, built once and shared. */
export function bottleParts(shapeKey) {
  if (cache.has(shapeKey)) return cache.get(shapeKey);
  const s = SHAPES[shapeKey];
  let body, liquid, bodyH, frontZ, label;

  if (s.kind === 'rect') {
    const b = 0.07;
    body = extrude(roundedRect(s.W - 2 * b, s.H - 2 * b, s.r), s.D, b);
    bodyH = s.H;
    const fillH = (s.H - BASE - WALL) * FILL;
    liquid = extrude(roundedRect(s.W - 2 * WALL - 0.06, fillH - 0.06, s.r * 0.6), s.D - 2 * WALL, 0.03);
    liquid.translate(0, -s.H / 2 + BASE + fillH / 2, 0);
    frontZ = s.D / 2 + 0.002;
    label = { kind: 'plane', w: s.W * 0.62, h: s.W * 0.62 * 0.62, y: -s.H * 0.08 };
  } else if (s.kind === 'disc') {
    const b = 0.09;
    const c = new THREE.Shape(); c.absarc(0, 0, s.R - b, 0, Math.PI * 2, false);
    body = extrude(c, s.D, b, 96);
    bodyH = s.R * 2;
    const r = s.R - WALL - 0.04, yf = -s.R + BASE + (2 * s.R - BASE - WALL) * FILL - 0.02;
    const th = Math.asin(Math.max(-1, Math.min(1, yf / r)));
    const seg = new THREE.Shape(); seg.absarc(0, 0, r, Math.PI - th, 2 * Math.PI + th, false); seg.closePath();
    liquid = new THREE.ExtrudeGeometry(seg, { depth: s.D - 2 * WALL - 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 4, curveSegments: 96 });
    liquid.translate(0, 0, -(s.D - 2 * WALL - 0.04) / 2);
    frontZ = s.D / 2 + 0.002;
    label = { kind: 'plane', w: s.R * 1.05, h: s.R * 1.05 * 0.56, y: -s.R * 0.12 };
  } else {
    body = roundedCylinder(s.R, s.H, 0.13);
    bodyH = s.H;
    const fillH = (s.H - BASE - WALL) * FILL;
    liquid = roundedCylinder(s.R - WALL - 0.03, fillH, 0.06, 64);
    liquid.translate(0, -s.H / 2 + BASE + fillH / 2, 0);
    frontZ = s.R + 0.003;
    label = { kind: 'curved', R: s.R + 0.003, arc: 1.25, h: 0.62, y: -s.H * 0.06 };
  }

  // neck collar + cap sit on top of the body
  const collarH = 0.11, collarR = 0.16;
  const collar = roundedCylinder(collarR, collarH, 0.03, 64);
  let cap, capH;
  const c = s.cap;
  if (c.kind === 'block') { cap = extrude(roundedRect(c.W - 0.08, c.H - 0.08, 0.05), c.D, 0.04); capH = c.H; }
  else if (c.kind === 'cyl') { cap = roundedCylinder(c.R, c.H, 0.06); capH = c.H; }
  else { cap = new THREE.SphereGeometry(c.R, 96, 64); capH = c.R * 2; }

  const parts = { body, liquid, collar, cap, bodyH, collarH, capH, frontZ, label };
  cache.set(shapeKey, parts);
  return parts;
}
