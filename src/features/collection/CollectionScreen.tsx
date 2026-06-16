import { useMemo, useState } from "react";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CharacterImage } from "@/components/game/CharacterImage";
import { rarityBadgeClasses, rarityCardClasses, rarityLabels } from "@/components/game/rarity-styles";
import type { Character, CharacterRarity, PlayerCharacter } from "@/domain/models";
import { getRarityOrder } from "@/domain/gacha/gacha-rates.service";
import { cn } from "@/lib/utils";

type CollectionScreenProps = {
  collection: PlayerCharacter[];
  characters: Character[];
  activeCharacterId?: string;
  onBackHome: () => void;
  onOpenCharacter: (character: Character) => void;
  onSetActive: (characterId: string) => void;
};

type Filter = CharacterRarity | "ALL";

export function CollectionScreen({
  collection,
  characters,
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
  const filteredCharacters = filter === "ALL"
    ? characters
    : characters.filter((character) => character.rarity === filter);

  return (
    <section className="space-y-3">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Archives de guilde</p>
          <h1 className="guild-title text-2xl">Collection</h1>
          <p className="mt-1 text-sm text-slate-300">
            {collection.length} / {characters.length} personnages debloques
          </p>
        </div>
        <Button variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Hall
        </Button>
      </header>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <FilterButton active={filter === "ALL"} onClick={() => setFilter("ALL")}>Tous</FilterButton>
        {getRarityOrder().map((rarity) => (
          <FilterButton key={rarity} active={filter === rarity} onClick={() => setFilter(rarity)}>
            {rarityLabels[rarity]}
          </FilterButton>
        ))}
      </div>

      <div className="glass-panel p-2.5 text-xs text-teal-50">
        Les images privees locales sont chargees si elles existent dans /public/private-assets/characters/.
        Sinon, GuildQuest utilise les placeholders.
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {filteredCharacters.map((character) => {
          const owned = ownedByCharacterId.get(character.id);
          const isActive = activeCharacterId === character.id;

          return (
            <article
              key={character.id}
              className={cn(
                "rounded-xl border p-3 transition hover:-translate-y-0.5",
                owned ? `${rarityCardClasses[character.rarity]} magic-border` : "border-white/10 bg-slate-900/60 text-slate-500"
              )}
            >
              <button type="button" className="block w-full text-left" onClick={() => onOpenCharacter(character)}>
                <div className="flex items-start justify-between gap-3">
                  <span className={cn("rounded-md px-2.5 py-1 text-xs font-black", rarityBadgeClasses[character.rarity])}>
                    {rarityLabels[character.rarity]}
                  </span>
                  {isActive ? <Check className="size-5 text-teal-100" aria-hidden="true" /> : !owned && <Lock className="size-5" aria-hidden="true" />}
                </div>
                <CharacterImage
                  character={character}
                  className={cn(
                    "mx-auto mt-3 size-20 rounded-xl border border-white/10 bg-white/10 p-2.5",
                    !owned && "grayscale opacity-35"
                  )}
                />
                <h2 className="mt-3 truncate text-base font-black text-white">{owned ? character.name : "Silhouette inconnue"}</h2>
                <p className="mt-1 text-xs">{character.element} - Pui. {character.power}</p>
                <p className="mt-1 text-xs font-bold">Fragments : {owned?.fragments ?? 0}</p>
              </button>
              {owned && (
                <Button
                  className="mt-3 h-8 w-full px-2 text-xs"
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
        "shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition active:scale-[0.98]",
        active ? "border-teal-200 bg-teal-300 text-slate-950" : "border-white/10 bg-white/[0.06] text-slate-200"
      )}
    >
      {children}
    </button>
  );
}
