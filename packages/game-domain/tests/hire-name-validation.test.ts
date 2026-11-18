import { expect, it } from "vitest";
import { createInitialGameState, gameReducer, createGameEvidenceCheckpoint, applyGameEvidenceCommand, PROTOTYPE_DOMAIN_CONTEXT, type GameCommand } from "../src/index";

it.each([42, null, {}, true])("rejects an invalid optional hire name %j through the ordinary evidence boundary", displayName => {
  const state = createInitialGameState(); state.facilityLevel = 3; state.cash = 100000; state.cashCents = 10000000;
  const command = { type: "HIRE_STAFF", operationId: "synthetic.invalid-name", staffRoleDefinitionId: "staff.receptionist", employeeId: "synthetic.employee", displayName } as unknown as GameCommand;
  const result = applyGameEvidenceCommand(createGameEvidenceCheckpoint(state), command, PROTOTYPE_DOMAIN_CONTEXT);
  expect(result.state.operationReceipts[command.operationId]).toMatchObject({ status: "rejected", message: "Enter a valid employee name." });
  expect(result.state.employees).toHaveLength(0); expect(result.state.cashCents).toBe(state.cashCents);
  expect(state.operationReceipts[command.operationId]).toBeUndefined();
});

it.each([undefined, "  Public Name  "])("preserves ordinary absent/string names and their deterministic generated identity", displayName => {
  const state = createInitialGameState(); state.facilityLevel = 3; state.cash = 100000; state.cashCents = 10000000;
  const command = { type: "HIRE_STAFF" as const, operationId: "synthetic.valid-name", staffRoleDefinitionId: "staff.receptionist", employeeId: "synthetic.employee", ...(displayName === undefined ? {} : { displayName }) };
  const next = gameReducer(state, command, PROTOTYPE_DOMAIN_CONTEXT);
  expect(next.operationReceipts[command.operationId]?.status).toBe("applied"); expect(next.employees).toHaveLength(1);
  if (displayName !== undefined) expect(next.employees[0]!.displayName).toBe("Public Name");
  expect(JSON.stringify(next)).toBe(JSON.stringify(gameReducer(state, command, PROTOTYPE_DOMAIN_CONTEXT)));
});
