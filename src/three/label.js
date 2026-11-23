import * as THREE from 'three';

const cache = new Map();

/** Screen-printed label: brand, name and type in ivory on a transparent canvas texture. */
export function labelTexture(name, aspect, ink = 'rgba(244, 237, 225, 0.94)') {
  const key = `${name}:${aspect.toFixed(3)}:${ink}`;
  if (cache.has(key)) return cache.get(key);
  const W = 1024, H = Math.round(W / aspect);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = ink;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

  ctx.font = `400 ${Math.round(H * 0.11)}px Jost, sans-serif`;
  ctx.letterSpacing = `${Math.round(H * 0.06)}px`;
  ctx.fillText('ORISS', W / 2 + H * 0.03, H * 0.2);

  ctx.font = `italic 300 ${Math.round(H * 0.3)}px "Cormorant Garamond", Georgia, serif`;
  ctx.letterSpacing = '0px';
  ctx.fillText(name, W / 2, H * 0.52);

  ctx.fillRect(W / 2 - H * 0.12, H * 0.73, H * 0.24, Math.max(2, H * 0.006));

  ctx.font = `400 ${Math.round(H * 0.065)}px Jost, sans-serif`;
  ctx.letterSpacing = `${Math.round(H * 0.035)}px`;
  ctx.fillText('EAU DE PARFUM', W / 2 + H * 0.017, H * 0.86);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(key, tex);
  return tex;
}

const mix = (a, b, t) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();

/** Soft radial backlight texture (studio light behind the bottle). */
export function glowTexture(color) {
  const key = 'glow:' + color;
  if (cache.has(key)) return cache.get(key);
  const cv = document.createElement('canvas'); cv.width = cv.height = 512;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  // opaque: fades into the set's black instead of to transparent (transmission only refracts opaque objects)
  g.addColorStop(0, color); g.addColorStop(0.5, mix(color, '#050505', 0.75)); g.addColorStop(1, '#050505');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

/** Resolves once the label fonts are usable on canvas. */
export const fontsReady = typeof document !== 'undefined'
  ? Promise.all([
      document.fonts.load('italic 300 100px "Cormorant Garamond"'),
      document.fonts.load('400 40px Jost'),
    ]).catch(() => {})
  : Promise.resolve();
