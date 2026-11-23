import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PRODUCTS, byId } from '../data.js';
import { useStore } from '../store.js';
import Bottle3D from './Bottle3D.jsx';
import Studio from './Studio.jsx';
import { fontsReady } from './label.js';

const WIDE = { pos: [0, 0.3, 8.6], look: [0, 0.3, 0] };
const small = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 700px)').matches;

// Stills to render: a 3/4 view per product first (cards need these), then the turned signature view.
export const JOBS = [
  ...PRODUCTS.map(p => ({ key: p.id, p, rot: -0.42, cam: WIDE })),
  { key: 'ombrelune-turn', p: byId.ombrelune, rot: 0.62, cam: WIDE },
];

const hasWebGL = () => {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
};

function Capture({ onDone }) {
  const [i, setI] = useState(0);
  const seen = useRef({ i: -1, frames: 0 });
  const gl = useThree(s => s.gl);
  const camera = useThree(s => s.camera);
  const setShot = useStore(s => s.setShot);

  useFrame(() => {
    if (i >= JOBS.length) return;
    const t = seen.current;
    if (t.i !== i) {
      t.i = i; t.frames = 0;
      const { pos, look } = JOBS[i].cam;
      camera.position.set(...pos); camera.lookAt(...look);
    }
    // environment, contact shadow and label texture need a few frames; useFrame runs before the
    // render, so the drawing buffer holds the previous frame (preserveDrawingBuffer keeps it)
    if (++t.frames < 6) return;
    setShot(JOBS[i].key, gl.domElement.toDataURL('image/jpeg', 0.9));
    if (i + 1 >= JOBS.length) onDone(); else setI(i + 1);
  });

  const job = JOBS[Math.min(i, JOBS.length - 1)];
  return (
    <Studio key={job.key} tint={job.p.tint}>
      <group rotation-y={job.rot}><Bottle3D p={job.p} /></group>
    </Studio>
  );
}

/** Renders every product still once, off-screen, then releases its WebGL context. */
export default function ProductShots() {
  const [phase, setPhase] = useState('wait'); // wait → render → done
  const setShotsFailed = useStore(s => s.setShotsFailed);

  useEffect(() => {
    if (!hasWebGL()) { setShotsFailed(); return; }
    let live = true, t;
    // let the hero bottle get its first frames on screen before the off-screen studio starts
    fontsReady.then(() => { t = setTimeout(() => { if (live) setPhase('render'); }, 700); });
    return () => { live = false; clearTimeout(t); };
  }, [setShotsFailed]);

  if (phase !== 'render') return null;
  return (
    <div className={`shot-studio${small ? ' shot-studio--small' : ''}`} aria-hidden="true">
      <Canvas dpr={small ? 1.25 : 1.5} gl={{ antialias: true, preserveDrawingBuffer: true }}
        camera={{ fov: 24, position: [0, 0.3, 8.6] }} onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}>
        <Capture onDone={() => setPhase('done')} />
      </Canvas>
    </div>
  );
}
