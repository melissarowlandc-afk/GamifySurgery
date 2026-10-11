import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createInitialGameState, type EmployeeState, type ServiceOperationState, type RetailOperationState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { ServiceIncomePanel } from "../../ui/ServiceIncomePanel";
import { MoneyPanel } from "../../ui/MoneyPanel";
import { ManagementPanel } from "../../ui/ManagementPanel";
import { MobileServiceWork } from "./MobileServices";

const noop = () => {};
function fixture() {
  const state = createInitialGameState(); state.facilityLevel = 3; state.facilityTick = 5;
  const employee = (id: string, displayName: string): EmployeeState => ({
    id, displayName, staffRoleDefinitionId: "staff.app", appearance: state.founder.appearance,
    homeRoomInstanceId: null, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 30, morale: 80, trainingLevel: 1,
    location: { x: 33, y: 28 }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 999, facilityTask: null,
  });
  state.employees = [employee("provider", "Fixture Provider"), employee("team", "Fixture Team")];
  const operation = (id: string, providerReservation: ServiceOperationState["providerReservation"], reservedEmployeeIds: string[] = []): ServiceOperationState => ({
    id, incomeLineId: "income.app_consult", catalogVersion: 1, actorKind: "visitor", actorId: id, displayName: "Fixture Visitor",
    appearance: null, status: "waiting_for_resources", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 100, startedAtFacilityTick: null,
    completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 120, phaseIndex: 0, phaseStartedAtFacilityTick: null,
    phaseEndsAtFacilityTick: null, reservedRoomInstanceIds: [], reservedEmployeeIds, providerReservation, location: null, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, cancellationReason: null,
  });
  state.serviceOperations = [operation("assigned", { kind: "employee", employeeId: "provider" }, ["provider", "team"]),
    operation("founder", { kind: "founder" }), operation("queued", null), operation("legacy-missing", { kind: "employee", employeeId: "missing" })];
  const retail = (id: string, servingEmployeeId: string | null, staffRoleDefinitionId: string | null): RetailOperationState => ({
    id, incomeLineId: "income.coffee", catalogVersion: 1, actorKind: "retail_visitor", actorId: id, displayName: "Fixture Shopper", appearance: state.founder.appearance,
    linkedServiceOperationId: null, authorizedOrderId: null, status: "queued", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 100,
    startedAtFacilityTick: null, completedAtFacilityTick: null, quoteGross: 10, quoteStockCost: 2, outletRoomInstanceId: state.rooms[0]!.id,
    outletDurationMinutes: 1, staffRoleDefinitionId, servingEmployeeId, location: { x: 33, y: 28 }, returnLocation: null,
    path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, purchaseEndsAtFacilityTick: null, cancellationReason: null,
  });
  state.retailOperations = [retail("retail.staffed", "team", "staff.app"), retail("retail.queued", null, "staff.app"), retail("retail.self", null, null)];
  return state;
}

describe("additive provider/team projection", () => {
  it("labels only current provider/team reservations, queued work and serving staff without mutating the campaign", () => {
    const state = fixture(); const before = JSON.stringify(state); const income = createPrototypePlayerView(state, null, false, null).serviceIncome;
    expect(income.activeOperations.map((operation) => [operation.id, operation.providerLabel])).toEqual([
      ["assigned", "Fixture Provider, Fixture Team"], ["founder", state.founder.displayName], ["queued", "Not assigned"],
      ["legacy-missing", "Employee unavailable"], ["retail.staffed", "Fixture Team"], ["retail.queued", "Not assigned"], ["retail.self", "No staff provider required"],
    ]);
    const phone = renderToStaticMarkup(<MobileServiceWork operations={income.activeOperations} />);
    expect(phone).toContain("Provider / team"); expect(phone).toContain("Fixture Provider, Fixture Team"); expect(JSON.stringify(state)).toBe(before);
  });
  it("keeps the entire desktop Services, Money and Management markup byte-identical with/without the optional labels", () => {
    const state = fixture(); const view = createPrototypePlayerView(state, null, false, null);
    const without = { ...view.serviceIncome, activeOperations: view.serviceIncome.activeOperations.map(({ providerLabel: _label, incomeLineId: _line, ...operation }) => operation) };
    for (const income of [view.serviceIncome, { ...view.serviceIncome, appointmentsEnabled: false }]) {
      const baseline = { ...without, appointmentsEnabled: income.appointmentsEnabled };
      expect(renderToStaticMarkup(<ServiceIncomePanel serviceIncome={income} onAppointmentsEnabledChange={noop} onStartLaboratoryProcessing={noop} onSetupAction={noop} />))
        .toBe(renderToStaticMarkup(<ServiceIncomePanel serviceIncome={baseline} onAppointmentsEnabledChange={noop} onStartLaboratoryProcessing={noop} onSetupAction={noop} />));
      expect(renderToStaticMarkup(<MoneyPanel serviceIncome={income} />)).toBe(renderToStaticMarkup(<MoneyPanel serviceIncome={baseline} />));
      const props = { managementMode: true, roles: view.staffRoles, staffTraining: view.staffTraining,
        onEnterManagementMode: noop, onExitManagementMode: noop, onHire: noop, onDecreaseSalary: noop, onIncreaseSalary: noop, onFire: noop,
        onTrain: noop, onAppointmentsEnabledChange: noop, onStartLaboratoryProcessing: noop, onSetupAction: noop };
      expect(renderToStaticMarkup(<ManagementPanel {...props} serviceIncome={income} />)).toBe(renderToStaticMarkup(<ManagementPanel {...props} serviceIncome={baseline} />));
    }
  });
  it("does not infer a provider from a visitor label when legacy projections omit the optional field", () => {
    const income = createPrototypePlayerView(fixture(), null, false, null).serviceIncome;
    income.activeOperations = [{ id: "legacy", displayName: "Legacy work", actorLabel: "Legacy Visitor", statusLabel: "Queued", quoteFeeLabel: "$100" }];
    const markup = renderToStaticMarkup(<MobileServiceWork operations={income.activeOperations} />);
    expect(markup).toContain("<dt>From</dt><dd>Legacy Visitor</dd>"); expect(markup).toContain("<dt>Provider / team</dt><dd>Not supplied</dd>");
  });
});
