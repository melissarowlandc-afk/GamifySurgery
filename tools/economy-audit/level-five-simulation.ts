import {
  deserializeGameState, gameReducer, getActiveExecutiveTerms, getAverageEffectiveStaffMorale,
  getCurrentQuestion, getDisplayedClinicSatisfaction, getEmployeeEffectiveMorale, getEmployeeTrainingQuote,
  getOperatingExpensePerFacilityHour, getRoomDefinition, getRoomUpkeepBeforeSupplierPerFacilityHour,
  getServiceIncomeTotalsCents, getSupplierUpkeepSavingsPerFacilityHour, serializeGameState,
  type DomainContext, type GameCommand, type GameState, type InspectionReportState,
} from "@gamify-surgery/game-domain";
import { createLevelFiveEconomyState, LEVEL_FIVE_ECONOMY_EXECUTIVE_ID, LEVEL_FIVE_ECONOMY_READER_ID } from "../../tests/fixtures/level-five-economy";

type Command = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId"> }[GameCommand["type"]];
const cents = (amount: number) => Math.round(amount * 100);
function check(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(`M8 audit: ${message}`); }
const terminalRetail = (status: string) => ["completed", "cancelled", "abandoned"].includes(status);

export const LEVEL_FIVE_AUDIT_SEEDS = ["level-five-m8.01", "level-five-m8.02", "level-five-m8.03"] as const;
export const LEVEL_FIVE_ECONOMIC_SCENARIOS = [
  "passive-qualified", "passive-no-executive", "passive-no-round", "active-qualified", "active-no-executive", "active-no-round",
  "missed-first-round", "half-gift", "slow-demand", "unfunded", "reader-training", "gift-outage",
] as const;
export type LevelFiveEconomicScenario = typeof LEVEL_FIVE_ECONOMIC_SCENARIOS[number];

interface Receipt { id: string; key: string; tick: number; line: string; gross: number; stock: number; net: number; actorId: string }
interface Ended { tick: number; completed: boolean; satisfaction: number }
interface Answer { tick: number; encounterId: string; correct: boolean }
interface Posting { tick: number; charged: number; paid: number }

/** An independent external ledger sees every command BEFORE history retirement
 * can hide it on a later tick. It never mutates clinical/economic rules. */
export class LevelFiveReducerAudit {
  state: GameState;
  sequence = 0;
  commandsChecked = 0;
  openingCash: number;
  minimumCash: number;
  maximumCash: number;
  capitalCents = 0;
  receiptNetCents = 0;
  settlementCents = 0;
  paidCents = 0;
  readonly receipts = new Map<string, Receipt>();
  readonly settlements = new Map<string, Receipt>();
  readonly answers = new Map<string, Answer>();
  readonly ended = new Map<string, Ended>();
  readonly arrivals = new Map<string, number>();
  readonly postings: Posting[] = [];
  readonly completedRounds = new Map<string, { day: number; tick: number; moralePoints: number; supplierPercent: number }>();
  readonly gymBreaks = new Map<string, { employeeId: string; tick: number; points: number }>();
  readonly gardenUses = new Map<string, { tick: number; points: number }>();
  readonly comfortUses = new Map<string, { tick: number; points: number }>();
  readonly trajectories: Array<{ tick: number; gameHours: number; cashCents: number; xp: number; satisfaction: number; morale: number | null }> = [];
  readonly stalls = new Map<string, { since: number; signature: string; maximumUnchangedMinutes: number }>();
  readonly staleActors = new Map<string, number>();
  readonly minuteCosts: Array<{ tick: number; payroll: number; upkeepBefore: number; supplier: number; roomUpkeep: Record<string, number>; qualified: boolean }> = [];
  readonly reloads: Array<{ tick: number; preserved: string[]; legacyIdleDeadlineChanges: number }> = [];
  inspectionStart: number | null = null;
  inspectionOpeningCash: number | null = null;
  inspectionWindow: { receiptIds: string[]; gross: number; stock: number; charged: number; paid: number; postings: number; fullyPaid: number } | null = null;
  readonly inspectionOpeningReceiptIds = new Set<string>();

  constructor(readonly context: DomainContext, seed: string, readonly active = false, readonly accuracy = 80,
    setup: { reader?: boolean; executive?: boolean; blockExecutive?: boolean } = {}) {
    this.state = createLevelFiveEconomyState(context, { seed, scored: active, ...setup });
    this.openingCash = this.minimumCash = this.maximumCash = this.state.cashCents;
    this.observe();
    this.sample();
  }

