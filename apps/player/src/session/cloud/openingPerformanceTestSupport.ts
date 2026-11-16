import { readFileSync } from "node:fs";
import { deserializeGameState, getRoomDefinition, type GameState } from "@gamify-surgery/game-domain";
import { createDiagnosticWorkload } from "../../../../../tests/fixtures/diagnostic-workload";
import { repairSnapshotNumbers } from "./snapshotNumberRecovery";

/** Independently generated from shipped geometry and public QA history only.
 * Round counts exercise a large clinic; no private save supplies any values. */
export function publicCloudOpeningWorkload(): GameState {
  const state = createDiagnosticWorkload().state;
  const publicRows = JSON.parse(readFileSync(new URL("../../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"));
  const history = deserializeGameState(JSON.stringify(publicRows["integration-lower-repeat"]), undefined, { compactHistory: false });
  state.facilityLevel = 5;
  state.facilityTick = history.facilityTick;
  state.paused = true;
  state.levelFive = structuredClone(history.levelFive);
  const occupied = new Set<string>();
  for (const room of state.rooms) {
    const definition = getRoomDefinition(room.roomDefinitionId)!;
    const rotated = room.orientation === 90 || room.orientation === 270;
    const width = rotated ? definition.height : definition.width, height = rotated ? definition.width : definition.height;
    for (let y = room.y; y < room.y + height; y++) for (let x = room.x; x < room.x + width; x++) occupied.add(`${x},${y}`);
  }
  for (let y = 1; y < 25 && state.rooms.length < 180; y++) for (let x = 1; x < 68 && state.rooms.length < 180; x++) {
    if (occupied.has(`${x},${y}`)) continue;
    state.rooms.push({ id: `cloud-opening.hall.${x}.${y}`, roomDefinitionId: "room.hallway", x, y,
      orientation: 0, doorSide: null, upgradeLevel: 1 });
    occupied.add(`${x},${y}`);
  }
  const employees = [...state.employees];
  while (state.employees.length < 50) {
    const index = state.employees.length;
    state.employees.push({ ...structuredClone(employees[index % employees.length]!), id: `cloud-opening.employee.${index}` });
  }
  const discussion = Object.values(history.employeeDiscussions!)[0]!;
  state.employeeDiscussions = {};
  for (let index = 0; index < 64; index++) {
    const id = `cloud-opening.discussion.${index}`, employee = state.employees[index % state.employees.length]!;
    state.employeeDiscussions[id] = { ...structuredClone(discussion), id, employeeId: employee.id };
  }
  const receipts = [...history.serviceIncomeReceipts!];
  state.serviceIncomeReceipts = Array.from({ length: 1_500 }, (_, index) => ({ ...structuredClone(receipts[index % receipts.length]!),
    id: `cloud-opening.receipt.${index}`, transactionKey: `cloud-opening.transaction.${index}` }));
  // Keep the original 1,500-row input pressure. Actual hydration/save compacts
  // it later; do not weaken the perf guard by pre-trimming its synthetic input.
  return repairSnapshotNumbers(deserializeGameState(JSON.stringify(state), undefined, { compactHistory: false })).state;
}
