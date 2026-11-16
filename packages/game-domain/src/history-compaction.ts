import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { retireFinishedRetailHistory, retireFinishedServiceHistory } from "./retired-service-history";
import type { DomainContext, GameState } from "./types";

export const RETAINED_CONCEPT_REVIEW_LOGS = 3;
export const RETAINED_FILED_DISCUSSIONS = 20;
const RETAINED_REVIEW_INTENTS = 32;
const terminal = (status: string) => ["completed", "cancelled", "abandoned"].includes(status);
const summary = (state: GameState) => state.historyCompaction ??= { version: "history-compaction.v1" };

function validateCounts(state: GameState): void {
  const count = (value: unknown) => value === undefined || Number.isSafeInteger(value) && Number(value) >= 0;
  const s = state.historyCompaction;
  if (s !== undefined && (!s || typeof s !== "object" || s.version !== "history-compaction.v1" || !count(s.retiredReviewIntentCount) || !count(s.completedQiReviewCount) ||
      s.settlements && (!count(s.settlements.count) || !Number.isSafeInteger(s.settlements.netCents) || !Number.isSafeInteger(s.settlements.grossCents)) ||
      s.outsideReadReceipts && (!Array.isArray(s.outsideReadReceipts) || s.outsideReadReceipts.some(row => !Array.isArray(row) || row.length !== 3 ||
        !Number.isSafeInteger(row[0]) || row[0] < 0 || !Number.isSafeInteger(row[1]) || row[1] < 1 || !Number.isSafeInteger(row[2]) || row[2] < 0)))) {
    throw new Error("The saved compact history is invalid.");
  }
  for (const history of Object.values(state.learningHistories)) if (!count(history.retiredReviewCount)) throw new Error("The saved learning review count is invalid.");
}

/** Only reducer/load-owned branches are changed. Shared immutable learning is
 * replaced, never mutated. The exact FSRS card object and stable IDs survive. */
