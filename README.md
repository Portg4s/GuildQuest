# GuildQuest

GuildQuest est une PWA personnelle offline-first pour apprendre le developpement web avec une boucle de jeu inspiree des guildes RPG : missions, quiz, XP, gemmes, rangs, badges, titres, gacha et collection de personnages.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand
- Dexie.js / IndexedDB
- vite-plugin-pwa
- ESLint

## Lancement local

```bash
npm install
npm run dev
```

Pour tester sur telephone sur le meme Wi-Fi :

```bash
npm run dev -- --host 0.0.0.0
```

Ouvrir ensuite `http://IP_DU_PC:5173` sur le telephone.

Build de verification :

```bash
npm run build
```

Lint :

```bash
npm run lint
```

## Assets prives

Les assets sous `public/private-assets/` sont reserves a un usage local et doivent rester hors Git. Utiliser des placeholders generiques dans le repo public.

Les images de personnages privees peuvent etre placees localement dans `public/private-assets/characters/`.
Pour declarer des personnages locaux, copier `src/data/characters/characters.local.example.ts` vers `src/data/characters/characters.local.ts`.
Ce fichier local est ignore par Git. Si une image privee est absente, l'interface utilise automatiquement le placeholder du personnage.

Voir aussi `PRIVATE_ASSETS_GUIDE.md` pour les formats recommandes, les chemins a utiliser et les precautions avant commit.

## Offline / PWA

La V1 ne prevoit aucun backend. Les donnees locales sont destinees a IndexedDB via Dexie, et la configuration PWA est preparee avec `vite-plugin-pwa`.

## Sauvegarde et restauration

GuildQuest stocke les donnees localement dans IndexedDB. Depuis `Parametres > Import / Export`, il est possible de generer une sauvegarde JSON complete puis de la restaurer plus tard.

L'export JSON inclut notamment le joueur, la progression quiz, la collection, l'historique gacha, les badges, les titres, les preferences et les packs installes si presents.

Les assets prives dans `public/private-assets/characters/` ne sont pas inclus dans les sauvegardes. Seuls les chemins/references sont conserves.

Avant un changement majeur, un reset local ou un voyage, il est recommande d'exporter un fichier `guildquest-backup-YYYY-MM-DD-HH-mm.json`.

L'import remplace les donnees locales apres confirmation. Le reset local remet le joueur `leb` au niveau 1 avec 0 XP, 200 gemmes et le rang `Mage de Rang F`.

## Installation telephone / PWA

Dans `Parametres > Installer sur telephone`, GuildQuest affiche une aide pour copier l'URL locale.

- Android / Chrome : menu puis `Ajouter a l'ecran d'accueil`.
- iPhone / Safari : bouton Partager puis `Sur l'ecran d'accueil`.

Pour un usage personnel avec assets prives, rester sur le reseau local ou un environnement prive.

Attention : si `public/private-assets/` contient des images privees, elles peuvent etre copiees dans `dist` lors du build. Ne publie pas `dist` avec des assets prives. Pour un deploiement public, retire les assets prives ou utilise seulement les placeholders.

## Deploiement GitHub Pages

Le repo public cible est `Portg4s/GuildQuest` et l'URL attendue est :

```text
https://portg4s.github.io/GuildQuest/
```

Le workflow `.github/workflows/deploy-pages.yml` construit l'app avec :

```bash
npm run build:pages
```

Ce mode utilise la base Vite `/GuildQuest/`, afin que les assets, le manifest PWA et le service worker restent compatibles avec GitHub Pages.

Pour activer le deploiement :

1. Ouvrir le repo sur GitHub.
2. Aller dans `Settings > Pages`.
3. Choisir `Source: GitHub Actions`.
4. Pousser sur `main` ou lancer le workflow manuellement.

La version GitHub Pages est publique et ne doit contenir que les fichiers versionnes du repo. Les fichiers locaux suivants restent exclus :

- `public/private-assets/`
- `src/data/characters/characters.local.ts`

La version publique utilise donc les placeholders generiques. Pour une version locale privee avec images personnelles, utiliser `npm run dev -- --host 0.0.0.0` sur le reseau local ou un environnement prive.

Sur telephone, ouvrir `https://portg4s.github.io/GuildQuest/`, puis installer la PWA :

- iPhone / Safari : Partager puis `Sur l'ecran d'accueil`.
- Android / Chrome : menu puis `Ajouter a l'ecran d'accueil`.

Les donnees de jeu restent stockees localement sur l'appareil via IndexedDB. Il est recommande d'exporter un JSON avant changement majeur, reset ou changement de telephone.
