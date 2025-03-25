import robotIcon from '../assets/robot-icon.svg';

const CorralMap = ({ robots }) => {
  const mapWidth = 200;
  const mapHeight = 400;

  const scaleX = (posX) => (posX + 0.5) * mapWidth;
  const scaleY = (posY) => (0.5 - posY) * mapHeight;

  return (
    <div style={{ 
      display: 'flex', 
      gap: '15px', 
      justifyContent: 'center', 
      overflow: 'auto', 
      padding: '16px' 
    }}>
      {robots.map(robot => (
        <div 
          key={robot.id}
          style={{ 
            position: 'relative',   // muy importante para posicionar correctamente al robot
            width: `${mapWidth}px`, 
            height: `${mapHeight}px`,
            backgroundColor: 'gray',
            border: '1px solid #aaa',
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <img
            src={robotIcon}
            alt={robot.name}
            title={robot.name}
            style={{ 
              position: 'absolute',
              transform: `
                translate(-50%, -50%)
                rotate(${robot.orientation ? ((robot.orientation - 1) * 360) : 0}deg)
              `, 
              left: `${scaleX(robot.position_x)}px`, 
              top: `${scaleY(robot.position_y)}px`,
              width: '30px',
              height: '30px',
              transition: 'all 0.5s ease-in-out'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CorralMap;
