"use client";

import { createContext } from "react";

export interface IAccountInfo {
	jwt?: string;
	firstName?: string;
	lastName?: string;
}

export interface IAccountState {
	accountInfo?: IAccountInfo;
	setAccountInfo?: (value: IAccountInfo) => void;
}

export const AccountContext = createContext<IAccountState>({});
