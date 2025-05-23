import type { IResultObject } from '@/types/IResultObject'
import { BaseService } from '@/services/BaseService'
import type { ILoginDto } from '@/types/ILoginDto'
import { AxiosError } from 'axios'

export class AccountService extends BaseService {
  async login(email: string, password: string): Promise<IResultObject<ILoginDto>> {
    const url = 'account/login'

    const loginData = {
      email,
      password,
    }

    try {
      const response = await BaseService.axios.post<ILoginDto>(url, loginData)
			console.log('login response', response)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as Error).message)
			return {
				statusCode: (error as AxiosError)?.status,
				errors: [(error as AxiosError).code ?? ""],
			}
		}
	}
}
