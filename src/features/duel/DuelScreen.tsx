import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Sparkles, Swords, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CharacterImage } from "@/components/game/CharacterImage";
import { rarityBadgeClasses, rarityCardClasses, rarityLabels } from "@/components/game/rarity-styles";
import type { Character, PlayerCharacter } from "@/domain/models";
import { cn } from "@/lib/utils";

type DuelScreenProps = {
  collection: PlayerCharacter[];
  characters: Character[];
  onBackHome: () => void;
  onGoToGacha: () => void;
  onDuelReward: (xp: number, gems: number, won: boolean) => void;
};

type DuelCard = {
  id: string;
  name: string;
  rarity: Character["rarity"];
  element: string;
  power: number;
  maxHp: number;
  hp: number;
  attack: number;
  character?: Character;
};

type DuelBot = {
  id: string;
  name: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  reward: { xp: number; gems: number };
  cards: Omit<DuelCard, "hp">[];
};

type DuelState = {
  playerCards: DuelCard[];
  botCards: DuelCard[];
  activePlayerIndex: number;
  activeBotIndex: number;
  log: string[];
  finished: boolean;
  won?: boolean;
  rewardClaimed: boolean;
  playerGuard: boolean;
};

const rarityBonus: Record<Character["rarity"], number> = {
  COMMON: 0,
  RARE: 8,
  EPIC: 18,
  LEGENDARY: 32,
  MYTHIC: 48
};

const bots: DuelBot[] = [
  {
    id: "wandering-apprentice",
    name: "Apprenti vagabond",
    difficulty: "Facile",
    reward: { xp: 20, gems: 5 },
    cards: [
      createBotCard("Rune novice", "COMMON", "Arcane", 520),
      createBotCard("Scribe des braises", "COMMON", "Feu", 560),
      createBotCard("Eclat errant", "RARE", "Lumiere", 760)
    ]
  },
  {
    id: "roaming-mage",
    name: "Mage errant",
    difficulty: "Moyen",
    reward: { xp: 40, gems: 10 },
    cards: [
      createBotCard("Lame de givre", "RARE", "Glace", 920),
      createBotCard("Oracle du vent", "RARE", "Vent", 980),
      createBotCard("Sentinelle d'encre", "EPIC", "Ombre", 1280)
    ]
  },
  {
    id: "rune-warden",
    name: "Gardien des runes",
    difficulty: "Difficile",
    reward: { xp: 75, gems: 20 },
    cards: [
      createBotCard("Gardien celeste", "EPIC", "Lumiere", 1550),
      createBotCard("Marteau runique", "EPIC", "Terre", 1680),
      createBotCard("Champion d'entrainement", "LEGENDARY", "Arcane", 2200)
    ]
  }
];

