import { useEffect, useMemo, useState } from "react";
import { exampleCharacters } from "@/data/characters/characters.example";
import { foundationsWebPack } from "@/data/packs/foundations-web.example";
import type { Character, Player, Quiz } from "@/domain/models";
import { performGachaInvocation, type GachaPullResult } from "@/domain/gacha/gacha.service";
import { applyRewardsToPlayer } from "@/domain/progression/level.service";
import { calculateMissionRewards, type RewardResult } from "@/domain/reward/reward.service";
import { buildMissionsFromPack, type Mission } from "@/domain/services/mission.service";
import type { QuizScoreResult } from "@/domain/services/quiz.service";
import { CharacterDetailScreen } from "@/features/character-detail/CharacterDetailScreen";
import { CollectionScreen } from "@/features/collection/CollectionScreen";
import { GachaScreen } from "@/features/gacha/GachaScreen";
import { HomeScreen } from "@/features/home/HomeScreen";
import { MissionsScreen } from "@/features/missions/MissionsScreen";
import { ProfileScreen } from "@/features/profile/ProfileScreen";
import { QuizScreen } from "@/features/quiz/QuizScreen";
import { ResultsScreen } from "@/features/results/ResultsScreen";
import { getStoredCollection, saveCollection } from "@/storage/repositories/collection.repository";
import { getStoredGachaHistory, saveGachaPulls } from "@/storage/repositories/gacha-history.repository";
import { getStoredPlayer, savePlayer } from "@/storage/repositories/player.repository";
import { getQuizProgressMap, recordQuizAttempt } from "@/storage/repositories/quiz-progress.repository";
import { useGameStore } from "@/stores/game.store";
import { defaultPlayer, usePlayerStore } from "@/stores/player.store";

type AppScreen = "home" | "missions" | "quiz" | "results" | "profile" | "gacha" | "collection" | "character-detail";

type CompletedMissionResult = {
  quiz: Quiz;
  scoreResult: QuizScoreResult;
  rewards: RewardResult;
};

function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [selectedMission, setSelectedMission] = useState<Mission | undefined>();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>();
  const [completedResult, setCompletedResult] = useState<CompletedMissionResult | undefined>();
  const [gachaResults, setGachaResults] = useState<GachaPullResult[]>([]);
  const [gachaError, setGachaError] = useState<string | undefined>();
  const [isInvoking, setIsInvoking] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | undefined>();
  const player = usePlayerStore((state) => state.player);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const collection = useGameStore((state) => state.collection);
  const gachaHistory = useGameStore((state) => state.gachaHistory);
  const quizProgressById = useGameStore((state) => state.quizProgressById);
  const setCollection = useGameStore((state) => state.setCollection);
  const setGachaHistory = useGameStore((state) => state.setGachaHistory);
  const prependGachaHistory = useGameStore((state) => state.prependGachaHistory);
  const setActiveCharacterInCollection = useGameStore((state) => state.setActiveCharacter);
  const setQuizProgress = useGameStore((state) => state.setQuizProgress);
  const upsertQuizProgress = useGameStore((state) => state.upsertQuizProgress);

  useEffect(() => {
    let cancelled = false;

    async function loadLocalState() {
      try {
        const [storedPlayer, storedProgress, storedCollection, storedGachaHistory] = await Promise.all([
          getStoredPlayer(),
          getQuizProgressMap(),
          getStoredCollection(),
          getStoredGachaHistory()
        ]);

        if (cancelled) return;

        if (storedPlayer) {
          setPlayer(normalizePlayer(storedPlayer));
        } else {
          await savePlayer(defaultPlayer);
        }

        setQuizProgress(storedProgress);
        setCollection(storedCollection);
        setGachaHistory(storedGachaHistory);
      } catch (error) {
        setPersistenceError("La sauvegarde locale n'a pas pu etre chargee.");
        console.error(error);
      }
    }

    void loadLocalState();

    return () => {
      cancelled = true;
    };
  }, [setCollection, setGachaHistory, setPlayer, setQuizProgress]);

  const missions = useMemo(
    () => buildMissionsFromPack(foundationsWebPack, quizProgressById),
    [quizProgressById]
  );
  const activeCharacter = useMemo(
    () => exampleCharacters.find((character) => character.id === player.activeCharacterId),
    [player.activeCharacterId]
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

  const completeQuiz = (scoreResult: QuizScoreResult) => {
    if (!selectedMission) return;

    const rewards = calculateMissionRewards(selectedMission.quiz.rank, scoreResult.score);
    const updatedPlayer = applyRewardsToPlayer(player, rewards.xpGained, rewards.gemsGained);

    setPlayer(updatedPlayer);
    setCompletedResult({
      quiz: selectedMission.quiz,
      scoreResult,
      rewards
    });
    setScreen("results");

    void saveMissionProgress(selectedMission.quiz.id, scoreResult, rewards, updatedPlayer);
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
          characters: exampleCharacters
        });

        setPlayer(invocation.player);
        setCollection(invocation.collection);
        prependGachaHistory(invocation.history);
        setGachaResults(invocation.results);
        void saveGachaInvocation(invocation.player, invocation.collection, invocation.history);
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
    pulls: typeof gachaHistory
  ) => {
    try {
      await Promise.all([savePlayer(updatedPlayer), saveCollection(updatedCollection), saveGachaPulls(pulls)]);
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

  const saveMissionProgress = async (
    quizId: string,
    scoreResult: QuizScoreResult,
    rewards: RewardResult,
    updatedPlayer: typeof player
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
          gemsGained: rewards.gemsGained
        }
      });
      upsertQuizProgress(progress);
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
            activeCharacter={activeCharacter}
            onGoToMissions={() => setScreen("missions")}
            onGoToProfile={() => setScreen("profile")}
            onGoToGacha={() => setScreen("gacha")}
            onGoToCollection={() => setScreen("collection")}
          />
        )}

        {screen === "missions" && (
          <MissionsScreen missions={missions} onBackHome={goHome} onStartQuiz={startMission} />
        )}

        {screen === "quiz" && selectedMission && (
          <QuizScreen quiz={selectedMission.quiz} onExit={() => setScreen("missions")} onComplete={completeQuiz} />
        )}

        {screen === "results" && completedResult && (
          <ResultsScreen
            quiz={completedResult.quiz}
            scoreResult={completedResult.scoreResult}
            rewards={completedResult.rewards}
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
            onBackHome={goHome}
            onGoToCollection={() => setScreen("collection")}
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
    magicDust: player.magicDust ?? 0
  };
}

export default App;
