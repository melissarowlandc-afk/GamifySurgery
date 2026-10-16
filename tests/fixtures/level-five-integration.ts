import {
  deserializeGameState, gameReducer, getCurrentQuestion, getFacilityProgressionStatus,
  getServiceIncomeTotalsCents, serializeGameState,
  type DomainContext, type GameCommand, type GameState, type InspectionReportState,
} from "@gamify-surgery/game-domain";
import { createEarlyLevelFourEconomyState } from "../../tools/economy-audit/level-four-simulation";
import { LEVEL_FIVE_ROOMS_QA_PLACEMENTS } from "./level-five-rooms";

export type IntegrationCommand = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId"> }[GameCommand["type"]];
export const LEVEL_FIVE_INTEGRATION_SEED = "level-five-m9.integration.01";
/** One ten-hour operating-day study session per calendar day. Real-world FSRS
 * due dates remain authoritative; the intervening time adds no active minute. */
export function integrationReviewTime(state: GameState, tick = state.facilityTick): number {
  return state.createdAtRealMs + Math.floor(tick / 600) * 86_400_000 + (tick % 600) * 1000;
}

/** The existing funded synthetic opening is the only setup grant. Everything
 * after it uses real commands, ordinary arrivals, the full clinical pool and
 * catalog prices. No goal XP, scored history, visit witness or report is seeded. */
export class LevelFiveIntegrationJourney {
  state: GameState;
  sequence = 0;
  accuracy = 80;
  readonly firstAnswers = new Map<string, { level: number; tick: number; correct: boolean }>();
  readonly receiptKeys = new Set<string>();
  readonly rounds = new Set<string>();
  readonly comfortUses = new Set<string>();
  readonly checkpoints: Record<string, GameState> = {};
  readonly reports: InspectionReportState[] = [];
  commands = 0;
  grossCents = 0;
  stockCents = 0;
  paidCents = 0;
  capitalCents = 0;
  readonly openingCashCents: number;
  xpGoalTick: number | null = null;

  constructor(readonly context: DomainContext, initialState?: GameState) {
    this.state = initialState ?? createEarlyLevelFourEconomyState(LEVEL_FIVE_INTEGRATION_SEED, context);
    this.openingCashCents = this.state.cashCents;
    // Restore the opening fixture's suppressed scored clock, then leave all
    // arrival intervals, clinical selection, FSRS and retirement untouched.
    if (!initialState) this.state.nextRoutineArrivalTick = context.balanceRelease.arrivals.routineBaseIntervalMinutes;
    else this.sequence = initialState.facilityTick * 10;
  }

  apply(command: IntegrationCommand): void {
    const before = this.state, operationId = `m9.journey.${this.sequence++}`;
    this.state = gameReducer(before, { ...command, operationId } as GameCommand, this.context);
    if (this.state.operationReceipts[operationId]?.status !== "applied") throw new Error(`M9 ${command.type}: ${this.state.operationReceipts[operationId]?.message}`);
    const totalsBefore = getServiceIncomeTotalsCents(before), totalsAfter = getServiceIncomeTotalsCents(this.state);
    const settlement = this.state.settlements.filter(r => !before.settlements.some(old => old.id === r.id))
      .reduce((sum, r) => sum + Math.round(r.netCashDelta * 100), 0);
    const gross = totalsAfter.grossCents - totalsBefore.grossCents + settlement;
    const stock = totalsAfter.stockCostCents - totalsBefore.stockCostCents;
    const charged = Math.round(this.state.totalOperatingExpenses * 100) - Math.round(before.totalOperatingExpenses * 100);
    const capital = command.type === "PLACE_ROOM" ? Math.round(this.context.balanceRelease.facility.roomDefinitions.find(r => r.id === command.roomDefinitionId)!.constructionCost * 100)
      : command.type === "HIRE_STAFF" ? Math.round(this.context.balanceRelease.facility.staffRoleDefinitions.find(r => r.id === command.staffRoleDefinitionId)!.hiringCost * 100) : 0;
    const paid = Math.min(charged, Math.max(0, before.cashCents + gross - stock - capital));
    if (this.state.cashCents - before.cashCents !== gross - stock - paid - capital) throw new Error(`M9 cash reconciliation at ${this.state.facilityTick}`);
    this.grossCents += gross; this.stockCents += stock; this.paidCents += paid; this.capitalCents += capital;
    if (this.state.cashCents !== this.openingCashCents + this.grossCents - this.stockCents - this.paidCents - this.capitalCents) throw new Error("M9 lifetime cash reconciliation");
    for (const receipt of this.state.serviceIncomeReceipts) this.receiptKeys.add(receipt.transactionKey);
    for (const encounter of Object.values(this.state.encounters)) for (const answer of encounter.answers) {
      const key = `${encounter.id}:${answer.decisionNodeId}`;
      if (!this.firstAnswers.has(key)) this.firstAnswers.set(key, { level: this.state.facilityLevel, tick: answer.answeredAtFacilityTick, correct: answer.correct });
    }
    if (command.type === "SUBMIT_ANSWER") {
      const answer = this.state.encounters[command.encounterId]!.answers.find(a => a.decisionNodeId === command.decisionNodeId)!;
      if (this.state.clinicalXp - before.clinicalXp !== (answer.correct ? 10 : 2)) throw new Error("M9 ordinary first-answer XP");
    } else if (command.type !== "LEVEL_UP" && this.state.clinicalXp !== before.clinicalXp) throw new Error("M9 unearned XP");
    const round = this.state.levelFive?.management.round;
    if (round?.status === "completed") {
      if (round.completedAtFacilityTick !== round.effectsAppliedAtFacilityTick) throw new Error("M9 duplicate daily award");
      this.rounds.add(round.id);
    }
    for (const visit of [...Object.values(this.state.encounters), ...this.state.serviceOperations])
      if (visit.executiveComfort?.points && visit.executiveComfort.appliedAtFacilityTick !== null) this.comfortUses.add(visit.id);
    if (this.state.facilityLevel === 5 && this.state.clinicalXp >= 2000) this.xpGoalTick ??= this.state.facilityTick;
    this.commands++;
  }

