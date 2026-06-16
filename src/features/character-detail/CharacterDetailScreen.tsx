import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CharacterImage } from "@/components/game/CharacterImage";
import { rarityBadgeClasses, rarityCardClasses, rarityGlowClasses, rarityLabels } from "@/components/game/rarity-styles";
import type { Character, PlayerCharacter } from "@/domain/models";
import { cn } from "@/lib/utils";

type CharacterDetailScreenProps = {
  character: Character;
  owned?: PlayerCharacter;
  isActive: boolean;
  onBackCollection: () => void;
  onSetActive: (characterId: string) => void;
};

export function CharacterDetailScreen({
  character,
  owned,
  isActive,
  onBackCollection,
  onSetActive
}: CharacterDetailScreenProps) {
  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Fiche personnage</p>
          <h1 className="guild-title text-3xl">{character.name}</h1>
        </div>
        <Button variant="guild" onClick={onBackCollection}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Collection
        </Button>
      </header>

      <motion.article
        initial={{ opacity: 0, y: 18, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        className={cn(
          "magic-border rounded-xl border p-5 shadow-2xl",
          rarityCardClasses[character.rarity],
          rarityGlowClasses[character.rarity]
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={cn("rounded-md px-2.5 py-1 text-xs font-black", rarityBadgeClasses[character.rarity])}>
            {rarityLabels[character.rarity]}
          </span>
          <span className="inline-flex items-center gap-2 rounded-md bg-black/20 px-2.5 py-1 text-sm font-bold">
            {owned ? <Check className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
            {owned ? (isActive ? "Actif" : "Possede") : "Non possede"}
          </span>
        </div>

        <CharacterImage
          character={character}
          className={cn(
            "mx-auto mt-6 size-36 rounded-xl border border-white/10 bg-white/10 p-5",
            !owned && "grayscale opacity-45"
          )}
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <InfoBlock label="Element" value={character.element} />
          <InfoBlock label="Puissance" value={character.power} />
          <InfoBlock label="Fragments" value={owned?.fragments ?? 0} />
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-100">{character.description}</p>
        <p className="mt-3 text-sm font-bold text-slate-200">Doublons : {owned?.duplicateCount ?? owned?.duplicates ?? 0}</p>

        {owned && (
          <Button
            className="mt-5 w-full"
            onClick={() => onSetActive(character.id)}
            disabled={isActive}
          >
            {isActive ? "Personnage actif" : "Definir comme actif"}
          </Button>
        )}
      </motion.article>
    </section>
  );
}

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <p className="text-xs font-bold uppercase text-slate-300">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}
