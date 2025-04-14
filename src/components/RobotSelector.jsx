import { useEffect, useState } from 'react';
import { getRobotConnections } from '../api/apiClient'; // si aún no lo tenías

const RobotSelector = ({ selectedId, changeEvent }) => {
	const [robotList, setRobotList] = useState([]);

	const fetchConnectedRobots = async () => {
		try {
			const robots = await getRobotConnections();
			setRobotList(robots);
		} catch (error) {
			console.error('Error fetching robots, using default values:', error);
			setRobotList([
				{ id: 0, name: 'Localhost' },
				{ id: 11, name: 'Flocker001' },
				{ id: 12, name: 'Flocker002' },
				{ id: 13, name: 'Flocker003' },
				{ id: 14, name: 'Flocker004' },
				{ id: 15, name: 'Flocker005' },
				{ id: 16, name: 'Flocker006' },
				{ id: 17, name: 'Flocker007' },
				{ id: 18, name: 'Flocker008' },
			]);
		}
	};

	useEffect(() => {
		fetchConnectedRobots();
		const interval = setInterval(() => {
			fetchConnectedRobots();
		}, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<select
			id="robotSelector"
			name="robotSelector"
			value={selectedId}
			onChange={changeEvent}
			style={{
				padding: '10px',
				borderRadius: '8px',
				border: '1px solid #ccc',
				width: '100%',
				maxWidth: '300px'
			}}
		>
			<option value="" disabled>
				Selecciona tu robot
			</option>

			{robotList.map((robotItem) => (
				<option key={robotItem.id} value={robotItem.id}>
					{robotItem.name} (ID: {robotItem.id})
				</option>
			))}
		</select>
	);
};

export default RobotSelector;
