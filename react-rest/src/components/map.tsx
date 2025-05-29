'use client';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { ISessionInfo, SessionContext } from '@/context/SelectedSessionsContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Props {
    height?: string;
    width?: string;
	sessions: ISessionInfo[];
	onRemoveSession?: (sessionId: string) => void;
	onClearAllSessions?: () => void;
	onRefreshSessions?: () => Promise<void>;
	refreshInterval?: number;
}

// Fix for missing marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: typeof window !== 'undefined' ? require('leaflet/dist/images/marker-icon-2x.png') : '',
  iconUrl: typeof window !== 'undefined' ? require('leaflet/dist/images/marker-icon.png') : '',
  shadowUrl: typeof window !== 'undefined' ? require('leaflet/dist/images/marker-shadow.png') : '',
});

const generateColor = (index: number): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  return colors[index % colors.length];
};

const Map = ({
		height = '600px',
		width = '100%',
		onRefreshSessions,
		refreshInterval
	}: Props) => {
	const { selectedSessions } = useContext(SessionContext);

	const intervalRef = useRef<NodeJS.Timeout>(null);

	useEffect(() => {
		if (!onRefreshSessions || !refreshInterval) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(() => {
			onRefreshSessions();
		}, refreshInterval * 1000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [onRefreshSessions, refreshInterval]);

	const polylineData = useMemo(() => {
		return selectedSessions.map((session, index) => {
		// Sort locations by recordedAt
		const sortedLocations = session.locations
			.filter(location => location.latitude && location.longitude)
			.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

		const positions = sortedLocations.map(location => [location.latitude, location.longitude] as [number, number]);

		return {
			id: session.id,
			name: session.name,
			positions,
			color: generateColor(index),
			startPoint: positions[0],
			endPoint: positions[positions.length - 1],
			startLocation: sortedLocations[0],
			endLocation: sortedLocations[sortedLocations.length - 1],
		};
		}).filter(data => data.positions.length > 0);
	}, [selectedSessions]);

	// Calculate center point based on all locations
	const mapCenter = useMemo(() => {
		if (polylineData.length === 0) {
		return [59.39543670246066, 24.66422566060926] as [number, number];
		}

		const allPositions = polylineData.flatMap(data => data.positions);
		if (allPositions.length === 0) {
		return [59.39543670246066, 24.66422566060926] as [number, number];
		}

		const avgLat = allPositions.reduce((sum, pos) => sum + pos[0], 0) / allPositions.length;
		const avgLng = allPositions.reduce((sum, pos) => sum + pos[1], 0) / allPositions.length;

		return [avgLat, avgLng] as [number, number];
	}, [polylineData]);

	// Create custom marker icons for start/end points
	const createCustomIcon = (color: string, isStart: boolean) => {
		return L.divIcon({
		className: 'custom-marker',
		html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 8px; color: white; font-weight: bold;">${isStart ? 'S' : 'E'}</div>`,
		iconSize: [15, 15],
		iconAnchor: [6, 6],
		});
	};

	return (
		<div className="relative">
			<MapContainer
				center={mapCenter}
				zoom={selectedSessions.length > 0 ? 13 : 16}
				scrollWheelZoom={true}
				style={{ height, width }}
			>
				<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* ICO marker */}
				{selectedSessions.length === 0 && (
				<Marker position={[59.39543670246066, 24.66422566060926]}>
					<Popup>I study here!</Popup>
				</Marker>
				)}

				{/* Render polylines and markers for each session */}
				{polylineData.map((data) => (
				<div key={data.id}>
					{/* Polyline for the session route */}
					<Polyline
						positions={data.positions}
						color={data.color}
						weight={4}
						opacity={0.8}
					/>

					{/* Start point marker */}
					{data.startPoint && data.startLocation && (
					<Marker
						position={data.startPoint}
						icon={createCustomIcon(data.color, true)}
					>
						<Popup>
						<div>
							<strong>{data.name}</strong><br />
							Start Point<br />
							Time: {new Date(data.startLocation.recordedAt).toLocaleString()}<br />
							Lat: {data.startPoint[0].toFixed(6)}<br />
							Lng: {data.startPoint[1].toFixed(6)}<br />
							Accuracy: {data.startLocation.accuracy}m<br />
							{data.startLocation.altitude !== 0 && (
							<>Altitude: {data.startLocation.altitude}m<br /></>
							)}
						</div>
						</Popup>
					</Marker>
					)}

					{/* End point marker */}
					{data.endPoint && data.endLocation && data.positions.length > 1 && (
					<Marker
						position={data.endPoint}
						icon={createCustomIcon(data.color, false)}
					>
						<Popup>
						<div>
							<strong>{data.name}</strong><br />
							End Point<br />
							Time: {new Date(data.endLocation.recordedAt).toLocaleString()}<br />
							Lat: {data.endPoint[0].toFixed(6)}<br />
							Lng: {data.endPoint[1].toFixed(6)}<br />
							Accuracy: {data.endLocation.accuracy}m<br />
							{data.endLocation.altitude !== 0 && (
							<>Altitude: {data.endLocation.altitude}m<br /></>
							)}
						</div>
						</Popup>
					</Marker>
					)}
				</div>
				))}
			</MapContainer>
		</div>
	);
	};

export default Map;
