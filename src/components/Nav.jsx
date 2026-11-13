import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import { waLink } from '../data/project.js';
import { IconMenu, IconClose, IconWhatsApp } from './Icons.jsx';

const LINKS = [
  ['#proyecto', 'Proyecto'],
  ['#masterplan', 'Masterplan 3D'],
  ['#ubicacion', 'Ubicación'],
  ['#departamento', 'Departamento'],
  ['#galeria', 'Galería'],
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header className={`nav ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container nav__bar">
        <a href="#inicio" className="nav__logo" aria-label="San Joaquín, inicio">
          <Logo variant="h" />
        </a>
        <nav className="nav__links" aria-label="Principal">
          {LINKS.map(([h, l]) => (
            <a key={h} href={h} onClick={() => setOpen(false)}>
              {l}
            </a>
          ))}
          <a className="btn btn--primary btn--sm nav__cta" href="#contacto" onClick={() => setOpen(false)}>
            Agenda tu visita
          </a>
        </nav>
        <button className="nav__toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>
    </header>
  );
}

export function WhatsAppFab() {
  return (
    <a className="fab" href={waLink()} target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
      <IconWhatsApp width={28} height={28} />
    </a>
  );
}
