# CODEX_REPORT

Date : 16 juin 2026

## Resume general

Phase "jeu mobile premium" effectuee sur GuildQuest :

- meilleur rendu des vraies images locales dans les cartes personnages ;
- cartes gacha plus grandes et plus visuelles ;
- collection et detail personnage plus premium ;
- ajout du mode `Duel de guilde` offline V1 ;
- ajout d'une aide d'installation telephone/PWA dans Parametres ;
- amelioration de la configuration PWA ;
- creation d'une icone GuildQuest originale en SVG.

Aucune dependance ajoutee. Aucun asset telecharge. Aucun fichier prive n'a ete ajoute au suivi Git.

## Fichiers crees

- `src/features/duel/DuelScreen.tsx`
- `public/icons/guildquest-icon.svg`

## Fichiers modifies

- `README.md`
- `src/app/App.tsx`
- `src/components/game/CharacterImage.tsx`
- `src/components/game/PremiumCharacterCard.tsx`
- `src/domain/models/Player.ts`
- `src/features/character-detail/CharacterDetailScreen.tsx`
- `src/features/collection/CollectionScreen.tsx`
- `src/features/home/HomeScreen.tsx`
- `src/features/profile/ProfileScreen.tsx`
- `src/features/settings/SettingsScreen.tsx`
- `src/stores/player.store.ts`
- `vite.config.ts`
- `CODEX_REPORT.md`

## Ameliorations cartes personnages

`CharacterImage` :

- ajoute `loading="lazy"` par defaut ;
- ajoute `decoding="async"` ;
- ajoute `draggable={false}` ;
- applique un cadrage `object-cover` ;
- conserve le fallback magique CSS si une image manque.

`PremiumCharacterCard` :

- image beaucoup plus grande ;
- frame et aura selon rarete ;
- meilleur cadrage portrait ;
- overlay sombre bas de carte ;
- nom plus lisible ;
- badges `Nouveau !` / `Doublon` conserves ;
- fragments et poussiere conserves.

## Collection

- cartes collection plus visuelles ;
- images plus grandes ;
- grille mobile/desktop plus dense ;
- rarete plus presente ;
- cartes verrouillees conservees en version sobre ;
- section `Personnages locaux indisponibles` conservee mais discrete.

## Detail personnage

- grande image type fiche de carte ;
- frame rarete ;
- puissance, element et fragments conserves ;
- affichage de `quote` si disponible ;
- affichage des `tags` si disponibles ;
- bouton definir actif conserve ;
- fallback image conserve.

## Hall et Profil

- bouton `Duel` ajoute dans la grille d'actions du Hall.
- personnage actif affiche avec une image plus haute et plus lisible.
- Profil affiche maintenant :
  - duels joues ;
  - duels gagnes.

## Ameliorations gacha

La logique gacha n'a pas ete modifiee.

Effets conserves :

- x1 ;
- x10 ;
- skip ;
- reveler maintenant ;
- doublons ;
- fragments ;
- poussiere ;
- resume post-invocation ;
- respect des preferences animations.

Les cartes revelees utilisent maintenant le nouveau rendu premium, donc les vraies images locales ressortent mieux dans la cinematique et le resume.

## Card Game V1

Nouvel ecran :

```txt
src/features/duel/DuelScreen.tsx
```

Acces :

- Hall > bouton `Duel`.

Regles V1 :

- equipe automatique avec les 3 personnages possedes les plus puissants ;
- si moins de 3 personnages possedes, message d'arene verrouillee et bouton vers Invocation ;
- adversaires locaux :
  - Apprenti vagabond ;
  - Mage errant ;
  - Gardien des runes.
- combat 3v3 simplifie ;
- actions :
  - Attaque ;
  - Technique ;
  - Defense.
- changement automatique de carte quand une carte tombe a 0 HP ;
- victoire si les 3 cartes adverses sont KO ;
- defaite si les 3 cartes joueur sont KO.

## Recompenses Duel

Recompenses modestes :

- Facile : 20 XP / 5 gemmes ;
- Moyen : 40 XP / 10 gemmes ;
- Difficile : 75 XP / 20 gemmes ;
- Defaite : 8 XP / 0 gemme.

Les recompenses sont appliquees au joueur et sauvegardees via `savePlayer`.

