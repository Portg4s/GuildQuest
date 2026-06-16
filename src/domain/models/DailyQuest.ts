export type DailyQuestId =
  | "open-app"
  | "complete-quiz"
  | "score-80"
  | "gacha-pull"
  | "play-duel"
  | "win-duel";

export type DailyQuest = {
  id: DailyQuestId;
  title: string;
  description: string;
  target: number;
  reward: {
    xp: number;
    gems: number;
    magicDust?: number;
  };
};

export type DailyQuestProgress = {
  id: DailyQuestId;
  value: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  completedAt?: string;
  claimedAt?: string;
};

export type DailyProgress = {
  id: string;
  dateKey: string;
  quests: DailyQuestProgress[];
  completedCount: number;
  claimedCount: number;
  updatedAt: string;
};

export type StreakState = {
  id: string;
  current: number;
  best: number;
  lastActiveDateKey?: string;
  totalDailyCompleted: number;
  totalRewardsClaimed: number;
  updatedAt: string;
};
