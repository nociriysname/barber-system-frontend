import { apiInstance } from './base';

export interface FileUploadResponse {
    file_name: string;
}

export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiInstance.post<FileUploadResponse>('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};