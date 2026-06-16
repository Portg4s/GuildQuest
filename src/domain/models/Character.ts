import type { CharacterRarity } from "@/domain/models/CharacterRarity";

export type Character = {
  id: string;
  name: string;
  rarity: CharacterRarity;
  element: string;
  power: number;
  description: string;
  image: string;
  placeholderImage: string;
  imageUrl?: string;
  portraitUrl?: string;
  bannerUrl?: string;
  quote?: string;
  tags?: string[];
  category?: string;
  variant?: string;
  isPrivate?: boolean;
  source?: string;
};
