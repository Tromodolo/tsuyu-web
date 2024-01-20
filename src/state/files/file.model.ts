export interface File {
	id: number;
	originalName: string;
	name: string;
	fileType: string;
	fileHash: string;
	fileSizeInKB: number;
	uploadedBy: number;
	uploadedByIp: string;
	createdAt: string;
}

export interface FileUpload {
	file: File;
	url: string;
}

export interface FileCount {
	num_count: number;
}

export interface FileState {
	currentPage: number;
	totalPages: number;
	recentlyUploaded?: string[];
	uploadProgress?: number;
	files?: File[];
	cursor?: string;
	canLoadMore: boolean
}