export function DuelScreen({ collection, characters, onBackHome, onGoToGacha, onDuelReward }: DuelScreenProps) {
  const [botIndex, setBotIndex] = useState(0);
  const ownedCharacters = useMemo(() => {
    const ownedIds = new Set(collection.map((owned) => owned.characterId));
    return characters
      .filter((character) => ownedIds.has(character.id))
      .sort((a, b) => b.power - a.power);
  }, [characters, collection]);
  const autoTeam = ownedCharacters.slice(0, 3);
  const [duel, setDuel] = useState<DuelState | undefined>();
  const selectedBot = bots[botIndex];

  const startDuel = () => {
    const playerCards = autoTeam.map(toDuelCard);
    const botCards = selectedBot.cards.map((card) => ({ ...card, hp: card.maxHp }));

    setDuel({
      playerCards,
      botCards,
      activePlayerIndex: 0,
      activeBotIndex: 0,
      log: [`${selectedBot.name} accepte le duel.`, "Equipe auto : les 3 plus fortes cartes entrent dans l'arene."],
      finished: false,
      rewardClaimed: false,
      playerGuard: false
    });
  };

  const playAction = (action: "attack" | "technique" | "defense") => {
    if (!duel || duel.finished) return;

    const next = structuredClone(duel) as DuelState;
    const player = next.playerCards[next.activePlayerIndex];
    const bot = next.botCards[next.activeBotIndex];
    const nextLog: string[] = [];

    if (action === "defense") {
      next.playerGuard = true;
      nextLog.push(`${player.name} se met en garde.`);
    } else {
      const multiplier = action === "technique" ? 1.45 : 1;
      const damage = Math.round((player.attack + rarityBonus[player.rarity]) * multiplier);
      bot.hp = Math.max(0, bot.hp - damage);
      nextLog.push(`${player.name} utilise ${action === "technique" ? "Technique" : "Attaque"} : -${damage} PV.`);
    }

    if (bot.hp <= 0) {
      nextLog.push(`${bot.name} est KO.`);
      next.activeBotIndex += 1;
    }

    if (next.activeBotIndex >= next.botCards.length) {
      next.finished = true;
      next.won = true;
      next.log = [...nextLog, "Victoire de guilde !", ...next.log].slice(0, 6);
      setDuel(next);
      return;
    }

    const activeBot = next.botCards[next.activeBotIndex];
    const activePlayer = next.playerCards[next.activePlayerIndex];
    const botDamageBase = activeBot.attack + Math.round(rarityBonus[activeBot.rarity] * 0.75);
    const botDamage = Math.max(1, Math.round(botDamageBase * (next.playerGuard ? 0.45 : 1)));
    activePlayer.hp = Math.max(0, activePlayer.hp - botDamage);
    nextLog.push(`${activeBot.name} riposte : -${botDamage} PV.`);
    next.playerGuard = false;

    if (activePlayer.hp <= 0) {
      nextLog.push(`${activePlayer.name} est KO.`);
      next.activePlayerIndex += 1;
    }

    if (next.activePlayerIndex >= next.playerCards.length) {
      next.finished = true;
      next.won = false;
      next.log = [...nextLog, "Defaite. La guilde apprend aussi ainsi.", ...next.log].slice(0, 6);
      setDuel(next);
      return;
    }

    next.log = [...nextLog, ...next.log].slice(0, 6);
    setDuel(next);
  };

  const claimReward = () => {
    if (!duel || duel.rewardClaimed || duel.won === undefined) return;

    const xp = duel.won ? selectedBot.reward.xp : 8;
    const gems = duel.won ? selectedBot.reward.gems : 0;
    onDuelReward(xp, gems, duel.won);
    setDuel({ ...duel, rewardClaimed: true });
  };

  if (ownedCharacters.length < 3) {
    return (
      <section className="mx-auto max-w-3xl space-y-4">
        <DuelHeader onBackHome={onBackHome} />
        <article className="guild-panel magic-border p-5 text-center">
          <Swords className="mx-auto size-10 text-amber-100" aria-hidden="true" />
          <h1 className="guild-title mt-3 text-2xl">Arene verrouillee</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Debloque au moins 3 personnages pour entrer dans l'arene.
          </p>
          <Button className="mt-5 w-full sm:w-auto" onClick={onGoToGacha}>
            Invocation
          </Button>
        </article>
      </section>
    );
  }

  const activePlayer = duel?.playerCards[duel.activePlayerIndex];
  const activeBot = duel?.botCards[duel.activeBotIndex];

  return (
    <section className="mx-auto max-w-4xl space-y-4">
      <DuelHeader onBackHome={onBackHome} />

      <article className="guild-card p-3">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-200">Adversaire</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {bots.map((bot, index) => (
            <button
              key={bot.id}
              type="button"
              onClick={() => {
                setBotIndex(index);
                setDuel(undefined);
              }}
              className={cn(
                "rounded-xl border p-3 text-left transition active:scale-[0.98]",
                botIndex === index ? "border-teal-200 bg-teal-300/15" : "border-white/10 bg-white/[0.05]"
              )}
            >
              <p className="font-black text-white">{bot.name}</p>
              <p className="mt-1 text-xs text-slate-300">{bot.difficulty}</p>
              <p className="mt-2 text-xs font-bold text-amber-100">+{bot.reward.xp} XP / +{bot.reward.gems} gemmes</p>
            </button>
          ))}
        </div>
      </article>

      <article className="guild-panel magic-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">Equipe auto</p>
            <h2 className="text-xl font-black text-white">Top 3 puissance</h2>
          </div>
          <Button onClick={startDuel}>
            <Swords className="mr-2 size-4" aria-hidden="true" />
            {duel ? "Relancer" : "Entrer dans l'arene"}
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {autoTeam.map((character) => (
            <MiniCard key={character.id} character={character} />
          ))}
        </div>
      </article>

      {duel && activePlayer && activeBot && (
        <div className="grid gap-3 lg:grid-cols-[1fr_0.9fr_1fr]">
          <BattleCard card={activeBot} title="Adversaire" />
          <section className="guild-card flex flex-col justify-between p-4 text-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-200">Tour de duel</p>
              <Swords className="mx-auto mt-4 size-10 text-amber-100" aria-hidden="true" />
              {duel.finished && (
                <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4">
                  <p className="text-2xl font-black text-white">{duel.won ? "Victoire !" : "Defaite"}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {duel.won
                      ? `Recompense : +${selectedBot.reward.xp} XP / +${selectedBot.reward.gems} gemmes`
                      : "Recompense : +8 XP d'entrainement"}
                  </p>
                  <Button className="mt-4 w-full" disabled={duel.rewardClaimed} onClick={claimReward}>
                    <Trophy className="mr-2 size-4" aria-hidden="true" />
                    {duel.rewardClaimed ? "Recompense recue" : "Recevoir"}
                  </Button>
                </motion.div>
              )}
            </div>
            {!duel.finished && (
              <div className="mt-4 grid gap-2">
                <Button onClick={() => playAction("attack")}>Attaque</Button>
                <Button variant="guild" onClick={() => playAction("technique")}>
                  <Sparkles className="mr-2 size-4" aria-hidden="true" />
                  Technique
                </Button>
                <Button variant="guild" onClick={() => playAction("defense")}>
                  <Shield className="mr-2 size-4" aria-hidden="true" />
                  Defense
                </Button>
              </div>
            )}
          </section>
          <BattleCard card={activePlayer} title="Guilde" />
        </div>
      )}

      {duel && (
        <article className="guild-card p-3">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-200">Journal</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {duel.log.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}

function DuelHeader({ onBackHome }: { onBackHome: () => void }) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Arene offline</p>
        <h1 className="guild-title text-2xl">Duel de guilde</h1>
      </div>
      <Button variant="guild" onClick={onBackHome}>
        <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
        Hall
      </Button>
    </header>
  );
}

