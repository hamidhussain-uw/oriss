import { useMemo } from 'react';
import * as THREE from 'three';
import { bottleParts } from './shapes.js';
import { labelTexture } from './label.js';

export const FLOOR_Y = -1.1;

// deep, saturated body colour for the liquid (pale palette colours read as milk otherwise)
const liquidColor = p => new THREE.Color(p.liquid[1]).lerp(new THREE.Color(p.liquid[0]), 0.18);

const CAP_MATERIALS = {
  gold: () => new THREE.MeshPhysicalMaterial({ color: '#c9a56b', metalness: 1, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.15 }),
  noir: () => new THREE.MeshPhysicalMaterial({ color: '#0b0b0c', metalness: 0.2, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 }),
  ivory: () => new THREE.MeshPhysicalMaterial({ color: '#e8e0d2', metalness: 0, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.12 }),
};

/** A perfume bottle built from geometry: thick transmissive glass, liquid volume, metal collar, cap and printed label. */
export default function Bottle3D({ p, labelReady = true }) {
  const parts = bottleParts(p.shape);
  const mats = useMemo(() => {
    const [hi, lo] = p.liquid;
    return {
      glass: new THREE.MeshPhysicalMaterial({
        color: '#ffffff', transmission: 1, thickness: 0.9, ior: 1.5, roughness: 0.04,
        clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.3, specularIntensity: 1,
        attenuationColor: new THREE.Color('#f4f1ea'), attenuationDistance: 6,
      }),
      // opaque (so it shows through the transmissive glass), lit from within to read as backlit liquid
      liquid: new THREE.MeshPhysicalMaterial({
        color: liquidColor(p), roughness: 0.06, metalness: 0,
        clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.45,
        emissive: new THREE.Color(lo), emissiveIntensity: 0.14,
      }),
      collar: CAP_MATERIALS.gold(),
      cap: CAP_MATERIALS[p.cap](),
    };
  }, [p.liquid, p.cap]);

  const L = parts.label;
  // dark ink on pale liquids, ivory on deep ones
  const ink = liquidColor(p).getHSL({}).l > 0.62 ? 'rgba(28, 24, 20, 0.88)' : 'rgba(244, 237, 225, 0.94)';
  const tex = useMemo(() => (labelReady ? labelTexture(p.name, L.kind === 'plane' ? L.w / L.h : (L.R * L.arc) / L.h, ink) : null), [labelReady, p.name, L, ink]);

  const bodyTop = parts.bodyH / 2;
  const collarY = bodyTop + parts.collarH / 2 - 0.01;
  const capY = bodyTop + parts.collarH + parts.capH / 2 - 0.02;
  const lift = FLOOR_Y + parts.bodyH / 2; // every bottle stands on the same floor

  return (
    <group position-y={lift}>
      <mesh geometry={parts.liquid} material={mats.liquid} />
      <mesh geometry={parts.body} material={mats.glass} />
      <mesh geometry={parts.collar} material={mats.collar} position-y={collarY} />
      <mesh geometry={parts.cap} material={mats.cap} position-y={capY} />
      {tex && L.kind === 'plane' && (
        <mesh position={[0, L.y, parts.frontZ]}>
          <planeGeometry args={[L.w, L.h]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      )}
      {tex && L.kind === 'curved' && (
        <mesh position-y={L.y}>
          <cylinderGeometry args={[L.R, L.R, L.h, 64, 1, true, -L.arc / 2, L.arc]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} side={THREE.FrontSide} />
        </mesh>
      )}
    </group>
  );
}
