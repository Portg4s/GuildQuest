import { create } from "zustand";
import type { Badge, GachaPull, PlayerCharacter, PlayerTitle } from "@/domain/models";
import type { QuizProgress } from "@/storage/db";

type GameStore = {
  completedMissionIds: string[];
  unlockedZoneIds: string[];
  collection: PlayerCharacter[];
  gachaHistory: GachaPull[];
  unlockedBadges: Badge[];
  unlockedTitles: PlayerTitle[];
  quizProgressById: Record<string, QuizProgress>;
  activeMissionId?: string;
  setActiveMissionId: (missionId?: string) => void;
  setCollection: (collection: PlayerCharacter[]) => void;
  setGachaHistory: (history: GachaPull[]) => void;
  prependGachaHistory: (history: GachaPull[]) => void;
  setUnlockedBadges: (badges: Badge[]) => void;
  addUnlockedBadges: (badges: Badge[]) => void;
  setUnlockedTitles: (titles: PlayerTitle[]) => void;
  addUnlockedTitles: (titles: PlayerTitle[]) => void;
  setActiveCharacter: (characterId: string) => void;
  setQuizProgress: (progress: Record<string, QuizProgress>) => void;
  upsertQuizProgress: (progress: QuizProgress) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  completedMissionIds: [],
  unlockedZoneIds: ["zone-internet-web"],
  collection: [],
  gachaHistory: [],
  unlockedBadges: [],
  unlockedTitles: [],
  quizProgressById: {},
  activeMissionId: undefined,
  setActiveMissionId: (missionId) => set({ activeMissionId: missionId }),
  setCollection: (collection) => set({ collection }),
  setGachaHistory: (history) => set({ gachaHistory: history }),
  prependGachaHistory: (history) =>
    set((state) => ({
      gachaHistory: [...history, ...state.gachaHistory]
    })),
  setUnlockedBadges: (badges) => set({ unlockedBadges: badges }),
  addUnlockedBadges: (badges) =>
    set((state) => ({
      unlockedBadges: [...state.unlockedBadges, ...badges.filter((badge) => !state.unlockedBadges.some((item) => item.id === badge.id))]
    })),
  setUnlockedTitles: (titles) => set({ unlockedTitles: titles }),
  addUnlockedTitles: (titles) =>
    set((state) => ({
      unlockedTitles: [...state.unlockedTitles, ...titles.filter((title) => !state.unlockedTitles.some((item) => item.id === title.id))]
    })),
  setActiveCharacter: (characterId) =>
    set((state) => ({
      collection: state.collection.map((playerCharacter) => ({
        ...playerCharacter,
        isActive: playerCharacter.characterId === characterId
      }))
    })),
  setQuizProgress: (progress) =>
    set({
      quizProgressById: progress,
      completedMissionIds: Object.values(progress)
        .filter((entry) => entry.completedAt)
        .map((entry) => entry.quizId)
    }),
  upsertQuizProgress: (progress) =>
    set((state) => {
      const quizProgressById = {
        ...state.quizProgressById,
        [progress.quizId]: progress
      };

      return {
        quizProgressById,
        completedMissionIds: Object.values(quizProgressById)
          .filter((entry) => entry.completedAt)
          .map((entry) => entry.quizId)
      };
    })
}));
