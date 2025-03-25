import { useState } from 'react';
import RobotCard from '../componentsGeneral/RobotCard';
import CorralMap from '../componentsGeneral/CorralMap';
import { useRobots } from '../hooks/useRobots';

const Dashboard = () => {
  const [newRobotId, setNewRobotId] = useState('');
  const { robots, addRobot } = useRobots();

  const handleAddRobot = () => {
    if (newRobotId.trim() !== '') {
      addRobot(newRobotId);
      setNewRobotId('');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard de Robots</h1>

      <CorralMap robots={robots} />

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="border rounded-lg p-2 flex-1"
          placeholder="Nuevo Robot ID"
          value={newRobotId}
          onChange={(e) => setNewRobotId(e.target.value)}
        />
        <button
          onClick={handleAddRobot}
          className="bg-green-500 text-white rounded-lg px-4 py-2"
        >
          Agregar Robot
        </button>
      </div>

      <div className="" style={{ display: 'flex', gap: '15px', justifyContent: 'space-between', overflow: 'auto', padding: '16px' }}>
        {robots.map(robot => (
          <RobotCard key={robot.id} robot={robot} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
