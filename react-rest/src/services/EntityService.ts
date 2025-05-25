import { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import { AxiosError } from "axios";
import { IDomainId } from "@/types/domain/IDomainId";

export abstract class EntityService<TEntity extends IDomainId, TCreate extends IDomainId = TEntity> extends BaseService {

	constructor(private basePath: string) {
		super()
	}

  async getAllAsync(): Promise<IResultObject<TEntity[]>> {
    try {
      const response = await BaseService.axios.get<TEntity[]>(this.basePath)
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

  async getAsync(id: string): Promise<IResultObject<TEntity>> {
	try {
		const response = await BaseService.axios.get<TEntity>(this.basePath + "/" + id)
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

  async addAsync(entity: TCreate): Promise<IResultObject<TEntity>> {
    try {
      const response = await BaseService.axios.post<TEntity>(this.basePath, entity)
	  console.log('add response', response)

      if (response.status <= 300) {
        return {
			statusCode: response.status,
			data: response.data }
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

  async deleteAsync(id: string): Promise<IResultObject<null>> {
    try {
      const response = await BaseService.axios.delete<null>(this.basePath + "/" + id)
	  console.log('delete response', response)

      if (response.status <= 300) {
        return {
			statusCode: response.status,
			data: null }
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

  async updateAsync(entity: TCreate): Promise<IResultObject<TEntity>> {
    try {
      const response = await BaseService.axios.put<TEntity>(this.basePath + '/' + entity.id, entity)
	  console.log('update response', response)

      if (response.status <= 300) {
        return {
			statusCode: response.status,
			data: response.data }
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
