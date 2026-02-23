import React, { useState, useEffect } from 'react';

import HeatmapGrid from '../components/HeatmapGrid';
import Legend from '../components/Legend';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/Navbar.css';
import InfoSidebar from '../components/InfoSidebar';
import '../styles/Dashboard.css';
import { interpolateGrid } from '../utils/interpolateGrid';
import SidebarMenu from '../components/SidebarMenu';
import useRobotData from '../hooks/useRobotData';



/* ───── grilla 80 × 8 ───── */
const COLUMNS = 80;
const ROWS = 8;
const CELL = 13;
const BASE_LEFT = 2;
const BASE_TOP = 36;
const BASE_ORIENTATION = 90;
const TARGET_MS = 4000;           // 4 s para completar la vuelta (ajústalo a gusto)
const MIN_STEP = 30;             // no bajes de ~30 ms para no saturar el main thread
/* ───────── NAVBAR completo ───────── */


const Navbar = ({ lap, onPrev, onNext, from, to, historyDate, placingDate, breedingDays }) => (
  <div className="navbar">
    <div className="center-section">
      <img src="/Logos/aviRobotsLogo.png" alt="Avi Robots" className="h-12 object-contain logo-img" />
      <div className="center-item"><span>Ambient T°</span><span>{`--°F`}</span></div>
      <div className="center-item"><span>Direction</span><span>--</span></div>
    </div>
    <div className="lap-navigation center-section">
      <ChevronLeft onClick={onPrev} style={{ cursor: 'pointer' }} />
      <div className="lap-number">

        <span>Lap {String(lap).padStart(2, '0')}</span> <br />
        <small className='spanFromTo'>From: {from}</small> <br />
        <small className='spanFromTo'>To: {to}</small>
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
);

/* ───────── SECTION ───────── */
const Section = ({ data, type, title, robotPosition, robotOrientation }) => {
  if (robotPosition) {
    const leftPx = BASE_LEFT + robotPosition.x * CELL;
    const topPx = BASE_TOP + (ROWS - 1 - robotPosition.y) * CELL;

    console.log('[Robot icon] left: ' + leftPx + 'px, top: ' + topPx + 'px');
  }

  return (
    <div className="heatmap-section">
      <div className="heatmap-grid-legend-container">
        <div className="heatmap-grid-wrapper" style={{ position: 'relative' }}>
          <HeatmapGrid data={data} type={type} columns={COLUMNS} rows={ROWS} title={title} />
          {robotPosition && (
            <img
              src="/assets/robot-icon.svg"
              alt="Robot"
              className="robot-icon"
              style={{
                position: 'absolute',
                left: `${BASE_LEFT + robotPosition.x * CELL}px`,
                top: `${BASE_TOP + (ROWS - 1 - robotPosition.y) * CELL}px`,

                transform: `rotate(${BASE_ORIENTATION - robotOrientation}deg)`,

                transition: 'left 0.1s linear, top 0.1s linear, transform 1s linear',
                width: 14, height: 14, zIndex: 10
              }}
            />
          )}
        </div>
        <aside className="heatmap-legend"><Legend type={type} title={title} /></aside>
      </div>
    </div>
  );
};




/* ───────── COMPONENTE ───────── */
export default function HeatmapDashboard() {

  /* ──── STATES ──── */
 const [lapRequested, setLapRequested] = useState(1);
 const [idx, setIdx] = useState(0);
 const [tempGrid, setTempGrid] = useState({});
 const [humGrid, setHumGrid] = useState({});
 const [bedGrid, setBedGrid] = useState({});
 const [fromTime, setFromTime] = useState('--');
 const [toTime, setToTime] = useState('--');
 const [loadingInterpolation, setLoadingInterpolation] = useState(false);
 const [lapFinished, setLapFinished] = useState(false);
 // 🔸 Sidebar / modo
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [mode, setMode] = useState('realTime');      // 'history' | 'realTime'
 const [selectedLap, setSelectedLap] = useState('');
 const [laps, setLaps] = useState([]);
 const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));


