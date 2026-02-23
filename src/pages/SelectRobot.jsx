import { useEffect, useMemo, useState } from 'react';
import '../styles/SelectRobot.css';
import Footer from '../components/Footer';
import { getUid } from '../utils/gerUid';

/* ----------------------------------------------------------
   CONFIG: base URL de la API
   - Si tenés Vite, podés definir VITE_API_URL (p.ej. https://api.avirobots.com)
   - Si lo dejás vacío, usa relativo (mismo host)
---------------------------------------------------------- */
import { API_BASE } from "../utils/apiBase";
const uid = getUid();  

/* ----------------------------------------------------------
   HELPERS
---------------------------------------------------------- */
const pad2 = (n) => String(n).padStart(2, '0');
const humanDuration = (ms) => {
  if (ms == null || isNaN(ms) || ms < 0) return '—';
  const s = Math.floor(ms / 1000);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${pad2(hh)} : ${pad2(mm)} : ${pad2(ss)}`;
};
const hhmmFromISO = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  return `${pad2(d.getHours())} : ${pad2(d.getMinutes())}`;
};

/* ----------------------------------------------------------
   MAPEO: API -> forma que usa el UI actual
   La API devuelve campos como robot_id, robot_name, room_temp, etc.
   Los mapeamos a { id, name, robotTag, temperature, humidity, start_time, time_working, remaining_time, distance }
---------------------------------------------------------- */

const mapApiRobotToView = (r) => {
  const now = Date.now();
  const startISO = r?.last_start_time ?? null;
  const startMs = startISO ? new Date(startISO).getTime() : NaN;

  return {
    id: r.robot_id,
    name: r.robot_name,                   // título tarjeta
    robotTag: r.robot_name,               // pill (dejamos el mismo nombre, podés cambiar a un tag si lo tenés)
    temperature: r.room_temp ?? '—',
    humidity: r.room_humidity ?? '—',
    start_time: hhmmFromISO(startISO),
    time_working: isNaN(startMs) ? '—' : humanDuration(now - startMs),
    remaining_time: r.remaining_time ?? '—',
    distance: Math.round((r.traveled_distance ?? 0)),
  };
};

/* ----------------------------------------------------------
   COMPONENTE
---------------------------------------------------------- */
export default function SelectRobot () {
  // Estado ahora alimentado por la API (sin romper el resto del UI)
  const [robots, setRobots]   = useState([]);   // << antes era TEST_ROBOTS
  const [current, setCurrent] = useState(0);    // índice tarjeta central
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState(null);

const fmt1 = v => Number.isFinite(Number(v)) ? Number(v).toFixed(1) : '--';
const hasValue = v => v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v));

// helper arriba del componente
const fmtF = (c) => {
  const n = Number(c);
  if (!Number.isFinite(n)) return '--';
  return (n * 9/5 + 32).toFixed(1);   // 1 decimal
};


  useEffect(() => {
    let alive = true;
    const uid = getUid();

    if (!uid) {
      setErr('No hay usuario logueado (userId no encontrado en sessionStorage).');
      setLoading(false);
      return;
    }

    setLoading(true);
   fetch(`https://api.avirobots.com/api/users/${uid}/robots`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (!alive) return;
        const arr = Array.isArray(data) ? data : [];
        const mapped = arr.map(mapApiRobotToView);
        setRobots(mapped);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e.message || 'Error cargando robots');
        setLoading(false);
      });

    return () => { alive = false; };
  }, []);

  /* Helpers UI - CORREGIDO */
  const mod = (n, m) => {
    if (m === 0) return 0;
    return ((n % m) + m) % m;
  };
  
  const prev = () => setCurrent(i => mod(i - 1, robots.length));
  const next = () => setCurrent(i => mod(i + 1, robots.length));
  
  // Función mejorada para obtener el robot en la posición offset
  const get = (offset) => {
    if (robots.length === 0) return null;
    const index = mod(current + offset, robots.length);
    return robots[index];
  };

  /* Estados de carga / error (ligeros, no rompen el layout) */
  if (loading) {
    return (
      <div className="page">
        <img
          src="/Logos/aviRobotsLogo.png"
          alt="Avi Robots"
          className="h-12 object-contain logo-img"
          style={{ marginTop: '2rem', marginLeft: '2rem', display: 'block' }}
        />
        <div className="carousel-wrapper">
          <p style={{ padding: '2rem' }}>Cargando robots…</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (err) {
    return (
      <div className="page">
        <img
          src="/Logos/aviRobotsLogo.png"
          alt="Avi Robots"
          className="h-12 object-contain logo-img"
          style={{ marginTop: '2rem', marginLeft: '2rem', display: 'block' }}
        />
        <div className="carousel-wrapper">
          <p style={{ padding: '2rem', color: 'tomato' }}>Error: {err}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!robots.length) {
    return (
      <div className="page">
        <img
          src="/Logos/aviRobotsLogo.png"
          alt="Avi Robots"
          className="h-12 object-contain logo-img"
          style={{ marginTop: '2rem', marginLeft: '2rem', display: 'block' }}
        />
        <div className="carousel-wrapper">
          <p style={{ padding: '2rem' }}>No hay robots asignados a tu usuario.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <img
        src="/Logos/aviRobotsLogo.png"
        alt="Avi Robots"
        className="h-12 object-contain logo-img"
        style={{ marginTop: '2rem', marginLeft: '2rem', display: 'block' }}
      />

      <div className="carousel-wrapper">
        {/* ───────────── Flecha izquierda ───────────── */}
        <button className="nav-btn left" onClick={prev} disabled={robots.length <= 1}>‹</button>

        {/* ───────────── Tres tarjetas visibles ───────────── */}
        <div className="carousel-track">
          {[-1, 0, 1].map((offset) => {
            const r = get(offset);
            
            // Si no hay robot (caso de 1 o 2 robots), renderizar tarjeta vacía invisible
            if (!r) {
              return (
                <div
                  key={`empty-${offset}`}
                  className={`robot-card ${offset === 0 ? 'center' : 'side'}`}
                  style={{ visibility: 'hidden' }}
                />
              );
            }

            const online = hasValue(r.humidity);
            
            return (
              <div
                key={`${r.id}-${offset}`}
                className={`robot-card ${offset === 0 ? 'center' : 'side'}`}
              >
                {/* ---------- Encabezado ---------- */}
                <h2>{r.name}</h2>

                <span className={`robot-pill ${online ? 'is-online' : 'is-offline'}`}>
                  <span className="status-dot" />
                  {online ? 'On Line' : 'Off Line'}
                </span>

                {/* ---------- Temp / Hum big boxes ---------- */}
                <div className="metrics-grid">
                  <div className="metric-box">
                   <span className="metric-number">{fmtF(r.temperature)}°F</span>
                    <span className="metric-label">Temperature</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-number">{fmt1(r.humidity)}%</span>
                    <span className="metric-label">Humidity</span>
                  </div>
                </div>

                {/* ---------- Time working / Working since ---------- */}
                <div className="small-metrics">
                  <div className="small-metric">
                    <span>{r.time_working}</span>
                    <span>Time working</span>
                  </div>
                  <div className="small-metric">
                    <span>{r.start_time}</span>
                    <span>Working since</span>
                  </div>
                </div>

                {/* ---------- Remaining / Distance ---------- */}
                <div className="bottom-row">
                  <div className="bottom-box">
                    <span className="icon">⏱</span>{r.remaining_time}
                  </div>
                  <div className="bottom-box">{r.distance} ft</div>
                </div>

                {/* ---------- CTA ---------- */}
                <button onClick={() => window.location.href = `/heatmap/${uid}/${encodeURIComponent(r.id)}`}>
                  Enter
                </button>
              </div>
            );
          })}
        </div>

        {/* ───────────── Flecha derecha ───────────── */}
        <button className="nav-btn right" onClick={next} disabled={robots.length <= 1}>›</button>
      </div>

      <Footer />
    </div>
  );
}