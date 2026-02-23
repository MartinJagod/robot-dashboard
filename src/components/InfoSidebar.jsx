// src/components/InfoSidebar.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalking, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import './InfoSidebar.css'; // Importa el CSS para el sidebar
import { toRobotLocalDate } from '../utils/robotTZ';

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

// Formato HH : MM (sin segundos)
const fmtHM = (d) => {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh} : ${mm}`;
};

export default function InfoSidebar({ robotName, temp, hum, bedTemp,
                                     step, distance, datetime, startTime }) {
  /* lecturas en vivo */
  const tempNow = `${temp?.toFixed(1)} °F`;
  const humNow = `${hum?.toFixed(1)} %`;
  const bedTempNow = `${bedTemp?.toFixed(1)} °F`;
  const distanceNow = `${distance?.toFixed(1)} ft`; // ✅

  // Formato de "Working since" usando timezone del robot
  const workingSince = startTime 
    ? fmtHM(toRobotLocalDate(robotName, startTime))
    : '--:--';

  /* 2 · Time working = datetime − startTime (sin segundos) */
  const timeWorkingSec =
   datetime && startTime
     ? Math.max(
         0,
         (toRobotLocalDate(robotName, datetime) -
          toRobotLocalDate(robotName, startTime)) / 1000)
      : 0;
  const timeWorking =
    new Date(timeWorkingSec * 1000).toISOString().substr(11, 5).replace(/:/g, ' : ');

  /* 3 · Remaining => inicia 1 : 54 y resta 9 s por step (sin segundos) */
  const baseRemaining = 4 * 3600 + 54 * 60 + 55;             // 6 895 s
  const remainingSec = Math.max(baseRemaining - step * 9, 0);
  const remaining =
    new Date(remainingSec * 1000).toISOString().substr(11, 5).replace(/:/g, ' : ');

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