"use client";

import { AccountContext } from "@/context/AccountContext";
import { SessionContext, ISessionInfo } from "@/context/SelectedSessionsContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { IGpsSession } from "@/types/domain/IGpsSession";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { format, isSameDay } from 'date-fns';
import { GpsLocationService } from "@/services/GpsLocationService";

export default function Sessions() {
	const router = useRouter();
    const sessionService = new GpsSessionService();
	const locationService = new GpsLocationService();

    const { accountInfo } = useContext(AccountContext);
    const {
		selectedSessions: selectedSessions,
		addSelectedSession,
		setSelectedSessions:
		setSelectedSessions
	} = useContext(SessionContext);

    const [allSessions, setAllSessions] = useState<IGpsSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(new Set());

	const pageSize = 20;
	const [currentPage, setCurrentPage] = useState(1);

	const [filterDate, setFilterDate] = useState('');
	const [filterUser, setFilterUser] = useState('');
  	const [filterType, setFilterType] = useState('');
	const [search, setSearch] = useState('');

  	const users = Array.from(new Set(allSessions.map(s => s.userFirstLastName)));
	const sessionTypes = Array.from(new Set(allSessions.map(s => {
								try {
									const parsed = JSON.parse(s.gpsSessionType);
									return parsed.en || 'N/A';
								} catch {
									return s.gpsSessionType;
								}
							})));

	const filteredSessions = useMemo(() => {
		return allSessions.filter((s) => {
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
	}, [allSessions, filterDate, filterUser, filterType, search]);

	const totalPages = Math.ceil(filteredSessions.length / pageSize);
  	const paginatedSessions = filteredSessions.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
  	);

    const handleSessionSelect = (sessionId: string, checked: boolean) => {
        const newSelected = new Set(selectedSessionIds);
        if (checked) {
            newSelected.add(sessionId);
        } else {
            newSelected.delete(sessionId);
        }
        setSelectedSessionIds(newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
			const allIds = new Set(paginatedSessions.map(s => s.id).filter((id): id is string => id !== undefined));
			setSelectedSessionIds(allIds);
        } else {
            setSelectedSessionIds(new Set());
        }
    };

    const addSelectionToMap = async () => {
        const selectedSessionsData: ISessionInfo[] = [];

        for (const sessionId of selectedSessionIds) {
            const session = allSessions.find(s => s.id === sessionId);
            if (session) {
                try {
                    const response = await locationService.getBySessionAsync(sessionId)

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
            }
        }

        selectedSessionsData.forEach(session => {
			console.log(session)
            const exists = selectedSessions.find(s => s.id === session.id);
            if (!exists) {
				addSelectedSession(session);
            }
        });

        setSelectedSessionIds(new Set());
    };

    const clearSelection = () => {
        setSelectedSessionIds(new Set());
        setSelectedSessions([]);
    };

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

				setAllSessions(result.data!);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

        fetchData();
    }, [accountInfo, router]);

    if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
				</svg>
			</div>
		);
    }

	const isAllSelected = paginatedSessions.length > 0 && paginatedSessions.every(s => s.id !== undefined && selectedSessionIds.has(s.id));
	const isSomeSelected = paginatedSessions.some(s => s.id !== undefined && selectedSessionIds.has(s.id));

	return (
		<div className="flex flex-col items-center">
			{/* Title and add */}
			<div className="flex justify-between w-full max-w-5xl p-4">
			<h1 className="text-2xl font-semibold">GPS Sessions</h1>
			<button className="flex items-center gap-1 border px-4 py-2 rounded">
				<Link href='/sessions/create'>+ Add New</Link>
			</button>
			</div>

			{/* Selection */}
			<div className="flex justify-between w-full max-w-5xl px-4 mb-4">
				<div className="flex gap-2 items-center">
					<span className="text-sm text-gray-600">
						{selectedSessionIds.size} session{selectedSessionIds.size !== 1 ? 's' : ''} selected
					</span>
					<span className="text-sm text-indigo-600">
						({selectedSessions.length} on map)
					</span>

				</div>
				<div className="flex gap-2">
					<button
						className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={addSelectionToMap}
						disabled={selectedSessionIds.size === 0}
					>
						Add Selection to Map
					</button>
					<button
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
						onClick={clearSelection}
					>
						Clear Selection
					</button>
				</div>
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
							<th className="border px-3 py-2 w-12">
								<input
									type="checkbox"
									checked={isAllSelected}
									ref={input => {
										if (input) input.indeterminate = !isAllSelected && isSomeSelected;
									}}
									onChange={(e) => handleSelectAll(e.target.checked)}
									className="w-4 h-4 accent-indigo-600"
								/>
							</th>
							<th className="border px-3 py-2">Time</th>
							<th className="border px-3 py-2">Name</th>
							<th className="border px-3 py-2">Type</th>
							<th className="border px-3 py-2">User</th>
							<th className="border px-3 py-2">Locations count</th>
						</tr>
					</thead>
					<tbody>
						{paginatedSessions.map((session) =>
						<tr key={session.id} className="hover:bg-gray-800 cursor-pointer">
							<td className="border px-3 py-2 text-center">
								<input
									type="checkbox"
									checked={session.id !== undefined && selectedSessionIds.has(session.id)}
									onChange={(e) => session.id && handleSessionSelect(session.id, e.target.checked)}
									className="w-4 h-4 accent-indigo-600"
								/>
							</td>
							<td className="px-2" onClick={() => router.push('/sessions/' + session.id)}>
								{format(new Date(session.recordedAt), 'yyyy-MM-dd HH:mm')}
							</td>
							<td className="relative group px-2" onClick={() => router.push('/sessions/' + session.id)}>
								<div className="flex flex-col m-2" >
									{session.name}
									<div className="absolute top-full mt-1 bg-gray-700 text-white text-sm p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 w-max max-w-xs text-center pointer-events-none">
									{session.description}
									</div>
								</div>
							</td>
							<td className="px-2" onClick={() => router.push('/sessions/' + session.id)}>
								{(() => {
									try {
										const parsed = JSON.parse(session.gpsSessionType);
										return parsed.en || 'N/A';
									} catch {
										return session.gpsSessionType;
									}
								})()}
							</td>
							<td className="px-2" onClick={() => router.push('/sessions/' + session.id)}>
								{session.userFirstLastName}
							</td>
							<td className="px-2" onClick={() => router.push('/sessions/' + session.id)}>
								{session.gpsLocationsCount}
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
