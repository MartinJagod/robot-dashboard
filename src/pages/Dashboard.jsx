import { useRobots } from '../hooks/useRobots';
import RobotCard from '../components/RobotCard';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  // Lista "hardcodeada" de robots
  const robotList = [
    // { id: 61, name: 'Localhost' }, // 
    { id: 11, name: 'Flocker001' },
    { id: 12, name: 'Flocker002' },
    { id: 13, name: 'Flocker003' },
    { id: 14, name: 'Flocker004' },
    { id: 15, name: 'Flocker005' },
    { id: 16, name: 'Flocker006' },
    { id: 17, name: 'Flocker007' },
  ];

  const [selectedRobotId, setSelectedRobotId] = useState('');

  const { robots, robotsHistory } = useRobots(selectedRobotId);

  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRobot, setPlaybackRobot] = useState(null);

  const handleSelectChange = (e) => {
    setSelectedRobotId(e.target.value);
    setPlaybackIndex(0);
    setIsPlaying(false);
    setPlaybackRobot(null);
  };

  const selectedRobot = robots.find(robot => robot.id === selectedRobotId);

  const handlePlayback = () => {
    const history = robotsHistory[selectedRobotId];
    if (!history || history.length === 0) return;

    setIsPlaying(true);
    setPlaybackIndex(0);

    let index = 0;
    const interval = setInterval(() => {
      if (index < history.length) {
        setPlaybackRobot({
          ...selectedRobot,
          position_x: history[index].position_x,
          position_y: history[index].position_y,
          orientation: history[index].orientation,
          battery: history[index].battery
        });
        index++;
        setPlaybackIndex(index);
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 500); // Velocidad del playback (0.5 seg)
  };

  return (
    <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <select
          value={selectedRobotId}
          onChange={handleSelectChange}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '100%', maxWidth: '300px' }}
        >
          <option value="">Seleccione un robot</option>
          {robotList.map((robotItem) => (
            <option key={robotItem.id} value={robotItem.id}>
              {robotItem.name} (ID: {robotItem.id})
            </option>
          ))}
        </select>

        <button
          onClick={handlePlayback}
          style={{ padding: '10px 16px', backgroundColor: '#28a745', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          disabled={isPlaying}
        >
          {isPlaying
            ? `Reproduciendo... (${playbackIndex}/${robotsHistory[selectedRobotId]?.length || 0})`
            : "▶️ Repetir recorrido"
          }
        </button>
      </div>

      {selectedRobot ? (
        <RobotCard robot={isPlaying && playbackRobot ? playbackRobot : selectedRobot} />
      ) : (
        <p style={{ color: '#777' }}>Selecciona un robot para mostrar información.</p>
      )}
    </div>
  );
};

export default Dashboard;
