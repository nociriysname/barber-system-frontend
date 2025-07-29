import { useCallback } from 'react';
import { useUserStore } from '@/entities/User/model/store';
import { useTelegram } from './useTelegram';
import { validateInitData } from '@/shared/api/auth';
import { getMe } from '@/shared/api/user';

export const useAuth = () => {
  const { initData } = useTelegram();
  const { setToken, setUser, setLoading, setError } = useUserStore.getState().actions;

  const authenticate = useCallback(async () => {
    if (!initData) {
      console.error('Telegram initData not found. Running in dev mode.');
      setError('Not in Telegram');
      return;
    }

    setLoading(true);
    try {
      const { access_token } = await validateInitData({ init_data: initData });
      setToken(access_token);

      const userData = await getMe();
      setUser(userData);
      setError(null);
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  }, [initData, setLoading, setToken, setUser, setError]);

  return { authenticate };
};
