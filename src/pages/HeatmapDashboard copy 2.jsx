import React, { useState, useEffect } from 'react';
import { memo, useMemo } from 'react';
import HeatmapGrid from '../components/HeatmapGrid';
import Legend from '../components/Legend';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import InfoSidebar from '../components/InfoSidebar';
import { interpolateGrid } from '../utils/interpolateGrid';
import SidebarMenu from '../components/SidebarMenu';
import useRobotData from '../hooks/useRobotData';
import '../styles/Dashboard.css';
import '../styles/Navbar.css';
import Footer from '../components/Footer';
import html2canvas from 'html2canvas';   // si vas a capturar pantalla (opcional)
import { jsPDF } from 'jspdf';
import { API_BASE } from '../utils/apiBase';
import RobotManagerModal from "../components/RobotManagerModal";
import CompassRose from "../components/CompassRose";
import { useParams } from "react-router-dom";

/* ───── grilla 80 × 8 ───── */
const COLUMNS = 80;
const ROWS = 8;
const CELL = 13;
const BASE_LEFT = 2;
const BASE_TOP = 22;
const BASE_ORIENTATION = 0;
const TARGET_MS = 4000;
const MIN_STEP = 30;          // no bajes de ~30 ms para no saturar el main thread
/* ───────── NAVBAR completo ───────── */

