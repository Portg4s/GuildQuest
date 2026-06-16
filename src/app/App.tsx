import { useEffect, useMemo, useState } from "react";
import { foundationsWebPack } from "@/data/packs/foundations-web.example";
import type { Quiz } from "@/domain/models";
import { applyRewardsToPlayer } from "@/domain/progression/level.service";
import { calculateMissionRewards, type RewardResult } from "@/domain/reward/reward.service";
import { buildMissionsFromPack, type Mission } from "@/domain/services/mission.service";
import type { QuizScoreResult } from "@/domain/services/quiz.service";
import { HomeScreen } from "@/features/home/HomeScreen";
import { MissionsScreen } from "@/features/missions/MissionsScreen";
import { ProfileScreen } from "@/features/profile/ProfileScreen";
import { QuizScreen } from "@/features/quiz/QuizScreen";
import { ResultsScreen } from "@/features/results/ResultsScreen";
import { getStoredPlayer, savePlayer } from "@/storage/repositories/player.repository";
import { getQuizProgressMap, recordQuizAttempt } from "@/storage/repositories/quiz-progress.repository";
import { useGameStore } from "@/stores/game.store";
import { defaultPlayer, usePlayerStore } from "@/stores/player.store";

type AppScreen = "home" | "missions" | "quiz" | "results" | "profile";

type CompletedMissionResult = {
  quiz: Quiz;
  scoreResult: QuizScoreResult;
  rewards: RewardResult;
};

function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [selectedMission, setSelectedMission] = useState<Mission | undefined>();
  const [completedResult, setCompletedResult] = useState<CompletedMissionResult | undefined>();
  const [persistenceError, setPersistenceError] = useState<string | undefined>();
  const player = usePlayerStore((state) => state.player);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const quizProgressById = useGameStore((state) => state.quizProgressById);
  const setQuizProgress = useGameStore((state) => state.setQuizProgress);
  const upsertQuizProgress = useGameStore((state) => state.upsertQuizProgress);

  useEffect(() => {
    let cancelled = false;

    async function loadLocalState() {
      try {
        const [storedPlayer, storedProgress] = await Promise.all([getStoredPlayer(), getQuizProgressMap()]);

        if (cancelled) return;

        if (storedPlayer) {
          setPlayer(storedPlayer);
        } else {
          await savePlayer(defaultPlayer);
        }

        setQuizProgress(storedProgress);
      } catch (error) {
        setPersistenceError("La sauvegarde locale n'a pas pu etre chargee.");
        console.error(error);
      }
    }

    void loadLocalState();

    return () => {
      cancelled = true;
    };
  }, [setPlayer, setQuizProgress]);

  const missions = useMemo(
    () => buildMissionsFromPack(foundationsWebPack, quizProgressById),
    [quizProgressById]
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
            onGoToMissions={() => setScreen("missions")}
            onGoToProfile={() => setScreen("profile")}
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
            onBackHome={goHome}
          />
        )}
      </div>
    </main>
  );
}

export default App;
