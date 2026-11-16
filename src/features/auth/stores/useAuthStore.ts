import { create } from "zustand";
import type { TokenPayload } from "@/lib/auth/token";
import { getCurrentUserAction } from "../actions/auth.actions";

interface AuthState {
  user: TokenPayload | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: TokenPayload | null) => void;
  fetchUser: () => Promise<TokenPayload | null>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => {
    set({ user, isInitialized: true, isLoading: false });
  },

  clearUser: () => {
    set({ user: null, isInitialized: true, isLoading: false });
  },

  fetchUser: async () => {
    // Hindari duplikasi fetch jika sedang loading
    if (get().isLoading) {
      return get().user;
    }

    set({ isLoading: true });
    try {
      const user = await getCurrentUserAction();
      set({ user, isLoading: false, isInitialized: true });
      return user;
    } catch {
      set({ user: null, isLoading: false, isInitialized: true });
      return null;
    }
  },
}));

