import { apiInstance } from './base';
import { Booking } from '@/shared/types/booking';
import { PaginatedResponse } from '@/shared/types/api';

export const getMyBookings = async (params: { limit: number; offset: number }): Promise<PaginatedResponse<Booking>> => {
  const response = await apiInstance.get('/appointments/@me', { params });
  return {
    items: response.data.appointments,
    total: response.data.total,
  };
};

export const getAllAppointments = async (params: { limit: number; offset: number }): Promise<PaginatedResponse<Booking>> => {
  const response = await apiInstance.get('/admin/appointments', { params });
   const total = parseInt(response.headers['x-total-count'] || '0', 10);
  return {
    items: response.data.appointments,
    total: total,
  };
};

export const cancelBooking = async (id: number): Promise<Booking> => {
  const response = await apiInstance.patch(`/appointments/${id}/cancel`);
  return response.data;
};

export const createBooking = async (data: {
    employee_id: number;
    service_id: number;
    appointment_time: string;
    user_id: number;
}): Promise<Booking> => {
    const response = await apiInstance.post('/appointments/', data);
    return response.data;
}
