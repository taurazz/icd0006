import { Axios } from "axios";
import type { IGpsLocationType } from "@/domain/IGpsSessionType";
import type { IResultObject } from "@/types/IResultObject";

export abstract class GpsLocationTypeService {
    private static axios = new Axios(
        {
            baseURL: "https://sportmap.akaver.com/api/v1.0/GpsSessions/",
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    static async getAll(): Promise<IResultObject<IGpsLocationType[]>> {
        const url = "";
        try {
            const response = await this.axios.get<IGpsLocationType[]>(url);

            console.log('getAll response', response);
            if (response.status <= 200) {
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