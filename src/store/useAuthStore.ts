import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  user_id: string;
  name?: string;
  companyName?: string;
  email: string;
  role: "ADMIN" | "COMPANY" | "FARMER";
  avatar?: string;
  profileImageUrl?: string;
  isBlocked?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: "auth-storage",
    }
  )
);
