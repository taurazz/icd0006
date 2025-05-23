import { ILoginDto } from "@/types/ILoginDto";
import axios from "axios";

export abstract class BaseService {
	protected static axios = axios.create({
		baseURL: "https://sportmap.akaver.com/api/v1.0/",
		headers: {
			common: {
				"Content-Type": "application/json",
			},
		},
	});

	public static initInterceptors(getToken: () => string | null) {
		BaseService.axios.interceptors.request.use(
			(config) => {
				const token = getToken();
				if (token) {
					config.headers = config.headers || {};
					config.headers["Authorization"] = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			});
	}
}
