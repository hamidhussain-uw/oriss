import { useMemo } from 'react';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { glowTexture } from './label.js';

/**
 * Black product-photography set: tall strip softboxes for long glass highlights,
 * a dim coloured backlight behind the bottle (seen through the liquid), soft floor shadow.
 */
export default function Studio({ tint = '#c47a35', backlight = 1, children }) {
  const glow = useMemo(() => glowTexture(tint), [tint]);
  return (
    <>
      <color attach="background" args={['#050505']} />
      <Environment resolution={512} frames={1}>
        <Lightformer form="rect" intensity={4} position={[-3.2, 0.8, 1.2]} rotation-y={Math.PI / 2.4} scale={[0.9, 7, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[3.2, 0.8, 0.6]} rotation-y={-Math.PI / 2.4} scale={[0.7, 7, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[0, 4.5, 0.5]} rotation-x={Math.PI / 2} scale={[3.5, 1.2, 1]} />
        <Lightformer form="rect" intensity={0.5} color={tint} position={[0, 0, -4]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={0.9} position={[0, 1.2, 6]} scale={[5, 1.6, 1]} />
      </Environment>
      <spotLight position={[2.5, 6, 3.5]} angle={0.35} penumbra={1} intensity={60} decay={2} />
      <ambientLight intensity={0.08} />

      {/* backlight card behind the bottle */}
      <mesh position={[0, 0.1, -3]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial map={glow} color={[0.42 * backlight, 0.42 * backlight, 0.42 * backlight]} toneMapped={false} />
      </mesh>

      {children}

      <ContactShadows position-y={-1.1} opacity={0.85} scale={6} blur={2.4} far={1.5} resolution={512} color="#000000" frames={1} />
    </>
  );
}
