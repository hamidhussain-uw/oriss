import { useMemo, useRef } from 'react';
import { invalidate } from '@react-three/fiber';

/**
 * Drag / swipe / arrow-key rotation with inertia for a 3D view.
 * `state.angle` is read inside useFrame; `bind` goes on the DOM element around the canvas.
 * Vertical swipes are left to the browser (touch-action: pan-y), so pages still scroll on phones.
 */
export function useSpin({ inertia = true, onStart } = {}) {
  const state = useRef({ angle: 0, vel: 0, dragging: false, x: 0, t: 0 }).current;
  const bind = useMemo(() => ({
    onPointerDown: e => {
      if (e.button !== 0) return;
      state.dragging = true; state.x = e.clientX; state.t = performance.now(); state.vel = 0;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      onStart?.();
    },
    onPointerMove: e => {
      if (!state.dragging) return;
      const now = performance.now(), dx = e.clientX - state.x, dt = Math.max(1, now - state.t) / 1000;
      state.angle += dx * 0.009;
      state.vel = 0.8 * state.vel + 0.2 * ((dx * 0.009) / dt);
      state.x = e.clientX; state.t = now;
      invalidate();
    },
    onPointerUp: () => { state.dragging = false; if (!inertia) state.vel = 0; invalidate(); },
    onPointerCancel: () => { state.dragging = false; state.vel = 0; },
    onKeyDown: e => {
      const d = { ArrowLeft: -0.35, ArrowRight: 0.35 }[e.key];
      if (!d) return;
      e.preventDefault(); state.angle += d; state.vel = 0; onStart?.(); invalidate();
    },
  }), [state, inertia, onStart]);
  return { state, bind };
}

/** Advance inertia; returns true while still moving (caller should invalidate). */
export function stepSpin(state, dt) {
  if (state.dragging || Math.abs(state.vel) < 0.002) { if (!state.dragging) state.vel = 0; return false; }
  state.angle += state.vel * dt;
  state.vel *= Math.exp(-dt * 3.2);
  return true;
}
