# CODEX_REPORT

Date : 17 juin 2026

## Resume

Phase `GuildQuest Saison 1 - Boucle de jeu complete` ajoutee en V1 stable :

- correction GitHub Pages publique sans chargement de `/private-assets/...` depuis les placeholders ;
- onboarding de premiere ouverture ;
- objectifs quotidiens avec streak ;
- ecran Quetes quotidiennes avec tableau hebdo simple ;
- boutique avec achats en gemmes ;
- Duel ameliore avec deck builder, equipe sauvegardee, historique et progression d'arene ;
- Hall enrichi en dashboard quotidien ;
- Profil enrichi ;
- export/import/reset et Dexie etendus ;
- code splitting avec `React.lazy` / `Suspense`.

Aucun commit et aucun push effectues.
`public/private-assets/` n'a pas ete modifie sur le disque.
`src/data/characters/characters.local.ts` n'a pas ete modifie.

## Correction GitHub Pages / assets prives

Les placeholders publics ne referencent plus `/private-assets/...`.

Modifications :

- `src/data/characters/characters.placeholder.ts` utilise maintenant `image: ""` pour forcer le fallback CSS magique.
- `src/data/characters/characters.registry.ts` ne charge plus `characters.public-pack.ts`.
- `src/data/characters/characters.public-pack.ts` est supprime du suivi public.
- `vite.config.ts` exclut `private-assets` du precache Workbox.
- `vite.config.ts` nettoie `dist/private-assets` uniquement en mode `pages`.

Etat verifie :

- `dist/private-assets` apres `npm run build:pages` : absent.
- `dist/manifest.webmanifest` garde `start_url: "/GuildQuest/"` et `scope: "/GuildQuest/"`.

## Fichiers prives / Git

Les images etaient deja suivies par Git. Pour respecter la consigne, elles ont ete retirees de l'index avec :

```bash
git rm --cached -r public/private-assets
```

Important :

- la commande a retire les fichiers du suivi Git uniquement ;
- les fichiers locaux existent toujours ;
- exemple verifie : `public/private-assets/characters/natsu-dragneel.webp` existe encore.

Verification demandee :

```bash
git status --short --ignored src\data\characters\characters.local.ts public\private-assets
```

Resultat :

```txt
D  public/private-assets/characters/...
!! public/private-assets/
!! src/data/characters/characters.local.ts
```

Interpretation :

- les lignes `D` indiquent la suppression du suivi Git pour les images deja trackees ;
- `!! public/private-assets/` confirme que le dossier est ignore ;
- `!! src/data/characters/characters.local.ts` confirme que le fichier local reste ignore.

## Onboarding

Nouveau fichier :

- `src/features/onboarding/OnboardingScreen.tsx`

Comportement :

- affiche 6 etapes maximum ;
- explique Hall, missions/quiz, XP/gemmes, invocation/collection, duel, export JSON ;
- stocke l'etat via `settings.onboardingSeen` ;
- peut etre revu depuis Parametres.

## Quetes quotidiennes / streak

Nouveaux fichiers :

- `src/domain/models/DailyQuest.ts`
- `src/data/config/daily-quests.config.ts`
- `src/storage/repositories/daily.repository.ts`
- `src/features/daily/DailyQuestsScreen.tsx`
- `src/domain/services/date-key.service.ts`

Objectifs quotidiens V1 :

- ouvrir l'app ;
- terminer 1 quiz ;
- obtenir au moins 80% a un quiz ;
- faire 1 invocation ;
- jouer 1 duel ;
- gagner 1 duel.

Chaque objectif donne une petite recompense XP/gemmes, parfois poussiere magique.
Le streak augmente quand un objectif est complete dans la journee.

Limite documentee :

- les quetes hebdomadaires sont une V1 derivee des compteurs existants, sans recompenses hebdo persistantes dediees pour l'instant.

## Boutique

Nouveaux fichiers :

- `src/domain/models/Shop.ts`
- `src/data/config/shop.config.ts`
- `src/storage/repositories/shop.repository.ts`
- `src/features/shop/ShopScreen.tsx`

Achats V1 :

- 100 gemmes -> 50 poussiere magique ;
- 150 gemmes -> 100 XP ;
- 300 gemmes -> cache arcane XP/poussiere avec petit bonus aleatoire.

Les achats demandent confirmation et sont sauvegardes dans Dexie.

## Duel V1 ameliore

Fichiers principaux :

- `src/domain/models/DuelProgress.ts`
- `src/storage/repositories/duel.repository.ts`
- `src/features/duel/DuelScreen.tsx`

Ajouts :

- selection manuelle de 3 personnages possedes ;
- sauvegarde de l'equipe preferee ;
- fallback equipe auto si equipe invalide ;
- historique des 10 derniers duels ;
- progression d'arene avec rangs `Bronze`, `Argent`, `Or`, `Saphir`, `Legende` ;
- affichage du rang d'arene et des points.

## Hall / Profil

Hall :

- bouton `Quetes` ;
- bouton `Boutique` ;
- bloc compact `Dashboard quotidien` ;
- affichage du streak ;
- alerte si recompense quotidienne a reclamer.

Profil :

