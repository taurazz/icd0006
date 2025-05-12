import type { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import type { loginDto } from "@/types/loginDto";

export abstract class IdentityService extends BaseService {
    static async login(email: string, password: string): Promise<IResultObject<loginDto>> {
        const url = "account/login";
        const loginData = {
            email, password
        }
        try {
            const response = await this.axios.post<loginDto>(url, loginData);

            if (response.status <= 300) {
                return { data: response.data }
            }
            return {
                errors: [response.status.toString() + " " + response.statusText]
            }
        } catch (error) {
            console.log('error: ', (error as Error).message);

            return {
                errors: [JSON.stringify(error)]
            }
        }
    }
}