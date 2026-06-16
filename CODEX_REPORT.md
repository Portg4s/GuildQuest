# CODEX_REPORT

Date : 16 juin 2026

## Resume

La partie apprentissage/exploration de GuildQuest a ete renforcee :

- Bouton `Carte` active depuis le Hall.
- Nouvel ecran `Carte des regions`.
- Nouvel ecran `Detail de zone / arbre de competences`.
- Navigation RPG : Hall -> Carte -> Zone -> Quiz.
- L'ecran Missions reste disponible comme acces rapide aux quiz.
- Hall enrichi avec un bloc `Progression actuelle`.
- Profil enrichi avec progression du pack, quiz valides et quiz parfaits.
- Pack `Fondations Web` fortement enrichi.

## Fichiers crees ou modifies

Crees :

- `src/domain/progression/learning-progress.service.ts`
- `src/features/map/MapScreen.tsx`
- `src/features/map/ZoneDetailScreen.tsx`

Modifies :

- `src/app/App.tsx`
- `src/data/packs/foundations-web.example.ts`
- `src/domain/models/SkillNode.ts`
- `src/features/home/HomeScreen.tsx`
- `src/features/profile/ProfileScreen.tsx`
- `src/features/collection/CollectionScreen.tsx`
- `src/features/gacha/GachaScreen.tsx`
- `CODEX_REPORT.md`

## Contenu ajoute au pack

Pack actif : `Fondations Web`.

Region :

- `Plaine des Fondations`

Zones :

- Internet & Web
- Client / Serveur
- HTTP & HTTPS
- HTML & CSS
- JavaScript & APIs

Volume actuel :

- 5 zones
- 15 quiz
- 45 questions
- 15 noeuds de competence

Chaque zone contient 3 quiz et 3 noeuds de competence. Les questions melangent :

- `SINGLE_CHOICE`
- `MULTIPLE_CHOICE`
- `TRUE_FALSE`

Themes couverts :

- difference Internet / Web
- navigateur
- URL
- DNS
- hebergement
- client / serveur
- requete / reponse
- API
- frontend / backend
- methodes HTTP
- codes HTTP
- headers
- body
- HTTPS
- structure HTML
- balises semantiques
- attributs
- CSS
- selecteurs
- responsive
- JavaScript
- DOM
- evenements
- JSON
- fetch
- API REST

## Logique de progression ajoutee

Nouveau service : `learning-progress.service.ts`.

Fonctions principales :

- calcul du statut d'un quiz ;
- calcul de progression d'une zone ;
- calcul de progression d'une region ;
- calcul de progression du pack ;
- recuperation des quiz d'une zone ;
- recuperation des noeuds de competence d'une zone ;
- calcul de progression d'un noeud.

Regles appliquees :

- Quiz non tente : aucune tentative.
- Quiz echoue : tentative avec meilleur score < 60%.
- Quiz valide : meilleur score >= 60%.
- Quiz parfait : meilleur score = 100%.
- Zone non commencee : aucun quiz tente.
- Zone en cours : au moins un quiz tente, mais tous les quiz ne sont pas valides.
- Zone terminee : tous les quiz de la zone sont valides.
- Progression zone : quiz valides / quiz totaux.
- Progression region : quiz valides / quiz totaux de la region.

## UI ajoutee

Carte des regions :

- titre `Carte des regions` ;
- retour Hall ;
- pack actif ;
- region `Plaine des Fondations` ;
- progression globale ;
- zones terminees / total ;
- quiz valides / total ;
- quiz parfaits ;
- cartes de zones avec statut, progression et bouton `Explorer`.

Detail de zone :

- nom et description de la zone ;
- barre de progression ;
- statut de zone ;
- noeuds de competence ordonnes ;
- quiz lies a chaque noeud ;
- meilleur score visible ;
- bouton `Lancer`.

Hall :

- bouton `Carte` ajoute ;
- bloc `Progression actuelle` avec pack, region et pourcentage ;
- bouton `Ouvrir la carte`.

Profil :

- progression `Fondations Web` ;
- quiz valides ;
- quiz parfaits ;
- conservation des stats quiz, gacha et personnage actif.

## Extensibilite packs

La logique reste basee sur `ContentPack`, `Region`, `Zone`, `Quiz` et `SkillNode`.

Simplifications actuelles :

- un seul pack actif est charge directement depuis `foundations-web.example.ts` ;
- une seule region est affichee pour la V1 ;
- les zones sont toutes accessibles, sans verrouillage strict ;
- les noeuds de competence portent des champs optionnels `zoneId`, `quizIds` et `order` pour preparer plusieurs zones/packs plus tard.

## Commandes executees

- `Get-Content -Raw CODEX_RULES.md`
- lectures des fichiers existants `App`, `HomeScreen`, `ProfileScreen`, `MissionsScreen`, modeles et pack
- `npm run build`
- `npm run lint`
- `npm run dev -- --host 127.0.0.1`
- tentative de connexion au navigateur integre

## Resultat de `npm run build`

OK.

Le build production Vite passe et genere les fichiers PWA.

Avertissement restant :

- Vite signale que certains chunks depassent 500 kB apres minification.
- Ce n'est pas bloquant pour la V1.
- Une prochaine etape possible sera le code splitting par ecran.

## Resultat de `npm run lint`

OK.

Aucune erreur et aucun avertissement ESLint.

## Resultat de `npm run dev`

OK pour le demarrage.

Vite annonce :

- `VITE v8.0.16 ready`
- `Local: http://127.0.0.1:5173/`

La commande a ete arretee par timeout volontaire apres quelques secondes, car le serveur de dev reste ouvert en continu.

## Erreurs ou limites rencontrees

- Verification navigateur integre impossible : l'instance `iab` n'est pas disponible dans cette session.
- La validation visuelle complete doit donc etre faite manuellement.
- Aucun commit et aucun push n'ont ete faits.
- Aucun asset protege n'a ete ajoute.

## Points a verifier manuellement

- Lancer `npm run dev`.
- Ouvrir `http://127.0.0.1:5173/`.
- Depuis le Hall, ouvrir `Carte`.
- Verifier la region `Plaine des Fondations`.
- Explorer chaque zone.
- Lancer un quiz depuis un noeud de competence.
- Terminer un quiz et verifier que la progression de zone/region evolue.
- Verifier que l'ecran Missions fonctionne toujours.
- Verifier que le Profil affiche la progression d'apprentissage.
- Tester le rendu mobile des cartes de zones et noeuds.

## Prochaine etape recommandee

Ajouter un vrai verrouillage progressif des zones/noeuds, puis introduire un ecran `Carte` multi-regions avec selection de pack actif.
