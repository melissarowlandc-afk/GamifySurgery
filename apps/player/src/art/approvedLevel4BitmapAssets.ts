import type { BitmapAssetDescriptor } from "./bitmapAssetManifest";
import mri from "./level4/mri.json";
import pediatricWaiting from "./level4/pediatric-waiting.json";
import pediatricExam from "./level4/pediatric-exam.json";
import woundOstomy from "./level4/wound-ostomy.json";

/** Native approved bytes; per-room records retain approval lineage. */
export const APPROVED_LEVEL4_BITMAP_ASSETS = [...mri, ...pediatricWaiting, ...pediatricExam, ...woundOstomy] as readonly BitmapAssetDescriptor[];
