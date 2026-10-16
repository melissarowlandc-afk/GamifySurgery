import { FACILITY_INSPECTION_RULES } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { getExecutivePreparationQuote } from "./executive-management";
import { createInspectionAccumulators } from "./level-five-state";
import { getInspectionBookingBlockedReason } from "./level-five-progression";
import { getRoomStaffCapacity } from "./room-capacity";
import { getAverageEffectiveStaffMorale } from "./level-five-support";
import { getFacilityAccessValidation, getRoomDefinition, isRoomOperationalForFacilityWork } from "./selectors";
import type { InspectionCategoryId, InspectionCategoryResult, InspectionPresentedQuestion,
  InspectionReportState, InspectionRunState, InspectionStructuralEvidence } from "./level-five-types";
import type { AnswerRecord, DomainContext, EncounterState, GameState, PlacedRoom, RoomUpgradeLevel, ServiceIncomeReceipt } from "./types";

const rules = FACILITY_INSPECTION_RULES;
const clip = (value: number) => Math.min(1, Math.max(0, value));
const tier = (value: number | undefined): RoomUpgradeLevel => Math.min(5, Math.max(1, value ?? 1)) as RoomUpgradeLevel;
const cents = (value: number) => Math.round(value * 100);
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function getActiveInspectionRun(state: GameState): InspectionRunState | null {
  const inspection = state.facilityLevel === 5 ? state.levelFive?.inspection : null;
  const run = inspection?.status === "running" ? inspection.run : null;
  return run && state.facilityTick >= run.startedAtFacilityTick && state.facilityTick <= run.endsAtFacilityTick ? run : null;
}

/** No clinical/retail random stream, money, learning or clock mutation. */
export function bookFacilityInspection(state: GameState, context: DomainContext): string | null {
  const blocked = getInspectionBookingBlockedReason(state, context);
  if (blocked) return blocked;
  const inspection = state.levelFive!.inspection;
  const quote = getExecutivePreparationQuote(state, context);
  const sequence = inspection.nextRunSequence ?? 1;
  inspection.nextRunSequence = sequence + 1;
  const runId = `inspection.${sequence}`;
  inspection.preparation = { version: "inspection-preparation.v1", runId,
    bookedAtFacilityTick: state.facilityTick, ...copy(quote), endsAtFacilityTick: state.facilityTick + quote.durationMinutes };
  inspection.status = "preparing";
  return null;
}

export function createFacilityInspectionRun(state: GameState, runId: string, context: DomainContext): InspectionRunState {
  const definitions = context.balanceRelease.facility.roomDefinitions.filter(room => room.buildable && room.unlockFacilityLevel <= 5);
  const shape = { ...state, rooms: definitions.map((definition, index) => ({
    id: `inspection.room.${index}`, roomDefinitionId: definition.id, x: 0, y: 0,
    orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const,
  })) };
  const positions = context.balanceRelease.facility.staffRoleDefinitions.filter(role => role.unlockFacilityLevel <= 5)
    .flatMap(role => Object.entries(getRoomStaffCapacity(shape, role.id).slotsByRoomInstanceId).flatMap(([roomId, count]) => {
      const room = shape.rooms.find(room => room.id === roomId)!;
      return Array.from({ length: count }, (_, index) => ({
        id: `position.${room.roomDefinitionId}.${role.id}.${index + 1}`, roomDefinitionId: room.roomDefinitionId, staffRoleDefinitionId: role.id,
      }));
    }));
  const satisfaction = context.balanceRelease.patientSatisfaction;
  const accumulators = createInspectionAccumulators();
  accumulators.structuralEvidence = { version: "inspection-structure.v1",
    usableRoomTypeMinutes: definitions.map(room => ({ roomDefinitionId: room.id, minutes: 0 })),
    missingUpgradeTypeMinutes: definitions.filter(room => room.maximumUpgradeLevel > 1).map(room => ({ roomDefinitionId: room.id, minutes: 0 })),
    roomAccessProblems: [], roomUpgradeDeficits: [], staffPositionSamples: [], unmatchedEmployeeSamples: [] };
  return { version: "facility-inspection-run.v1", id: runId, ruleVersion: rules.version,
    balanceReleaseId: state.balanceReleaseId, clinicalReleaseId: state.clinicalReleaseId,
    startedAtFacilityTick: state.facilityTick, durationMinutes: rules.durationMinutes,
    endsAtFacilityTick: state.facilityTick + rules.durationMinutes, lastObservedAtFacilityTick: null,
    requiredRoomDefinitionIds: definitions.map(room => room.id),
    upgradeableRooms: definitions.filter(room => room.maximumUpgradeLevel > 1)
      .map(room => ({ roomDefinitionId: room.id, maximumLevel: room.maximumUpgradeLevel as RoomUpgradeLevel })),
    baselineStaffPositions: positions, accumulators,
    operationalThresholds: { cleanRoomThreshold: satisfaction.cleanRoomThreshold, idleGraceMinutes: satisfaction.idleGraceMinutes,
      checkInGraceMinutes: satisfaction.unstaffedCheckInDelayMinutes } };
}

