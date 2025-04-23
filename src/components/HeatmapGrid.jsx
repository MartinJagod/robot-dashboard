import React from 'react';

/* ───────────────────────────────────────── getColorForValue ── */
export const getColorForValue = (value, type) => {
  if (type === 'temperature') {
    if (value < 65) return '#ffffcc';
    if (value < 69) return '#ffe699';
    if (value < 73) return '#ffcc66';
    if (value < 77) return '#ff9933';
    if (value < 82) return '#ff6600';
    return '#cc0000';
  }
  if (type === 'humidity') {
    if (value < 40) return '#d6eaf8';
    if (value < 55) return '#85c1e9';
    if (value < 70) return '#2e86c1';
    return '#154360';
  }
  if (type === 'combined') {
    if (value < 40) return '#d5f5e3';
    if (value < 55) return '#82e0aa';
    if (value < 70) return '#27ae60';
    return '#145a32';
  }
  return '#777';
};

/* ───────────────────────────────────────── HeatmapGrid ─────── */
const cellSize = 14;
const HeatmapGrid = ({ data, type, columns, rows, title }) => (
  <div className="my-8 w-fit">
    <h3 className="text-base font-semibold mb-2">{title}</h3>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        gridAutoRows: `${cellSize}px`,
        gap: 1,
        borderRadius: 8,
        overflow: 'hidden'
      }}
    >
      {Array.from({ length: rows * columns }).map((_, idx) => {
        const x = idx % columns;
        const y = Math.floor(idx / columns);
        const cell = data[`${x}-${y}`];
        const avg = cell ? cell.sum / cell.count : null;
        const bg = avg !== null ? getColorForValue(avg, type) : '#1e1e1e';
        return (
          <div
            key={idx}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: bg,
              border: '1px solid #333'
            }}
          />
        );
      })}
    </div>
  </div>
);
export default HeatmapGrid;
