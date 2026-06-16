import type { LucideIcon } from "lucide-react";
import { Map, ScrollText, Sparkles, Trophy, UserRound } from "lucide-react";

export type AppRoute = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
};

export const appRoutes: AppRoute[] = [
  { id: "missions", label: "Missions", path: "/missions", icon: ScrollText },
  { id: "map", label: "Carte", path: "/map", icon: Map },
  { id: "gacha", label: "Invocation", path: "/gacha", icon: Sparkles },
  { id: "collection", label: "Collection", path: "/collection", icon: Trophy },
  { id: "profile", label: "Profil", path: "/profile", icon: UserRound }
];
