// src/hooks/useRobotMovement.js
import { useState, useEffect, useRef } from 'react';

const getBaseOrientation = (prev, next) => {
  const dx = next.x - prev.x;
  const dy = next.y - prev.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 90 : -90;
  return dy > 0 ? 180 : 0;
};

export default function useRobotMovement(data, intervalMs = 9000) {
  const [position, setPosition]   = useState({ x: 0, y: 1 });
  const [orientation, setOrientation] = useState(0);
  const [values, setValues]       = useState({ temp: 0, hum: 0, bedTemp: 0 });
  const [step, setStep]           = useState(0);

  const idxRef  = useRef(0);
  const prevRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!data?.length) return;

    const move = () => {
      const p = data[idxRef.current];
      setPosition({ x: p.x, y: p.y });
      setOrientation(getBaseOrientation(prevRef.current, p));
      setValues({ temp: p.temp, hum: p.hum, bedTemp: p.bedTemp });
      setStep(s => s + 1);

      prevRef.current = { x: p.x, y: p.y };
      idxRef.current  = (idxRef.current + 1) % data.length;
    };

    const id = setInterval(move, intervalMs);
    return () => clearInterval(id);
  }, [data, intervalMs]);

  return { position, orientation, values, step };
}
