import axios, { AxiosError, AxiosResponse } from "axios";
import { userQuery } from "./user";

export const API_URL = process.env.REACT_APP_API_URL;
let ApiKey: string | undefined = "";
userQuery.api_key.subscribe((api) => {
	ApiKey = api;
});

export interface ApiResponse<T> {
	data?: T;
	error?: boolean;
	errorMessage: string;
	totalItems?: number;
	cursor?: string;
};

export type Endpoint = 
	| "file/upload"
	| "settings"
	| "file/delete"
	| "file/list"
	| "user/login"
	| "user/register"
	| "user/reset-token"
	| "user/change-password";
export type Method = "GET" | "POST" | "PUT" | "DELETE";

export async function SendRequest<T>(
	endpoint: Endpoint,
	method: Method,
	body?: { [key: string]: any },
	params?: [value: string],
	queryParams?: { [key: string]: any },
): Promise<ApiResponse<T>> {
	let url = `${API_URL}/${endpoint}`;
	if (params !== undefined) {
		for (const val of params) {
			url += `/${val}`;
		}
	}

	if (queryParams !== undefined) {
		let first = true;
		for (const key in queryParams) {
			if (first) {
				url += "?";
			} else {
				url += "&";
			}
			url += `${key}=${queryParams[key]}`;
			first = false;
		}
	}

	let res: AxiosResponse;
	try {
		res = await axios({
			method,
			url,
			data: body,
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${ApiKey ?? ""}`,
			}
		});
	} catch (err: any) {
		const axErr: AxiosError = err;
		if (axErr.response){
			res = axErr.response;
		} else {
			throw new Error("Request failed");
		}
	}
	
	return res.data;
}