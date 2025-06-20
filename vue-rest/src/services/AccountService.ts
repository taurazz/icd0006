import type { IResultObject } from '@/types/IResultObject'
import { BaseService } from './BaseService'
import type { ILoginDto } from '@/types/ILoginDto'

export abstract class AccountService extends BaseService {
  static async login(email: string, password: string): Promise<IResultObject<ILoginDto>> {
    const url = 'account/login'
    const loginData = {
      email,
      password,
    }
    try {
      const response = await this.axios.post<ILoginDto>(url, loginData)

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

static async register(firstName: string, lastName: string, email: string, password: string, confirmPassword: string): Promise<IResultObject<ILoginDto>> {
  const url = 'account/register'
  const registerData = {
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  }
  try {
    const response = await this.axios.post<ILoginDto>(url, registerData)
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
