import type { Quiz, QuizQuestion } from "@/domain/models";

export type QuizAnswers = Record<string, string[]>;

export type QuestionResult = {
  questionId: string;
  isCorrect: boolean;
  selectedOptionIds: string[];
  correctOptionIds: string[];
};

export type QuizScoreResult = {
  quizId: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  questionResults: QuestionResult[];
};

function normalizeOptionIds(optionIds: string[]) {
  return [...optionIds].sort();
}

export function isQuestionAnswerCorrect(question: QuizQuestion, selectedOptionIds: string[]) {
  const selected = normalizeOptionIds(selectedOptionIds);
  const correct = normalizeOptionIds(
    question.options.filter((option) => option.isCorrect).map((option) => option.id)
  );

  return selected.length === correct.length && selected.every((optionId, index) => optionId === correct[index]);
}

export function calculateQuizScore(quiz: Quiz, answers: QuizAnswers): QuizScoreResult {
  const questionResults = quiz.questions.map<QuestionResult>((question) => {
    const selectedOptionIds = answers[question.id] ?? [];
    const correctOptionIds = question.options.filter((option) => option.isCorrect).map((option) => option.id);

    return {
      questionId: question.id,
      isCorrect: isQuestionAnswerCorrect(question, selectedOptionIds),
      selectedOptionIds,
      correctOptionIds
    };
  });

  const correctAnswers = questionResults.filter((result) => result.isCorrect).length;
  const totalQuestions = quiz.questions.length;
  const score = totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 100);

  return {
    quizId: quiz.id,
    correctAnswers,
    totalQuestions,
    score,
    questionResults
  };
}

export function getResultStatus(score: number) {
  if (score >= 100) return "Mission parfaite";
  if (score >= 80) return "Mission bien reussie";
  if (score >= 60) return "Mission validee";
  return "Echec";
}
