// src/pages/HeatmapDashboard.jsx
import React from 'react';
import HeatmapGrid from '../components/HeatmapGrid';
import Legend from '../components/Legend';
import { generateMock } from '../utils/mockData';

const COLUMNS = 80;
const ROWS = 8;

const HeatmapDashboard = () => {
  const tempData = generateMock(ROWS, COLUMNS, 60, 90);
  const humData  = generateMock(ROWS, COLUMNS, 30, 90);
  const combinedData = {};
  Object.entries(tempData).forEach(([key, cell]) => {
    combinedData[key] = { count: 1, sum: (cell.sum + humData[key].sum) / 2 };
  });

  const Section = ({ data, type, title }) => (
    <div className="bg-white rounded-lg shadow p-4 flex gap-6">
      {/* Legend panel: fixed width */}
      <aside className="flex-none w-32">
        <h3 className="text-sm font-medium mb-2">{title}</h3>
        <Legend type={type} />
      </aside>

      {/* Heatmap panel: scrollable if overflow */}
      <div className="flex-1 overflow-x-auto">
        <HeatmapGrid
          data={data}
          type={type}
          columns={COLUMNS}
          rows={ROWS}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      <Section data={tempData}    type="temperature" title="Ambient temperature" />
      <Section data={humData}     type="humidity"    title="Ambient humidity" />
      <Section data={combinedData} type="combined"    title="Temperature + Humidity" />
    </div>
  );
};

export default HeatmapDashboard;
