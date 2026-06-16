export type ShopItemId = "magic-dust-small" | "training-chest" | "arcane-cache";

export type ShopItem = {
  id: ShopItemId;
  name: string;
  description: string;
  costGems: number;
  reward: {
    xp?: number;
    magicDust?: number;
    random?: boolean;
  };
};

export type ShopPurchase = {
  id: string;
  itemId: ShopItemId;
  costGems: number;
  xpGained: number;
  magicDustGained: number;
  purchasedAt: string;
};
