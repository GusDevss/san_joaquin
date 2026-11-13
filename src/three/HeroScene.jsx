import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Site, { Lights, C } from './Site.jsx';

// Recorrido de cámara por capítulos: [posición, objetivo]
const KEYS = [
  [[34, 30, 42], [-3, 0, -2]],
  [[-24, 12, 18], [-6, 2, -5]],
  [[20, 6.5, 22], [2, 1, 9]],
  [[-3, 52, 14], [-2.5, 0, -1]],
];

const smooth = (t) => t * t * (3 - 2 * t);
const tmpP = new THREE.Vector3();
const tmpT = new THREE.Vector3();

function Rig({ progress, reduced }) {
  const { camera, pointer, size } = useThree();
  const look = useRef(new THREE.Vector3(...KEYS[0][1]));
  const t0 = useRef(performance.now());

  useFrame((_, dt) => {
    // Desplaza el encuadre: en escritorio el conjunto queda a la derecha del texto; en móvil, arriba.
    const portrait = size.width / size.height < 0.9;
    const ox = portrait ? 0 : -size.width * 0.2;
    const oy = portrait ? size.height * 0.2 : 0;
    const v = camera.view;
    if (!v || v.offsetX !== ox || v.offsetY !== oy || v.fullWidth !== size.width || v.fullHeight !== size.height) {
      camera.setViewOffset(size.width, size.height, ox, oy, size.width, size.height);
    }
    const p = THREE.MathUtils.clamp(progress.current, 0, 0.9999) * (KEYS.length - 1);
    const i = Math.floor(p);
    const f = smooth(p - i);
    const a = KEYS[i];
    const b = KEYS[i + 1];
    tmpP.set(...a[0]).lerp(new THREE.Vector3(...b[0]), f);
    tmpT.set(...a[1]).lerp(new THREE.Vector3(...b[1]), f);

    // En pantallas verticales alejamos la cámara para que quepa el conjunto
    if (portrait) tmpP.sub(tmpT).multiplyScalar(1.55).add(tmpT);

    // Introducción: la cámara desciende hacia la primera vista
    const intro = reduced ? 1 : Math.min(1, (performance.now() - t0.current) / 2600);
    const e = 1 - Math.pow(1 - intro, 3);
    tmpP.y += (1 - e) * 30;
    tmpP.x += (1 - e) * 12;

    if (!reduced) {
      tmpP.x += pointer.x * 1.6;
      tmpP.y += pointer.y * 1.0;
    }
    const k = Math.min(1, dt * 3.2);
    camera.position.lerp(tmpP, k);
    look.current.lerp(tmpT, k);
    camera.lookAt(look.current);
  });
  return null;
}

export default function HeroScene({ progress, active, reduced }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [70, 70, 80], fov: 38, near: 0.5, far: 400 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={[C.cream]} />
      <fog attach="fog" args={[C.cream, 55, 140]} />
      <Lights />
      <Site intro={!reduced} />
      <Rig progress={progress} reduced={reduced} />
    </Canvas>
  );
}
