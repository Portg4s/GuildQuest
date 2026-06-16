import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type SplashScreenProps = {
  animationsEnabled: boolean;
  animationSpeed: "normal" | "fast" | "reduced";
};

const splashMessages = [
  "Ouverture du grimoire local...",
  "Chargement de la guilde...",
  "Synchronisation des quetes..."
];

export function SplashScreen({ animationsEnabled, animationSpeed }: SplashScreenProps) {
  const reduced = !animationsEnabled || animationSpeed === "reduced";
  const duration = animationSpeed === "fast" ? 0.65 : reduced ? 0.35 : 1.15;

  return (
    <motion.section
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: reduced ? 0.16 : 0.35, ease: "easeOut" }}
      className="fixed inset-0 z-[80] grid min-h-screen place-items-center overflow-hidden bg-slate-950 text-white"
      aria-label="Chargement GuildQuest"
    >
      <div className="absolute inset-0 guild-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(45,212,191,0.22),transparent_26%),radial-gradient(circle_at_50%_55%,rgba(250,204,21,0.12),transparent_30%)]" />
      {!reduced && <SplashParticles />}

      <div className="relative mx-auto w-full max-w-sm px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduced ? 0.2 : 0.45, ease: "easeOut" }}
          className="guild-panel magic-border mx-auto p-6"
        >
          <div className="rune-mark magic-border mx-auto grid size-24 place-items-center rounded-2xl border border-teal-200/35 bg-teal-300/10 shadow-glow">
            <motion.div
              animate={reduced ? undefined : { rotate: [0, 6, -6, 0], scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
              className="grid size-14 place-items-center rounded-xl border border-amber-200/30 bg-slate-950/55"
            >
              <Shield className="size-7 text-teal-100" aria-hidden="true" />
            </motion.div>
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-teal-200">Entree de guilde</p>
          <h1 className="guild-title mt-1 text-4xl leading-none">GuildQuest</h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-200">
            <BookOpen className="size-4 text-amber-100" aria-hidden="true" />
            <SplashMessage reduced={reduced} />
          </div>

          <div className="mt-6 h-2.5 overflow-hidden rounded-full border border-white/10 bg-slate-950 shadow-inner">
            <motion.div
              initial={{ width: "8%" }}
              animate={{ width: "100%" }}
              transition={{ duration, ease: "easeInOut" }}
              className="h-full rounded-full bg-gradient-to-r from-teal-300 via-cyan-200 to-amber-300 shadow-glow"
            />
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-slate-300">
            <Sparkles className="size-3.5 text-teal-100" aria-hidden="true" />
            Donnees locales
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function SplashMessage({ reduced }: { reduced: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;

    const intervalId = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % splashMessages.length);
    }, 520);

    return () => window.clearInterval(intervalId);
  }, [reduced]);

  if (reduced) return <span>Chargement de la guilde...</span>;

  return (
    <motion.span
      key="splash-message"
      animate={{ opacity: [0.65, 1, 0.65] }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
    >
      {splashMessages[messageIndex]}
    </motion.span>
  );
}

function SplashParticles() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 16 }).map((_, index) => (
        <motion.span
          key={index}
          className={cn(
            "absolute rounded-full",
            index % 3 === 0 ? "size-1.5 bg-amber-100/80" : "size-1 bg-teal-100/70"
          )}
          initial={{
            x: `${(index * 31) % 100}vw`,
            y: "105vh",
            opacity: 0,
            scale: 0.8
          }}
          animate={{
            y: "-8vh",
            opacity: [0, 1, 0],
            scale: [0.8, 1.35, 0.9]
          }}
          transition={{
            repeat: Infinity,
            duration: 2.8 + (index % 4) * 0.35,
            delay: index * 0.08,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}
