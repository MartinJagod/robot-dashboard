// utils/robotTZ.js
export const ROBOT_TZ = {
  Beetle001: -4, Beetle003: -4, Beetle004: -4, BeetleUsa: -4,
  Beetle002: -3,
  Flocker001: -4, Flocker002: -4, Flocker003: -4, Flocker004: -4
};

/** Convierte un ISO (UTC-0) a Date local del robot */
export function toRobotLocalDate (name, iso) {
  const offset = ROBOT_TZ[name] ?? 0;           // fallback UTC
  const dUTC   = new Date(iso);
  return new Date(dUTC.getTime() + offset * 3_600_000);
}
/** Devuelve una etiqueta tipo "UTC-3" | "UTC+4" */
export function tzLabel (name) {
  const off = ROBOT_TZ[name];
  return off === undefined ? '' : `UTC${off >= 0 ? '+' : ''}${off}`;
}

export function getRobotOffset(robotName) {
  return ROBOT_TZ[robotName] ?? 0;
}


/* ✅ NUEVO: helpers de formato “congelando” en UTC */
export function formatRobotClock(name, iso, withSeconds = true) {
  if (!iso) return '--:--';
  const d = toRobotLocalDate(name, iso);
  return d.toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    timeZone: 'UTC'
  });
}

export function formatRobotDate(name, iso) {
  if (!iso) return '--';
  const d = toRobotLocalDate(name, iso);
  return d.toLocaleDateString('en-CA', { // YYYY-MM-DD
    year: 'numeric', month: '2-digit', day: '2-digit',
    timeZone: 'UTC'
  });
}