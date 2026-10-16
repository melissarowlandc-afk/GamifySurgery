import type { BitmapAssetDescriptor } from "./bitmapAssetManifest";
import founder from "./level5/founders-office.json";
import executive from "./level5/executive-office.json";
import gift from "./level5/gift-shop.json";
import garden from "./level5/indoor-garden.json";
import gym from "./level5/staff-gym.json";

/** Separate pack: Level 0-4 retain the original desktop eager asset set. */
export const APPROVED_LEVEL5_BITMAP_ASSETS = [...founder, ...executive, ...gift, ...garden, ...gym] as readonly BitmapAssetDescriptor[];