export function compactCampaignHistory(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): boolean {
  validateCounts(state);
  let changed = false;
  let histories = state.learningHistories;
  for (const [id, history] of Object.entries(histories)) {
    const excess = history.reviews.length - RETAINED_CONCEPT_REVIEW_LOGS;
    if (excess <= 0) continue;
    if (histories === state.learningHistories) histories = { ...histories };
    histories[id] = { ...history, reviews: history.reviews.slice(excess),
      retiredReviewCount: (history.retiredReviewCount ?? 0) + excess };
    changed = true;
  }
  state.learningHistories = histories;

  const liveSubjects = new Set<string>();
  const add = (id: string | null | undefined) => { if (id) liveSubjects.add(id); };
  add(state.openEmployeeDiscussionId); add(state.openChartEncounterId); add(state.attendedEncounterId);
  for (const activity of [state.environment.founderActivity, state.environment.suspendedFounderActivity, state.environment.pendingFounderConsult]) add(activity?.targetId);
  for (const employee of state.employees) add(employee.facilityTask?.targetId);
  for (const operation of state.serviceOperations) if (!terminal(operation.status)) add(operation.actorId);
  for (const trip of state.retailOperations) if (!terminal(trip.status)) add(trip.actorId);
  for (const trip of state.patientAmenityTrips ?? []) add(trip.actorId);
  for (const question of state.levelFive?.inspection.run?.accumulators.presentedQuestions ?? []) add(question.subjectId);
  const discussions = Object.values(state.employeeDiscussions ?? {});
  const filed = discussions.filter(d => d.lifecycle === "resolved").sort((a, b) =>
    (b.resolvedAtFacilityTick ?? -1) - (a.resolvedAtFacilityTick ?? -1) || b.createdAtFacilityTick - a.createdAtFacilityTick || a.id.localeCompare(b.id));
  const removable = new Set(filed.slice(RETAINED_FILED_DISCUSSIONS).filter(d => !liveSubjects.has(d.id) &&
    d.frozenCase.decisionNodes.every(node => d.answers.some(answer => answer.decisionNodeId === node.id) ||
      d.steps.some(step => step.decisionNodeId === node.id && step.answer))).map(d => d.id));
  if (removable.size) {
    state.employeeDiscussions = Object.fromEntries(Object.entries(state.employeeDiscussions!).filter(([id]) => !removable.has(id)));
    changed = true;
  }

  // Retain exact details for every remaining chart/discussion, plus a recent
  // tail. The scalar replaces only old score/timestamp offsets, not learning.
  const subjects = new Set([...Object.keys(state.encounters), ...Object.keys(state.employeeDiscussions ?? {})]);
  const removedIntents = state.reviewIntents.filter((row, index) =>
    index < state.reviewIntents.length - RETAINED_REVIEW_INTENTS && !subjects.has(row.encounterId));
  if (removedIntents.length) {
    const remove = new Set(removedIntents);
    state.reviewIntents = state.reviewIntents.filter(row => !remove.has(row));
    const s = summary(state); s.retiredReviewIntentCount = (s.retiredReviewIntentCount ?? 0) + remove.size;
    changed = true;
  }
  const dayMinutes = (context.balanceRelease.clock.dayEndHour - context.balanceRelease.clock.dayStartHour) * 60;
  // Competition can request three completed calendar days, plus the current
  // partial day. A rolling three-day cutoff drops part of its oldest day.
  const settlementWindowStart = Math.floor(state.facilityTick / dayMinutes) * dayMinutes - dayMinutes * 3;
  const settlementGroups = new Map<string, typeof state.settlements>();
  for (const row of state.settlements) { const group = settlementGroups.get(row.id) ?? []; group.push(row); settlementGroups.set(row.id, group); }
  const removedSettlements = new Set<typeof state.settlements[number]>();
  let count = 0, netCents = 0, grossCents = 0;
  for (const group of settlementGroups.values()) {
    // Legacy duplicate rows have different raw-day versus deduplicated-income
    // semantics. Keep them verbatim rather than guess an aggregate projection.
    if (group.length !== 1) continue;
    if (group.some(row => subjects.has(row.encounterId) || row.settledAtFacilityTick >= settlementWindowStart)) continue;
    for (const row of group) removedSettlements.add(row);
    count += group.length;
    netCents += Math.round(group[0]!.netCashDelta * 100);
    grossCents += Math.round(group[0]!.completionRevenue * 100) + Math.round(group[0]!.qualityRevenueBonus * 100);
  }
  if (count) {
    state.settlements = state.settlements.filter(row => !removedSettlements.has(row));
    const s = summary(state), old = s.settlements;
    s.settlements = { count: (old?.count ?? 0) + count, netCents: (old?.netCents ?? 0) + netCents, grossCents: (old?.grossCents ?? 0) + grossCents };
    changed = true;
  }

  const serviceIds = new Set(state.serviceOperations.map(row => row.id));
  const actorIds = new Set(state.retailExternalActors.map(row => row.id));
  if (state.pediatricFamilies) {
    const families = Object.entries(state.pediatricFamilies).filter(([, family]) =>
      family.phase !== "departed" || subjects.has(family.child.id) || serviceIds.has(family.child.id) || actorIds.has(family.parentActorId) ||
      liveSubjects.has(family.id) || liveSubjects.has(family.child.id) || liveSubjects.has(family.parentActorId));
    if (families.length !== Object.keys(state.pediatricFamilies).length) { state.pediatricFamilies = Object.fromEntries(families); changed = true; }
  }
  const present = new Set<string>(["founder:founder"]);
  for (const employee of state.employees) present.add(`employee:${employee.id}`);
  // A retained offsite/terminal record may still own a continuation or companion
  // guard. Prune only actors whose source record is gone, not just off the map.
  for (const id of Object.keys(state.encounters)) present.add(`encounter:${id}`);
  for (const operation of state.serviceOperations) present.add(`service_visitor:${operation.id}`);
  for (const actor of state.retailExternalActors) present.add(`${actor.kind}:${actor.id}`);
  for (const employee of state.departingEmployees ?? []) present.add(`employee:${employee.id}`);
  for (const trip of state.retailOperations) if (!terminal(trip.status)) present.add(`${trip.actorKind}:${trip.actorId}`);
  for (const trip of state.patientAmenityTrips ?? []) present.add(`${trip.actorKind}:${trip.actorId}`);
  const trimActorMap = <T>(map: Record<string, T>): Record<string, T> => {
    const entries = Object.entries(map).filter(([key]) => present.has(key));
    if (entries.length === Object.keys(map).length) return map;
    changed = true; return Object.fromEntries(entries);
  };
  state.retailActorLedgers = trimActorMap(state.retailActorLedgers);
  state.retailNextOpportunityTicks = trimActorMap(state.retailNextOpportunityTicks);
  if (state.patientAmenityNextOpportunityTicks) state.patientAmenityNextOpportunityTicks = trimActorMap(state.patientAmenityNextOpportunityTicks);

  const rooms = new Set(state.rooms.map(room => room.id)), employees = new Set(state.employees.map(employee => employee.id));
  const targetExists = (key: string) => key.startsWith("room:") ? rooms.has(key.slice(5)) : key.startsWith("employee:") ? employees.has(key.slice(9)) : true;
  const tips = state.alertHumor.guidanceTips;
  if (tips) {
    const trimTargets = <T>(map: Record<string, T>): Record<string, T> => {
      const entries = Object.entries(map).filter(([key]) => targetExists(key));
      if (entries.length === Object.keys(map).length) return map;
      changed = true; return Object.fromEntries(entries);
    };
    tips.observations = trimTargets(tips.observations); tips.rootLocks = trimTargets(tips.rootLocks);
  }

  // Known use-key dialects cannot execute once their source operation retired.
  // Unknown legacy keys are conservatively preserved. Counts/maintenance state
  // survive, including repairs and sale/rebuild protection for retained sources.
  const retailIds = new Set(state.retailOperations.map(row => row.id));
  const keepUseKey = (key: string) => {
    if (key.startsWith("retail:")) return retailIds.has(key.slice(7));
    const match = /^service:(.+):phase:\d+$/.exec(key);
    return !match || serviceIds.has(match[1]!);
  };
  const keys = state.levelThreeMaintenanceAppliedUseKeys.filter(keepUseKey);
  if (keys.length !== state.levelThreeMaintenanceAppliedUseKeys.length) { state.levelThreeMaintenanceAppliedUseKeys = keys; changed = true; }
  for (const room of state.rooms) if (room.maintenance) {
    const kept = room.maintenance.appliedUseKeys.filter(keepUseKey);
    if (kept.length !== room.maintenance.appliedUseKeys.length) { room.maintenance = { ...room.maintenance, appliedUseKeys: kept }; changed = true; }
  }
  const receiptIds = new Set(state.serviceIncomeReceipts.map(row => row.id));
  const completed = state.levelThreeQiReviews.filter(row => row.status === "completed");
  const newestQi = new Set(completed.slice(-10));
  const retiredQi = new Set(completed.filter(row => !newestQi.has(row) && !receiptIds.has(row.receiptId) && !liveSubjects.has(row.id)));
  if (retiredQi.size) {
    state.levelThreeQiReviews = state.levelThreeQiReviews.filter(row => !retiredQi.has(row));
    const s = summary(state); s.completedQiReviewCount = (s.completedQiReviewCount ?? 0) + retiredQi.size; changed = true;
  }
  return changed;
}

