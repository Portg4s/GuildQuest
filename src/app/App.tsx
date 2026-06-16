import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { getCharacterRegistryInfo, getCharacters } from "@/data/characters/characters.registry";
import { foundationsWebPack } from "@/data/packs/foundations-web.example";
import { titleDefinitions } from "@/data/config/titles.config";
import type {
  ArenaProgress,
  Badge,
  Character,
  DailyProgress,
  DailyQuestId,
  DuelHistoryEntry,
  DuelTeam,
  GameSettings,
  Player,
  PlayerTitle,
  Quiz,
  ShopItem,
  ShopPurchase,
  StreakState
} from "@/domain/models";
import { performGachaInvocation, type GachaPullResult } from "@/domain/gacha/gacha.service";
import {
  evaluateGachaUnlocks,
  evaluateLearningUnlocks,
  getDefaultUnlockedTitles
} from "@/domain/progression/achievements.service";
import { applyRewardsToPlayerDetailed, type LevelProgressionResult } from "@/domain/progression/level.service";
import { calculatePackProgress } from "@/domain/progression/learning-progress.service";
import { calculateMissionRewards, type RewardResult } from "@/domain/reward/reward.service";
import { buildMissionsFromPack, type Mission } from "@/domain/services/mission.service";
import type { QuizScoreResult } from "@/domain/services/quiz.service";
import { HomeScreen } from "@/features/home/HomeScreen";
import { OnboardingScreen } from "@/features/onboarding/OnboardingScreen";
import { QuizScreen } from "@/features/quiz/QuizScreen";
import { ResultsScreen } from "@/features/results/ResultsScreen";
import { SplashScreen } from "@/features/splash/SplashScreen";
import { getStoredCollection, saveCollection } from "@/storage/repositories/collection.repository";
import { getStoredGachaHistory, saveGachaPulls } from "@/storage/repositories/gacha-history.repository";
import {
  getStoredBadges,
  getStoredTitles,
  saveUnlockedBadges,
  saveUnlockedTitles
} from "@/storage/repositories/achievement.repository";
import { getStoredPlayer, savePlayer } from "@/storage/repositories/player.repository";
import { getQuizProgressMap, recordQuizAttempt } from "@/storage/repositories/quiz-progress.repository";
import { resetAllLocalData } from "@/storage/repositories/backup.repository";
import { defaultSettings, getStoredSettings, normalizeSettings, saveSettings } from "@/storage/repositories/settings.repository";
import {
  claimDailyQuestReward,
  createDailyProgress,
  createStreakState,
  getStoredStreakState,
  getTodayDailyProgress,
  trackDailyQuest
} from "@/storage/repositories/daily.repository";
import { getStoredShopPurchases, purchaseShopItem } from "@/storage/repositories/shop.repository";
import {
  getStoredArenaProgress,
  getStoredDuelHistory,
  getStoredDuelTeam,
  recordDuelHistory,
  saveDuelTeam
} from "@/storage/repositories/duel.repository";
import { setOnboardingSeen } from "@/storage/repositories/onboarding.repository";
import { useGameStore } from "@/stores/game.store";
import { defaultPlayer, usePlayerStore } from "@/stores/player.store";
import { useUiStore } from "@/stores/ui.store";

const BadgesScreen = lazy(() => import("@/features/badges/BadgesScreen").then((module) => ({ default: module.BadgesScreen })));
const CharacterDetailScreen = lazy(() =>
  import("@/features/character-detail/CharacterDetailScreen").then((module) => ({ default: module.CharacterDetailScreen }))
);
const CollectionScreen = lazy(() =>
  import("@/features/collection/CollectionScreen").then((module) => ({ default: module.CollectionScreen }))
);
const DailyQuestsScreen = lazy(() =>
  import("@/features/daily/DailyQuestsScreen").then((module) => ({ default: module.DailyQuestsScreen }))
);
const DuelScreen = lazy(() => import("@/features/duel/DuelScreen").then((module) => ({ default: module.DuelScreen })));
const GachaScreen = lazy(() => import("@/features/gacha/GachaScreen").then((module) => ({ default: module.GachaScreen })));
const ImportExportScreen = lazy(() =>
  import("@/features/import-export/ImportExportScreen").then((module) => ({ default: module.ImportExportScreen }))
);
const MapScreen = lazy(() => import("@/features/map/MapScreen").then((module) => ({ default: module.MapScreen })));
const MissionsScreen = lazy(() => import("@/features/missions/MissionsScreen").then((module) => ({ default: module.MissionsScreen })));
const ProfileScreen = lazy(() => import("@/features/profile/ProfileScreen").then((module) => ({ default: module.ProfileScreen })));
const SettingsScreen = lazy(() => import("@/features/settings/SettingsScreen").then((module) => ({ default: module.SettingsScreen })));
const ShopScreen = lazy(() => import("@/features/shop/ShopScreen").then((module) => ({ default: module.ShopScreen })));
const ZoneDetailScreen = lazy(() => import("@/features/map/ZoneDetailScreen").then((module) => ({ default: module.ZoneDetailScreen })));

