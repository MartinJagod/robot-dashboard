import { useState, useEffect, useRef } from 'react';
import { getRobotsStatus } from '../api/apiClient';

export const useRobots = (robotId) => {
  const [robots, setRobots] = useState([]);
  const robotsHistory = useRef({});

  const fetchData = async () => {
    try {
      const allRobotsData = await getRobotsStatus(robotId);

      // Protección contra undefined
      const robotsArray = Array.isArray(allRobotsData?.data) ? allRobotsData.data : [];

      setRobots(robotsArray);

      // Guardar historial de cada robot
      robotsArray.forEach(robot => {
        if (!robot) return; // Protegemos por si el robot viene vacío o nulo

        // Convertimos las fechas
        robot.start_time = new Date(robot.start_time);
        robot.datetime = new Date(robot.datetime);

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
      setRobots([]); // En caso de error, dejamos robots vacío para evitar otros errores
    }
  };

  useEffect(() => {
    if (robotId) {
      fetchData();
      const interval = setInterval(fetchData, 1000);
      return () => clearInterval(interval);
    }
  }, [robotId]);

  return { robots, robotsHistory: robotsHistory.current };
};
