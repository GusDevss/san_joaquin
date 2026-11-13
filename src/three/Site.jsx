import { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Paleta de marca
export const C = {
  ink: '#27352F',
  accent: '#97846E',
  cream: '#F6F1E7',
  ground: '#ECE5D6',
  facade: '#F7F2E8',
  trim: '#FFFFFF',
  glass: '#2E3B39',
  wood: '#9C7A55',
  garden: '#B9C4A0',
  garden2: '#A7B58C',
  paving: '#D9CCB5',
  asphalt: '#CFC6B6',
  road: '#E3D2A8',
  leaf: ['#7E9A69', '#6F8B5E', '#8FA977', '#5F7D52'],
};

// Escala: 1 unidad ≈ 3.2 m. Distribución tomada del plano del conjunto.
export const TOWERS = [
  { id: 1, x: -9.0, z: -12.2 },
  { id: 2, x: -3.4, z: -12.0 },
  { id: 3, x: -9.0, z: -7.2 },
  { id: 4, x: -3.4, z: -7.0 },
  { id: 5, x: -9.0, z: -2.0 },
  { id: 6, x: -3.4, z: -1.8 },
  { id: 7, x: -9.0, z: 3.1 },
  { id: 8, x: -3.4, z: 3.0 },
];

const FLOORS = 4;
const FLOOR_H = 0.85;
const W = 4.4; // ancho (x)
const D = 3.6; // fondo (z)
export const TOWER_H = FLOORS * FLOOR_H;

// Generador pseudoaleatorio determinista (misma maqueta en cada visita)
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shapeFrom(points) {
  const s = new THREE.Shape();
  points.forEach(([x, z], i) => (i ? s.lineTo(x, -z) : s.moveTo(x, -z)));
  s.closePath();
  return s;
}

function Flat({ points, color, y = 0.01, receive = true }) {
  const geo = useMemo(() => new THREE.ShapeGeometry(shapeFrom(points)), [points]);
  return (
    <mesh geometry={geo} rotation-x={-Math.PI / 2} position-y={y} receiveShadow={receive}>
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

function Slab({ points, color, h = 0.06 }) {
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shapeFrom(points), { depth: h, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    return g;
  }, [points, h]);
  return (
    <mesh geometry={geo} receiveShadow castShadow={false}>
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

// ---------- Torre ----------
const towerMats = {
  facade: new THREE.MeshStandardMaterial({ color: C.facade, roughness: 0.92 }),
  trim: new THREE.MeshStandardMaterial({ color: C.trim, roughness: 0.8 }),
  glass: new THREE.MeshStandardMaterial({ color: C.glass, roughness: 0.25, metalness: 0.3 }),
  wood: new THREE.MeshStandardMaterial({ color: C.wood, roughness: 0.8 }),
  rail: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.6 }),
  roof: new THREE.MeshStandardMaterial({ color: '#E9E2D4', roughness: 1 }),
};

function Tower({ t, hovered, selected, onOver, onOut, onSelect, rise, showLabel }) {
  const group = useRef();
  const hl = useRef();
  const active = hovered || selected;

  useFrame((_, dt) => {
    if (!group.current) return;
    const target = rise.current?.[t.id - 1] ?? 1;
    const s = group.current.scale;
    s.y += (target - s.y) * Math.min(1, dt * 4);
    if (hl.current) {
      const o = hl.current.material.opacity;
      hl.current.material.opacity = o + ((active ? 0.55 : 0) - o) * Math.min(1, dt * 8);
    }
  });

  const windows = useMemo(() => {
    const out = [];
    for (let f = 0; f < FLOORS; f++) {
      const y = f * FLOOR_H + 0.42;
      [-1.55, -0.55, 0.55, 1.55].forEach((x, i) => {
        // fachada frontal (z+) y trasera (z-)
        out.push({ p: [x, y, D / 2 + 0.01], s: [0.5, 0.42, 0.04], balcony: i === 1 || i === 2 });
        out.push({ p: [x, y, -D / 2 - 0.01], s: [0.42, 0.36, 0.04] });
      });
      [-0.9, 0.9].forEach((z) => {
        out.push({ p: [W / 2 + 0.01, y, z], s: [0.04, 0.38, 0.4] });
        out.push({ p: [-W / 2 - 0.01, y, z], s: [0.04, 0.38, 0.4] });
      });
    }
    return out;
  }, []);

  return (
    <group position={[t.x, 0, t.z]}>
      <group
        ref={group}
        scale-y={0.001}
        onPointerOver={(e) => {
          e.stopPropagation();
          onOver?.(t.id);
        }}
        onPointerOut={() => onOut?.(t.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(t.id);
        }}
      >
        {/* volumen principal */}
        <mesh material={towerMats.facade} position={[0, TOWER_H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[W, TOWER_H, D]} />
        </mesh>
        {/* núcleo de escaleras escalonado (como en el plano) */}
        <mesh material={towerMats.facade} position={[W / 2 - 0.6, (TOWER_H + 0.35) / 2, -D / 2 - 0.45]} castShadow receiveShadow>
          <boxGeometry args={[1.2, TOWER_H + 0.35, 0.9]} />
        </mesh>
        {/* entrepisos */}
        {Array.from({ length: FLOORS }).map((_, f) => (
          <mesh key={f} material={towerMats.trim} position={[0, (f + 1) * FLOOR_H - 0.02, 0]} castShadow>
            <boxGeometry args={[W + 0.08, 0.06, D + 0.08]} />
          </mesh>
        ))}
        {/* pretil y azotea */}
        <mesh material={towerMats.roof} position={[0, TOWER_H + 0.01, 0]}>
          <boxGeometry args={[W - 0.2, 0.02, D - 0.2]} />
        </mesh>
        <mesh material={towerMats.trim} position={[0, TOWER_H + 0.12, 0]} castShadow>
          <boxGeometry args={[W + 0.08, 0.24, D + 0.08]} />
        </mesh>
        {/* ventanas y balcones */}
        {windows.map((w, i) => (
          <group key={i}>
            <mesh material={towerMats.glass} position={w.p}>
              <boxGeometry args={w.s} />
            </mesh>
            {w.balcony && (
              <group position={[w.p[0], w.p[1] - 0.25, w.p[2] + 0.22]}>
                <mesh material={towerMats.wood} castShadow>
                  <boxGeometry args={[0.95, 0.05, 0.45]} />
                </mesh>
                <mesh material={towerMats.rail} position={[0, 0.18, 0.21]}>
                  <boxGeometry args={[0.95, 0.3, 0.02]} />
                </mesh>
              </group>
            )}
          </group>
        ))}
        {/* resaltado */}
        <mesh ref={hl} position={[0, TOWER_H / 2 + 0.05, 0]}>
          <boxGeometry args={[W + 0.3, TOWER_H + 0.5, D + 0.3]} />
          <meshBasicMaterial color={C.accent} transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      {showLabel && (
        <Html position={[0, TOWER_H + 1.1, 0]} center distanceFactor={22} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`tower-tag ${active ? 'is-active' : ''}`}>Torre {t.id}</div>
        </Html>
      )}
    </group>
  );
}

// ---------- Árboles (instanciados) ----------
function Trees({ points }) {
  const crowns = useRef();
  const trunks = useRef();
  const colors = useMemo(() => points.map((_, i) => new THREE.Color(C.leaf[i % C.leaf.length])), [points]);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    points.forEach(([x, z, s = 1], i) => {
      m.compose(new THREE.Vector3(x, 0.55 * s + 0.45 * s, z), q, new THREE.Vector3(s, s * 1.05, s));
      crowns.current.setMatrixAt(i, m);
      crowns.current.setColorAt(i, colors[i]);
      m.compose(new THREE.Vector3(x, 0.3 * s, z), q, new THREE.Vector3(s, s, s));
      trunks.current.setMatrixAt(i, m);
    });
    crowns.current.instanceMatrix.needsUpdate = true;
    if (crowns.current.instanceColor) crowns.current.instanceColor.needsUpdate = true;
    trunks.current.instanceMatrix.needsUpdate = true;
  }, [points, colors]);

  return (
    <>
      <instancedMesh ref={crowns} args={[null, null, points.length]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial roughness={0.9} flatShading />
      </instancedMesh>
      <instancedMesh ref={trunks} args={[null, null, points.length]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.6, 6]} />
        <meshStandardMaterial color="#6d5a45" roughness={1} />
      </instancedMesh>
    </>
  );
}

