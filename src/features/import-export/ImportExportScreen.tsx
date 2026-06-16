import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileJson, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createBackupFileName,
  createFullBackup,
  importFullBackup,
  summarizeBackup,
  validateBackup,
  type GuildQuestBackup
} from "@/storage/repositories/backup.repository";

type ImportExportScreenProps = {
  onBackSettings: () => void;
  onBackHome: () => void;
  onImported: () => Promise<void>;
  onResetAll: () => void;
};

type ImportState = {
  backup?: GuildQuestBackup;
  summary?: ReturnType<typeof summarizeBackup>;
  error?: string;
  success?: string;
};

export function ImportExportScreen({ onBackSettings, onBackHome, onImported, onResetAll }: ImportExportScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ImportState>({});
  const [busy, setBusy] = useState(false);

  const exportBackup = async () => {
    setBusy(true);
    try {
      const backup = await createFullBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = createBackupFileName();
      link.click();
      URL.revokeObjectURL(url);
      setState({ success: "Export JSON complet genere." });
    } catch (error) {
      setState({ error: error instanceof Error ? error.message : "Export impossible." });
    } finally {
      setBusy(false);
    }
  };

  const readImportFile = async (file: File) => {
    setBusy(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;

      if (!validateBackup(parsed)) {
        setState({ error: "Ce fichier n'est pas une sauvegarde GuildQuest valide." });
        return;
      }

      setState({
        backup: parsed,
        summary: summarizeBackup(parsed),
        success: "Sauvegarde reconnue. Confirme l'import pour remplacer les donnees locales."
      });
    } catch {
      setState({ error: "JSON invalide ou fichier illisible." });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const confirmImport = async () => {
    if (!state.backup) return;

    const confirmed = window.confirm("Cette action remplacera ta progression locale actuelle. Continuer ?");
    if (!confirmed) return;

    setBusy(true);
    try {
      await importFullBackup(state.backup);
      await onImported();
      setState({ success: "Sauvegarde importee. Les donnees locales ont ete rechargees." });
    } catch (error) {
      setState({ error: error instanceof Error ? error.message : "Import impossible." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-3xl space-y-5"
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Donnees locales</p>
          <h1 className="text-3xl font-black text-white">Import / Export</h1>
          <p className="mt-2 text-sm text-slate-300">Sauvegarde et restaure GuildQuest sans backend.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="guild" onClick={onBackSettings}>Parametres</Button>
          <Button variant="guild" onClick={onBackHome}>
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Hall
          </Button>
        </div>
      </header>

      <article className="rounded-lg border border-white/10 bg-slate-900/90 p-5">
        <h2 className="text-xl font-black text-white">Export JSON complet</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Inclut joueur, progression quiz, collection, gacha, badges, titres, preferences et packs installes.
          Les images privees ne sont pas incluses.
        </p>
        <Button className="mt-4 w-full sm:w-auto" onClick={exportBackup} disabled={busy}>
          <FileJson className="mr-2 size-4" aria-hidden="true" />
          Export complet
        </Button>
      </article>

      <article className="rounded-lg border border-white/10 bg-slate-900/90 p-5">
        <h2 className="text-xl font-black text-white">Import JSON</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Choisis un fichier `.json` GuildQuest. L'import ne sera applique qu'apres confirmation.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void readImportFile(file);
          }}
        />
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button variant="guild" onClick={() => inputRef.current?.click()} disabled={busy}>
            <Upload className="mr-2 size-4" aria-hidden="true" />
            Choisir une sauvegarde
          </Button>
          <Button onClick={confirmImport} disabled={busy || !state.backup}>
            <RefreshCw className="mr-2 size-4" aria-hidden="true" />
            Confirmer l'import
          </Button>
        </div>
      </article>

      {state.summary && (
        <article className="rounded-lg border border-teal-200/20 bg-teal-300/10 p-5">
          <h2 className="text-xl font-black text-white">Resume detecte</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SummaryLine label="Exportee le" value={new Date(state.summary.exportedAt).toLocaleString("fr-FR")} />
            <SummaryLine label="Version backup" value={state.summary.backupVersion} />
            <SummaryLine label="Joueurs" value={state.summary.playerCount} />
            <SummaryLine label="Personnages" value={state.summary.characterCount} />
            <SummaryLine label="Progressions quiz" value={state.summary.quizProgressCount} />
            <SummaryLine label="Tirages gacha" value={state.summary.gachaPullCount} />
            <SummaryLine label="Badges" value={state.summary.badgeCount} />
            <SummaryLine label="Titres" value={state.summary.titleCount} />
          </div>
        </article>
      )}

      {(state.error || state.success) && (
        <div className={`rounded-lg border p-3 text-sm font-semibold ${
          state.error ? "border-red-300/30 bg-red-400/10 text-red-100" : "border-teal-300/30 bg-teal-300/10 text-teal-50"
        }`}>
          {state.error ?? state.success}
        </div>
      )}

      <article className="rounded-lg border border-red-300/30 bg-red-400/10 p-5">
        <h2 className="text-xl font-black text-white">Reset local</h2>
        <p className="mt-2 text-sm leading-6 text-red-50">
          Efface toutes les donnees GuildQuest locales et recree le joueur `leb` niveau 1 avec 200 gemmes.
        </p>
        <Button variant="secondary" className="mt-4 w-full sm:w-auto" onClick={onResetAll}>
          Reinitialiser toute l'application
        </Button>
      </article>
    </motion.section>
  );
}

function SummaryLine({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-white/[0.06] p-3">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
