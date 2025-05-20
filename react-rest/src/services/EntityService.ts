import { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import { AxiosError } from "axios";
import { useContext } from "react";
import { AccountContext } from "@/context/AccountContext";

export abstract class EntityService<TEntity> extends BaseService {

	constructor(private basePath: string) {
		super()
	}

  async getAllAsync(): Promise<IResultObject<TEntity[]>> {
    try {
      const response = await BaseService.axios.get<TEntity[]>(this.basePath)

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

  async addAsync(entity: TEntity): Promise<IResultObject<TEntity>> {
	const {accountInfo} = useContext(AccountContext);
    try {
      let options = {}

      if (accountInfo?.jwt) {
        options = {
          headers: {
            Authorization: `Bearer ${accountInfo.jwt}`,
          },
        }
      }

      const response = await BaseService.axios.post<TEntity>(this.basePath, entity, options)

      if (response.status <= 300) {
        return { data: response.data }
      }
      return {
        errors: [response.status.toString() + ' ' + response.statusText],
      }
    } catch (error) {
      console.log('error: ', (error as Error).message)

      return {
        errors: [JSON.stringify(error)],
      }
    }
  }
}


