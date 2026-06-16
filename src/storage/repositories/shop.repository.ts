import type { Player, ShopItem, ShopPurchase } from "@/domain/models";
import { applyRewardsToPlayerDetailed } from "@/domain/progression/level.service";
import { db } from "@/storage/db";

export async function getStoredShopPurchases() {
  return db.shopPurchases.orderBy("purchasedAt").reverse().toArray();
}

export async function purchaseShopItem(player: Player, item: ShopItem) {
  if (player.gems < item.costGems) {
    throw new Error("Gemmes insuffisantes pour cet achat.");
  }

  const randomBonus = item.reward.random ? Math.floor(Math.random() * 41) : 0;
  const xpGained = (item.reward.xp ?? 0) + randomBonus;
  const magicDustGained = (item.reward.magicDust ?? 0) + (item.reward.random ? Math.floor(Math.random() * 31) : 0);
  const paidPlayer = {
    ...player,
    gems: player.gems - item.costGems,
    updatedAt: new Date().toISOString()
  };
  const rewardApplication = applyRewardsToPlayerDetailed(paidPlayer, xpGained, 0);
  const updatedPlayer: Player = {
    ...rewardApplication.player,
    magicDust: (rewardApplication.player.magicDust ?? 0) + magicDustGained,
    updatedAt: new Date().toISOString()
  };
  const purchase: ShopPurchase = {
    id: `shop-${Date.now()}-${item.id}`,
    itemId: item.id,
    costGems: item.costGems,
    xpGained,
    magicDustGained,
    purchasedAt: new Date().toISOString()
  };

  await Promise.all([db.player.put(updatedPlayer), db.shopPurchases.put(purchase)]);

  return { player: updatedPlayer, purchase };
}
