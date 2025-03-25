import robotIcon from '../assets/robot-icon.svg';

const RobotCard = ({ robot }) => {
  console.log(robot);
  const cols = 8;
  const rows = 20;
  const cellSize = 20; // tamaño de cada casilla (20px)
  const mapWidth = cols * cellSize; // 160px
  const mapHeight = rows * cellSize; // 400px

  const scaleX = (posX) => (posX + 0.5) * mapWidth;
  const scaleY = (posY) => (0.5 - posY) * mapHeight;

  return (
    <div style={{
      width: '100%', maxWidth: '600px', margin: 'auto', padding: '20px',
      backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h2 style={{ fontSize: '22px', textAlign: 'center', fontWeight: 'bold', marginBottom: '16px' }}>
        {robot.name} Location
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px', fontSize: '14px', color: '#555' }}>
        Time Working:
        <div style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '6px' }}>02 hs</div>
        <div style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '6px' }}>03 min</div>
        <div style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '6px' }}>55 sec</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            border: '1px solid #ddd'
          }}>
            {Array.from({ length: cols * rows }).map((_, i) => (
              <div key={i} style={{ border: '1px solid #eee' }}></div>
            ))}
          </div>
          <img
            src={robotIcon}
            alt={robot.name}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) rotate(${robot.orientation ? ((robot.orientation - 1) * 360) : 0}deg)`,
              left: `${scaleX(robot.position_x)}px`,
              top: `${scaleY(robot.position_y)}px`,
              width: '20px',
              height: '20px',
              transition: 'all 0.5s ease-in-out'
            }}
          />
        </div>

        <div style={{ fontSize: '14px', color: '#444' }}>
          <p><strong>Start:</strong> 09:00 am</p>
          <p><strong>Laps:</strong> {robot.laps}</p>
          <p><strong>Distance:</strong> {robot.traveled_distance} mts</p>
          <p><strong>Remaining Time:</strong> 30 min</p>

          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '16px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', position: 'relative', marginRight: '8px' }}>
            <div style={{
  width: '40px',
  height: '20px',
  border: '1px solid #333',
  backgroundColor: '#eee'
}}>
  <div style={{ 
    width: Math.round(robot.battery) + '%',
    backgroundColor: robot.battery > 50 ? '#4caf50' : robot.battery > 30 ? '#ffc107' : '#f44336',
    height: '100%' 
  }}></div>
</div>
            </div>
            <span style={{ fontSize: '12px', color: '#555' }}>
  {Math.round(robot.battery)}%
</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotCard;
