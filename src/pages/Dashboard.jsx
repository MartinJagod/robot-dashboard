import { useRobots } from '../hooks/useRobots';
import RobotCard from '../components/RobotCard';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  // Lista "hardcodeada" de robots
  const robotList = [
    { id: 61, name: 'Localhost' },
    { id: 11, name: 'Flocker001' },
    { id: 12, name: 'Flocker002' },
    { id: 13, name: 'Flocker003' },
    { id: 14, name: 'Flocker004' },
    { id: 15, name: 'Flocker005' },
    { id: 16, name: 'Flocker006' },
    { id: 17, name: 'Flocker007' },
    { id: 18, name: 'Flocker008' },

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

  const selectedRobot = robots.find(robot => String(robot.id) === selectedRobotId);


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
          start_time: history[index].start_time,
          name: history[index].name,
          laps: history[index].laps,
          traveled_distance: history[index].traveled_distance,
          lane_completition: history[index].lane_completition,
          orientation: history[index].orientation,
          current_lane: history[index].current_lane,
          last_corner: history[index].last_corner,
          room_temp: history[index].room_temp_measured,
          room_hum: history[index].room_hum_measured,
          bed_temp: history[index].bed_temp_measured,
          battery: history[index].battery,
          remaining_time: history[index].remaining_time
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
        id="robotSelector" name="robotSelector"
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