  apply(command: Command): void {
    const before = this.state, operationId = `m8.audit.${this.sequence++}`;
    const beforeNet = this.receiptNetCents + this.settlementCents;
    const beforeCapital = this.capitalCents;
    const inRun = before.levelFive?.inspection.status === "running";
    if (command.type === "ADVANCE_TICK" && !before.paused) this.captureMinuteCosts(before);
    this.state = gameReducer(before, { ...command, operationId } as GameCommand, this.context);
    check(this.state.operationReceipts[operationId]?.status === "applied", `${command.type}: ${this.state.operationReceipts[operationId]?.message}`);
    if (command.type === "TRAIN_EMPLOYEE") this.capitalCents += cents(this.state.employees.find(e => e.id === command.employeeId)!.training!.paidAmount);
    if (command.type === "PLACE_ROOM") this.capitalCents += cents(getRoomDefinition(command.roomDefinitionId, this.context)!.constructionCost);
    for (const e of before.employees) {
      const benefit = e.facilityTask?.roomUpgradeBreakBenefit;
      const after = this.state.employees.find(row => row.id === e.id);
      if (benefit?.roomDefinitionId === "room.staff_gym" && after?.lastBreakAtFacilityTick === this.state.facilityTick && e.lastBreakAtFacilityTick !== after.lastBreakAtFacilityTick)
        this.gymBreaks.set(`${e.id}:${after.lastBreakAtFacilityTick}`, { employeeId: e.id, tick: after.lastBreakAtFacilityTick, points: benefit.moraleGain });
    }
    this.observe();
    const income = this.receiptNetCents + this.settlementCents - beforeNet;
    const capital = this.capitalCents - beforeCapital;
    const charged = cents(this.state.totalOperatingExpenses) - cents(before.totalOperatingExpenses);
    const paid = Math.min(charged, Math.max(0, before.cashCents + income - capital));
    check(this.state.cashCents - before.cashCents === income - capital - paid,
      `cash at tick ${this.state.facilityTick}: ${this.state.cashCents - before.cashCents} != ${income} - ${capital} - ${paid}`);
    if (charged > 0) this.postings.push({ tick: this.state.facilityTick, charged, paid });
    this.paidCents += paid;
    check(this.state.cashCents === this.openingCash + this.receiptNetCents + this.settlementCents - this.capitalCents - this.paidCents, "lifetime cash reconciliation");
    const totals = getServiceIncomeTotalsCents(this.state);
    check(totals.grossCents === [...this.receipts.values()].reduce((s, r) => s + r.gross, 0), "retired + live service gross");
    check(totals.stockCostCents === [...this.receipts.values()].reduce((s, r) => s + r.stock, 0), "retired + live stock");
    check(totals.netCashDeltaCents === this.receiptNetCents, "retired + live service net");
    check(this.state.clinicalXp === [...this.answers.values()].reduce((s, a) => s + (a.correct ? 10 : 2), 0), "first answers must reconcile with 10/2 XP");
    if (inRun && this.inspectionWindow) {
      const w = this.inspectionWindow;
      const ids = new Set(w.receiptIds);
      for (const r of [...this.receipts.values(), ...this.settlements.values()]) if (!ids.has(r.id) && !this.inspectionOpeningReceiptIds.has(r.id) && r.tick >= this.inspectionStart! && r.tick <= this.state.facilityTick) {
        w.receiptIds.push(r.id); w.gross += r.gross; w.stock += r.stock;
      }
      w.charged += charged; w.paid += paid;
      if (charged > 0) { w.postings++; if (charged === paid) w.fullyPaid++; }
    }
    if (this.inspectionStart === null && this.state.levelFive?.inspection.status === "running") {
      this.inspectionStart = this.state.levelFive.inspection.run!.startedAtFacilityTick;
      this.inspectionOpeningCash = this.state.cashCents;
      this.inspectionWindow = { receiptIds: [], gross: 0, stock: 0, charged: 0, paid: 0, postings: 0, fullyPaid: 0 };
      for (const r of [...this.receipts.values(), ...this.settlements.values()]) this.inspectionOpeningReceiptIds.add(r.id);
    }
    this.commandsChecked++;
    if (command.type === "ADVANCE_TICK") {
      this.checkActors();
      if (this.state.facilityTick % 600 === 0) this.sample();
    }
  }

  tick(): void { this.apply({ type: "ADVANCE_TICK", advancedAtRealMs: this.state.createdAtRealMs + (this.state.facilityTick + 1) * this.context.balanceRelease.clock.realMillisecondsPerFacilityMinuteAt1x }); }

