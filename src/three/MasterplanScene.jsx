import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Site, { Lights, C, TOWERS, TOWER_H } from './Site.jsx';

const HOME_TARGET = new THREE.Vector3(-2, 1, 0);

// Lleva el objetivo de la cámara a la torre seleccionada
function Focus({ selected, controls, yaw }) {
  const { camera } = useThree();
  const target = useRef(HOME_TARGET.clone());
  useEffect(() => {
    const t = TOWERS.find((x) => x.id === selected);
    target.current = t ? new THREE.Vector3(t.x, TOWER_H / 2, t.z) : HOME_TARGET.clone();
  }, [selected]);

  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    c.target.lerp(target.current, Math.min(1, dt * 3));
    // rotación por botones (dispositivos táctiles)
    if (yaw.current) {
      const off = camera.position.clone().sub(c.target);
      off.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current * dt * 1.2);
      camera.position.copy(c.target).add(off);
    }
    c.update();
  });
  return null;
}

export default function MasterplanScene({ hovered, selected, onHover, onSelect, active, touch, yaw, reduced }) {
  const controls = useRef();
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: typeof window !== 'undefined' && window.innerWidth / window.innerHeight < 0.9 ? [30, 30, 38] : [20, 19, 24], fov: 38, near: 0.5, far: 400 }}
      onPointerMissed={() => onSelect(null)}
      style={{ cursor: hovered ? 'pointer' : 'grab', touchAction: touch ? 'pan-y' : 'none' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={[C.cream]} />
      <fog attach="fog" args={[C.cream, 40, 110]} />
      <Lights />
      <Site intro={false} hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} showLabels />
      <OrbitControls
        ref={controls}
        enabled={!touch}
        enablePan={false}
        enableDamping
        minDistance={12}
        maxDistance={55}
        minPolarAngle={0.25}
        maxPolarAngle={1.3}
        autoRotate={!reduced && !selected && !hovered}
        autoRotateSpeed={0.35}
        target={HOME_TARGET.toArray()}
      />
      <Focus selected={selected} controls={controls} yaw={yaw} />
    </Canvas>
  );
}
