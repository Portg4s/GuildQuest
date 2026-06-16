# CODEX_REPORT

Date : 17 juin 2026

## Resume

Les images personnages ont ete remises dans la version publique GitHub Pages.

Changements effectues :

- `public/private-assets/` n'est plus ignore par Git ;
- les 44 images `.webp` de `public/private-assets/characters/` sont de nouveau ajoutees a l'index Git ;
- `src/data/characters/characters.public-pack.ts` a ete recree ;
- `src/data/characters/characters.registry.ts` recharge le pack public versionne ;
- `vite.config.ts` reinclut les `.webp` dans le build/PWA ;
- le nettoyage `dist/private-assets` en mode Pages a ete retire ;
- `src/data/characters/characters.local.ts` reste ignore et n'a pas ete modifie.

Aucun commit et aucun push effectues.
Aucune image n'a ete modifiee sur le disque.
Aucun asset n'a ete telecharge.

## Fichiers modifies

- `.gitignore`
- `CODEX_RULES.md`
- `PRIVATE_ASSETS_GUIDE.md`
- `README.md`
- `src/data/characters/characters.public-pack.ts`
- `src/data/characters/characters.registry.ts`
- `src/features/settings/SettingsScreen.tsx`
- `vite.config.ts`
- `CODEX_REPORT.md`

## Pack public

Le fichier suivant est de nouveau present :

```txt
src/data/characters/characters.public-pack.ts
```

Il expose un pack public versionne :

- `Fairy Tail Public Pack` ;
- 44 personnages ;
- chemins d'images vers `/private-assets/characters/*.webp` ;
- `replacePlaceholders: true`.

En build GitHub Pages, `CharacterImage` resout ces chemins avec la base Vite `/GuildQuest/`, donc les images sont demandees sous :

```txt
/GuildQuest/private-assets/characters/...
```

## Images

Verification apres `npm run build:pages` :

- `dist/private-assets/characters/natsu-dragneel.webp` existe ;
- `dist/private-assets/characters/` contient 44 fichiers ;
- le precache PWA contient 71 entrees.

## Fichiers locaux ignores

Verification :

```bash
git status --short --ignored src\data\characters\characters.local.ts public\private-assets
```

Resultat :

```txt
A  public/private-assets/characters/...
!! src/data/characters/characters.local.ts
```

Conclusion :

- les images sont bien remises dans Git ;
- `characters.local.ts` reste ignore ;
- le fichier local prive n'a pas ete touche.

## Commandes executees

- `git add public/private-assets src/data/characters/characters.public-pack.ts`
- `npm run lint`
- `npm run build`
- `npm run build:pages`
- `git status --short`
- `git status --short --ignored src\data\characters\characters.local.ts public\private-assets`

## Resultat lint

OK.

## Resultat build

OK.

Note :

- avertissement Vite non bloquant : chunk principal superieur a 500 kB apres minification.

## Resultat build Pages

OK.

Details :

- manifest compatible `/GuildQuest/` ;
- images `.webp` incluses ;
- `dist/private-assets/characters/` contient 44 fichiers ;
- avertissement Vite non bloquant : chunk principal superieur a 500 kB apres minification.

## Etat Git notable

Les images apparaissent maintenant comme ajoutees :

```txt
A  public/private-assets/characters/acnologia.webp
A  public/private-assets/characters/...
A  src/data/characters/characters.public-pack.ts
```

`src/data/characters/characters.local.ts` reste ignore :

```txt
!! src/data/characters/characters.local.ts
```

## Points a verifier manuellement

- Apres push/deploiement GitHub Pages, vider le cache de la PWA ou faire un hard refresh.
- Ouvrir Collection.
- Verifier que les requetes pointent vers `/GuildQuest/private-assets/characters/*.webp`.
- Verifier que les 404 d'images ont disparu.

## Prochaine etape recommandee

Committer les changements avec les images remises dans l'index, puis pousser pour redeployer GitHub Pages.
