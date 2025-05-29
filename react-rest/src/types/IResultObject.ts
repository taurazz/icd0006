export interface IResultObject<TResponse> {
	statusCode?: number
	errors?: string[]
	data?: TResponse
	messages?: string[]
}

