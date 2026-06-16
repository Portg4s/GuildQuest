# PRIVATE_ASSETS_GUIDE

Ce guide explique comment ajouter des personnages prives locaux dans GuildQuest sans exposer d'assets dans le repo.

## Regle principale

Ne commit jamais d'image privee, protegee, sous licence ou issue d'une licence existante.

Ces chemins sont ignores par Git :

```txt
public/private-assets/
src/data/characters/characters.local.ts
```

## A. Ou mettre les images

Place les images dans :

```txt
public/private-assets/characters/
```

Dans les donnees personnages, le chemin public commence par :

```txt
/private-assets/characters/
```

Exemple :

```txt
public/private-assets/characters/example-character.webp
```

se reference ainsi :

```txt
/private-assets/characters/example-character.webp
```

## B. Formats recommandes

- `.webp` recommande.
- `.png` accepte.
- Portrait carre recommande.
- Taille conseillee : 512x512 ou 768x768.
- Eviter les fichiers trop lourds.
- Utiliser des noms simples, sans espaces ni accents.

Exemples de noms :

```txt
mage-feu-local.webp
gardienne-arcane.png
compagnon-lumiere.webp
```

## C. Creer le fichier local

Copie :

```txt
src/data/characters/characters.local.example.ts
```

vers :

```txt
src/data/characters/characters.local.ts
```

Le fichier `characters.local.ts` est ignore par Git.

## D. Exemple de pack local fictif

Le fichier local peut exporter un pack :

```ts
import type { LocalCharacterPack } from "@/data/characters/characters.registry";

export const localCharacterPack: LocalCharacterPack = {
  packName: "Private Local Pack",
  packVersion: 1,
  author: "local",
  replacePlaceholders: false,
  characters: [
    {
      id: "private-character-1",
      name: "Nom local fictif",
      rarity: "LEGENDARY",
      element: "Feu",
      power: 2500,
      description: "Description personnelle locale.",
      imageUrl: "/private-assets/characters/example-character.webp",
      portraitUrl: "/private-assets/characters/example-character-portrait.webp",
      bannerUrl: "/private-assets/characters/example-character-banner.webp",
      placeholderImage: "/pwa.svg",
      quote: "Citation locale optionnelle.",
      tags: ["local", "test"],
      category: "private-local",
      variant: "default",
      isPrivate: true,
      source: "private-local-pack"
    }
  ]
};

export const localCharacters = localCharacterPack.characters;

export default localCharacterPack;
```

Tous les noms de cet exemple sont fictifs.

## Champs importants

- `id` : identifiant stable. Evite de le changer apres avoir obtenu le personnage.
- `name` : nom affiche.
- `rarity` : `COMMON`, `RARE`, `EPIC`, `LEGENDARY` ou `MYTHIC`.
- `element` : texte libre court.
- `power` : nombre.
- `description` : texte affiche dans le detail.
- `imageUrl` : chemin principal vers l'image locale.
- `portraitUrl` : optionnel, reserve pour de futurs affichages.
- `bannerUrl` : optionnel, reserve pour de futures bannieres.
- `quote` : optionnel.
- `tags` : optionnel.

## Remplacer ou completer les placeholders

Dans `localCharacterPack` :

```ts
replacePlaceholders: false
```

- `false` : ajoute les personnages locaux aux placeholders.
- `true` : remplace la liste publique par ton pack local.

Si un personnage local utilise le meme `id` qu'un placeholder, il remplace ce placeholder.

## Validation locale

GuildQuest ignore les entrees locales incompletes au lieu de casser l'application.

Une entree locale doit au minimum avoir :

- `id`
- `name`
- `rarity`
- `element`
- `power`
- `description`
- `imageUrl` ou `image` ou `portraitUrl`

Collection et Parametres indiquent combien de personnages locaux sont charges.

## E. Tester

1. Ajoute les images dans `public/private-assets/characters/`.
2. Cree `src/data/characters/characters.local.ts`.
3. Lance :

```bash
npm run dev
```

4. Ouvre Collection.
5. Verifie le bloc de statut du pack local.
6. Lance une invocation pour confirmer que les personnages locaux peuvent etre tires.

Si une image n'apparait pas, verifie :

- le chemin `/private-assets/characters/...` ;
- l'extension `.webp` ou `.png` ;
- le nom exact du fichier ;
- que le fichier est bien dans `public/private-assets/characters/`.

## F. Securite Git

Avant de commit :

```bash
git status --short
```

Ces fichiers ne doivent pas apparaitre :

- images sous `public/private-assets/`
- `src/data/characters/characters.local.ts`

Si un asset prive apparait dans Git, ne le commit pas.

## G. Export JSON

L'export JSON sauvegarde :

- progression ;
- collection ;
- references et chemins ;
- personnage actif ;
- gacha ;
- badges/titres.

L'export JSON ne sauvegarde pas les images privees.

Pour changer de machine, sauvegarde separement :

- le JSON GuildQuest ;
- `public/private-assets/characters/` ;
- `src/data/characters/characters.local.ts`.

## Fallback image

Si une image locale manque ou ne charge pas, GuildQuest affiche un placeholder magique CSS :

- initiales du personnage ;
- cadre selon rarete ;
- aura/rune originale ;
- aucune image cassee visible.