  /** One chart action per minute. Pending clinical travel/tests continue while
   * another ready chart is answered. Every fifth/tenth first answer is wrong;
   * the pool, key, FSRS, progression and settlement remain production code. */
  pump(): void {
    if (!this.active) return;
    const state = this.state, opened = state.openChartEncounterId ? state.encounters[state.openChartEncounterId] : null;
    if (opened?.terminalFeedback && !opened.terminalFeedback.acknowledged) { this.apply({ type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", encounterId: opened.id }); return; }
    if (opened && (opened.resolutionReason || ["resolved_summary_available", "resolved"].includes(opened.lifecycle))) { this.apply({ type: "CLOSE_CHART", encounterId: opened.id }); return; }
    const step = opened?.steps[opened.currentNodeIndex];
    if (opened && step?.status === "feedback_pending") { this.apply({ type: "ACKNOWLEDGE_DECISION_FEEDBACK", encounterId: opened.id, decisionNodeId: step.decisionNodeId }); return; }
    const question = opened ? getCurrentQuestion(state, opened.id, this.context) : null;
    if (opened && question && !opened.patientMovement) {
      const correct = (this.answers.size + 1) % (this.accuracy === 90 ? 10 : 5) !== 0;
      const choice = question.node.answerChoices.find(choice => choice.isCorrect === correct)!;
      this.apply({ type: "SUBMIT_ANSWER", encounterId: opened.id, decisionNodeId: question.node.id, answerChoiceId: choice.id,
        reviewedAtMs: state.createdAtRealMs + state.facilityTick * this.context.balanceRelease.clock.realMillisecondsPerFacilityMinuteAt1x });
      return;
    }
    // Opening a chart accepts consultation travel. Keep attending until that
    // patient arrives; CLOSE_CHART here would send them back to waiting and
    // repeatedly starve the consultation when another patient is ready.
    // Only an already ordered, result-pending episode can continue unattended.
    if (opened?.lifecycle === "active_action_required") return;
    const ready = Object.values(state.encounters).filter(e => !e.resolutionReason && !e.patientMovement && e.checkInStatus === "checked_in" &&
      (e.lifecycle === "waiting_unopened" || e.lifecycle === "active_action_required" || e.steps[e.currentNodeIndex]?.status === "feedback_pending"))
      .sort((a, b) => a.waiting.arrivedAtTick - b.waiting.arrivedAtTick || a.id.localeCompare(b.id))[0];
    if (ready && ready.id !== opened?.id) {
      if (opened) this.apply({ type: "CLOSE_CHART", encounterId: opened.id });
      else this.apply({ type: "OPEN_CHART", encounterId: ready.id });
    }
  }

  observe(): void {
    const state = this.state;
    check(new Set(state.serviceIncomeReceipts.map(r => r.transactionKey)).size === state.serviceIncomeReceipts.length, "duplicate live transaction key");
    for (const r of state.serviceIncomeReceipts) {
      const row = { id: r.id, key: r.transactionKey, tick: r.completedAtFacilityTick, line: r.incomeLineId, gross: cents(r.grossAmount), stock: cents(r.stockCost), net: cents(r.netCashDelta), actorId: r.actorId };
      check(row.gross - row.stock === row.net, `receipt ${row.key} gross minus stock`);
      const old = this.receipts.get(row.key);
      if (old) check(JSON.stringify(old) === JSON.stringify(row), `receipt changed/repaid ${row.key}`);
      else { this.receipts.set(row.key, row); this.receiptNetCents += row.net; }
    }
    for (const r of state.settlements) if (!this.settlements.has(r.id)) {
      const net = cents(r.netCashDelta);
      this.settlements.set(r.id, { id: r.id, key: r.id, tick: r.settledAtFacilityTick, line: "scored_settlement", gross: net, stock: 0, net, actorId: r.encounterId });
      this.settlementCents += net;
    }
    for (const e of Object.values(state.encounters)) {
      if (e.arrivalClass === "routine") this.arrivals.set(e.id, e.waiting.arrivedAtTick);
      for (const a of e.answers) this.answers.set(`${e.id}:${a.decisionNodeId}`, { tick: a.answeredAtFacilityTick, encounterId: e.id, correct: a.correct });
      if (e.resolutionReason && e.resolvedAtFacilityTick !== null) this.ended.set(e.id, { tick: e.resolvedAtFacilityTick, completed: e.resolutionReason === "completed", satisfaction: e.finalPatientSatisfaction ?? e.patientSatisfaction });
      if (e.gardenVisitBenefit) this.gardenUses.set(e.id, { tick: e.gardenVisitBenefit.completedAtFacilityTick, points: e.gardenVisitBenefit.points });
      if (e.executiveComfort?.appliedAtFacilityTick !== null && e.executiveComfort?.appliedAtFacilityTick !== undefined) this.comfortUses.set(e.id, { tick: e.executiveComfort.appliedAtFacilityTick, points: e.executiveComfort.points });
    }
    for (const operation of state.serviceOperations) {
      if (operation.gardenVisitBenefit) this.gardenUses.set(operation.id, { tick: operation.gardenVisitBenefit.completedAtFacilityTick, points: operation.gardenVisitBenefit.points });
      if (operation.executiveComfort?.appliedAtFacilityTick !== null && operation.executiveComfort?.appliedAtFacilityTick !== undefined) this.comfortUses.set(operation.id, { tick: operation.executiveComfort.appliedAtFacilityTick, points: operation.executiveComfort.points });
    }
    const round = state.levelFive?.management.round;
    if (round?.status === "completed") {
      check(round.completedAtFacilityTick === round.effectsAppliedAtFacilityTick, "daily round applied once at completion");
      const duplicateDay = [...this.completedRounds.entries()].find(([id, r]) => r.day === round.dayNumber && id !== round.id);
      check(!duplicateDay, "two awards in one operating day");
      this.completedRounds.set(round.id, { day: round.dayNumber, tick: round.completedAtFacilityTick!, moralePoints: round.effects.staffMoralePoints, supplierPercent: round.effects.supplierReductionPercent });
    }
    for (const e of state.employees) {
      check(e.morale >= 0 && e.morale <= 100 && getEmployeeEffectiveMorale(state, e) <= 100, `bounded morale ${e.id}`);
    }
    const satisfaction = getDisplayedClinicSatisfaction(state, this.context);
    check(satisfaction >= 0 && satisfaction <= 100, "bounded satisfaction");
    this.minimumCash = Math.min(this.minimumCash, state.cashCents);
    this.maximumCash = Math.max(this.maximumCash, state.cashCents);
  }

  captureMinuteCosts(state: GameState): void {
    const before = getRoomUpkeepBeforeSupplierPerFacilityHour(state, this.context), supplier = getSupplierUpkeepSavingsPerFacilityHour(state, this.context);
    const roomUpkeep: Record<string, number> = {};
    for (const room of state.rooms) {
      const definition = getRoomDefinition(room.roomDefinitionId, this.context)!;
      const relief = room.upkeepOutage && room.upkeepOutage.lastObservedFacilityTick === state.facilityTick && state.facilityTick - room.upkeepOutage.sinceFacilityTick >= 60;
      const value = relief ? definition.upkeepPerExpenseInterval / 5 : definition.upkeepPerExpenseInterval + (room.upgradeLevel - 1) * definition.upkeepPerUpgradeLevel;
      roomUpkeep[room.roomDefinitionId] = (roomUpkeep[room.roomDefinitionId] ?? 0) + value * (before ? 1 - supplier / before : 1);
    }
    const payroll = state.employees.reduce((s, e) => s + e.salaryPerExpenseInterval, 0);
    check(Math.abs(-getOperatingExpensePerFacilityHour(state, this.context) - (before - supplier + payroll)) < 1e-8, "minute quote components");
    this.minuteCosts.push({ tick: state.facilityTick + 1, payroll, upkeepBefore: before, supplier, roomUpkeep, qualified: Boolean(getActiveExecutiveTerms(state, this.context)) });
  }

  sample(): void {
    const state = this.state;
    this.trajectories.push({ tick: state.facilityTick, gameHours: state.facilityTick / 60, cashCents: state.cashCents, xp: state.clinicalXp,
      satisfaction: getDisplayedClinicSatisfaction(state, this.context), morale: getAverageEffectiveStaffMorale(state) });
  }

  checkActors(): void {
    const now = this.state.facilityTick;
    const active = new Set<string>();
    const moving = (key: string, signature: unknown) => {
      active.add(key);
      const value = JSON.stringify(signature), old = this.stalls.get(key);
      const since = old?.signature === value ? old.since : now;
      const maximum = Math.max(old?.maximumUnchangedMinutes ?? 0, now - since);
      this.stalls.set(key, { since, signature: value, maximumUnchangedMinutes: maximum });
      // One operating day without movement/progress is an audit alarm, not a
      // gameplay timeout. Intentional technical outages are reported separately.
      if (now - since >= 600) this.staleActors.set(key, now - since);
    };
    for (const e of this.state.employees) if (e.pathIndex < e.path.length - 1) moving(`employee:${e.id}`, [e.location, e.pathIndex, e.facilityTask?.kind, e.training?.stage]);
    const founder = this.state.environment.founderActivity;
    if (founder && founder.pathIndex < founder.path.length - 1) moving("founder", [founder.kind, founder.targetId, founder.pathIndex, this.state.environment.founderLocation]);
    for (const e of Object.values(this.state.encounters)) if (e.patientMovement && e.patientMovement.pathIndex < e.patientMovement.path.length - 1)
      moving(`patient:${e.id}`, [e.patientMovement.kind, e.patientMovement.pathIndex, e.patientLocation]);
    for (const actor of this.state.retailExternalActors) if (actor.pathIndex < actor.path.length - 1) moving(`visitor:${actor.id}`, [actor.lifecycle, actor.pathIndex, actor.location]);
    for (const trip of this.state.patientAmenityTrips ?? []) if (trip.pathIndex < trip.path.length - 1) moving(`amenity:${trip.id}`, [trip.status, trip.pathIndex, trip.returnRequested]);
    for (const family of Object.values(this.state.pediatricFamilies ?? {})) if (family.movement && family.movement.pathIndex < family.movement.childPath.length - 1)
      moving(`family:${family.id}`, [family.phase, family.movement.pathIndex]);
    for (const r of this.state.retailOperations) if (!terminalRetail(r.status)) moving(`retail:${r.id}`, [r.status, r.location, r.pathIndex, r.purchaseEndsAtFacilityTick, r.giftCheckout]);
    for (const s of this.state.serviceOperations) if (!["completed", "cancelled"].includes(s.status)) moving(`service:${s.id}`, [s.status, s.phaseIndex, s.phaseEndsAtFacilityTick, s.pathIndex, s.location]);
    for (const a of this.state.levelFive?.inspectionPresentation.actors ?? []) moving(`inspector:${a.id}`, [a.phase, a.location, a.pathIndex, a.targetRoomInstanceId, a.observingUntilFacilityTick]);
    for (const key of this.stalls.keys()) if (!active.has(key)) this.stalls.delete(key);
  }

  reload(): void {
    const before = this.state, next = deserializeGameState(serializeGameState(before), this.context);
    let idleChanges = 0;
    for (const id of Object.keys(before.encounters)) if (before.encounters[id]?.idleWaitingSinceTick !== next.encounters[id]?.idleWaitingSinceTick) idleChanges++;
    for (const field of ["cashCents", "clinicalXp", "totalOperatingExpenses", "operatingAccrualSixtiethCents", "levelFive", "giftRetailDemand", "serviceIncomeReceipts", "retiredServiceHistory", "settlements", "learningHistories"] as const)
      check(JSON.stringify(next[field]) === JSON.stringify(before[field]), `reload preserved ${field}`);
    this.state = next;
    this.reloads.push({ tick: next.facilityTick, preserved: ["cash", "XP", "expenses/accrual", "Level 5 clocks/evidence/actors", "gift demand", "receipts/retired totals", "settlements", "FSRS"], legacyIdleDeadlineChanges: idleChanges });
  }

  metrics(start: number, end: number) {
    const within = (tick: number) => tick > start && tick <= end;
    const receipts = [...this.receipts.values(), ...this.settlements.values()].filter(r => within(r.tick));
    const bills = this.postings.filter(r => within(r.tick));
    const answers = [...this.answers.values()].filter(r => within(r.tick));
    const ended = [...this.ended.values()].filter(r => within(r.tick));
    const minutes = this.minuteCosts.filter(r => within(r.tick));
    const hours = (end - start) / 60;
    const gross = receipts.reduce((s, r) => s + r.gross, 0), stock = receipts.reduce((s, r) => s + r.stock, 0), charged = bills.reduce((s, r) => s + r.charged, 0), paid = bills.reduce((s, r) => s + r.paid, 0);
    const byLine: Record<string, { count: number; grossCents: number; stockCents: number; netCents: number }> = {};
    for (const r of receipts) { const row = byLine[r.line] ??= { count: 0, grossCents: 0, stockCents: 0, netCents: 0 }; row.count++; row.grossCents += r.gross; row.stockCents += r.stock; row.netCents += r.net; }
    const xp = answers.reduce((s, a) => s + (a.correct ? 10 : 2), 0);
    const payroll = minutes.reduce((s, m) => s + m.payroll / 60, 0);
    const upkeepBefore = minutes.reduce((s, m) => s + m.upkeepBefore / 60, 0);
    const roomUpkeep: Record<string, number> = {};
    for (const minute of minutes) for (const [id, value] of Object.entries(minute.roomUpkeep)) roomUpkeep[id] = (roomUpkeep[id] ?? 0) + value / 60;
    return { startTick: start, endTick: end, gameHours: hours, scoredArrivals: [...this.arrivals.values()].filter(within).length,
      firstAnswers: answers.length, correctFirstAnswers: answers.filter(a => a.correct).length, accuracyPercent: answers.length ? 100 * answers.filter(a => a.correct).length / answers.length : null,
      clinicalXp: xp, xpPerGameHour: xp / hours, completedPatients: ended.filter(e => e.completed).length, walkouts: ended.filter(e => !e.completed).length,
      meanEndedPatientSatisfaction: ended.length ? ended.reduce((s, e) => s + e.satisfaction, 0) / ended.length : null,
      grossCents: gross, stockCents: stock, chargedOperatingCents: charged, paidOperatingCents: paid, positivePostings: bills.length, fullyPaidPostings: bills.filter(b => b.charged === b.paid).length,
      grossPerHour: gross / 100 / hours, stockPerHour: stock / 100 / hours, payrollPerHour: payroll / hours,
      upkeepBeforeSupplierPerHour: upkeepBefore / hours, postedOperatingPerHour: charged / 100 / hours,
      operatingNetPerHour: (gross - stock - charged) / 100 / hours, qualifiedMinuteShare: minutes.filter(m => m.qualified).length / minutes.length,
      upkeepByRoomPerHour: Object.fromEntries(Object.entries(roomUpkeep).map(([id, value]) => [id, value / hours])), byLine };
  }

  verifyInspection(report: InspectionReportState): void {
    const w = this.inspectionWindow!;
    const finance = report.categories.find(c => c.id === "finances")!.rawValues;
    for (const [key, value] of Object.entries({ operatingGrossCents: w.gross, stockCostCents: w.stock, chargedOperatingExpenseCents: w.charged,
      paidOperatingExpenseCents: w.paid, expensePostings: w.postings, paidPostings: w.fullyPaid })) check(finance[key] === value, `inspection ${key}: ${finance[key]} != ${value}`);
    const ended = [...this.ended.entries()].filter(([, e]) => e.tick >= report.startedAtFacilityTick && e.tick <= report.endedAtFacilityTick);
    const answers = [...this.answers.values()].filter(a => a.tick >= report.startedAtFacilityTick && a.tick <= report.endedAtFacilityTick);
    const qualifying = ended.filter(([id, e]) => e.completed && answers.some(a => a.encounterId === id)).length;
    check(report.qualifyingScoredPatientCount === qualifying, "inspection real qualifying patients");
    const accuracy = report.categories.find(c => c.id === "clinical_answer_accuracy")!.rawValues;
    check(accuracy.allFirstSubmissions === answers.length && accuracy.correctFirstSubmissions === answers.filter(a => a.correct).length, "inspection first answers");
    const satisfaction = report.categories.find(c => c.id === "patient_satisfaction")!.rawValues;
    check(satisfaction.patientCount === ended.length && Math.abs(satisfaction.satisfactionSum! - ended.reduce((s, [, e]) => s + e.satisfaction, 0)) < 1e-8, "inspection ended satisfaction");
    check(report.observedActiveMinutes === 3000 && report.endedAtFacilityTick - report.startedAtFacilityTick === 3000, "full inspection window");
    check(Math.abs(report.rawTotalScore! - report.categories.reduce((s, c) => s + c.weightedPoints!, 0)) < 1e-9, "inspection weighted sum");
    check(this.state.cashCents === this.inspectionOpeningCash! + w.gross - w.stock - w.paid, "inspection cash");
    check(this.state.levelFive?.inspectionPresentation.actors.length === 0, "inspectors clear at finish");
  }
}

export function simulateLevelFiveEconomy(context: DomainContext, seed: string, scenario: LevelFiveEconomicScenario, warmupHours = 4, measuredHours = 48) {
  const active = scenario.startsWith("active"), noRound = scenario.endsWith("no-round") || scenario === "missed-first-round";
  const audit = new LevelFiveReducerAudit(context, seed, active, 80, { executive: !scenario.endsWith("no-executive"), reader: scenario !== "unfunded", blockExecutive: noRound });
  const initial = { cashCents: audit.state.cashCents, workforce: audit.state.employees.map(e => ({ id: e.id, role: e.staffRoleDefinitionId, salary: e.salaryPerExpenseInterval, tier: e.trainingLevel, home: e.homeRoomInstanceId })),
    rooms: audit.state.rooms.filter(r => r.roomDefinitionId !== "room.hallway").map(r => ({ id: r.id, type: r.roomDefinitionId, tier: r.upgradeLevel })), currentLevelXp: audit.state.clinicalXp };
  const total = (warmupHours + measuredHours) * 60;
  let openingCash = 0, openingSavings = { stockCents: 0, upkeepSixtiethCents: 0 }, openingCapital = 0;
  let withheldGiftOpportunities = 0, openingGiftSequence = 0;
  const readerTraining = { requestedAtTick: null as number | null, paidCents: 0, seatedMinutes: 0, awayMinutes: 0, finalTier: 1, finalStage: null as string | null };
  for (let minute = 0; minute < total; minute++) {
    if (minute === warmupHours * 60) {
      openingCash = audit.state.cashCents; openingSavings = { ...(audit.state.levelFive?.management.supplierSavings ?? { stockCents: 0, upkeepSixtiethCents: 0 }) }; openingCapital = audit.capitalCents;
      openingGiftSequence = audit.state.giftRetailDemand?.opportunitySequence ?? 0;
    }
    if (scenario === "missed-first-round" && minute === 600) audit.apply({ type: "PLACE_ROOM", roomDefinitionId: "room.hallway", roomId: "room.economy.north.30", x: 30, y: 21, orientation: 0 });
    // Isolate real paid training from unanswered staff conversations in this
    // sensitivity only. All normal references retain their discussion clock.
    if (scenario === "reader-training" && minute === 0) audit.state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
    // The new hire must first enter the clinic through its actual arrival path.
    // Ask only when the production quote permits it; never move the employee.
    if (scenario === "reader-training" && readerTraining.requestedAtTick === null && getEmployeeTrainingQuote(audit.state, LEVEL_FIVE_ECONOMY_READER_ID, context).canTrain) {
      audit.apply({ type: "TRAIN_EMPLOYEE", employeeId: LEVEL_FIVE_ECONOMY_READER_ID });
      const training = audit.state.employees.find(e => e.id === LEVEL_FIVE_ECONOMY_READER_ID)!.training!;
      readerTraining.requestedAtTick = training.requestedAtFacilityTick;
      readerTraining.paidCents = cents(training.paidAmount);
    }
    if (scenario === "gift-outage" && minute === 0) audit.apply({ type: "REMOVE_DOOR", doorId: "door.room.qa.level5.gift" });
    if (scenario === "slow-demand" && minute % 300 === 0) audit.apply({ type: "SET_SERVICE_APPOINTMENTS_ENABLED", enabled: minute % 600 === 0 });
    // Explicit exogenous demand sensitivity, not a balance/cadence override:
    // withhold every second gift-only opportunity. Existing ordinary/employee
    // shopping remains enabled, and no revenue or XP is injected.
    const demand = audit.state.giftRetailDemand;
    if ((scenario === "half-gift" || scenario === "slow-demand") && demand && demand.nextOpportunityAtFacilityTick === audit.state.facilityTick + 1 && demand.opportunitySequence % 2 === 1) {
      demand.opportunitySequence++; demand.nextOpportunityAtFacilityTick += 120; withheldGiftOpportunities++;
    }
    const trainingStage = audit.state.employees.find(e => e.id === LEVEL_FIVE_ECONOMY_READER_ID)?.training?.stage;
    if (trainingStage === "training") readerTraining.seatedMinutes++;
    if (trainingStage && trainingStage !== "queued") readerTraining.awayMinutes++;
    audit.pump(); audit.tick();
    if (minute === 1560) audit.reload();
  }
  const metrics = audit.metrics(warmupHours * 60, total), savings = audit.state.levelFive?.management.supplierSavings ?? { stockCents: 0, upkeepSixtiethCents: 0 };
  const stockSaved = savings.stockCents - openingSavings.stockCents, upkeepSaved = (savings.upkeepSixtiethCents - openingSavings.upkeepSixtiethCents) / 60;
  const reader = audit.state.employees.find(e => e.id === LEVEL_FIVE_ECONOMY_READER_ID);
  readerTraining.finalTier = reader?.trainingLevel ?? 1;
  readerTraining.finalStage = reader?.training?.stage ?? null;
  if (scenario === "reader-training") check(readerTraining.finalTier === 2 && readerTraining.finalStage === null && readerTraining.seatedMinutes === 60, "reader training must actually complete its paid session and return");
  const cashDelta = audit.state.cashCents - openingCash, capital = audit.capitalCents - openingCapital;
  check(cashDelta === metrics.grossCents - metrics.stockCents - metrics.paidOperatingCents - capital, "measured cash/receipts/capital");
  const gifts = [...audit.receipts.values()].filter(r => r.line.startsWith("income.gift_shop") && r.tick > warmupHours * 60 && r.tick <= total);
  const giftNet = gifts.reduce((sum, r) => sum + r.net, 0) / 100 / measuredHours - (metrics.upkeepByRoomPerHour["room.gift_shop"] ?? 0);
  if (["passive-qualified", "passive-no-round", "active-qualified", "active-no-round"].includes(scenario)) {
    check(metrics.operatingNetPerHour > 0, `${scenario} funded cluster must be profitable`);
    check(giftNet >= 0, `${scenario} base Gift Shop net`);
    check(audit.staleActors.size === 0, `${scenario} stale actors: ${JSON.stringify([...audit.staleActors])}`);
  }
  if (scenario.endsWith("no-round")) check(stockSaved === 0 && upkeepSaved === 0 && audit.completedRounds.size === 0, "unqualified control must retain full costs");
  return { seed, scenario, warmupHours, measuredHours, initial, ...metrics, openingCashCents: openingCash, closingCashCents: audit.state.cashCents,
    cashDeltaCents: cashDelta, capitalCents: capital, minimumCashCents: audit.minimumCash, maximumCashCents: audit.maximumCash,
    supplierStockSavedCents: stockSaved, supplierUpkeepSavedCents: upkeepSaved, supplierSavedPerHour: (stockSaved + upkeepSaved) / 100 / measuredHours,
    giftDirectNetPerHour: giftNet, giftSalesPerHour: gifts.length / measuredHours,
    dedicatedGiftOpportunities: (audit.state.giftRetailDemand?.opportunitySequence ?? 0) - openingGiftSequence,
    dedicatedGiftSales: gifts.filter(r => r.actorId.startsWith("gift-visitor.")).length, withheldGiftOpportunities,
    executiveWagePerHour: initial.workforce.find(e => e.role === "staff.executive")?.salary ?? 0,
    completedDailyRounds: [...audit.completedRounds.values()], gardenUses: audit.gardenUses.size, completedGymBreaks: audit.gymBreaks.size, executiveComfortUses: audit.comfortUses.size,
    finalSatisfaction: getDisplayedClinicSatisfaction(audit.state, context), finalMorale: getAverageEffectiveStaffMorale(audit.state), retainedEmployees: audit.state.employees.length,
    retiredReceiptCount: audit.state.retiredServiceHistory?.retiredReceiptCount ?? 0, retiredEncounterCount: audit.state.retiredEncounterSummary?.retiredCount ?? 0,
    readerTraining: scenario === "reader-training" ? readerTraining : null, warmup: audit.metrics(0, warmupHours * 60),
    reloads: audit.reloads, staleActors: [...audit.staleActors], commandsReconciled: audit.commandsChecked, trajectories: audit.trajectories };
}

export function simulateLevelFivePacing(context: DomainContext, seed: string, accuracy = 80, onProgress?: (message: string) => void) {
  const audit = new LevelFiveReducerAudit(context, seed, true, accuracy);
  let xpGoalTick: number | null = null, checkpoint: string | null = null, preparationMinutes: number | null = null;
  let completed: InspectionReportState | null = null;
  for (let minute = 0; minute < 36_000; minute++) {
    audit.pump();
    if (audit.state.clinicalXp >= 2000) xpGoalTick ??= audit.state.facilityTick;
    if (audit.state.levelFive?.progress.inspectionUnlocked && audit.state.levelFive.inspection.status === "ready") {
      audit.apply({ type: "BOOK_INSPECTION" }); preparationMinutes = audit.state.levelFive!.inspection.preparation!.durationMinutes;
    }
    if (audit.state.levelFive?.inspection.run?.accumulators.observedActiveMinutes === 2999 && !checkpoint) {
      const paused = gameReducer(audit.state, { type: "SET_PAUSED", paused: true, operationId: "m8.qa.checkpoint.pause" }, context);
      checkpoint = serializeGameState(paused);
    }
    audit.tick();
    if (minute === 1560 || audit.state.levelFive?.inspection.run?.accumulators.observedActiveMinutes === 1501) audit.reload();
    if (audit.state.facilityTick % 600 === 0) onProgress?.(`${seed} ${accuracy}%: ${audit.state.facilityTick / 60}h, ${audit.state.clinicalXp} XP, satisfaction ${getDisplayedClinicSatisfaction(audit.state, context)}, morale ${getAverageEffectiveStaffMorale(audit.state)}, ${audit.state.levelFive?.inspection.status}`);
    if (audit.state.levelFive?.inspection.lastReport) {
      completed = audit.state.levelFive.inspection.lastReport;
      check(completed.outcome === "completed", `${seed} normal inspection sample was ${completed.qualifyingScoredPatientCount}, ${completed.outcome}`);
      audit.verifyInspection(completed);
      break;
    }
  }
  check(completed && audit.state.levelFive?.progress.gameFinished && xpGoalTick !== null && checkpoint, `${seed} did not reach real goals and first completed inspection within 600 game hours`);
  const finishTick = audit.state.facilityTick, unlock = audit.state.levelFive.progress.inspectionUnlocked!, metrics = audit.metrics(0, finishTick);
  const report = structuredClone(completed), window = structuredClone(audit.inspectionWindow);
  audit.reload(); audit.apply({ type: "ACKNOWLEDGE_FINISH_PAGE" });
  const finish = JSON.stringify(audit.state.levelFive!.progress.gameFinished);
  for (let minute = 0; minute < 600; minute++) { audit.pump(); audit.tick(); }
  check(JSON.stringify(audit.state.levelFive!.progress.gameFinished) === finish, "continued play must retain first report");
  check(audit.staleActors.size === 0, `pacing stale actors ${JSON.stringify([...audit.staleActors])}`);
  return { checkpoint, report: { seed, requestedAccuracyPercent: accuracy, ...metrics, xpGoalTick, xpGoalGameHours: xpGoalTick / 60,
    unlockTick: unlock.earnedAtFacilityTick, unlockGameHours: unlock.earnedAtFacilityTick / 60, unlockEvidence: unlock,
    preparationMinutes, firstFinishTick: finishTick, firstFinishGameHours: finishTick / 60, operatingDaysToFinish: finishTick / 600,
    firstInspection: report, independentlyReconciledWindow: window, minimumCashCents: audit.minimumCash, maximumCashCents: audit.maximumCash,
    retiredReceiptCount: audit.state.retiredServiceHistory?.retiredReceiptCount ?? 0, retiredEncounterCount: audit.state.retiredEncounterSummary?.retiredCount ?? 0,
    completedDailyRounds: audit.completedRounds.size, gardenUses: audit.gardenUses.size, completedGymBreaks: audit.gymBreaks.size, executiveComfortUses: audit.comfortUses.size,
    payrollAfterFinish: audit.state.employees.reduce((s, e) => s + e.salaryPerExpenseInterval, 0), continuedPlayMinutes: 600,
    afterContinueXp: audit.state.clinicalXp, afterContinueCashCents: audit.state.cashCents, reloads: audit.reloads,
    staleActors: [...audit.staleActors], commandsReconciled: audit.commandsChecked, trajectories: audit.trajectories } };
}
