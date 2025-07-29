import { apiInstance } from './base';
import { Token } from '@/shared/types/auth';

interface InitDataPayload {
  init_data: string;
}

export const validateInitData = async (payload: InitDataPayload): Promise<Token> => {
  const response = await apiInstance.post<Token>('/auth/validate-initdata', payload);
  return response.data;
};
