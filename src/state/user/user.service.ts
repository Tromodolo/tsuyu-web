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
			const res = await SendRequest<User>("login", "POST", data);
			if (res.status === 200){
				this.store.update({...res.json});
			} else {
				this.store.setError("Invalid username or password.");
			}
		} catch (e) {
			this.store.setError(e.message);
		}

		this.store.setLoading(false);
	}

	async register(data: UserRegister) {
		this.store.setLoading(true);
		this.store.setError("");

		try {
			const res = await SendRequest<User>("register", "POST", data);
			if (res.status === 200){
				this.store.update({...res.json});
			} else {
				this.store.setError(res.error);
			}
		} catch (e) {
			this.store.setError(e.message);
		}

		this.store.setLoading(false);
	}

	logout() {
		this.store.update({
			id: undefined,
			username: undefined,
			email: undefined,
			api_key: undefined,
			is_admin: undefined,
			last_update: undefined,
			created_at: undefined,
			message: undefined,
		});
	}

	async changePassword(data: PasswordUpdate) {
		this.store.setLoading(true);
		this.store.setError("");
		this.store.update({message: undefined});
		const state = this.store.getValue();

		try{
			const res = await SendRequest<PasswordUpdate>("change-password", "POST", data, [state.id.toString()]);
			if (res.status === 200){
				this.store.update({
					message: "Successfully updated password",
				});
			} else {
				this.store.setError(res.error);
			}
		} catch (e) {
			this.store.setError(e.message);
		}

		this.store.setLoading(false);
	}
}

export const userService = new UserService(userStore);