  tick(): void {
    if (this.state.facilityTick > 0 && this.state.facilityTick % 600 === 0) {
      this.apply({ type: "SET_PAUSED", paused: true });
      this.apply({ type: "SET_PAUSED", paused: false });
    }
    this.apply({ type: "ADVANCE_TICK", advancedAtRealMs: integrationReviewTime(this.state, this.state.facilityTick + 1) });
  }

  /** One actual chart action per minute, with ordered care allowed to finish
   * unattended. No auto-answer code is installed in the browser QA entry. */
  pump(): void {
    const state = this.state, open = state.openChartEncounterId ? state.encounters[state.openChartEncounterId] : null;
    if (open?.terminalFeedback && !open.terminalFeedback.acknowledged) return this.apply({ type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId: open.id });
    if (open && (open.resolutionReason || ["resolved_summary_available", "resolved"].includes(open.lifecycle))) return this.apply({ type: "CLOSE_CHART", encounterId: open.id });
    const step = open?.steps[open.currentNodeIndex];
    if (open && step?.status === "feedback_pending") return this.apply({ type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: open.id, decisionNodeId: step.decisionNodeId });
    const question = open ? getCurrentQuestion(state, open.id, this.context) : null;
    if (open && question && !open.patientMovement) {
      const n = [...this.firstAnswers.values()].filter(a => a.level === state.facilityLevel).length + 1;
      const correct = this.accuracy === 100 || (this.accuracy === 80 && n % 5 !== 0);
      return this.apply({ type: "SUBMIT_ANSWER", encounterId: open.id, decisionNodeId: question.node.id,
        answerChoiceId: question.node.answerChoices.find(a => a.isCorrect === correct)!.id,
        reviewedAtMs: integrationReviewTime(state) });
    }
    if (open?.lifecycle === "active_action_required") return;
    const ready = Object.values(state.encounters).filter(e => !e.resolutionReason && !e.patientMovement && e.checkInStatus === "checked_in" &&
      (e.lifecycle === "waiting_unopened" || e.lifecycle === "active_action_required" || e.steps[e.currentNodeIndex]?.status === "feedback_pending"))
      .sort((a, b) => a.waiting.arrivedAtTick - b.waiting.arrivedAtTick || a.id.localeCompare(b.id))[0];
    if (ready && ready.id !== open?.id) this.apply(open ? { type: "CLOSE_CHART", encounterId: open.id } : { type: "OPEN_CHART", encounterId: ready.id });
  }

  checkpoint(name: string): void {
    this.checkpoints[name] = gameReducer(this.state, { type: "SET_PAUSED", paused: true, operationId: `m9.snapshot.${name}` }, this.context);
    // The snapshot is a real paused save; this branch keeps its original pause
    // and receipts. It is not inserted back into the continuous playthrough.
    const loaded = deserializeGameState(serializeGameState(this.checkpoints[name]!), this.context);
    if (JSON.stringify(loaded.levelFive) !== JSON.stringify(this.checkpoints[name]!.levelFive)) throw new Error(`M9 frozen state on ${name} reload`);
  }

