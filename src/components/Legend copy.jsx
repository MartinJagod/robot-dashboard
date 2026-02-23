// src/components/Legend.jsx
import React from 'react';
import { getColorForValue } from './HeatmapGrid';
import './Legend.css';

const ranges = {
  temperature: [64,72, 76, 81, 85, 90, 95, 100],
  humidity:    [20, 30, 40, 45, 50, 55, 60, 70, 80],
  combined:    [83.5, 85.0, 86.5, 88, 89.5, 91, 92.5, 94, 98],
};

const Legend = ({ type }) => {
  const stops   = ranges[type];
  const format1 = n => Number(n).toFixed(1);

  // Tomamos todos menos el último valor y los invertimos (mayor → menor)
  const reversedStops = stops.slice(0).reverse();

  return (
    <div className="legend-wrapper">
      {reversedStops.map((min, i) => {
        // Primer bloque (i === 0) mostrará “> valor”
        const label =
          i == 0
            ? `> ${format1(min)}${type === 'temperature' ? '°F' : '%'}`
            : `${format1(min)}${type === 'temperature' ? '°F' : '%'}`;

        return (
          <div key={i} className="legend-item">
            <span
              className="legend-color-box"
              style={{ backgroundColor: getColorForValue(min, type) }}
            />
            <span className="legend-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Legend;
