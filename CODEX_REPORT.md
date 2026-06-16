# CODEX_REPORT

Date : 16 juin 2026

## Resume

Le systeme de progression gratifiant V1 est ajoute :

- montee de niveau detaillee ;
- bonus de gemmes a chaque niveau franchi ;
- animation de level up sur l'ecran Resultat ;
- resume clair des gains XP/gemmes ;
- badges V1 ;
- titres V1 ;
- ecran `Badges & Titres` ;
- titre actif affichable et modifiable ;
- debug local dans le Profil pour tester niveaux et gacha x10 ;
- persistance Dexie des badges/titres.

## Fichiers crees ou modifies

Crees :

- `src/data/config/level-rewards.config.ts`
- `src/data/config/badges.config.ts`
- `src/data/config/titles.config.ts`
- `src/domain/progression/achievements.service.ts`
- `src/features/badges/BadgesScreen.tsx`
- `src/storage/repositories/achievement.repository.ts`

Modifies :

- `src/app/App.tsx`
- `src/domain/progression/level.service.ts`
- `src/features/home/HomeScreen.tsx`
- `src/features/profile/ProfileScreen.tsx`
- `src/features/results/ResultsScreen.tsx`
- `src/storage/db.ts`
- `src/stores/game.store.ts`
- `src/stores/player.store.ts`
- `CODEX_REPORT.md`

## Formule de bonus gemmes

Config ajoutee :

- `src/data/config/level-rewards.config.ts`

Formule :

```ts
Math.round(75 * Math.pow(levelReached, 1.15))
```

Le bonus est donne pour chaque niveau franchi. Si plusieurs niveaux sont gagnes d'un coup, les bonus sont cumules.

## Logique de montee de niveau

La regle XP reste :

- XP necessaire niveau suivant = `level * 100`

Le service retourne maintenant :

- ancien niveau ;
- nouveau niveau ;
- nombre de niveaux gagnes ;
- XP actuelle ;
- XP necessaire prochain niveau ;
- gemmes bonus gagnees ;
- liste des niveaux franchis.

L'application ajoute au joueur :

- gemmes de mission ;
- gemmes bonus de niveau ;
- XP restante apres montee ;
- nouveau niveau ;
- prochain seuil XP.

## Ecran Resultat

L'ecran Resultat affiche maintenant :

- XP de mission ;
- gemmes de mission ;
- bonus gemmes de niveau ;
- total gemmes gagnees ;
- animation `Niveau superieur !` si applicable ;
- badges debloques ;
- titres debloques.

## Badges V1

Config ajoutee :

- `src/data/config/badges.config.ts`

Badges declares :

- Premier quiz reussi
- Premier sans-faute
- 5 quiz termines
- 10 quiz termines
- Premier niveau superieur
- Niveau 5 atteint
- Niveau 10 atteint
- Premiere invocation
- Premier personnage rare
- Premier personnage legendaire
- Explorateur des Fondations
- Maitre des Fondations

Branches maintenant :

- badges quiz ;
- badges niveau ;
- badges progression Fondations ;
- badges gacha de base apres invocation.

## Titres V1

Config ajoutee :

- `src/data/config/titles.config.ts`

Titres declares :

- Apprenti de la Guilde
- Chasseur de Competences
- Mage du Web
- Invocateur Debutant
- Collectionneur de Guilde
- Stratege des Fondations
- Etoile Montante
- Mage de Rang F

Fonctionnel maintenant :

- titres debloques ;
- titres par defaut ;
- titre actif ;
- changement du titre actif depuis `Badges & Titres` ;
- affichage dans Hall et Profil.

## Persistance Dexie

Tables utilisees :

- `unlockedBadges`
- `unlockedTitles`
- `player`

Persistant :

- badges debloques ;
- titres debloques ;
- `activeTitleId` sur le joueur ;
- ids de badges/titres sur le joueur ;
- bonus de gemmes via la valeur `player.gems` ;
- dernieres recompenses quiz avec total gemmes, gemmes de mission et bonus niveau.

## Debug local

Ajoute dans le Profil, section `Debug local` :

- `+500 gemmes`
- `+2000 gemmes`
- `+1000 XP`
- `Gemmes = 200`

Ces actions modifient le joueur localement et persistent via Dexie. Elles servent a tester rapidement les invocations x10 et les niveaux.

## Commandes executees

- `Get-Content -Raw CODEX_RULES.md`
- lectures des fichiers `App`, `ResultsScreen`, stores, repositories, modeles et services de progression
- `Get-Content src/features/results/ResultsScreen.tsx | Select-Object -Index 72..88`
- `Get-Content src/features/results/ResultsScreen.tsx | Select-Object -Skip 72 -First 20`
- `npm run build`
- `npm run lint`
- `npm run dev -- --host 127.0.0.1`
- `git status --short`

## Resultat de `npm run build`

OK.

Le build production Vite passe.

Avertissement restant :

- certains chunks depassent 500 kB apres minification.
- avertissement non bloquant deja present sur les versions precedentes.

## Resultat de `npm run lint`

OK.

Aucune erreur et aucun avertissement ESLint.

## Resultat de `npm run dev`

OK pour le demarrage.

Vite annonce :

- `VITE v8.0.16 ready`
- `Local: http://127.0.0.1:5173/`

La commande a ete arretee par timeout volontaire apres quelques secondes, car le serveur de dev reste ouvert en continu.

## Erreurs ou limites rencontrees

- Une commande de lecture PowerShell avec `Select-Object -Index 72..88` a echoue car la plage n'etait pas convertie en tableau d'entiers. Relance reussie avec `-Skip 72 -First 20`.
- Un premier build a echoue sur `->` dans du JSX. Correction : rendu sous forme de chaine `{"->"}`.
- La verification visuelle navigateur integre n'a pas ete tentee dans cette tache.
- Aucun commit et aucun push n'ont ete faits.

## Points a verifier manuellement

- Lancer `npm run dev`.
- Terminer un quiz avec assez d'XP pour monter de niveau.
- Verifier l'animation `Niveau superieur !`.
- Verifier que les gemmes bonus sont ajoutees.
- Verifier l'ecran Resultat et le detail des gains.
- Ouvrir `Badges & Titres`.
- Changer le titre actif.
- Verifier le titre actif dans Hall et Profil.
- Utiliser le debug local `+2000 gemmes`.
- Tester une invocation x10.
- Rafraichir la page et verifier que joueur, badges, titres et titre actif persistent.

## Prochaine etape recommandee

Ajouter une notification globale de recompenses/deblocages reutilisable pour le gacha, les badges, les titres et les futures evolutions de personnages.
