import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import Logo from './Logo.jsx';

export default function Loader() {
  const { progress, active } = useProgress();
  const [gone, setGone] = useState(false);
  const [minTime, setMinTime] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMinTime(true), 900);
    const failsafe = setTimeout(() => setGone(true), 6000);
    return () => {
      clearTimeout(t);
      clearTimeout(failsafe);
    };
  }, []);
  useEffect(() => {
    if (minTime && !active) {
      const t = setTimeout(() => setGone(true), 300);
      return () => clearTimeout(t);
    }
  }, [minTime, active]);
  return (
    <div className={`loader ${gone ? 'is-gone' : ''}`} aria-hidden={gone}>
      <Logo variant="stack" className="loader__logo" />
      <div className="loader__bar">
        <i style={{ transform: `scaleX(${Math.max(0.08, progress / 100)})` }} />
      </div>
    </div>
  );
}
