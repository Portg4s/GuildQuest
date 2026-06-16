# CODEX_REPORT

Date : 17 juin 2026

## Resume

Changement applique suite a la decision de publier les images sur GitHub Pages :

- `public/private-assets/` n'est plus ignore par Git ;
- les 44 images `.webp` presentes dans `public/private-assets/characters/` sont maintenant candidates au suivi Git ;
- `src/data/characters/characters.local.ts` reste ignore par Git ;
- un pack public versionne a ete ajoute pour que GitHub Pages charge les personnages avec les vraies images ;
- les URLs d'images sont maintenant compatibles avec la base `/GuildQuest/` ;
- la PWA Pages inclut les `.webp` dans le precache ;
- la documentation a ete ajustee pour distinguer assets publiables et fichier local ignore.

Aucun commit et aucun push effectues.
Aucune image n'a ete modifiee.
Aucun asset n'a ete telecharge.

## Fichiers crees

- `src/data/characters/characters.public-pack.ts`

## Fichiers modifies

- `.gitignore`
- `CODEX_RULES.md`
- `PRIVATE_ASSETS_GUIDE.md`
- `README.md`
- `src/components/game/CharacterImage.tsx`
- `src/data/characters/characters.registry.ts`
- `src/features/settings/SettingsScreen.tsx`
- `vite.config.ts`
- `CODEX_REPORT.md`

## Images GitHub Pages

Le dossier suivant n'est plus ignore :

```txt
public/private-assets/
```

Verification :

```bash
git status --short --ignored src\data\characters\characters.local.ts public\private-assets
```

Resultat :

```txt
?? public/private-assets/
!! src/data/characters/characters.local.ts
```

Conclusion :

- les images peuvent maintenant etre ajoutees au prochain commit ;
- `characters.local.ts` reste bien ignore ;
- le repo public inclura les images si `public/private-assets/` est ajoute et pousse.

## Pack personnages public

Nouveau fichier :

```txt
src/data/characters/characters.public-pack.ts
```

Il expose un pack public versionne :

- `Fairy Tail Public Pack` ;
- 44 personnages ;
- chemins d'images vers `/private-assets/characters/*.webp` ;
- `replacePlaceholders: true`.

Le registry charge maintenant :

1. le pack public versionne ;
2. puis `characters.local.ts` s'il existe localement.

Si `characters.local.ts` existe et demande `replacePlaceholders: true`, il garde la priorite en local. Sur GitHub Pages, le fichier local ignore n'existe pas, donc le pack public est utilise.

## Correction des URLs sous `/GuildQuest/`

`CharacterImage` transforme maintenant les chemins publics absolus comme :

```txt
/private-assets/characters/natsu-dragneel.webp
```

en chemin compatible avec la base Vite :

```txt
/GuildQuest/private-assets/characters/natsu-dragneel.webp
```

Cela corrige les 404 vus dans la console GitHub Pages, ou le navigateur demandait auparavant :

```txt
https://portg4s.github.io/private-assets/...
```

au lieu de :

```txt
https://portg4s.github.io/GuildQuest/private-assets/...
```

## PWA

`vite.config.ts` ne nettoie plus `dist/private-assets` en mode Pages.

Le precache Workbox inclut maintenant les `.webp` :

```txt
globPatterns: ["**/*.{js,css,html,svg,ico,png,webp,json}"]
```

Apres `npm run build:pages` :

- `dist/private-assets/characters/natsu-dragneel.webp` existe ;
- `dist/private-assets/characters/` contient 44 fichiers ;
- `manifest.webmanifest` garde `start_url: "/GuildQuest/"` et `scope: "/GuildQuest/"`.

## Documentation

Mises a jour :

- `CODEX_RULES.md` indique que `public/private-assets/` peut etre versionne si l'utilisateur demande explicitement une publication publique.
- `README.md` explique que les assets peuvent etre publies s'ils sont ajoutes au suivi Git.
- `PRIVATE_ASSETS_GUIDE.md` distingue le fichier local ignore des assets publiables.
- `Parametres > Installation via GitHub Pages` indique que les images dans `public/private-assets` peuvent etre incluses dans la version publique.

## Commandes executees

- `npm run lint`
- `npm run build`
- `npm run build:pages`
- `git status --short`
- `git status --short --ignored src\data\characters\characters.local.ts public\private-assets`

## Resultat lint

OK.

Commande :

```bash
npm run lint
```

Resultat :

- aucune erreur ESLint.

## Resultat build

OK.

Commande :

```bash
npm run build
```

Resultat :

- build TypeScript + Vite reussi ;
- PWA generee ;
- avertissement non bloquant : chunk JS superieur a 500 kB apres minification.

## Resultat build Pages

OK.

Commande :

```bash
npm run build:pages
```

Resultat :

- build Vite en mode `pages` reussi ;
- 44 images `.webp` presentes dans `dist/private-assets/characters/` ;
- precache PWA : 55 entrees ;
- avertissement non bloquant : chunk JS superieur a 500 kB apres minification.

## Resultat Git

Commande :

```bash
git status --short
```

Resultat :

```txt
 M .gitignore
 M CODEX_RULES.md
 M PRIVATE_ASSETS_GUIDE.md
 M README.md
 M src/components/game/CharacterImage.tsx
 M src/data/characters/characters.registry.ts
 M src/features/settings/SettingsScreen.tsx
 M vite.config.ts
?? public/private-assets/
?? src/data/characters/characters.public-pack.ts
```

Note : `CODEX_REPORT.md` est egalement modifie par cette mise a jour.

## Points a verifier manuellement

- Avant commit, verifier que tu acceptes bien de publier les 44 images dans `public/private-assets/characters/`.
- Apres push/deploiement Pages, vider le cache ou recharger fort la PWA si l'ancien service worker garde les anciens assets.
- Ouvrir `https://portg4s.github.io/GuildQuest/`.
- Verifier Collection, Gacha, Detail personnage et Hall.
- Confirmer que les URLs reseau pointent vers `/GuildQuest/private-assets/characters/*.webp`.

## Prochaine etape recommandee

Quand tu es pret a publier, ajouter les fichiers publics au commit, notamment :

```bash
git add public/private-assets src/data/characters/characters.public-pack.ts
```

Puis commit/push depuis ton environnement. Je n'ai pas fait de commit ni de push.
