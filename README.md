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
Pour declarer des personnages locaux, copier `src/data/characters/characters.local.template.ts` vers `src/data/characters/characters.local.ts`.
Ce fichier local est ignore par Git. Si une image privee est absente, l'interface utilise automatiquement le placeholder du personnage.

## Offline / PWA

La V1 ne prevoit aucun backend. Les donnees locales sont destinees a IndexedDB via Dexie, et la configuration PWA est preparee avec `vite-plugin-pwa`.
