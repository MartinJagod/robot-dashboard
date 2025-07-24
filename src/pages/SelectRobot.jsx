import { useEffect, useState } from 'react';
/* import './SelectRobot.css'; // opcional */

const SelectRobot = () => {
  const [robots, setRobots] = useState([]);

  useEffect(() => {
    fetch('/api/robots')
      .then((res) => res.json())
      .then((data) => setRobots(data))
      .catch((err) => console.error('Error cargando robots', err));
  }, []);

  return (
    <div className="select-robot-container">
      <h1>Select a Barn</h1>
      <div className="robot-cards">
        {robots.map((robot) => (
          <div className="robot-card" key={robot.id}>
            <h2>{robot.name}</h2>
            <p>🌡 Temp: {robot.temperature}°F</p>
            <p>💧 Humidity: {robot.humidity}%</p>
            <p>🕒 Working since: {robot.start_time}</p>
            <p>⏳ Remaining: {robot.remaining_time}</p>
            <p>📏 Distance: {robot.distance} ft</p>
            <button onClick={() => window.location.href = `/dashboard/${robot.id}`}>
              Ver Robot
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectRobot;
