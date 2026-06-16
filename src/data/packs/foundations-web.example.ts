import type { ContentPack } from "@/domain/models";

export const foundationsWebPack: ContentPack = {
  id: "foundations-web",
  name: "Fondations Web",
  version: "0.1.0",
  description: "Premier pack de quetes pour comprendre les bases du Web.",
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
          description: "Comprendre la difference entre le reseau et les services web.",
          order: 1,
          quizIds: ["quiz-internet-vs-web", "quiz-acteurs-web"]
        },
        {
          id: "zone-client-serveur",
          regionId: "region-plaine-fondations",
          name: "Client / Serveur",
          description: "Identifier les roles du navigateur et du serveur.",
          order: 2,
          quizIds: ["quiz-client-serveur", "quiz-cycle-requete"]
        },
        {
          id: "zone-http",
          regionId: "region-plaine-fondations",
          name: "HTTP",
          description: "Lire une requete simple et interpreter une reponse.",
          order: 3,
          quizIds: ["quiz-http-bases"]
        }
      ]
    }
  ],
  quizzes: [
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
          explanation: "Internet est l'infrastructure reseau. Le Web utilise notamment HTTP, HTML et les navigateurs."
        }
      ]
    },
    {
      id: "quiz-acteurs-web",
      zoneId: "zone-internet-web",
      title: "Les acteurs du Web",
      description: "Reconnaitre les elements frequents d'une navigation web.",
      rank: "F",
      questions: [
        {
          id: "q-acteurs-web-1",
          type: "MULTIPLE_CHOICE",
          prompt: "Quels elements peuvent intervenir quand tu ouvres une page web ?",
          options: [
            { id: "a", label: "Un navigateur", isCorrect: true },
            { id: "b", label: "Un serveur", isCorrect: true },
            { id: "c", label: "Une adresse URL", isCorrect: true },
            { id: "d", label: "Une manette obligatoire", isCorrect: false }
          ],
          explanation: "Le navigateur demande une ressource via une URL et un serveur peut renvoyer la page."
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
        }
      ]
    },
    {
      id: "quiz-cycle-requete",
      zoneId: "zone-client-serveur",
      title: "Cycle d'une requete",
      description: "Remettre en place le dialogue de base.",
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
        }
      ]
    },
    {
      id: "quiz-http-bases",
      zoneId: "zone-http",
      title: "Premiers pas HTTP",
      description: "Identifier quelques bases du protocole HTTP.",
      rank: "E",
      questions: [
        {
          id: "q-http-bases-1",
          type: "MULTIPLE_CHOICE",
          prompt: "Quels codes HTTP indiquent generalement une reussite ou une redirection ?",
          options: [
            { id: "a", label: "200", isCorrect: true },
            { id: "b", label: "301", isCorrect: true },
            { id: "c", label: "404", isCorrect: false },
            { id: "d", label: "500", isCorrect: false }
          ],
          explanation: "200 indique souvent une reussite. 301 indique une redirection permanente."
        }
      ]
    }
  ],
  skillNodes: [
    {
      id: "skill-web-foundations",
      label: "Fondations du Web",
      description: "Comprendre les roles d'Internet, du Web, du client, du serveur et de HTTP.",
      parentIds: [],
      unlocked: true,
      completed: false
    }
  ]
};
