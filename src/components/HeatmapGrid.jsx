import React from 'react';
import './HeatmapGrid.css'; // << Importás el CSS nuevo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse }        from '@fortawesome/free-solid-svg-icons';
/* ───────────────────────────────────────── getColorForValue ── */
export const getColorForValue = (value, type) => {
  if (type === 'temperature') {
    if (value <= 64) return '#696969';
    if (value <= 72) return '#2121cf';
    if (value <= 76) return '#0092ff';
    if (value <= 81) return '#00abb2';
    if (value <= 85) return '#209000';
    if (value <= 90) return '#ffc300';
    if (value <= 95) return '#fe3103';
    if (value <= 100 ) return '#9a0000';

    return '#9a0000';
  }
  if (type === 'humidity') {
    if (value <= 20) return '#f0f0f0';
    if (value <= 30) return '#ccd8c9';
    if (value <= 40) return '#acf2a3';
    if (value <= 45) return '#78e4d4';
    if (value <= 50) return '#8eddff';
    if (value <= 55) return '#b7abfb';
    if (value <= 60) return '#6e70ea';
    if (value <= 70) return '#53039a';
    if (value <= 80) return '#38004e';
    return '#38004e';
  }
  if (type === 'combined') {
    if (value < 83.5) return '#696969';
    if (value < 85) return '#2121cf';
    if (value < 88.5) return '#0092ff';
    if (value < 89.5) return '#00abb2';
    if (value < 91) return '#209000';
    if (value < 92.5) return '#ffc300';
    if (value < 94) return '#fe3103';
    if (value < 98 ) return '#9a0000';

    return '#9a0000';
  }
  return '#ffffff';
};

/* ───────────────────────────────────────── HeatmapGrid ─────── */
const cellSize = 12;

const HeatmapGrid = ({ data, type, columns, rows, title, home }) => {
  /* ── 1. Coordenadas de la puerta ── */
 console.log('home', home.x, home.y);

  /* ── 2. Estilo dinámico del icono ── */
  const houseStyle = (() => {
    if (home.x == null || home.y == null) return { display: 'none' };

    /* Regla pedida: si y < 0.3 -> top fijo 147 px, left = x * 1000 */
    if (home.y < 0.3) {
      return {
        position: 'absolute',
        top: 120,
        left: home.x * 1000,
        transform: 'translate(-50%,0)',
        zIndex: 12
      };
    }
    if (home.y > 0.3) {
      return {
        position: 'absolute',
        top: -20,
        left: home.x * 1000,
        transform: 'translate(-50%,0)',
        zIndex: 12
      };
    }
    /* Para otros casos lo ocultamos (ajusta a gusto) */
    return { display: 'none' };
  })();

  /* ── 3. Render ── */
  return (
  <div className="heatmap-wrapper " >
    
    <FontAwesomeIcon icon={faHouse} className="house-start" style={houseStyle} />
    {title && <h3 className="heatmap-title">{title}</h3>}
    <div
      className="heatmap-grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        gridAutoRows: `${cellSize}px`,
      }}
    >
    {Array.from({ length: rows * columns }).map((_, idx) => {
  const x = idx % columns;
  const y = rows - 1 - Math.floor(idx / columns); // 🔁 Cambio acá
  const cell = data[`${x}-${y}`];
  const avg = cell ? cell.sum / cell.count : null;
  const bg = avg !== null ? getColorForValue(avg, type) : '#ffffff';
  return (
    <div
      key={idx}
      className="heatmap-cell"
      style={{ backgroundColor: bg }}
    />
  );
})}

    </div>
  </div>
);};

export default HeatmapGrid;
