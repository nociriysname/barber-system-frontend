import { apiInstance } from './base';
import { User } from '@/shared/types/user';

export const getMe = async (): Promise<User> => {
  const response = await apiInstance.get<User>('/users/@me');
  return response.data;
};

export const topUpBalance = async (amount: number): Promise<User> => {
  const response = await apiInstance.post<User>('/users/@me/top-up', { amount });
  return response.data;
};