type AppScreen =
  | "home"
  | "missions"
  | "map"
  | "zone-detail"
  | "quiz"
  | "results"
  | "profile"
  | "settings"
  | "import-export"
  | "badges"
  | "daily"
  | "shop"
  | "onboarding"
  | "gacha"
  | "duel"
  | "collection"
  | "character-detail";

type CompletedMissionResult = {
  quiz: Quiz;
  scoreResult: QuizScoreResult;
  rewards: RewardResult;
  levelProgression: LevelProgressionResult;
  totalGemsGained: number;
  newBadges: Badge[];
  newTitles: PlayerTitle[];
};

function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [selectedMission, setSelectedMission] = useState<Mission | undefined>();
  const [selectedZoneId, setSelectedZoneId] = useState<string | undefined>();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>();
  const [completedResult, setCompletedResult] = useState<CompletedMissionResult | undefined>();
  const [gachaResults, setGachaResults] = useState<GachaPullResult[]>([]);
  const [gachaError, setGachaError] = useState<string | undefined>();
  const [isInvoking, setIsInvoking] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [persistenceError, setPersistenceError] = useState<string | undefined>();
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>(() => createDailyProgress());
  const [streakState, setStreakState] = useState<StreakState>(() => createStreakState());
  const [shopPurchases, setShopPurchases] = useState<ShopPurchase[]>([]);
  const [shopMessage, setShopMessage] = useState<string | undefined>();
  const [duelTeam, setDuelTeam] = useState<DuelTeam | undefined>();
  const [duelHistory, setDuelHistory] = useState<DuelHistoryEntry[]>([]);
  const [arenaProgress, setArenaProgress] = useState<ArenaProgress>({
    id: "main-arena",
    rank: "Bronze",
    points: 0,
    bestRank: "Bronze",
    updatedAt: new Date().toISOString()
  });
  const [onboardingSeen, setOnboardingSeenState] = useState(true);
  const player = usePlayerStore((state) => state.player);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const animationsEnabled = useUiStore((state) => state.animationsEnabled);
  const soundEnabled = useUiStore((state) => state.soundEnabled);
  const animationSpeed = useUiStore((state) => state.animationSpeed);
  const showIntroSplash = useUiStore((state) => state.showIntroSplash);
  const setUiPreferences = useUiStore((state) => state.setPreferences);
  const collection = useGameStore((state) => state.collection);
  const gachaHistory = useGameStore((state) => state.gachaHistory);
  const unlockedBadges = useGameStore((state) => state.unlockedBadges);
  const unlockedTitles = useGameStore((state) => state.unlockedTitles);
  const quizProgressById = useGameStore((state) => state.quizProgressById);
  const setCollection = useGameStore((state) => state.setCollection);
  const setGachaHistory = useGameStore((state) => state.setGachaHistory);
  const prependGachaHistory = useGameStore((state) => state.prependGachaHistory);
  const setUnlockedBadges = useGameStore((state) => state.setUnlockedBadges);
  const addUnlockedBadges = useGameStore((state) => state.addUnlockedBadges);
  const setUnlockedTitles = useGameStore((state) => state.setUnlockedTitles);
  const addUnlockedTitles = useGameStore((state) => state.addUnlockedTitles);
  const setActiveCharacterInCollection = useGameStore((state) => state.setActiveCharacter);
  const setQuizProgress = useGameStore((state) => state.setQuizProgress);
  const upsertQuizProgress = useGameStore((state) => state.upsertQuizProgress);
  const characters = useMemo(() => getCharacters(), []);
  const characterRegistryInfo = useMemo(() => getCharacterRegistryInfo(), []);
  const settings: GameSettings = useMemo(
    () =>
      normalizeSettings({
        animationsEnabled,
        soundEnabled,
        animationSpeed,
        showIntroSplash,
        onboardingSeen,
        reducedMotion: animationSpeed === "reduced"
      }),
    [animationSpeed, animationsEnabled, onboardingSeen, showIntroSplash, soundEnabled]
  );

  useEffect(() => {
    if (!splashVisible) return;

    const duration = !showIntroSplash
      ? 120
      : !animationsEnabled
        ? 260
        : animationSpeed === "fast"
          ? 900
          : animationSpeed === "reduced"
            ? 650
            : 1500;
    const timeoutId = window.setTimeout(() => setSplashVisible(false), duration);

    return () => window.clearTimeout(timeoutId);
  }, [animationSpeed, animationsEnabled, showIntroSplash, splashVisible]);

  const reloadLocalState = useCallback(async () => {
    try {
      const [
        storedPlayer,
        storedProgress,
        storedCollection,
        storedGachaHistory,
        storedBadges,
        storedTitles,
        storedSettings,
        storedDailyProgress,
        storedStreakState,
        storedShopPurchases,
        storedDuelTeam,
        storedDuelHistory,
        storedArenaProgress
      ] = await Promise.all([
        getStoredPlayer(),
        getQuizProgressMap(),
        getStoredCollection(),
        getStoredGachaHistory(),
        getStoredBadges(),
        getStoredTitles(),
        getStoredSettings(),
        getTodayDailyProgress(),
        getStoredStreakState(),
        getStoredShopPurchases(),
        getStoredDuelTeam(),
        getStoredDuelHistory(),
        getStoredArenaProgress()
      ]);

      if (storedPlayer) {
        setPlayer(normalizePlayer(storedPlayer));
      } else {
        setPlayer(defaultPlayer);
        await savePlayer(defaultPlayer);
      }

      setQuizProgress(storedProgress);
      setCollection(storedCollection);
      setGachaHistory(storedGachaHistory);
      setUnlockedBadges(storedBadges);
      setDailyProgress(storedDailyProgress);
      setStreakState(storedStreakState);
      setShopPurchases(storedShopPurchases);
      setDuelTeam(storedDuelTeam);
      setDuelHistory(storedDuelHistory);
      setArenaProgress(storedArenaProgress);

      if (storedTitles.length > 0) {
        setUnlockedTitles(storedTitles);
      } else {
        const defaultTitles = getDefaultUnlockedTitles();
        setUnlockedTitles(defaultTitles);
        await saveUnlockedTitles(defaultTitles);
      }

      const nextSettings = normalizeSettings(storedSettings ?? defaultSettings);
      setOnboardingSeenState(nextSettings.onboardingSeen);
      setUiPreferences({
        animationsEnabled: nextSettings.animationsEnabled,
        soundEnabled: nextSettings.soundEnabled,
        animationSpeed: nextSettings.animationSpeed,
        showIntroSplash: nextSettings.showIntroSplash
      });
      if (!storedSettings) await saveSettings(nextSettings);

      const dailyOpen = await trackDailyQuest("open-app");
      setDailyProgress(dailyOpen.dailyProgress);
      setStreakState(dailyOpen.streakState);
      if (!nextSettings.onboardingSeen) {
        setScreen("onboarding");
      }

      setPersistenceError(undefined);
    } catch (error) {
      setPersistenceError("La sauvegarde locale n'a pas pu etre chargee.");
      console.error(error);
    }
  }, [
    setCollection,
    setGachaHistory,
    setPlayer,
    setQuizProgress,
    setUiPreferences,
    setUnlockedBadges,
    setUnlockedTitles
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reloadLocalState();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [reloadLocalState]);

  const updateSettings = (nextSettings: GameSettings) => {
    const normalized = normalizeSettings(nextSettings);
    setUiPreferences({
      animationsEnabled: normalized.animationsEnabled,
      soundEnabled: normalized.soundEnabled,
      animationSpeed: normalized.animationSpeed,
      showIntroSplash: normalized.showIntroSplash
    });
    setOnboardingSeenState(normalized.onboardingSeen);
    void saveSettings(normalized).catch((error) => {
      setPersistenceError("Les parametres sont appliques en memoire, mais la sauvegarde locale a echoue.");
      console.error(error);
    });
  };

  const resetAllData = async () => {
    const confirmed = window.confirm("Cette action remplacera toute ta progression locale. Continuer ?");
    if (!confirmed) return;

    try {
      await resetAllLocalData();
      setGachaResults([]);
      setSelectedMission(undefined);
      setSelectedCharacter(undefined);
      setCompletedResult(undefined);
      await reloadLocalState();
      setScreen("home");
    } catch (error) {
      setPersistenceError("La reinitialisation locale a echoue.");
      console.error(error);
    }
  };

  const missions = useMemo(
    () => buildMissionsFromPack(foundationsWebPack, quizProgressById),
    [quizProgressById]
  );
  const packProgress = useMemo(
    () => calculatePackProgress(foundationsWebPack, quizProgressById),
    [quizProgressById]
  );
  const regionProgress = packProgress.regions[0];
  const selectedZone = useMemo(
    () => foundationsWebPack.regions.flatMap((region) => region.zones).find((zone) => zone.id === selectedZoneId),
    [selectedZoneId]
  );
  const activeCharacter = useMemo(
    () => characters.find((character) => character.id === player.activeCharacterId),
    [characters, player.activeCharacterId]
  );
  const activeTitle = useMemo(
    () => titleDefinitions.find((title) => title.id === player.activeTitleId),
    [player.activeTitleId]
  );
  const selectedOwnedCharacter = useMemo(
    () => collection.find((playerCharacter) => playerCharacter.characterId === selectedCharacter?.id),
    [collection, selectedCharacter]
  );
  const weeklyStats = useMemo(
    () => ({
      quizCompleted: Object.values(quizProgressById).filter((entry) => entry.completedAt).length,
      duelWins: player.duelStats?.won ?? 0,
      gachaPulls: gachaHistory.length,
      perfectQuiz: Object.values(quizProgressById).filter((entry) => entry.bestScore === 100).length
    }),
    [gachaHistory.length, player.duelStats?.won, quizProgressById]
  );

  const goHome = () => setScreen("home");

  const syncDailyQuest = (questId: DailyQuestId, amount = 1) => {
    void trackDailyQuest(questId, amount)
      .then((result) => {
        setDailyProgress(result.dailyProgress);
        setStreakState(result.streakState);
      })
      .catch((error) => {
        setPersistenceError("L'objectif quotidien est applique en jeu, mais sa sauvegarde a echoue.");
        console.error(error);
      });
  };

  const completeOnboarding = async () => {
    try {
      const nextSettings = await setOnboardingSeen(true);
      setOnboardingSeenState(true);
      updateSettings(nextSettings);
      setScreen("home");
    } catch (error) {
      setPersistenceError("Le tutoriel est termine, mais la sauvegarde locale a echoue.");
      console.error(error);
      setScreen("home");
    }
  };

  const replayOnboarding = () => {
    setScreen("onboarding");
  };

  const claimDailyReward = (questId: DailyQuestId) => {
    void claimDailyQuestReward(player, questId)
      .then((result) => {
        if (result.claimed) {
          setPlayer(result.player);
          setDailyProgress(result.dailyProgress);
          setStreakState(result.streakState);
        }
      })
      .catch((error) => {
        setPersistenceError("La recompense quotidienne n'a pas pu etre reclamee.");
        console.error(error);
      });
  };

  const startMission = (mission: Mission) => {
    setSelectedMission(mission);
    setCompletedResult(undefined);
    setScreen("quiz");
  };

  const startQuizFromMap = (quiz: Quiz) => {
    const mission = missions.find((candidate) => candidate.quiz.id === quiz.id);

    if (mission) {
      startMission(mission);
    }
  };

  const completeQuiz = (scoreResult: QuizScoreResult) => {
    if (!selectedMission) return;

    const rewards = calculateMissionRewards(selectedMission.quiz.rank, scoreResult.score);
    const rewardApplication = applyRewardsToPlayerDetailed(player, rewards.xpGained, rewards.gemsGained);
    const optimisticProgress = buildQuizProgressAttempt(
      selectedMission.quiz.id,
      scoreResult,
      {
        xpGained: rewards.xpGained,
        gemsGained: rewardApplication.totalGemsGained
      },
      quizProgressById[selectedMission.quiz.id]
    );
    const nextProgressById = {
      ...quizProgressById,
      [selectedMission.quiz.id]: optimisticProgress
    };
    const nextRegionProgress = calculatePackProgress(foundationsWebPack, nextProgressById).regions[0];
    const learningUnlocks = evaluateLearningUnlocks({
      player: rewardApplication.player,
      scoreResult,
      levelProgression: rewardApplication.levelProgression,
      regionProgress: nextRegionProgress,
      unlockedBadgeIds: [...player.unlockedBadgeIds, ...unlockedBadges.map((badge) => badge.id)],
      unlockedTitleIds: [...player.unlockedTitleIds, ...unlockedTitles.map((title) => title.id)]
    });
    const updatedPlayer: Player = {
      ...rewardApplication.player,
      unlockedBadgeIds: mergeIds(rewardApplication.player.unlockedBadgeIds, learningUnlocks.newBadges.map((badge) => badge.id)),
      unlockedTitleIds: mergeIds(rewardApplication.player.unlockedTitleIds, learningUnlocks.newTitles.map((title) => title.id)),
      activeTitleId: rewardApplication.player.activeTitleId ?? "guild-apprentice"
    };

    setPlayer(updatedPlayer);
    upsertQuizProgress(optimisticProgress);
    addUnlockedBadges(learningUnlocks.newBadges);
    addUnlockedTitles(learningUnlocks.newTitles);
    setCompletedResult({
      quiz: selectedMission.quiz,
      scoreResult,
      rewards,
      levelProgression: rewardApplication.levelProgression,
      totalGemsGained: rewardApplication.totalGemsGained,
      newBadges: learningUnlocks.newBadges,
      newTitles: learningUnlocks.newTitles
    });
    setScreen("results");
    syncDailyQuest("complete-quiz");
    if (scoreResult.score >= 80) {
      syncDailyQuest("score-80");
    }

    void saveMissionProgress(
      selectedMission.quiz.id,
      scoreResult,
      rewards,
      rewardApplication.levelProgression.bonusGems,
      rewardApplication.totalGemsGained,
      updatedPlayer,
      learningUnlocks.newBadges,
      learningUnlocks.newTitles
    );
  };

  const invokeGacha = (count: 1 | 10) => {
    if (isInvoking) return;

    setGachaError(undefined);
    setIsInvoking(true);

    window.setTimeout(() => {
      try {
        const invocation = performGachaInvocation({
          player,
          collection,
          count,
          characters
        });

        setPlayer(invocation.player);
        setCollection(invocation.collection);
        prependGachaHistory(invocation.history);
        setGachaResults(invocation.results);
        const gachaUnlocks = evaluateGachaUnlocks({
          pulls: invocation.history,
          collection: invocation.collection,
          unlockedBadgeIds: [...invocation.player.unlockedBadgeIds, ...unlockedBadges.map((badge) => badge.id)],
          unlockedTitleIds: [...invocation.player.unlockedTitleIds, ...unlockedTitles.map((title) => title.id)]
        });
        const updatedPlayer = {
          ...invocation.player,
          unlockedBadgeIds: mergeIds(invocation.player.unlockedBadgeIds, gachaUnlocks.newBadges.map((badge) => badge.id)),
          unlockedTitleIds: mergeIds(invocation.player.unlockedTitleIds, gachaUnlocks.newTitles.map((title) => title.id))
        };

        setPlayer(updatedPlayer);
        addUnlockedBadges(gachaUnlocks.newBadges);
        addUnlockedTitles(gachaUnlocks.newTitles);
        syncDailyQuest("gacha-pull", count);
        void saveGachaInvocation(updatedPlayer, invocation.collection, invocation.history, gachaUnlocks.newBadges, gachaUnlocks.newTitles);
      } catch (error) {
        setGachaError(error instanceof Error ? error.message : "Invocation impossible.");
      } finally {
        setIsInvoking(false);
      }
    }, 650);
  };

  const saveGachaInvocation = async (
    updatedPlayer: Player,
    updatedCollection: typeof collection,
    pulls: typeof gachaHistory,
    newBadges: Badge[] = [],
    newTitles: PlayerTitle[] = []
  ) => {
    try {
      await Promise.all([
        savePlayer(updatedPlayer),
        saveCollection(updatedCollection),
        saveGachaPulls(pulls),
        saveUnlockedBadges(newBadges),
        saveUnlockedTitles(newTitles)
      ]);
      setPersistenceError(undefined);
    } catch (error) {
      setPersistenceError("L'invocation est appliquee en memoire, mais la sauvegarde locale a echoue.");
      console.error(error);
    }
  };

  const setActiveCharacter = (characterId: string) => {
    const updatedPlayer: Player = {
      ...player,
      activeCharacterId: characterId,
      updatedAt: new Date().toISOString()
    };
    const updatedCollection = collection.map((playerCharacter) => ({
      ...playerCharacter,
      isActive: playerCharacter.characterId === characterId
    }));

    setPlayer(updatedPlayer);
    setActiveCharacterInCollection(characterId);
    void Promise.all([savePlayer(updatedPlayer), saveCollection(updatedCollection)]).catch((error) => {
      setPersistenceError("Le personnage actif est modifie en memoire, mais la sauvegarde locale a echoue.");
      console.error(error);
    });
  };

  const setActiveTitle = (titleId: string) => {
    const updatedPlayer = {
      ...player,
      activeTitleId: titleId,
      updatedAt: new Date().toISOString()
    };

    setPlayer(updatedPlayer);
    void savePlayer(updatedPlayer).catch((error) => {
      setPersistenceError("Le titre actif est modifie en memoire, mais la sauvegarde locale a echoue.");
      console.error(error);
    });
  };

  const completeDuel = (result: {
    xp: number;
    gems: number;
    won: boolean;
    opponentId: string;
    opponentName: string;
    teamCharacterIds: string[];
  }) => {
    const rewardApplication = applyRewardsToPlayerDetailed(player, result.xp, result.gems);
    const updatedPlayer: Player = {
      ...rewardApplication.player,
      duelStats: {
        played: (player.duelStats?.played ?? 0) + 1,
        won: (player.duelStats?.won ?? 0) + (result.won ? 1 : 0)
      },
      updatedAt: new Date().toISOString()
    };

    setPlayer(updatedPlayer);
    syncDailyQuest("play-duel");
    if (result.won) syncDailyQuest("win-duel");
    void Promise.all([
      savePlayer(updatedPlayer),
      recordDuelHistory({
        opponentId: result.opponentId,
        opponentName: result.opponentName,
        won: result.won,
        xpGained: result.xp,
        gemsGained: result.gems,
        arenaPointsGained: result.won ? 25 : 5,
        teamCharacterIds: result.teamCharacterIds
      })
    ])
      .then(([, duelRecord]) => {
        setDuelHistory((current) => [duelRecord.history, ...current].slice(0, 10));
        setArenaProgress(duelRecord.arena);
      })
      .catch((error) => {
        setPersistenceError("La recompense de duel est appliquee en memoire, mais la sauvegarde locale a echoue.");
        console.error(error);
      });
  };

  const savePreferredDuelTeam = (characterIds: string[]) => {
    void saveDuelTeam(characterIds)
      .then(setDuelTeam)
      .catch((error) => {
        setPersistenceError("L'equipe de duel n'a pas pu etre sauvegardee.");
        console.error(error);
      });
  };

  const buyShopItem = (item: ShopItem) => {
    const confirmed = window.confirm(`Acheter ${item.name} pour ${item.costGems} gemmes ?`);
    if (!confirmed) return;

    void purchaseShopItem(player, item)
      .then((result) => {
        setPlayer(result.player);
        setShopPurchases((current) => [result.purchase, ...current]);
        setShopMessage(`${item.name} achete : +${result.purchase.xpGained} XP, +${result.purchase.magicDustGained} poussiere.`);
      })
      .catch((error) => {
        setShopMessage(error instanceof Error ? error.message : "Achat impossible.");
      });
  };

  const applyDebugPlayerUpdate = (updater: (current: Player) => Player) => {
    const updatedPlayer = updater(player);

    setPlayer(updatedPlayer);
    void savePlayer(updatedPlayer).catch((error) => {
      setPersistenceError("Le debug local est applique en memoire, mais la sauvegarde locale a echoue.");
      console.error(error);
    });
  };

  const saveMissionProgress = async (
    quizId: string,
    scoreResult: QuizScoreResult,
    rewards: RewardResult,
    levelBonusGems: number,
    totalGemsGained: number,
    updatedPlayer: typeof player,
    newBadges: Badge[] = [],
    newTitles: PlayerTitle[] = []
  ) => {
    try {
      await savePlayer(updatedPlayer);
      const progress = await recordQuizAttempt({
        quizId,
        score: scoreResult.score,
        correctAnswers: scoreResult.correctAnswers,
        totalQuestions: scoreResult.totalQuestions,
        rewards: {
          xpGained: rewards.xpGained,
          gemsGained: totalGemsGained,
          missionGemsGained: rewards.gemsGained,
          levelBonusGems
        }
      });
      upsertQuizProgress(progress);
      await Promise.all([saveUnlockedBadges(newBadges), saveUnlockedTitles(newTitles)]);
      setPersistenceError(undefined);
    } catch (error) {
      setPersistenceError("La progression a ete appliquee en memoire, mais la sauvegarde locale a echoue.");
      console.error(error);
    }
  };

  return (
    <main className="guild-background arcane-background min-h-screen overflow-hidden text-slate-50">
      <AnimatePresence>
        {splashVisible && (
          <SplashScreen animationsEnabled={animationsEnabled} animationSpeed={animationSpeed} />
        )}
      </AnimatePresence>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(250,204,21,0.12),transparent_28%),radial-gradient(circle_at_10%_30%,rgba(45,212,191,0.16),transparent_26%),linear-gradient(180deg,rgba(2,6,23,0.1),rgba(2,6,23,0.74))]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        {persistenceError && (
          <div className="mb-4 rounded-lg border border-amber-300/30 bg-amber-300/10 p-3 text-sm font-semibold text-amber-100">
            {persistenceError}
          </div>
        )}

        <Suspense fallback={<GuildLoadingFallback />}>
        {screen === "onboarding" && (
          <OnboardingScreen onComplete={completeOnboarding} onSkip={completeOnboarding} />
        )}

        {screen === "home" && (
          <HomeScreen
            player={player}
            activeTitle={activeTitle}
            activeCharacter={activeCharacter}
            regionProgress={regionProgress}
            dailyProgress={dailyProgress}
            streak={streakState}
            onGoToMissions={() => setScreen("missions")}
            onGoToMap={() => setScreen("map")}
            onGoToProfile={() => setScreen("profile")}
            onGoToGacha={() => setScreen("gacha")}
            onGoToCollection={() => setScreen("collection")}
            onGoToBadges={() => setScreen("badges")}
            onGoToSettings={() => setScreen("settings")}
            onGoToDuel={() => setScreen("duel")}
            onGoToDaily={() => setScreen("daily")}
            onGoToShop={() => setScreen("shop")}
          />
        )}

        {screen === "daily" && (
          <DailyQuestsScreen
            dailyProgress={dailyProgress}
            streak={streakState}
            weeklyStats={weeklyStats}
            onBackHome={goHome}
            onClaimQuest={claimDailyReward}
          />
        )}

        {screen === "shop" && (
          <ShopScreen
            player={player}
            lastPurchase={shopPurchases[0]}
            message={shopMessage}
            onBackHome={goHome}
            onPurchase={buyShopItem}
          />
        )}

        {screen === "missions" && (
          <MissionsScreen missions={missions} onBackHome={goHome} onStartQuiz={startMission} />
        )}

        {screen === "map" && (
          <MapScreen
            pack={foundationsWebPack}
            regionProgress={regionProgress}
            onBackHome={goHome}
            onExploreZone={(zoneId) => {
              setSelectedZoneId(zoneId);
              setScreen("zone-detail");
            }}
          />
        )}

        {screen === "zone-detail" && selectedZone && (
          <ZoneDetailScreen
            pack={foundationsWebPack}
            zone={selectedZone}
            progressByQuizId={quizProgressById}
            onBackMap={() => setScreen("map")}
            onStartQuiz={startQuizFromMap}
          />
        )}

        {screen === "quiz" && selectedMission && (
          <QuizScreen quiz={selectedMission.quiz} onExit={() => setScreen("missions")} onComplete={completeQuiz} />
        )}

        {screen === "results" && completedResult && (
          <ResultsScreen
            quiz={completedResult.quiz}
            scoreResult={completedResult.scoreResult}
            rewards={completedResult.rewards}
            levelProgression={completedResult.levelProgression}
            totalGemsGained={completedResult.totalGemsGained}
            newBadges={completedResult.newBadges}
            newTitles={completedResult.newTitles}
            onBackToMissions={() => setScreen("missions")}
            onBackHome={goHome}
          />
        )}

        {screen === "profile" && (
          <ProfileScreen
            player={player}
            progressEntries={Object.values(quizProgressById)}
            collection={collection}
            gachaHistory={gachaHistory}
            activeCharacter={activeCharacter}
            activeTitle={activeTitle}
            unlockedBadges={unlockedBadges}
            unlockedTitles={unlockedTitles}
            regionProgress={regionProgress}
            streak={streakState}
            arenaProgress={arenaProgress}
            onBackHome={goHome}
            onGoToCollection={() => setScreen("collection")}
            onGoToBadges={() => setScreen("badges")}
            onDebugAddGems={(amount) =>
              applyDebugPlayerUpdate((current) => ({
                ...current,
                gems: current.gems + amount,
                updatedAt: new Date().toISOString()
              }))
            }
            onDebugAddXp={(amount) =>
              applyDebugPlayerUpdate((current) => {
                const rewardApplication = applyRewardsToPlayerDetailed(current, amount, 0);
                return rewardApplication.player;
              })
            }
            onDebugResetGems={() =>
              applyDebugPlayerUpdate((current) => ({
                ...current,
                gems: 200,
                updatedAt: new Date().toISOString()
              }))
            }
          />
        )}

        {screen === "badges" && (
          <BadgesScreen
            unlockedBadges={unlockedBadges}
            unlockedTitles={unlockedTitles}
            activeTitleId={player.activeTitleId}
            onSetActiveTitle={setActiveTitle}
            onBackHome={goHome}
          />
        )}

        {screen === "settings" && (
          <SettingsScreen
            player={player}
            settings={settings}
            appVersion="0.1.0"
            characterRegistryInfo={characterRegistryInfo}
            onBackHome={goHome}
            onOpenImportExport={() => setScreen("import-export")}
            onUpdateSettings={updateSettings}
            onReplayOnboarding={replayOnboarding}
            onResetAll={resetAllData}
          />
        )}

        {screen === "import-export" && (
          <ImportExportScreen
            onBackSettings={() => setScreen("settings")}
            onBackHome={goHome}
            onImported={reloadLocalState}
            onResetAll={resetAllData}
          />
        )}

        {screen === "gacha" && (
          <GachaScreen
            player={player}
            results={gachaResults}
            isInvoking={isInvoking}
            error={gachaError}
            animationsEnabled={animationsEnabled}
            animationSpeed={animationSpeed}
            onInvoke={invokeGacha}
            onBackHome={goHome}
            onGoToCollection={() => setScreen("collection")}
          />
        )}

        {screen === "duel" && (
          <DuelScreen
            collection={collection}
            characters={characters}
            preferredTeam={duelTeam}
            duelHistory={duelHistory}
            arenaProgress={arenaProgress}
            onBackHome={goHome}
            onGoToGacha={() => setScreen("gacha")}
            onSaveTeam={savePreferredDuelTeam}
            onDuelReward={completeDuel}
          />
        )}

        {screen === "collection" && (
          <CollectionScreen
            collection={collection}
            characters={characters}
            characterRegistryInfo={characterRegistryInfo}
            activeCharacterId={player.activeCharacterId}
            onBackHome={goHome}
            onOpenCharacter={(character) => {
              setSelectedCharacter(character);
              setScreen("character-detail");
            }}
            onSetActive={setActiveCharacter}
          />
        )}

        {screen === "character-detail" && selectedCharacter && (
          <CharacterDetailScreen
            character={selectedCharacter}
            owned={selectedOwnedCharacter}
            isActive={player.activeCharacterId === selectedCharacter.id}
            onBackCollection={() => setScreen("collection")}
            onSetActive={setActiveCharacter}
          />
        )}
        </Suspense>
      </div>
    </main>
  );
}

