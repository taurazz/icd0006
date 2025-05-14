import type { IGpsSession } from "@/domain/IGpsSession";
import { BaseEntityService } from "./BaseEntityService";

export class GpsSessionService extends BaseEntityService<IGpsSession> {
    constructor() {
        super("GpsSessions");
    }

}