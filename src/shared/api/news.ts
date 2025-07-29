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
