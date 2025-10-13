import React from 'react';
import './HeatmapGrid.css'; // << Importás el CSS nuevo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse }        from '@fortawesome/free-solid-svg-icons';
/* ───────────────────────────────────────── getColorForValue ── */
export const getColorForValue = (value, type) => {
  if (type === 'temperature') {
  // Escala basada en la imagen adjunta
  if (value >= 93)     return '#9A0000';  // 88 – 93 °F
  if (value >= 88)     return '#FE3103';  // 82 – 88 °F
  if (value >= 82)     return '#ffc300';  // 75 – 82 °F
  if (value >= 75)     return '#00B227';  // 68 – 74 °F
  if (value >= 68)      return '#25780D';  // Below 65 °F
  if (value < 68)      return '#153E89';  // Below 65 °F
  /* > 93 °F */
  return '#9A0000';                       // Above 93 °F
}
if (type === 'humidity') {
  // Escala de la imagen adjunta
  if (value >= 80)     return '#021840'; // 70 – 80 %
  if (value >= 70)     return '#153E89'; // 60 – 70 %
  if (value >= 60)     return '#256FCF'; // 55 – 60 %
  if (value >= 55)     return '#8A30CF'; // 50 – 55 %
  if (value >= 50)     return '#D679E4'; // 45 – 50 %
  if (value >= 45)     return '#3E8E2E'; // 40 – 45 %
  if (value >= 40)     return '#8FC588'; // 30 – 40 %
  if (value >= 20)     return '#989898'; // 20 – 30 %
  if (value < 20)      return '#C9C9C9'; // < 20 %
  /* > 80 % */
  return '#021840';
}

  if (type === 'combined') {
  if (value < 65)      return '#153E89';  // Below 65 °F
  if (value < 68)      return '#25780D';  // Below 65 °F
  if (value <= 75)     return '#00B227';  // 68 – 74 °F
  if (value <= 82)     return '#ffc300';  // 75 – 82 °F
  if (value <= 88)     return '#FE3103';  // 82 – 88 °F
  if (value <= 93)     return '#9A0000';  // 88 – 93 °F
  /* > 93 °F */
  return '#9A0000'; 
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
    {title && <h3 className="heatmap-title" >{title}</h3>}
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
