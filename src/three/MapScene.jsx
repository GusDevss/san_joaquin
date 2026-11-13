import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, QuadraticBezierLine, Html } from '@react-three/drei';
import * as THREE from 'three';
import { project } from '../data/project.js';
import { C } from './Site.jsx';

const MW = 20;
const MH = (MW * project.map.height) / project.map.width;
const toWorld = (x, y) => [(x / project.map.width - 0.5) * MW, 0, (y / project.map.height - 0.5) * MH];
const HOME = toWorld(project.map.home.x, project.map.home.y);

function MapPlane() {
  const tex = useTexture('./img/mapa.webp');
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return (
    <group>
      {/* base tipo maqueta */}
      <mesh position={[0, -0.26, 0]} receiveShadow>
        <boxGeometry args={[MW + 0.3, 0.5, MH + 0.3]} />
        <meshStandardMaterial color="#E7DDC9" roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.001} receiveShadow>
        <planeGeometry args={[MW, MH]} />
        <meshStandardMaterial map={tex} roughness={1} />
      </mesh>
    </group>
  );
}

function Home() {
  const ring = useRef();
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime % 2) / 2;
    ring.current.scale.setScalar(0.4 + t * 2.2);
    ring.current.material.opacity = 0.6 * (1 - t);
  });
  return (
    <group position={HOME}>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.03}>
        <ringGeometry args={[0.35, 0.45, 48]} />
        <meshBasicMaterial color="#A8432F" transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

function Poi({ p, active, onHover }) {
  const col = useRef();
  const pos = toWorld(p.x, p.y);
  useFrame((_, dt) => {
    const s = col.current.scale;
    s.y += ((active ? 1 : 0.001) - s.y) * Math.min(1, dt * 8);
  });
  const mid = useMemo(() => {
    const d = Math.hypot(pos[0] - HOME[0], pos[2] - HOME[2]);
    return [(pos[0] + HOME[0]) / 2, 1 + d * 0.35, (pos[2] + HOME[2]) / 2];
  }, [pos]);
  return (
    <group>
      <mesh
        position={[pos[0], 0.05, pos[2]]}
        rotation-x={-Math.PI / 2}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(p.n);
        }}
        onPointerOut={() => onHover(null)}
      >
        <circleGeometry args={[0.45, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={col} position={[pos[0], 0, pos[2]]} scale-y={0.001}>
        <mesh position-y={0.6}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
          <meshBasicMaterial color={C.accent} />
        </mesh>
      </group>
      {active && (
        <>
          <QuadraticBezierLine start={[HOME[0], 0.05, HOME[2]]} end={[pos[0], 0.05, pos[2]]} mid={mid} color={C.ink} lineWidth={2} dashed dashScale={8} />
          <Html position={[pos[0], 1.5, pos[2]]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
            <div className="map-tag">
              <span>{p.n}</span>
              {p.name}
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

function Rig({ reduced }) {
  const { camera, pointer, size } = useThree();
  const k = size.width / size.height < 0.9 ? 1.7 : 1;
  const target = new THREE.Vector3(0.5, 0, 0.6);
  useFrame((_, dt) => {
    const px = reduced ? 0 : pointer.x;
    const py = reduced ? 0 : pointer.y;
    const goal = new THREE.Vector3(2 + px * 3, (15 - py * 2) * k, 15 * k);
    camera.position.lerp(goal, Math.min(1, dt * 2));
    camera.lookAt(target);
  });
  return null;
}

export default function MapScene({ activePoi, onHover, active, reduced }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [2, 15, 15], fov: 40 }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[-8, 16, 8]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <MapPlane />
      <Home />
      {project.pois.map((p) => (
        <Poi key={p.n} p={p} active={activePoi === p.n} onHover={onHover} />
      ))}
      <Rig reduced={reduced} />
    </Canvas>
  );
}
