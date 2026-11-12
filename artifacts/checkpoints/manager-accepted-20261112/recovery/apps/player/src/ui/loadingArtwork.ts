import manifest from "../../public/art/welcome/manifest.json";

/** Public paths stay relative so welcome art also works under GitHub Pages. */
export const loadingArtwork = manifest;
export const PORTRAIT_ART_MEDIA = "(max-aspect-ratio: 1/1)";
export const LANDSCAPE_ART_MEDIA = "(aspect-ratio > 1/1)";
// A compact header must leave room for both campaign rows and the footer.
// Smaller/shorter phones use the wide composition instead of cropping people.
export const ENTRANCE_PORTRAIT_MEDIA = "(max-width: 600px) and (min-height: 840px) and (max-aspect-ratio: 47/100)";
export const ENTRANCE_LANDSCAPE_MEDIA = `not all and ${ENTRANCE_PORTRAIT_MEDIA}`;
export type WelcomeArtVariant = keyof typeof loadingArtwork.variants;

/** Matches the picture/preload media queries, including the square boundary. */
export function welcomeArtVariant(width: number, height: number): WelcomeArtVariant {
  return width > height ? "landscape" : "portrait";
}

export function welcomeEntranceVariant(width: number, height: number): WelcomeArtVariant {
  return width <= 600 && height >= 840 && width / height <= 0.47 ? "portrait" : "landscape";
}
