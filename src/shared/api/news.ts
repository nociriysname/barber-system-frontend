import { apiInstance } from './base';
import { NewsItem } from '@/shared/types/news';
import { PaginatedResponse } from '@/shared/types/api';

interface GetNewsParams {
  limit: number;
  offset: number;
}

export const getNews = async (params: GetNewsParams): Promise<PaginatedResponse<NewsItem>> => {
    const response = await apiInstance.get<{ news: NewsItem[]; total: number }>('/news', { 
        params,
    });
    return {
        items: response.data.news,
        total: response.data.total,
    };
};

export const createNews = async (data: { title: string; text: string; image_id?: string }): Promise<NewsItem> => {
    const response = await apiInstance.post('/admin/news/', data);
    return response.data;
};

export const updateNews = async (id: number, data: { title?: string; text?: string; image_id?: string }): Promise<NewsItem> => {
    const response = await apiInstance.patch(`/admin/news/${id}`, data);
    return response.data;
};

export const deleteNews = async (id: number): Promise<void> => {
    await apiInstance.delete(`/admin/news/${id}`);
};
