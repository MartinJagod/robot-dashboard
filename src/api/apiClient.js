import axios from 'axios';

export const getRobotStatus = async (robotID) => {
  const response = await axios.get(`/api/robot/${robotID}`);
  return response.data;
};

export const getRobotsHistory = async (robotID) => {
  const response = await axios.get(`/api/robot/${robotID}/history`);
  return response.data;
};

// ESTA ES LA QUE ESTÁS IMPORTANDO EN EL HOOK
export const getRobotsStatus = async (robotID) => {
  const response = await axios.get(`/api/robot/${robotID}`);
  return response.data.data[0]; // ✅ devolvés el robot directamente
};