useEffect(() => {
  if (!selectedDate) {
    setLaps([]);           // limpia al des-seleccionar
    return;
  }

  fetch(`/api/laps?date=${selectedDate}`)
    .then(async (r) => {
      if (!r.ok) {                 // 404, 500, etc.
        console.warn('laps API', r.status);
        return [];                 // devolvés array vacío
      }
      const data = await r.json();
      return Array.isArray(data) ? data : [];
    })
    .then(setLaps)                 // ← siempre llega un array
    .catch((err) => {
      console.error(err);
      setLaps([]);
    });
}, [selectedDate]);


  /* ──── DATA ──── */
 const { history, live } = useRobotData({
  name: 'Flocker004',
  date: selectedDate,       // la elegida en el sidebar
  mode,                     // 'history' | 'realTime'
  lapRequested,             // Nº de vuelta elegido para History
  pollInterval: 9000        // 9 s – opcional (default ya es 9000)
});
  /* ──── Reiniciar al recibir nueva history ──── */
  useEffect(() => {
    if (!history.length) return;
    setIdx(0);
    setTempGrid({});
    setHumGrid({});
    setBedGrid({});
    setLapFinished(false);
  }, [history]);

  /* ──── Animación del robot (único intervalo válido) ──── */
  useEffect(() => {
    if (!history.length) return;

    const interval = Math.max(MIN_STEP, TARGET_MS / history.length);
    let i = 0;

    const id = setInterval(() => {
      setIdx(i++);
      if (i >= history.length) {
        clearInterval(id);
        setLapFinished(true);  // Al terminar, dispara interpolación
      }
    }, interval);

    return () => clearInterval(id);
  }, [history]);


  
  /* ──── Acumulación de datos del grid mientras el robot se mueve ──── */
  useEffect(() => {
    if (!history.length || lapFinished) return;

    const pRaw = history[idx];
    const p = pRaw
      ? {
        ...pRaw,
        distance: (pRaw.traveled_distance ?? 0) * 3.28084  // metros a pies
      }
      : { x: 0, y: 0, orientation: 0, tempF: 0, hum: 0, bedF: 0, distance: 0 };

    const key = `${p.x}-${p.y}`;


    setTempGrid(prev => ({
      ...prev,
      [key]: {
        sum: (prev[key]?.sum ?? 0) + p.tempF,
        count: (prev[key]?.count ?? 0) + 1
      }
    }));

    setHumGrid(prev => ({
      ...prev,
      [key]: {
        sum: (prev[key]?.sum ?? 0) + p.hum,
        count: (prev[key]?.count ?? 0) + 1
      }
    }));

    setBedGrid(prev => ({
      ...prev,
      [key]: {
        sum: (prev[key]?.sum ?? 0) + p.bedF,
        count: (prev[key]?.count ?? 0) + 1
      }
    }));

  }, [idx, history, lapFinished]);

  /* ──── Interpolación al finalizar la lap ──── */
  useEffect(() => {
    if (!lapFinished) return;

    setLoadingInterpolation(true);
    const timer = setTimeout(() => {
      setTempGrid(prev => interpolateGrid(prev, ROWS, COLUMNS));
      setHumGrid(prev => interpolateGrid(prev, ROWS, COLUMNS));
      setBedGrid(prev => interpolateGrid(prev, ROWS, COLUMNS));

      setLoadingInterpolation(false);
      setLapFinished(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [lapFinished]);

  /* ──── From/To (barra superior) ──── */
  useEffect(() => {
    if (!history.length || !history[0]?.start_time) {
      setFromTime('--');
      setToTime('--');
      return;
    }

    const start = new Date(history[0].start_time);
    const end = new Date(start.getTime() + history.length * 11 * 1000);

    const fmt = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setFromTime(fmt(start));
    setToTime(fmt(end));
  }, [history, lapRequested]);

  /* ──── Punto actual del robot ──── */
  const p = history[idx] || { x: 0, y: 0, orientation: 0, tempF: 0, hum: 0, bedF: 0 };

  const placingDate = "2025-05-05"; 
  const placingDateUS = new Date(placingDate).toLocaleDateString("en-US");
  const hDate = selectedDate ? new Date(selectedDate) : null;
const pDate = placingDate ? new Date(placingDate) : null;

const breedingDays =
hDate && pDate
? Math.floor((hDate - pDate) / (1000 * 60 * 60 * 24))
: '--'; 
  /* ──── Render final ──── */
  return (
    <div className="dashboard-wrapper">
      <Navbar
        key={fromTime + toTime}
        lap={lapRequested}
        onPrev={() => setLapRequested(l => Math.max(1, l - 1))}
        onNext={() => setLapRequested(l => l + 1)}
        from={fromTime}
        to={toTime}
        historyDate={selectedDate}
        placingDate={placingDateUS} 
        breedingDays={breedingDays}
   />
      <button className="hamburger"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Open menu">
        ☰
      </button>
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
      <div className="dashboard-content">
        <div className="sections-wrapper">
          <Section data={tempGrid} type="temperature" title="Ambient temperature"
            robotPosition={{ x: p.x, y: p.y }} robotOrientation={p.orientation} />
          <Section data={humGrid} type="humidity" title="Ambient humidity"
            robotPosition={{ x: p.x, y: p.y }} robotOrientation={p.orientation} />
          <Section data={bedGrid} type="temperature" title="SOIL Temperature"
            robotPosition={{ x: p.x, y: p.y }} robotOrientation={p.orientation} />
        </div>


        <InfoSidebar
          temp={p.tempF}
          hum={p.hum}
          bedTemp={p.bedF}
          step={idx + 1}
          lap={lapRequested}
          distance={p.traveled_distance * 3.28084}
        />
      </div>

      {loadingInterpolation && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
          <p>Processing data...</p>
        </div>
      )}

    </div>
  );
}
