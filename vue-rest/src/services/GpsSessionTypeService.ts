import { EntityService } from "./EntityService";
import type { IGpsSessionType } from "@/types/domain/IGpsSessionType";

export class GpsSessionTypeService extends EntityService<IGpsSessionType> {
	constructor() {
		super('GpsSessionTypes')
	}
}
