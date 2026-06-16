import { motion } from "framer-motion";
import { ArrowLeft, Gem, PackageOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shopItems } from "@/data/config/shop.config";
import type { Player, ShopItem, ShopPurchase } from "@/domain/models";

type ShopScreenProps = {
  player: Player;
  lastPurchase?: ShopPurchase;
  message?: string;
  onBackHome: () => void;
  onPurchase: (item: ShopItem) => void;
};

export function ShopScreen({ player, lastPurchase, message, onBackHome, onPurchase }: ShopScreenProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl space-y-3"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Comptoir de guilde</p>
          <h1 className="guild-title text-2xl">Boutique</h1>
          <p className="mt-1 text-sm text-slate-300">Achats offline avec gemmes. Recompenses modestes, utiles pour tester.</p>
        </div>
        <Button variant="guild" onClick={onBackHome}>
          <ArrowLeft className="mr-2 size-4" />
          Hall
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <Resource label="Gemmes" value={player.gems} icon={<Gem className="size-5" />} />
        <Resource label="Poussiere" value={player.magicDust ?? 0} icon={<Sparkles className="size-5" />} />
      </div>

      {message && (
        <div className="rounded-lg border border-teal-300/30 bg-teal-300/10 p-3 text-sm font-semibold text-teal-50">
          {message}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {shopItems.map((item) => (
          <article key={item.id} className="guild-panel magic-border flex flex-col p-4">
            <PackageOpen className="size-8 text-amber-100" />
            <h2 className="mt-3 text-lg font-black text-white">{item.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-300">{item.description}</p>
            <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-sm">
              <p className="font-black text-amber-100">{item.costGems} gemmes</p>
              <p className="mt-1 text-slate-300">
                {item.reward.xp ? `+${item.reward.xp} XP ` : ""}
                {item.reward.magicDust ? `+${item.reward.magicDust} poussiere` : ""}
                {item.reward.random ? " + bonus aleatoire" : ""}
              </p>
            </div>
            <Button className="mt-4 w-full" disabled={player.gems < item.costGems} onClick={() => onPurchase(item)}>
              Acheter
            </Button>
          </article>
        ))}
      </div>

      {lastPurchase && (
        <article className="guild-card border-amber-200/25 bg-amber-300/10 p-4">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Dernier achat</p>
          <p className="mt-2 text-white">
            +{lastPurchase.xpGained} XP, +{lastPurchase.magicDustGained} poussiere magique.
          </p>
        </article>
      )}
    </motion.section>
  );
}

function Resource({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="guild-card p-3">
      <div className="flex items-center gap-2 text-teal-100">{icon}<span className="text-sm text-slate-300">{label}</span></div>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
