import { DCIS } from "./dcis";
import { PALPABLE_BREAST } from "./palpable-breast";
import { MALIGNANT_POLYP } from "./malignant-polyp";
import { DIALYSIS_NUTRITION } from "./dialysis-nutrition";
import { RECURRENT_GASTRIC_ULCER } from "./recurrent-gastric-ulcer";
import { URGENT_FAMILIES } from "./urgent-families";
export const NONURGENT_FAMILIES=[DCIS,PALPABLE_BREAST,MALIGNANT_POLYP,DIALYSIS_NUTRITION,RECURRENT_GASTRIC_ULCER];
export const ALL_FAMILIES=[...NONURGENT_FAMILIES,...URGENT_FAMILIES];
