import { FileStore, fileStore } from "./file.store";
import { File as IFile, FileCount, FileState } from "./file.model";
import { API_URL, SendRequest } from "../Request";
import axios, { AxiosError, AxiosResponse } from "axios";
import { UserStore } from "../user";
import { userStore } from "../user/user.store";

export class FileService {
	constructor(private store: FileStore, private userStore: UserStore) {}

	async getFiles() {
		this.store.setLoading(true);
		this.store.setError("");

		const state: FileState = this.store.getValue();

		try {
			const res = await SendRequest<IFile[]>("file/list", "GET", undefined);
			if (!res.error){
				this.store.update({
					files: res.data,
					cursor: res.cursor,
				});
			} else {
				this.store.setError(res.error);
			}
		} catch (e: any) {
			this.store.setError(e.message);
		}

		this.store.setLoading(false);
	}

	async loadMoreFiles() {
		this.store.setLoading(true);
		this.store.setError("");

		const state: FileState = this.store.getValue();

		try {
			const res = await SendRequest<IFile[]>(`file/list`, "GET", undefined, undefined, { cursor: state.cursor });
			if (!res.error){
				this.store.update({
					files: [
						...state.files ?? [],
						...res.data ?? []
					],
					cursor: res.cursor,
				});
			} else {
				this.store.setError(res.error);
			}
		} catch (e: any) {
			this.store.setError(e.message);
		}

		this.store.setLoading(false);
	}

	// async getNextPage() {
	// 	const state: FileState = this.store.getValue();
	// 	if (state.currentPage >= state.totalPages){
	// 		return;
	// 	}
	// 	this.store.update({
	// 		currentPage: state.currentPage + 1,
	// 	})
	// 	await this.getFiles();
	// }

	// async getPreviousPage() {
	// 	const state: FileState = this.store.getValue();
	// 	if (state.currentPage <= 1){
	// 		return;
	// 	}
	// 	this.store.update({
	// 		currentPage: state.currentPage - 1,
	// 	})
	// 	await this.getFiles();
	// }

	async uploadFile(file: File) {
		this.store.setLoading(true);
		this.store.setError("");
		const userState = this.userStore.getValue();
		const fileState = this.store.getValue();

		try {
			let res: AxiosResponse;
			try {
				let formData = new FormData();
				formData.append("file", file);

				res = await axios.post(
					`${API_URL}/file/upload`,
					formData,
					{ 
						headers: {
							"Content-Type": "multipart/form-data",
							"Authorization": userState.apiToken,
						},
						onUploadProgress: (prog) => {
							const percentage = Math.round(prog.loaded / prog.total * 100);
							this.store.update({
								uploadProgress: percentage,
							});
						}
					}
				);
			} catch (err: any) {
				const axErr: AxiosError = err;
				if (axErr.response){
					res = axErr.response;
				} else {
					throw new Error("Request failed");
				}
			}
			if (res.status === 200){
				this.store.update({
					uploadProgress: 0,
					recentlyUploaded: [
						...(fileState.recentlyUploaded ?? []),
						res.data,
					]
				});
			} else {
				this.store.setError(res.data);
			}
		} catch (e: any) {
			this.store.setError(e.message);
		}

		this.store.setLoading(false);
	}
}

export const fileService = new FileService(fileStore, userStore);
