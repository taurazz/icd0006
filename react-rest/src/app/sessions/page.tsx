"use client";

import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { IGpsSession } from "@/types/domain/IGpsSession";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { format, isSameDay } from 'date-fns';

export default function Sessions() {
	const router = useRouter();
    const sessionService = new GpsSessionService();

    const { accountInfo } = useContext(AccountContext);

    const [sessions, setSessions] = useState<IGpsSession[]>([]);
    const [loading, setLoading] = useState(true);

	const pageSize = 20;
	const [currentPage, setCurrentPage] = useState(1);


	const [filterDate, setFilterDate] = useState('');
	const [filterUser, setFilterUser] = useState('');
  	const [filterType, setFilterType] = useState('');
	const [search, setSearch] = useState('');

  	const users = Array.from(new Set(sessions.map(s => s.userFirstLastName)));
	const sessionTypes = Array.from(new Set(sessions.map(s => {
								try {
									const parsed = JSON.parse(s.gpsSessionType);
									return parsed.en || 'N/A';
								} catch {
									return s.gpsSessionType;
								}
							})));

	const filteredSessions = useMemo(() => {
		return sessions.filter((s) => {
		const typeObj = (() => {
			try {
				return JSON.parse(s.gpsSessionType);
			} catch {
				return { en: s.gpsSessionType };
			}
		})();

		return (
			(!filterDate || isSameDay(new Date(s.recordedAt), new Date(filterDate))) &&
			(!filterUser || s.userFirstLastName === filterUser) &&
			(!filterType || typeObj.en === filterType) &&
			(!search || (
			s.name.toLowerCase().includes(search.toLowerCase()) ||
			s.description.toLowerCase().includes(search.toLowerCase())
			))
		);
		});
	}, [sessions, filterDate, filterUser, filterType, search]);

	const totalPages = Math.ceil(filteredSessions.length / pageSize);
  	const paginatedSessions = filteredSessions.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
  	);

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
    <div className="flex flex-col items-center">
		{/* Title and add */}
        <div className="flex justify-between w-full max-w-5xl p-4">
          <h1 className="text-2xl font-semibold">GPS Sessions</h1>
          <button className="flex items-center gap-1 border px-4 py-2 rounded">
            <Link href='/sessions/create'>+ Add New</Link>
          </button>
        </div>

		<div className="flex w-full max-w-4xl mx-auto p-4">
			{/* Search */}
			<div className="w-full p-4">
				<label className="block mb-1 font-medium">Search</label>
				<input
					type="text"
					placeholder="Name or description"
					className="border px-2 py-1 h-10 rounded w-full bg-gray-800 text-white"
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setCurrentPage(1);
					}}
				/>
			</div>

			{/* Filtering */}
			<div className="w-full p-4">
				<label className="block mb-1 font-medium">Filter by date</label>
				<input
				type="date"
				className="border px-2 py-1 h-10 rounded w-full bg-gray-800 text-white"
				value={filterDate}
				onChange={(e) => {
					setFilterDate(e.target.value);
					setCurrentPage(1);
				}}
				/>
			</div>

			<div className="w-full p-4">
				<label className="block mb-1 font-medium">Filter by user</label>
				<select
					className="border px-2 py-1 h-10 rounded w-full bg-gray-800 text-white"
					value={filterUser}
					onChange={(e) => {
						setFilterUser(e.target.value);
						setCurrentPage(1);
					}}
				>
					<option value="">All</option>
					{users.map(user => (
					<option key={user} value={user}>{user}</option>
					))}
				</select>
			</div>

			<div className="w-full p-4">
				<label className="block mb-1 font-medium">Filter by type</label>
				<select
					className="border px-2 py-1 h-10 rounded w-full bg-gray-800 text-white"
					value={filterType}
					onChange={(e) => {
						setFilterType(e.target.value);
						setCurrentPage(1); }}
				>
					<option value="">All</option>
					{sessionTypes.map(type => (
					<option key={type} value={type}>{type}</option>
					))}
				</select>
			</div>
		</div>

		{/* Table */}
		<div className="flex justify-center w-full max-w-5xl">
			<table className="table-fixed border-collapse border border-gray-300 w-full">
				<thead className="bg-gray-800">
					<tr>
						<th className="border px-3 py-2">Time</th>
						<th className="border px-3 py-2">Name</th>
						<th className="border px-3 py-2">Type</th>
						<th className="border px-3 py-2">User</th>
					</tr>
				</thead>
				<tbody>
					{paginatedSessions.map((session) =>
					<tr key={session.id} className="hover:bg-gray-800">
						<td className="px-2">
							{format(new Date(session.recordedAt), 'yyyy-MM-dd HH:mm')}
						</td>
						<td className="relative group cursor-pointer px-2">
							<div className="flex flex-col m-2" onClick={() => router.push('/sessions/' + session.id)}>
								{session.name}
								<div className="absolute top-full mt-1 bg-gray-700 text-white text-sm p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 w-max max-w-xs text-center pointer-events-none">
								{session.description}
								</div>
							</div>
						</td>
						<td className="px-2">
							{(() => {
								try {
									const parsed = JSON.parse(session.gpsSessionType);
									return parsed.en || 'N/A';
								} catch {
									return session.gpsSessionType;
								}
							})()}
						</td>
						<td className="px-2">
							{session.userFirstLastName}
						</td>
					</tr>
					)}
				</tbody>
			</table>
		</div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-3 py-1 w-22 border rounded bg-gray-600 hover:bg-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-default"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-2 py-1">Page {currentPage} of {totalPages}</span>
          <button
            className="px-3 py-1 w-22 border rounded bg-gray-600 hover:bg-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-default"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

	</div>
  );
}
