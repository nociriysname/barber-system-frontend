import { apiInstance } from './base';
import { Branch } from '@/shared/types/branch';
import { PaginatedResponse } from '@/shared/types/api';

export const getAllBranches = async (params: { limit: number; offset: number }): Promise<PaginatedResponse<Branch>> => {
  const response = await apiInstance.get('/barbershops', { params });
  return {
    items: response.data.barbershops,
    total: response.data.total,
  };
};

export const createBranch = async (data: Omit<Branch, 'id'|'created_at'|'updated_at'|'image_id'|'image_url'>): Promise<Branch> => {
  const response = await apiInstance.post('/admin/barbershops/', data);
  return response.data;
};