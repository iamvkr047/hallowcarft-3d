import { create } from 'zustand';
import type { Models } from 'appwrite';
import { getUser, logoutUser } from '../appwrite/auth';
import { getUserStickers, getAllPublishedStickers, type UserStickersType } from '../appwrite/db';

export interface AppStoreState {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  stickers: UserStickersType[];
  isStickersLoading: boolean;
  hasFetchedStickers: boolean;
  publishedStickers: UserStickersType[];
  isPublishedStickersLoading: boolean;
  hasFetchedPublishedStickers: boolean;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  checkAuth: () => Promise<Models.User<Models.Preferences> | null>;
  logout: () => Promise<boolean>;
  fetchStickers: (userId: string, force?: boolean) => Promise<void>;
  fetchPublishedStickers: (force?: boolean) => Promise<void>;
  addSticker: (sticker: UserStickersType) => void;
  removeSticker: (stickerId: string) => void;
}

export const useAppDataStore = create<AppStoreState>()((set, get) => ({
  user: null,
  isLoading: true,
  stickers: [],
  isStickersLoading: false,
  hasFetchedStickers: false,
  publishedStickers: [],
  isPublishedStickersLoading: false,
  hasFetchedPublishedStickers: false,

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

  fetchPublishedStickers: async (force = false) => {
    const { publishedStickers, hasFetchedPublishedStickers, isPublishedStickersLoading } = get();
    if (isPublishedStickersLoading) return;
    // Only fetch if publishedStickers array is empty or force refetch requested
    if (!force && (publishedStickers.length > 0 || hasFetchedPublishedStickers)) return;

    set({ isPublishedStickersLoading: true });
    try {
      const res = await getAllPublishedStickers(50);
      if (res.status && res.data) {
        set({
          publishedStickers: res.data,
          isPublishedStickersLoading: false,
          hasFetchedPublishedStickers: true,
        });
      } else {
        set({ isPublishedStickersLoading: false, hasFetchedPublishedStickers: true });
      }
    } catch {
      set({ isPublishedStickersLoading: false, hasFetchedPublishedStickers: true });
    }
  },

  addSticker: (sticker: UserStickersType) => {
    set((state) => ({
      stickers: [sticker, ...state.stickers],
      publishedStickers: [sticker, ...state.publishedStickers],
      hasFetchedStickers: true,
    }));
  },

  removeSticker: (stickerId: string) => {
    set((state) => ({
      stickers: state.stickers.filter((s) => s.$id !== stickerId),
      publishedStickers: state.publishedStickers.filter((s) => s.$id !== stickerId),
    }));
  },
}));