// ---------- Entorno urbano tipo maqueta ----------
function City() {
  const ref = useRef();
  const blocks = useMemo(() => {
    const r = rng(7);
    const out = [];
    const inSite = (x, z) =>
      (x > -17 && x < 11 && z > -24 && z < 24) || (x > 6 && x < 60 && z > 0 && z < 12);
    for (let gx = -70; gx <= 70; gx += 6) {
      for (let gz = -70; gz <= 70; gz += 6) {
        // calles: dejar huecos en la retícula
        if (Math.abs(gx % 30) < 1 || Math.abs(gz % 24) < 1) continue;
        const x = gx + (r() - 0.5) * 1.5;
        const z = gz + (r() - 0.5) * 1.5;
        if (inSite(x, z)) continue;
        const d = Math.hypot(x, z);
        if (d > 72) continue;
        const w = 2.5 + r() * 2.8;
        const dd = 2.5 + r() * 2.8;
        const h = 0.35 + r() * (r() > 0.9 ? 2.2 : 0.9);
        out.push([x, h, z, w, dd]);
      }
    }
    return out;
  }, []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    blocks.forEach(([x, h, z, w, d], i) => {
      m.compose(new THREE.Vector3(x, h / 2, z), q, new THREE.Vector3(w, h, d));
      ref.current.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [blocks]);

  return (
    <instancedMesh ref={ref} args={[null, null, blocks.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#F1ECE2" roughness={1} />
    </instancedMesh>
  );
}

// ---------- Estacionamiento ----------
function Parking() {
  const lines = useMemo(() => {
    const out = [];
    for (let i = 0; i < 9; i++) out.push([-4.6, 8.6 + i * 1.25, 1.6, 0.05]);
    for (let i = 0; i < 9; i++) out.push([5.0, 8.6 + i * 1.25, 1.6, 0.05]);
    for (let i = 0; i < 6; i++) out.push([0.2 - 1.1, 10 + i * 1.6, 1.4, 0.05]);
    for (let i = 0; i < 6; i++) out.push([0.2 + 1.1, 10 + i * 1.6, 1.4, 0.05]);
    return out;
  }, []);
  const cars = [
    [-4.6, 9.2, '#B8B2A6'],
    [-4.6, 12.95, '#4C5A57'],
    [5.0, 10.45, '#C9C4BA'],
    [5.0, 15.45, '#8E7F6C'],
    [-0.9, 13.2, '#E6E2DA'],
    [1.3, 17.9, '#5B6663'],
  ];
  return (
    <group>
      {lines.map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, 0.075, z]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[w, d]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {/* camellón central */}
      <mesh position={[0.2, 0.12, 13.5]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 0.12, 9]} />
        <meshStandardMaterial color={C.garden2} roughness={1} />
      </mesh>
      {cars.map(([x, z, c], i) => (
        <group key={i} position={[x, 0.07, z]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[1.25, 0.32, 0.62]} />
            <meshStandardMaterial color={c} roughness={0.5} metalness={0.2} />
          </mesh>
          <mesh position={[-0.05, 0.45, 0]} castShadow>
            <boxGeometry args={[0.7, 0.22, 0.56]} />
            <meshStandardMaterial color="#2E3B39" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---------- Escena completa ----------
export default function Site({ hovered, selected, onHover, onSelect, intro = true, showLabels = false }) {
  const rise = useRef(TOWERS.map(() => (intro ? 0 : 1)));
  const [started] = useState(() => performance.now());

  useFrame(() => {
    if (!intro) return;
    const t = (performance.now() - started) / 1000;
    TOWERS.forEach((_, i) => {
      rise.current[i] = t > 0.4 + i * 0.12 ? 1 : 0.001;
    });
  });

  const garden = useMemo(() => [[-14.5, -21.75], [-0.5, -19.25], [1.5, 5.75], [-12, 6]], []);
  const walk = useMemo(() => [[-6.6, -18.5], [-5.8, -18.5], [-5.6, 5.6], [-6.4, 5.6]], []);
  const topLawn = useMemo(() => [[-14.5, -21.75], [-0.5, -19.25], [-0.35, -16.6], [-14.1, -17.2]], []);
  const parking = useMemo(() => [[-7.25, 6.25], [7.5, 6.25], [7.75, 20.5], [-6.5, 21]], []);
  const road = useMemo(() => [[7.4, 6.6], [64, 1.0], [64, 3.4], [7.4, 9.4]], []);
  const sidewalk = useMemo(() => [[-7.8, 5.8], [8.2, 5.8], [8.4, 21.3], [-7.1, 21.8]], []);

  const trees = useMemo(() => {
    const t = [];
    // hilera norte
    for (let i = 0; i < 7; i++) t.push([-13.3 + i * 2.0, -20.3 + i * 0.32, 1.1]);
    t.push([-13.4, -18.4, 1], [-1.5, -17.6, 0.9]);
    // borde oriente
    [[2.2, -15], [2.6, -12.5], [3.1, -2.5], [3.3, 0], [3.6, 2.6], [1.0, 4.4], [-1.2, 4.9]].forEach(([x, z]) => t.push([x, z, 1]));
    // perímetro estacionamiento
    for (let i = 0; i < 6; i++) t.push([-8.4, 7.5 + i * 2.6, 0.9]);
    for (let i = 0; i < 5; i++) t.push([9.2, 9 + i * 2.6, 1]);
    for (let i = 0; i < 4; i++) t.push([-4.5 + i * 3.3, 22.5, 1]);
    for (let i = 0; i < 4; i++) t.push([0.2, 9.4 + i * 2.5, 0.6]);
    // alineamiento de la calle de acceso
    for (let i = 0; i < 18; i++) t.push([17 + i * 2.6, 9.9 - i * 0.255, 0.85]);
    for (let i = 0; i < 14; i++) t.push([22 + i * 3, -0.2 - i * 0.29, 0.8]);
    // entorno
    const r = rng(21);
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2;
      const d = 26 + r() * 40;
      const x = Math.cos(a) * d;
      const z = Math.sin(a) * d;
      if (x > 6 && z > -2 && z < 12) continue;
      t.push([x, z, 0.7 + r() * 0.6]);
    }
    return t;
  }, []);

  return (
    <group>
      {/* terreno */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[110, 64]} />
        <meshStandardMaterial color={C.ground} roughness={1} />
      </mesh>
      <City />

      {/* conjunto */}
      <Slab points={garden} color={C.garden} h={0.08} />
      <Flat points={topLawn} color={C.garden2} y={0.085} />
      <Flat points={walk} color={C.paving} y={0.09} />
      <Slab points={sidewalk} color="#E2D9C8" h={0.04} />
      <Slab points={parking} color={C.asphalt} h={0.06} />
      <Slab points={road} color={C.road} h={0.03} />
      {/* glorieta */}
      <mesh position={[14.1, 0.1, 7.6]} receiveShadow>
        <cylinderGeometry args={[1.0, 1.0, 0.16, 32]} />
        <meshStandardMaterial color={C.garden2} roughness={1} />
      </mesh>
      {/* caseta de acceso controlado */}
      <group position={[5.4, 0, 7.9]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.9, 0.8]} />
          <meshStandardMaterial color={C.facade} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[1.5, 0.08, 1.2]} />
          <meshStandardMaterial color={C.ink} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.55, 0.41]}>
          <boxGeometry args={[0.7, 0.3, 0.02]} />
          <meshStandardMaterial color={C.glass} roughness={0.2} />
        </mesh>
        {/* pluma */}
        <mesh position={[1.6, 0.5, 0.2]}>
          <boxGeometry args={[2.2, 0.06, 0.06]} />
          <meshStandardMaterial color={C.accent} />
        </mesh>
      </group>

      <Parking />
      <Trees points={trees} />

      {TOWERS.map((t) => (
        <Tower
          key={t.id}
          t={t}
          rise={rise}
          hovered={hovered === t.id}
          selected={selected === t.id}
          onOver={onHover}
          onOut={() => onHover?.(null)}
          onSelect={onSelect}
          showLabel={showLabels}
        />
      ))}
    </group>
  );
}

export function Lights({ shadowSize = 2048 }) {
  return (
    <>
      <hemisphereLight args={['#fffaf0', '#cbbfa8', 0.9]} />
      <directionalLight
        position={[-30, 45, 25]}
        intensity={2.2}
        color="#fff4e2"
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <directionalLight position={[30, 20, -20]} intensity={0.35} color="#dfe7ff" />
    </>
  );
}
