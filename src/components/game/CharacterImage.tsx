import { useState } from "react";
import type { Character } from "@/domain/models";
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

  const handleError = () => {
    setFailedSources((current) => (current.includes(src) ? current : [...current, src]));
  };

  return (
    <img
      src={src}
      alt={alt ?? character?.name ?? ""}
      onError={handleError}
      className={cn(className, !character && fallbackClassName)}
    />
  );
}
