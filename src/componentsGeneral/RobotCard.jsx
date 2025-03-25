import { Bot } from 'lucide-react';

const RobotCard = ({ robot }) => {
  return (
    <div className="bg-white shadow rounded-2xl p-4 mb-4" >
      <div className="flex items-center gap-3" >
        <Bot className="text-green-500" />
        <div>
          <h3 className="font-bold">{robot.name}</h3>
          <p className="text-sm text-gray-500">ID: {robot.id}</p>
        </div>
      </div>
      <div className="mt-2 text-sm">
        <p><strong>X:</strong> {robot.position_x.toFixed(2)}</p>
        <p><strong>Y:</strong> {robot.position_y.toFixed(2)}</p>
        <p><strong>Orientación:</strong> {robot.orientation.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default RobotCard;