function present(run: InspectionRunState, kind: InspectionPresentedQuestion["kind"], subjectId: string, nodeId: string, now: number) {
  const questions = run.accumulators.presentedQuestions;
  let question = questions.find(q => q.kind === kind && q.subjectId === subjectId && q.decisionNodeId === nodeId);
  if (!question) {
    question = { id: `inspection.question.${questions.length + 1}`, kind, subjectId, decisionNodeId: nodeId,
      presentedAtFacilityTick: now, firstAnswer: null };
    questions.push(question);
  }
  return question;
}

/** Domain presentation/advance observer; closing a chart cannot unpresent it. */
export function observeInspectionQuestions(state: GameState): void {
  const run = getActiveInspectionRun(state);
  if (!run) return;
  for (const encounter of Object.values(state.encounters)) {
    const step = encounter.steps[encounter.currentNodeIndex];
    if (encounter.firstOpenedAtTick !== null && encounter.lifecycle === "active_action_required" &&
        step?.status === "action_required" && !step.answer) present(run, "encounter", encounter.id, step.decisionNodeId, state.facilityTick);
  }
  for (const discussion of Object.values(state.employeeDiscussions ?? {})) {
    const step = discussion.steps[discussion.currentNodeIndex];
    if (discussion.firstOpenedAtTick !== null && ["active_action_required", "active_traveling"].includes(discussion.lifecycle) &&
        step?.status === "action_required" && !step.answer) present(run, "employee_discussion", discussion.id, step.decisionNodeId, state.facilityTick);
  }
}

/** Accepted first answers only; called before feedback, settlement or retirement. */
export function observeInspectionFirstAnswer(state: GameState, kind: InspectionPresentedQuestion["kind"], subjectId: string, answer: AnswerRecord): void {
  const run = getActiveInspectionRun(state);
  if (!run || answer.answeredAtFacilityTick < run.startedAtFacilityTick || answer.answeredAtFacilityTick > run.endsAtFacilityTick) return;
  const question = present(run, kind, subjectId, answer.decisionNodeId, state.facilityTick);
  question.firstAnswer ??= { id: `${question.id}.first`, answeredAtFacilityTick: answer.answeredAtFacilityTick, correct: answer.correct };
}

/** One actual ended scored encounter, including walkouts and unfinished answer paths. */
export function observeInspectionPatientEnd(state: GameState, encounter: EncounterState): void {
  const run = getActiveInspectionRun(state);
  if (!run || encounter.arrivalClass === "tutorial" || encounter.frozenCase.participant ||
      encounter.resolvedAtFacilityTick === null || encounter.resolvedAtFacilityTick < run.startedAtFacilityTick ||
      encounter.resolvedAtFacilityTick > run.endsAtFacilityTick || !encounter.resolutionReason) return;
  const a = run.accumulators;
  if (a.settledEncounterIds.includes(encounter.id)) return;
  a.settledEncounterIds.push(encounter.id);
  a.patientSatisfactionCount++;
  a.patientSatisfactionSum += Math.min(100, Math.max(0, encounter.finalPatientSatisfaction ?? encounter.patientSatisfaction));
  if (encounter.resolutionReason === "walkout") { a.walkoutPatientCount++; return; }
  a.completedPatientCount++;
  if (a.presentedQuestions.some(q => q.kind === "encounter" && q.subjectId === encounter.id && q.firstAnswer)) {
    a.qualifyingCompletedEncounterIds.push(encounter.id);
  }
}

