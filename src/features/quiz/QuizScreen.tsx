import { useMemo, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quiz } from "@/domain/models";
import { calculateQuizScore, isQuestionAnswerCorrect, type QuizAnswers, type QuizScoreResult } from "@/domain/services/quiz.service";
import { cn } from "@/lib/utils";

type QuizScreenProps = {
  quiz: Quiz;
  onExit: () => void;
  onComplete: (result: QuizScoreResult) => void;
};

export function QuizScreen({ quiz, onExit, onComplete }: QuizScreenProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isValidated, setIsValidated] = useState(false);
  const currentQuestion = quiz.questions[questionIndex];
  const selectedOptionIds = useMemo(
    () => answers[currentQuestion.id] ?? [],
    [answers, currentQuestion.id]
  );
  const hasSelection = selectedOptionIds.length > 0;
  const isLastQuestion = questionIndex === quiz.questions.length - 1;
  const currentCorrect = isQuestionAnswerCorrect(currentQuestion, selectedOptionIds);

  const selectOption = (optionId: string) => {
    if (isValidated) return;

    setAnswers((current) => {
      const previous = current[currentQuestion.id] ?? [];
      const nextSelection =
        currentQuestion.type === "MULTIPLE_CHOICE"
          ? previous.includes(optionId)
            ? previous.filter((id) => id !== optionId)
            : [...previous, optionId]
          : [optionId];

      return {
        ...current,
        [currentQuestion.id]: nextSelection
      };
    });
  };

  const validateOrContinue = () => {
    if (!hasSelection) return;

    if (!isValidated) {
      setIsValidated(true);
      return;
    }

    if (isLastQuestion) {
      onComplete(calculateQuizScore(quiz, answers));
      return;
    }

    setQuestionIndex((current) => current + 1);
    setIsValidated(false);
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">
            Question {questionIndex + 1} / {quiz.questions.length}
          </p>
          <h1 className="guild-title text-3xl">{quiz.title}</h1>
        </div>
        <Button variant="guild" onClick={onExit}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Missions
        </Button>
      </header>

      <div className="h-2 overflow-hidden rounded-full bg-slate-950 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-300 via-cyan-200 to-amber-300 shadow-glow"
          style={{ width: `${((questionIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <article className="guild-panel magic-border p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-white/[0.07] px-2.5 py-1 text-xs font-bold text-slate-200">
            {currentQuestion.type === "MULTIPLE_CHOICE" ? "Choix multiples" : "Choix unique"}
          </span>
          {currentQuestion.type === "TRUE_FALSE" && (
            <span className="rounded-md border border-teal-200/25 bg-teal-300/15 px-2.5 py-1 text-xs font-bold text-teal-100">
              Vrai / Faux
            </span>
          )}
        </div>
        <h2 className="mt-5 text-2xl font-black leading-tight text-white">{currentQuestion.prompt}</h2>
        <div className="mt-5 grid gap-3">
          {currentQuestion.options.map((option) => {
            const selected = selectedOptionIds.includes(option.id);
            const shouldShowCorrect = isValidated && option.isCorrect;
            const shouldShowWrong = isValidated && selected && !option.isCorrect;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectOption(option.id)}
                className={cn(
                  "flex min-h-14 items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-bold transition active:scale-[0.99]",
                  "border-white/10 bg-white/[0.06] text-slate-100 hover:border-teal-200/50 hover:bg-teal-300/10",
                  selected && "border-teal-200 bg-teal-300/15 text-white shadow-glow",
                  shouldShowCorrect && "border-emerald-300 bg-emerald-300/15 text-emerald-50",
                  shouldShowWrong && "border-red-300 bg-red-400/15 text-red-50"
                )}
              >
                <span>{option.label}</span>
                {selected && <Check className="ml-3 size-5 shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        {isValidated && (
          <div
            className={cn(
              "mt-5 rounded-lg border p-4 text-sm leading-6",
              currentCorrect
                ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-50"
                : "border-red-300/30 bg-red-400/10 text-red-50"
            )}
          >
            <p className="font-black">{currentCorrect ? "Bonne reponse" : "Reponse incorrecte"}</p>
            <p className="mt-1 text-slate-200">{currentQuestion.explanation}</p>
          </div>
        )}
      </article>

      <Button className="w-full" size="lg" onClick={validateOrContinue} disabled={!hasSelection}>
        {isValidated ? (isLastQuestion ? "Voir le resultat" : "Question suivante") : "Valider"}
      </Button>
    </section>
  );
}
