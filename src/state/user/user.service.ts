import { UserStore, userStore } from "./user.store";
import { PasswordUpdate, User, UserLogin, UserRegister } from "./user.model";
import { SendRequest } from "../Request";

export class UserService {
	constructor(private store: UserStore) {}

	async login(data: UserLogin) {
		this.store.setLoading(true);
		this.store.setError("");
		this.store.update({message: undefined});

		try{
			const res = await SendRequest<User>("user/login", "POST", data);
			if (!res.error){
				console.log(res.data);
				this.store.update({...res.data});
			} else {
				this.store.setError("Invalid username or password.");
			}
		} catch (e: any) {
			this.store.setError(e.message);
		}

		this.store.setLoading(false);
	}

	async register(data: UserRegister) {
		this.store.setLoading(true);
		this.store.setError("");

		try {
			const res = await SendRequest<User>("user/register", "POST", data);
			if (!res.error){
				this.store.update({...res.data});
			} else {
				this.store.setError(res.error);
			}
		} catch (e: any) {
			this.store.setError(e.message);
		}

		this.store.setLoading(false);
	}

	logout() {
		this.store.update({
			id: undefined,
			username: undefined,
			email: undefined,
			apiToken: undefined,
			isAdmin: undefined,
			lastUpdate: undefined,
			createdAt: undefined,
			message: undefined,
		});
	}

	async changePassword(data: PasswordUpdate) {
		this.store.setLoading(true);
		this.store.setError("");
		this.store.update({message: undefined});
		const state = this.store.getValue();

		try{
			const res = await SendRequest<PasswordUpdate>("user/change-password", "POST", data);
			if (!res.error){
				this.store.update({
					message: "Successfully updated password",
				});
			} else {
				this.store.setError(res.error);
			}
		} catch (e: any) {
			this.store.setError(e.message);
		}

		this.store.setLoading(false);
	}
}

export const userService = new UserService(userStore);
