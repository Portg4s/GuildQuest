# CODEX_REPORT

Date : 16 juin 2026

## Resume

La premiere boucle jouable de GuildQuest est implementee :

- Hall de guilde avec valeurs joueur visibles.
- Navigation interne simple sans React Router.
- Ecrans `home`, `missions`, `quiz`, `results`, `profile`.
- Liste des missions issue du pack `Fondations Web`.
- Lancement d'un quiz.
- Reponse question par question.
- Gestion `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `TRUE_FALSE`.
- Calcul du score.
- Ecran de resultat anime.
- Attribution XP/gemmes selon le rang et le score.
- Recalcul provisoire du niveau.
- Mise a jour immediate du Hall et du Profil.
- Debut de persistance locale Dexie pour le joueur et la progression quiz.

## Fichiers crees ou modifies

- `src/app/App.tsx`
- `src/features/home/HomeScreen.tsx`
- `src/features/missions/MissionsScreen.tsx`
- `src/features/quiz/QuizScreen.tsx`
- `src/features/results/ResultsScreen.tsx`
- `src/features/profile/ProfileScreen.tsx`
- `src/domain/services/mission.service.ts`
- `src/domain/services/quiz.service.ts`
- `src/domain/reward/reward.service.ts`
- `src/domain/progression/level.service.ts`
- `src/storage/db.ts`
- `src/storage/repositories/player.repository.ts`
- `src/storage/repositories/quiz-progress.repository.ts`
- `src/stores/player.store.ts`
- `src/stores/game.store.ts`
- `CODEX_REPORT.md`

## Logique metier ajoutee

- Construction des missions a partir du pack `foundations-web.example.ts`.
- Recuperation des recompenses de base depuis `rewards.config.ts`.
- Verification exacte des reponses :
  - choix unique : une option correcte ;
  - choix multiples : ensemble selectionne strictement egal a l'ensemble correct ;
  - vrai/faux : options existantes `Vrai` / `Faux`.
- Calcul du score en pourcentage.
- Statut de mission :
  - `< 60%` : `Echec` ;
  - `60-79%` : `Mission validee` ;
  - `80-99%` : `Mission bien reussie` ;
  - `100%` : `Mission parfaite`.
- Calcul des recompenses avec multiplicateurs :
  - `< 60%` : `0.2` ;
  - `60-79%` : `1` ;
  - `80-99%` : `1.3` ;
  - `100%` : `1.8`.
- Recalcul de niveau provisoire :
  - XP necessaire au niveau suivant = `level * 100` ;
  - montees de plusieurs niveaux possibles.

## Persistance Dexie

Persistant maintenant :

- Joueur (`player`) : niveau, XP, gemmes, rang et metadonnees.
- Progression quiz (`quizProgress`) :
  - `bestScore` ;
  - `attempts` ;
  - `lastScore` ;
  - dernier nombre de bonnes reponses ;
  - dernier total de questions ;
  - dernieres recompenses XP/gemmes ;
  - `completedAt` si score >= 60% ;
  - `updatedAt`.

Au demarrage, l'application recharge le joueur et la progression depuis IndexedDB. Si aucun joueur n'existe, le joueur par defaut `leb` est cree en local.

Reste a finaliser plus tard :

- Persistance detaillee des reponses question par question.
- Historique complet des tentatives.
- Synchronisation des packs installes et import/export JSON.

## Commandes executees

- `Get-Content -Raw CODEX_RULES.md`
- `Get-Content -Raw src/app/App.tsx`
- `Get-Content -Raw src/stores/player.store.ts`
- `Get-Content -Raw src/storage/db.ts`
- `Get-Content -Raw src/data/packs/foundations-web.example.ts`
- `Get-Content -Raw src/data/config/rewards.config.ts`
- `npm run build`
- `npm run lint`
- `npm run dev -- --host 127.0.0.1`

## Resultat de `npm run build`

OK.

Vite a genere le build production et les fichiers PWA :

- `dist/registerSW.js`
- `dist/manifest.webmanifest`
- `dist/sw.js`
- `dist/workbox-*.js`

## Resultat de `npm run lint`

OK.

Aucune erreur et aucun avertissement ESLint.

## Resultat de `npm run dev`

OK pour le demarrage.

La commande annonce correctement :

- `VITE v8.0.16 ready`
- `Local: http://127.0.0.1:5173/`

La commande a ete arretee par timeout volontaire apres quelques secondes, car un serveur Vite reste ouvert en continu.

## Erreurs ou limites rencontrees

- Verification navigateur integre impossible : l'instance `iab` n'est pas disponible dans cette session.
- La validation interactive complete doit donc etre faite manuellement dans le navigateur local.
- Aucune erreur restante cote build ou lint.

## Points a verifier manuellement

- Lancer `npm run dev`.
- Ouvrir `http://127.0.0.1:5173/`.
- Depuis le Hall, ouvrir `Missions`.
- Lancer une mission.
- Repondre au quiz.
- Verifier l'ecran Resultat.
- Revenir au Hall et verifier XP/gemmes/niveau.
- Ouvrir le Profil et verifier les statistiques.
- Rafraichir la page et confirmer que joueur/progression survivent au refresh via IndexedDB.

## Prochaine etape recommandee

Ajouter un vrai journal de tentatives avec detail des reponses, puis construire les ecrans Carte et Detail de mission pour rendre le pack `Fondations Web` plus exploratoire.
