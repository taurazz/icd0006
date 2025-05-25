import { IGpsLocation } from "@/types/domain/IGpsLocation";
import { EntityService } from "./EntityService";
import { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import { AxiosError } from "axios";

export class GpsLocationService extends EntityService<IGpsLocation> {
	constructor() {
		super('GpsLocations')
	}

  async getBySessionAsync(sessionId: string): Promise<IResultObject<IGpsLocation[]>> {
	try {
	  const response = await BaseService.axios.get<IGpsLocation[]>('GpsLocations/Session/' + sessionId)
	  console.log('get response', response)

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

    async addBulkAsync(sessionId: string, locations: IGpsLocation[]): Promise<IResultObject<IGpsLocation[]>> {
	try {
	  const response = await BaseService.axios.post<IGpsLocation[]>('GpsLocations/' + sessionId, locations)
	  console.log('add response', response)

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
