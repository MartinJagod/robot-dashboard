import { useState, useEffect, useRef } from 'react';
import { getRobotsStatus } from '../api/apiClient';

export const useRobots = (robotId) => {
  const [robots, setRobots] = useState([]);
  const robotsHistory = useRef({});

  const fetchData = async () => {
    try {
      const allRobotsData = await getRobotsStatus(robotId);
      const robotsArray = Array.isArray(allRobotsData) ? allRobotsData : [allRobotsData];

      setRobots(robotsArray);

      robotsArray.forEach(robot => {
        if (!robot) return;

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
          room_temp: robot.room_temp,
          room_hum: robot.room_hum,
          bed_temp: robot.bed_temp,
          battery: robot.battery,
          remaining_time: robot.remaining_time,
          timestamp: new Date().toISOString()
        });
      });

    } catch (error) {
      console.error("Error trayendo datos de robots:", error);
      setRobots([]);
    }
  };

  useEffect(() => {
    if (robotId) {
      if (!robotsHistory.current[robotId]) {
        robotsHistory.current[robotId] = [];
      }
      fetchData();
      const interval = setInterval(fetchData, 1000);
      return () => clearInterval(interval);
    }
  }, [robotId]);

  return { robots, robotsHistory: robotsHistory.current };
};