/** Ordinary receipt hook, with actual gross/stock/net; no parsed event prose. */
export function observeInspectionReceipt(state: GameState, receipt: ServiceIncomeReceipt): void {
  const run = getActiveInspectionRun(state);
  if (!run || receipt.completedAtFacilityTick < run.startedAtFacilityTick || receipt.completedAtFacilityTick > run.endsAtFacilityTick) return;
  const a = run.accumulators;
  if (a.observedReceiptIds.includes(receipt.id)) return;
  a.observedReceiptIds.push(receipt.id);
  a.operatingGrossCents += cents(receipt.grossAmount);
  a.stockCostCents += cents(receipt.stockCost);
}

export function observeInspectionSettlement(state: GameState, encounter: EncounterState, settlementId: string, netCashDelta: number): void {
  const run = getActiveInspectionRun(state);
  if (!run) return;
  const a = run.accumulators;
  if (!a.observedReceiptIds.includes(settlementId)) {
    a.observedReceiptIds.push(settlementId);
    a.operatingGrossCents += cents(netCashDelta);
  }
  observeInspectionPatientEnd(state, encounter);
}

/** Charged cents are authoritative even when cash pays only part of the bill. */
export function observeInspectionExpensePosting(state: GameState, id: string, chargedCents: number, paidCents: number): void {
  const run = getActiveInspectionRun(state);
  if (!run || chargedCents <= 0) return;
  const a = run.accumulators;
  if (a.observedExpensePostingIds.includes(id)) return;
  a.observedExpensePostingIds.push(id);
  a.expensePostingCount++;
  a.chargedOperatingExpenseCents += chargedCents;
  a.paidOperatingExpenseCents += paidCents;
  if (paidCents === chargedCents) a.paidExpensePostingCount++;
}

type Position = InspectionRunState["baselineStaffPositions"][number] & { roomInstanceId: string | null; employeeId: string | null; trainingLevel: RoomUpgradeLevel | null };

/** Valid installed homes count during work/breaks/training; founder is excluded. */
export function getInspectionStructure(state: GameState, run: InspectionRunState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT) {
  const rooms = new Map<string, PlacedRoom[]>();
  for (const id of run.requiredRoomDefinitionIds) rooms.set(id, state.rooms.filter(room => room.roomDefinitionId === id).sort((a, b) => a.id.localeCompare(b.id)));
  const usable = new Set(state.rooms.filter(room => isRoomOperationalForFacilityWork(state, room.id, context)).map(room => room.id));
  const positions: Position[] = [];
  const matched = new Set<string>();
  for (const type of run.requiredRoomDefinitionIds) {
    const copies = rooms.get(type)!;
    const canonical = run.baselineStaffPositions.filter(position => position.roomDefinitionId === type);
    // Even absent rooms retain the baseline one-of-each physical positions.
    for (let index = 0; index < Math.max(1, copies.length); index++) {
      const room = copies[index];
      for (const slot of canonical) {
        const employee = room && usable.has(room.id) ? state.employees.filter(employee => !matched.has(employee.id) &&
          employee.homeRoomInstanceId === room.id && employee.staffRoleDefinitionId === slot.staffRoleDefinitionId)
          .sort((a, b) => a.id.localeCompare(b.id))[0] : undefined;
        if (employee) matched.add(employee.id);
        positions.push({ ...slot, id: index ? `${slot.id}.copy${index + 1}` : slot.id,
          roomInstanceId: room?.id ?? null, employeeId: employee?.id ?? null, trainingLevel: employee ? tier(employee.trainingLevel) : null });
      }
    }
  }
  const unmatched = state.employees.filter(employee => !matched.has(employee.id));
  const usableTypes = run.requiredRoomDefinitionIds.filter(id => rooms.get(id)!.some(room => usable.has(room.id)));
  const upgrades = run.upgradeableRooms.map(definition => {
    const placed = rooms.get(definition.roomDefinitionId) ?? [];
    return placed.length ? placed.reduce((sum, room) => sum + clip((tier(room.upgradeLevel) - 1) / (definition.maximumLevel - 1)), 0) / placed.length : 0;
  });
  const filled = positions.filter(position => position.employeeId).length;
  const trainingTerms = positions.reduce((sum, position) => sum + (position.trainingLevel ? (position.trainingLevel - 1) / 4 : 0), 0) +
    unmatched.reduce((sum, employee) => sum + (tier(employee.trainingLevel) - 1) / 4, 0);
  return { rooms, usableTypes, positions, unmatched,
    roomsFraction: usableTypes.length / run.requiredRoomDefinitionIds.length,
    upgradesFraction: upgrades.length ? upgrades.reduce((a, b) => a + b, 0) / upgrades.length : 0,
    staffingFraction: positions.length ? filled / positions.length : 0,
    trainingFraction: positions.length + unmatched.length ? trainingTerms / (positions.length + unmatched.length) : 0 };
}

