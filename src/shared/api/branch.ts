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
