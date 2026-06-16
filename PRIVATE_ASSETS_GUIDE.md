# PRIVATE_ASSETS_GUIDE

Ce guide explique comment ajouter des personnages et images prives localement dans GuildQuest sans polluer le repo public.

## Regle principale

Ne commit jamais d'image privee, protegee, sous licence ou issue d'une franchise dans ce repo.

Le dossier suivant est ignore par Git :

```txt
public/private-assets/
```

Le fichier local suivant est aussi ignore par Git :

```txt
src/data/characters/characters.local.ts
```

## Ou placer les images

Place les images locales ici :

```txt
public/private-assets/characters/
```

Dans le code, le chemin public correspondant commence par :

```txt
/private-assets/characters/
```

Exemple :

```txt
public/private-assets/characters/mon-personnage.png
```

devient :

```txt
/private-assets/characters/mon-personnage.png
```

## Formats recommandes

- PNG ou WebP.
- Format carre conseille : 512x512 ou 1024x1024.
- Fond transparent si possible.
- Noms de fichiers simples, sans accents ni espaces.

Exemples :

```txt
mage-feu-local.png
gardienne-arcane.webp
compagnon-lumiere.png
```

## Declarer des personnages locaux

Copie le template :

```txt
src/data/characters/characters.local.template.ts
```

vers :

```txt
src/data/characters/characters.local.ts
```

Puis adapte la liste :

```ts
import type { Character } from "@/domain/models";

export const localCharacters: Character[] = [
  {
    id: "private-character-1",
    name: "Nom local",
    rarity: "LEGENDARY",
    element: "Feu",
    power: 2500,
    description: "Description personnelle locale.",
    image: "/private-assets/characters/mon-personnage.png",
    placeholderImage: "/pwa.svg",
    category: "local",
    variant: "default",
    isPrivate: true,
    source: "local"
  }
];
```

## Remplacement ou ajout

- Si un personnage local utilise un nouvel `id`, il est ajoute a la liste.
- Si un personnage local utilise le meme `id` qu'un placeholder, il remplace ce placeholder dans le registre.
- Evite de changer les IDs apres avoir obtenu des personnages en gacha, car la collection locale se base sur ces IDs.

## Fallback image

Si `image` pointe vers une image absente ou invalide, GuildQuest affiche automatiquement un placeholder magique genere en CSS.

Ce fallback evite :

- les images cassees ;
- les cartes vides ;
- les erreurs visuelles dans le gacha, la collection et le profil.

## Tester une image

1. Ajoute l'image dans `public/private-assets/characters/`.
2. Declare ou modifie un personnage dans `characters.local.ts`.
3. Lance l'app :

```bash
npm run dev
```

4. Ouvre Collection ou Invocation.
5. Si l'image n'apparait pas, verifie :
   - le nom exact du fichier ;
   - le chemin `/private-assets/characters/...` ;
   - l'extension `.png` / `.webp` ;
   - que le fichier n'est pas dans `src/`.

## Export JSON

L'export JSON sauvegarde les references et chemins des personnages, mais pas les images privees elles-memes.

Avant de changer de machine, il faut sauvegarder separement :

- le fichier JSON GuildQuest ;
- le dossier local `public/private-assets/characters/` ;
- le fichier local `src/data/characters/characters.local.ts`.

## Verification Git

Avant tout commit public, verifier :

```bash
git status --short
```

Aucun fichier sous `public/private-assets/` ni `characters.local.ts` ne doit apparaitre.
