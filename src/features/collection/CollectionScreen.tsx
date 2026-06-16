import { useMemo, useState } from "react";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rarityBadgeClasses, rarityCardClasses, rarityLabels } from "@/components/game/rarity-styles";
import { exampleCharacters } from "@/data/characters/characters.example";
import type { Character, CharacterRarity, PlayerCharacter } from "@/domain/models";
import { getRarityOrder } from "@/domain/gacha/gacha-rates.service";
import { cn } from "@/lib/utils";

type CollectionScreenProps = {
  collection: PlayerCharacter[];
  activeCharacterId?: string;
  onBackHome: () => void;
  onOpenCharacter: (character: Character) => void;
  onSetActive: (characterId: string) => void;
};

type Filter = CharacterRarity | "ALL";

export function CollectionScreen({
  collection,
  activeCharacterId,
  onBackHome,
  onOpenCharacter,
  onSetActive
}: CollectionScreenProps) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const ownedByCharacterId = useMemo(
    () => new Map(collection.map((playerCharacter) => [playerCharacter.characterId, playerCharacter])),
    [collection]
  );
  const characters = filter === "ALL"
    ? exampleCharacters
    : exampleCharacters.filter((character) => character.rarity === filter);

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Archives de guilde</p>
          <h1 className="text-3xl font-black text-white">Collection</h1>
          <p className="mt-2 text-sm text-slate-300">
            {collection.length} / {exampleCharacters.length} personnages debloques
          </p>
        </div>
        <Button variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Hall
        </Button>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <FilterButton active={filter === "ALL"} onClick={() => setFilter("ALL")}>Tous</FilterButton>
        {getRarityOrder().map((rarity) => (
          <FilterButton key={rarity} active={filter === rarity} onClick={() => setFilter(rarity)}>
            {rarityLabels[rarity]}
          </FilterButton>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map((character) => {
          const owned = ownedByCharacterId.get(character.id);
          const isActive = activeCharacterId === character.id;

          return (
            <article
              key={character.id}
              className={cn(
                "rounded-lg border p-4 transition",
                owned ? rarityCardClasses[character.rarity] : "border-white/10 bg-slate-900/60 text-slate-500"
              )}
            >
              <button type="button" className="block w-full text-left" onClick={() => onOpenCharacter(character)}>
                <div className="flex items-start justify-between gap-3">
                  <span className={cn("rounded-md px-2.5 py-1 text-xs font-black", rarityBadgeClasses[character.rarity])}>
                    {rarityLabels[character.rarity]}
                  </span>
                  {isActive ? <Check className="size-5 text-teal-100" aria-hidden="true" /> : !owned && <Lock className="size-5" aria-hidden="true" />}
                </div>
                <img
                  src={character.placeholderImage}
                  alt=""
                  className={cn(
                    "mx-auto mt-4 size-24 rounded-lg border border-white/10 bg-white/10 p-3",
                    !owned && "grayscale opacity-35"
                  )}
                />
                <h2 className="mt-4 text-xl font-black text-white">{owned ? character.name : "Silhouette inconnue"}</h2>
                <p className="mt-1 text-sm">{character.element} · Puissance {character.power}</p>
                <p className="mt-2 text-sm font-bold">Fragments : {owned?.fragments ?? 0}</p>
              </button>
              {owned && (
                <Button
                  className="mt-4 w-full"
                  variant={isActive ? "secondary" : "guild"}
                  onClick={() => onSetActive(character.id)}
                  disabled={isActive}
                >
                  {isActive ? "Actif" : "Definir actif"}
                </Button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-lg border px-3 py-2 text-sm font-bold transition",
        active ? "border-teal-200 bg-teal-300 text-slate-950" : "border-white/10 bg-white/[0.06] text-slate-200"
      )}
    >
      {children}
    </button>
  );
}
