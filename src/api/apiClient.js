import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

// Nuevo método que trae todos los robots
export const getRobotsData = async () => {
  const response = await api.get(`/robots`);
  return response.data;
};

