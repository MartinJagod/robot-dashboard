// src/components/Legend.jsx
import React from 'react';
import { getColorForValue } from './HeatmapGrid';

const ranges = {
  temperature: [60, 65, 69, 73, 77, 82, 90],
  humidity:    [0, 40, 55, 70, 100],
  combined:    [0, 40, 55, 70, 100],
};

const Legend = ({ type }) => {
  const stops = ranges[type];
  return (
    <div className="flex flex-col gap-1 ml-4 select-none max-w-[200px]">
      {stops.slice(0, -1).map((min, i) => {
        const max = stops[i + 1];
        const mid = (min + max) / 2;
        const label = type === 'temperature'
          ? `${min}°F – ${max}°F`
          : `${min}% – ${max}%`;
        return (
          <div key={i} className="flex items-center gap-2">
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                backgroundColor: getColorForValue(mid, type),
                border: '1px solid #555',
                borderRadius: 2,
              }}
            />
            <span className="whitespace-nowrap text-sm">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Legend;
