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
};

export function CharacterImage({
  character,
  className,
  fallbackClassName,
  alt,
  preferPrivateImage = true
}: CharacterImageProps) {
  const preferredSrc = preferPrivateImage ? character?.image : character?.placeholderImage;
  const fallbackSrc = character?.placeholderImage || "/pwa.svg";
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const preferredFailed = preferredSrc ? failedSources.includes(preferredSrc) : true;
  const fallbackFailed = failedSources.includes(fallbackSrc);
  const src = preferredSrc && !preferredFailed ? preferredSrc : fallbackFailed ? "/pwa.svg" : fallbackSrc;
  const shouldUseMagicPlaceholder = !character || (preferredFailed && fallbackSrc === "/pwa.svg") || fallbackFailed;
  const initials = character?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "GQ";

  const handleError = () => {
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
      className={cn(className, !character && fallbackClassName)}
    />
  );
}
