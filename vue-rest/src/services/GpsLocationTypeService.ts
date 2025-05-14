import type { IGpsLocationType } from "@/domain/IGpsLocationType";
import { BaseEntityService } from "./BaseEntityService";

export class GpsLocationTypeService extends BaseEntityService<IGpsLocationType> {
    constructor() {
        super("GpsLocationTypes");
    }

}