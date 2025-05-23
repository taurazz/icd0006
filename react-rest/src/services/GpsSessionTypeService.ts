import { EntityService } from "./EntityService";
import { IGpsSessionType } from "@/types/domain/IGpsSessionType";

export class GpsSessionTypeService extends EntityService<IGpsSessionType> {
	constructor() {
		super('GpsSessionTypes')
	}
}