function GuildLoadingFallback() {
  return (
    <div className="guild-card mx-auto mt-12 max-w-sm p-4 text-center">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-200">Chargement</p>
      <p className="mt-2 text-white">La guilde prepare l'ecran...</p>
    </div>
  );
}

function normalizePlayer(player: Player): Player {
  return {
    ...player,
    magicDust: player.magicDust ?? 0,
    activeTitleId: player.activeTitleId ?? "guild-apprentice",
    unlockedBadgeIds: player.unlockedBadgeIds ?? [],
    unlockedTitleIds: player.unlockedTitleIds?.length ? player.unlockedTitleIds : ["guild-apprentice", "rank-f-mage"],
    duelStats: player.duelStats ?? { played: 0, won: 0 }
  };
}

function mergeIds(currentIds: string[], newIds: string[]) {
  return Array.from(new Set([...currentIds, ...newIds]));
}

function buildQuizProgressAttempt(
  quizId: string,
  scoreResult: QuizScoreResult,
  rewards: { xpGained: number; gemsGained: number },
  current?: { bestScore: number; attempts: number; completedAt?: string }
) {
  const now = new Date().toISOString();

  return {
    id: quizId,
    quizId,
    bestScore: Math.max(current?.bestScore ?? 0, scoreResult.score),
    attempts: (current?.attempts ?? 0) + 1,
    lastScore: scoreResult.score,
    lastCorrectAnswers: scoreResult.correctAnswers,
    lastTotalQuestions: scoreResult.totalQuestions,
    lastRewards: rewards,
    completedAt: scoreResult.score >= 60 ? now : current?.completedAt,
    updatedAt: now
  };
}

export default App;
