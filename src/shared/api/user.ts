import { apiInstance } from './base';
import { User } from '@/shared/types/user';

export const getMe = async (): Promise<User> => {
  const response = await apiInstance.get<User>('/users/@me');
  return response.data;
};
