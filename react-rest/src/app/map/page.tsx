"use client";
import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { SessionContext } from '@/context/SelectedSessionsContext';

const MapComponent = dynamic(() => import('@/components/map'), { ssr: false });

export default function Map() {
  const { selectedSessions, setSelectedSessions } = useContext(SessionContext);

  const handleClearAllSessions = () => {
    setSelectedSessions([]);
  };

  return (
    <div className="flex flex-row max-w-6xl mx-auto p-4">
      <div className="basis-1/3 mr-8 ml-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Map Options</h3>

          {/* Session Summary */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Selected Sessions</h4>
            <div className="text-sm text-gray-600 mb-3">
              {selectedSessions.length === 0 ? (
                <p>No sessions selected. Go to the Sessions page to add routes to the map.</p>
              ) : (
                <p>{selectedSessions.length} session{selectedSessions.length !== 1 ? 's' : ''} on map</p>
              )}
            </div>

            {selectedSessions.length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={handleClearAllSessions}
                  className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Clear All Sessions
                </button>
              </div>
            )}
          </div>

          {/* Session List */}
          {selectedSessions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Session Details</h4>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {selectedSessions.map((session, index) => {
                  const totalPoints = session.locations.length;
                  const validPoints = session.locations.filter(l => l.latitude && l.longitude).length;

                  return (
                    <div key={session.id} className="bg-gray-50 p-3 rounded text-sm">
                      <div className="font-medium truncate" title={session.name}>
                        {session.name}
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        {validPoints} valid locations
                        {totalPoints !== validPoints && (
                          <span className="text-orange-600"> ({totalPoints - validPoints} invalid)</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map Instructions */}
          <div className="mt-6 p-3 bg-blue-50 rounded text-sm">
            <h4 className="font-medium text-blue-900 mb-1">How to use:</h4>
            <ul className="text-blue-800 text-xs space-y-1">
              <li>• Go to Sessions page to select routes</li>
              <li>• Click "Add Selection to Map" to display routes</li>
              <li>• Different colors represent different sessions</li>
              <li>• S = Start point, E = End point</li>
              <li>• Click markers for detailed information</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="basis-2/3">
        <MapComponent
          height="600px"
          width="100%"
          showSessionControls={true}
        />
      </div>
    </div>
  );
}
