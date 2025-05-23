"use client";

import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useContext, useEffect, useState } from "react";

export default function Sessions() {
    const sessionService = new GpsSessionService();
    const { accountInfo } = useContext(AccountContext);
    const router = useRouter();
    const [sessions, setSessions] = useState<any[]>([]);
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
	<h1>GPS Sessions</h1>

	<table className="table-auto">
		<tbody>
			{sessions?.map((session) =>
			<tr key={session.id}>
				<td>
					{session.name}
				</td>
				<td>
					<Link href={"/sessions/edit" + session.id}>Edit</Link>
					<Link href={"/sessions/delete" + session.id}>Delete</Link>
				</td>
			</tr>
			)}
		</tbody>
	</table>

	</>
  );
}
