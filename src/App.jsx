import { useMemo } from 'react';
import Nav, { WhatsAppFab } from './components/Nav.jsx';
import Loader from './components/Loader.jsx';
import Hero from './sections/Hero.jsx';
import Masterplan from './sections/Masterplan.jsx';
import { Inversion, Ubicacion, Departamento, Galeria, ParaQuien, Contacto, Footer } from './sections/Content.jsx';
import { hasWebGL, useReducedMotion, useReveal, useTouch } from './hooks.js';

export default function App() {
  const webgl = useMemo(hasWebGL, []);
  const reduced = useReducedMotion();
  const touch = useTouch();
  useReveal();
  const p = { webgl, reduced, touch };
  return (
    <>
      <Loader />
      <a className="skip" href="#proyecto">Saltar al contenido</a>
      <Nav />
      <main>
        <Hero {...p} />
        <Inversion />
        <Masterplan {...p} />
        <Ubicacion {...p} />
        <Departamento {...p} />
        <Galeria {...p} />
        <ParaQuien {...p} />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
