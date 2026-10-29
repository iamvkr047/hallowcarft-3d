import { create } from "zustand";

export interface NavbarStoreState {
  publishHandler: (() => void | Promise<void>) | null;
  setPublishHandler: (fn: (() => void | Promise<void>) | null) => void;

  craft3DSettings: {
    mode: "rotate" | "carve";
    isNightMode: boolean;
  } | null;
  setCraft3DSettings: (settings: { mode: "rotate" | "carve"; isNightMode: boolean } | null) => void;
}

export const useNavbarStore = create<NavbarStoreState>((set) => ({
  publishHandler: null,
  setPublishHandler: (publishHandler) => set({ publishHandler }),

  craft3DSettings: null,
  setCraft3DSettings: (craft3DSettings) => set({ craft3DSettings }),
}));
