import axios from 'axios';
import { useUserStore } from '@/entities/User/model/store';
import { ENV } from '@/shared/config/env';

export const apiInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
