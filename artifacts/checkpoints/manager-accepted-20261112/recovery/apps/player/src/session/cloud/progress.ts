import { getFacilityClock, type GameState } from "@gamify-surgery/game-domain";

export interface CloudProgressSummary {
  facilityTick: number;
  dayTime: string;
  cash: number;
  level: number;
  xp: number;
}
export interface CloudConflictCopies {
  device: CloudProgressSummary;
  account: CloudProgressSummary;
  accountRevision: string;
  newer: "device" | "account" | "same-time";
  canKeepDevice: boolean;
  canSaveSeparate?: boolean;
  separateCampaignSlots?: number;
}
export function cloudProgress(state: GameState): CloudProgressSummary {
  return { facilityTick: state.facilityTick, dayTime: getFacilityClock(state).displayLabel,
    cash: state.cash, level: state.facilityLevel, xp: state.clinicalXp };
}