function observeStructure(state: GameState, run: InspectionRunState, context: DomainContext) {
  const a = run.accumulators, s = getInspectionStructure(state, run, context);
  a.usableRoomTypeFractionSum += s.roomsFraction;
  a.roomUpgradeFractionSum += s.upgradesFraction;
  a.staffingCoverageFractionSum += s.staffingFraction;
  a.employeeTrainingFractionSum += s.trainingFraction;
  const evidence = a.structuralEvidence ??= { version: "inspection-structure.v1", usableRoomTypeMinutes: run.requiredRoomDefinitionIds.map(roomDefinitionId => ({ roomDefinitionId, minutes: 0 })),
    missingUpgradeTypeMinutes: run.upgradeableRooms.map(room => ({ roomDefinitionId: room.roomDefinitionId, minutes: 0 })),
    roomAccessProblems: [], roomUpgradeDeficits: [], staffPositionSamples: [], unmatchedEmployeeSamples: [] };
  for (const row of evidence.usableRoomTypeMinutes) if (s.usableTypes.includes(row.roomDefinitionId)) row.minutes++;
  for (const row of evidence.missingUpgradeTypeMinutes) if (!s.rooms.get(row.roomDefinitionId)?.length) row.minutes++;
  const access = getFacilityAccessValidation(state, context);
  for (const room of state.rooms.filter(room => run.requiredRoomDefinitionIds.includes(room.roomDefinitionId) && !isRoomOperationalForFacilityWork(state, room.id, context))) {
    const name = getRoomDefinition(room.roomDefinitionId, context)?.displayName ?? room.roomDefinitionId;
    const reason = room.maintenance?.status === "out_of_service" ? "Equipment out of service."
      : access.unreachableRoomIds.includes(room.id) ? "No reachable door."
        : access.issues.filter(issue => issue.startsWith(`${name} requires`) || issue.startsWith(`${name} must share a wall`)).join(" ") || "Not operational for facility work.";
    const prior = evidence.roomAccessProblems.find(row => row.roomInstanceId === room.id && row.reason === reason);
    if (prior) prior.observedMinutes++;
    else evidence.roomAccessProblems.push({ roomInstanceId: room.id, roomDefinitionId: room.roomDefinitionId, reason, observedMinutes: 1 });
  }
  for (const definition of run.upgradeableRooms) {
    for (const room of s.rooms.get(definition.roomDefinitionId) ?? []) {
      if (tier(room.upgradeLevel) >= definition.maximumLevel) continue;
      const prior = evidence.roomUpgradeDeficits.find(row => row.roomInstanceId === room.id);
      if (prior) prior.minimumLevel = Math.min(prior.minimumLevel, tier(room.upgradeLevel)) as RoomUpgradeLevel;
      else evidence.roomUpgradeDeficits.push({ roomInstanceId: room.id, roomDefinitionId: room.roomDefinitionId,
        minimumLevel: tier(room.upgradeLevel), maximumLevel: definition.maximumLevel });
    }
  }
  for (const position of s.positions) {
    const prior = evidence.staffPositionSamples.find(row => row.positionId === position.id && row.roomInstanceId === position.roomInstanceId &&
      row.employeeId === position.employeeId && row.trainingLevel === position.trainingLevel);
    if (prior) prior.observedMinutes++;
    else evidence.staffPositionSamples.push({ ...position, id: `inspection.position.${evidence.staffPositionSamples.length + 1}`,
      positionId: position.id, observedMinutes: 1 });
  }
  for (const employee of s.unmatched) {
    const level = tier(employee.trainingLevel);
    const prior = evidence.unmatchedEmployeeSamples.find(row => row.employeeId === employee.id && row.trainingLevel === level);
    if (prior) prior.observedMinutes++;
    else evidence.unmatchedEmployeeSamples.push({ employeeId: employee.id, trainingLevel: level, observedMinutes: 1 });
  }
}

