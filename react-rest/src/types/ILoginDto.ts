export interface ILoginDto {
	token: string;
	status: string;
	firstName: string;
	lastName: string;
	messages?: string[]
}
