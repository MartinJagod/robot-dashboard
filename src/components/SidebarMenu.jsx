// SidebarMenu.jsx
import  { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleUser,
  faCalendarAlt,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const SidebarMenu = memo(
  ({
    open,
    onClose,
    mode,
    setMode,
    selectedDate,
    onDateChange,
    selectedLap,
    onLapChange,
    laps
  }) => (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      {/* HEADER ------------------------------------------------------- */}
      <header className="sidebar-header">
        <div className="avatar">
          <FontAwesomeIcon icon={faCircleUser} size="lg" color="#fff" />
        </div>

        <div className="header-text">
          <h3>
            <span className="hi">Hi, </span>
            <span className="client-name">Client&nbsp;001</span>
          </h3>
          <p>Mildmay, Canada.</p>
        </div>

        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </header>

      {/* HISTORY MODE ------------------------------------------------- */}
      <section className="history-card">
        <header className="history-card__header">
          <span>History Mode</span>
          <FontAwesomeIcon icon={faCalendarAlt} />
        </header>

        {/* Fecha */}
        <label className="history-card__field">
          Date
          <input
            type="date"
            value={selectedDate}
            onChange={e => {
              onDateChange(e.target.value);
              setMode('history');
            }}
          />
        </label>

        {/* Lap selector */}
        <label className="history-card__field">
          <span>From - to:</span>
          <div className="select-wrapper">
            <select
              value={selectedLap}
              disabled={laps.length === 0}
              onChange={e => onLapChange(Number(e.target.value))}
            >
              <option value="">
                {laps.length === 0 ? 'No laps available' : 'Select lap…'}
              </option>
              {laps.map(lap => (
                <option key={lap.value} value={lap.value}>
                  {lap.label}
                </option>
              ))}
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="chevron" />
          </div>
        </label>
      </section>

      {/* REAL-TIME MODE ---------------------------------------------- */}
      <section className="realtime-card">
  <button
    type="button"
    className="realtime-btn"
   onClick={() => {
     /* 1️⃣ pone la fecha de hoy en el DatePicker */
     const todayISO = new Date().toISOString().slice(0, 10);
     onDateChange(todayISO);      // <- viene del padre

     /* 2️⃣ (opcional) limpiá la lap seleccionada */
     onLapChange('');             // o setSelectedLap('') en el padre

     /* 3️⃣ activa el modo Real-time */
     setMode('realTime');
   }}
  >
    Real time Mode
  </button>
</section>
    </aside>
  )
);

export default SidebarMenu;
