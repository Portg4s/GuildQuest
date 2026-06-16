import type { Quiz } from "@/domain/models/Quiz";

export type Zone = {
  id: string;
  regionId: string;
  name: string;
  description: string;
  order: number;
  quizIds: string[];
  quizzes?: Quiz[];
};
