// src/hooks/useRobotData.js
import { useState, useEffect } from 'react';
import { getLiveStatus, getLapHistory } from '../services/robotService';

/* Medidas de la grilla (80 × 8) */
const COLUMNS = 80;
const ROWS    = 8;

/* Helpers -------------------------------------------------------------- */
const toF     = c => c * 9 / 5 + 32;
const pct2idx = (pct, size) => Math.min(Math.floor(pct * size), size - 1);

/* Transforma un punto del backend y calcula orientación ---------------- */
const transform = (raw, prev = null) => {
  const x = pct2idx(+raw.view_x, COLUMNS);
  const y = pct2idx(+raw.view_y, ROWS);

  let orientation = +raw.orientation || 0;

  if (prev) {
    const dx = x - prev.x;
    const dy = y - prev.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      orientation = dx > 0 ? 90 : -90;          // derecha | izquierda
    } else if (dy !== 0) {
      orientation = dy > 0 ? 180 : 0;           // abajo | arriba
    }
  }

  return {
    datetime: raw.datetime,
    start_time: raw.start_time,
    lap: +raw.laps,
    x,
    y,
    orientation,
    tempF: toF(+raw.room_temp),
    hum:   +raw.room_humidity,
    bedF:  toF(+raw.bed_temp),
    traveled_distance: +raw.traveled_distance || 0      // en metros
  };
};

/* Aplica transform a una lista ---------------------------------------- */
const applyTransform = rawList => {
  const result = [];
  for (let i = 0; i < rawList.length; i++) {
    const prev = result[i - 1] || null;
    result.push(transform(rawList[i], prev));
  }
  return result;
};

/* --------------------------------------------------------------------- */
/* Hook principal                                                        */
/* --------------------------------------------------------------------- */
/**
 * @param {string}  name         - Nombre del robot
 * @param {string}  date         - YYYY-MM-DD (día que se está viendo)
 * @param {'history'|'realTime'} mode
 * @param {number}  lapRequested - N° de vuelta para History
 * @param {number}  pollInterval - ms entre polls en Real-time (default 9000)
 */
export default function useRobotData({
  name,
  date,
  mode            = 'history',
  lapRequested    = 1,
  pollInterval    = 9000
}) {
  const [history, setHistory] = useState([]);
  const [live,    setLive]    = useState(null);
  const [lap,     setLap]     = useState(lapRequested);

  /* ------------------- carga inicial (History + Real-time) ----------- */
  useEffect(() => {
   // 🆕 resetea la vuelta actual para que el dashboard muestre el spinner
  setHistory([]);
    let active = true;

    (async () => {
      let livePoint = null;

      /* 1. Estado en vivo para saber qué vuelta corre */
      try {
        const rawLive = await getLiveStatus(name);
        livePoint = transform(rawLive);
        if (!active) return;
        setLive(livePoint);
        setLap(livePoint.lap);
      } catch {
        /* robot apagado o sin señal */
      }

      /* 2. Determinar cuál vuelta cargar inicialmente */
      const lapToLoad =
        mode === 'realTime' && livePoint ? livePoint.lap : lapRequested;
      const prevLapNum = lapToLoad > 1 ? lapToLoad - 1 : null;

      try {
        const prevLapRaw = prevLapNum
          ? await getLapHistory({ name, date, lap: prevLapNum })
          : [];
        const currLapRaw = await getLapHistory({ name, date, lap: lapToLoad });

        const prevLap = applyTransform(prevLapRaw);
        const currLap = applyTransform(currLapRaw);

        if (active) setHistory([...prevLap, ...currLap]);
      } catch (e) {
        console.error('useRobotData init', e);
      }
    })();

    return () => { active = false; };
  }, [name, date, lapRequested, mode]);

  /* ------------------- polling en vivo (solo en Real-time) ----------- */
  useEffect(() => {
    if (mode !== 'realTime' || pollInterval <= 0) return;

    const id = setInterval(async () => {
      try {
        const rawLive   = await getLiveStatus(name);
        const livePoint = transform(rawLive);
        setLive(livePoint);

        /* 1. Agrega punto si es nuevo (evita duplicados) */
        setHistory(prev =>
          prev.some(p => p.datetime === livePoint.datetime)
            ? prev
            : [...prev, livePoint]
        );

        /* 2. Si el robot empezó una vuelta nueva -> recargamos */
        if (livePoint.lap !== lap) {
          setLap(livePoint.lap);

          const prevLapNum = livePoint.lap > 1 ? livePoint.lap - 1 : null;
          const prevLapRaw = prevLapNum
            ? await getLapHistory({ name, date, lap: prevLapNum })
            : [];
          const currLapRaw = await getLapHistory({
            name,
            date,
            lap: livePoint.lap
          });

          const prevLap = applyTransform(prevLapRaw);
          const currLap = applyTransform(currLapRaw);

          setHistory([...prevLap, ...currLap]);
        }
      } catch {
        /* robot desconectado → ignoramos el fallo del fetch */
      }
    }, pollInterval);

    return () => clearInterval(id);
  }, [name, date, pollInterval, lap, mode]);

  return { history, live, lap };
}
