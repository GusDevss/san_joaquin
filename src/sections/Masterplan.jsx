import { lazy, Suspense, useRef, useState } from 'react';
import { project, waLink } from '../data/project.js';
import { useInView } from '../hooks.js';
import { IconRotate, IconWhatsApp, IconShield, IconCar, IconTree, IconBuilding, IconClose } from '../components/Icons.jsx';

const MasterplanScene = lazy(() => import('../three/MasterplanScene.jsx'));
const TOWER_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Masterplan({ webgl, reduced, touch }) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [ref, inView] = useInView('100px');
  const yaw = useRef(0);

  const hold = (dir) => ({
    onPointerDown: () => (yaw.current = dir),
    onPointerUp: () => (yaw.current = 0),
    onPointerLeave: () => (yaw.current = 0),
    onPointerCancel: () => (yaw.current = 0),
  });

  const icons = [IconShield, IconCar, IconTree, IconBuilding];

  return (
    <section id="masterplan" className="section masterplan">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Masterplan 3D</p>
          <h2 className="title">
            Recorre <em>San Joaquín</em>
          </h2>
          <p className="lead">
            {touch ? 'Toca' : 'Gira la maqueta y haz clic en'} cualquier torre para conocerla. 8 torres y 27 departamentos rodeados de áreas verdes.
          </p>
        </header>

        <div className="mp" data-reveal>
          <div className="mp__stage" ref={ref}>
            {webgl ? (
              <Suspense fallback={<div className="mp__loading">Cargando maqueta…</div>}>
                <MasterplanScene
                  hovered={hovered}
                  selected={selected}
                  onHover={setHovered}
                  onSelect={setSelected}
                  active={inView}
                  touch={touch}
                  yaw={yaw}
                  reduced={reduced}
                />
              </Suspense>
            ) : (
              <img src="./img/plano-conjunto.webp" alt="Plano del conjunto San Joaquín" className="mp__fallback" />
            )}

            {touch && webgl && (
              <div className="mp__rotate">
                <button aria-label="Girar a la izquierda" {...hold(-1)}>
                  <IconRotate dir={-1} />
                </button>
                <button aria-label="Girar a la derecha" {...hold(1)}>
                  <IconRotate />
                </button>
              </div>
            )}

            {selected && (
              <div className="mp__card" role="dialog" aria-label={`Torre ${selected}`}>
                <button className="mp__close" onClick={() => setSelected(null)} aria-label="Cerrar">
                  <IconClose width={18} height={18} />
                </button>
                <p className="eyebrow">San Joaquín</p>
                <h3>Torre {selected}</h3>
                <ul>
                  <li>
                    <strong>{project.unit.area} m²</strong> por departamento
                  </li>
                  <li>2 recámaras · 2 baños completos</li>
                  <li>Sala - comedor · cocina equipada · lavado</li>
                </ul>
                <a className="btn btn--primary btn--sm" href={waLink(`Hola, me interesa la Torre ${selected} de San Joaquín. ¿Qué departamentos tienen disponibles?`)} target="_blank" rel="noopener">
                  <IconWhatsApp width={16} height={16} /> Consultar disponibilidad
                </a>
              </div>
            )}
          </div>

          <aside className="mp__side">
            <p className="mp__label">Torres</p>
            <div className="mp__towers">
              {TOWER_IDS.map((id) => (
                <button
                  key={id}
                  className={`chip ${selected === id ? 'is-on' : ''} ${hovered === id ? 'is-hover' : ''}`}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(selected === id ? null : id)}
                  aria-pressed={selected === id}
                >
                  {id}
                </button>
              ))}
            </div>
            <ul className="mp__legend">
              {project.amenities.map((a, i) => {
                const I = icons[i];
                return (
                  <li key={a.title}>
                    <I />
                    <div>
                      <strong>{a.title}</strong>
                      <span>{a.text}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
