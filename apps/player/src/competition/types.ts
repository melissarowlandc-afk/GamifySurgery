export const COMPETITION_PRIVACY_NOTICE = "Your clinic's name, level and average daily revenue are shown to other invited players in Clinic Competition. You can hide your clinic.";
export const MAX_DAILY_REVENUE_CENTS = 100_000_000_000;

export interface CompetitionSubmission {
  campaignId: string;
  clinicName: string;
  facilityLevel: number;
  averageDailyRevenueCents: number;
  daysCounted: number;
  completedDay: number;
}
export interface CompetitionRow {
  rank: number | null;
  clinicName: string;
  facilityLevel: number;
  averageDailyRevenueCents: number;
  daysCounted: number;
  isSelf: boolean;
}
export interface CompetitionBoard { hidden: boolean; rows: CompetitionRow[] }
export interface CompetitionTransport {
  submit(value: CompetitionSubmission): Promise<void>;
  leaderboard(): Promise<CompetitionBoard>;
  setHidden(hidden: boolean): Promise<void>;
}
/** Permanent admission/deletion failure: discard this account's pending data. */
export class CompetitionAccessError extends Error {}
/** Invalid client-reported data must not prevent later clinics from uploading. */
export class CompetitionValidationError extends Error {}

export function validClinicName(name: unknown): name is string {
  return typeof name === "string" && name === name.trim() && Array.from(name).length >= 1 &&
    Array.from(name).length <= 60 && !/[\u0000-\u001f\u007f-\u009f]/u.test(name);
}
export function isCompetitionSubmission(value: unknown): value is CompetitionSubmission {
  if (!value || typeof value !== "object") return false;
  const v = value as CompetitionSubmission;
  return typeof v.campaignId === "string" && new TextEncoder().encode(v.campaignId).length >= 1 &&
    new TextEncoder().encode(v.campaignId).length <= 256 && !/[\u0000-\u001f\u007f-\u009f]/u.test(v.campaignId) &&
    validClinicName(v.clinicName) && Number.isInteger(v.facilityLevel) && v.facilityLevel >= 0 && v.facilityLevel <= 5 &&
    Number.isSafeInteger(v.averageDailyRevenueCents) && v.averageDailyRevenueCents >= 0 && v.averageDailyRevenueCents <= MAX_DAILY_REVENUE_CENTS &&
    Number.isInteger(v.completedDay) && v.completedDay >= 1 && v.completedDay <= 10_000_000 &&
    Number.isInteger(v.daysCounted) && v.daysCounted >= 1 && v.daysCounted <= Math.min(3, v.completedDay);
}
