import type { IResultObject } from '@/types/IResultObject'
import { BaseService } from '@/services/BaseService'
import type { ILoginDto } from '@/types/ILoginDto'
import { AxiosError } from 'axios'
import { IErrorResponse } from '@/types/IErrorResponse'

export class AccountService extends BaseService {
  async login(email: string, password: string): Promise<IResultObject<ILoginDto>> {
    const url = 'account/login'

    const loginData = {
      email,
      password
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
				messages: [response.data.messages?.join(', ') ?? '']
			}
		} catch (error) {
			const axiosError = error as AxiosError;
			console.log('error: ', axiosError.message)
			return {
				statusCode: axiosError?.status,
				errors: [axiosError.code ?? ""],
				messages: axiosError.response?.data
				        ? (axiosError.response?.data as IErrorResponse).messages
          				: []
			}
		}
	}

  async register(email: string, password: string, firstName: string, lastName: string): Promise<IResultObject<ILoginDto>> {
    const url = 'account/register'

    const loginData = {
      email,
      password,
	  firstName,
	  lastName
    }

    try {
      const response = await BaseService.axios.post<ILoginDto>(url, loginData)
			console.log('register response', response)

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
			const axiosError = error as AxiosError;
			console.log('error: ', axiosError.message)
			return {
				statusCode: axiosError?.status,
				errors: [axiosError.code ?? ""],
				messages: axiosError.response?.data
				        ? (axiosError.response?.data as IErrorResponse).messages
          				: []
			}
		}
	}
}
