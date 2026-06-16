# CODEX_REPORT

Date : 16 juin 2026

## Resume

Ajout d'un ecran d'introduction au lancement de GuildQuest.

L'app affiche maintenant une courte entree de guilde avant d'arriver sur le Hall :

- embleme GuildQuest original en CSS ;
- titre `GuildQuest` ;
- textes d'ambiance ;
- particules/runes CSS legeres ;
- barre de progression animee ;
- transition fluide vers l'app.

## Fichiers crees

- `src/features/splash/SplashScreen.tsx`

## Fichiers modifies

- `src/app/App.tsx`
- `src/domain/models/GameSettings.ts`
- `src/storage/repositories/settings.repository.ts`
- `src/stores/ui.store.ts`
- `src/features/settings/SettingsScreen.tsx`
- `CODEX_REPORT.md`

## Comportement au demarrage

Au lancement :

1. `SplashScreen` s'affiche en plein ecran.
2. L'app continue de charger les donnees locales Dexie/Zustand en arriere-plan.
3. Le splash se ferme automatiquement.
4. Le Hall apparait normalement.

Durees appliquees :

- intro desactivee : environ 120 ms ;
- animations desactivees : environ 260 ms ;
- vitesse rapide : environ 900 ms ;
- vitesse reduite : environ 650 ms ;
- vitesse normale : environ 1500 ms.

## Respect des preferences animations

La preference `showIntroSplash` a ete ajoutee a `GameSettings` et au `ui.store`.

Dans Parametres, un toggle permet maintenant de controler :

- `Ecran d'introduction`

Si les animations sont desactivees ou reduites :

- les particules sont limitees ou absentes ;
- la duree est plus courte ;
- l'ecran reste sobre.

## Integration technique

- `App.tsx` utilise `AnimatePresence` pour afficher/retirer le splash proprement.
- Le splash ne modifie pas la navigation.
- Dexie, import/export, reset, gacha, collection, missions et quiz ne sont pas touches dans leur logique.
- Les parametres existants sont normalises avec une valeur par defaut `showIntroSplash: true`.

## Commandes executees

- `npm run lint`
- `npm run build`
- `npm run dev -- --host 127.0.0.1`

## Resultat de `npm run lint`

OK.

Aucune erreur et aucun avertissement ESLint.

## Resultat de `npm run build`

OK.

Le build production Vite passe.

Avertissement restant non bloquant :

- certains chunks depassent 500 kB apres minification.

## Resultat de `npm run dev`

OK pour le demarrage.

Vite a annonce :

- `VITE v8.0.16 ready`
- `Local: http://127.0.0.1:5173/`

La commande a ete arretee par timeout apres quelques secondes, car le serveur reste ouvert en continu.

## Points a verifier manuellement

- Recharger l'app et verifier que le splash apparait avant le Hall.
- Verifier que le Hall apparait automatiquement sans clic.
- Aller dans Parametres et desactiver `Ecran d'introduction`.
- Recharger et verifier que l'intro passe presque immediatement.
- Tester animations `rapide` et `reduite`.
- Verifier Missions, Quiz, Gacha, Collection, Import/Export et Reset apres l'ajout.

## Limites eventuelles

- Pas de son ni vibration.
- Pas de bouton skip, car la duree reste courte.
- Pas de verification navigateur visuelle automatisee dans cette tache.

## Prochaine etape recommandee

Ajouter plus tard une option de splash saisonnier ou de phrase d'accueil aleatoire liee au rang du joueur.
