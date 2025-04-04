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
          name: robot.name,
          laps: robot.laps,
          traveled_distance: robot.traveled_distance,
          lane_completition: robot.lane_completition,
          orientation: robot.orientation,
          current_lane: robot.current_lane,
          last_corner: robot.last_corner,
          room_temp: robot.room_temp_measured,
          room_hum: robot.room_hum_measured,
          bed_temp: robot.bed_temp_measured,
          battery: robot.battery,
          remaining_time: robot.remaining_time
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
