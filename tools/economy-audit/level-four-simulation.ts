import {
  PROTOTYPE_DOMAIN_CONTEXT, gameReducer, getOperatingExpensePerFacilityHour, getRoomDefinition,
  getStaffRoleDefinition, getServiceIncomeTotalsCents, type DomainContext, type GameCommand, type GameState,
} from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaState } from "../../tests/fixtures/level-four-rooms";

type SetupCommand = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId"> }[GameCommand["type"]];

/** Real placement, hires, movement, dispatch, upkeep and payroll. No balance overrides. */
export function createEarlyLevelFourEconomyState(seed = "level-four-economy-m8", context = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  let state = createLevelFourRoomsQaState(context);
  state.campaignId = `campaign.audit.${seed}`;
  state.campaignSeed = seed;
  let sequence = 0;
  const apply = (command: SetupCommand) => {
    const operationId = `economy.setup.${sequence++}`;
    state = gameReducer(state, { ...command, operationId } as GameCommand, context);
    if (state.operationReceipts[operationId]?.status !== "applied") throw new Error(state.operationReceipts[operationId]?.message);
  };
  for (let x = 42; x <= 52; x++) apply({ type: "PLACE_ROOM", roomDefinitionId: "room.hallway", roomId: `room.economy.hall.${x}`, x, y: 26, orientation: 0 });
  const room = (definitionId: string, id: string, x: number, y: number, side: "north" | "south", offset: number) => {
    apply({ type: "PLACE_ROOM", roomDefinitionId: definitionId, roomId: id, x, y, orientation: 0 });
    apply({ type: "PLACE_DOOR", doorId: `door.${id}`, roomId: id, side, offset });
  };
  const hire = (role: string, id: string) => apply({ type: "HIRE_STAFF", staffRoleDefinitionId: role, employeeId: id });
  room("room.mri", "room.economy.mri", 23, 22, "south", 2);
  hire("staff.imaging_technician", "employee.economy.mri");
  room("room.pediatric_waiting", "room.economy.pediatric-waiting", 29, 22, "south", 2);
  room("room.pediatric_examination", "room.economy.pediatric", 35, 23, "south", 1);
  hire("staff.app", "employee.economy.pediatric");
  room("room.wound_ostomy", "room.economy.wound", 40, 23, "south", 1);
  hire("staff.app", "employee.economy.wound");
  room("room.examination", "room.economy.adult-app", 45, 24, "south", 1);
  hire("staff.app", "employee.economy.adult-app");
  room("room.examination", "room.economy.founder-exam", 49, 24, "south", 1);
  room("room.waiting", "room.economy.waiting", 23, 27, "north", 2);
  room("room.bathroom", "room.economy.bathroom", 28, 27, "north", 1);
  room("room.evs_closet", "room.economy.evs", 30, 27, "north", 1);
  room("room.maintenance_workshop", "room.economy.workshop", 39, 27, "north", 1);
  room("room.staff_break", "room.economy.break", 44, 27, "north", 1);
  room("room.coffee_kiosk", "room.economy.coffee", 49, 27, "north", 1);
  hire("staff.receptionist", "employee.economy.reception");
  hire("staff.evs_worker", "employee.economy.evs");
  hire("staff.repair_person", "employee.economy.repair");
  // Normal catalog cadence starts on enabling; no injected visitors or fees.
  apply({ type: "SET_SERVICE_APPOINTMENTS_ENABLED", enabled: true });
  apply({ type: "SET_PAUSED", paused: false });
  return state;
}

const groups = [
  { name: "MRI (external read)", lines: ["income.mri"], rooms: ["room.mri"], staff: "staff.imaging_technician" },
  { name: "Pediatric Exam + Waiting + APP", lines: ["income.pediatric_consult"], rooms: ["room.pediatric_examination", "room.pediatric_waiting"], staff: "staff.app" },
  { name: "Wound/Ostomy + APP", lines: ["income.wound_care", "income.ostomy_support"], rooms: ["room.wound_ostomy"], staff: "staff.app" },
  { name: "Ordinary Exam + APP", lines: ["income.app_consult"], rooms: ["room.examination"], staff: "staff.app" },
] as const;

export function simulateEarlyLevelFourEconomy(seed = "level-four-economy-m8", warmupHours = 4, measuredHours = 48, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT) {
  let state = createEarlyLevelFourEconomyState(seed, context);
  let sequence = 0;
  const tick = () => { state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `economy.tick.${sequence++}` }, context); };
  for (let i = 0; i < warmupHours * 60; i++) tick();
  const openingCashCents = state.cashCents!;
  const openingTotals = getServiceIncomeTotalsCents(state);
  const openingLearning = structuredClone({ xp: state.clinicalXp, histories: state.learningHistories, intents: state.reviewIntents });
  const seen = new Set(state.serviceIncomeReceipts.map((receipt) => receipt.transactionKey));
  const byLine: Record<string, { count: number; gross: number; stock: number }> = {};
  for (let i = 0; i < measuredHours * 60; i++) {
    tick();
    for (const receipt of state.serviceIncomeReceipts) if (!seen.has(receipt.transactionKey)) {
      seen.add(receipt.transactionKey);
      const line = byLine[receipt.incomeLineId] ??= { count: 0, gross: 0, stock: 0 };
      line.count++; line.gross += receipt.grossAmount; line.stock += receipt.stockCost;
    }
  }
  const rows = groups.map((group) => {
    const counts = group.lines.map((line) => byLine[line]?.count ?? 0);
    const gross = group.lines.reduce((sum, line) => sum + (byLine[line]?.gross ?? 0), 0) / measuredHours;
    const stock = group.lines.reduce((sum, line) => sum + (byLine[line]?.stock ?? 0), 0) / measuredHours;
    const upkeep = group.rooms.reduce((sum, id) => sum + getRoomDefinition(id, context)!.upkeepPerExpenseInterval, 0);
    const salary = getStaffRoleDefinition(group.staff, context)!.salaryPerExpenseInterval;
    return { name: group.name, visits: counts.reduce((sum, count) => sum + count, 0), visitsPerHour: counts.reduce((sum, count) => sum + count, 0) / measuredHours,
      grossPerHour: gross, stockPerHour: stock, upkeepPerHour: upkeep, salaryPerHour: salary, netPerHour: gross - stock - upkeep - salary };
  });
  const closingTotals = getServiceIncomeTotalsCents(state);
  const grossPerHour = (closingTotals.grossCents - openingTotals.grossCents) / 100 / measuredHours;
  const stockPerHour = (closingTotals.stockCostCents - openingTotals.stockCostCents) / 100 / measuredHours;
  const netPerHour = (state.cashCents! - openingCashCents) / 100 / measuredHours;
  const operatingPerHour = grossPerHour - stockPerHour - netPerHour;
  return { seed, warmupHours, measuredHours, rows, byLine,
    totals: { grossPerHour, stockPerHour, operatingPerHour, netPerHour, closingOperatingQuote: -getOperatingExpensePerFacilityHour(state, context) },
    openingLearning, closingLearning: { xp: state.clinicalXp, histories: state.learningHistories, intents: state.reviewIntents }, state };
}
