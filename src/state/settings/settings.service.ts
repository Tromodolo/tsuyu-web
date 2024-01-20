import { SendRequest } from "../Request";
import { Settings } from "./settings.model";
import { settingsStore, SettingsStore } from "./settings.store";

export class SettingsService {
	constructor(private store: SettingsStore) {}

	async fetchSettings() {
		this.store.setLoading(true);
		this.store.setError("");

		const res = await SendRequest<Settings>("settings", "GET");
		if (!res.error){
			this.store.update({...res.data});
		} else {
			this.store.setError("Invalid username or password.");
		}

		this.store.setLoading(false);
	}
}

export const settingsService = new SettingsService(settingsStore);
