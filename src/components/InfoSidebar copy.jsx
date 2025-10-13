// src/components/InfoSidebar.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalking, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import './InfoSidebar.css'; // Importa el CSS para el sidebar
const Card = ({ label, value, icon }) => (
  <div className="info-card-wrapper2">
    <span className="info-label">{label}</span>
    <div className="info-card">
      <span className="info-value">
        {icon && <FontAwesomeIcon icon={icon} className="info-icon" />} {value}
      </span>
    </div>
  </div>
);

export default function InfoSidebar({ temp, hum, bedTemp, step, distance, datetime, startTime }) {
  /* lecturas en vivo */
  const tempNow = `${temp?.toFixed(1)} °F`;
  const humNow = `${hum?.toFixed(1)} %`;
  const bedTempNow = `${bedTemp?.toFixed(1)} °F`;
  const distanceNow = `${distance?.toFixed(1)} ft`; // ✅


  /* 1 · Working since */
  const workingSince = startTime
    ? new Date(startTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    : '--';

  /* 2 · Time working   = datetime − startTime */
  const timeWorkingSec =
    datetime && startTime
      ? Math.max(0, (new Date(datetime) - new Date(startTime)) / 1000)
      : 0;
  const timeWorking =
    new Date(timeWorkingSec * 1000).toISOString().substr(11, 8).replace(/:/g, ' : ');

  /* 3 · Remaining      => inicia 1 : 54 : 55 y resta 9 s por step */
  const baseRemaining = 4 * 3600 + 54 * 60 + 55;             // 6 895 s
  const remainingSec = Math.max(baseRemaining - step * 9, 0);
  const remaining =
    new Date(remainingSec * 1000).toISOString().substr(11, 8).replace(/:/g, ' : ');

  /* 4 · Distance       => inicia 2 ft y suma 7.22 ft por step */

  return (
    <aside className="info-sidebar">
      <Card label="Temperature" value={tempNow} />
      <Card label="Humidity" value={humNow} />
      <Card label="Operating time" value={timeWorking} />
      <Card label="Working since" value={workingSince} />
      <Card label="Remaining time" value={remaining} icon={faStopwatch} />
      <Card label="Distance made" value={distanceNow} icon={faPersonWalking} />
      {/*<Card label="Bed T°" value={bedTempNow} /> */}

    </aside>
  );
}
