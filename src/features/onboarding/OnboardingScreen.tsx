import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, Gem, Sparkles, Swords, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

type OnboardingScreenProps = {
  onComplete: () => void;
  onSkip: () => void;
};

const steps = [
  {
    icon: <BookOpen className="size-8" />,
    title: "Bienvenue dans la guilde",
    text: "Le Hall est ton tableau quotidien : niveau, gemmes, compagnon actif, progression et objectifs."
  },
  {
    icon: <Trophy className="size-8" />,
    title: "Missions et quiz",
    text: "Explore les regions, termine des quiz, gagne XP et gemmes, puis monte de niveau."
  },
  {
    icon: <Sparkles className="size-8" />,
    title: "Invocation et collection",
    text: "Utilise tes gemmes pour invoquer des personnages, enrichir ta collection et choisir un allie actif."
  },
  {
    icon: <Swords className="size-8" />,
    title: "Duel de guilde",
    text: "Compose une equipe de 3 personnages et affronte des adversaires offline pour progresser dans l'arene."
  },
  {
    icon: <Gem className="size-8" />,
    title: "Quetes quotidiennes",
    text: "Chaque jour, complete de petits objectifs pour maintenir ton streak et reclamer des recompenses."
  },
  {
    icon: <Download className="size-8" />,
    title: "Sauvegarde locale",
    text: "GuildQuest est offline-first. Pense a exporter un JSON pour sauvegarder ta progression."
  }
];

export function OnboardingScreen({ onComplete, onSkip }: OnboardingScreenProps) {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const isLast = index === steps.length - 1;

  return (
    <section className="grid min-h-[calc(100vh-2.5rem)] place-items-center">
      <motion.article
        key={step.title}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="guild-panel magic-border w-full max-w-xl p-5 text-center"
      >
        <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-teal-200/25 bg-teal-300/15 text-teal-100 shadow-glow">
          {step.icon}
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-amber-100">
          Saison 1 - Boucle de jeu
        </p>
        <h1 className="guild-title mt-2 text-3xl">{step.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-300">{step.text}</p>

        <div className="mt-5 flex justify-center gap-1">
          {steps.map((item, dotIndex) => (
            <span
              key={item.title}
              className={`h-2 rounded-full transition-all ${dotIndex === index ? "w-7 bg-teal-200" : "w-2 bg-white/20"}`}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button variant="guild" onClick={onSkip}>Passer</Button>
          <Button onClick={() => (isLast ? onComplete() : setIndex((current) => current + 1))}>
            {isLast ? "Commencer l'aventure" : "Suivant"}
          </Button>
        </div>
      </motion.article>
    </section>
  );
}