- streak actuel ;
- meilleur streak ;
- quetes quotidiennes completees ;
- recompenses quotidiennes reclamees ;
- rang d'arene ;
- points d'arene.

## Export / Import / Reset

`backup.repository.ts` inclut maintenant :

- `dailyProgress` ;
- `streakState` ;
- `shopPurchases` ;
- `duelTeam` ;
- `duelHistory` ;
- `arenaProgress`.

L'import reste compatible avec les anciennes sauvegardes :

- les nouveaux champs sont optionnels ;
- des tableaux vides sont utilises si absents.

Reset local :

- vide aussi les nouvelles tables Dexie ;
- recree toujours le joueur `leb` via le flux existant.

## Dexie

`src/storage/db.ts` passe a une version 2 avec tables :

- `dailyProgress` ;
- `streakState` ;
- `shopPurchases` ;
- `duelTeam` ;
- `duelHistory` ;
- `arenaProgress`.

## Code splitting

`App.tsx` utilise maintenant `React.lazy` et `Suspense` pour charger separement :

- Missions ;
- Map ;
- Zone detail ;
- Gacha ;
- Collection ;
- Character detail ;
- Badges ;
- Settings ;
- Import/Export ;
- Duel ;
- DailyQuests ;
- Shop ;
- Profile.

Resultat :

- les ecrans sont bien decoupes en chunks separes ;
- le chunk principal reste legerement au-dessus du seuil Vite de 500 kB, mais il est passe a environ 519 kB minifie.

## Commandes executees

- `npm run lint`
- `npm run build`
- `npm run build:pages`
- `git status --short`
- `git status --short --ignored src\data\characters\characters.local.ts public\private-assets`
- `git rm --cached -r public/private-assets`

## Resultat lint

OK.

## Resultat build

OK.

Details :

- build TypeScript + Vite reussi ;
- PWA generee ;
- avertissement non bloquant : chunk principal superieur a 500 kB apres minification.

## Resultat build Pages

OK.

Details :

- build Vite en mode `pages` reussi ;
- manifest compatible `/GuildQuest/` ;
- `dist/private-assets` absent apres nettoyage ;
- PWA generee ;
- avertissement non bloquant : chunk principal superieur a 500 kB apres minification.

## Etat Git final

`git status --short` affiche notamment :

```txt
 M .gitignore
 M CODEX_RULES.md
 M PRIVATE_ASSETS_GUIDE.md
 M README.md
 M src/app/App.tsx
 M src/data/characters/characters.placeholder.ts
 D src/data/characters/characters.public-pack.ts
 M src/data/characters/characters.registry.ts
 M src/domain/models/GameSettings.ts
 M src/domain/models/index.ts
 M src/features/duel/DuelScreen.tsx
 M src/features/home/HomeScreen.tsx
 M src/features/import-export/ImportExportScreen.tsx
 M src/features/profile/ProfileScreen.tsx
 M src/features/settings/SettingsScreen.tsx
 M src/storage/db.ts
 M src/storage/repositories/backup.repository.ts
 M src/storage/repositories/settings.repository.ts
 M vite.config.ts
 D public/private-assets/characters/...
?? src/data/config/daily-quests.config.ts
?? src/data/config/shop.config.ts
?? src/domain/models/DailyQuest.ts
?? src/domain/models/DuelProgress.ts
?? src/domain/models/Shop.ts
?? src/domain/services/date-key.service.ts
?? src/features/daily/
?? src/features/onboarding/
?? src/features/shop/
?? src/storage/repositories/daily.repository.ts
?? src/storage/repositories/duel.repository.ts
?? src/storage/repositories/onboarding.repository.ts
?? src/storage/repositories/shop.repository.ts
```

Les `D public/private-assets/...` correspondent au retrait du suivi Git, pas a une suppression locale.

## Limites

- Pas de vraies notifications push, seulement feedbacks UI simples.
- Les quetes hebdomadaires n'ont pas encore de recompenses persistantes.
- La boutique V1 est volontairement simple.
- Le deck builder Duel sauvegarde une equipe de 3, sans edition avancee.
- Le warning bundle > 500 kB reste present, mais le code splitting a bien decoupe les ecrans lourds.
- Pas de test navigateur automatise lance dans cette etape.

## Points a tester manuellement

- Premier lancement : onboarding visible.
- Parametres : bouton pour revoir le tutoriel.
- Hall : bloc quotidien, boutons Quetes et Boutique.
- Faire un quiz : objectif quotidien quiz mis a jour.
- Faire un score >= 80% : objectif quotidien score mis a jour.
- Faire une invocation : objectif invocation mis a jour.
- Jouer/gagner un duel : objectifs duel mis a jour.
- Reclamer une recompense quotidienne.
- Acheter un item Boutique.
- Choisir et sauvegarder une equipe Duel.
- Faire un duel et verifier historique + rang d'arene.
- Profil : streak, arene, quetes quotidiennes.
- Export JSON puis import.
- Reset local.
- GitHub Pages : absence de requetes 404 vers `/private-assets/...`.

## Prochaine etape recommandee

Ajouter des recompenses hebdomadaires persistantes et un petit toast global partage par tous les ecrans pour les feedbacks de recompense/achat/streak.
