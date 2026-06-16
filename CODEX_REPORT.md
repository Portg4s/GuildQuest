# CODEX_REPORT

Date : 16 juin 2026

## Resume

Module gacha V1 implemente dans GuildQuest :

- Navigation Hall vers `Invocation` et `Collection`.
- Nouveaux ecrans `gacha`, `collection`, `character-detail`.
- Invocation x1 et x10 avec couts configures.
- Tirage pondere par rarete.
- Animation simple Framer Motion pendant et apres l'invocation.
- Resultats visibles avec rarete, statut `Nouveau !` ou `Doublon`.
- Gestion des doublons en fragments et poussiere magique.
- Collection filtrable par rarete.
- Detail personnage avec statut possede/non possede.
- Definition d'un personnage actif.
- Affichage du personnage actif dans le Hall et dans le Profil.
- Persistance Dexie de la collection, de l'historique gacha, du joueur, des gemmes, de la poussiere magique et du personnage actif.

## Fichiers crees ou modifies

Modifies :

- `src/app/App.tsx`
- `src/domain/models/Player.ts`
- `src/domain/models/PlayerCharacter.ts`
- `src/domain/models/GachaPull.ts`
- `src/features/home/HomeScreen.tsx`
- `src/features/profile/ProfileScreen.tsx`
- `src/stores/game.store.ts`
- `src/stores/player.store.ts`
- `CODEX_REPORT.md`

Crees :

- `src/components/game/rarity-styles.ts`
- `src/data/config/duplicates.config.ts`
- `src/domain/gacha/gacha-rates.service.ts`
- `src/domain/gacha/duplicate.service.ts`
- `src/domain/gacha/gacha.service.ts`
- `src/features/gacha/GachaScreen.tsx`
- `src/features/collection/CollectionScreen.tsx`
- `src/features/character-detail/CharacterDetailScreen.tsx`
- `src/storage/repositories/collection.repository.ts`
- `src/storage/repositories/gacha-history.repository.ts`

## Logique gacha ajoutee

- Couts :
  - x1 : 80 gemmes ;
  - x10 : 700 gemmes.
- Taux utilises depuis `gacha.config.ts` :
  - COMMON : 45 ;
  - RARE : 30 ;
  - EPIC : 15 ;
  - LEGENDARY : 8 ;
  - MYTHIC : 2.
- Selection d'une rarete par poids cumules.
- Selection aleatoire d'un personnage dans la rarete tiree.
- Fallback prevu si une rarete n'a aucun personnage : tirage dans le pool global.
- Verification des gemmes avant invocation.
- Deduction des gemmes.
- Ajout du personnage si nouveau.
- Conversion en fragments et poussiere magique si doublon.
- Creation d'une entree d'historique `GachaPull`.

## Gestion des doublons

Config ajoutee dans `duplicates.config.ts` :

- COMMON : +5 fragments, +10 poussiere magique.
- RARE : +10 fragments, +25 poussiere magique.
- EPIC : +20 fragments, +60 poussiere magique.
- LEGENDARY : +50 fragments, +150 poussiere magique.
- MYTHIC : +100 fragments, +300 poussiere magique.

## Logique collection ajoutee

- Grille responsive de tous les personnages placeholders.
- Personnages possedes visibles normalement.
- Personnages non possedes grises avec silhouette placeholder.
- Filtres `Tous`, `Commun`, `Rare`, `Epique`, `Legendaire`, `Mythique`.
- Affichage rarete, element, puissance, fragments.
- Bouton `Definir actif` pour les personnages possedes.
- Clic carte vers ecran detail.
- Detail personnage avec grande carte animee, description, fragments, doublons et bouton actif.

## Etat de la persistance Dexie

Persistant maintenant :

- `player` :
  - gemmes ;
  - poussiere magique ;
  - `activeCharacterId` ;
  - progression joueur existante.
- `playerCharacters` :
  - personnage possede ;
  - fragments ;
  - nombre de doublons ;
  - date d'obtention ;
  - statut actif.
- `gachaHistory` :
  - personnage tire ;
  - rarete ;
  - cout ;
  - doublon ou non ;
  - fragments gagnes ;
  - poussiere gagnee ;
  - date de tirage.

Au refresh, l'application recharge joueur, collection, historique gacha et progression quiz depuis IndexedDB.

## Commandes executees

- `Get-Content -Raw CODEX_RULES.md`
- `Get-Content -Raw src/app/App.tsx`
- `Get-Content -Raw src/stores/player.store.ts`
- `Get-Content -Raw src/stores/game.store.ts`
- `Get-Content -Raw src/storage/db.ts`
- `Get-Content -Raw src/domain/models/Player.ts`
- `Get-Content -Raw src/domain/models/PlayerCharacter.ts`
- `Get-Content -Raw src/domain/models/GachaPull.ts`
- `Get-Content -Raw src/data/config/gacha.config.ts`
- `Get-Content -Raw src/data/characters/characters.example.ts`
- `npm run build`
- `npm run lint`
- `npm run dev -- --host 127.0.0.1`

## Resultat de `npm run build`

OK.

Le build Vite production passe et genere les fichiers PWA dans `dist/`.

## Resultat de `npm run lint`

OK.

Un premier passage a signale un import inutilise `Trophy` dans `GachaScreen.tsx`. L'import a ete retire, puis `npm run lint` est repasse sans erreur ni avertissement.

## Resultat de `npm run dev`

OK pour le demarrage.

Vite annonce :

- `VITE v8.0.16 ready`
- `Local: http://127.0.0.1:5173/`

La commande a ete arretee par timeout volontaire apres quelques secondes, car le serveur de dev reste ouvert en continu.

## Erreurs ou limites rencontrees

- Verification navigateur integre impossible : l'instance `iab` n'est pas disponible dans cette session.
- Aucun asset protege n'a ete ajoute.
- Aucun telechargement Internet n'a ete effectue.
- Aucun commit et aucun push n'ont ete faits.

## Points a verifier manuellement

- Lancer `npm run dev`.
- Ouvrir `http://127.0.0.1:5173/`.
- Depuis le Hall, ouvrir `Invocation`.
- Faire une invocation x1.
- Gagner assez de gemmes via les missions, puis tester une invocation x10.
- Verifier la deduction des gemmes.
- Refaire des invocations pour confirmer les doublons, fragments et poussiere magique.
- Ouvrir `Collection`.
- Definir un personnage actif.
- Verifier que le personnage actif apparait dans le Hall et le Profil.
- Rafraichir la page et confirmer que gemmes, poussiere, collection et actif persistent.

## Prochaine etape recommandee

Ajouter un systeme d'evolution des personnages avec fragments, puis une petite page d'historique des invocations pour consulter les derniers tirages.
