# CODEX_REPORT

Date : 16 juin 2026

## Resume

Ajout d'une cinematique gacha plein ecran pour transformer l'invocation en experience plus proche d'un jeu mobile :

- overlay plein ecran ;
- sequence de suspense ;
- effets visuels selon la meilleure rarete obtenue ;
- revelation x1 ou x10 ;
- bouton `Passer` ;
- bouton `Reveler maintenant` ;
- carte personnage premium ;
- resume post-invocation enrichi.

La logique metier de tirage, la deduction des gemmes, les doublons, la poussiere magique, la collection, Dexie et Zustand n'ont pas ete changes en profondeur.

## Fichiers crees

- `src/components/game/rarity-effects.ts`
- `src/components/game/PremiumCharacterCard.tsx`
- `src/features/gacha/GachaCinematic.tsx`

## Fichiers modifies

- `src/features/gacha/GachaScreen.tsx`
- `src/app/App.tsx`
- `CODEX_REPORT.md`

## Comportement invocation x1

- Apres une invocation x1 reussie, une cinematique plein ecran s'ouvre si les animations sont activees.
- La sequence affiche :
  - reveil des runes ;
  - aura selon la rarete obtenue ;
  - carte revelee ;
  - nom du personnage ;
  - rarete ;
  - element ;
  - puissance ;
  - statut `Nouveau !` ou `Doublon`.
- En cas de doublon, les fragments et la poussiere magique gagnes sont affiches.
- Le bouton `Passer` permet de fermer la cinematique et d'afficher le resume.

## Comportement invocation x10

- L'intro utilise la meilleure rarete presente dans les 10 tirages.
- La revelation affiche les 10 cartes en grille responsive.
- Le resume indique :
  - nombre total de personnages ;
  - nouveaux personnages ;
  - doublons ;
  - fragments gagnes ;
  - poussiere gagnee ;
  - meilleure rarete obtenue.
- Les boutons `Refaire x1`, `Refaire x10`, `Collection` et `Hall` sont disponibles apres le tirage.

## Effets selon rarete

Les effets sont centralises dans `src/components/game/rarity-effects.ts`.

- COMMON : aura sobre, glow discret.
- RARE : bleu/turquoise, effet plus vif.
- EPIC : violet/fuchsia, pulse plus marque.
- LEGENDARY : dore/orange, flash plus intense.
- MYTHIC : rose/arcane, aura la plus visible.

## Carte personnage premium

`PremiumCharacterCard` affiche :

- image via `CharacterImage` avec fallback placeholder ;
- nom ;
- rarete ;
- element ;
- puissance ;
- statut nouveau/doublon ;
- fragments et poussiere en cas de doublon ;
- style selon rarete.

## Respect des preferences animations

- Si les animations sont desactivees, la longue cinematique n'est pas jouee et le resume s'affiche directement.
- Si la vitesse est `fast`, les delais de cinematique sont raccourcis.
- Si la vitesse est `reduced`, les particules sont desactivees et les animations sont plus sobres.

## Ecran Invocation

L'ecran a ete enrichi sans refonte totale :

- zone banniere active generique ;
- autel plus premium ;
- gemmes et poussiere mises en avant ;
- boutons x1/x10 differencies ;
- taux de rarete dans un bloc compact repliable ;
- resume post-invocation compact.

## Limites eventuelles

- Pas de son ni vibration pour cette etape.
- Pas encore de vraie cinematique differente image par image pour chaque rarete.
- Pas de verification visuelle navigateur integre avec capture, seulement demarrage Vite confirme.
- Le bundle Vite depasse toujours 500 kB, avertissement non bloquant deja connu.

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

- Faire une invocation x1 avec animations activees.
- Tester le bouton `Passer`.
- Tester `Reveler maintenant`.
- Faire une invocation x10.
- Verifier que la meilleure rarete influence l'aura.
- Verifier l'affichage des doublons, fragments et poussiere.
- Desactiver les animations dans Parametres puis refaire une invocation.
- Tester la vitesse `rapide` et `reduite`.
- Verifier que Collection, personnage actif et persistance restent corrects apres refresh.

## Prochaine etape recommandee

Ajouter une vraie banniere gacha locale configurable avec pity soft/hard optionnel et historique detaille des invocations.
