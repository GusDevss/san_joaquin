import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { project, waLink } from '../data/project.js';
import { useInView } from '../hooks.js';
import { IconArrow, IconShield, IconCar, IconWhatsApp } from '../components/Icons.jsx';

const HeroScene = lazy(() => import('../three/HeroScene.jsx'));

const CHAPTERS = 4;

export default function Hero({ webgl, reduced }) {
  const progress = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [wrapRef, inView] = useInView('0px');

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      progress.current = p;
      el.style.setProperty('--p', p.toFixed(4));
      setChapter(Math.min(CHAPTERS - 1, Math.floor(p * CHAPTERS * 0.999 + 0.0)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [wrapRef]);

  const goNext = () => {
    const el = wrapRef.current;
    const total = el.offsetHeight - window.innerHeight;
    const next = Math.min(CHAPTERS - 1, chapter + 1);
    window.scrollTo({ top: el.offsetTop + (total * (next + 0.15)) / CHAPTERS, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section id="inicio" className="hero" ref={wrapRef} aria-label="Presentación de San Joaquín">
      <div className="hero__sticky">
        <div className="hero__canvas" aria-hidden="true">
          {webgl ? (
            <Suspense fallback={null}>
              <HeroScene progress={progress} active={inView} reduced={reduced} />
            </Suspense>
          ) : (
            <img src="./img/fachada-1.webp" alt="" className="hero__fallback" />
          )}
        </div>
        <div className="hero__veil" />

        <div className="container hero__content">
          <article className={`chapter ${chapter === 0 ? 'is-on' : ''}`} aria-hidden={chapter !== 0}>
            <p className="eyebrow">Querétaro · Colonia San Pablo</p>
            <h1 className="display">
              Departamentos <em>cerca de todo</em>
            </h1>
            <p className="lead">
              A unos pasos del Tec de Monterrey. Departamentos amplios de 97 m² en una de las zonas con mayor demanda de la ciudad.
            </p>
            <div className="btn-row">
              <a className="btn btn--primary" href="#contacto">
                Agenda tu visita
              </a>
              <a className="btn btn--ghost" href="#masterplan">
                Explorar en 3D <IconArrow width={18} height={18} />
              </a>
            </div>
          </article>

          <article className={`chapter ${chapter === 1 ? 'is-on' : ''}`} aria-hidden={chapter !== 1}>
            <p className="eyebrow">El conjunto</p>
            <h2 className="display display--md">
              Una comunidad <em>a escala humana</em>
            </h2>
            <div className="stats">
              {project.stats.slice(0, 2).map((s) => (
                <div key={s.label} className="stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <p className="lead">Torres de baja altura rodeadas de jardines y andadores arbolados.</p>
          </article>

          <article className={`chapter ${chapter === 2 ? 'is-on' : ''}`} aria-hidden={chapter !== 2}>
            <p className="eyebrow">Tranquilidad</p>
            <h2 className="display display--md">
              Seguridad <em>desde la entrada</em>
            </h2>
            <ul className="feature-list">
              <li>
                <IconShield /> Acceso controlado
              </li>
              <li>
                <IconCar /> Estacionamiento con cajones para visitas
              </li>
            </ul>
            <p className="lead small">{project.address}</p>
          </article>

          <article className={`chapter ${chapter === 3 ? 'is-on' : ''}`} aria-hidden={chapter !== 3}>
            <p className="eyebrow">Tu inversión inteligente</p>
            <h2 className="display display--md">
              Ubicación que <em>suma valor</em>
            </h2>
            <p className="lead">
              Ubicación con alta demanda constante que garantiza plusvalía, seguridad y una calidad de vida inigualable.
            </p>
            <div className="btn-row">
              <a className="btn btn--primary" href="#masterplan">
                Ver masterplan interactivo
              </a>
              <a className="btn btn--ghost" href={waLink()} target="_blank" rel="noopener">
                <IconWhatsApp width={18} height={18} /> WhatsApp
              </a>
            </div>
          </article>
        </div>

        <nav className="hero__progress" aria-label="Capítulos">
          {Array.from({ length: CHAPTERS }).map((_, i) => (
            <span key={i} className={i === chapter ? 'is-on' : ''} />
          ))}
        </nav>

        <button className={`hero__scroll ${chapter === CHAPTERS - 1 ? 'is-hidden' : ''}`} onClick={goNext}>
          <span>Desliza para recorrer</span>
          <i />
        </button>
      </div>
    </section>
  );
}