/** An actual onsite scored patient contributes at most one avoidable queue minute. */
export function inspectionQueueState(encounter: EncounterState, state?: GameState) {
  if (encounter.arrivalClass === "tutorial" || encounter.frozenCase.participant || !encounter.patientLocation || encounter.resolutionReason ||
      encounter.pendingResult?.deliveredAtTick === null || encounter.patientMovement && encounter.patientMovement.kind !== "idle_within_room") return null;
  if (encounter.checkInStatus === "awaiting_staff" && encounter.checkInWaitingSinceTick !== null) return { kind: "check_in" as const, since: encounter.checkInWaitingSinceTick };
  if (encounter.checkInStatus === "checked_in" && state?.openChartEncounterId !== encounter.id &&
      ["waiting_unopened", "active_action_required"].includes(encounter.lifecycle) && encounter.idleWaitingSinceTick !== null) {
    return { kind: "idle" as const, since: encounter.idleWaitingSinceTick };
  }
  return null;
}

/** Called once at the end of each simulated minute, before history retirement. */
export function advanceFacilityInspection(state: GameState, context: DomainContext): void {
  const inspection = state.facilityLevel === 5 ? state.levelFive?.inspection : null;
  if (!inspection) return;
  if (inspection.status === "preparing" && inspection.preparation && state.facilityTick >= inspection.preparation.endsAtFacilityTick) {
    inspection.run = createFacilityInspectionRun(state, inspection.preparation.runId, context);
    inspection.preparation = null;
    inspection.status = "running";
    observeInspectionQuestions(state);
    return;
  }
  const run = getActiveInspectionRun(state);
  if (!run || state.facilityTick <= run.startedAtFacilityTick || state.facilityTick === run.lastObservedAtFacilityTick) return;
  observeInspectionQuestions(state);
  const a = run.accumulators;
  const thresholds = run.operationalThresholds ?? { cleanRoomThreshold: context.balanceRelease.patientSatisfaction.cleanRoomThreshold,
    idleGraceMinutes: context.balanceRelease.patientSatisfaction.idleGraceMinutes, checkInGraceMinutes: context.balanceRelease.patientSatisfaction.unstaffedCheckInDelayMinutes };
  a.observedActiveMinutes++;
  for (const room of state.rooms) {
    const cleanliness = Math.min(100, Math.max(0, room.cleanliness ?? 100));
    a.observedRoomMinutes++;
    if (cleanliness >= thresholds.cleanRoomThreshold) a.cleanRoomMinutes++;
    a.cleanlinessSum += cleanliness;
    a.minimumCleanliness = Math.min(a.minimumCleanliness ?? 100, cleanliness);
  }
  observeStructure(state, run, context);
  a.staffMoraleMeanSum += getAverageEffectiveStaffMorale(state) ?? 0;
  for (const encounter of Object.values(state.encounters)) {
    const queue = inspectionQueueState(encounter, state);
    if (!queue) continue;
    a.queueMinutes++;
    const grace = queue.kind === "check_in" ? thresholds.checkInGraceMinutes : thresholds.idleGraceMinutes;
    if (state.facilityTick - queue.since > grace) a.overdueQueueMinutes++;
  }
  run.lastObservedAtFacilityTick = state.facilityTick;
  if (state.facilityTick === run.endsAtFacilityTick) finishInspection(state, createInspectionReport(run, state.facilityTick));
}

const categoryInfo: Record<InspectionCategoryId, { formula: string; improvementHint: string }> = {
  cleanliness: { formula: "100 × clean room-minutes / observed room-minutes", improvementHint: "Hire EVS, keep cleaning access open, clear litter and use cleaning/bathroom upgrades. Clean means the game's threshold, not a sanitation standard." },
  rooms_built: { formula: "100 × mean per-minute usable room types / all frozen buildable types", improvementHint: "Build each missing room type and connect usable doors. Duplicates cannot replace a missing type." },
  room_upgrades: { formula: "100 × mean per-minute, per-type mean of (level − 1) / (maximum − 1); missing types = 0", improvementHint: "Complete every owned room's four upgrades before the run. One maxed copy cannot hide a lower-tier copy." },
  staffing_coverage: { formula: "100 × mean per-minute distinct valid installed employees / baseline and extra physical positions", improvementHint: "Fill every compatible reachable home position. Each employee fills one position; the founder cannot substitute." },
  employee_training: { formula: "100 × mean per-minute training terms (tier − 1) / 4 across positions and unmatched hired staff; empty positions = 0", improvementHint: "Hire missing staff and finish all four training purchases for every employee. Queued training is not an earned tier." },
  staff_morale: { formula: "Mean per-minute effective morale of all employed staff; empty workforce = 0", improvementHint: "Pay wages, use praise/coffee, complete breaks and management rounds, and retain honest ownership support." },
  patient_satisfaction: { formula: "Sum of final scored-patient satisfaction / all scored completions and walkouts in the window", improvementHint: "Answer correctly, attend patients promptly and keep facilities clean and accessible. Use actual garden/Executive comfort; walkouts stay in the sample." },
  wait_flow: { formula: "100 × [0.5 × (1 − overdue queue-minutes / queue-minutes) + 0.5 × completed / (completed + walkouts)]", improvementHint: "Staff check-in, maintain paths/seats/care capacity and answer ready questions. Prescribed processing, travel and external-result clocks are excluded." },
  finances: { formula: "100 × [0.5 × fully paid positive bills / positive bills + 0.5 × clip(operating net / (0.05 × operating gross))]", improvementHint: "Pay every bill and build real profitable services within demand. Stock is deducted once; capital spending, reserves, grants and room sales cannot improve operating profit." },
  clinical_answer_accuracy: { formula: "100 × correct first submissions / (all first submissions + presented but unanswered questions)", improvementHint: "Review existing explanations and answer every presented game question correctly. Wrong first answers and unanswered questions remain; this compares stored game keys, not real clinical competence." },
};

