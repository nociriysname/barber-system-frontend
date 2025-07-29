import { apiInstance } from './base';
import { NewsItem } from '@/shared/types/news';
import { PaginatedResponse } from '@/shared/types/api';

interface GetNewsParams {
  limit: number;
  offset: number;
}

export const getNews = async (params: GetNewsParams): Promise<PaginatedResponse<NewsItem>> => {
    const response = await apiInstance.get('/news', { 
        params,
        headers: {
            'X-Total-Count': '' // Placeholder for Tanstack Query to read from
        }
    });
    const total = parseInt(response.headers['x-total-count'] || '0', 10);
    return {
        items: response.data.news,
        total,
    };
};
