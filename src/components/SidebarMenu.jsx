// SidebarMenu.jsx
import { memo } from 'react';
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
    laps,
    workdays = []  // ← NUEVO: array de fechas YYYY-MM-DD
  }) => {
    // Helper para verificar si una fecha está habilitada
    const isDateEnabled = (dateStr) => {
      if (!workdays.length) return true; // Si no hay datos, permitir todo
      return workdays.includes(dateStr);
    };

    // Obtener el rango de fechas (min y max)
    const minDate = workdays.length > 0 ? workdays[0] : null;
    const maxDate = workdays.length > 0 ? workdays[workdays.length - 1] : null;

    // Manejar cambio de fecha con validación
    const handleDateChange = (newDate) => {
      if (isDateEnabled(newDate)) {
        onDateChange(newDate);
      } else {
        // Opcional: mostrar mensaje o seleccionar la fecha más cercana
        console.warn(`⚠️ La fecha ${newDate} no está disponible`);
      }
    };

    return (
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* ---------- HEADER ---------- */}
        <header className="sidebar-header">
          <div className="avatar">
            <FontAwesomeIcon icon={faCircleUser} size="lg" color="#000000" />
          </div>

          <div className="header-text">
            <h3>
              <span className="hi">Hi, </span>
              <span className="client-name">Client&nbsp;001</span>
            </h3>
            <p>Mildmay, Canada.</p>
          </div>

          <button className="close-btn" onClick={onClose}>×</button>
        </header>

        {/* ---------- REAL-TIME MODE ---------- */}
        <section className="realtime-card">
          <button
            type="button"
            className="realtime-btn"
            onClick={() => {
              onDateChange('');         // 1️⃣ limpia fecha
              onLapChange('');          // 2️⃣ limpia vuelta
              setMode('history');       // 3️⃣ activa History
            }}
          >
            History Mode
          </button>

          {/* ---------- HISTORY MODE ---------- */}
          {mode === 'history' && (
            <section className="history-card">
              {/* Fecha con validación */}
              <label className="history-card__field">
                Date
                <input
                  type="date"
                  value={selectedDate}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  title={workdays.length > 0 
                    ? "Solo fechas donde el robot trabajó están disponibles" 
                    : "Cargando fechas disponibles..."}
                />
                {workdays.length > 0 && (
                  <small style={{ 
                    fontSize: '0.75rem', 
                    color: '#666', 
                    marginTop: '4px',
                    display: 'block' 
                  }}>
                    {workdays.length} días disponibles
                  </small>
                )}
              </label>

              {/* Lap selector */}
              <label className="history-card__field">
                <span>From - to:</span>
                <div className="select-wrapper">
                  <select
                    value={selectedLap}
                    disabled={laps.length === 0}
                    onChange={(e) => onLapChange(e.target.value)}
                  >
                    <option value="">
                      {laps.length === 0
                        ? 'No laps available'
                        : 'Seleccioná una vuelta…'}
                    </option>
                    {laps.map((lap) => (
                      <option key={lap.value} value={String(lap.value)}>
                        {lap.label}
                      </option>
                    ))}
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="chevron" />
                </div>
              </label>
            </section>
          )}
          <br/>
          <button
            type="button"
            className="realtime-btn"
            onClick={() => {
              const todayISO = new Date().toISOString().slice(0, 10);
              onDateChange(todayISO);      // 1️⃣ poné la fecha de hoy
              onLapChange('');             // 2️⃣ limpiá la vuelta
              setMode('realTime');         // 3️⃣ activá Real-time
            }}
          >
            Real time Mode
          </button>
        </section>
      </aside>
    );
  }
);

export default SidebarMenu;