// apiClient.js limpio
import axios from 'axios';

export const getRobotStatus = async (robotID) => {
  const response = await axios.get(`/api/robot/${robotID}`);
  return response.data;
};

export const getRobotsHistory = async (robotID) => {
  const response = await axios.get(`/api/robot/${robotID}/history`);
  return response.data;
};
