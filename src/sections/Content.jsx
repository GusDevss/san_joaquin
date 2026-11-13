import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { project, waLink } from '../data/project.js';
import { useInView } from '../hooks.js';
import Logo from '../components/Logo.jsx';
import { IconArrow, IconPin, IconPhone, IconWhatsApp } from '../components/Icons.jsx';

const MapScene = lazy(() => import('../three/MapScene.jsx'));

// Inclinación 3D al mover el puntero
function useTilt(max = 8, disabled = false) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
    };
    const leave = () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [max, disabled]);
  return ref;
}

// Parallax ligado al scroll (escribe --s entre -1 y 1)
function useScrollVar() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const up = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const s = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.setProperty('--s', Math.max(-1.2, Math.min(1.2, s)).toFixed(3));
    };
    const on = () => !raf && (raf = requestAnimationFrame(up));
    up();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return ref;
}

export function Inversion() {
  const ref = useScrollVar();
  return (
    <section id="proyecto" className="section inversion" ref={ref}>
      <div className="container split">
        <div className="split__media parallax" data-reveal>
          <img src="./img/pareja-acceso.webp" alt="Pareja caminando hacia los edificios de San Joaquín" loading="lazy" />
          <div className="badge-float">
            <strong>97 m²</strong>
            <span>departamentos amplios</span>
          </div>
        </div>
        <div className="split__text" data-reveal>
          <p className="eyebrow">Tu inversión inteligente</p>
          <h2 className="title">
            Elegir bien, <em>lo cambia todo</em>
          </h2>
          <p className="lead">
            Ubicado en la colonia San Pablo, a unos cuantos pasos del Tec de Monterrey, San Joaquín se posiciona como punto de encuentro entre la vida académica y la oportunidad de negocio.
          </p>
          <p>
            Ubicación con alta demanda constante que garantiza plusvalía, seguridad y una calidad de vida inigualable. Rodeado de centros comerciales, servicios y todo lo que necesitas para vivir con comodidad.
          </p>
          <div className="stats stats--row">
            {project.stats.map((s) => (
              <div key={s.label} className="stat">
                <strong>
                  {s.value}
                  {s.unit && <small>{s.unit}</small>}
                </strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Ubicacion({ webgl, reduced, touch }) {
  const [poi, setPoi] = useState(null);
  const [ref, inView] = useInView('100px');
  const groups = [...new Set(project.pois.map((p) => p.type))];

  return (
    <section id="ubicacion" className="section ubicacion">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Ubicación estratégica</p>
          <h2 className="title">
            Todo lo que necesitas, <em>a minutos</em>
          </h2>
          <p className="lead">
            {touch ? 'Toca' : 'Pasa el cursor sobre'} cada punto para ver su conexión con San Joaquín.
          </p>
        </header>

        <div className="map" data-reveal>
          <div className="map__stage" ref={ref}>
            {webgl ? (
              <Suspense fallback={<img src="./img/mapa.webp" alt="" className="map__fallback" />}>
                <MapScene activePoi={poi} onHover={setPoi} active={inView} reduced={reduced} />
              </Suspense>
            ) : (
              <img src="./img/mapa.webp" alt="Mapa de ubicación de San Joaquín y puntos de interés" className="map__fallback" />
            )}
          </div>
          <ol className="map__list">
            {project.pois.map((p) => (
              <li key={p.n}>
                <button
                  className={poi === p.n ? 'is-on' : ''}
                  onMouseEnter={() => setPoi(p.n)}
                  onMouseLeave={() => setPoi(null)}
                  onFocus={() => setPoi(p.n)}
                  onBlur={() => setPoi(null)}
                  onClick={() => setPoi(poi === p.n ? null : p.n)}
                >
                  <span className="num">{p.n}</span>
                  <span className="name">{p.name}</span>
                  <span className="type">{p.type}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <p className="sr-only">Categorías: {groups.join(', ')}</p>

        <div className="conexion" data-reveal>
          <div className="conexion__img">
            <img src="./img/vialidades.webp" alt="Maqueta de San Joaquín junto a Prol. Bernardo Quintana y Av. 5 de Febrero" loading="lazy" />
          </div>
          <div className="conexion__text">
            <p className="eyebrow">Conexión total</p>
            <h3 className="title title--sm">Movilidad privilegiada</h3>
            <p>Disfruta de una movilidad privilegiada gracias a su cercanía inmediata con vialidades principales:</p>
            <ul className="roads">
              {project.roads.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <a className="link" href={project.mapsUrl} target="_blank" rel="noopener">
              <IconPin width={18} height={18} /> Abrir en Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Departamento({ touch }) {
  const [view, setView] = useState('3d');
  const [spot, setSpot] = useState(null);
  const tilt = useTilt(10, touch);
  return (
    <section id="departamento" className="section depa">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Tu nuevo hogar</p>
          <h2 className="title">
            {project.unit.area} m² <em>pensados para vivir</em>
          </h2>
        </header>
        <div className="depa__grid">
          <div className="depa__viewer" data-reveal>
            <div className="tabs" role="tablist">
              <button role="tab" aria-selected={view === '3d'} className={view === '3d' ? 'is-on' : ''} onClick={() => setView('3d')}>
                Vista 3D
              </button>
              <button role="tab" aria-selected={view === 'plano'} className={view === 'plano' ? 'is-on' : ''} onClick={() => setView('plano')}>
                Plano
              </button>
            </div>
            <div className="tilt" ref={tilt}>
              <div className="tilt__inner">
                {view === '3d' ? (
                  <>
                    <img src="./img/depa-3d.webp" alt="Vista 3D del departamento de 97 m²" loading="lazy" />
                    {project.unitHotspots.map((h) => (
                      <button
                        key={h.id}
                        className={`hotspot ${spot === h.id ? 'is-on' : ''}`}
                        style={{ left: `${h.x}%`, top: `${h.y}%` }}
                        onMouseEnter={() => setSpot(h.id)}
                        onMouseLeave={() => setSpot(null)}
                        onFocus={() => setSpot(h.id)}
                        onBlur={() => setSpot(null)}
                        onClick={() => setSpot(spot === h.id ? null : h.id)}
                        aria-label={h.label}
                      >
                        <span className="hotspot__label">{h.label}</span>
                      </button>
                    ))}
                  </>
                ) : (
                  <img src="./img/plano-depa.webp" alt="Plano arquitectónico del departamento" loading="lazy" />
                )}
              </div>
            </div>
          </div>
          <div className="depa__info" data-reveal>
            <div className="area">
              <strong>{project.unit.area}</strong>
              <span>m²</span>
            </div>
            <ul className="checks">
              {project.unit.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a className="btn btn--primary" href={waLink('Hola, quiero más información del departamento de 97 m² en San Joaquín.')} target="_blank" rel="noopener">
              <IconWhatsApp width={18} height={18} /> Solicitar información
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const GALLERY = [
  { src: 'sala-comedor', alt: 'Sala y comedor amplios con luz natural', cap: 'Sala - comedor' },
  { src: 'cocina', alt: 'Cocina equipada con estufa y alacenas de madera', cap: 'Cocina equipada' },
  { src: 'sala-mediterraneo', alt: 'Estancia con decoración mediterránea', cap: 'Espacios luminosos' },
  { src: 'fachada-2', alt: 'Fachada de las torres de San Joaquín', cap: 'Fachadas' },
  { src: 'pareja-sala', alt: 'Pareja disfrutando su sala', cap: 'Vive cómodo' },
  { src: 'llaves', alt: 'Persona abriendo la puerta de su nuevo departamento', cap: 'Tu nuevo hogar' },
];

export function Galeria({ reduced }) {
  const track = useRef(null);
  useEffect(() => {
    const el = track.current;
    if (!el || reduced) return;
    let raf = 0;
    const up = () => {
      raf = 0;
      const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
      el.querySelectorAll('figure').forEach((f) => {
        const r = f.getBoundingClientRect();
        const d = (r.left + r.width / 2 - mid) / el.clientWidth;
        f.style.setProperty('--d', Math.max(-1, Math.min(1, d)).toFixed(3));
      });
    };
    const on = () => !raf && (raf = requestAnimationFrame(up));
    up();
    el.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      el.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [reduced]);

  const scrollBy = (dir) => track.current.scrollBy({ left: dir * track.current.clientWidth * 0.6, behavior: reduced ? 'auto' : 'smooth' });

  return (
    <section id="galeria" className="section galeria">
      <div className="container galeria__head" data-reveal>
        <div>
          <p className="eyebrow">Galería</p>
          <h2 className="title">
            Espacios que <em>se sienten tuyos</em>
          </h2>
        </div>
        <div className="arrows">
          <button onClick={() => scrollBy(-1)} aria-label="Anterior">
            <IconArrow style={{ transform: 'scaleX(-1)' }} />
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Siguiente">
            <IconArrow />
          </button>
        </div>
      </div>
      <div className="galeria__track" ref={track} tabIndex={0} aria-label="Galería de imágenes">
        {GALLERY.map((g) => (
          <figure key={g.src}>
            <img src={`./img/${g.src}.webp`} alt={g.alt} loading="lazy" />
            <figcaption>{g.cap}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function ParaQuien({ touch }) {
  const scene = useTilt(6, touch);
  const ref = useScrollVar();
  const profiles = [
    { t: 'Estudiantes', d: 'Independencia a pasos del Tec de Monterrey y UNITEC.', img: 'estudiante' },
    { t: 'Familias', d: 'Espacios amplios, seguridad y todo cerca para el día a día.', img: 'pareja-sala' },
    { t: 'Inversionistas', d: 'Alta demanda constante en una ubicación que suma valor.', img: 'llaves' },
  ];
  return (
    <section className="section futuro" ref={ref}>
      <div className="container futuro__grid">
        <div className="futuro__text" data-reveal>
          <p className="eyebrow">Para ti</p>
          <h2 className="title">
            Tu departamento <em>a pasos de tu futuro</em>
          </h2>
          <p className="lead">
            Es el lugar ideal para estudiantes que buscan independencia y para familias e inversionistas que reconocen el valor de una buena ubicación.
          </p>
        </div>
        <div className="layers" ref={scene} aria-hidden="true" data-reveal>
          <div className="layers__inner">
            <div className="layers__sun" />
            <img className="layers__back" src="./img/fachada-recorte.webp" alt="" loading="lazy" />
            <img className="layers__front" src="./img/estudiante-recorte.webp" alt="" loading="lazy" />
          </div>
        </div>
      </div>
      <div className="container profiles">
        {profiles.map((p) => (
          <article key={p.t} className="profile" data-reveal>
            <img src={`./img/${p.img}.webp`} alt="" loading="lazy" />
            <div>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Contacto() {
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = `Hola, soy ${f.get('nombre')}. Me interesa San Joaquín como ${f.get('perfil')}.${f.get('mensaje') ? ' ' + f.get('mensaje') : ''} Mi teléfono: ${f.get('telefono')}.`;
    window.open(waLink(msg), '_blank', 'noopener');
    setSent(true);
  };
  return (
    <section id="contacto" className="section contacto">
      <div className="container contacto__grid">
        <div className="contacto__info" data-reveal>
          <Logo variant="stack" className="contacto__logo" />
          <h2 className="title title--light">
            Agenda tu <em>visita</em>
          </h2>
          <p>Conoce San Joaquín y descubre por qué es la mejor decisión para vivir o invertir en Querétaro.</p>
          <ul className="contact-list">
            <li>
              <IconPin /> <a href={project.mapsUrl} target="_blank" rel="noopener">{project.address}</a>
            </li>
            <li>
              <IconPhone /> <a href={`tel:+${project.phoneIntl}`}>{project.phoneDisplay}</a>
            </li>
            <li>
              <IconWhatsApp /> <a href={waLink()} target="_blank" rel="noopener">Escríbenos por WhatsApp</a>
            </li>
          </ul>
        </div>
        <form className="form" onSubmit={submit} data-reveal>
          <label>
            <span>Nombre</span>
            <input name="nombre" required autoComplete="name" placeholder="Tu nombre" />
          </label>
          <label>
            <span>Teléfono</span>
            <input name="telefono" type="tel" required autoComplete="tel" inputMode="tel" placeholder="442 000 0000" />
          </label>
          <label>
            <span>Me interesa como</span>
            <select name="perfil" defaultValue="familia">
              <option value="familia">Familia / para vivir</option>
              <option value="estudiante">Estudiante</option>
              <option value="inversionista">Inversionista</option>
            </select>
          </label>
          <label>
            <span>Mensaje (opcional)</span>
            <textarea name="mensaje" rows={3} placeholder="¿Qué te gustaría saber?" />
          </label>
          <button className="btn btn--accent" type="submit">
            <IconWhatsApp width={18} height={18} /> Enviar por WhatsApp
          </button>
          {sent && <p className="form__ok" role="status">¡Gracias! Se abrió WhatsApp con tu mensaje.</p>}
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <Logo variant="h" className="footer__logo" />
        <p>
          Un desarrollo de <strong>{project.developer}</strong>
        </p>
        <p className="footer__legal">
          {project.addressShort}, Querétaro · © {new Date().getFullYear()} {project.developer}. Imágenes con fines ilustrativos.
        </p>
      </div>
    </footer>
  );
}
