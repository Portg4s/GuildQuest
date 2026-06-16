import { useState } from "react";
import type { Character } from "@/domain/models";
import { rarityCardClasses } from "@/components/game/rarity-styles";
import { cn } from "@/lib/utils";

type CharacterImageProps = {
  character?: Character;
  className?: string;
  fallbackClassName?: string;
  alt?: string;
  preferPrivateImage?: boolean;
  eager?: boolean;
};

export function CharacterImage({
  character,
  className,
  fallbackClassName,
  alt,
  preferPrivateImage = true,
  eager = false
}: CharacterImageProps) {
  const pwaFallbackSrc = resolvePublicAssetPath("/pwa.svg") ?? "/pwa.svg";
  const preferredSrc = resolvePublicAssetPath(preferPrivateImage ? character?.image : character?.placeholderImage);
  const fallbackSrc = resolvePublicAssetPath(character?.placeholderImage || "/pwa.svg") ?? pwaFallbackSrc;
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const preferredFailed = preferredSrc ? failedSources.includes(preferredSrc) : true;
  const fallbackFailed = failedSources.includes(fallbackSrc);
  const src = preferredSrc && !preferredFailed ? preferredSrc : fallbackFailed ? pwaFallbackSrc : fallbackSrc;
  const shouldUseMagicPlaceholder = !character || (preferredFailed && fallbackSrc === pwaFallbackSrc) || fallbackFailed;
  const initials = character?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "GQ";

  const handleError = () => {
    if (!src) {
      return;
    }

    setFailedSources((current) => (current.includes(src) ? current : [...current, src]));
  };

  if (shouldUseMagicPlaceholder) {
    return (
      <div
        role="img"
        aria-label={alt ?? character?.name ?? "Placeholder magique GuildQuest"}
        className={cn(
          "relative isolate grid place-items-center overflow-hidden rounded-lg border text-white",
          character ? rarityCardClasses[character.rarity] : "border-teal-200/30 bg-teal-300/10",
          className,
          !character && fallbackClassName
        )}
      >
        <div className="absolute inset-2 rounded-full border border-white/15 rune-mark opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.22),transparent_36%)]" />
        <span className="relative text-lg font-black tracking-[0.08em] text-white drop-shadow">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? character?.name ?? ""}
      onError={handleError}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={cn("object-cover", className, !character && fallbackClassName)}
    />
  );
}

function resolvePublicAssetPath(src?: string) {
  if (!src || src.startsWith("http") || src.startsWith("data:") || src.startsWith(import.meta.env.BASE_URL)) {
    return src;
  }

  if (src.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${src.slice(1)}`;
  }

  return src;
}