export function inspectionScoreLabel(score: number): string {
  return (Math.floor(score * 100) / 100).toFixed(2);
}

/** Pure arithmetic over run-local evidence; no retired objects or browser input. */
export function createInspectionReport(run: InspectionRunState, endedAtFacilityTick: number, cancelled = false): InspectionReportState {
  const a = run.accumulators, minutes = a.observedActiveMinutes, evidence = a.structuralEvidence;
  const answered = a.presentedQuestions.filter(q => q.firstAnswer);
  const correct = answered.filter(q => q.firstAnswer!.correct).length;
  const unanswered = a.presentedQuestions.length - answered.length;
  const patients = a.completedPatientCount + a.walkoutPatientCount;
  const requiredSample = a.qualifyingCompletedEncounterIds.length >= rules.minimumQualifyingScoredPatients;
  const outcome = cancelled ? "cancelled" : minutes === rules.durationMinutes && endedAtFacilityTick === run.endsAtFacilityTick && requiredSample ? "completed" : "incomplete";
  const net = a.operatingGrossCents - a.stockCostCents - a.chargedOperatingExpenseCents;
  const queueTerm = a.queueMinutes ? 1 - a.overdueQueueMinutes / a.queueMinutes : requiredSample ? 1 : 0;
  const profitTerm = a.operatingGrossCents > 0 ? clip(net / (rules.targetOperatingMargin * a.operatingGrossCents)) : 0;
  const scores: Record<InspectionCategoryId, number | null> = {
    cleanliness: a.observedRoomMinutes ? 100 * a.cleanRoomMinutes / a.observedRoomMinutes : null,
    rooms_built: minutes ? 100 * a.usableRoomTypeFractionSum / minutes : null,
    room_upgrades: minutes ? 100 * a.roomUpgradeFractionSum / minutes : null,
    staffing_coverage: minutes ? 100 * a.staffingCoverageFractionSum / minutes : null,
    employee_training: minutes ? 100 * a.employeeTrainingFractionSum / minutes : null,
    staff_morale: minutes ? a.staffMoraleMeanSum / minutes : null,
    patient_satisfaction: a.patientSatisfactionCount ? a.patientSatisfactionSum / a.patientSatisfactionCount : null,
    wait_flow: minutes ? 100 * (0.5 * queueTerm + 0.5 * (patients ? a.completedPatientCount / patients : 0)) : null,
    finances: minutes ? 100 * (0.5 * (a.expensePostingCount ? a.paidExpensePostingCount / a.expensePostingCount : 0) + 0.5 * profitTerm) : null,
    clinical_answer_accuracy: a.presentedQuestions.length ? 100 * correct / a.presentedQuestions.length : null,
  };
  const raw: Record<InspectionCategoryId, Record<string, number>> = {
    cleanliness: { cleanRoomMinutes: a.cleanRoomMinutes, observedRoomMinutes: a.observedRoomMinutes,
      meanCleanliness: a.observedRoomMinutes ? a.cleanlinessSum / a.observedRoomMinutes : 0, minimumCleanliness: a.minimumCleanliness ?? 0 },
    rooms_built: { usableRoomTypeFractionSum: a.usableRoomTypeFractionSum, observedMinutes: minutes, requiredTypes: run.requiredRoomDefinitionIds.length },
    room_upgrades: { roomUpgradeFractionSum: a.roomUpgradeFractionSum, observedMinutes: minutes, requiredTypes: run.upgradeableRooms.length },
    staffing_coverage: { staffingCoverageFractionSum: a.staffingCoverageFractionSum, observedMinutes: minutes, baselinePositions: run.baselineStaffPositions.length },
    employee_training: { employeeTrainingFractionSum: a.employeeTrainingFractionSum, observedMinutes: minutes },
    staff_morale: { staffMoraleMeanSum: a.staffMoraleMeanSum, observedMinutes: minutes },
    patient_satisfaction: { satisfactionSum: a.patientSatisfactionSum, patientCount: a.patientSatisfactionCount },
    wait_flow: { queueMinutes: a.queueMinutes, overdueQueueMinutes: a.overdueQueueMinutes, completed: a.completedPatientCount, walkouts: a.walkoutPatientCount },
    finances: { paidPostings: a.paidExpensePostingCount, expensePostings: a.expensePostingCount,
      operatingGrossCents: a.operatingGrossCents, stockCostCents: a.stockCostCents, chargedOperatingExpenseCents: a.chargedOperatingExpenseCents,
      paidOperatingExpenseCents: a.paidOperatingExpenseCents, operatingNetCents: net, profitTerm },
    clinical_answer_accuracy: { correctFirstSubmissions: correct, allFirstSubmissions: answered.length, presentedButUnanswered: unanswered },
  };
  const missing: Record<InspectionCategoryId, InspectionCategoryResult["missingItems"]> = {
    cleanliness: [], rooms_built: [], room_upgrades: [], staffing_coverage: [], employee_training: [],
    staff_morale: [], patient_satisfaction: [], wait_flow: [], finances: [], clinical_answer_accuracy: [],
  };
  for (const row of evidence?.usableRoomTypeMinutes ?? []) {
    if (row.minutes < minutes) missing.rooms_built.push({ id: row.roomDefinitionId, reason: `${row.roomDefinitionId}: missing, inaccessible or out of service for ${minutes - row.minutes} observed minutes.` });
  }
  for (const [index, row] of (evidence?.roomAccessProblems ?? []).entries()) missing.rooms_built.push({ id: `access.${index}`, reason: `${row.roomDefinitionId} (${row.roomInstanceId}): ${row.reason} ${row.observedMinutes} minutes.` });
  for (const row of evidence?.missingUpgradeTypeMinutes ?? []) if (row.minutes) missing.room_upgrades.push({ id: row.roomDefinitionId, reason: `${row.roomDefinitionId}: absent for ${row.minutes} observed minutes; missing types contribute zero.` });
  for (const row of evidence?.roomUpgradeDeficits ?? []) missing.room_upgrades.push({ id: row.roomInstanceId, reason: `${row.roomDefinitionId} (${row.roomInstanceId}) was tier ${row.minimumLevel}/${row.maximumLevel}. Earlier observations remain after sale/upgrade.` });
  for (const row of evidence?.staffPositionSamples ?? []) {
    if (!row.employeeId) missing.staffing_coverage.push({ id: row.id, reason: `${row.positionId} at ${row.roomInstanceId ?? "missing room"}: no valid installed employee for ${row.observedMinutes} minutes.` });
    if (row.trainingLevel !== 5) missing.employee_training.push({ id: row.id, reason: `${row.positionId}: ${row.employeeId ?? "missing employee"}, tier ${row.trainingLevel ?? 0}/5 for ${row.observedMinutes} minutes.` });
  }
  for (const [index, row] of (evidence?.unmatchedEmployeeSamples ?? []).entries()) if (row.trainingLevel < 5) missing.employee_training.push({ id: `unmatched.${index}`, reason: `${row.employeeId}: unmatched hired employee, tier ${row.trainingLevel}/5 for ${row.observedMinutes} minutes.` });
  for (const q of a.presentedQuestions) if (!q.firstAnswer?.correct) missing.clinical_answer_accuracy.push({ id: q.id,
    reason: `${q.kind} ${q.subjectId}, node ${q.decisionNodeId}: ${q.firstAnswer ? "wrong first answer" : "presented but unanswered"}.` });
  if (!requiredSample) missing.wait_flow.push({ id: "sample", reason: `${a.qualifyingCompletedEncounterIds.length}/${rules.minimumQualifyingScoredPatients} qualifying completions; a zero queue denominator cannot be perfect without the real-patient sample.` });
  if (!a.operatingGrossCents) missing.finances.push({ id: "gross", reason: "No positive operating gross; profit component is ineligible (zero points)." });
  if (!a.expensePostingCount) missing.finances.push({ id: "bills", reason: "No positive charged bills; paid-bill component is ineligible (zero points)." });
  const categories = (Object.entries(rules.categoryWeights) as [InspectionCategoryId, number][]).map(([id, weightPercent]) => {
    const score = scores[id] === null ? null : 100 * clip(scores[id]! / 100);
    return { id, weightPercent, score, weightedPoints: score === null ? null : score * weightPercent / 100,
      ...categoryInfo[id], rawValues: raw[id], missingItems: missing[id] };
  });
  const allPerfect = categories.every(row => row.score === 100 && !row.missingItems.length) && Boolean(evidence) &&
    evidence!.usableRoomTypeMinutes.every(row => row.minutes === rules.durationMinutes) && !evidence!.roomUpgradeDeficits.length &&
    run.baselineStaffPositions.every(slot => evidence!.staffPositionSamples.filter(row => row.positionId === slot.id).reduce((sum, row) => sum + row.observedMinutes, 0) === rules.durationMinutes) &&
    evidence!.staffPositionSamples.every(row => row.employeeId && row.trainingLevel === 5) &&
    evidence!.unmatchedEmployeeSamples.every(row => row.trainingLevel === 5) && unanswered === 0 && correct === a.presentedQuestions.length;
  let total = categories.reduce((sum, row) => sum + (row.weightedPoints ?? 0), 0);
  if (total >= 100 && !allPerfect) total = 100 - 100 * Number.EPSILON;
  const rawTotalScore = outcome === "completed" ? total : null;
  const recognition = rawTotalScore === null ? null : rawTotalScore === 100 ? "perfect" : rawTotalScore >= 95 ? "distinguished" : rawTotalScore >= 80 ? "prestige" : "improving";
  return { version: "facility-inspection-report.v1", runId: run.id, ruleVersion: run.ruleVersion,
    balanceReleaseId: run.balanceReleaseId, clinicalReleaseId: run.clinicalReleaseId,
    startedAtFacilityTick: run.startedAtFacilityTick, endedAtFacilityTick, outcome, observedActiveMinutes: minutes,
    requiredActiveMinutes: rules.durationMinutes, qualifyingScoredPatientCount: a.qualifyingCompletedEncounterIds.length,
    minimumQualifyingScoredPatients: rules.minimumQualifyingScoredPatients, categories, rawTotalScore, recognition };
}

