import { create } from "zustand";

type UiStore = {
  animationsEnabled: boolean;
  soundEnabled: boolean;
  animationSpeed: "normal" | "fast" | "reduced";
  showIntroSplash: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAnimationSpeed: (speed: "normal" | "fast" | "reduced") => void;
  setShowIntroSplash: (enabled: boolean) => void;
  setPreferences: (preferences: {
    animationsEnabled: boolean;
    soundEnabled: boolean;
    animationSpeed: "normal" | "fast" | "reduced";
    showIntroSplash: boolean;
  }) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  animationsEnabled: true,
  soundEnabled: false,
  animationSpeed: "normal",
  showIntroSplash: true,
  setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setShowIntroSplash: (enabled) => set({ showIntroSplash: enabled }),
  setPreferences: (preferences) => set(preferences)
}));
