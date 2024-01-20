export interface User {
	id: number;
	username: string;
	email: string;
	isAdmin: boolean;
	apiToken?: string;
	lastUpdate: Date;
	createdAt: Date;
	message?: string;
}

export interface UserRegister {
	username: string;
	password: string;
	email?: string;
}

export interface UserLogin {
	username: string;
	password: string;
}

export interface PasswordUpdate {
	password: string;
	newPassword: string;
}
