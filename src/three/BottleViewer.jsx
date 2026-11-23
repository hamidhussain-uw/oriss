import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, useReducedMotion } from 'framer-motion';
import Bottle3D from './Bottle3D.jsx';
import Studio from './Studio.jsx';
import { useSpin, stepSpin } from './spin.js';
import { fontsReady } from './label.js';
import { ease } from '../motion.js';

const STILL_ASPECT = 3 / 4; // product stills are rendered 3:4
const touch = typeof matchMedia !== 'undefined' && matchMedia('(hover: none)').matches;

/** Match the still's object-fit: cover framing so swapping still → live view doesn't jump in scale. */
function CoverZoom() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    camera.zoom = Math.max(1, size.width / size.height / STILL_ASPECT);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}

function Spinner({ spin, base, onFirstFrame, children }) {
  const ref = useRef(null);
  const shown = useRef(base);
  const first = useRef(false);
  useFrame((state, dt) => {
    const moving = stepSpin(spin, dt);
    const target = base + spin.angle;
    shown.current += (target - shown.current) * (1 - Math.exp(-dt * 12));
    ref.current.rotation.y = shown.current;
    if (moving || Math.abs(target - shown.current) > 1e-4) state.invalidate();
    if (!first.current) { first.current = true; requestAnimationFrame(onFirstFrame); }
  });
  return <group ref={ref}>{children}</group>;
}

/**
 * Live, rotatable bottle drawn over its still. The still stays underneath until the first
 * frame is on screen, then the canvas fades in, so opening never flashes an empty box.
 */
export default function BottleViewer({ p, base = -0.42, className = '' }) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);
  const [labels, setLabels] = useState(false);
  useEffect(() => { let live = true; fontsReady.then(() => live && setLabels(true)); return () => { live = false; }; }, []);
  const { state, bind } = useSpin({ inertia: !reduce, onStart: () => setTouched(true) });

  return (
    <div className={`viewer ${className}`} {...bind} tabIndex={0} role="img"
      aria-label={`${p.name} bottle in 3D. Drag, swipe or use the arrow keys to turn it.`}>
      <motion.div className="viewer__canvas" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 0.8, ease }}>
        <Canvas frameloop="demand" dpr={[1, 1.75]} gl={{ antialias: true }}
          camera={{ fov: 24, position: [0, 0.3, 8.6] }} onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}>
          <CoverZoom />
          <Studio tint={p.tint}>
            <Spinner spin={state} base={base} onFirstFrame={() => setReady(true)}><Bottle3D p={p} labelReady={labels} /></Spinner>
          </Studio>
        </Canvas>
      </motion.div>
      <motion.span className="viewer__hint" aria-hidden="true" initial={{ opacity: 0 }}
        animate={{ opacity: ready && !touched ? 1 : 0 }} transition={{ duration: 0.8, ease, delay: touched ? 0 : 0.6 }}>
        {touch ? 'Swipe to rotate' : 'Drag to rotate'}
      </motion.span>
    </div>
  );
}
