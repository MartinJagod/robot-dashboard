import React, { useState, useEffect } from 'react';
import  { memo, useMemo } from 'react';
import HeatmapGrid from '../components/HeatmapGrid';
import Legend from '../components/Legend';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import InfoSidebar from '../components/InfoSidebar';
import { interpolateGrid } from '../utils/interpolateGrid';
import SidebarMenu from '../components/SidebarMenu';
import useRobotData from '../hooks/useRobotData';
import '../styles/Dashboard.css';
import '../styles/Navbar.css';



/* ───── grilla 80 × 8 ───── */
const COLUMNS = 80;
const ROWS    = 8;
const CELL             = 13;
const BASE_LEFT        = 2;
const BASE_TOP         = 36;
const BASE_ORIENTATION = 0;
const TARGET_MS = 4000;
const MIN_STEP  = 30;          // no bajes de ~30 ms para no saturar el main thread
/* ───────── NAVBAR completo ───────── */

const Navbar = memo(
  ({
    lap,
    onPrev,
    onNext,
    from,
    to,
    historyDate,
    placingDate,
    breedingDays,
    ambientTemp = '--°F',
    direction   = '--'
  }) => (
    <div className="navbar">
      <div className="center-section">
        <img
          src="/Logos/aviRobotsLogo.png"
          alt="Avi Robots"
          className="h-12 object-contain logo-img"
        />
        <div className="center-item">
          <span>Ambient T°</span>
          <span>{ambientTemp}</span>
        </div>
        <div className="center-item">
          <span>Direction</span>
          <span>{direction}</span>
        </div>
      </div>

      <div className="lap-navigation center-section">
        <ChevronLeft onClick={onPrev} style={{ cursor: 'pointer' }} />
        <div className="lap-number">
          <span>Lap {String(lap).padStart(2, '0')}</span><br/>
          <small className="spanFromTo">From: {from}</small><br/>
          <small className="spanFromTo">To: {to}</small>
        </div>
        <ChevronRight onClick={onNext} style={{ cursor: 'pointer' }} />
      </div>

      <div className="farm-info-box center-section">
        <div><span>Farm: </span><span>A</span></div>
        <div><span>Barn id: </span><span>03</span></div>
        <div><span>Date: </span><span>{historyDate}</span></div>
      </div>

      <div className="farm-info-box3">
        <div><strong>Placing date: </strong><span>{placingDate}</span></div>
        <div><strong>Breeding days: </strong><span>{breedingDays}</span></div>
      </div>
    </div>
  )
);

/* ───────── SECTION ───────── */

