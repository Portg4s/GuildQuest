import type { ContentPack, Quiz } from "@/domain/models";

const quizzes: Quiz[] = [
  {
    id: "quiz-internet-vs-web",
    zoneId: "zone-internet-web",
    title: "Internet ou Web ?",
    description: "Distinguer l'infrastructure Internet du service Web.",
    rank: "F",
    questions: [
      {
        id: "q-internet-web-1",
        type: "SINGLE_CHOICE",
        prompt: "Quelle affirmation est la plus juste ?",
        options: [
          { id: "a", label: "Internet est un reseau mondial, le Web est un service qui l'utilise.", isCorrect: true },
          { id: "b", label: "Le Web et Internet designent exactement la meme chose.", isCorrect: false },
          { id: "c", label: "Internet fonctionne uniquement dans un navigateur.", isCorrect: false }
        ],
        explanation: "Internet est l'infrastructure reseau. Le Web est un ensemble de ressources accessibles notamment via HTTP."
      },
      {
        id: "q-internet-web-2",
        type: "TRUE_FALSE",
        prompt: "On peut utiliser Internet sans naviguer sur le Web.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "Email, messagerie, jeux en ligne ou synchronisation peuvent utiliser Internet sans etre du Web."
      },
      {
        id: "q-internet-web-3",
        type: "MULTIPLE_CHOICE",
        prompt: "Quels elements sont souvent associes au Web ?",
        options: [
          { id: "a", label: "HTML", isCorrect: true },
          { id: "b", label: "HTTP", isCorrect: true },
          { id: "c", label: "Navigateur", isCorrect: true },
          { id: "d", label: "Carte graphique obligatoire", isCorrect: false }
        ],
        explanation: "Le Web combine des standards comme HTTP, HTML et des clients comme les navigateurs."
      }
    ]
  },
  {
    id: "quiz-navigateur-url",
    zoneId: "zone-internet-web",
    title: "Navigateur et URL",
    description: "Comprendre le role du navigateur et la structure d'une URL.",
    rank: "F",
    questions: [
      {
        id: "q-url-1",
        type: "SINGLE_CHOICE",
        prompt: "Quel est le role principal d'un navigateur web ?",
        options: [
          { id: "a", label: "Demander, interpreter et afficher des ressources web.", isCorrect: true },
          { id: "b", label: "Remplacer tous les serveurs web.", isCorrect: false },
          { id: "c", label: "Compiler automatiquement le code backend.", isCorrect: false }
        ],
        explanation: "Le navigateur agit comme client : il envoie des requetes et rend les reponses utilisables."
      },
      {
        id: "q-url-2",
        type: "MULTIPLE_CHOICE",
        prompt: "Quelles parties peuvent apparaitre dans une URL ?",
        options: [
          { id: "a", label: "Un protocole comme https", isCorrect: true },
          { id: "b", label: "Un nom de domaine", isCorrect: true },
          { id: "c", label: "Un chemin vers une ressource", isCorrect: true },
          { id: "d", label: "Une couleur obligatoire", isCorrect: false }
        ],
        explanation: "Une URL peut contenir protocole, domaine, chemin, parametres et fragment."
      },
      {
        id: "q-url-3",
        type: "TRUE_FALSE",
        prompt: "Le navigateur peut executer du JavaScript recu depuis une page web.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "JavaScript est execute cote client par le moteur JS du navigateur."
      }
    ]
  },
  {
    id: "quiz-dns-hebergement",
    zoneId: "zone-internet-web",
    title: "DNS et hebergement",
    description: "Relier noms de domaine, DNS et serveurs d'hebergement.",
    rank: "E",
    questions: [
      {
        id: "q-dns-1",
        type: "SINGLE_CHOICE",
        prompt: "A quoi sert principalement le DNS ?",
        options: [
          { id: "a", label: "Traduire un nom de domaine vers une adresse utilisable par le reseau.", isCorrect: true },
          { id: "b", label: "Dessiner la mise en page d'un site.", isCorrect: false },
          { id: "c", label: "Minifier automatiquement le CSS.", isCorrect: false }
        ],
        explanation: "Le DNS permet de retrouver l'adresse associee a un nom comme example.com."
      },
      {
        id: "q-dns-2",
        type: "TRUE_FALSE",
        prompt: "L'hebergement consiste a rendre des fichiers ou services disponibles depuis une machine accessible.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "Un hebergeur met a disposition une infrastructure pour servir l'application ou les fichiers."
      },
      {
        id: "q-dns-3",
        type: "MULTIPLE_CHOICE",
        prompt: "Quels elements participent souvent a rendre un site disponible publiquement ?",
        options: [
          { id: "a", label: "Un nom de domaine", isCorrect: true },
          { id: "b", label: "Un serveur ou service d'hebergement", isCorrect: true },
          { id: "c", label: "Une configuration DNS", isCorrect: true },
          { id: "d", label: "Un fichier Photoshop obligatoire", isCorrect: false }
        ],
        explanation: "Domaine, DNS et hebergement travaillent ensemble pour rendre un site accessible."
      }
    ]
  },
  {
    id: "quiz-client-serveur",
    zoneId: "zone-client-serveur",
    title: "Roles client et serveur",
    description: "Comprendre qui demande et qui repond.",
    rank: "F",
    questions: [
      {
        id: "q-client-serveur-1",
        type: "TRUE_FALSE",
        prompt: "Dans le Web, le client est souvent le navigateur de l'utilisateur.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "Le navigateur agit comme client quand il envoie des requetes au serveur."
      },
      {
        id: "q-client-serveur-2",
        type: "SINGLE_CHOICE",
        prompt: "Quel est le role typique d'un serveur ?",
        options: [
          { id: "a", label: "Recevoir une requete, la traiter et renvoyer une reponse.", isCorrect: true },
          { id: "b", label: "Cliquer a la place de l'utilisateur.", isCorrect: false },
          { id: "c", label: "Remplacer le clavier.", isCorrect: false }
        ],
        explanation: "Le serveur expose des ressources ou traitements accessibles aux clients."
      },
      {
        id: "q-client-serveur-3",
        type: "MULTIPLE_CHOICE",
        prompt: "Quels exemples peuvent etre des clients HTTP ?",
        options: [
          { id: "a", label: "Un navigateur", isCorrect: true },
          { id: "b", label: "Une app mobile", isCorrect: true },
          { id: "c", label: "Un script de test API", isCorrect: true },
          { id: "d", label: "Une feuille de papier", isCorrect: false }
        ],
        explanation: "Tout programme capable d'envoyer une requete HTTP peut jouer le role de client."
      }
    ]
  },
  {
    id: "quiz-cycle-requete",
    zoneId: "zone-client-serveur",
    title: "Cycle d'une requete",
    description: "Suivre le dialogue demande/reponse.",
    rank: "E",
    questions: [
      {
        id: "q-cycle-requete-1",
        type: "SINGLE_CHOICE",
        prompt: "Que fait generalement le serveur apres avoir recu une requete valide ?",
        options: [
          { id: "a", label: "Il renvoie une reponse.", isCorrect: true },
          { id: "b", label: "Il eteint le navigateur.", isCorrect: false },
          { id: "c", label: "Il modifie l'URL au hasard.", isCorrect: false }
        ],
        explanation: "Le serveur traite la demande et renvoie une reponse avec un statut et souvent du contenu."
      },
      {
        id: "q-cycle-requete-2",
        type: "TRUE_FALSE",
        prompt: "Une reponse HTTP peut contenir un code de statut.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "Le code de statut indique si la demande a reussi, echoue ou necessite une action."
      },
      {
        id: "q-cycle-requete-3",
        type: "MULTIPLE_CHOICE",
        prompt: "Quelles informations peuvent accompagner une requete ?",
        options: [
          { id: "a", label: "Une methode HTTP", isCorrect: true },
          { id: "b", label: "Des headers", isCorrect: true },
          { id: "c", label: "Un body dans certains cas", isCorrect: true },
          { id: "d", label: "Une note manuscrite obligatoire", isCorrect: false }
        ],
        explanation: "Methode, headers et body structurent souvent une requete HTTP."
      }
    ]
  },
  {
    id: "quiz-api-front-back",
    zoneId: "zone-client-serveur",
    title: "API, frontend et backend",
    description: "Identifier les frontieres entre interface, logique serveur et API.",
    rank: "D",
    questions: [
      {
        id: "q-api-1",
        type: "SINGLE_CHOICE",
        prompt: "Une API sert souvent a...",
        options: [
          { id: "a", label: "Fournir une interface de communication entre logiciels.", isCorrect: true },
          { id: "b", label: "Remplacer toutes les pages HTML.", isCorrect: false },
          { id: "c", label: "Garantir qu'aucun bug n'existe.", isCorrect: false }
        ],
        explanation: "Une API definit comment un client peut demander ou envoyer des donnees a un service."
      },
      {
        id: "q-api-2",
        type: "MULTIPLE_CHOICE",
        prompt: "Quelles responsabilites sont souvent cote backend ?",
        options: [
          { id: "a", label: "Valider des donnees sensibles", isCorrect: true },
          { id: "b", label: "Acceder a une base de donnees", isCorrect: true },
          { id: "c", label: "Appliquer des regles metier", isCorrect: true },
          { id: "d", label: "Decider la couleur de chaque pixel du navigateur", isCorrect: false }
        ],
        explanation: "Le backend gere souvent donnees, securite et logique metier."
      },
      {
        id: "q-api-3",
        type: "TRUE_FALSE",
        prompt: "Le frontend ne doit pas etre considere comme une zone de confiance absolue.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "Le code frontend est expose aux utilisateurs. Les controles sensibles doivent etre verifies cote serveur."
      }
    ]
  },
  {
    id: "quiz-http-methodes",
    zoneId: "zone-http",
    title: "Methodes HTTP",
    description: "Choisir les methodes adaptees aux intentions courantes.",
    rank: "E",
    questions: [
      {
        id: "q-methodes-1",
        type: "SINGLE_CHOICE",
        prompt: "Quelle methode est generalement utilisee pour lire une ressource ?",
        options: [
          { id: "a", label: "GET", isCorrect: true },
          { id: "b", label: "DELETE", isCorrect: false },
          { id: "c", label: "PATCH", isCorrect: false }
        ],
        explanation: "GET sert a recuperer une representation de ressource."
      },
      {
        id: "q-methodes-2",
        type: "MULTIPLE_CHOICE",
        prompt: "Quelles methodes peuvent envoyer un body selon les usages d'API ?",
        options: [
          { id: "a", label: "POST", isCorrect: true },
          { id: "b", label: "PUT", isCorrect: true },
          { id: "c", label: "PATCH", isCorrect: true },
          { id: "d", label: "GET est toujours fait pour envoyer un gros body", isCorrect: false }
        ],
        explanation: "POST, PUT et PATCH transportent souvent des donnees dans le body."
      },
      {
        id: "q-methodes-3",
        type: "TRUE_FALSE",
        prompt: "DELETE indique typiquement une intention de suppression.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "DELETE exprime l'intention de supprimer une ressource."
      }
    ]
  },
  {
    id: "quiz-codes-http",
    zoneId: "zone-http",
    title: "Codes de statut",
    description: "Interpreter les grandes familles 2xx, 3xx, 4xx et 5xx.",
    rank: "E",
    questions: [
      {
        id: "q-codes-1",
        type: "MULTIPLE_CHOICE",
        prompt: "Quels codes indiquent generalement une reussite ou une redirection ?",
        options: [
          { id: "a", label: "200", isCorrect: true },
          { id: "b", label: "301", isCorrect: true },
          { id: "c", label: "404", isCorrect: false },
          { id: "d", label: "500", isCorrect: false }
        ],
        explanation: "200 indique souvent une reussite. 301 indique une redirection permanente."
      },
      {
        id: "q-codes-2",
        type: "SINGLE_CHOICE",
        prompt: "Que signifie souvent un code 404 ?",
        options: [
          { id: "a", label: "La ressource demandee n'a pas ete trouvee.", isCorrect: true },
          { id: "b", label: "Le serveur a parfaitement compile le CSS.", isCorrect: false },
          { id: "c", label: "La requete est toujours en attente.", isCorrect: false }
        ],
        explanation: "404 Not Found indique que la ressource cible n'est pas disponible a cette adresse."
      },
      {
        id: "q-codes-3",
        type: "TRUE_FALSE",
        prompt: "Les codes 5xx signalent generalement un probleme cote serveur.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "Les 5xx indiquent que le serveur n'a pas pu traiter correctement une requete pourtant recue."
      }
    ]
  },
  {
    id: "quiz-headers-https",
    zoneId: "zone-http",
    title: "Headers, body et HTTPS",
    description: "Comprendre les metadonnees, le contenu et la securite de transport.",
    rank: "D",
    questions: [
      {
        id: "q-headers-1",
        type: "SINGLE_CHOICE",
        prompt: "A quoi servent souvent les headers HTTP ?",
        options: [
          { id: "a", label: "Transporter des metadonnees sur la requete ou la reponse.", isCorrect: true },
          { id: "b", label: "Dessiner directement une animation CSS.", isCorrect: false },
          { id: "c", label: "Remplacer le body dans tous les cas.", isCorrect: false }
        ],
        explanation: "Les headers donnent du contexte : type de contenu, autorisation, cache, langue, etc."
      },
      {
        id: "q-headers-2",
        type: "TRUE_FALSE",
        prompt: "HTTPS chiffre la communication entre le client et le serveur.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "HTTPS ajoute TLS pour proteger le transport contre l'ecoute et l'alteration."
      },
      {
        id: "q-headers-3",
        type: "MULTIPLE_CHOICE",
        prompt: "Quelles donnees peuvent se trouver dans un body HTTP ?",
        options: [
          { id: "a", label: "Du JSON", isCorrect: true },
          { id: "b", label: "Un formulaire encode", isCorrect: true },
          { id: "c", label: "Un fichier envoye", isCorrect: true },
          { id: "d", label: "Le numero secret du navigateur obligatoire", isCorrect: false }
        ],
        explanation: "Le body transporte le contenu principal de certaines requetes ou reponses."
      }
    ]
  },
  {
    id: "quiz-html-structure",
    zoneId: "zone-html-css",
    title: "Structure HTML",
    description: "Identifier le squelette d'un document web.",
    rank: "F",
    questions: [
      {
        id: "q-html-1",
        type: "SINGLE_CHOICE",
        prompt: "Quelle balise contient generalement le contenu visible principal ?",
        options: [
          { id: "a", label: "body", isCorrect: true },
          { id: "b", label: "head", isCorrect: false },
          { id: "c", label: "meta", isCorrect: false }
        ],
        explanation: "Le contenu visible se trouve principalement dans body."
      },
      {
        id: "q-html-2",
        type: "MULTIPLE_CHOICE",
        prompt: "Quelles balises sont semantiques ?",
        options: [
          { id: "a", label: "header", isCorrect: true },
          { id: "b", label: "main", isCorrect: true },
          { id: "c", label: "article", isCorrect: true },
          { id: "d", label: "bluebox", isCorrect: false }
        ],
        explanation: "Les balises semantiques donnent du sens a la structure du document."
      },
      {
        id: "q-html-3",
        type: "TRUE_FALSE",
        prompt: "Un attribut HTML peut fournir une information supplementaire a une balise.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "Exemples : href, alt, class, id, type."
      }
    ]
  },
  {
    id: "quiz-css-selecteurs",
    zoneId: "zone-html-css",
    title: "CSS et selecteurs",
    description: "Cibler des elements et appliquer des styles.",
    rank: "E",
    questions: [
      {
        id: "q-css-1",
        type: "SINGLE_CHOICE",
        prompt: "A quoi sert CSS ?",
        options: [
          { id: "a", label: "Styliser et mettre en page les elements HTML.", isCorrect: true },
          { id: "b", label: "Remplacer entierement HTTP.", isCorrect: false },
          { id: "c", label: "Stocker toutes les donnees utilisateur.", isCorrect: false }
        ],
        explanation: "CSS controle couleurs, espacements, typographie, layout et comportements responsives."
      },
      {
        id: "q-css-2",
        type: "MULTIPLE_CHOICE",
        prompt: "Quels selecteurs CSS sont valides ?",
        options: [
          { id: "a", label: ".card", isCorrect: true },
          { id: "b", label: "#menu", isCorrect: true },
          { id: "c", label: "button", isCorrect: true },
          { id: "d", label: "@@layout", isCorrect: false }
        ],
        explanation: "Classe, id et selecteur d'element sont des formes courantes."
      },
      {
        id: "q-css-3",
        type: "TRUE_FALSE",
        prompt: "Une classe peut etre reutilisee sur plusieurs elements HTML.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "Les classes sont faites pour appliquer un style ou un comportement commun."
      }
    ]
  },
  {
    id: "quiz-responsive",
    zoneId: "zone-html-css",
    title: "Introduction responsive",
    description: "Adapter l'interface aux tailles d'ecran.",
    rank: "D",
    questions: [
      {
        id: "q-responsive-1",
        type: "SINGLE_CHOICE",
        prompt: "Le design responsive cherche surtout a...",
        options: [
          { id: "a", label: "Rendre l'interface utilisable sur plusieurs tailles d'ecran.", isCorrect: true },
          { id: "b", label: "Bloquer les mobiles.", isCorrect: false },
          { id: "c", label: "Supprimer toutes les images.", isCorrect: false }
        ],
        explanation: "Une interface responsive s'adapte aux contraintes de lecture et d'interaction."
      },
      {
        id: "q-responsive-2",
        type: "MULTIPLE_CHOICE",
        prompt: "Quels outils CSS aident souvent le responsive ?",
        options: [
          { id: "a", label: "Flexbox", isCorrect: true },
          { id: "b", label: "Grid", isCorrect: true },
          { id: "c", label: "Media queries", isCorrect: true },
          { id: "d", label: "Une largeur fixe obligatoire de 2000px", isCorrect: false }
        ],
        explanation: "Flexbox, Grid et media queries sont des outils essentiels pour les layouts adaptatifs."
      },
      {
        id: "q-responsive-3",
        type: "TRUE_FALSE",
        prompt: "Tester seulement sur un grand ecran suffit pour garantir une bonne experience mobile.",
        options: [
          { id: "true", label: "Vrai", isCorrect: false },
          { id: "false", label: "Faux", isCorrect: true }
        ],
        explanation: "Il faut verifier les tailles mobiles, tactiles et les contraintes de lecture."
      }
    ]
  },
  {
    id: "quiz-js-role-dom",
    zoneId: "zone-js-apis",
    title: "JavaScript et DOM",
    description: "Comprendre comment JavaScript rend une page interactive.",
    rank: "E",
    questions: [
      {
        id: "q-js-1",
        type: "SINGLE_CHOICE",
        prompt: "Quel est un role courant de JavaScript dans une page web ?",
        options: [
          { id: "a", label: "Ajouter de l'interactivite et manipuler l'etat de l'interface.", isCorrect: true },
          { id: "b", label: "Remplacer tous les protocoles reseau.", isCorrect: false },
          { id: "c", label: "Forcer le navigateur a devenir un serveur DNS.", isCorrect: false }
        ],
        explanation: "JavaScript controle souvent interactions, donnees et modifications de l'interface."
      },
      {
        id: "q-js-2",
        type: "TRUE_FALSE",
        prompt: "Le DOM represente la structure d'un document que JavaScript peut lire et modifier.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "Le DOM expose une representation programmable de la page."
      },
      {
        id: "q-js-3",
        type: "MULTIPLE_CHOICE",
        prompt: "Quels evenements peuvent declencher du JavaScript ?",
        options: [
          { id: "a", label: "Un clic", isCorrect: true },
          { id: "b", label: "Une saisie clavier", isCorrect: true },
          { id: "c", label: "Le chargement de la page", isCorrect: true },
          { id: "d", label: "Une pensee non transmise a l'ordinateur", isCorrect: false }
        ],
        explanation: "Les evenements permettent de reagir aux actions utilisateur ou au cycle de vie de la page."
      }
    ]
  },
  {
    id: "quiz-json-fetch",
    zoneId: "zone-js-apis",
    title: "JSON et fetch",
    description: "Echanger des donnees avec une API depuis le navigateur.",
    rank: "D",
    questions: [
      {
        id: "q-json-1",
        type: "SINGLE_CHOICE",
        prompt: "JSON est principalement...",
        options: [
          { id: "a", label: "Un format texte pour representer des donnees structurees.", isCorrect: true },
          { id: "b", label: "Un langage de style concurrent de CSS.", isCorrect: false },
          { id: "c", label: "Une base de donnees obligatoire.", isCorrect: false }
        ],
        explanation: "JSON represente objets, tableaux, chaines, nombres, booleens et null."
      },
      {
        id: "q-json-2",
        type: "TRUE_FALSE",
        prompt: "fetch peut etre utilise pour envoyer des requetes HTTP depuis JavaScript.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "fetch est une API navigateur courante pour communiquer avec des ressources HTTP."
      },
      {
        id: "q-json-3",
        type: "MULTIPLE_CHOICE",
        prompt: "Quelles etapes sont frequentes lors d'un appel API en JavaScript ?",
        options: [
          { id: "a", label: "Envoyer une requete", isCorrect: true },
          { id: "b", label: "Verifier le statut", isCorrect: true },
          { id: "c", label: "Parser le JSON si la reponse en contient", isCorrect: true },
          { id: "d", label: "Ignorer toutes les erreurs reseau", isCorrect: false }
        ],
        explanation: "Un bon appel API traite la reponse et les erreurs possibles."
      }
    ]
  },
  {
    id: "quiz-rest-intro",
    zoneId: "zone-js-apis",
    title: "API REST introduction",
    description: "Relier ressources, URLs et methodes HTTP.",
    rank: "C",
    questions: [
      {
        id: "q-rest-1",
        type: "SINGLE_CHOICE",
        prompt: "Dans une API REST, une URL represente souvent...",
        options: [
          { id: "a", label: "Une ressource ou une collection de ressources.", isCorrect: true },
          { id: "b", label: "Uniquement une couleur CSS.", isCorrect: false },
          { id: "c", label: "Un raccourci clavier.", isCorrect: false }
        ],
        explanation: "Les APIs REST organisent souvent les donnees en ressources adressees par URL."
      },
      {
        id: "q-rest-2",
        type: "MULTIPLE_CHOICE",
        prompt: "Quelles associations sont courantes dans une API REST ?",
        options: [
          { id: "a", label: "GET /articles pour lire une collection", isCorrect: true },
          { id: "b", label: "POST /articles pour creer un article", isCorrect: true },
          { id: "c", label: "DELETE /articles/1 pour supprimer une ressource", isCorrect: true },
          { id: "d", label: "RAINBOW /articles pour changer la meteo", isCorrect: false }
        ],
        explanation: "Les methodes HTTP expriment l'intention appliquee a une ressource."
      },
      {
        id: "q-rest-3",
        type: "TRUE_FALSE",
        prompt: "Une API REST bien concue doit aussi penser aux erreurs et aux codes de statut.",
        options: [
          { id: "true", label: "Vrai", isCorrect: true },
          { id: "false", label: "Faux", isCorrect: false }
        ],
        explanation: "Les clients ont besoin de comprendre les echecs, validations et absences de ressources."
      }
    ]
  }
];

