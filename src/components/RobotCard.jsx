import robotIcon from '../assets/robot-icon.svg';

let lastPosX = 0
let lastPosY = 0
let lastCorner = 0

const RobotCard = ({ robot }) => {
  const cols = 8;
  const rows = 20;
  const cellSize = 20; // tamaño de cada casilla (20px)
  const mapWidth = cols * cellSize; // 160px
  const mapHeight = rows * cellSize; // 400px

  let scalePosition = (pos, size, margin) => {
    let pixelMargin = margin * size
    let gridWithMargins = size - cellSize * 2

    // In case of overflows
    pos = pos < 0 ? 0 : pos
    pos = pos > 1 ? 1 : pos

    return pixelMargin + pos * gridWithMargins;
  }

  let scaleX = () => {
    let posX = 0;
    // Half cell as margin
    const margin = 0.5/(cols-1)

    switch (robot.last_corner) {
      case 0: posX = 0; break;
      case 1: posX = robot.lane_completion; break;
      case 2: posX = 1; break;
      case 3: posX = 1 - robot.lane_completion; break;
    }

    if (lastCorner != robot.last_corner) {
      lastCorner = robot.last_corner
      lastPosX = posX
    }

    if (Math.abs(lastPosX - posX) < cellSize * 2) {
      lastPosX = posX
      return scalePosition(posX, mapWidth, margin);
    }
  };

  let scaleY = () => {
    let posY = 0;
    // Half cell as margin
    const margin = 0.5/(rows-1)
    switch (robot.last_corner) {
      case 0: posY = robot.lane_completion; break;
      case 1: posY = 1; break;
      case 2: posY = 1 - robot.lane_completion; break;
      case 3: posY = 0; break;
    }

    if (lastCorner != robot.last_corner) {
      lastCorner = robot.last_corner;
      lastPosY = posY;
    }

    if (Math.abs(lastPosY - posY) < cellSize) {
      lastPosY = posY
      return scalePosition(posY, mapHeight, margin);
    }
  };

  let currentLaneTraveled = () => {
    let lane_length = 0
    switch (robot.current_lane) {
      case 'short':
        lane_length = robot.short_lane;
        break;
      case 'long':
        lane_length = robot.long_lane;
        break;
    }
    let distance = robot.lane_completion * lane_length;

    return metersToFeet(distance)
  }

  let remainingTime = () => {
    let remainStr = ''
    let hours = Math.floor(robot.remaining_time / 60)
    let minutes = Math.floor(robot.remaining_time % 60)
    remainStr = `(${hours}h ${minutes}m)`
    return remainStr
  }

  let metersToFeet = (meters) => {
    let feet = meters * 3.28084
    return Math.round(feet, 2);
  }

  let celsiusToFahrenheit = (celsius) => {
    return Math.round(celsius * 9 / 5 + 32, 1);
  }

  let time_now = new Date()
  let time_start = new Date(robot.start_time)
  let timeDifference = time_now - time_start

  let workedHours = Math.floor(timeDifference / (1000 * 60 * 60)) || 0
  let workedMinutes = Math.floor(timeDifference / (1000 * 60) % 60) || 0
  let workedSeconds = Math.floor(timeDifference / 1000 % 60) || 0

  return (
    <div style={{
      width: '100%', maxWidth: '600px', margin: 'auto', padding: '20px',
      backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h2 style={{ color:'black', fontSize: '22px', textAlign: 'center', fontWeight: 'bold', marginBottom: '16px' }}>
        {robot.name} Location
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px', fontSize: '14px', color: '#555' }}>
        <span style={{ paddingTop: '3px' }}>Time Working:</span>
        <div style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '6px' }}> {workedHours} hs</div>
        <div style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '6px' }}> {workedMinutes} min</div>
        <div style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '6px' }}> {workedSeconds} sec</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
              border: '1px solid #ddd'
            }}>
            {Array.from({ length: cols * rows }).map((_, i) => (
              <div key={i} style={{ border: '1px solid #eee' }}/>
            ))}
          </div>
          <img
            src={robotIcon}
            alt={robot.name}
            style={{
              position: 'absolute',
              transform: `rotate(${180 - robot.orientation}deg)`,
              left: `${scaleX()}px`,
              top: `${scaleY()}px`,
              width: '20px',
              height: '20px',
              transition: 'all 0.5s ease-in-out'
            }}
          />
        </div>

        <div style={{ fontSize: '14px', color: '#444' }}>
          <p><strong>Start: </strong>{time_start.toLocaleString()} </p>
          <p><strong>Laps: </strong>{robot.laps} </p>
          <p><strong>Distance this lane: </strong>{currentLaneTraveled()} fts</p>
          <p><strong>Total traveled: </strong>{metersToFeet(robot.traveled_distance)} fts</p>
          <p><strong>Room Temperature: </strong>{celsiusToFahrenheit(robot.room_temp)}°F</p>
          <p><strong>Bed Temperature: </strong>{celsiusToFahrenheit(robot.bed_temp)}°F</p>
          <p><strong>Room Humidity: </strong>{Math.round(robot.room_hum, 2)}%</p>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '16px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', position: 'relative', marginRight: '8px' }}>
              <div style={{ width: '40px', height: '20px', border: '1px solid #333', backgroundColor: '#eee' }}>
                <div
                  style={{
                    width: Math.round(robot.battery) + '%',
                    backgroundColor: robot.battery > 50 ? '#4caf50' : robot.battery > 30 ? '#ffc107' : '#f44336',
                    height: '100%'
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: '12px', color: '#555' }}>
              {Math.round(robot.battery)}% <i>{remainingTime()}</i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotCard;
