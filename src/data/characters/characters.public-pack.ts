import type { LocalCharacterInput, LocalCharacterPack } from "@/data/characters/characters.registry";

type PublicCharacterSeed = [
  id: string,
  name: string,
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

const publicCharacterSeeds: PublicCharacterSeed[] = [
  ["natsu-dragneel", "Natsu Dragneel", "MYTHIC", "Feu", 4300, "Le feu avance toujours.", ["fairy-tail", "feu", "mythic"]],
  ["erza-scarlet", "Erza Scarlet", "MYTHIC", "Acier", 4200, "La discipline forge la victoire.", ["fairy-tail", "acier", "mythic"]],
  ["zeref-dragneel", "Zeref Dragneel", "MYTHIC", "Ombre", 4400, "Le savoir ancien a un prix.", ["fairy-tail", "ombre", "mythic"]],
  ["acnologia", "Acnologia", "MYTHIC", "Dragon", 4600, "Une puissance qui eclipse le ciel.", ["fairy-tail", "dragon", "mythic"]],
  ["mavis-vermillion", "Mavis Vermillion", "MYTHIC", "Lumiere", 4100, "La strategie est une magie silencieuse.", ["fairy-tail", "lumiere", "mythic"]],
  ["august", "August", "MYTHIC", "Arcane", 4250, "Chaque sort a son echo.", ["fairy-tail", "arcane", "mythic"]],
  ["irene-belserion", "Irene Belserion", "MYTHIC", "Dragon", 4350, "Les runes plient sous sa volonte.", ["fairy-tail", "dragon", "mythic"]],
  ["lucy-heartfilia", "Lucy Heartfilia", "LEGENDARY", "Celeste", 2850, "Les etoiles repondent a l'appel.", ["fairy-tail", "celeste", "legendary"]],
  ["gray-fullbuster", "Gray Fullbuster", "LEGENDARY", "Glace", 2800, "Le calme devient une lame.", ["fairy-tail", "glace", "legendary"]],
  ["wendy-marvell", "Wendy Marvell", "LEGENDARY", "Vent", 2700, "Un souffle peut relever une equipe.", ["fairy-tail", "vent", "legendary"]],
  ["laxus-dreyar", "Laxus Dreyar", "LEGENDARY", "Foudre", 3050, "Le tonnerre tranche l'hesitation.", ["fairy-tail", "foudre", "legendary"]],
  ["gildarts-clive", "Gildarts Clive", "LEGENDARY", "Impact", 3200, "La force brute ouvre la voie.", ["fairy-tail", "impact", "legendary"]],
  ["mirajane-strauss", "Mirajane Strauss", "LEGENDARY", "Ombre", 2950, "Un sourire peut cacher un demon.", ["fairy-tail", "ombre", "legendary"]],
  ["jellal-fernandes", "Jellal Fernandes", "LEGENDARY", "Celeste", 3000, "Le ciel guide les pas repentis.", ["fairy-tail", "celeste", "legendary"]],
  ["brandish-mu", "Brandish Mu", "LEGENDARY", "Terre", 2750, "La taille du monde n'est qu'une variable.", ["fairy-tail", "terre", "legendary"]],
  ["dimaria-yesta", "Dimaria Yesta", "LEGENDARY", "Temps", 2900, "Un instant peut changer le duel.", ["fairy-tail", "temps", "legendary"]],
  ["minerva-orland", "Minerva Orland", "LEGENDARY", "Arcane", 2650, "La precision domine le chaos.", ["fairy-tail", "arcane", "legendary"]],
  ["gajeel-redfox", "Gajeel Redfox", "EPIC", "Metal", 1450, "Le metal chante quand le combat commence.", ["fairy-tail", "metal", "epic"]],
  ["juvia-lockser", "Juvia Lockser", "EPIC", "Eau", 1320, "La pluie devient une promesse.", ["fairy-tail", "eau", "epic"]],
  ["cana-alberona", "Cana Alberona", "EPIC", "Cartes", 1180, "Une bonne carte suffit parfois.", ["fairy-tail", "cartes", "epic"]],
  ["levy-mcgarden", "Levy McGarden", "EPIC", "Runes", 1120, "Les mots savent se battre.", ["fairy-tail", "runes", "epic"]],
  ["mystogan", "Mystogan", "EPIC", "Illusion", 1500, "Le mystere garde l'avantage.", ["fairy-tail", "illusion", "epic"]],
  ["sting-eucliffe", "Sting Eucliffe", "EPIC", "Lumiere", 1480, "La lumiere perce la defense.", ["fairy-tail", "lumiere", "epic"]],
  ["rogue-cheney", "Rogue Cheney", "EPIC", "Ombre", 1460, "L'ombre attend le bon angle.", ["fairy-tail", "ombre", "epic"]],
  ["kagura-mikazuchi", "Kagura Mikazuchi", "EPIC", "Acier", 1420, "La lame reste patiente.", ["fairy-tail", "acier", "epic"]],
  ["ultear-milkovich", "Ultear Milkovich", "EPIC", "Temps", 1380, "Revenir en arriere n'efface pas l'effort.", ["fairy-tail", "temps", "epic"]],
  ["meredy", "Meredy", "EPIC", "Lien", 1240, "Les liens multiplient la force.", ["fairy-tail", "lien", "epic"]],
  ["sherria-blendy", "Sherria Blendy", "EPIC", "Vent", 1260, "Le vent soigne autant qu'il frappe.", ["fairy-tail", "vent", "epic"]],
  ["happy", "Happy", "RARE", "Vent", 560, "Aye, la guilde decolle.", ["fairy-tail", "vent", "rare"]],
  ["carla", "Carla", "RARE", "Vent", 610, "La prudence evite les mauvais tirages.", ["fairy-tail", "vent", "rare"]],
  ["panther-lily", "Panther Lily", "RARE", "Acier", 700, "Petit format, grande discipline.", ["fairy-tail", "acier", "rare"]],
  ["elfman-strauss", "Elfman Strauss", "RARE", "Terre", 680, "La robustesse tient la ligne.", ["fairy-tail", "terre", "rare"]],
  ["lisanna-strauss", "Lisanna Strauss", "RARE", "Nature", 520, "Changer de forme, garder le coeur.", ["fairy-tail", "nature", "rare"]],
  ["fried-justine", "Fried Justine", "RARE", "Runes", 660, "La regle ecrite devient bouclier.", ["fairy-tail", "runes", "rare"]],
  ["evergreen", "Evergreen", "RARE", "Pierre", 600, "Un regard peut figer le terrain.", ["fairy-tail", "pierre", "rare"]],
  ["bickslow", "Bickslow", "RARE", "Esprit", 580, "Les esprits dansent en formation.", ["fairy-tail", "esprit", "rare"]],
  ["mest-gryder", "Mest Gryder", "RARE", "Memoire", 540, "La meilleure sortie est parfois cachee.", ["fairy-tail", "memoire", "rare"]],
  ["bisca-connell", "Bisca Connell", "RARE", "Projectile", 570, "Viser juste, agir vite.", ["fairy-tail", "projectile", "rare"]],
  ["alzak-connell", "Alzak Connell", "RARE", "Projectile", 550, "La couverture protege l'equipe.", ["fairy-tail", "projectile", "rare"]],
  ["romeo-conbolt", "Romeo Conbolt", "COMMON", "Feu", 230, "Une etincelle peut devenir flamme.", ["fairy-tail", "feu", "common"]],
  ["macao-conbolt", "Macao Conbolt", "COMMON", "Feu", 260, "L'experience garde la main stable.", ["fairy-tail", "feu", "common"]],
  ["wakaba-mine", "Wakaba Mine", "COMMON", "Fumee", 240, "La fumee brouille les mauvais coups.", ["fairy-tail", "fumee", "common"]],
  ["max-alors", "Max Alors", "COMMON", "Sable", 210, "Le sable trouve toujours une faille.", ["fairy-tail", "sable", "common"]],
  ["warren-rocko", "Warren Rocko", "COMMON", "Signal", 220, "Une bonne communication sauve le tour.", ["fairy-tail", "signal", "common"]]
];

function toCharacter([id, name, rarity, element, power, quote, tags]: PublicCharacterSeed): LocalCharacterInput {
  return {
    id,
    name,
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
  };
}

export const publicCharacterPack: LocalCharacterPack = {
  packName: "Fairy Tail Public Pack",
  packVersion: 1,
  author: "public",
  replacePlaceholders: true,
  characters: publicCharacterSeeds.map(toCharacter)
};
