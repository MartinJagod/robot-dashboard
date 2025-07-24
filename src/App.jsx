import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SelectRobot from './pages/SelectRobot';
import Dashboard from './pages/Dashboard';
import HeatmapDashboard from './pages/HeatmapDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-900 text-white">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-robot" element={<SelectRobot />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/heatmap/:id" element={<HeatmapDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
