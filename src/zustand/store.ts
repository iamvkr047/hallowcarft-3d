// store.ts
import { create } from 'zustand'

// Define types for state & actions
interface StoreState {
    bears: number
    food: string
    feed: (food: string) => void
}

// Create store
export const useAppDataStore = create<StoreState>()((set) => ({
    bears: 2,
    food: 'honey',
    feed: (food) => set(() => ({ food })),
}))