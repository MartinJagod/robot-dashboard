// src/components/Legend.jsx
import React from 'react';
import { getColorForValue } from './HeatmapGrid';
import './Legend.css';

const ranges = {
  /* Ascendente (mínimos incluidos) */
  temperature: [65, 68, 75, 82, 88, 93],                        // °F
  humidity:    [20, 30, 40, 45, 50, 55, 60, 70, 80],        // %
  combined:    [83.5, 85.0, 86.5, 88, 89.5, 91, 92.5, 94],  // sin unidad
};

const Legend = ({ type }) => {
  const stops = ranges[type];
  if (!stops) return null;               // Parámetro “type” desconocido

  const unit = type === 'temperature' ? '°F'
            : type === 'humidity'    ? '%'
            : '';

  /* Formateo compacto: enteros sin decimales, otros con una décima */
  const fmt = n => (Number.isInteger(n) ? n : n.toFixed(1));

  /* Pasamos a descendente para pintar del valor alto al bajo */
  const reversed = stops.slice().reverse();

  return (
    <div className="legend-wrapper">
      {reversed.map((min, i) => {
        const prev = i === 0 ? null : reversed[i - 1]; // valor superior
        let label;

        if (i === 0) {
          label = `Above ${fmt(min)}${unit}`;
        } else if (i === reversed.length - 1) {
          label = `Below ${fmt(min)}${unit}`;
        } else {
          label = `${fmt(min)} – ${fmt(prev)}${unit}`;
        }

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
