# CODEX_REPORT

Date : 16 juin 2026

## Resume

Preparation de GuildQuest pour un deploiement public GitHub Pages propre :

- configuration Vite compatible avec `https://portg4s.github.io/GuildQuest/` ;
- ajout d'un build dedie `npm run build:pages` ;
- creation du workflow GitHub Actions Pages ;
- ajustement PWA pour `start_url` et `scope` sous `/GuildQuest/` en mode Pages ;
- nettoyage automatique de `dist/private-assets` dans le build Pages local ;
- ajout d'une aide `Installation via GitHub Pages` dans Parametres ;
- mise a jour du README avec les etapes GitHub Pages et les avertissements assets prives.

Aucun commit et aucun push effectues.
Aucun asset telecharge.
Aucune image privee modifiee.

## Fichiers crees

- `.github/workflows/deploy-pages.yml`

## Fichiers modifies

- `README.md`
- `package.json`
- `src/features/settings/SettingsScreen.tsx`
- `vite.config.ts`
- `CODEX_REPORT.md`

## Configuration Vite / GitHub Pages

`vite.config.ts` utilise maintenant une base conditionnelle :

- dev local et `npm run build` : `base: "/"` ;
- build GitHub Pages avec `npm run build:pages` : `base: "/GuildQuest/"`.

Le manifest PWA genere en mode Pages contient :

- `start_url: "/GuildQuest/"` ;
- `scope: "/GuildQuest/"`.

Les icones du manifest utilisent des chemins relatifs pour rester compatibles avec le sous-chemin GitHub Pages.

Un petit plugin Vite local supprime `dist/private-assets` uniquement en mode `pages`. Cela ne touche pas au dossier source `public/private-assets/`, mais evite de laisser une copie privee dans l'artefact Pages genere localement.

## Workflow GitHub Actions

Workflow cree :

```txt
.github/workflows/deploy-pages.yml
```

Declencheurs :

- push vers `main` ;
- push vers `master` ;
- lancement manuel `workflow_dispatch`.

Etapes principales :

- checkout ;
- setup Node 22 ;
- `npm ci` si `package-lock.json` existe, sinon `npm install` ;
- `npm run lint` ;
- `npm run build:pages` ;
- `actions/configure-pages` ;
- `actions/upload-pages-artifact` ;
- `actions/deploy-pages`.

Permissions configurees :

- `contents: read` ;
- `pages: write` ;
- `id-token: write`.

## Protection des fichiers prives

`.gitignore` couvre deja :

- `/public/private-assets/`
- `/src/data/characters/characters.local.ts`

Verification executee :

```bash
git status --short --ignored src\data\characters\characters.local.ts public\private-assets
```

Resultat :

```txt
!! public/private-assets/
!! src/data/characters/characters.local.ts
```

Conclusion :

- `public/private-assets/` reste ignore par Git ;
- `src/data/characters/characters.local.ts` reste ignore par Git ;
- ces fichiers n'apparaissent pas dans les fichiers publics a deployer.

## README / Parametres

README mis a jour avec :

- section `Deploiement GitHub Pages` ;
- URL attendue `https://portg4s.github.io/GuildQuest/` ;
- activation GitHub Pages via `Settings > Pages > Source: GitHub Actions` ;
- distinction version locale privee / version publique ;
- avertissement sur les assets prives ;
- installation mobile depuis l'URL GitHub Pages.

Parametres contient maintenant une section `Installation via GitHub Pages` avec :

- URL publique prevue ;
- instructions iPhone/Safari ;
- instructions Android/Chrome ;
- rappel que les images privees locales ne sont pas publiees ;
- rappel IndexedDB et export JSON.

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
- `dist/index.html` reference les assets sous `/GuildQuest/` ;
- `dist/manifest.webmanifest` contient `start_url` et `scope` sous `/GuildQuest/` ;
- `dist/private-assets` absent apres nettoyage Pages ;
- avertissement non bloquant : chunk JS superieur a 500 kB apres minification.

## Resultat git status

Commande :

```bash
git status --short
```

Resultat :

```txt
 M README.md
 M package.json
 M src/features/settings/SettingsScreen.tsx
 M vite.config.ts
?? .github/
```

Note : `CODEX_REPORT.md` est egalement modifie par cette mise a jour de rapport.

## Etapes manuelles GitHub restantes

Sur GitHub :

1. Ouvrir `Portg4s/GuildQuest`.
2. Aller dans `Settings > Pages`.
3. Choisir `Source: GitHub Actions`.
4. Pousser les changements publics quand tu voudras declencher le workflow.
5. Verifier l'URL publiee : `https://portg4s.github.io/GuildQuest/`.

## Limites / points d'attention

- `npm run build` local conserve le comportement Vite standard et peut copier `public/private-assets` dans `dist` si des assets prives existent.
- `npm run build:pages` nettoie `dist/private-assets` pour l'artefact Pages.
- Le workflow GitHub Actions ne voit normalement pas les fichiers ignores, donc le deploiement public utilise les placeholders publics.
- Le warning de chunk > 500 kB reste a traiter plus tard par code splitting si necessaire.

## Points a verifier manuellement

- Activer GitHub Pages en mode GitHub Actions.
- Apres deploiement, ouvrir `https://portg4s.github.io/GuildQuest/`.
- Verifier l'installation PWA sur iPhone/Safari et Android/Chrome.
- Verifier que la version publique affiche les placeholders sans dependance aux personnages prives.
- Verifier que l'import/export IndexedDB fonctionne encore sur la version Pages.

## Prochaine etape recommandee

Apres le premier deploiement Pages, tester l'installation PWA sur telephone puis ajouter du code splitting sur les gros ecrans/features si le poids du bundle devient genant.
