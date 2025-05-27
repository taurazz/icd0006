"use client";

import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { IGpsSession } from "@/types/domain/IGpsSession";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";

export default function Profile() {
	const router = useRouter();
	const { accountInfo } = useContext(AccountContext);
	const sessionService = new GpsSessionService();
	const [sessions, setSessions] = useState<IGpsSession[]>([]);
	const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accountInfo?.jwt) {
            router.push("/login");
            return;
        }
		const fetchData = async () => {
			try {
				const result = await sessionService.getAllAsync();

				if (result.errors) {
					console.log(result.errors);
					return;
				}

				setSessions(result.data!);
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
	<div className="flex flex-row items-center">
		<div className="flex flex-col justify-between w-full max-w-3xl p-4">
			<h1 className="text-2xl font-semibold p-4">Hello, {accountInfo!.firstName}</h1>

			<div className="flex justify-center w-full max-w-3xl">
				<table className="table-fixed border-collapse border border-gray-300 w-full text-left">
					<tbody>
						<tr>
							<th className="border px-3 py-2 bg-gray-800">
								First name
							</th>
							<td className="border px-3 py-2">
								{accountInfo?.firstName}
							</td>
						</tr>
						<tr>
							<th className="border px-3 py-2 bg-gray-800">
								Last name
							</th>
							<td className="border px-3 py-2">
								{accountInfo?.lastName}
							</td>
						</tr>
						<tr>
							<th className="border px-3 py-2 bg-gray-800">
								Sessions count
							</th>
							<td className="border px-3 py-2">
								{sessions.filter(s => s.userFirstLastName === (accountInfo!.firstName! + " " + accountInfo!.lastName!)).length}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div className="flex flex-col justify-between w-full max-w-3xl p-4 items-center">
			<div className="flex flex-col justify-center w-full max-w-3xl">
				<h1 className="text-2xl font-semibold p-4">Your sessions</h1>
				<table className="table-fixed border-collapse border border-gray-300 w-full text-left">
					<thead className="bg-gray-800">
						<tr>
							<td className="border px-3 py-2">
								Recorded at
							</td>
							<td className="border px-3 py-2">
								Name
							</td>
							<td className="border px-3 py-2">
								Type
							</td>
						</tr>
					</thead>
					<tbody>
						{sessions
							.filter(s => s.userFirstLastName === (accountInfo!.firstName! + " " + accountInfo!.lastName!))
							.map(s => (
								<tr key={s.id} onClick={() => router.push('/sessions/' + s.id)} className="cursor-pointer">
									<td className="border px-3 py-2">
										{format(new Date(s.recordedAt), 'yyyy-MM-dd HH:mm')}
									</td>
									<td className="border px-3 py-2">
										{s.name}
									</td>
									<td className="border px-3 py-2">
										{(() => {
											try {
												const parsed = JSON.parse(s.gpsSessionType);
												return parsed.en || 'N/A';
											} catch {
												return s.gpsSessionType;
											}
										})()}
									</td>

								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	</div>
	</>
  );
}
