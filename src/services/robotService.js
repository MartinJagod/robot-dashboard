import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000
});

// Estado en tiempo real
export async function getLiveStatus(name) {
  const { data } = await api.get('/last_robot_status', { params: { name } });
  return data;
}

// Historial de una vuelta concreta
export async function getLapHistory({ name, date, lap }) {
  const { data } = await api.get('/robot_lap', {
    params: { name, date, lap }
  });
  return data;
}
