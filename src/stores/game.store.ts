import { create } from "zustand";
import type { PlayerCharacter } from "@/domain/models";
import type { QuizProgress } from "@/storage/db";

type GameStore = {
  completedMissionIds: string[];
  unlockedZoneIds: string[];
  collection: PlayerCharacter[];
  quizProgressById: Record<string, QuizProgress>;
  activeMissionId?: string;
  setActiveMissionId: (missionId?: string) => void;
  setQuizProgress: (progress: Record<string, QuizProgress>) => void;
  upsertQuizProgress: (progress: QuizProgress) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  completedMissionIds: [],
  unlockedZoneIds: ["zone-internet-web"],
  collection: [],
  quizProgressById: {},
  activeMissionId: undefined,
  setActiveMissionId: (missionId) => set({ activeMissionId: missionId }),
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
