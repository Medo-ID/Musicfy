import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  volume: number;
  hydrated: boolean;
  setInitialState: (data: Partial<PlayerStore>) => void;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  setVolume: (volume: number) => void;
  reset: () => void;
}

export const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  hydrated: false,
  volume: 1,
  setInitialState: (data) =>
    set({
      ...data,
      hydrated: true,
    }),
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids }),
  setVolume: (volume: number) => set({ volume }),
  reset: () => set({ ids: [], activeId: undefined }),
}));
