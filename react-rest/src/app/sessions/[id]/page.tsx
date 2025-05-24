"use client";

import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { IGpsSession } from "@/types/domain/IGpsSession";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

export default function Session() {
	const router = useRouter();
	const sessionService = new GpsSessionService();
	const params = useParams();
	const id = params?.id as string | undefined;

	const { accountInfo } = useContext(AccountContext);

	const [session, setSession] = useState<IGpsSession>();
	const [loading, setLoading] = useState(true);

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
  return (
    <>
<div className="flex flex-col items-center">

	<div className="flex justify-between w-full max-w-3xl p-4 items-center">
		<h1 className="text-2xl font-semibold">Session info</h1>
		<div className="flex">
			<button className="flex items-center gap-1 border px-4 py-2 rounded m-2">
				<Link href={`/sessions/edit/${id}`}>Edit</Link>
			</button>
			<button className="flex items-center gap-1 border px-4 py-2 rounded m-2">
				<Link href={`/sessions/delete/${id}`}>Delete</Link>
			</button>
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
