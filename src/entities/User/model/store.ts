import { create } from 'zustand';
import { User } from '@/shared/types/user';
import { getMe } from '@/shared/api/user';

interface UserState {
  user: User | null;
  token: string | null;
  isAdminMode: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  actions: {
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    toggleAdminMode: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
    refetchUser: () => Promise<void>;
  };
}

const initialState: UserState = {
  user: null,
  token: null,
  isAdminMode: false,
  isLoading: true,
  error: null,
};

export const useUserStore = create<UserState & UserActions>((set, get) => ({
  ...initialState,
  actions: {
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    toggleAdminMode: () => {
      if (get().user?.role === 'ADMIN') {
        set((state) => ({ isAdminMode: !state.isAdminMode }))
      }
    },
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    logout: () => set({ ...initialState, isLoading: false }),
    refetchUser: async () => {
        try {
            const userData = await getMe();
            set({ user: userData });
        } catch (error) {
            console.error("Failed to refetch user:", error);
        }
    }
  },
}));

// Convenience hooks
export const useCurrentUser = () => useUserStore((state) => state.user);
export const useIsAdminMode = () => useUserStore((state) => state.isAdminMode);
export const useAuthLoading = () => useUserStore((state) => state.isLoading);
