import { create } from "zustand";
import type { PlayerCharacter } from "@/domain/models";

type GameStore = {
  completedMissionIds: string[];
  unlockedZoneIds: string[];
  collection: PlayerCharacter[];
  activeMissionId?: string;
  setActiveMissionId: (missionId?: string) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  completedMissionIds: [],
  unlockedZoneIds: ["zone-internet-web"],
  collection: [],
  activeMissionId: undefined,
  setActiveMissionId: (missionId) => set({ activeMissionId: missionId })
}));
