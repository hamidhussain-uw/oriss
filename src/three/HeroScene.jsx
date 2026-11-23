import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMotionValueEvent } from 'framer-motion';
import { byId } from '../data.js';
import Bottle3D from './Bottle3D.jsx';
import Studio from './Studio.jsx';
import { fontsReady } from './label.js';
import { stepSpin } from './spin.js';

const sig = byId.ombrelune;

/** Turns and settles the bottle with scroll. Renders only while something is moving (frameloop="demand"). */
function Rig({ progress, pointer, spin, still, children }) {
  const ref = useRef(null);
  const invalidate = useThree(s => s.invalidate);
  const cur = useRef({ rot: -0.5, y: 0, tilt: 0 });
  useMotionValueEvent(progress, 'change', () => invalidate());
  useMotionValueEvent(pointer.x, 'change', () => invalidate());
  useFrame((_, dt) => {
    const spinning = stepSpin(spin, dt);
    const p = still ? 0 : progress.get();
    // scroll turns the bottle; the cursor adds a slight lean toward it
    const target = { rot: -0.5 + p * 0.75 + (still ? 0 : pointer.x.get() * 0.32) + spin.angle, y: -p * 0.35, tilt: still ? 0 : pointer.y.get() * 0.06 };
    const k = 1 - Math.exp(-dt * 3.5);
    const c = cur.current;
    c.rot += (target.rot - c.rot) * k;
    c.y += (target.y - c.y) * k;
    c.tilt += (target.tilt - c.tilt) * k;
    ref.current.rotation.y = c.rot;
    ref.current.rotation.x = c.tilt;
    ref.current.position.y = c.y;
    if (spinning || Math.abs(target.rot - c.rot) > 1e-4 || Math.abs(target.y - c.y) > 1e-4 || Math.abs(target.tilt - c.tilt) > 1e-4) invalidate();
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene({ progress, pointer, spin, still }) {
  const [labels, setLabels] = useState(false);
  useEffect(() => { let live = true; fontsReady.then(() => live && setLabels(true)); return () => { live = false; }; }, []);
  return (
    <Canvas className="hero__canvas" frameloop="demand" dpr={[1, 1.75]} gl={{ antialias: true }}
      camera={{ fov: 24, position: [0, 0.3, 8.6] }} onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}>
      <Studio tint={sig.tint} backlight={1.15}>
        <Rig progress={progress} pointer={pointer} spin={spin} still={still}><Bottle3D p={sig} labelReady={labels} /></Rig>
      </Studio>
    </Canvas>
  );
}
