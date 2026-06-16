import type { Region } from "@/domain/models/Region";
import type { Quiz } from "@/domain/models/Quiz";
import type { SkillNode } from "@/domain/models/SkillNode";

export type ContentPack = {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  regions: Region[];
  quizzes: Quiz[];
  skillNodes: SkillNode[];
  installedAt?: string;
};
