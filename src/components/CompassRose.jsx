// CompassCardinal.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";

function normalizeHeading(input) {
  if (typeof input === "number" && isFinite(input)) {
    let d = input % 360;
    if (d < 0) d += 360;
    return d;
  }
  if (typeof input === "string") {
    const s = input.trim().toLowerCase();
    const map = {
      n: 0, norte: 0, north: 0,
      e: 90, este: 90, east: 90,
      s: 180, sur: 180, south: 180,
      w: 270, oeste: 270, west: 270, o: 270
    };
    if (s in map) return map[s];
  }
  return 0; // default N
}

function cardinalFromDegrees(deg) {
  // N:[315–360)∪[0–45), E:[45–135), S:[135–225), W:[225–315)
  if (deg >= 315 || deg < 45) return "N";
  if (deg < 135) return "E";
  if (deg < 225) return "S";
  return "W";
}

export default function CompassCardinal({ heading = 0, size = 40 }) {
  const deg = normalizeHeading(heading);
  const cardinal = cardinalFromDegrees(deg);

  // clase según punto cardinal
  const posClass =
    cardinal === "N" ? "pos-n" :
    cardinal === "E" ? "pos-e" :
    cardinal === "S" ? "pos-s" : "pos-w";

  return (
    <div
      className="compass-one"
      style={{ width: size, height: size }}
      aria-label={`Heading ${deg}° (${cardinal})`}
      title={`${cardinal} (${Math.round(deg)}°)`}
    >
      <FontAwesomeIcon icon={faCompass} className="compass-ring" />
      {/* puntero naranja opcional */}
      <span
        className="pointer"
        style={{ transform: `translate(-50%, -70%) rotate(${deg}deg)` }}
        aria-hidden="true"
      />
      {/* letra en la posición correcta */}
      <span className={`only-label ${posClass}`}>{cardinal}</span>
    </div>
  );
}
