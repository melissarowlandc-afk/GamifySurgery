import type { CSSProperties } from "react";
import { ENTRANCE_LANDSCAPE_MEDIA, ENTRANCE_PORTRAIT_MEDIA, LANDSCAPE_ART_MEDIA, loadingArtwork, PORTRAIT_ART_MEDIA, welcomeArtVariant, welcomeEntranceVariant } from "./loadingArtwork";
import "./WelcomeArtwork.css";

// Keep the welcome palette independent of shell/theme colours. Every piece of
// text has an opaque, contrasting surface, even before the image has decoded.
export const welcomeSurfaceStyle = {
  "--welcome-background": loadingArtwork.palette.background,
  "--welcome-ink": loadingArtwork.palette.ink,
  "--welcome-panel": loadingArtwork.palette.panel,
  "--welcome-bar-track": loadingArtwork.palette.barTrack,
  "--welcome-bar-fill": loadingArtwork.palette.barFill,
} as CSSProperties;

/** Full loading art or a header that clips only the quiet lower band. */
export function WelcomeArtwork({ className = "", decorative = false, entrance = false }: { className?: string; decorative?: boolean; entrance?: boolean | "wide" }) {
  const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
  const select = entrance ? welcomeEntranceVariant : welcomeArtVariant;
  const fallback = loadingArtwork.variants[entrance === "wide" || typeof window === "undefined" ? "landscape" : select(window.innerWidth, window.innerHeight)];
  return <picture className={`welcome-art ${className}`} data-welcome-art={loadingArtwork.id} aria-hidden={decorative || undefined}
    data-welcome-composition={entrance === "wide" ? "entrance-wide" : entrance ? "entrance" : "full"} style={entrance ? {
      "--welcome-wide-ratio": `${loadingArtwork.variants.landscape.width} / ${loadingArtwork.variants.landscape.entranceCropHeight}`,
      "--welcome-tall-ratio": `${loadingArtwork.variants.portrait.width} / ${loadingArtwork.variants.portrait.entranceCropHeight}`,
    } as CSSProperties : undefined}>
    {entrance !== "wide" ? <source media={entrance ? ENTRANCE_PORTRAIT_MEDIA : PORTRAIT_ART_MEDIA} srcSet={asset(loadingArtwork.variants.portrait.src)}
      width={loadingArtwork.variants.portrait.width} height={loadingArtwork.variants.portrait.height} /> : null}
    {entrance !== "wide" ? <source media={entrance ? ENTRANCE_LANDSCAPE_MEDIA : LANDSCAPE_ART_MEDIA} srcSet={asset(loadingArtwork.variants.landscape.src)}
      width={loadingArtwork.variants.landscape.width} height={loadingArtwork.variants.landscape.height} /> : null}
    <img src={asset(fallback.src)} alt={decorative ? "" : loadingArtwork.alt} width={fallback.width} height={fallback.height}
      decoding="async" loading="eager" fetchPriority="high" draggable={false} />
  </picture>;
}