function finishInspection(state: GameState, report: InspectionReportState): void {
  const levelFive = state.levelFive!, inspection = levelFive.inspection;
  inspection.status = report.outcome;
  inspection.lastReport = copy(report);
  inspection.run = null;
  inspection.preparation = null;
  // M7b owns actor construction; clear any saved presentation on every exit.
  levelFive.inspectionPresentation = { version: "inspection-presentation.v1", runId: null, seed: null, actors: [] };
  if (report.outcome !== "completed") return;
  inspection.latestCompletedReport = copy(report);
  if (!inspection.bestCompletedReport || report.rawTotalScore! > inspection.bestCompletedReport.rawTotalScore!) inspection.bestCompletedReport = copy(report);
  if (levelFive.progress.gameFinished) return;
  const noticeId = "event.level-five.game-finished";
  levelFive.progress.gameFinished = { version: "level-five-game-finished.v1", firstCompletedInspectionRunId: report.runId,
    finishedAtFacilityTick: report.endedAtFacilityTick, completionNoticeId: noticeId, firstCompletedReport: copy(report) };
  state.events.push({ id: noticeId, type: "success_message", facilityTick: state.facilityTick, encounterId: null,
    message: "The first completed inspection is recorded. You finished the game; the clinic remains open.",
    priority: "informational", target: { kind: "campaign", id: state.campaignId } });
}

export function cancelFacilityInspection(state: GameState): string | null {
  const inspection = state.facilityLevel === 5 ? state.levelFive?.inspection : null;
  if (!inspection || !["preparing", "running"].includes(inspection.status)) return "There is no active inspection to cancel.";
  if (inspection.run) finishInspection(state, createInspectionReport(inspection.run, state.facilityTick, true));
  else {
    inspection.status = "cancelled";
    inspection.preparation = null;
    // No report is fabricated for unscored preparation; prior reports stay frozen.
  }
  return null;
}
