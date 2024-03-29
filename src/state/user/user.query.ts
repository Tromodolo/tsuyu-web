import { Query } from "@datorama/akita";
import { User } from "./user.model";
import { UserStore, userStore } from "./user.store";

export class UserQuery extends Query<User> {
	user$ = this.select();
	isLoggedIn$ = this.select((state) => !!state.apiToken);
	api_key = this.select((state) => state.apiToken);

	isLoading$ = this.selectLoading();
	error$ = this.selectError();

	constructor(protected store: UserStore) {
		super(store);
	}
}

export const userQuery = new UserQuery(userStore);
