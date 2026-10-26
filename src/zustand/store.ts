import { create } from "zustand";
import type { Models } from "appwrite";
import { getUser, logoutUser } from "../appwrite/auth";

export interface AppStoreState {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  checkAuth: () => Promise<Models.User<Models.Preferences> | null>;
  logout: () => Promise<boolean>;
}

export const useAppDataStore = create<AppStoreState>()((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await getUser();
      if (res.success && res.data) {
        set({ user: res.data, isLoading: false });
        return res.data;
      }
      set({ user: null, isLoading: false });
      return null;
    } catch {
      set({ user: null, isLoading: false });
      return null;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const res = await logoutUser();
      if (res.success) {
        set({ user: null, isLoading: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },
}));