'use client';
import { useContext, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { SessionContext } from '@/context/SelectedSessionsContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Props {
    sessionId?: string;
    refreshInterval?: number;
    height?: string;
    width?: string;
    showSessionControls?: boolean;
}

// Fix for missing marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: typeof window !== 'undefined' ? require('leaflet/dist/images/marker-icon-2x.png') : '',
  iconUrl: typeof window !== 'undefined' ? require('leaflet/dist/images/marker-icon.png') : '',
  shadowUrl: typeof window !== 'undefined' ? require('leaflet/dist/images/marker-shadow.png') : '',
});

// Generate distinct colors for different sessions
const generateColor = (index: number): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  return colors[index % colors.length];
};

const Map = ({
  sessionId,
  refreshInterval,
  height = '500px',
  width = '100%',
  showSessionControls = true
}: Props) => {
  const { selectedSessions, removeSelectedSession, setSelectedSessions } = useContext(SessionContext);

  // Process sessions to create polyline data
  const polylineData = useMemo(() => {
    return selectedSessions.map((session, index) => {
      // Sort locations by recordedAt to ensure correct order
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
        totalPoints: sortedLocations.length,
        duration: sortedLocations.length > 1 ?
          (new Date(sortedLocations[sortedLocations.length - 1].recordedAt).getTime() -
           new Date(sortedLocations[0].recordedAt).getTime()) / 1000 / 60 : 0 // duration in minutes
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

  const handleRemoveSession = (sessionId: string) => {
    removeSelectedSession(sessionId);
  };

  const handleClearAllSessions = () => {
    setSelectedSessions([]);
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

        {/* Default marker when no sessions are selected */}
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

      {/* Session controls and legend */}
      {showSessionControls && (
        <div className="absolute top-2 right-2 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-sm">Sessions ({selectedSessions.length})</h4>
            {selectedSessions.length > 0 && (
              <button
                onClick={handleClearAllSessions}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {selectedSessions.length === 0 ? (
            <p className="text-xs text-gray-600">No sessions selected</p>
          ) : (
            <div className="max-h-40 overflow-y-auto">
              {polylineData.map((data, index) => (
                <div key={data.id} className="flex items-center justify-between mb-2 text-xs group">
                  <div className="flex items-center flex-1 min-w-0 mr-2">
                    <div
                      className="w-3 h-3 rounded mr-2 flex-shrink-0"
                      style={{ backgroundColor: data.color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium" title={data.name}>
                        {data.name}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {data.totalPoints} points
                        {data.duration > 0 && (
                          <span> • {Math.round(data.duration)}min</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSession(data.id)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                    title="Remove session"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Map;
