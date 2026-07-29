/**
 * Low-chroma stone-and-olive golden-slice palette.
 *
 * Historical semantic key names such as `olive` remain stable because they
 * are used throughout the repo-native sprite matrices. Their current values
 * follow the visual reference's ivory, weathered stone, gray-olive, muted
 * moss, and charcoal range without a dominant blue cast. Medical meaning and
 * alert priority never depend on color alone.
 */
export const PIXEL_PALETTE = {
  ink: "#232720",
  charcoal: "#343a32",
  deepOlive: "#4c5449",
  olive: "#666d60",
  moss: "#7e8476",
  sage: "#999e91",
  lightSage: "#b6b9aa",
  warmGray: "#cac8bb",
  paper: "#e0ded0",
  cream: "#f0eddd",
  highlight: "#faf7e8",
  shadow: "#383d36",
  skinLight: "#e4d1c4",
  skinMedium: "#c6a78f",
  skinDeep: "#98745f",
  skinDark: "#634b41",
  white: "#fffdf4",
} as const;

export type PixelColorKey = keyof typeof PIXEL_PALETTE;

export const PIXEL_PALETTE_NUMBER: Record<PixelColorKey, number> =
  Object.fromEntries(
    Object.entries(PIXEL_PALETTE).map(([key, value]) => [
      key,
      Number.parseInt(value.slice(1), 16),
    ]),
  ) as Record<PixelColorKey, number>;

export const SKIN_TONE_KEYS = [
  "skinLight",
  "skinMedium",
  "skinDeep",
  "skinDark",
] as const satisfies readonly PixelColorKey[];

export const HAIR_TONE_KEYS = [
  "paper",
  "moss",
  "deepOlive",
  "ink",
] as const satisfies readonly PixelColorKey[];

export const OUTFIT_TONE_KEYS = [
  "cream",
  "lightSage",
  "olive",
  "charcoal",
] as const satisfies readonly PixelColorKey[];
