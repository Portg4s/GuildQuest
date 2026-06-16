import type { QuizOption } from "@/domain/models/QuizOption";

export type QuizQuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE";

export type QuizQuestion = {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options: QuizOption[];
  explanation: string;
};
