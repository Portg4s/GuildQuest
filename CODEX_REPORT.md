# CODEX_REPORT

Date : 16 juin 2026

## Resume

Polish UX mobile cible effectue sur deux ecrans :

- `MissionsScreen` : filtres rapides par statut et par zone, cartes plus compactes, grille responsive conservee.
- `BadgesScreen` : separation en onglets Badges / Titres, filtres de badges, cartes plus denses.

La logique metier profonde, Dexie, Zustand, quiz, gacha, progression et import/export n'ont pas ete modifies.

## Fichiers modifies

- `src/features/missions/MissionsScreen.tsx`
- `src/features/badges/BadgesScreen.tsx`
- `CODEX_REPORT.md`

## Changements UX Missions

- Ajout de filtres rapides :
  - Tous ;
  - Non tentes ;
  - Valides ;
  - Parfaits.
- Ajout d'un filtre horizontal par zone :
  - Internet & Web ;
  - Client / Serveur ;
  - HTTP & HTTPS ;
  - HTML & CSS ;
  - JavaScript & APIs.
- Affichage du compteur `missions affichees / missions totales`.
- Cartes mission compactees :
  - titre sur une ligne ;
  - description reduite ;
  - stats questions / meilleur score plus petites ;
  - recompenses XP/gemmes plus denses ;
  - bouton `Lancer` moins haut.
- Grille responsive maintenue en 2 colonnes sur ecrans assez larges.

## Changements UX Badges & Titres

- Ajout d'onglets :
  - Badges ;
  - Titres.
- Les badges et les titres ne sont plus empiles sur une seule longue page.
- Onglet Badges :
  - filtres Tous / Obtenus / Verrouilles ;
  - cartes compactes ;
  - grille 2 colonnes mobile et 3 colonnes sur grands ecrans.
- Onglet Titres :
  - affichage dedie aux titres uniquement ;
  - rappel clair du titre actif ;
  - cartes plus compactes ;
  - bouton `Definir actif` conserve.

## Commandes executees

- `npm run lint`
- `npm run build`

## Resultat de `npm run lint`

OK.

Aucune erreur et aucun avertissement ESLint apres correction du warning React sur les dependances de `useMemo`.

## Resultat de `npm run build`

OK.

Le build production Vite passe.

Avertissement restant non bloquant :

- certains chunks depassent 500 kB apres minification.

## Points a verifier manuellement

- Ouvrir Missions sur mobile et tester les filtres par statut.
- Tester le filtre par zone sur Missions.
- Lancer un quiz depuis une mission filtree.
- Ouvrir Badges & Titres.
- Tester les onglets Badges / Titres.
- Tester les filtres Tous / Obtenus / Verrouilles.
- Verifier que le changement de titre actif fonctionne toujours.

## Prochaine etape recommandee

Faire une passe visuelle mobile sur Carte et Detail de zone pour appliquer la meme densite de navigation aux parcours exploratoires.
