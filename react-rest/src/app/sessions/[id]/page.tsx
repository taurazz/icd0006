"use client";

import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { IGpsSession } from "@/types/domain/IGpsSession";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { AxiosError } from "axios";
import { ISessionInfo, SessionContext } from "@/context/SelectedSessionsContext";
import { GpsLocationService } from "@/services/GpsLocationService";

export default function Session() {
	const router = useRouter();
	const sessionService = new GpsSessionService();
	const locationService = new GpsLocationService();
	const params = useParams();
	const id = params?.id as string | undefined;

	const { accountInfo } = useContext(AccountContext);
	const userFirstLastName = accountInfo!.firstName! + ' ' + accountInfo!.lastName;
	const { selectedSessions, addSelectedSession, setSelectedSessions } = useContext(SessionContext);

	const [session, setSession] = useState<IGpsSession>();
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	let sessionData: ISessionInfo;


	useEffect(() => {
		if (!accountInfo?.jwt) {
			router.push("/login");
			return;
		}
		const fetchData = async () => {
			try {
				if (!id) {
					console.log("undefined id");
					return;
				}

				const result = await sessionService.getAsync(id);

				if (result.errors) {
					console.log(result.errors);
					return;
				}

				setSession(result.data!);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [accountInfo, router]);

	if (loading) {
		return <div>Loading...</div>;
	}

	const handleDelete = async (id: string) => {
		try {
			var handleDeleteSession = await sessionService.deleteAsync(id)

			if (handleDeleteSession.errors) {
				setErrorMessage(handleDeleteSession.statusCode + " - " + handleDeleteSession.errors[0]);
				return;
			}

			router.push("/sessions");
			setErrorMessage("");
		} catch (error) {
			setErrorMessage((error as AxiosError).message);
		}
	}

	const handleAddToMap = async (session: IGpsSession) => {
		const selectedSessionsData: ISessionInfo[] = [];
		try {
			const response = await locationService.getBySessionAsync(session.id!)

			if (response.errors) {
				console.log(response.errors)
			}

			const locations = response.data || [];
			if (session.id) {
						selectedSessionsData.push({
						id: session.id,
						name: session.name,
						locations: locations,
						gpsSessionType: session.gpsSessionType,
						userFirstLastName: session.userFirstLastName
					});
			}
		} catch (error) {
			console.error("Error fetching locations:", error);
		}
		selectedSessionsData.forEach(session => {
			console.log(session)
            const exists = selectedSessions.find(s => s.id === session.id);
            if (!exists) {
				addSelectedSession(session);
            }
        });
	}

	return (
		<>
		<div className="flex flex-col items-center">

			<div className="flex justify-between w-full max-w-3xl p-4 items-center">
				<h1 className="text-2xl font-semibold">Session info</h1>
				<div className="flex">
				<button className="flex items-center gap-1 border px-4 py-2 rounded m-2 cursor-pointer"
					onClick={() => handleAddToMap(session!)}>
						Add to Map
				</button>
				{userFirstLastName === session!.userFirstLastName && (
					<><button className="flex items-center gap-1 border px-4 py-2 rounded m-2">
							<Link href={`/sessions/edit/${id}`}>Edit</Link>
						</button>
						<button className="flex items-center gap-1 border px-4 py-2 rounded m-2 cursor-pointer"
						onClick={() => handleDelete(id!)}>
							Delete
						</button></>
				)}
				</div>
			</div>

			<div className="flex justify-center w-full max-w-3xl">
				<table className="table-fixed border-collapse border border-gray-300 w-full text-left">
					<tbody>
						<tr>
							<th className="border px-3 py-2">Name</th>
							<td className="border px-3 py-2">{session!.name}</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">Description</th>
							<td className="border px-3 py-2">{session!.description}</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">Recorded at</th>
							<td className="border px-3 py-2">
								{format(new Date(session!.recordedAt), 'yyyy-MM-dd HH:mm')}
							</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">Duration</th>
							<td className="border px-3 py-2">{session!.duration}</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">Speed</th>
							<td className="border px-3 py-2">{session!.speed}</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">Distance</th>
							<td className="border px-3 py-2">{session!.distance}</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">Climb</th>
							<td className="border px-3 py-2">{session!.climb}</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">Descent</th>
							<td className="border px-3 py-2">{session!.descent}</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">Minimum pace</th>
							<td className="border px-3 py-2">{session!.paceMin}</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">Maximum pace</th>
							<td className="border px-3 py-2">{session!.paceMax}</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">GPS session type</th>
							<td className="border px-3 py-2">
								{(() => {
									try {
										const parsed = JSON.parse(session!.gpsSessionType);
										return parsed.en || 'N/A';
									} catch {
										return session!.gpsSessionType;
									}
								})()}
							</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">GPS locations count</th>
							<td className="border px-3 py-2">{session!.gpsLocationsCount}</td>
						</tr>
						<tr>
							<th className="border px-3 py-2">Created by</th>
							<td className="border px-3 py-2">{session!.userFirstLastName}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		</>
	);
}