export const foundationsWebPack: ContentPack = {
  id: "foundations-web",
  name: "Fondations Web",
  version: "0.2.0",
  description: "Premier pack de quetes pour comprendre les bases du Web moderne.",
  author: "GuildQuest",
  regions: [
    {
      id: "region-plaine-fondations",
      name: "Plaine des Fondations",
      description: "Une region calme pour poser les bases avant les donjons techniques.",
      order: 1,
      zones: [
        {
          id: "zone-internet-web",
          regionId: "region-plaine-fondations",
          name: "Internet & Web",
          description: "Comprendre la difference entre le reseau, le Web, les URLs, le DNS et l'hebergement.",
          order: 1,
          quizIds: ["quiz-internet-vs-web", "quiz-navigateur-url", "quiz-dns-hebergement"]
        },
        {
          id: "zone-client-serveur",
          regionId: "region-plaine-fondations",
          name: "Client / Serveur",
          description: "Identifier les roles du navigateur, du serveur, des APIs et des couches frontend/backend.",
          order: 2,
          quizIds: ["quiz-client-serveur", "quiz-cycle-requete", "quiz-api-front-back"]
        },
        {
          id: "zone-http",
          regionId: "region-plaine-fondations",
          name: "HTTP & HTTPS",
          description: "Lire une requete, comprendre les methodes, les statuts, les headers et HTTPS.",
          order: 3,
          quizIds: ["quiz-http-methodes", "quiz-codes-http", "quiz-headers-https"]
        },
        {
          id: "zone-html-css",
          regionId: "region-plaine-fondations",
          name: "HTML & CSS",
          description: "Structurer une page, utiliser la semantique, styliser et introduire le responsive.",
          order: 4,
          quizIds: ["quiz-html-structure", "quiz-css-selecteurs", "quiz-responsive"]
        },
        {
          id: "zone-js-apis",
          regionId: "region-plaine-fondations",
          name: "JavaScript & APIs",
          description: "Rendre une page interactive, manipuler le DOM, consommer du JSON et appeler une API REST.",
          order: 5,
          quizIds: ["quiz-js-role-dom", "quiz-json-fetch", "quiz-rest-intro"]
        }
      ]
    }
  ],
  quizzes,
  skillNodes: [
    {
      id: "skill-web-infra",
      zoneId: "zone-internet-web",
      label: "Reseau et Web",
      description: "Distinguer Internet, Web et navigation.",
      quizIds: ["quiz-internet-vs-web"],
      order: 1,
      parentIds: [],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-url-browser",
      zoneId: "zone-internet-web",
      label: "URL et navigateur",
      description: "Lire une URL et comprendre le role du navigateur.",
      quizIds: ["quiz-navigateur-url"],
      order: 2,
      parentIds: ["skill-web-infra"],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-dns-hosting",
      zoneId: "zone-internet-web",
      label: "DNS et hebergement",
      description: "Relier domaine, DNS et serveur d'hebergement.",
      quizIds: ["quiz-dns-hebergement"],
      order: 3,
      parentIds: ["skill-url-browser"],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-client-server",
      zoneId: "zone-client-serveur",
      label: "Roles client/serveur",
      description: "Comprendre le dialogue entre client et serveur.",
      quizIds: ["quiz-client-serveur"],
      order: 1,
      parentIds: [],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-request-cycle",
      zoneId: "zone-client-serveur",
      label: "Cycle requete/reponse",
      description: "Suivre le trajet d'une demande HTTP.",
      quizIds: ["quiz-cycle-requete"],
      order: 2,
      parentIds: ["skill-client-server"],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-api-layers",
      zoneId: "zone-client-serveur",
      label: "API et couches",
      description: "Placer frontend, backend et API dans l'architecture.",
      quizIds: ["quiz-api-front-back"],
      order: 3,
      parentIds: ["skill-request-cycle"],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-http-methods",
      zoneId: "zone-http",
      label: "Methodes HTTP",
      description: "Choisir GET, POST, PUT, PATCH ou DELETE.",
      quizIds: ["quiz-http-methodes"],
      order: 1,
      parentIds: [],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-http-status",
      zoneId: "zone-http",
      label: "Statuts HTTP",
      description: "Lire les familles de codes de statut.",
      quizIds: ["quiz-codes-http"],
      order: 2,
      parentIds: ["skill-http-methods"],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-https-body",
      zoneId: "zone-http",
      label: "Headers et HTTPS",
      description: "Comprendre headers, body et chiffrement HTTPS.",
      quizIds: ["quiz-headers-https"],
      order: 3,
      parentIds: ["skill-http-status"],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-html-structure",
      zoneId: "zone-html-css",
      label: "Structure HTML",
      description: "Construire le squelette semantique d'une page.",
      quizIds: ["quiz-html-structure"],
      order: 1,
      parentIds: [],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-css-selectors",
      zoneId: "zone-html-css",
      label: "Styles et selecteurs",
      description: "Cibler et styliser les elements.",
      quizIds: ["quiz-css-selecteurs"],
      order: 2,
      parentIds: ["skill-html-structure"],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-responsive",
      zoneId: "zone-html-css",
      label: "Responsive",
      description: "Adapter l'interface aux tailles d'ecran.",
      quizIds: ["quiz-responsive"],
      order: 3,
      parentIds: ["skill-css-selectors"],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-js-dom",
      zoneId: "zone-js-apis",
      label: "JavaScript et DOM",
      description: "Rendre la page interactive.",
      quizIds: ["quiz-js-role-dom"],
      order: 1,
      parentIds: [],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-json-fetch",
      zoneId: "zone-js-apis",
      label: "JSON et fetch",
      description: "Echanger des donnees avec une API.",
      quizIds: ["quiz-json-fetch"],
      order: 2,
      parentIds: ["skill-js-dom"],
      unlocked: true,
      completed: false
    },
    {
      id: "skill-rest-intro",
      zoneId: "zone-js-apis",
      label: "REST",
      description: "Relier ressources, URLs et methodes.",
      quizIds: ["quiz-rest-intro"],
      order: 3,
      parentIds: ["skill-json-fetch"],
      unlocked: true,
      completed: false
    }
  ]
};
