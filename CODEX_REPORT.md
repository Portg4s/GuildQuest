# CODEX_REPORT

Date : 16 juin 2026

## Resume

Architecture locale des personnages prives renforcee sans ajouter d'asset protege ni de vraie image au repo.

Le systeme permet maintenant :

- de conserver les personnages placeholders publics ;
- de charger un pack local optionnel `characters.local.ts` s'il existe ;
- de construire un pack local avec metadata ;
- de valider les entrees locales ;
- d'ignorer les entrees incompletes sans casser l'app ;
- d'afficher le statut du pack local dans Collection et Parametres ;
- de garder un fallback visuel propre si une image locale est absente.

## Fichiers crees

- `src/data/characters/characters.local.example.ts`

## Fichiers modifies

- `src/domain/models/Character.ts`
- `src/data/characters/characters.registry.ts`
- `src/data/characters/characters.local.template.ts`
- `src/features/collection/CollectionScreen.tsx`
- `src/features/settings/SettingsScreen.tsx`
- `src/app/App.tsx`
- `PRIVATE_ASSETS_GUIDE.md`
- `README.md`
- `CODEX_REPORT.md`

## Fonctionnement du pack local

Le registre charge toujours `characters.placeholder.ts`.

Ensuite, il tente de charger optionnellement :

```txt
src/data/characters/characters.local.ts
```

via `import.meta.glob`, ce qui permet au build Vite de passer meme si le fichier local est absent.

Le fichier local peut exporter :

- `localCharacterPack`
- `localCharacters`
- ou un export default.

Le format recommande est :

```ts
export const localCharacterPack = {
  packName: "Private Local Pack",
  packVersion: 1,
  author: "local",
  replacePlaceholders: false,
  characters: [...]
}
```

Si `replacePlaceholders` vaut `true`, le pack local remplace la liste publique. Sinon, il s'ajoute aux placeholders. Un personnage local avec le meme `id` qu'un placeholder remplace ce placeholder.

## Strategie d'import local

Les personnages locaux acceptent des champs enrichis :

- `imageUrl`
- `portraitUrl`
- `bannerUrl`
- `quote`
- `tags`

Le registre normalise ensuite vers les champs internes deja utilises par l'app :

- `image`
- `placeholderImage`
- `source`
- `isPrivate`

## Validation

Une entree locale est consideree valide si elle contient au minimum :

- `id`
- `name`
- `rarity`
- `element`
- `power`
- `description`
- `imageUrl` ou `image` ou `portraitUrl`

Les raretes acceptees restent :

- `COMMON`
- `RARE`
- `EPIC`
- `LEGENDARY`
- `MYTHIC`

Les entrees invalides sont ignorees. Collection et Parametres affichent le nombre d'entrees locales ignorees si besoin.

## Strategie fallback

`CharacterImage` conserve le fallback magique CSS ajoute precedemment :

- initiales ;
- frame selon rarete ;
- rune CSS ;
- aucune image cassee visible.

Si un personnage local est retire de `characters.local.ts` alors qu'il existe encore dans Dexie, Collection affiche une section `Personnages locaux indisponibles` avec l'ID sauvegarde et les fragments.

## Etat `.gitignore`

Les protections necessaires sont presentes :

```txt
/public/private-assets/
/src/data/characters/characters.local.ts
```

Le fichier exemple versionne est volontairement commitable :

```txt
src/data/characters/characters.local.example.ts
```

## Guide assets prives

`PRIVATE_ASSETS_GUIDE.md` a ete reecrit pour expliquer :

- ou placer les images ;
- les formats recommandes ;
- comment creer `characters.local.ts` ;
- le format `localCharacterPack` ;
- la validation ;
- le test local ;
- la securite Git ;
- les limites de l'export JSON ;
- le fallback image.

Le README pointe maintenant vers `characters.local.example.ts`.

## Limites eventuelles

- Pas de vraies images ajoutees.
- Pas de validation runtime affichee en detail personnage par personnage.
- Pas d'interface d'import JSON personnages dediee pour l'instant.
- Si un personnage local est retire, l'app conserve la sauvegarde Dexie mais ne peut plus afficher ses vraies donnees tant que sa definition n'est pas restauree.

## Commandes executees

- `npm run lint`
- `npm run build`
- `npm run dev -- --host 127.0.0.1`

## Resultat de `npm run lint`

OK.

Aucune erreur et aucun avertissement ESLint.

## Resultat de `npm run build`

OK.

Le build production Vite passe sans `characters.local.ts`.

Avertissement restant non bloquant :

- certains chunks depassent 500 kB apres minification.

## Resultat de `npm run dev`

OK pour le demarrage.

Vite a annonce :

- `VITE v8.0.16 ready`
- `Local: http://127.0.0.1:5173/`

La commande a ete arretee par timeout apres quelques secondes, car le serveur reste ouvert en continu.

## Points a verifier manuellement

- Copier `characters.local.example.ts` vers `characters.local.ts`.
- Ajouter une image locale dans `public/private-assets/characters/`.
- Lancer `npm run dev`.
- Ouvrir Collection et verifier le statut du pack local.
- Faire une invocation pour confirmer que les personnages locaux peuvent etre tires.
- Tester une image manquante pour verifier le fallback magique.
- Verifier `git status --short` avant commit : les assets prives et `characters.local.ts` ne doivent pas apparaitre.

## Prochaine etape recommandee

Ajouter plus tard un ecran local d'import JSON personnages qui genere ou valide un pack local sans modifier manuellement le fichier TypeScript.
