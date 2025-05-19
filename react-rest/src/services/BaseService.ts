import axios from "axios";

export abstract class BaseService {
    protected axios = axios.create(
        {
            baseURL: "https://sportmap.akaver.com/api/v1.0/",
            headers: {
            common: {
                'Content-Type': 'application/json'
                }
            }
        }
    )
}
