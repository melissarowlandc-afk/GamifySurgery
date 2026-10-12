import type {
  DailyManagementRoundState, ExecutiveEffectQuote, InspectionAccumulatorState,
  InspectionCategoryId, InspectionReportState, InspectionRunState, LevelFiveState,
} from "./level-five-types";

/** Versioned editorial report contract. M7 owns observation and score calculation. */
export const INSPECTION_CATEGORY_WEIGHTS = FACILITY_INSPECTION_RULES.categoryWeights satisfies Record<InspectionCategoryId, number>;

/** Explicit lazy defaults only; never called by ordinary state creation or legacy load. */
export function createLevelFiveState(): LevelFiveState {
  return {
    version: "level-five-state.v1",
    management: { version: "daily-management.v1", round: null, lastCompletedDayNumber: null,
      activeTerms: null, supplierSavings: { stockCents: 0, upkeepSixtiethCents: 0 } },
    progress: { version: "level-five-progress.v1", inspectionUnlocked: null,
      gameFinished: null, finishPageAcknowledgedAtFacilityTick: null },
    inspection: { version: "facility-inspection.v1", status: "locked", preparation: null,
      run: null, lastReport: null, latestCompletedReport: null, bestCompletedReport: null },
    inspectionPresentation: { version: "inspection-presentation.v1", runId: null, seed: null, actors: [] },
  };
}

export function createInspectionAccumulators(): InspectionAccumulatorState {
  return {
    version: "inspection-accumulators.v1", observedActiveMinutes: 0, observedRoomMinutes: 0,
    cleanRoomMinutes: 0, cleanlinessSum: 0, minimumCleanliness: null,
    usableRoomTypeFractionSum: 0, roomUpgradeFractionSum: 0, staffingCoverageFractionSum: 0,
    employeeTrainingFractionSum: 0, staffMoraleMeanSum: 0, patientSatisfactionSum: 0,
    patientSatisfactionCount: 0, queueMinutes: 0, overdueQueueMinutes: 0,
    completedPatientCount: 0, walkoutPatientCount: 0, operatingGrossCents: 0, stockCostCents: 0,
    chargedOperatingExpenseCents: 0, paidOperatingExpenseCents: 0,
    expensePostingCount: 0, paidExpensePostingCount: 0,
    qualifyingCompletedEncounterIds: [], settledEncounterIds: [], observedReceiptIds: [],
    observedExpensePostingIds: [], presentedQuestions: [],
  };
}

