import { create } from "zustand";

type UiStore = {
  animationsEnabled: boolean;
  soundEnabled: boolean;
  animationSpeed: "normal" | "fast" | "reduced";
  setAnimationsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAnimationSpeed: (speed: "normal" | "fast" | "reduced") => void;
  setPreferences: (preferences: {
    animationsEnabled: boolean;
    soundEnabled: boolean;
    animationSpeed: "normal" | "fast" | "reduced";
  }) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  animationsEnabled: true,
  soundEnabled: false,
  animationSpeed: "normal",
  setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setPreferences: (preferences) => set(preferences)
}));
