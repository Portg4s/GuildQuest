import { create } from "zustand";

type UiStore = {
  animationsEnabled: boolean;
  soundEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  animationsEnabled: true,
  soundEnabled: false,
  setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled })
}));
