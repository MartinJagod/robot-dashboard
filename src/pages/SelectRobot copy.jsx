import { useState } from 'react';
import '../styles/SelectRobot.css';
import Footer from '../components/Footer';
/* ----------------------------------------------------------
   MOCKS PARA PRUEBA  (podés sumar o quitar sin tocar el código)
---------------------------------------------------------- */
const TEST_ROBOTS = [
  {
    id: 1,
    name: 'Floker-01',
    robotTag: 'Beetle 01',
    temperature: 24.3,
    humidity: 56,
    start_time: '18 : 05',
    time_working: '01 : 21 : 02',
    remaining_time: '01 : 54 : 55',
    distance: 134
  },
  {
    id: 2,
    name: 'Floker-02',
    robotTag: 'Beetle 02',
    temperature: 23.8,
    humidity: 58,
    start_time: '18 : 15',
    time_working: '00 : 47 : 00',
    remaining_time: '01 : 30 : 10',
    distance: 87
  },
  {
    id: 3,
    name: 'Floker-03',
    robotTag: 'Beetle 03',
    temperature: 25.1,
    humidity: 54,
    start_time: '17 : 50',
    time_working: '02 : 05 : 11',
    remaining_time: '00 : 40 : 20',
    distance: 201
  },
  {
    id: 4,
    name: 'Floker-04',
    robotTag: 'Beetle 04',
    temperature: 24.7,
    humidity: 57,
    start_time: '18 : 25',
    time_working: '00 : 12 : 33',
    remaining_time: '02 : 10 : 44',
    distance: 52
  },
  {
    id: 5,
    name: 'Floker-05',
    robotTag: 'Beetle 05',
    temperature: 24.2,
    humidity: 55,
    start_time: '18 : 30',
    time_working: '00 : 06 : 11',
    remaining_time: '02 : 17 : 19',
    distance: 15
  }
];

/* ----------------------------------------------------------
   COMPONENTE
---------------------------------------------------------- */
export default function SelectRobot () {
  /* Estado local únicamente con mocks */
  const [robots]  = useState(TEST_ROBOTS);
  const [current, setCurrent] = useState(0);         // índice tarjeta central

  /* --- Si más adelante quieres datos reales, descomenta ⬇️ ---
  useEffect(() => {
    fetch('/api/robots')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((data) => data?.length && setRobots(data))
      .catch(console.error);
  }, []);
  ----------------------------------------------------------- */

  /* Helpers */
  const mod   = (n, m) => ((n % m) + m) % m;         // verdadero módulo (+ loop)
  const prev  = ()     => setCurrent(i => mod(i - 1, robots.length));
  const next  = ()     => setCurrent(i => mod(i + 1, robots.length));
  const get   = (o)    => robots[mod(current + o, robots.length)];

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
      <button className="nav-btn left" onClick={prev}>‹</button>

      {/* ───────────── Tres tarjetas visibles ───────────── */}
      <div className="carousel-track">
        {[-1, 0, 1].map((offset) => {
          const r     = get(offset);
          const focus = offset === 0;                // tarjeta central
          return (
            <div
            key={r.id}
            className={`robot-card ${offset === 0 ? 'center' : 'side'}`}
            >
              {/* ---------- Encabezado ---------- */}
              <h2>{r.name}</h2>
              <span className="robot-pill">{r.robotTag}</span>

              {/* ---------- Temp / Hum big boxes ---------- */}
              <div className="metrics-grid">
                <div className="metric-box">
                  <span className="metric-number">{r.temperature}°C</span>
                  <span className="metric-label">Temperature</span>
                </div>
                <div className="metric-box">
                  <span className="metric-number">{r.humidity}%</span>
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
              <button onClick={() => window.location.href = `/dashboard/${r.id}`}>
                Enter
              </button>
            </div>
          );
        })}
      </div>

      {/* ───────────── Flecha derecha ───────────── */}
      <button className="nav-btn right" onClick={next}>›</button>
      </div>
       <Footer
             /*  onSettingsClick={() => setModalOpen(true)}  // 🚀 abre el modal
              onDownload={handleDownload}
              onPrint={handlePrint}
              onFullScreen={toggleFullScreen} */
              />
              </div>
  );
}
