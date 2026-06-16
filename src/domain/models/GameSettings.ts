export type GameSettings = {
  id: string;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  animationSpeed: "normal" | "fast" | "reduced";
  showIntroSplash: boolean;
  language: "fr";
  updatedAt: string;
};
