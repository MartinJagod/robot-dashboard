import { useState, useEffect, useRef } from 'react';
import { getRobotsData } from '../api/apiClient';

export const useRobots = () => {
  const [robots, setRobots] = useState([]);
  
  // Aquí almacenaremos el historial de posiciones de cada robot
  const robotsHistory = useRef({});

  const fetchData = async () => {
    try {
      const allRobotsData = await getRobotsData();
      const robotsArray = allRobotsData.data;

      setRobots(robotsArray);

      // Guardar historial de cada robot
      robotsArray.forEach(robot => {
        if (!robotsHistory.current[robot.id]) {
          robotsHistory.current[robot.id] = [];
        }
        robotsHistory.current[robot.id].push({
          position_x: robot.position_x,
          position_y: robot.position_y,
          orientation: robot.orientation,
          timestamp: new Date().toISOString(),
          battery: robot.battery
        });
      });

    } catch (error) {
      console.error("Error trayendo datos de robots:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return { robots, robotsHistory: robotsHistory.current };
};
