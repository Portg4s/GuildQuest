import { useCallback, useEffect, useMemo, useState } from "react";
import { getCharacters } from "@/data/characters/characters.registry";
import { foundationsWebPack } from "@/data/packs/foundations-web.example";
import { titleDefinitions } from "@/data/config/titles.config";
import type { Badge, Character, GameSettings, Player, PlayerTitle, Quiz } from "@/domain/models";
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
import { CharacterDetailScreen } from "@/features/character-detail/CharacterDetailScreen";
import { CollectionScreen } from "@/features/collection/CollectionScreen";
import { GachaScreen } from "@/features/gacha/GachaScreen";
import { BadgesScreen } from "@/features/badges/BadgesScreen";
import { HomeScreen } from "@/features/home/HomeScreen";
import { ImportExportScreen } from "@/features/import-export/ImportExportScreen";
import { MapScreen } from "@/features/map/MapScreen";
import { ZoneDetailScreen } from "@/features/map/ZoneDetailScreen";
import { MissionsScreen } from "@/features/missions/MissionsScreen";
import { ProfileScreen } from "@/features/profile/ProfileScreen";
import { QuizScreen } from "@/features/quiz/QuizScreen";
import { ResultsScreen } from "@/features/results/ResultsScreen";
import { SettingsScreen } from "@/features/settings/SettingsScreen";
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
import { useGameStore } from "@/stores/game.store";
import { defaultPlayer, usePlayerStore } from "@/stores/player.store";
import { useUiStore } from "@/stores/ui.store";

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
  | "gacha"
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
  const [persistenceError, setPersistenceError] = useState<string | undefined>();
  const player = usePlayerStore((state) => state.player);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const animationsEnabled = useUiStore((state) => state.animationsEnabled);
  const soundEnabled = useUiStore((state) => state.soundEnabled);
  const animationSpeed = useUiStore((state) => state.animationSpeed);
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
  const settings: GameSettings = useMemo(
    () =>
      normalizeSettings({
        animationsEnabled,
        soundEnabled,
        animationSpeed,
        reducedMotion: animationSpeed === "reduced"
      }),
    [animationSpeed, animationsEnabled, soundEnabled]
  );

  const reloadLocalState = useCallback(async () => {
    try {
      const [storedPlayer, storedProgress, storedCollection, storedGachaHistory, storedBadges, storedTitles, storedSettings] =
        await Promise.all([
          getStoredPlayer(),
          getQuizProgressMap(),
          getStoredCollection(),
          getStoredGachaHistory(),
          getStoredBadges(),
          getStoredTitles(),
          getStoredSettings()
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

      if (storedTitles.length > 0) {
        setUnlockedTitles(storedTitles);
      } else {
        const defaultTitles = getDefaultUnlockedTitles();
        setUnlockedTitles(defaultTitles);
        await saveUnlockedTitles(defaultTitles);
      }

      const nextSettings = normalizeSettings(storedSettings ?? defaultSettings);
      setUiPreferences({
        animationsEnabled: nextSettings.animationsEnabled,
        soundEnabled: nextSettings.soundEnabled,
        animationSpeed: nextSettings.animationSpeed
      });
      if (!storedSettings) await saveSettings(nextSettings);

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
      animationSpeed: normalized.animationSpeed
    });
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

  const goHome = () => setScreen("home");

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
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_32%),linear-gradient(135deg,rgba(49,46,129,0.7),rgba(15,23,42,0.96)_48%,rgba(30,41,59,1))]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        {persistenceError && (
          <div className="mb-4 rounded-lg border border-amber-300/30 bg-amber-300/10 p-3 text-sm font-semibold text-amber-100">
            {persistenceError}
          </div>
        )}

        {screen === "home" && (
          <HomeScreen
            player={player}
            activeTitle={activeTitle}
            activeCharacter={activeCharacter}
            regionProgress={regionProgress}
            onGoToMissions={() => setScreen("missions")}
            onGoToMap={() => setScreen("map")}
            onGoToProfile={() => setScreen("profile")}
            onGoToGacha={() => setScreen("gacha")}
            onGoToCollection={() => setScreen("collection")}
            onGoToBadges={() => setScreen("badges")}
            onGoToSettings={() => setScreen("settings")}
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
            onBackHome={goHome}
            onOpenImportExport={() => setScreen("import-export")}
            onUpdateSettings={updateSettings}
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
            onInvoke={invokeGacha}
            onBackHome={goHome}
            onGoToCollection={() => setScreen("collection")}
          />
        )}

        {screen === "collection" && (
          <CollectionScreen
            collection={collection}
            characters={characters}
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
      </div>
    </main>
  );
}

function normalizePlayer(player: Player): Player {
  return {
    ...player,
    magicDust: player.magicDust ?? 0,
    activeTitleId: player.activeTitleId ?? "guild-apprentice",
    unlockedBadgeIds: player.unlockedBadgeIds ?? [],
    unlockedTitleIds: player.unlockedTitleIds?.length ? player.unlockedTitleIds : ["guild-apprentice", "rank-f-mage"]
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