Compteurs ajoutes au joueur :

- `duelStats.played`
- `duelStats.won`

Pas de table Dexie dediee ni historique detaille pour l'instant.

## PWA / Telephone

`vite.config.ts` :

- description manifest mise a jour ;
- `theme_color` et `background_color` harmonises ;
- `orientation: portrait` conserve ;
- `start_url: "/"` conserve ;
- `scope: "/"` ajoute ;
- icone originale SVG ajoutee au manifest ;
- `private-assets` exclu du precache Workbox.

Icone publique originale creee :

```txt
public/icons/guildquest-icon.svg
```

Aucun PNG n'a ete genere pour cette etape afin d'eviter d'ajouter un outil ou une dependance. Le manifest accepte l'icone SVG avec `sizes: "any"` et `purpose: "any maskable"`.

## Installation telephone

Parametres contient maintenant une section `Installer sur telephone` :

- instructions pour `npm run dev -- --host 0.0.0.0` ;
- explication IP locale ;
- Android/Chrome : Ajouter a l'ecran d'accueil ;
- iPhone/Safari : Sur l'ecran d'accueil ;
- champ pour entrer l'IP locale ;
- URL generee ;
- bouton pour copier l'URL ;
- avertissement sur les assets prives.

README mis a jour avec :

- lancement mobile local ;
- installation PWA ;
- avertissement `dist` et assets prives.

## Dependances ajoutees

Aucune.

Pas de `tsParticles`, pas de GSAP, pas de nouvelle bibliotheque.

## Commandes executees

- `npm run lint`
- `npm run build`
- `npm run dev -- --host 127.0.0.1`
- `git status --short`
- `git status --short --ignored src\data\characters\characters.local.ts public\private-assets`

## Resultat lint

OK.

Aucune erreur et aucun avertissement ESLint.

## Resultat build

OK.

Le build production Vite passe.

Avertissement restant non bloquant :

- certains chunks depassent 500 kB apres minification.

PWA :

- precache reduit a 11 entrees ;
- `private-assets` exclu du precache Workbox.

Note :

- Vite peut toujours copier le contenu de `public/` dans `dist` pendant un build local ;
- ne pas publier un build `dist` contenant des assets prives.

## Resultat dev

OK pour le demarrage.

Vite annonce :

- `VITE v8.0.16 ready`
- `Local: http://127.0.0.1:5173/`

La commande a ete arretee par timeout car le serveur reste ouvert.

## Resultat Git

`git status --short` affiche uniquement des fichiers publics/committables modifies ou crees :

- README ;
- code source ;
- config PWA ;
- icone publique originale ;
- rapport.

Verification explicite des ignores :

```bash
git status --short --ignored src\data\characters\characters.local.ts public\private-assets
```

Resultat :

```txt
!! public/private-assets/
!! src/data/characters/characters.local.ts
```

Conclusion :

- `public/private-assets/` n'est pas suivi par Git ;
- `src/data/characters/characters.local.ts` n'est pas suivi par Git ;
- les fichiers prives restent ignores.

## Limites eventuelles

- Duel V1 utilise une equipe automatique seulement.
- Pas de selection manuelle de deck pour cette etape.
- Pas d'historique duel Dexie detaille.
- Pas de QR code pour l'installation telephone, seulement URL copiable.
- Pas d'icones PNG PWA generees, uniquement SVG originale.
- Pas de verification visuelle navigateur automatisee.

## Points a verifier manuellement

- Hall : bouton Duel visible et compact.
- Duel avec moins de 3 personnages : message et bouton Invocation.
- Duel avec au moins 3 personnages : combat jouable.
- Recompense Duel : XP/gemmes et stats profil.
- Collection : rendu des vraies images.
- Detail personnage : quote/tags/images.
- Gacha x1/x10 : cinematique et resume.
- Parametres : section Installer sur telephone.
- PWA : manifest et installation depuis mobile sur meme Wi-Fi.
- Verifier avant commit que les assets prives restent ignores.

## Prochaine etape recommandee

Ajouter une selection manuelle d'equipe de Duel et un petit historique Dexie `duelHistory`, puis generer des PNG PWA originaux 192/512 si une pipeline locale d'images est ajoutee.
