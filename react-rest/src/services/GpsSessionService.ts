import { IGpsSession } from "@/types/domain/IGpsSession";
import { EntityService } from "./EntityService";
import { IGpsSessionCreate } from "@/types/domain/IGpsSessionCreate";
import { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import { AxiosError } from "axios";

interface GpsSessionFilters {
    fromDateTime?: string;
    toDateTime?: string;
    minLocationsCount?: number;
    minDuration?: number;
    minDistance?: number;
}

export class GpsSessionService extends EntityService<IGpsSession, IGpsSessionCreate> {
	constructor() {
		super('GpsSessions')
	}

async getAllAsync(filters: GpsSessionFilters = {}): Promise<IResultObject<IGpsSession[]>> {
        const now = new Date();
        const defaultFrom = new Date(now);
        defaultFrom.setFullYear(now.getFullYear() - 10);
        const defaultTo = new Date(now);
        defaultTo.setFullYear(now.getFullYear() + 10);
        try {
            const response = await BaseService.axios.get<IGpsSession[]>('GpsSessions', {
            params: {
                minLocationsCount: filters.minLocationsCount ?? 0,
                minDuration: filters.minDuration ?? 0,
                minDistance: filters.minDistance ?? 0,
                fromDateTime: filters.fromDateTime ?? defaultFrom.toISOString(),
                toDateTime: filters.toDateTime ?? defaultTo.toISOString(),
            }})
            console.log('getAll response', response)
      if (response.status <= 300) {
        return {
			statusCode: response.status,
			data: response.data
		 }
      }
      return {
		statusCode: response.status,
        errors: [response.status.toString() + ' ' + response.statusText],
      }
    } catch (error) {
      console.log('error: ', (error as AxiosError).message)

      return {
		statusCode: (error as AxiosError).status ?? 0,
        errors: [(error as AxiosError).code ?? ""]
      }
    }
  }
}