const Section = memo(
  ({ data, type, title, robotPosition, robotOrientation }) => {
    /* ------- coordenadas seguras -------- */
    const { leftPx, topPx, orientationDeg } = useMemo(() => {
      if (
        !robotPosition ||
        !Number.isFinite(robotPosition.x) ||
        !Number.isFinite(robotPosition.y)
      ) {
        return { leftPx: 0, topPx: 0, orientationDeg: 0 };
      }
      return {
        leftPx: BASE_LEFT + robotPosition.x * CELL,
        topPx:  BASE_TOP  + (ROWS - 1 - robotPosition.y) * CELL,
        orientationDeg: BASE_ORIENTATION - robotOrientation
      };
    }, [robotPosition, robotOrientation]);

    return (
      <div className="heatmap-section">
        <div className="heatmap-grid-legend-container">
          <div className="heatmap-grid-wrapper" style={{ position: 'relative' }}>
            <HeatmapGrid
              data={data}
              type={type}
              columns={COLUMNS}
              rows={ROWS}
              title={title}
            />

            {robotPosition && (
              <img
                src="/assets/robot-icon.svg"
                alt="Robot position"
                className="robot-icon"
                style={{
                  position: 'absolute',
                  left:  `${leftPx}px`,
                  top:   `${topPx}px`,
                  transform: `rotate(${orientationDeg}deg)`,
                  transition: 'left .12s linear, top .12s linear, transform .12s linear',
                  width: 14,
                  height: 14,
                  zIndex: 10,
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>

          <aside className="heatmap-legend">
            <Legend type={type} title={title} />
          </aside>
        </div>
      </div>
    );
  }
);




/* ───────── COMPONENTE ───────── */
export default function HeatmapDashboard() {
  /* ──── STATES ──── */
  const [lapRequested, setLapRequested] = useState(1);
  const [idx, setIdx] = useState(0);
  const [tempGrid, setTempGrid] = useState({});
  const [humGrid,  setHumGrid]  = useState({});
  const [bedGrid,  setBedGrid]  = useState({});
  const [fromTime, setFromTime] = useState('--');
  const [toTime,   setToTime]   = useState('--');
  const [loadingInterpolation, setLoadingInterpolation] = useState(false);
  const [lapFinished, setLapFinished] = useState(false);

  /* Sidebar / modo */
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [mode,         setMode]         = useState('realTime');   // 'history' | 'realTime'
  const [selectedLap,  setSelectedLap]  = useState('');
  const [laps,         setLaps]         = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  /* ──── API laps cuando cambia la fecha ──── */
  useEffect(() => {
    if (!selectedDate) { setLaps([]); return; }

    fetch(`/api/laps?date=${selectedDate}`)
      .then(r => (r.ok ? r.json() : []))
      .then(data => setLaps(Array.isArray(data) ? data : []))
      .catch(() => setLaps([]));
  }, [selectedDate]);

  /* ──── DATOS robot (History + Real-time) ──── */
  const { history } = useRobotData({
    name: 'Flocker004',
    date: selectedDate,
    mode,                        // 'history' | 'realTime'
    lapRequested,
    pollInterval: 9000           // 9 s
  });
/* Punto actual protegido ------------------------------------------- */
const currentPoint =
  mode === 'history'
    ? history[idx]                     // puede ser undefined si history vacío
    : history[history.length - 1];     // idem

/* Fallbacks si aún no hay datos */
const safePoint = currentPoint ?? {
  x: 0,
  y: 0,
  orientation: 0,
  tempF: 0,
  hum: 0,
  bedF: 0,
  traveled_distance: 0
};
  /* ──── Reinicio de grids al recibir history ──── */
  useEffect(() => {
    if (!history.length) return;
    setIdx(0);
    setTempGrid({});
    setHumGrid({});
    setBedGrid({});
    setLapFinished(false);
  }, [history]);

  /* ──── Animación SOLO en History ──── */
  useEffect(() => {
    if (mode !== 'history' || !history.length) return;

    const interval = Math.max(MIN_STEP, TARGET_MS / history.length);
    let i = 0;

    const id = setInterval(() => {
      setIdx(i++);
      if (i >= history.length) {
        clearInterval(id);
        setLapFinished(true);
      }
    }, interval);

    return () => clearInterval(id);
  }, [mode, history]);

  /* ──── Punto actual del robot ──── */
const p    = { ...safePoint, distance: safePoint.traveled_distance * 3.28084 };

  /* ──── Acumulación de grids SOLO en History ──── */
  useEffect(() => {
    if (mode !== 'history' || !history.length || lapFinished) return;
    const p = safePoint;
    const key = `${p.x}-${p.y}`;

    setTempGrid(prev => ({
      ...prev,
      [key]: { sum: (prev[key]?.sum ?? 0) + p.tempF,
               count: (prev[key]?.count ?? 0) + 1 }
    }));
    setHumGrid(prev => ({
      ...prev,
      [key]: { sum: (prev[key]?.sum ?? 0) + p.hum,
               count: (prev[key]?.count ?? 0) + 1 }
    }));
    setBedGrid(prev => ({
      ...prev,
      [key]: { sum: (prev[key]?.sum ?? 0) + p.bedF,
               count: (prev[key]?.count ?? 0) + 1 }
    }));
  }, [mode, idx, history, lapFinished, currentPoint]);

  /* ──── Interpolación final (solo History) ──── */
  useEffect(() => {
    if (mode !== 'history' || !lapFinished) return;
    setLoadingInterpolation(true);
    const t = setTimeout(() => {
      setTempGrid(prev => interpolateGrid(prev, ROWS, COLUMNS));
      setHumGrid(prev => interpolateGrid(prev, ROWS, COLUMNS));
      setBedGrid(prev => interpolateGrid(prev, ROWS, COLUMNS));
      setLoadingInterpolation(false);
      setLapFinished(false);
    }, 2500);
    return () => clearTimeout(t);
  }, [mode, lapFinished]);

  /* ──── From / To para History ──── */
  useEffect(() => {
    if (mode !== 'history' || !history.length || !history[0]?.start_time) {
      setFromTime('--'); setToTime('--'); return;
    }
    const start = new Date(history[0].start_time);
    const end   = new Date(start.getTime() + history.length * 11_000);
    const fmt   = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFromTime(fmt(start)); setToTime(fmt(end));
  }, [mode, history, lapRequested]);

  /* ──── Breeding days (independiente del modo) ──── */
  const placingDateStr  = '2025-05-05';
  const placingDateView = new Date(placingDateStr).toLocaleDateString('en-US');
  const hDate = selectedDate ? new Date(selectedDate) : null;
  const pDate = new Date(placingDateStr);
  const breedingDays =
    hDate ? Math.floor((hDate - pDate) / 86_400_000) : '--';

  /* ──── Render ──── */
  /* loadingHistory = true mientras esperamos el primer lote */
const loadingHistory =
  mode === 'history' && history.length === 0;

  return (
    <div className="dashboard-wrapper">
      <Navbar
        lap={lapRequested}
        onPrev={() => setLapRequested(l => Math.max(1, l - 1))}
        onNext={() => setLapRequested(l => l + 1)}
        from={fromTime}
        to={toTime}
        historyDate={selectedDate}
        placingDate={placingDateView}
        breedingDays={breedingDays}
      />

      {/* Botón & Sidebar */}
      <button className="hamburger"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Open menu">☰</button>

      <SidebarMenu
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        mode={mode}
        setMode={setMode}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedLap={selectedLap}
        onLapChange={setSelectedLap}
        laps={laps}
      />

      {/* Contenido */}
      <div className="dashboard-content">
        <div className="sections-wrapper">
          <Section data={tempGrid} type="temperature" title="Ambient temperature"
            robotPosition={{ x: safePoint.x, y: safePoint.y }}
  robotOrientation={safePoint.orientation} />
          <Section data={humGrid} type="humidity" title="Ambient humidity"
   robotPosition={{ x: safePoint.x, y: safePoint.y }}/>
          <Section data={bedGrid} type="temperature" title="SOIL Temperature"
            robotPosition={{ x: safePoint.x, y: safePoint.y }}
  robotOrientation={safePoint.orientation} />
        </div>

        <InfoSidebar
            temp={safePoint.tempF}
  hum={safePoint.hum}
  bedTemp={safePoint.bedF}
          step={idx + 1}
          lap={lapRequested}
          distance={safePoint.distance}
        />
      </div>

  {(loadingHistory || loadingInterpolation) && (
  <div className="spinner-overlay">
    <div className="spinner"></div>
    <p>{loadingHistory ? 'Loading history...' : 'Processing data...'}</p>
  </div>
)}

    </div>
  );
}
