import { dailyQuestDefinitions } from "@/data/config/daily-quests.config";
import type { DailyProgress, DailyQuestId, DailyQuestProgress, Player, StreakState } from "@/domain/models";
import { getLocalDateKey } from "@/domain/services/date-key.service";
import { applyRewardsToPlayerDetailed } from "@/domain/progression/level.service";
import { db } from "@/storage/db";

const STREAK_ID = "main-streak";

export function createDailyProgress(dateKey = getLocalDateKey()): DailyProgress {
  const quests: DailyQuestProgress[] = dailyQuestDefinitions.map((quest) => ({
    id: quest.id,
    value: 0,
    target: quest.target,
    completed: false,
    claimed: false
  }));

  return {
    id: dateKey,
    dateKey,
    quests,
    completedCount: 0,
    claimedCount: 0,
    updatedAt: new Date().toISOString()
  };
}

export function createStreakState(): StreakState {
  return {
    id: STREAK_ID,
    current: 0,
    best: 0,
    totalDailyCompleted: 0,
    totalRewardsClaimed: 0,
    updatedAt: new Date().toISOString()
  };
}

export async function getTodayDailyProgress() {
  const today = getLocalDateKey();
  const stored = await db.dailyProgress.get(today);

  if (stored) return stored;

  const created = createDailyProgress(today);
  await db.dailyProgress.put(created);
  return created;
}

export async function getStoredStreakState() {
  const stored = await db.streakState.get(STREAK_ID);

  if (stored) return stored;

  const created = createStreakState();
  await db.streakState.put(created);
  return created;
}

export async function trackDailyQuest(questId: DailyQuestId, amount = 1) {
  const [daily, streak] = await Promise.all([getTodayDailyProgress(), getStoredStreakState()]);
  const today = getLocalDateKey();
  let newlyCompleted = false;
  const quests = daily.quests.map((quest) => {
    if (quest.id !== questId || quest.completed) return quest;

    const value = Math.min(quest.target, quest.value + amount);
    const completed = value >= quest.target;
    if (completed) newlyCompleted = true;

    return {
      ...quest,
      value,
      completed,
      completedAt: completed ? new Date().toISOString() : quest.completedAt
    };
  });
  const nextDaily = {
    ...daily,
    quests,
    completedCount: quests.filter((quest) => quest.completed).length,
    claimedCount: quests.filter((quest) => quest.claimed).length,
    updatedAt: new Date().toISOString()
  };
  const nextStreak = newlyCompleted ? updateStreakForToday(streak, today) : streak;

  await Promise.all([db.dailyProgress.put(nextDaily), db.streakState.put(nextStreak)]);

  return { dailyProgress: nextDaily, streakState: nextStreak, newlyCompleted };
}

export async function claimDailyQuestReward(player: Player, questId: DailyQuestId) {
  const [daily, streak] = await Promise.all([getTodayDailyProgress(), getStoredStreakState()]);
  const definition = dailyQuestDefinitions.find((quest) => quest.id === questId);
  const current = daily.quests.find((quest) => quest.id === questId);

  if (!definition || !current || !current.completed || current.claimed) {
    return { player, dailyProgress: daily, streakState: streak, claimed: false };
  }

  const rewardApplication = applyRewardsToPlayerDetailed(player, definition.reward.xp, definition.reward.gems);
  const updatedPlayer: Player = {
    ...rewardApplication.player,
    magicDust: (rewardApplication.player.magicDust ?? 0) + (definition.reward.magicDust ?? 0),
    updatedAt: new Date().toISOString()
  };
  const quests = daily.quests.map((quest) =>
    quest.id === questId ? { ...quest, claimed: true, claimedAt: new Date().toISOString() } : quest
  );
  const nextDaily = {
    ...daily,
    quests,
    claimedCount: quests.filter((quest) => quest.claimed).length,
    updatedAt: new Date().toISOString()
  };
  const nextStreak = {
    ...streak,
    totalRewardsClaimed: streak.totalRewardsClaimed + 1,
    updatedAt: new Date().toISOString()
  };

  await Promise.all([db.player.put(updatedPlayer), db.dailyProgress.put(nextDaily), db.streakState.put(nextStreak)]);

  return { player: updatedPlayer, dailyProgress: nextDaily, streakState: nextStreak, claimed: true };
}

function updateStreakForToday(streak: StreakState, today: string): StreakState {
  if (streak.lastActiveDateKey === today) {
    return {
      ...streak,
      totalDailyCompleted: streak.totalDailyCompleted + 1,
      updatedAt: new Date().toISOString()
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);
  const current = streak.lastActiveDateKey === yesterdayKey ? streak.current + 1 : 1;

  return {
    ...streak,
    current,
    best: Math.max(streak.best, current),
    lastActiveDateKey: today,
    totalDailyCompleted: streak.totalDailyCompleted + 1,
    updatedAt: new Date().toISOString()
  };
}
