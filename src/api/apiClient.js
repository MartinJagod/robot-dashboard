import axios from 'axios';

// Función que crea la instancia de axios según la IP
const createAxiosInstance = (robotID) => {
  const host = robotID > 50 ? 'localhost' : `192.168.191.${robotID}`
  return axios.create({ baseURL: `http://${host}:8000` });
};

// Método que la usa
export const getRobotsStatus = async (robotID) => {
  const api = createAxiosInstance(robotID);
  const response = await api.get('/robot/status');
  return response.data;
};
