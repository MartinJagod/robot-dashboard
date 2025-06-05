// src/App.jsx
import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import HeatmapDashboard from './pages/HeatmapDashboard';

function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' o 'heatmap'

  return (
    <div className="min-h-screen bg-neutral-900 text-white">

      {/* Contenido */}
      <main>
        {/* {view === 'dashboard' && <Dashboard />}
        {view === 'heatmap' && <HeatmapDashboard />} */}
        <HeatmapDashboard />
      </main>
      {/* Barra de navegación */}
     {/*  <nav className="flex space-x-4 p-4 bg-gray-800">
        <button
          onClick={() => setView('dashboard')}
          className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setView('heatmap')}
          className={`px-4 py-2 rounded ${view === 'heatmap' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Heatmap
        </button>
      </nav> */}
    </div>
  );
}

export default App;
