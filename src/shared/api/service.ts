import { apiInstance } from './base';
import { Service } from '@/shared/types/service';
import { PaginatedResponse } from '@/shared/types/api';

export const getBranchServices = async (branchId: number): Promise<PaginatedResponse<Service>> => {
  const response = await apiInstance.get(`/barbershops/${branchId}/services`);
  return {
    items: response.data.services,
    total: response.data.total,
  };
};
