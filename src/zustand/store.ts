import { create } from "zustand";
import type { Models } from "appwrite";
import { getUser, logoutUser } from "../appwrite/auth";
import { getUserStickers, type UserStickersType } from "../appwrite/db";

export interface AppStoreState {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  stickers: UserStickersType[];
  isStickersLoading: boolean;
  hasFetchedStickers: boolean;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  checkAuth: () => Promise<Models.User<Models.Preferences> | null>;
  logout: () => Promise<boolean>;
  fetchStickers: (userId: string, force?: boolean) => Promise<void>;
  addSticker: (sticker: UserStickersType) => void;
  removeSticker: (stickerId: string) => void;
}

export const useAppDataStore = create<AppStoreState>()((set, get) => ({
  user: null,
  isLoading: true,
  stickers: [],
  isStickersLoading: false,
  hasFetchedStickers: false,

  setUser: (user) => set({ user }),

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await getUser();
      if (res.success && res.data) {
        set({ user: res.data, isLoading: false });
        return res.data;
      }
      set({ user: null, isLoading: false, stickers: [], hasFetchedStickers: false });
      return null;
    } catch {
      set({ user: null, isLoading: false, stickers: [], hasFetchedStickers: false });
      return null;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const res = await logoutUser();
      if (res.success) {
        set({ user: null, isLoading: false, stickers: [], hasFetchedStickers: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  fetchStickers: async (userId: string, force = false) => {
    const { stickers, hasFetchedStickers, isStickersLoading } = get();
    if (isStickersLoading) return;
    // Only fetch if stickers array is empty or force refetch requested
    if (!force && (stickers.length > 0 || hasFetchedStickers)) return;

    set({ isStickersLoading: true });
    try {
      const res = await getUserStickers(userId);
      if (res.status && res.data) {
        set({ stickers: res.data, isStickersLoading: false, hasFetchedStickers: true });
      } else {
        set({ isStickersLoading: false, hasFetchedStickers: true });
      }
    } catch {
      set({ isStickersLoading: false, hasFetchedStickers: true });
    }
  },

  addSticker: (sticker: UserStickersType) => {
    set((state) => ({
      stickers: [sticker, ...state.stickers],
      hasFetchedStickers: true,
    }));
  },

  removeSticker: (stickerId: string) => {
    set((state) => ({
      stickers: state.stickers.filter((s) => s.$id !== stickerId),
    }));
  },
}));