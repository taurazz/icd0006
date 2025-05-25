"use client";

import { IGpsLocation } from "@/types/domain/IGpsLocation";
import { createContext } from "react";

export interface ISessionInfo {
	id: string;
	name: string;
	locations: IGpsLocation[];
}

export interface ISessionState {
	selectedSessions: ISessionInfo[];
	setSelectedSessions: (value: ISessionInfo[]) => void;
	addSelectedSession: (session: ISessionInfo) => void;
	updateSelectedSession: (session: ISessionInfo) => void;
	removeSelectedSession: (id: string) => void;
}

export const SessionContext = createContext<ISessionState>(
	{
	selectedSessions: [],
	setSelectedSessions: () => {},
	addSelectedSession: () => {},
	updateSelectedSession: () => {},
	removeSelectedSession: () => {},
}
);
