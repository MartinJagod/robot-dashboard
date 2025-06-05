// src/components/InfoSidebar.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalking, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import './InfoSidebar.css'; // Importa el CSS para el sidebar
const Card = ({ label, value, icon }) => (
  <div className="info-card">
    <span className="info-label">{label}</span>
      {icon && <FontAwesomeIcon icon={icon} className="info-icon" />}
    <span className="info-value">
      {value}
    </span>
  </div>
);

export default function InfoSidebar({ temp, hum, bedTemp, step, distance }) {
console.log('[DEBUG] punto actual', distance);
  /* lecturas en vivo */
  const tempNow    = `${temp?.toFixed(1)} °F`;
  const humNow     = `${hum?.toFixed(1)} %`;
  const bedTempNow = `${bedTemp?.toFixed(1)} °F`;
  const distanceNow = `${distance?.toFixed(1)} ft`; // ✅


  /* 1 · Working since: fijo */
  const workingSince = '09:51 am'; /* Aca va start date */

  /* 2 · Time working   => inicia 1 : 21 : 02 y suma 9 s por step */
  const baseWorking =  9 * 60 + 2;                // 4 862 s
  const timeWorkingSec = baseWorking + step * 9;
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
      <Card label="Ambient T°"  value={tempNow}   />
      <Card label="Humidity"    value={humNow}    />
      <Card label="Bed T°"      value={bedTempNow}/>

      <Card label="Working since" value={workingSince} />
      <Card label="Time working"  value={timeWorking}   />
      <Card label="Remaining"     value={remaining}     icon={faStopwatch} />
      <Card label="Distance made" value={distanceNow}      icon={faPersonWalking} />
    </aside>
  );
}
