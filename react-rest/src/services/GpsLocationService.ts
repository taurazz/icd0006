import { IGpsLocation } from "@/types/domain/IGpsLocation";
import { EntityService } from "./EntityService";

export class GpsLocationervice extends EntityService<IGpsLocation> {
	constructor() {
		super('GpsLocations')
	}
}