function MiniCard({ character }: { character: Character }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border p-1.5", rarityCardClasses[character.rarity])}>
      <CharacterImage character={character} className="h-24 w-full rounded-lg border border-white/10" />
      <p className="mt-1 truncate text-xs font-black text-white">{character.name}</p>
    </div>
  );
}

function BattleCard({ card, title }: { card: DuelCard; title: string }) {
  const hpPercent = Math.max(0, Math.round((card.hp / card.maxHp) * 100));

  return (
    <motion.article
      key={card.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("overflow-hidden rounded-xl border p-3", rarityCardClasses[card.rarity])}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-200">{title}</p>
        <span className={cn("rounded-md px-2 py-1 text-[0.65rem] font-black", rarityBadgeClasses[card.rarity])}>
          {rarityLabels[card.rarity]}
        </span>
      </div>
      <CharacterImage character={card.character} className="mt-3 h-44 w-full rounded-xl border border-white/10 bg-black/20" />
      <h2 className="mt-3 text-lg font-black text-white">{card.name}</h2>
      <p className="text-xs font-semibold text-slate-300">{card.element} - Pui. {card.power}</p>
      <div className="mt-3">
        <div className="flex justify-between text-xs font-bold text-slate-200">
          <span>HP</span>
          <span>{card.hp} / {card.maxHp}</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-950">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-amber-300" style={{ width: `${hpPercent}%` }} />
        </div>
      </div>
    </motion.article>
  );
}

function toDuelCard(character: Character): DuelCard {
  const maxHp = Math.round(120 + character.power / 8);

  return {
    id: character.id,
    name: character.name,
    rarity: character.rarity,
    element: character.element,
    power: character.power,
    maxHp,
    hp: maxHp,
    attack: Math.round(18 + character.power / 26),
    character
  };
}

function createBotCard(name: string, rarity: Character["rarity"], element: string, power: number): Omit<DuelCard, "hp"> {
  const maxHp = Math.round(120 + power / 8);

  return {
    id: `bot-${name.toLowerCase().replaceAll(" ", "-")}`,
    name,
    rarity,
    element,
    power,
    maxHp,
    attack: Math.round(18 + power / 28)
  };
}
