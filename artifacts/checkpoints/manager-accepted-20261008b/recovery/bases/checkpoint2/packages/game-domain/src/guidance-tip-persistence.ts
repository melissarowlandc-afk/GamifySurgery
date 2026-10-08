import { GUIDANCE_TIP_CATALOG, GUIDANCE_TIP_POLICY, type GuidanceTipId, type GuidanceTipFamily } from "@gamify-surgery/balance-config";
import type { GuidanceTipsState, GuidanceTipReceipt } from "./guidance-tip-types";

const record = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value));
const ids = new Set<string>(GUIDANCE_TIP_CATALOG.map((tip) => tip.id));
const families = new Set<string>(GUIDANCE_TIP_CATALOG.map((tip) => tip.family));

/** Unknown/missing versions start observing now, with no fabricated emissions. */
export function normalizeGuidanceTipsState(value: unknown, tick: number): GuidanceTipsState {
  const raw = record(value) && value.version === "guidance-tips.v1" ? value : {};
  const validTick = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= tick;
  const tickOrNull = (value: unknown) => validTick(value) ? value : null;
  const ticks = (value: unknown, allowed?: Set<string>): Record<string, number> => record(value) ? Object.fromEntries(Object.entries(value).filter((entry): entry is [string, number] => (!allowed || allowed.has(entry[0])) && validTick(entry[1]))) : {};
  const counts = record(raw.emissionCounts) ? Object.fromEntries(Object.entries(raw.emissionCounts).filter(([key, value]) => ids.has(key) && typeof value === "number" && Number.isSafeInteger(value) && value >= 0)) : {};
  const history: GuidanceTipReceipt[] = (Array.isArray(raw.history) ? raw.history : []).flatMap((entry): GuidanceTipReceipt[] => record(entry) &&
    typeof entry.id === "string" && /^tip\.occurrence\.\d+$/.test(entry.id) && typeof entry.tipId === "string" && ids.has(entry.tipId) &&
    typeof entry.targetKey === "string" && typeof entry.rootKey === "string" && validTick(entry.emittedAtTick) &&
    (entry.variant === "A" || entry.variant === "B") && typeof entry.message === "string" && typeof entry.speaker === "string"
    ? [{ id: entry.id, tipId: entry.tipId as GuidanceTipId, targetKey: entry.targetKey, rootKey: entry.rootKey, emittedAtTick: entry.emittedAtTick, variant: entry.variant, message: entry.message, speaker: entry.speaker }] : []).slice(-GUIDANCE_TIP_POLICY.historyLimit);
  const observations = record(raw.observations) ? Object.fromEntries(Object.entries(raw.observations).flatMap(([key, value]) =>
    record(value) && typeof value.signature === "string" && validTick(value.changedAtTick) ? [[key, { signature: value.signature, changedAtTick: value.changedAtTick }]] : [])) : {};
  const rootLocks = record(raw.rootLocks) ? Object.fromEntries(Object.entries(raw.rootLocks).flatMap(([key, value]) =>
    record(value) && typeof value.tipId === "string" && ids.has(value.tipId) && typeof value.targetKey === "string"
      ? [[key, { tipId: value.tipId as GuidanceTipId, targetKey: value.targetKey }]] : [])) : {};
  return { version: "guidance-tips.v1", initializedAtTick: validTick(raw.initializedAtTick) ? raw.initializedAtTick : tick,
    introductoryCompletedAtTick: tickOrNull(raw.introductoryCompletedAtTick), eligibleSince: ticks(raw.eligibleSince),
    lastEmittedById: ticks(raw.lastEmittedById, ids) as Partial<Record<GuidanceTipId, number>>,
    lastEmittedByFamily: ticks(raw.lastEmittedByFamily, families) as Partial<Record<GuidanceTipFamily, number>>,
    emissionCounts: counts, rollingEmissionTicks: (Array.isArray(raw.rollingEmissionTicks) ? raw.rollingEmissionTicks : []).filter(validTick).filter((time) => tick - time < GUIDANCE_TIP_POLICY.rollingWindowMinutes),
    lastEmittedAtTick: tickOrNull(raw.lastEmittedAtTick), lastDireAtTick: tickOrNull(raw.lastDireAtTick), observations, rootLocks,
    taughtServiceSetups: Array.isArray(raw.taughtServiceSetups) ? [...new Set(raw.taughtServiceSetups.filter((entry): entry is string => typeof entry === "string"))] : [],
    sequence: Math.max(typeof raw.sequence === "number" && Number.isSafeInteger(raw.sequence) && raw.sequence >= 0 ? raw.sequence : 0, ...history.map((entry) => Number(entry.id.split(".").at(-1)) + 1)), history };
}
