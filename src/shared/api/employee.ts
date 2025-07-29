import { apiInstance } from './base';
import { Employee } from '@/shared/types/employee';
import { PaginatedResponse } from '@/shared/types/api';

export const getBranchEmployees = async (branchId: number): Promise<Employee[]> => {
  const response = await apiInstance.get(`/employees/barbershop/${branchId}`);
  return response.data;
};

export const getEmployeeSchedule = async (params: {
  employeeId: number;
  serviceId: number;
  onDate: string;
}): Promise<Record<string, boolean>> => {
  const { employeeId, serviceId, onDate } = params;
  const response = await apiInstance.get(`/employees/${employeeId}/schedule`, {
    params: { service_id: serviceId, on_date: onDate },
  });
  return response.data;
};
