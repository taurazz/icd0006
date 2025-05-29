"use client";
import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { ISessionInfo, SessionContext } from '@/context/SelectedSessionsContext';
import { GpsLocationService } from '@/services/GpsLocationService';

const MapComponent = dynamic(() => import('@/components/map'), { ssr: false });

export default function Map() {
	const { selectedSessions, removeSelectedSession, setSelectedSessions } = useContext(SessionContext);
  	const locationService = new GpsLocationService();
	const [ refreshInterval, setRefreshInterval ] = useState(10);

	const refreshSessionData = async () => {
		const updatedSessions: ISessionInfo[] = [];

		for (const session of selectedSessions) {
			try {
				const response = await locationService.getBySessionAsync(session.id);

				if (response.errors) {
					console.log(response.errors);
					continue;
				}

				const locations = response.data || [];
				updatedSessions.push({
					...session,
					locations: locations
				});

			} catch (error) {
				console.error("Error refreshing session:", error);
				updatedSessions.push(session);
			}
		}

		setSelectedSessions(updatedSessions);
	};

	const handleClearAllSessions = () => {
		setSelectedSessions([]);
	};

	return (
		<div className="flex flex-row max-w-6xl mx-auto p-4">
			<div className="basis-120">
				<div className="mr-8 ml-8 p-2">
					<div className="bg-grey border rounded-lg shadow-md p-4">
						<div className="mb-6">
							<h4 className="font-medium mb-2">Set map update interval:</h4>
							<div className="text-sm text-gray-400 mb-3">
							<select
								value={refreshInterval}
								onChange={(e) => setRefreshInterval(Number(e.target.value))}
								className="border px-2 py-1 h-10 rounded w-full bg-gray-800 text-white"
							>
								<option value={5}>5s</option>
								<option value={10}>10s</option>
								<option value={30}>30s</option>
								<option value={60}>1m</option>
								<option value={300}>5m</option>
								<option value={600}>10m</option>
							</select>

							</div>
						</div>
					</div>

				</div>
				<div className="mr-8 ml-8 p-2">
					<div className="bg-grey border rounded-lg shadow-md p-4">
						<div className="mb-6">
						<h4 className="font-medium mb-2">Selected Sessions</h4>
						<div className="text-sm text-gray-400 mb-3">
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

					{selectedSessions.length > 0 && (
						<div>
							<h4 className="font-medium mb-2">Session Details</h4>
							<div className="max-h-64 overflow-y-auto space-y-2">
								{selectedSessions.map((session, index) => {

								return (
									<div key={session.id} className="bg-gray-50 p-3 rounded text-sm relative group">
										{/* X Button */}
										<button
											onClick={() => removeSelectedSession(session.id)}
											className="p-2 absolute top-1 right-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity text-xl font-bold cursor-pointer"
											title="Remove session"
										>
											X
										</button>
										<div>
											<div className="font-medium truncate text-black" title={session.name}>
												{session.name}
											</div>
											<div className="text-gray-600 text-xs mt-1">
												{(() => {
													try {
														const parsed = JSON.parse(session!.gpsSessionType);
														return parsed.en || 'N/A';
													} catch {
														return session!.gpsSessionType;
													}
												})()}
												<br />
												{session.userFirstLastName}
											</div>
										</div>
									</div>
								);
								})}
							</div>
						</div>
					)}
					</div>
				</div>
			</div>

			<div className="basis-2/3">
				<MapComponent
				height="600px"
				width="100%"
				sessions={selectedSessions}
				onRemoveSession={removeSelectedSession}
				onClearAllSessions={() => setSelectedSessions([])}
				onRefreshSessions={refreshSessionData}
				refreshInterval={refreshInterval}
				/>
			</div>
		</div>
	);
}
