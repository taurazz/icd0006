"use client";

import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AccountContext, IAccountInfo } from "@/context/AccountContext";
import { useState } from "react";
import { BaseService } from "@/services/BaseService";


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [accountInfo, setAccountInfo] = useState<IAccountInfo | undefined>();

	const updateAccountInfo = (accountData: IAccountInfo) => {
		setAccountInfo(accountData);
		localStorage.setItem("_jwt", accountData.jwt!);
		localStorage.setItem("_firstName", accountData.firstName!);
		localStorage.setItem("_lastName", accountData.lastName!);
	}

	BaseService.initInterceptors(() => localStorage.getItem("_jwt"));

	return (
		<html lang="en">
			<body>
				<AccountContext.Provider value={{
					accountInfo: accountInfo,
					setAccountInfo: updateAccountInfo
				}}>
					<div className="min-h-screen flex flex-col bg-gray-900 text-white">
						<Header />
						<main className="flex-grow pt-16 px-6 lg:px-8 content-center">
							{children}
						</main>
						<Footer />
					</div>
				</AccountContext.Provider>
			</body>
		</html>
	);
}
