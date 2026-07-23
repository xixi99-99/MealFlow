import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { users } from '../mocks/data';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (account: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (changes: Pick<User, 'name' | 'email' | 'phone'>) => void;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (account, password) => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 650));
    if (!account.trim() || password.length < 6) return false;
    const user: User = account.toLowerCase().includes('member') ? { ...users[1], role: 'member' } : users[0];
    set({ user, isAuthenticated: true });
    return true;
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  updateProfile: (changes) => set((state) => state.user ? { user: { ...state.user, ...changes } } : state),
}), { name: 'mealflow-auth' }));
