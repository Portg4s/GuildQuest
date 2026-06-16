import type { LocalCharacterInput, LocalCharacterPack } from "@/data/characters/characters.registry";

type PublicCharacterSeed = [
  id: string,
  rarity: LocalCharacterInput["rarity"],
  element: string,
  power: number,
  quote: string,
  tags: string[]
];

const rarityDescription: Record<LocalCharacterInput["rarity"], string> = {
  COMMON: "Un allie de guilde accessible, fiable pour demarrer l'aventure.",
  RARE: "Un compagnon agile qui donne du relief aux premieres invocations.",
  EPIC: "Une carte puissante qui apporte une vraie presence dans l'arene.",
  LEGENDARY: "Une figure majeure de la guilde, rare et impressionnante.",
  MYTHIC: "Une invocation mythique reservee aux moments les plus memorables."
};

const seeds: PublicCharacterSeed[] = [
  ["natsu-dragneel", "MYTHIC", "Feu", 4520, "La flamme avance, meme face au impossible.", ["fairy-tail", "feu", "mythic"]],
  ["erza-scarlet", "MYTHIC", "Acier", 4480, "La discipline transforme la peur en force.", ["fairy-tail", "acier", "mythic"]],
  ["zeref-dragneel", "MYTHIC", "Ombre", 4680, "Le savoir ancien a toujours un prix.", ["fairy-tail", "ombre", "mythic"]],
  ["acnologia", "MYTHIC", "Dragon", 4900, "Le ciel tremble quand le dragon noir approche.", ["fairy-tail", "dragon", "mythic"]],
  ["mavis-vermillion", "MYTHIC", "Lumiere", 4300, "La strategie est une magie silencieuse.", ["fairy-tail", "lumiere", "mythic"]],
  ["august", "MYTHIC", "Arcane", 4600, "Chaque sort a son echo.", ["fairy-tail", "arcane", "mythic"]],
  ["irene-belserion", "MYTHIC", "Dragon", 4550, "Les runes plient sous sa volonte.", ["fairy-tail", "dragon", "mythic"]],
  ["lucy-heartfilia", "LEGENDARY", "Celeste", 2850, "Les etoiles repondent a l'appel.", ["fairy-tail", "celeste", "legendary"]],
  ["gray-fullbuster", "LEGENDARY", "Glace", 2820, "Le calme devient une lame.", ["fairy-tail", "glace", "legendary"]],
  ["wendy-marvell", "LEGENDARY", "Vent", 2740, "Un souffle peut relever une equipe.", ["fairy-tail", "vent", "legendary"]],
  ["laxus-dreyar", "LEGENDARY", "Foudre", 3150, "Le tonnerre tranche l'hesitation.", ["fairy-tail", "foudre", "legendary"]],
  ["gildarts-clive", "LEGENDARY", "Impact", 3300, "La force brute ouvre la voie.", ["fairy-tail", "impact", "legendary"]],
  ["mirajane-strauss", "LEGENDARY", "Ombre", 2980, "Un sourire peut cacher un demon.", ["fairy-tail", "ombre", "legendary"]],
  ["jellal-fernandes", "LEGENDARY", "Celeste", 3020, "Le ciel guide les pas repentis.", ["fairy-tail", "celeste", "legendary"]],
  ["brandish-mu", "LEGENDARY", "Terre", 2780, "La taille du monde n'est qu'une variable.", ["fairy-tail", "terre", "legendary"]],
  ["dimaria-yesta", "LEGENDARY", "Temps", 2940, "Un instant peut changer le duel.", ["fairy-tail", "temps", "legendary"]],
  ["minerva-orland", "LEGENDARY", "Arcane", 2680, "La precision domine le chaos.", ["fairy-tail", "arcane", "legendary"]],
  ["gajeel-redfox", "EPIC", "Metal", 1450, "Le metal chante quand le combat commence.", ["fairy-tail", "metal", "epic"]],
  ["juvia-lockser", "EPIC", "Eau", 1320, "La pluie devient une promesse.", ["fairy-tail", "eau", "epic"]],
  ["cana-alberona", "EPIC", "Cartes", 1180, "Une bonne carte suffit parfois.", ["fairy-tail", "cartes", "epic"]],
  ["levy-mcgarden", "EPIC", "Runes", 1120, "Les mots savent se battre.", ["fairy-tail", "runes", "epic"]],
  ["mystogan", "EPIC", "Illusion", 1500, "Le mystere garde l'avantage.", ["fairy-tail", "illusion", "epic"]],
  ["sting-eucliffe", "EPIC", "Lumiere", 1480, "La lumiere perce la defense.", ["fairy-tail", "lumiere", "epic"]],
  ["rogue-cheney", "EPIC", "Ombre", 1460, "L'ombre attend le bon angle.", ["fairy-tail", "ombre", "epic"]],
  ["kagura-mikazuchi", "EPIC", "Acier", 1420, "La lame reste patiente.", ["fairy-tail", "acier", "epic"]],
  ["ultear-milkovich", "EPIC", "Temps", 1380, "Revenir en arriere n'efface pas l'effort.", ["fairy-tail", "temps", "epic"]],
  ["meredy", "EPIC", "Lien", 1240, "Les liens multiplient la force.", ["fairy-tail", "lien", "epic"]],
  ["sherria-blendy", "EPIC", "Vent", 1260, "Le vent soigne autant qu'il frappe.", ["fairy-tail", "vent", "epic"]],
  ["happy", "RARE", "Vent", 560, "Aye, la guilde decolle.", ["fairy-tail", "vent", "rare"]],
  ["carla", "RARE", "Vent", 610, "La prudence evite les mauvais tirages.", ["fairy-tail", "vent", "rare"]],
  ["panther-lily", "RARE", "Acier", 700, "Petit format, grande discipline.", ["fairy-tail", "acier", "rare"]],
  ["elfman-strauss", "RARE", "Terre", 680, "La robustesse tient la ligne.", ["fairy-tail", "terre", "rare"]],
  ["lisanna-strauss", "RARE", "Nature", 520, "Changer de forme, garder le coeur.", ["fairy-tail", "nature", "rare"]],
  ["fried-justine", "RARE", "Runes", 660, "La regle ecrite devient bouclier.", ["fairy-tail", "runes", "rare"]],
  ["evergreen", "RARE", "Pierre", 600, "Un regard peut figer le terrain.", ["fairy-tail", "pierre", "rare"]],
  ["bickslow", "RARE", "Esprit", 580, "Les esprits dansent en formation.", ["fairy-tail", "esprit", "rare"]],
  ["mest-gryder", "RARE", "Memoire", 540, "La meilleure sortie est parfois cachee.", ["fairy-tail", "memoire", "rare"]],
  ["bisca-connell", "RARE", "Projectile", 570, "Viser juste, agir vite.", ["fairy-tail", "projectile", "rare"]],
  ["alzak-connell", "RARE", "Projectile", 550, "La couverture protege l'equipe.", ["fairy-tail", "projectile", "rare"]],
  ["romeo-conbolt", "COMMON", "Feu", 230, "Une etincelle peut devenir flamme.", ["fairy-tail", "feu", "common"]],
  ["macao-conbolt", "COMMON", "Feu", 260, "L'experience garde la main stable.", ["fairy-tail", "feu", "common"]],
  ["wakaba-mine", "COMMON", "Fumee", 240, "La fumee brouille les mauvais coups.", ["fairy-tail", "fumee", "common"]],
  ["max-alors", "COMMON", "Sable", 210, "Le sable trouve toujours une faille.", ["fairy-tail", "sable", "common"]],
  ["warren-rocko", "COMMON", "Signal", 220, "Une bonne communication sauve le tour.", ["fairy-tail", "signal", "common"]]
];

export const publicCharacterPack: LocalCharacterPack = {
  packName: "Fairy Tail Public Pack",
  packVersion: 1,
  author: "public",
  replacePlaceholders: true,
  characters: seeds.map(([id, rarity, element, power, quote, tags]) => ({
    id,
    name: toDisplayName(id),
    rarity,
    element,
    power,
    description: rarityDescription[rarity],
    imageUrl: `/private-assets/characters/${id}.webp`,
    placeholderImage: "/pwa.svg",
    quote,
    tags,
    category: "public-character-pack",
    variant: "default",
    isPrivate: false,
    source: "fairy-tail-public-pack"
  }))
};

function toDisplayName(id: string) {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
