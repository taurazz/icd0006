"use client";

import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AccountContext, IAccountInfo } from "@/context/AccountContext";
import { useState } from "react";
import { BaseService } from "@/services/BaseService";
import { ISessionInfo, SessionContext } from "@/context/SelectedSessionsContext";


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [accountInfo, setAccountInfo] = useState<IAccountInfo | undefined>();
	const [selectedSessions, setSelectedSessions] = useState<ISessionInfo[]>([]);

	const updateAccountInfo = (accountData: IAccountInfo) => {
		setAccountInfo(accountData);
		localStorage.setItem("_jwt", accountData.jwt!);
		localStorage.setItem("_firstName", accountData.firstName!);
		localStorage.setItem("_lastName", accountData.lastName!);
	}

	const addSelectedSession = (session: ISessionInfo) => {
		setSelectedSessions((prev) => [...prev, session]);
	};

	const updateSelectedSession = (updated: ISessionInfo) => {
		setSelectedSessions((prev) =>
			prev.map((s) => (s.id === updated.id ? updated : s))
		);
	};

	const removeSelectedSession = (id: string) => {
		setSelectedSessions((prev) => prev.filter((s) => s.id !== id));
	};

	BaseService.initInterceptors(() => localStorage.getItem("_jwt"));

	return (
		<html lang="en">
			<body>
				<AccountContext.Provider value={{
					accountInfo: accountInfo,
					setAccountInfo: updateAccountInfo
				}}>
				<SessionContext.Provider value={{
					selectedSessions,
					setSelectedSessions,
					addSelectedSession,
					updateSelectedSession,
					removeSelectedSession
				}}>
					<div className="min-h-screen flex flex-col bg-gray-900 text-white">
						<Header />
						<main className="flex-grow pt-16 px-6 lg:px-8 content-center">
							{children}
						</main>
						<Footer />
					</div>
				</SessionContext.Provider>
				</AccountContext.Provider>
			</body>
		</html>
	);
}
