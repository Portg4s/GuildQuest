import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  Copy,
  Download,
  ExternalLink,
  RotateCcw,
  Shield,
  Smartphone,
  SlidersHorizontal,
  Volume2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CharacterRegistryInfo } from "@/data/characters/characters.registry";
import type { GameSettings, Player } from "@/domain/models";

type SettingsScreenProps = {
  player: Player;
  settings: GameSettings;
  appVersion: string;
  characterRegistryInfo: CharacterRegistryInfo;
  onBackHome: () => void;
  onOpenImportExport: () => void;
  onUpdateSettings: (settings: GameSettings) => void;
  onReplayOnboarding: () => void;
  onResetAll: () => void;
};

export function SettingsScreen({
  player,
  settings,
  appVersion,
  characterRegistryInfo,
  onBackHome,
  onOpenImportExport,
  onUpdateSettings,
  onReplayOnboarding,
  onResetAll
}: SettingsScreenProps) {
  const [localIp, setLocalIp] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const updateSettings = (patch: Partial<GameSettings>) => {
    onUpdateSettings({
      ...settings,
      ...patch,
      reducedMotion: patch.animationSpeed === "reduced" ? true : patch.reducedMotion ?? settings.reducedMotion,
      updatedAt: new Date().toISOString()
    });
  };
  const installUrl = localIp.trim() ? `http://${localIp.trim()}:5173` : "http://IP_DU_PC:5173";
  const copyInstallUrl = async () => {
    try {
      await navigator.clipboard.writeText(installUrl);
      setCopyStatus("URL copiee.");
    } catch {
      setCopyStatus("Copie indisponible, selectionne l'URL manuellement.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-3xl space-y-3"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">GuildQuest</p>
          <h1 className="guild-title text-2xl">Parametres</h1>
          <p className="mt-1 text-sm text-slate-300">Preferences locales et sauvegardes offline.</p>
        </div>
        <Button variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Hall
        </Button>
      </header>

      <article className="guild-card p-4">
        <h2 className="text-xl font-black text-white">Profil local</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <SettingStat label="Pseudo" value={player.username} />
          <SettingStat label="Rang" value={player.rank} />
          <SettingStat label="Niveau" value={player.level} />
          <SettingStat label="Version app" value={appVersion} />
        </div>
      </article>

      <article className="guild-card p-4">
        <h2 className="text-xl font-black text-white">Pack personnages local</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <SettingStat label="Etat" value={characterRegistryInfo.localPackDetected ? "Detecte" : "Absent"} />
          <SettingStat label="Personnages locaux" value={characterRegistryInfo.localCount} />
          <SettingStat label="Pack" value={characterRegistryInfo.localPackName ?? "Aucun pack local"} />
          <SettingStat label="Version" value={characterRegistryInfo.localPackVersion ?? "-"} />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-400">
          GitHub Pages utilise les placeholders CSS publics. `characters.local.ts` charge tes assets prives en local et reste ignore par Git.
        </p>
        {characterRegistryInfo.invalidLocalCount > 0 && (
          <p className="mt-3 rounded-lg border border-amber-200/25 bg-amber-300/10 p-3 text-sm font-semibold text-amber-100">
            {characterRegistryInfo.invalidLocalCount} entree(s) locale(s) ignoree(s). Verifie `characters.local.ts`.
          </p>
        )}
      </article>

      <article className="guild-card p-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-5 text-teal-100" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">Preferences</h2>
        </div>
        <div className="mt-3 space-y-2">
          <ToggleRow
            icon={<Volume2 className="size-5" />}
            label="Sons"
            description="Desactives par defaut pour une experience discrete."
            enabled={settings.soundEnabled}
            onToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          />
          <ToggleRow
            icon={<Zap className="size-5" />}
            label="Animations"
            description="Controle les animations d'interface."
            enabled={settings.animationsEnabled}
            onToggle={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
          />
          <ToggleRow
            icon={<Shield className="size-5" />}
            label="Ecran d'introduction"
            description="Affiche l'entree de guilde au lancement."
            enabled={settings.showIntroSplash}
            onToggle={() => updateSettings({ showIntroSplash: !settings.showIntroSplash })}
          />
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
            <p className="font-bold text-white">Tutoriel d'aventure</p>
            <p className="mt-1 text-sm text-slate-400">Revoir les bases de GuildQuest, missions, gacha, duel et sauvegarde.</p>
            <Button variant="guild" className="mt-3 w-full sm:w-auto" onClick={onReplayOnboarding}>
              Revoir le tutoriel
            </Button>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
            <p className="text-sm font-bold text-white">Vitesse animations</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["normal", "fast", "reduced"] as const).map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => updateSettings({ animationSpeed: speed, reducedMotion: speed === "reduced" })}
                  className={`rounded-lg border px-3 py-2 text-sm font-bold ${
                    settings.animationSpeed === speed
                      ? "border-teal-200 bg-teal-300 text-slate-950"
                      : "border-white/10 bg-slate-950/60 text-slate-200"
                  }`}
                >
                  {speed === "normal" ? "Normale" : speed === "fast" ? "Rapide" : "Reduite"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>

      <article className="guild-card magic-border border-teal-200/25 bg-teal-300/10 p-4">
        <h2 className="text-xl font-black text-white">Sauvegarde locale</h2>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          GuildQuest fonctionne offline, sans backend ni synchronisation cloud. Les donnees sont stockees
          localement via IndexedDB.
        </p>
        <Button className="mt-4 w-full sm:w-auto" onClick={onOpenImportExport}>
          <Download className="mr-2 size-4" aria-hidden="true" />
          Import / Export
        </Button>
      </article>

      <article className="guild-card p-4">
        <div className="flex items-center gap-2">
          <Smartphone className="size-5 text-teal-100" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">Installer sur telephone</h2>
        </div>
        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
          <p>Lance le serveur local avec `npm run dev -- --host 0.0.0.0`.</p>
          <p>Connecte le telephone au meme Wi-Fi, puis ouvre l'adresse locale du PC.</p>
          <p>Android/Chrome : menu puis Ajouter a l'ecran d'accueil.</p>
          <p>iPhone/Safari : Partager puis Sur l'ecran d'accueil.</p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            value={localIp}
            onChange={(event) => setLocalIp(event.target.value)}
            placeholder="IP locale du PC, ex: 192.168.1.42"
            className="h-10 rounded-lg border border-white/10 bg-slate-950/70 px-3 text-sm text-white outline-none focus:border-teal-200"
          />
          <Button variant="guild" onClick={copyInstallUrl}>
            <Copy className="mr-2 size-4" aria-hidden="true" />
            Copier l'URL
          </Button>
        </div>
        <p className="mt-2 rounded-lg border border-white/10 bg-white/[0.06] p-2 text-xs font-semibold text-slate-200">
          {installUrl}
        </p>
        {copyStatus && <p className="mt-2 text-xs font-semibold text-teal-100">{copyStatus}</p>}
        <p className="mt-3 text-xs leading-5 text-amber-100">
          Attention : `public/private-assets` est ignore par Git et reserve a l'usage local prive.
        </p>
      </article>

      <article className="guild-card border-cyan-200/20 bg-cyan-300/10 p-4">
        <div className="flex items-center gap-2">
          <ExternalLink className="size-5 text-cyan-100" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">Installation via GitHub Pages</h2>
        </div>
        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
          <p>
            Version publique prevue :{" "}
            <span className="font-bold text-cyan-100">https://portg4s.github.io/GuildQuest/</span>
          </p>
          <p>iPhone/Safari : ouvre l'URL, puis Partager et Sur l'ecran d'accueil.</p>
          <p>Android/Chrome : ouvre l'URL, puis menu et Ajouter a l'ecran d'accueil.</p>
          <p>
            Cette version publique utilise les placeholders CSS et n'inclut pas `public/private-assets`.
          </p>
          <p>
            Les donnees restent sur l'appareil via IndexedDB. Pense a exporter un JSON pour sauvegarder ta progression.
          </p>
        </div>
      </article>

      <article className="rounded-xl border border-red-300/30 bg-red-400/10 p-4 shadow-[0_0_26px_rgba(248,113,113,0.1)]">
        <h2 className="text-xl font-black text-white">Zone danger</h2>
        <p className="mt-2 text-sm leading-6 text-red-50">
          Le reset local efface progression, collection, gacha, badges, titres et preferences.
        </p>
        <Button variant="secondary" className="mt-4 w-full sm:w-auto" onClick={onResetAll}>
          <RotateCcw className="mr-2 size-4" aria-hidden="true" />
          Reinitialiser toute l'application
        </Button>
      </article>
    </motion.section>
  );
}

function SettingStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-2.5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  enabled,
  onToggle
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3">
      <div className="flex items-center gap-3">
        <div className="text-teal-100">{icon}</div>
        <div>
          <p className="font-bold text-white">{label}</p>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`h-8 w-14 rounded-full border p-1 transition ${
          enabled ? "border-teal-200 bg-teal-300" : "border-white/10 bg-slate-950"
        }`}
      >
        <span
          className={`block size-5 rounded-full bg-white transition ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