  buildCluster(): void {
    for (let x = 22; x <= 49; x++) this.apply({ type: "PLACE_ROOM", roomDefinitionId: "room.hallway", roomId: `room.m9.north.${x}`, x, y: 21, orientation: 0 });
    for (let y = 22; y <= 25; y++) this.apply({ type: "PLACE_ROOM", roomDefinitionId: "room.hallway", roomId: `room.m9.link.${y}`, x: 34, y, orientation: 0 });
    for (const room of LEVEL_FIVE_ROOMS_QA_PLACEMENTS) {
      this.apply({ type: "PLACE_ROOM", roomDefinitionId: room.roomDefinitionId, roomId: room.roomId, x: room.x, y: room.y, orientation: 0 });
      this.apply({ type: "PLACE_DOOR", roomId: room.roomId, doorId: `door.${room.roomId}`, side: "south", offset: room.doorOffset });
    }
    for (let x = 53; x <= 58; x++) this.apply({ type: "PLACE_ROOM", roomDefinitionId: "room.hallway", roomId: `room.m9.east.${x}`, x, y: 26, orientation: 0 });
    for (const [definition, id, y, side] of [["room.reading", "room.m9.reading", 27, "north"], ["room.training", "room.m9.training", 23, "south"]] as const) {
      this.apply({ type: "PLACE_ROOM", roomDefinitionId: definition, roomId: id, x: 54, y, orientation: 0 });
      this.apply({ type: "PLACE_DOOR", roomId: id, doorId: `door.${id}`, side, offset: 1 });
    }
    this.apply({ type: "HIRE_STAFF", staffRoleDefinitionId: "staff.radiologist", employeeId: "employee.m9.reader" });
    this.apply({ type: "HIRE_STAFF", staffRoleDefinitionId: "staff.executive", employeeId: "employee.m9.executive" });
  }
}

export function runLevelFiveIntegrationJourney(context: DomainContext, progress?: (message: string, state: GameState) => void): LevelFiveIntegrationJourney {
  const journey = new LevelFiveIntegrationJourney(context);
  // Earn the old goals in real Level 4 play as well, rather than manufacturing
  // the old witnesses or seeding the 750/2,000 XP boundaries.
  for (let i = 0; i < 36_000 && !getFacilityProgressionStatus(journey.state, context).eligible; i++) {
    journey.pump(); journey.tick();
    if (journey.state.facilityTick % 600 === 0) progress?.(`L4 ${journey.state.facilityTick / 60}h, ${journey.state.clinicalXp} XP`, journey.state);
  }
  if (!getFacilityProgressionStatus(journey.state, context).eligible) throw new Error("M9 mature Level 4 goals did not become eligible");
  journey.checkpoint("integration-l4");
  journey.apply({ type: "LEVEL_UP" });
  if (journey.state.facilityLevel !== 5 || journey.state.clinicalXp !== 0) throw new Error("M9 Advance must reset once");
  journey.buildCluster();
  journey.checkpoint("integration-build");
  for (let i = 0; i < 36_000 && !journey.state.levelFive?.progress.inspectionUnlocked; i++) {
    journey.pump(); journey.tick();
    if (journey.state.facilityTick % 600 === 0) progress?.(`L5 ${journey.state.facilityTick / 60}h, ${journey.state.clinicalXp} XP`, journey.state);
  }
  if (!journey.state.levelFive?.progress.inspectionUnlocked) throw new Error("M9 real Level 5 goals did not unlock");
  for (let attempt = 0; attempt < 3; attempt++) {
    journey.accuracy = attempt === 0 ? 80 : attempt === 1 ? 100 : 0;
    journey.apply({ type: "BOOK_INSPECTION" });
    if (attempt === 0) journey.checkpoint("integration-preparing");
    for (let i = 0; i < 3061 && ["preparing", "running"].includes(journey.state.levelFive!.inspection.status); i++) {
      journey.pump(); journey.tick();
      const minutes = journey.state.levelFive!.inspection.run?.accumulators.observedActiveMinutes;
      if (attempt === 0 && minutes === 80) journey.checkpoint("integration-running");
      if (minutes === 2999 && attempt < 2) journey.checkpoint(attempt === 0 ? "integration-final" : "integration-repeat-final");
    }
    const report = journey.state.levelFive!.inspection.lastReport!;
    if (report.outcome !== "completed") throw new Error(`M9 inspection ${attempt + 1}: ${report.outcome}, ${report.qualifyingScoredPatientCount} patients`);
    journey.reports.push(structuredClone(report));
    progress?.(`Inspection ${attempt + 1}: ${report.rawTotalScore}, ${report.qualifyingScoredPatientCount}/20`, journey.state);
    if (attempt === 0) {
      journey.checkpoint("integration-finish");
      journey.apply({ type: "ACKNOWLEDGE_FINISH_PAGE" });
      // Keep playing actually runs normal paid operations for an operating day.
      for (let i = 0; i < 600; i++) { journey.pump(); journey.tick(); }
    }
    if (attempt === 1) journey.checkpoint("integration-repeat");
  }
  return journey;
}