function requireState(valid: unknown, message: string): asserts valid {
  if (!valid) throw new Error(`The saved Level 5 state is invalid: ${message}.`);
}
function record(value: unknown, keys: readonly string[]): Record<string, unknown> {
  requireState(typeof value === "object" && value !== null && !Array.isArray(value), "expected a contract object");
  const result = value as Record<string, unknown>;
  requireState(Object.keys(result).length === keys.length && keys.every(key => Object.hasOwn(result, key)), "missing or unknown contract fields");
  return result;
}
const id = (value: unknown): value is string => typeof value === "string" && value.length > 0 && value.length <= 120;
const number = (value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
const integer = (value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): value is number =>
  number(value, min, max) && Number.isSafeInteger(value);
const nullableId = (value: unknown) => value === null || id(value);
const tick = (value: unknown, now: number) => integer(value, 0, now);
const nullableTick = (value: unknown, now: number) => value === null || tick(value, now);
const tier = (value: unknown) => integer(value, 1, 5);
function list(value: unknown): unknown[] {
  requireState(Array.isArray(value), "expected an evidence list");
  return value;
}
function uniqueIds(value: unknown, validId: (value: unknown) => boolean = id): string[] {
  const items = list(value);
  requireState(items.every(validId) && new Set(items).size === items.length, "invalid or duplicate evidence IDs");
  return items as string[];
}
function snapshotSignature(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(snapshotSignature).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
    .map(([key, item]) => `${JSON.stringify(key)}:${snapshotSignature(item)}`).join(",")}}`;
  return JSON.stringify(value);
}
function effects(value: unknown): ExecutiveEffectQuote {
  const quote = record(value, ["version", "staffMoralePoints", "visitorSatisfactionPoints", "inspectionPreparationReductionPercent", "supplierReductionPercent"]);
  requireState(quote.version === "executive-effect-quote.v1" &&
    [quote.staffMoralePoints, quote.visitorSatisfactionPoints, quote.inspectionPreparationReductionPercent, quote.supplierReductionPercent].every(v => number(v, 0, 100)), "invalid frozen Executive effects");
  return quote as unknown as ExecutiveEffectQuote;
}
function management(value: unknown, now: number): void {
  const state = record(value, ["version", "round", "lastCompletedDayNumber", "activeTerms", "supplierSavings",
    ...(value && Object.hasOwn(value, "upkeepAccounting") ? ["upkeepAccounting"] : [])]);
  requireState(state.version === "daily-management.v1" && (state.lastCompletedDayNumber === null || integer(state.lastCompletedDayNumber, 1)), "invalid management version/day");
  const savings = record(state.supplierSavings, ["stockCents", "upkeepSixtiethCents"]);
  requireState(integer(savings.stockCents) && integer(savings.upkeepSixtiethCents), "invalid supplier savings units");
  if (state.upkeepAccounting !== undefined) {
    const accounting = record(state.upkeepAccounting, ["baselineAccrualSixtiethCents", "fractionalReduction"]);
    requireState(integer(accounting.baselineAccrualSixtiethCents) && number(accounting.fractionalReduction, 0, 1) && accounting.fractionalReduction !== 1, "invalid supplier accrual precision");
  }
  if (state.round !== null) {
    const round = record(state.round, ["version", "id", "dayNumber", "employeeId", "officeRoomInstanceId", "status", "acceptedAtFacilityTick", "employeeTrainingLevel", "officeUpgradeLevel", "rawDurationMinutes", "durationMinutes", "remainingWorkMinutes", "lastProgressAtFacilityTick", "completedAtFacilityTick", "effectsAppliedAtFacilityTick", "reservedContactId", "effects"]);
    requireState(round.version === "daily-management-round.v1" && id(round.id) && integer(round.dayNumber, 1) && id(round.employeeId) && id(round.officeRoomInstanceId) &&
      ["walking_to_office", "working", "paused", "completed", "expired", "cancelled"].includes(String(round.status)) &&
      tick(round.acceptedAtFacilityTick, now) && tier(round.employeeTrainingLevel) && tier(round.officeUpgradeLevel) &&
      number(round.rawDurationMinutes, Number.MIN_VALUE) && integer(round.durationMinutes, 1) && round.durationMinutes === Math.ceil(round.rawDurationMinutes) &&
      number(round.remainingWorkMinutes, 0, round.durationMinutes) && tick(round.lastProgressAtFacilityTick, now) && round.lastProgressAtFacilityTick >= round.acceptedAtFacilityTick &&
      nullableTick(round.completedAtFacilityTick, now) && nullableTick(round.effectsAppliedAtFacilityTick, now) && nullableId(round.reservedContactId), "invalid daily round or accepted clock");
    effects(round.effects);
    if (round.status === "completed") {
      requireState(round.remainingWorkMinutes === 0 && round.reservedContactId === null && tick(round.completedAtFacilityTick, now) &&
        round.completedAtFacilityTick >= round.acceptedAtFacilityTick && round.effectsAppliedAtFacilityTick === round.completedAtFacilityTick &&
        state.lastCompletedDayNumber === round.dayNumber, "completed round lacks its once-applied marker");
    } else {
      requireState(round.completedAtFacilityTick === null && round.effectsAppliedAtFacilityTick === null &&
        (!["expired", "cancelled"].includes(String(round.status)) || round.reservedContactId === null), "unfinished round has effects or a retired reservation");
    }
  }
  if (state.activeTerms !== null) {
    const terms = record(state.activeTerms, ["version", "roundId", "dayNumber", "employeeId", "officeRoomInstanceId", "employeeTrainingLevel", "completedAtFacilityTick", "expiresAtFacilityTick", "effects"]);
    requireState(terms.version === "daily-management-terms.v1" && id(terms.roundId) && id(terms.employeeId) && id(terms.officeRoomInstanceId) &&
      integer(terms.dayNumber, 1) && state.lastCompletedDayNumber === terms.dayNumber && tier(terms.employeeTrainingLevel) &&
      tick(terms.completedAtFacilityTick, now) && integer(terms.expiresAtFacilityTick) && terms.expiresAtFacilityTick > terms.completedAtFacilityTick, "terms lack completed-round provenance");
    effects(terms.effects);
    // Overdue/expired quotes stay exactly as saved. M4 decides new-quote eligibility.
    if (state.round !== null && (state.round as DailyManagementRoundState).id === terms.roundId) {
      const round = state.round as DailyManagementRoundState;
      requireState(round.status === "completed" && round.completedAtFacilityTick === terms.completedAtFacilityTick &&
        round.employeeId === terms.employeeId && round.officeRoomInstanceId === terms.officeRoomInstanceId &&
        round.employeeTrainingLevel === terms.employeeTrainingLevel && snapshotSignature(round.effects) === snapshotSignature(terms.effects), "terms disagree with their round");
    }
  }
}
function preparation(value: unknown, now: number): void {
  const quote = record(value, ["version", "runId", "bookedAtFacilityTick", "rawDurationMinutes", "durationMinutes", "endsAtFacilityTick", "executiveQuote"]);
  requireState(quote.version === "inspection-preparation.v1" && id(quote.runId) && tick(quote.bookedAtFacilityTick, now) &&
    number(quote.rawDurationMinutes, Number.MIN_VALUE) && integer(quote.durationMinutes, 1) && quote.durationMinutes === Math.ceil(quote.rawDurationMinutes) &&
    integer(quote.endsAtFacilityTick) && quote.endsAtFacilityTick === quote.bookedAtFacilityTick + quote.durationMinutes, "invalid preparation quote/clock");
  if (quote.executiveQuote !== null) {
    const executive = record(quote.executiveQuote, ["roundId", "employeeId", "employeeTrainingLevel", "reductionPercent"]);
    requireState(id(executive.roundId) && id(executive.employeeId) && tier(executive.employeeTrainingLevel) && number(executive.reductionPercent, 0, 100), "invalid accepted preparation terms");
  }
}
function accumulators(value: unknown, run: InspectionRunState, now: number): void {
  const keys = [...Object.keys(createInspectionAccumulators()),
    ...(value && Object.hasOwn(value, "structuralEvidence") ? ["structuralEvidence"] : [])];
  const raw = record(value, keys);
  requireState(raw.version === "inspection-accumulators.v1", "unknown inspection evidence version");
  const counters = ["observedActiveMinutes", "observedRoomMinutes", "cleanRoomMinutes", "patientSatisfactionCount", "queueMinutes", "overdueQueueMinutes", "completedPatientCount", "walkoutPatientCount", "operatingGrossCents", "stockCostCents", "chargedOperatingExpenseCents", "paidOperatingExpenseCents", "expensePostingCount", "paidExpensePostingCount"] as const;
  requireState(counters.every(key => integer(raw[key])), "invalid inspection counter/cents");
  const a = raw as unknown as InspectionAccumulatorState;
  requireState(a.observedActiveMinutes <= run.durationMinutes && a.observedActiveMinutes <= now - run.startedAtFacilityTick &&
    a.cleanRoomMinutes <= a.observedRoomMinutes && a.overdueQueueMinutes <= a.queueMinutes &&
    a.paidExpensePostingCount <= a.expensePostingCount && a.paidOperatingExpenseCents <= a.chargedOperatingExpenseCents &&
    number(a.cleanlinessSum, 0, 100 * a.observedRoomMinutes) && (a.minimumCleanliness === null || number(a.minimumCleanliness, 0, 100)) &&
    [a.usableRoomTypeFractionSum, a.roomUpgradeFractionSum, a.staffingCoverageFractionSum, a.employeeTrainingFractionSum].every(v => number(v, 0, a.observedActiveMinutes)) &&
    number(a.staffMoraleMeanSum, 0, 100 * a.observedActiveMinutes) && number(a.patientSatisfactionSum, 0, 100 * a.patientSatisfactionCount), "inconsistent inspection sums");
  for (const key of ["qualifyingCompletedEncounterIds", "settledEncounterIds", "observedExpensePostingIds"] as const) uniqueIds(a[key]);
  // Receipt IDs compose an operation/diagnostic ID, income-line ID and sequence.
  // They are transaction identifiers, not the shorter entity IDs above. Keep
  // their exact runtime value through retirement/reload and still reject empty,
  // non-string and duplicate evidence. Ordinary receipt persistence has no
  // entity-ID length limit either.
  uniqueIds(a.observedReceiptIds, value => typeof value === "string" && value.length > 0);
  if (a.structuralEvidence !== undefined) {
    const evidence = record(a.structuralEvidence, ["version", "usableRoomTypeMinutes", "missingUpgradeTypeMinutes", "roomAccessProblems", "roomUpgradeDeficits", "staffPositionSamples", "unmatchedEmployeeSamples"]);
    requireState(evidence.version === "inspection-structure.v1", "unknown structural evidence version");
    const typeIds: string[] = [];
    for (const value of list(evidence.usableRoomTypeMinutes)) {
      const row = record(value, ["roomDefinitionId", "minutes"]);
      requireState(id(row.roomDefinitionId) && run.requiredRoomDefinitionIds.includes(row.roomDefinitionId) && integer(row.minutes, 0, a.observedActiveMinutes), "invalid type-minute evidence");
      typeIds.push(row.roomDefinitionId);
    }
    uniqueIds(typeIds);
    requireState(typeIds.length === run.requiredRoomDefinitionIds.length, "structural room denominator changed");
    const missingUpgradeIds: string[] = [];
    for (const value of list(evidence.missingUpgradeTypeMinutes)) {
      const row = record(value, ["roomDefinitionId", "minutes"]);
      requireState(id(row.roomDefinitionId) && run.upgradeableRooms.some(room => room.roomDefinitionId === row.roomDefinitionId) && integer(row.minutes, 0, a.observedActiveMinutes), "invalid missing-upgrade type-minute evidence");
      missingUpgradeIds.push(row.roomDefinitionId);
    }
    uniqueIds(missingUpgradeIds);
    requireState(missingUpgradeIds.length === run.upgradeableRooms.length, "upgrade denominator changed");
    const accessIds = new Set<string>();
    for (const value of list(evidence.roomAccessProblems)) {
      const row = record(value, ["roomInstanceId", "roomDefinitionId", "reason", "observedMinutes"]);
      const key = `${row.roomInstanceId}:${row.reason}`;
      requireState(id(row.roomInstanceId) && id(row.roomDefinitionId) && run.requiredRoomDefinitionIds.includes(row.roomDefinitionId) &&
        typeof row.reason === "string" && row.reason.length > 0 && integer(row.observedMinutes, 1, a.observedActiveMinutes) && !accessIds.has(key), "invalid room access evidence");
      accessIds.add(key);
    }
    const deficitIds: string[] = [];
    for (const value of list(evidence.roomUpgradeDeficits)) {
      const row = record(value, ["roomInstanceId", "roomDefinitionId", "minimumLevel", "maximumLevel"]);
      requireState(id(row.roomInstanceId) && id(row.roomDefinitionId) && tier(row.minimumLevel) && tier(row.maximumLevel) &&
        (row.minimumLevel as number) < (row.maximumLevel as number) && run.upgradeableRooms.some(room => room.roomDefinitionId === row.roomDefinitionId && room.maximumLevel === row.maximumLevel), "invalid upgrade deficit evidence");
      deficitIds.push(row.roomInstanceId);
    }
    uniqueIds(deficitIds);
    const sampleIds: string[] = [], minuteSums = new Map<string, number>();
    for (const value of list(evidence.staffPositionSamples)) {
      const row = record(value, ["id", "positionId", "roomDefinitionId", "staffRoleDefinitionId", "roomInstanceId", "employeeId", "trainingLevel", "observedMinutes"]);
      requireState(id(row.id) && id(row.positionId) && id(row.roomDefinitionId) && id(row.staffRoleDefinitionId) && nullableId(row.roomInstanceId) && nullableId(row.employeeId) &&
        (row.employeeId === null ? row.trainingLevel === null : row.roomInstanceId !== null && tier(row.trainingLevel)) && integer(row.observedMinutes, 1, a.observedActiveMinutes) &&
        run.baselineStaffPositions.some(slot => slot.roomDefinitionId === row.roomDefinitionId && slot.staffRoleDefinitionId === row.staffRoleDefinitionId &&
          (slot.id === row.positionId || (row.positionId as string).startsWith(`${slot.id}.copy`))), "invalid installed-position evidence");
      sampleIds.push(row.id);
      const sum = (minuteSums.get(row.positionId) ?? 0) + row.observedMinutes;
      requireState(sum <= a.observedActiveMinutes, "one physical position sampled twice in a minute");
      minuteSums.set(row.positionId, sum);
    }
    uniqueIds(sampleIds);
    const unmatched = new Set<string>();
    for (const value of list(evidence.unmatchedEmployeeSamples)) {
      const row = record(value, ["employeeId", "trainingLevel", "observedMinutes"]);
      const key = `${row.employeeId}:${row.trainingLevel}`;
      requireState(id(row.employeeId) && tier(row.trainingLevel) && integer(row.observedMinutes, 1, a.observedActiveMinutes) && !unmatched.has(key), "invalid unmatched-employee evidence");
      unmatched.add(key);
    }
  }
  requireState(a.qualifyingCompletedEncounterIds.every(key => a.settledEncounterIds.includes(key)) &&
    a.qualifyingCompletedEncounterIds.length <= a.completedPatientCount, "qualifying patients lack settled completion evidence");
  const questions = list(a.presentedQuestions);
  const questionIds = new Set<string>(), nodeIds = new Set<string>(), answerIds = new Set<string>();
  for (const value of questions) {
    const q = record(value, ["id", "kind", "subjectId", "decisionNodeId", "presentedAtFacilityTick", "firstAnswer"]);
    requireState(id(q.id) && !questionIds.has(q.id) && ["encounter", "employee_discussion"].includes(String(q.kind)) && id(q.subjectId) && id(q.decisionNodeId) &&
      tick(q.presentedAtFacilityTick, now) && q.presentedAtFacilityTick >= run.startedAtFacilityTick && q.presentedAtFacilityTick <= run.endsAtFacilityTick, "invalid/duplicate presented question");
    questionIds.add(q.id);
    const nodeKey = `${q.kind}:${q.subjectId}:${q.decisionNodeId}`;
    requireState(!nodeIds.has(nodeKey), "one presented node has multiple evidence IDs");
    nodeIds.add(nodeKey);
    if (q.firstAnswer !== null) {
      const answer = record(q.firstAnswer, ["id", "answeredAtFacilityTick", "correct"]);
      requireState(id(answer.id) && !answerIds.has(answer.id) && tick(answer.answeredAtFacilityTick, now) &&
        answer.answeredAtFacilityTick >= q.presentedAtFacilityTick && answer.answeredAtFacilityTick <= run.endsAtFacilityTick && typeof answer.correct === "boolean", "invalid/duplicate first answer");
      answerIds.add(answer.id);
    }
  }
}
function run(value: unknown, now: number): InspectionRunState {
  const raw = record(value, ["version", "id", "ruleVersion", "balanceReleaseId", "clinicalReleaseId", "startedAtFacilityTick", "durationMinutes", "endsAtFacilityTick", "lastObservedAtFacilityTick", "requiredRoomDefinitionIds", "upgradeableRooms", "baselineStaffPositions", "accumulators",
    ...(value && Object.hasOwn(value, "operationalThresholds") ? ["operationalThresholds"] : [])]);
  if (raw.operationalThresholds !== undefined) {
    const thresholds = record(raw.operationalThresholds, ["cleanRoomThreshold", "idleGraceMinutes", "checkInGraceMinutes"]);
    requireState(number(thresholds.cleanRoomThreshold, 0, 100) && integer(thresholds.idleGraceMinutes) && integer(thresholds.checkInGraceMinutes), "invalid frozen operational thresholds");
  }
  requireState(raw.version === "facility-inspection-run.v1" && raw.ruleVersion === "inspection-rules.v1" && id(raw.id) && id(raw.balanceReleaseId) && id(raw.clinicalReleaseId) &&
    tick(raw.startedAtFacilityTick, now) && raw.durationMinutes === 3000 && integer(raw.endsAtFacilityTick) && raw.endsAtFacilityTick === raw.startedAtFacilityTick + raw.durationMinutes &&
    nullableTick(raw.lastObservedAtFacilityTick, now) && (raw.lastObservedAtFacilityTick === null || (raw.lastObservedAtFacilityTick > raw.startedAtFacilityTick && raw.lastObservedAtFacilityTick <= raw.endsAtFacilityTick)), "invalid inspection run/version/window");
  const required = uniqueIds(raw.requiredRoomDefinitionIds);
  requireState(required.length > 0, "missing frozen room-type denominator");
  const upgradeIds: string[] = [];
  for (const value of list(raw.upgradeableRooms)) {
    const room = record(value, ["roomDefinitionId", "maximumLevel"]);
    requireState(id(room.roomDefinitionId) && required.includes(room.roomDefinitionId) && integer(room.maximumLevel, 2, 5), "invalid upgrade denominator");
    upgradeIds.push(room.roomDefinitionId);
  }
  uniqueIds(upgradeIds);
  const positionIds: string[] = [];
  for (const value of list(raw.baselineStaffPositions)) {
    const position = record(value, ["id", "roomDefinitionId", "staffRoleDefinitionId"]);
    requireState(id(position.id) && id(position.roomDefinitionId) && required.includes(position.roomDefinitionId) && id(position.staffRoleDefinitionId), "invalid physical staff denominator");
    positionIds.push(position.id);
  }
  uniqueIds(positionIds);
  const result = raw as unknown as InspectionRunState;
  accumulators(raw.accumulators, result, now);
  requireState(result.accumulators.observedActiveMinutes === 0 ? result.lastObservedAtFacilityTick === null :
    result.lastObservedAtFacilityTick !== null && result.accumulators.observedActiveMinutes <= result.lastObservedAtFacilityTick - result.startedAtFacilityTick, "observation clock disagrees with evidence");
  return result;
}
function report(value: unknown, now: number): InspectionReportState {
  const raw = record(value, ["version", "runId", "ruleVersion", "balanceReleaseId", "clinicalReleaseId", "startedAtFacilityTick", "endedAtFacilityTick", "outcome", "observedActiveMinutes", "requiredActiveMinutes", "qualifyingScoredPatientCount", "minimumQualifyingScoredPatients", "categories", "rawTotalScore", "recognition"]);
  requireState(raw.version === "facility-inspection-report.v1" && raw.ruleVersion === "inspection-rules.v1" && id(raw.runId) && id(raw.balanceReleaseId) && id(raw.clinicalReleaseId) &&
    tick(raw.startedAtFacilityTick, now) && tick(raw.endedAtFacilityTick, now) && raw.endedAtFacilityTick >= raw.startedAtFacilityTick &&
    ["completed", "incomplete", "cancelled"].includes(String(raw.outcome)) && raw.requiredActiveMinutes === 3000 && raw.minimumQualifyingScoredPatients === 20 &&
    integer(raw.observedActiveMinutes, 0, raw.requiredActiveMinutes) && raw.observedActiveMinutes <= raw.endedAtFacilityTick - raw.startedAtFacilityTick && integer(raw.qualifyingScoredPatientCount), "invalid inspection report/window/sample");
  const rows = list(raw.categories), seen = new Set<string>();
  requireState(rows.length === Object.keys(INSPECTION_CATEGORY_WEIGHTS).length, "report must retain all ten categories");
  let total = 0;
  for (const value of rows) {
    const row = record(value, ["id", "weightPercent", "score", "weightedPoints", "formula", "rawValues", "missingItems", "improvementHint"]);
    requireState(typeof row.id === "string" && Object.hasOwn(INSPECTION_CATEGORY_WEIGHTS, row.id) && !seen.has(row.id) &&
      row.weightPercent === INSPECTION_CATEGORY_WEIGHTS[row.id as InspectionCategoryId] && typeof row.formula === "string" && row.formula.length > 0 && typeof row.improvementHint === "string" && row.improvementHint.length > 0, "invalid/duplicate report category or weight");
    seen.add(row.id);
    requireState(typeof row.rawValues === "object" && row.rawValues !== null && !Array.isArray(row.rawValues) &&
      Object.values(row.rawValues).every(v => typeof v === "number" && Number.isFinite(v)), "invalid raw report arithmetic");
    const missingIds: string[] = [];
    for (const item of list(row.missingItems)) {
      const missing = record(item, ["id", "reason"]);
      requireState(id(missing.id) && typeof missing.reason === "string" && missing.reason.length > 0, "invalid missing-item evidence");
      missingIds.push(missing.id);
    }
    uniqueIds(missingIds);
    requireState(row.score === null ? row.weightedPoints === null : number(row.score, 0, 100) && number(row.weightedPoints, 0, row.weightPercent as number) &&
      Math.abs(row.weightedPoints - row.score * (row.weightPercent as number) / 100) < 1e-9, "category points disagree with score/weight");
    if (raw.outcome === "completed") requireState(row.score !== null, "completed report has an unscored category");
    total += typeof row.weightedPoints === "number" ? row.weightedPoints : 0;
  }
  if (raw.outcome === "completed") {
    requireState(raw.endedAtFacilityTick - raw.startedAtFacilityTick === 3000 && raw.observedActiveMinutes === raw.requiredActiveMinutes && raw.qualifyingScoredPatientCount >= raw.minimumQualifyingScoredPatients &&
      number(raw.rawTotalScore, 0, 100) && Math.abs(raw.rawTotalScore - total) < 1e-9, "score-bearing report lacks a full window/sample or valid total");
    const recognition = raw.rawTotalScore === 100 ? "perfect" : raw.rawTotalScore >= 95 ? "distinguished" : raw.rawTotalScore >= 80 ? "prestige" : "improving";
    requireState(raw.recognition === recognition && (raw.rawTotalScore !== 100 || rows.every(value => {
      const row = value as Record<string, unknown>; return row.score === 100 && (row.missingItems as unknown[]).length === 0;
    })), "recognition/perfect report disagrees with raw score");
  } else {
    requireState(raw.rawTotalScore === null && raw.recognition === null &&
      (raw.outcome !== "incomplete" || (raw.endedAtFacilityTick - raw.startedAtFacilityTick === 3000 && raw.observedActiveMinutes === 3000 && (raw.qualifyingScoredPatientCount as number) < 20)), "incomplete/cancelled report cannot award prestige");
  }
  return raw as unknown as InspectionReportState;
}

/** Strict additive reader. Omission stays absent; no rewards, clocks or evidence are repaired. */
export function readLevelFiveState(value: unknown, facilityTick: number, facilityLevel: number): LevelFiveState | undefined {
  if (value === undefined) return undefined;
  const raw = record(value, ["version", "management", "progress", "inspection", "inspectionPresentation"]);
  requireState(raw.version === "level-five-state.v1", "unknown foundation version");
  management(raw.management, facilityTick);
  const progress = record(raw.progress, ["version", "inspectionUnlocked", "gameFinished", "finishPageAcknowledgedAtFacilityTick"]);
  requireState(progress.version === "level-five-progress.v1" && nullableTick(progress.finishPageAcknowledgedAtFacilityTick, facilityTick), "invalid progression version/acknowledgment");
  if (progress.inspectionUnlocked !== null) {
    const unlock = record(progress.inspectionUnlocked, ["version", "earnedAtFacilityTick", "clinicalXp", "displayedSatisfaction", "averageStaffMorale", "employedStaffCount"]);
    requireState(unlock.version === "level-five-inspection-unlock.v1" && tick(unlock.earnedAtFacilityTick, facilityTick) && integer(unlock.clinicalXp, 2000) &&
      number(unlock.displayedSatisfaction, 0, 100) && unlock.displayedSatisfaction > 90 && number(unlock.averageStaffMorale, 85, 100) && integer(unlock.employedStaffCount, 1), "unlock lacks simultaneous nonempty goal evidence");
  }
  const inspection = record(raw.inspection, ["version", "status", "preparation", "run", "lastReport", "latestCompletedReport", "bestCompletedReport",
    ...(raw.inspection && Object.hasOwn(raw.inspection, "nextRunSequence") ? ["nextRunSequence"] : [])]);
  requireState(inspection.nextRunSequence === undefined || integer(inspection.nextRunSequence, 1), "invalid inspection sequence");
  requireState(inspection.version === "facility-inspection.v1" && ["locked", "ready", "preparing", "running", "completed", "incomplete", "cancelled"].includes(String(inspection.status)) &&
    (inspection.status === "locked") === (progress.inspectionUnlocked === null), "inspection lock disagrees with earned goals");
  requireState((inspection.status === "preparing") === (inspection.preparation !== null) && (inspection.status === "running") === (inspection.run !== null), "active inspection state disagrees with preparation/run");
  if (inspection.preparation !== null) preparation(inspection.preparation, facilityTick);
  const activeRun = inspection.run === null ? null : run(inspection.run, facilityTick);
  const last = inspection.lastReport === null ? null : report(inspection.lastReport, facilityTick);
  const latest = inspection.latestCompletedReport === null ? null : report(inspection.latestCompletedReport, facilityTick);
  const best = inspection.bestCompletedReport === null ? null : report(inspection.bestCompletedReport, facilityTick);
  requireState((latest === null) === (best === null) && (!latest || (latest.outcome === "completed" && best?.outcome === "completed" &&
    best.rawTotalScore! >= latest.rawTotalScore! && best.endedAtFacilityTick <= latest.endedAtFacilityTick)), "latest/best must be valid completed reports");
  if (last?.outcome === "completed") requireState(latest?.runId === last.runId, "latest completed report is not the last completed result");
  if (["completed", "incomplete"].includes(String(inspection.status))) requireState(last?.outcome === inspection.status, "terminal status lacks its report");
  if (progress.gameFinished !== null) {
    const finished = record(progress.gameFinished, ["version", "firstCompletedInspectionRunId", "finishedAtFacilityTick", "completionNoticeId", "firstCompletedReport"]);
    const first = report(finished.firstCompletedReport, facilityTick);
    requireState(finished.version === "level-five-game-finished.v1" && id(finished.firstCompletedInspectionRunId) && finished.firstCompletedInspectionRunId === first.runId &&
      id(finished.completionNoticeId) && tick(finished.finishedAtFacilityTick, facilityTick) && first.outcome === "completed" && finished.finishedAtFacilityTick === first.endedAtFacilityTick &&
      progress.inspectionUnlocked !== null && latest && best && latest.endedAtFacilityTick >= first.endedAtFacilityTick && best.rawTotalScore! >= first.rawTotalScore! &&
      (best.rawTotalScore !== first.rawTotalScore || best.endedAtFacilityTick === first.endedAtFacilityTick) &&
      (progress.finishPageAcknowledgedAtFacilityTick === null || (progress.finishPageAcknowledgedAtFacilityTick as number) >= finished.finishedAtFacilityTick), "game finish lacks its first completed report");
  } else requireState(progress.finishPageAcknowledgedAtFacilityTick === null && latest === null && best === null && last?.outcome !== "completed", "finish/dismissal cannot precede the first valid report");
  if (progress.inspectionUnlocked === null) requireState(last === null && progress.gameFinished === null, "locked inspection contains result evidence");
  const unlockTick = (progress.inspectionUnlocked as LevelFiveState["progress"]["inspectionUnlocked"])?.earnedAtFacilityTick;
  const snapshots = [last, latest, best, (progress.gameFinished as LevelFiveState["progress"]["gameFinished"])?.firstCompletedReport].filter((value): value is InspectionReportState => Boolean(value));
  requireState(snapshots.every(value => unlockTick !== undefined && value.startedAtFacilityTick >= unlockTick) &&
    (!activeRun || (unlockTick !== undefined && activeRun.startedAtFacilityTick >= unlockTick)) &&
    (inspection.preparation === null || (unlockTick !== undefined && (inspection.preparation as LevelFiveState["inspection"]["preparation"])!.bookedAtFacilityTick >= unlockTick)), "inspection predates its earned unlock");
  const reportsById = new Map<string, string>();
  for (const value of snapshots) {
    const signature = snapshotSignature(value);
    requireState(!reportsById.has(value.runId) || reportsById.get(value.runId) === signature, "one run has conflicting immutable reports");
    reportsById.set(value.runId, signature);
  }
  const presentation = record(raw.inspectionPresentation, ["version", "runId", "seed", "actors"]);
  const actors = list(presentation.actors), actorIds: string[] = [], stillIds: string[] = [];
  requireState(presentation.version === "inspection-presentation.v1" && nullableId(presentation.runId) && nullableId(presentation.seed) && actors.length <= 10 &&
    (presentation.runId === null ? presentation.seed === null && actors.length === 0 : activeRun?.id === presentation.runId && presentation.seed !== null), "presentation must belong to the active run");
  const point = (v: unknown) => {
    const p = record(v, ["x", "y"]); requireState(number(p.x) && number(p.y), "invalid presentation route point");
  };
  for (const value of actors) {
    const actor = record(value, ["id", "stillId", "phase", "location", "path", "pathIndex", "lastMovedAtFacilityTick", "targetRoomInstanceId", "observingUntilFacilityTick"]);
    const path = list(actor.path);
    requireState(id(actor.id) && typeof actor.stillId === "string" && /^inspector-v6f\.(00[1-9]|010)$/.test(actor.stillId) &&
      ["walking", "observing", "stationary"].includes(String(actor.phase)) && integer(actor.pathIndex, 0, Math.max(0, path.length - 1)) &&
      tick(actor.lastMovedAtFacilityTick, facilityTick) && nullableId(actor.targetRoomInstanceId) && (actor.observingUntilFacilityTick === null || integer(actor.observingUntilFacilityTick)), "invalid inspector identity/route clock");
    point(actor.location); path.forEach(point); actorIds.push(actor.id); stillIds.push(actor.stillId);
  }
  uniqueIds(actorIds); uniqueIds(stillIds);
  requireState(facilityLevel === 5 || snapshotSignature(raw) === snapshotSignature(createLevelFiveState()), "pre-Level-5 campaign contains active/earned Level 5 state");
  return raw as unknown as LevelFiveState;
}
import { FACILITY_INSPECTION_RULES } from "@gamify-surgery/balance-config";