/** Session/save ownership boundary. No writes to an immutable proof/cache or
 * caller state, and no large serialized scratch copy. Retirement only replaces
 * rows/maps; maintenance/guidance branches below are explicitly forked. */
export function compactGameState(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  validateCounts(state);
  const tips = state.alertHumor.guidanceTips;
  const next: GameState = { ...state,
    rooms: state.rooms.map(room => room.maintenance ? { ...room, maintenance: { ...room.maintenance } } : room),
    retailActorLedgers: { ...state.retailActorLedgers }, retailNextOpportunityTicks: { ...state.retailNextOpportunityTicks },
    ...(state.patientAmenityNextOpportunityTicks ? { patientAmenityNextOpportunityTicks: { ...state.patientAmenityNextOpportunityTicks } } : {}),
    ...(state.retiredServiceHistory ? { retiredServiceHistory: { ...state.retiredServiceHistory } } : {}),
    ...(state.historyCompaction ? { historyCompaction: { ...state.historyCompaction } } : {}),
    alertHumor: { ...state.alertHumor, ...(tips ? { guidanceTips: { ...tips } } : {}) },
  };
  const before = [next.serviceIncomeReceipts, next.serviceOperations, next.retailOperations, next.retailExternalActors, next.retailOrders];
  const beforeTotals = JSON.stringify(next.retiredServiceHistory), beforeBuckets = next.historyCompaction?.outsideReadReceipts;
  retireFinishedServiceHistory(next, context); retireFinishedRetailHistory(next);
  const changed = compactCampaignHistory(next, context);
  return changed || before.some((rows, i) => rows.length !== [next.serviceIncomeReceipts, next.serviceOperations, next.retailOperations, next.retailExternalActors, next.retailOrders][i]!.length) ||
    JSON.stringify(next.retiredServiceHistory) !== beforeTotals || beforeBuckets !== next.historyCompaction?.outsideReadReceipts ? next : state;
}
