# CODEX_REPORT

Date : 16 juin 2026

## Resume

La couche de gestion locale des donnees est ajoutee :

- ecran `Parametres` ;
- ecran `Import / Export` ;
- export JSON complet ;
- import JSON complet avec validation et confirmation ;
- reset local complet ;
- preferences UI sons/animations/vitesse ;
- rechargement des stores Zustand apres import/reset ;
- documentation README.

## Fichiers crees ou modifies

Crees :

- `src/features/settings/SettingsScreen.tsx`
- `src/features/import-export/ImportExportScreen.tsx`
- `src/storage/repositories/backup.repository.ts`
- `src/storage/repositories/settings.repository.ts`

Modifies :

- `README.md`
- `src/app/App.tsx`
- `src/domain/models/GameSettings.ts`
- `src/features/home/HomeScreen.tsx`
- `src/stores/ui.store.ts`
- `CODEX_REPORT.md`

## Tables exportees

L'export complet JSON inclut :

- `player`
- `playerCharacters`
- `quizProgress`
- `gachaHistory`
- `unlockedBadges`
- `unlockedTitles`
- `settings`
- `installedPacks`

Metadata incluse :

- `appName: GuildQuest`
- `backupVersion`
- `exportedAt`
- `schemaVersion`

Nom de fichier :

- `guildquest-backup-YYYY-MM-DD-HH-mm.json`

Les assets prives dans `public/private-assets/characters/` ne sont pas inclus. Seuls les chemins/references stockes dans les donnees sont exportes.

## Tables importees

L'import complet remplace les memes tables :

- `player`
- `playerCharacters`
- `quizProgress`
- `gachaHistory`
- `unlockedBadges`
- `unlockedTitles`
- `settings`
- `installedPacks`

Apres import, les stores Zustand sont recharges depuis Dexie :

- joueur ;
- collection ;
- historique gacha ;
- progression quiz ;
- badges ;
- titres ;
- preferences UI.

## Validation JSON

La validation verifie :

- JSON lisible ;
- presence d'un objet `metadata` ;
- `metadata.appName === "GuildQuest"` ;
- `backupVersion` numerique ;
- presence d'un objet `data` ;
- presence de tableaux pour les tables attendues.

Un fichier invalide affiche un message clair et n'est pas importe.

Avant import, une confirmation navigateur demande :

`Cette action remplacera ta progression locale actuelle. Continuer ?`

## Reset local

Le reset complet :

- vide les tables GuildQuest ;
- recree le joueur `leb` ;
- niveau 1 ;
- XP 0 ;
- gemmes 200 ;
- rang `Mage de Rang F` ;
- restaure les titres par defaut ;
- restaure les parametres par defaut.

L'app recharge les stores apres reset et revient au Hall.

## Parametres

L'ecran `Parametres` affiche :

- pseudo ;
- rang ;
- niveau ;
- version app ;
- sons actives/desactives ;
- animations activees/desactivees ;
- vitesse animations : normale, rapide, reduite ;
- acces Import / Export ;
- zone danger pour reset complet ;
- rappel offline/local.

Les preferences sont persistees dans la table Dexie `settings`.

## README

Ajout d'une section `Sauvegarde et restauration` :

- export JSON ;
- import JSON ;
- reset local ;
- assets prives non inclus ;
- recommandation d'export avant changement majeur ou voyage.

## Commandes executees

- lectures des fichiers stores, App, db, README et modeles
- `npm run build`
- `npm run lint`
- `npm run dev -- --host 127.0.0.1`
- `git status --short`

## Resultat de `npm run build`

OK.

Le build production Vite passe.

Avertissement restant :

- certains chunks depassent 500 kB apres minification.
- avertissement non bloquant deja connu.

## Resultat de `npm run lint`

OK.

Un premier lint a signale `react-hooks/set-state-in-effect` dans `App.tsx`. Le rechargement initial est maintenant decale via `setTimeout`, puis le lint est repasse sans erreur.

## Resultat de `npm run dev`

OK pour le demarrage.

Vite annonce :

- `VITE v8.0.16 ready`
- `Local: http://127.0.0.1:5173/`

La commande a ete arretee par timeout volontaire apres quelques secondes, car le serveur de dev reste ouvert en continu.

## Limites eventuelles

- Export partiel progression/collection non implemente pour cette etape.
- Le reset partiel quiz ou gacha n'est pas encore separe : seul le reset complet est implemente.
- Les images privees ne sont pas exportees, volontairement.
- La verification visuelle navigateur integre n'a pas ete effectuee dans cette tache.

## Points a verifier manuellement

- Ouvrir le Hall.
- Aller dans `Parametres`.
- Changer sons/animations/vitesse et verifier la persistance apres refresh.
- Ouvrir `Import / Export`.
- Exporter un JSON complet.
- Verifier que le fichier contient metadata et data.
- Importer une sauvegarde valide et confirmer.
- Tenter un JSON invalide et verifier le message d'erreur.
- Faire un reset complet.
- Verifier que `leb` revient niveau 1, XP 0, 200 gemmes.
- Verifier que Missions, Gacha, Collection, Carte, Profil restent utilisables apres import/reset.

## Prochaine etape recommandee

Ajouter des exports partiels `progression seulement` et `collection seulement`, puis un ecran d'inspection de sauvegarde plus detaille avant import.
