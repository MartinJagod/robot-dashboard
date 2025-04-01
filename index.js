import express from 'express';
import axios from 'axios';
import path from 'path';
import cron from 'node-cron';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// Necesario si usás ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚀 Mapeo de robots a IPs en la VPN
const robotIpMap = {
  '11': '192.168.191.11',
  '12': '192.168.191.12',
  '13': '192.168.191.13',
  '14': '192.168.191.14',
  '15': '192.168.191.15',
  '16': '192.168.191.16',
  '17': '192.168.191.17',
};

// 🧠 Historial en memoria
const robotHistorial = {};

// 🔁 Ruta para consultar el estado del robot y guardar en historial
app.get('/api/robot/:id', async (req, res) => {
  const robotId = req.params.id;
  const robotIp = robotIpMap[robotId];

  if (!robotIp) {
    return res.status(404).json({ error: 'Robot no encontrado' });
  }

  try {
    const response = await axios.get(`http://${robotIp}:8000/robot/status`);
    const robotData = response.data;

    // Guardar historial
    if (!robotHistorial[robotId]) robotHistorial[robotId] = [];

    robotHistorial[robotId].push({
      timestamp: new Date().toISOString(),
      position_x: robotData.position_x,
      position_y: robotData.position_y,
      orientation: robotData.orientation,
      battery: robotData.battery,
    });

    res.json(robotData);
  } catch (err) {
    console.error('Error consultando robot:', err.message);
    res.status(500).json({ error: 'No se pudo conectar con el robot' });
  }
});

// 📤 Ruta para obtener historial del robot
app.get('/api/robot/:id/history', (req, res) => {
  const robotId = req.params.id;
  const history = robotHistorial[robotId] || [];
  res.json(history);
});

// 🧹 Limpieza diaria del historial a medianoche
cron.schedule('0 0 * * *', () => {
  const fecha = new Date().toISOString().split('T')[0]; // Ej: 2025-04-01
  const backupFile = path.join(__dirname, `historial-${fecha}.json`);

  fs.writeFileSync(backupFile, JSON.stringify(robotHistorial, null, 2), 'utf-8');
  console.log(`🗂️ Historial guardado en ${backupFile}`);

  // Limpiar historial
  for (const id in robotHistorial) {
    robotHistorial[id] = [];
  }

  console.log('🧹 Historial de robots limpiado a la medianoche');
});


// 🌐 Servir contenido estático de React
app.use(express.static(path.join(__dirname, 'dist')));

// 🎯 Soporte para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});
