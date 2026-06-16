export type PlayerCharacter = {
  id: string;
  characterId: string;
  level: number;
  xp: number;
  fragments: number;
  duplicateCount: number;
  duplicates: number;
  obtainedAt: string;
  unlockedAt: string;
  isActive: boolean;
};
