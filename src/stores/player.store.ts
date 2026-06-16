import { create } from "zustand";
import type { Player } from "@/domain/models";

const now = new Date().toISOString();

export const defaultPlayer: Player = {
  id: "player-leb",
  username: "leb",
  rank: "Mage de Rang F",
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  gems: 200,
  unlockedBadgeIds: [],
  unlockedTitleIds: [],
  createdAt: now,
  updatedAt: now
};

type PlayerStore = {
  player: Player;
  setPlayer: (player: Player) => void;
  addGems: (amount: number) => void;
  addXp: (amount: number) => void;
};

export const usePlayerStore = create<PlayerStore>((set) => ({
  player: defaultPlayer,
  setPlayer: (player) => set({ player }),
  addGems: (amount) =>
    set((state) => ({
      player: {
        ...state.player,
        gems: Math.max(0, state.player.gems + amount),
        updatedAt: new Date().toISOString()
      }
    })),
  addXp: (amount) =>
    set((state) => ({
      player: {
        ...state.player,
        xp: Math.max(0, state.player.xp + amount),
        updatedAt: new Date().toISOString()
      }
    }))
}));
