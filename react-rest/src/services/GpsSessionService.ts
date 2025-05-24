import { IGpsSession } from "@/types/domain/IGpsSession";
import { EntityService } from "./EntityService";
import { IGpsSessionCreate } from "@/types/domain/IGpsSessionCreate";


export class GpsSessionService extends EntityService<IGpsSession, IGpsSessionCreate> {
	constructor() {
		super('GpsSessions')
	}

}