/* ─────── Constante global ─────── */
export let ROBOTS = [];          // referencia fija; mutamos su contenido
/* ─────── Carga inicial ─────── */
(async function preloadRobots() {
  try {
    const res = await fetch(`${API_BASE}/robots`);   // trae TODOS
    if (!res.ok) throw new Error("Bad response");

    const data = await res.json();                   // array de objetos
    /* 1. Filtra status === 1
       2. Extrae sólo name
       3. Elimina duplicados con Set (por si acaso) */
    const activeNames = [...new Set(
      data.filter(r => Number(r.status) === 1)
        .map(r => r.name.trim())
    )];

    /* 4. Mutamos el array const sin cambiar la referencia */
    ROBOTS.splice(0, ROBOTS.length, ...activeNames);

  } catch (err) {
    console.error("⚠️ No se pudieron cargar los robots:", err);
  }
})();

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
    direction = '--',
    selectedRobot,
    onRobotChange,
    isRealTime,
    mode
  }) => {
    // ➋ Robot seleccionado (se usará luego en useRobot)


    return (
      <div className="navbar">
        {/* ─────── Bloque central ─────── */}
        <div className="center-section">
          <div className="farm-info-box center-section" style={{ gap: '0.6rem' }}>
            {/* Flecha atrás (vuelve a SelectRobot.jsx) */}
            <a href="/select-robot" className="back-btn" aria-label="Volver">
              <ChevronLeft size={18} />
            </a>

            {/* Título + pill del robot */}
            <div className="barn-title-wrap">
              <div className="title-row">
                {/* Icono Home naranja */}
                <span className="home-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M3 10.5l9-7 9 7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" fill="currentColor" />
                  </svg>
                </span>
                <span className="barn-title">
                  Barn&nbsp;<strong className="barn-number">002</strong>
                </span>
              </div>

              {/* Pill con el nombre del robot (hardcodeado por ahora) */}
              <div className="robot-pill">{selectedRobot}</div>
            </div>
          </div>

          <CompassRose size={68} heading={180} />


          {/* ─────── Navegación de laps ─────── */}
          <div className="lap-navigation center-section">
            <span
              aria-hidden={isRealTime}
              style={{
                /* visibility: isRealTime ? 'hidden' : 'visible', */
                pointerEvents: isRealTime ? 'none' : 'auto'
              }}
            >
              <ChevronLeft onClick={onPrev} style={{ cursor: 'pointer' }} />
            </span>

            <div >
              <span className="lap-number">Lap {String(lap).padStart(2, '0')}</span><br />

             {mode === 'realTime' ? (
            /* Real-Time con punto rojo */
            <span style={{fontSize:"0.9rem", textAlign:"center"}} >
              Real Time Mode
              <span className="status-dot" />
            </span>
          ) : (
            /* History sin punto */
            <span >
            </span>
          )}
              <span aria-hidden={isRealTime}
                style={{
                  visibility: isRealTime ? 'hidden' : 'visible',
                  pointerEvents: isRealTime ? 'none' : 'auto'
                }}>

                <small className="spanFromTo">From: {from}</small><br />
                <small className="spanFromTo">To:&nbsp;&nbsp;&nbsp;{to}</small>
              </span>

            </div>

            <span
              aria-hidden={isRealTime}
              style={{
                visibility: isRealTime ? 'hidden' : 'visible',
                pointerEvents: isRealTime ? 'none' : 'auto'
              }}
            >
              <ChevronRight onClick={onNext} style={{ cursor: 'pointer' }} />
            </span>
          </div>


          <div className="center-item">
            <span style={{fontSize:"0.9rem", textAlign:"center"}} >Outside temperature</span>
            <span>{ambientTemp}</span>
          </div>

          <div className="center-item">
            <span style={{fontSize:"0.9rem", textAlign:"center"}}>Date</span><br />
            <span>{historyDate}</span></div>
          {/* ─────── NUEVO SELECT ─────── */}

          <div className="center-item robot-select" style={{ display: 'none' }}>
            <span>Select Robot:</span>
            <label className="history-card__field">
              <div className="select-robot-wrapper">
                <select
                  id="robot-select"
                  value={selectedRobot}
                  onChange={e => onRobotChange(e.target.value)}
                  className="robot-dropdown"
                >
                  <option value="">
                    {ROBOTS.length === 0 ? 'No robot available' : 'Select robot…'}
                  </option>
                  {ROBOTS.map(name => (
                    <option key={name} value={name}>
                      {name}            {/* ← aquí estaba faltando */}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

        </div>



        <div className="farm-info-box3" style={{ display: 'none' }}>
          <div><strong>Placing date:&nbsp;</strong><span>{placingDate}</span></div>
          <div><strong>Breeding days:&nbsp;</strong><span>{breedingDays}</span></div>
        </div>
        <img
          src="/Logos/aviRobotsLogo.png"
          alt="Avi Robots"
          className="h-12 object-contain logo-img"
        />
      </div>
    );
  }
);

/* ───────── SECTION ───────── */

const Section = memo(
  ({ data, type, title, robotPosition, robotOrientation, homeCoords }) => {
    console.log("Section", JSON.stringify(homeCoords))
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
        topPx: BASE_TOP + (ROWS - 1 - robotPosition.y) * CELL,
        orientationDeg: robotOrientation + BASE_ORIENTATION
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
              home={homeCoords}
            />

            {robotPosition && (
              <img
                src="/assets/robot-icon.svg"
                alt="Robot position"
                className="robot-icon"
                style={{
                  position: 'absolute',
                  left: `${leftPx}px`,
                  top: `${topPx}px`,
                  transform: `rotate(${orientationDeg}deg)`,
                  transition: 'left .12s linear, top .12s linear, transform 0.2s linear',
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
  const [lapRequested, setLapRequested] = useState(null);
  const [idx, setIdx] = useState(0);
  const [tempGrid, setTempGrid] = useState({});
  const [humGrid, setHumGrid] = useState({});
  const [bedGrid, setBedGrid] = useState({});
  const [fromTime, setFromTime] = useState('--');
  const [toTime, setToTime] = useState('--');
  const [loadingInterpolation, setLoadingInterpolation] = useState(false);
  const [lapFinished, setLapFinished] = useState(false);
  const { uid, robotid } = useParams(); // si tu ruta es /heatmap/:uid/:robotid
  const [selectedRobot, setSelectedRobot] = useState('');
  const [robotLoadErr, setRobotLoadErr] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  /* Sidebar / modo */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState('realTime');   // 'history' | 'realTime'
  const [selectedLap, setSelectedLap] = useState('');
  const [laps, setLaps] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  /* const { data, loading, error } = useRobotData(selectedRobot); */
  /* ──── API laps cuando cambia la fecha ──── */
  /*   useEffect(() => {
      if (!selectedDate) { setLaps([]); return; }
  
      fetch(`${API_BASE}/laps?date=${selectedDate}`)
        .then(r => (r.ok ? r.json() : []))
        .then(data => setLaps(Array.isArray(data) ? data : []))
        .catch(() => setLaps([]));
    }, [selectedDate]); */
  useEffect(() => {
    let cancelled = false;
    async function resolveName() {
      try {
        setRobotLoadErr(null);
        if (!robotid) return;
        const res = await fetch(`${API_BASE}/robots/${robotid}`);
        if (!res.ok) throw new Error('Robot no encontrado');
        const r = await res.json(); // { id, name, ... }
        if (!cancelled) setSelectedRobot(r.name);   // <-- SIEMPRE name
      } catch (e) {
        if (!cancelled) {
          setRobotLoadErr(e.message);
          setSelectedRobot(''); // sin fallback agresivo aquí
        }
      }
    }
    resolveName();
    return () => { cancelled = true; };
  }, [robotid]);
  useEffect(() => {
    let cancelled = false;
    async function resolveName() {
      try {
        setRobotLoadErr(null);
        // Ajustá el endpoint a tu backend real:
        // puede ser /api/robots/:id o /robots/:id
        const res = await fetch(`${API_BASE}/robots/${robotid}`);
        if (!res.ok) throw new Error('Robot no encontrado');
        const r = await res.json(); // { id, name, ... }
        if (!cancelled) setSelectedRobot(r.name);
      } catch (e) {
        if (!cancelled) {
          setRobotLoadErr(e.message);
          // fallback opcional para no romper la vista
          setSelectedRobot('Flocker004');
        }
      }
    }
    if (robotid) resolveName();
    return () => { cancelled = true; };
  }, [robotid]);



  const fmtClock = ts =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const setFromToByLap = lapNum => {
    const info = laps.find(l => l.value === lapNum);
    if (!info) return false;          // lap no disponible aún
    setFromTime(fmtClock(info.start_time));
    setToTime(fmtClock(info.end_time));
    return true;
  };

  /* -------------- helper reutilizable -------------- */
  const captureCanvas = async () => {
    const el = document.getElementById('dashboard-capture');
    if (!el) throw new Error('No se encontró el contenedor para capturar');

    // ↑↑ scale 2 → imagen + nítida
    return html2canvas(el, { scale: 2, useCORS: true });
  };

  /* -------------- ↓↓↓ handlers del Footer ↓↓↓ -------------- */
  const handleDownload = async () => {
    try {
      const canvas = await captureCanvas();
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'l' : 'p',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      if (!selectedRobot) { setSelectedRobot('Flocker004'); }

      pdf.save(`Avirobots_${selectedRobot}_${Date.now()}.pdf`);

    } catch (err) {
      console.error('Error al generar PDF:', err);
    }
  };
  const handlePrint = async () => {
    try {
      const canvas = await captureCanvas();
      const imgData = canvas.toDataURL('image/png', 1.0);

      const w = window.open('', '_blank');
      w.document.write(`
      <html>
        <head><title>Print</title>
          <style>html,body{margin:0;padding:0}</style>
        </head>
        <body>
          <img id="capture" src="${imgData}" style="width:100%;max-width:none"/>
        </body>
      </html>
    `);
      w.document.close();

      // Esperamos a que la IMG realmente cargue
      w.document.getElementById('capture').onload = () => {
        w.focus();
        w.print();
        w.close();
      };
    } catch (err) {
      console.error('Error al imprimir:', err);
    }
  };

  const toggleFullScreen = () => {
    const el = document.documentElement;
    document.fullscreenElement
      ? document.exitFullscreen()
      : el.requestFullscreen?.();
  };
  useEffect(() => {
    if (!selectedDate || !selectedRobot) return;

    (async () => {
      try {
        const robot = selectedRobot || 'Flocker004';   // fallback si aún no eligieron
        const url = `${API_BASE}/robot_lap_summary?name=${robot}&date=${selectedDate}`;
        console.log('⏳ Fetching laps', url);
        const res = await fetch(url);
        if (!res.ok) throw new Error('❌ No se pudieron obtener las vueltas');
        const data = await res.json();

        // helper local reutilizable
        const fmt = ts =>
          new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const mapped = (data.laps || []).map(lap => {
          const fmt = ts => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            value: lap.lap_number,
            label: `Vuelta ${lap.lap_number + 1} (${fmt(lap.start_time)} – ${fmt(lap.end_time)})`
            , start_time: lap.start_time,
            end_time: lap.end_time
          };
        });

        setLaps(mapped);

        if (mode === 'realTime') {
          const last = Math.max(...mapped.map(l => l.value));
          setSelectedLap(last);      //  ←  auto-sync solo RT
          setLapRequested(last);
          // ALSO: From / To inmediatos para el Navbar en RT
          const info = mapped.find(l => l.value === last);
          if (info) {
            setFromTime(fmt(info.start_time));
            setToTime(fmt(info.end_time));
          }

        } else {
          /* History: esperá a que el usuario elija */
          setSelectedLap('');        //  ←  placeholder
          setLapRequested(null);     //  ←  nada que reproducir aún
          setFromTime('--');
          setToTime('--');
        }
      } catch (err) {
        console.error(err);
        setLaps([]);
      }
    })();
  }, [selectedDate, mode, selectedRobot]);

  /* -- Sync inmediato Navbar en History -- */
  useEffect(() => {
    if (mode !== 'history') return;

    const info = laps.find(l => l.value === Number(selectedLap));
    if (!info) {                  // aún no eligieron
      setLapRequested(null);
      setFromTime('--');
      setToTime('--');
      return;
    }

    // 1️⃣ dispara (o mantiene) la animación
    setLapRequested(info.value);

    // 2️⃣ horas From / To para el encabezado
    const fmt = ts =>
      new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFromTime(fmt(info.start_time));
    setToTime(fmt(info.end_time));
  }, [mode, selectedLap, laps]);

  const POLL_MS = 9000; // 50s
  /* ──── DATOS robot (History + Real-time) ──── */
  const enabled = lapRequested !== null;

  const { history, live, lap, home } = useRobotData({
    name: selectedRobot || null,   // ← nombre del robot
    date: selectedDate,
    mode,
    lapRequested,                        // el hook lo usa sólo en 'history'
    pollInterval: mode === 'realTime' ? POLL_MS : null
  });



  /* ──── SINCRONIZAR lapRequested con lap en Real-time ──── */
  useEffect(() => {
    if (mode === 'realTime' && Number.isFinite(lap)) {
      setLapRequested(lap);
    } else if (mode === 'history') {
      setLapRequested(null);
    }
  }, [mode, lap]);



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
  /* -- Sync inmediato del encabezado en History -- */
  useEffect(() => {
    if (mode !== 'history') return;               // solo History

    const info = laps.find(l => l.value === Number(selectedLap));
    if (!info) {                                  // nada elegido aún
      setLapRequested(null);
      setFromTime('--');
      setToTime('--');
      return;
    }

    /* 1️⃣  Lanza (o mantiene) la animación */
    setLapRequested(info.value);                  // 0-based

    /* 2️⃣  Horas From / To instantáneas para el Navbar */
    const fmt = ts =>
      new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFromTime(fmt(info.start_time));
    setToTime(fmt(info.end_time));
  }, [mode, selectedLap, laps]);

  /* Animación SOLO en History */
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
  const p = { ...safePoint, distance: safePoint.traveled_distance * 3.28084 };

  /* Acumulación incremental  (History + Real-time) */
  useEffect(() => {
    if (!history.length) return;

    // ◀ punto a sumar:
    //    - En History → el que marca la animación (safePoint = history[idx])
    //    - En Real-time → el último punto recién llegado
    const p =
      mode === 'history'
        ? safePoint
        : history[history.length - 1];

    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
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
  }, [
    history.length,   // nuevo punto live cambia el length
    idx,              // avanza la animación
    mode
  ]);


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
  /*  useEffect(() => {
     if (mode !== 'history' || !history.length || !history[0]?.start_time) {
       setFromTime('--'); setToTime('--'); return;
     }
     const start = new Date(history[0].start_time);
     const end = new Date(start.getTime() + history.length * 11_000);
     const fmt = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     setFromTime(fmt(start)); setToTime(fmt(end));
   }, [mode, history, lapRequested]);
  */
  /* ──── Breeding days (independiente del modo) ──── */
  const placingDateStr = '05-05-2025';
  const placingDateView = new Date(placingDateStr).toLocaleDateString('en-US');
  const hDate = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US') : null;
  const pDate = new Date(placingDateStr).toLocaleDateString('en-US');
  const breedingDays =
    hDate ? Math.floor((hDate - pDate) / 86_400_000) : '--';

  /* ──── Render ──── */
  /* loadingHistory = true mientras esperamos el primer lote */
  const loadingHistory =
    mode === 'history' && history.length === 0;
  /* --- Re-calcula grids en modo realTime --- */
  useEffect(() => {
    if (mode !== 'realTime' || !history.length) return;

    // 1. parte ya recorrida de la vuelta
    const temp = {};
    const hum = {};
    const bed = {};

    for (const p of history) {
      const key = `${p.x}-${p.y}`;

      temp[key] = {
        sum: (temp[key]?.sum ?? 0) + p.tempF,
        count: (temp[key]?.count ?? 0) + 1
      };
      hum[key] = {
        sum: (hum[key]?.sum ?? 0) + p.hum,
        count: (hum[key]?.count ?? 0) + 1
      };
      bed[key] = {
        sum: (bed[key]?.sum ?? 0) + p.bedF,
        count: (bed[key]?.count ?? 0) + 1
      };
    }

    setTempGrid(temp);
    setHumGrid(hum);
    setBedGrid(bed);
  }, [mode, history]);

  const handleDateChange = (newDate) => {
    setLapRequested(null);   // <-- limpia antes del primer render
    setSelectedLap('');      // placeholder en el <select>
    setSelectedDate(newDate);
    setMode('history');
  };
  useEffect(() => {
    if (mode !== 'history') return;
    setFromToByLap(lapRequested);              // si aún no está → no hace nada
  }, [mode, lapRequested, laps]);

  return (
    <main id="dashboard-capture" /* tu grilla, leyenda, etc. */>

      <div className="dashboard-wrapper">
        <Navbar
          lap={(lapRequested ?? selectedLap) + 1}
          onPrev={() => setLapRequested(l => Math.max(1, l - 1))}
          onNext={() => setLapRequested(l => l + 1)}
          from={fromTime}
          to={toTime}
          historyDate={selectedDate}
          placingDate={placingDateView}
          breedingDays={breedingDays}
          selectedRobot={selectedRobot}
          onRobotChange={setSelectedRobot}
          isRealTime={mode === 'realTime'}
           mode={mode}
        />

        {/* Botón & Sidebar */}
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Open menu"
        >
          <span className="hamburger-icon">☰</span>

          {/* {mode === 'realTime' ? (
            <span className="hamburger-label">
              Real Time Mode
              <span className="status-dot" />
            </span>
          ) : (
            <span className="hamburger-label">
              History Mode
              <span className="status-dot" />
            </span>
          )} */}
        </button>
        <SidebarMenu
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          mode={mode}
          setMode={setMode}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          selectedLap={selectedLap}
          onLapChange={setSelectedLap}
          laps={laps}
          selectedRobot={selectedRobot}       // ← ahora lo recibe
          onRobotChange={setSelectedRobot}

        />

        {/* Contenido */}
        <div className="dashboard-content">
          <div className="sections-wrapper">
            <Section data={tempGrid} type="temperature" title="Ambient temperature"
              robotPosition={{ x: safePoint.x, y: safePoint.y }}
              robotOrientation={safePoint.orientation} homeCoords={home} />
            <Section data={humGrid} type="humidity" title="Ambient humidity"
              robotPosition={{ x: safePoint.x, y: safePoint.y }}
              robotOrientation={safePoint.orientation} homeCoords={home} />
            <Section data={bedGrid} type="temperature" title="Litter Temperature"
              robotPosition={{ x: safePoint.x, y: safePoint.y }}
              robotOrientation={safePoint.orientation} homeCoords={home} />
          </div>
          <div className="sections-wrapper2">

            <InfoSidebar
              temp={safePoint.tempF}
              hum={safePoint.hum}
              bedTemp={safePoint.bedF}
              step={idx + 1}
              lap={lapRequested}
              distance={safePoint.traveled_distance * 3.28084}
              datetime={safePoint.datetime}
              startTime={safePoint.start_time}
            />
          </div>
        </div>
        <Footer
          onSettingsClick={() => setModalOpen(true)}  // 🚀 abre el modal
          onDownload={handleDownload}
          onPrint={handlePrint}
          onFullScreen={toggleFullScreen}
        />
        {/* Popup CRUD */}
        <RobotManagerModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
        {(loadingHistory || loadingInterpolation) && (
          <div className="spinner-overlay">
            <div className="spinner"></div>
            <p>{loadingHistory ? 'Loading history...' : 'Processing data...'}</p>
          </div>
        )}

      </div>
    </main>
  );
}
