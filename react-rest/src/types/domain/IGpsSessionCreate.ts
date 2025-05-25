import { IDomainId } from "./IDomainId";

export interface IGpsSessionCreate extends IDomainId {
	name: string;
	description: string;
	gpsSessionTypeId: string;
	recordedAt?: string;
	paceMin?: number;
	paceMax?: number;
}
