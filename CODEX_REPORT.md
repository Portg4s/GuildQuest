# CODEX_REPORT

Date : 16 juin 2026

## Resume

Le systeme de personnages est prepare pour des assets locaux prives tout en gardant le repo propre :

- registre central de personnages ;
- liste publique placeholder enrichie ;
- template local prive commitable ;
- support d'un fichier local ignore par Git ;
- fallback automatique des images cassees ;
- integration dans gacha, collection, detail personnage, Hall et Profil ;
- dossier local `public/private-assets/characters/` cree sans contenu suivi.

## Fichiers crees ou modifies

Crees :

- `src/components/game/CharacterImage.tsx`
- `src/data/characters/characters.placeholder.ts`
- `src/data/characters/characters.registry.ts`
- `src/data/characters/characters.local.template.ts`

Modifies :

- `.gitignore`
- `README.md`
- `src/app/App.tsx`
- `src/components/game/rarity-styles.ts`
- `src/data/characters/characters.example.ts`
- `src/domain/gacha/gacha.service.ts`
- `src/domain/models/Character.ts`
- `src/features/character-detail/CharacterDetailScreen.tsx`
- `src/features/collection/CollectionScreen.tsx`
- `src/features/gacha/GachaScreen.tsx`
- `src/features/home/HomeScreen.tsx`
- `src/features/profile/ProfileScreen.tsx`
- `CODEX_REPORT.md`

## Nouvelle strategie des personnages

La source publique principale est maintenant :

- `src/data/characters/characters.placeholder.ts`

Le registre central est :

- `src/data/characters/characters.registry.ts`

Il fusionne :

- les personnages placeholders publics ;
- un fichier local optionnel `src/data/characters/characters.local.ts` si present.

Le fichier local reel `characters.local.ts` est ignore par Git. Il peut exporter :

- `localCharacters`
- ou un export `default`

Les personnages locaux qui ont le meme `id` qu'un placeholder remplacent la version publique. Cela prepare un futur import/remplacement JSON sans changer la logique gacha/collection.

`characters.example.ts` reste present comme alias de compatibilite vers la liste placeholder.

## Personnages placeholders

La liste publique contient maintenant 30 personnages generiques :

- 10 COMMON
- 8 RARE
- 6 EPIC
- 4 LEGENDARY
- 2 MYTHIC

Les anciens IDs ont ete conserves pour limiter l'impact sur les collections Dexie existantes :

- `apprentice-luma`
- `scribe-novan`
- `forge-mira`
- `rune-tarek`
- `aera-sentinel`
- `kael-architect`
- `naya-oracle`
- `solen-warden`
- `elys-celestial`
- `orion-voidsmith`

Les puissances ont ete ajustees pour respecter les fourchettes par rarete.

## Modele Character

Le modele accepte maintenant les champs optionnels :

- `category`
- `variant`
- `isPrivate`
- `source`

Les champs existants restent compatibles :

- `id`
- `name`
- `rarity`
- `element`
- `power`
- `description`
- `image`
- `placeholderImage`

## Fallback image

Nouveau composant :

- `CharacterImage`

Comportement :

- tente d'abord `character.image`, par exemple `/private-assets/characters/...` ;
- si l'image est absente ou invalide, utilise `character.placeholderImage` ;
- si le placeholder echoue aussi, utilise `/pwa.svg` ;
- evite les images cassees dans l'UI.

Le composant est utilise dans :

- Invocation ;
- Collection ;
- Detail personnage ;
- Hall ;
- Profil.

## Raretes

Le helper `rarity-styles.ts` contient maintenant :

- labels francais ;
- classes de carte ;
- classes de badge ;
- classes de glow ;
- poids de tri ;
- poids visuel ;
- fonction `compareRarity`.

Les raretes restent :

- COMMON
- RARE
- EPIC
- LEGENDARY
- MYTHIC

## Assets prives

`.gitignore` ignore :

- `/public/private-assets/`
- `/src/data/characters/characters.local.ts`

Le dossier local suivant a ete cree vide :

- `public/private-assets/characters/`

Aucun asset prive ou protege n'a ete ajoute.

Le README documente :

- ou placer les images privees ;
- comment copier le template local ;
- le fallback automatique vers les placeholders.

## Impact sur la collection existante

Impact limite :

- les 10 premiers IDs existants sont conserves ;
- les personnages deja obtenus avec ces IDs restent compatibles ;
- les nouvelles entrees ajoutent simplement plus de personnages au pool gacha.

Attention :

- si un futur fichier local remplace un personnage avec un ID existant, la collection Dexie pointera vers cette nouvelle definition ;
- si un personnage obtenu a un ID retire d'une future liste, il pourrait ne plus etre affichable sans migration.

## Commandes executees

- `Get-Content -Raw .gitignore`
- lectures des fichiers personnages, gacha, collection, Hall, Profil et detail personnage
- `New-Item -ItemType Directory -Force -Path public/private-assets/characters`
- `git check-ignore -v public/private-assets/characters`
- `git check-ignore -v src/data/characters/characters.local.ts`
- `npm run build`
- `npm run lint`
- `npm run dev -- --host 127.0.0.1`

## Resultat de `npm run build`

OK.

Le build production Vite passe et genere les fichiers PWA.

Avertissement restant :

- Vite signale que certains chunks depassent 500 kB apres minification.
- Ce n'est pas bloquant.

## Resultat de `npm run lint`

OK.

Un premier passage a signale `react-hooks/set-state-in-effect` dans `CharacterImage`. Le composant a ete corrige pour suivre les sources en erreur sans effet React, puis le lint est repasse sans erreur.

## Resultat de `npm run dev`

OK pour le demarrage.

Vite annonce :

- `VITE v8.0.16 ready`
- `Local: http://127.0.0.1:5173/`

La commande a ete arretee par timeout volontaire apres quelques secondes, car le serveur de dev reste ouvert en continu.

## Erreurs ou limites rencontrees

- Aucune erreur restante cote build ou lint.
- Aucune verification visuelle navigateur n'a ete effectuee dans cette tache.
- Aucun telechargement Internet n'a ete effectue.
- Aucun commit et aucun push n'ont ete faits.

## Points a verifier manuellement

- Lancer `npm run dev`.
- Ouvrir `http://127.0.0.1:5173/`.
- Verifier Invocation et Collection avec les 30 placeholders.
- Placer une image locale dans `public/private-assets/characters/`.
- Copier `characters.local.template.ts` vers `characters.local.ts` et adapter un personnage.
- Verifier que l'image privee s'affiche.
- Renommer ou supprimer l'image privee et verifier le fallback vers `/pwa.svg`.
- Verifier que le personnage actif s'affiche toujours dans le Hall et le Profil.

## Prochaine etape recommandee

Ajouter un import JSON local pour personnages et un petit ecran de validation listant les IDs remplaces, les images manquantes et les raretes disponibles.
