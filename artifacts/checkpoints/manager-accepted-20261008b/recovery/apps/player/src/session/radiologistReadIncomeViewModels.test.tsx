import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createInitialGameState, gameReducer, type EmployeeState, type ServiceOperationState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";
import { describeFacilityCharacter } from "./characterActivityPresentation";
import { ServiceIncomePanel } from "../ui/ServiceIncomePanel";

function fixture() {
  const state = createInitialGameState(); state.facilityLevel = 3; state.facilityTick = 5;
  state.rooms.push({ id: "room.readers", roomDefinitionId: "room.reading", x: 33, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 9 }, (_, i) => ({ id: `room.reading-hall.${i}`, roomDefinitionId: "room.hallway", x: 32, y: 20 + i, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const })));
  state.doors.push({ id: "door.readers", roomId: "room.readers", side: "west", offset: 1, exterior: false },
    { id: "door.front.readers", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false });
  const employee: EmployeeState = {
    id: "radiologist", staffRoleDefinitionId: "staff.radiologist", displayName: "Dr. Reader", appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 80, trainingLevel: 1,
    homeRoomInstanceId: "room.readers", readingStationId: "northwest", location: { x: 34, y: 21 },
    path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: 999, facilityTask: null,
  };
  state.employees.push(employee);
  state.radiologistReadIncome = {
    version: "radiologist-read-income.v1", nextOutsideReadSequence: 3, dayNumber: 1, facilityLevel: 3,
    today: { inHouseReads: 2, inHouseIncomeCents: 1000, outsideReads: 3, outsideIncomeCents: 1500 },
    thisLevel: { inHouseReads: 12, inHouseIncomeCents: 6000, outsideReads: 23, outsideIncomeCents: 11500 },
  };
  state.outsideRadiologyReads = [{
    version: "outside-radiology-read.v1", sequence: 2, employeeId: employee.id, roomInstanceId: employee.homeRoomInstanceId!,
    stationId: "northwest", startedAtFacilityTick: 5, lastObservedAtFacilityTick: 5, baselineMinutes: 5,
    employeeReductionPercent: 0, upgradeLevel: 1, durationMinutes: 5, fee: 5,
  }];
  return { state, employee };
}

describe("radiologist read income presentation", () => {
  it.each([false, true])("shows both actually hired readers' seated outside work and paid income, retained southeast=%s", (southeast) => {
    let { state } = fixture();
    state.facilityTick = 0; state.paused = false;
    state.cash = 20_000; state.cashCents = 2_000_000;
    state.employees = []; state.encounters = {};
    delete state.outsideRadiologyReads; delete state.radiologistReadIncome;
    state.serviceAppointmentsEnabled = false;
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    state.nextEmployeeDiscussionTick = 30;
    state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
    for (let i = 1; i <= (southeast ? 3 : 2); i++) state = gameReducer(state, {
      type: "HIRE_STAFF", operationId: `hire.reader.${i}`, employeeId: `reader.${i}`, staffRoleDefinitionId: "staff.radiologist",
    });
    if (southeast) state = gameReducer(state, { type: "FIRE_EMPLOYEE", operationId: "dismiss.reader.2", employeeId: "reader.2" });
    for (let i = 0; i < 70; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `tick.${i}` });
    expect(state.employees).toHaveLength(2);
    expect(Object.values(state.employeeDiscussions ?? {}).some(discussion => discussion.lifecycle === "waiting_unopened")).toBe(true);
    const view = createPrototypePlayerView(state, null, false, null);
    const outsideRows = view.serviceIncome.activeOperations.filter(operation => operation.displayName === "Outside study read");
    expect(outsideRows).toHaveLength(2);
    expect(new Set(outsideRows.map(operation => operation.actorLabel))).toEqual(new Set(state.employees.map(employee => employee.displayName)));
    for (const employee of state.employees) {
      expect(describeFacilityCharacter(state, { kind: "staff", id: employee.id })?.activity).toBe("Reading an outside study");
      expect(view.facility.staff?.find(actor => actor.instanceId === employee.id)).toMatchObject({
        supportRole: "reading-radiologist", supportId: employee.readingStationId, supportRoomInstanceId: "room.readers",
      });
      expect(state.serviceIncomeReceipts.some(receipt => receipt.incomeLineId === "income.radiologist_outside_read" && receipt.actorId === employee.id)).toBe(true);
    }
    const reads = state.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.radiologist_outside_read").length;
    expect(view.serviceIncome.radiologistReads?.today).toMatchObject({ inHouseReads: 0, outsideReads: reads, outsideIncomeLabel: `$${(reads * 5).toFixed(2)}` });
    expect(view.serviceIncome.radiologistReads?.thisLevel).toEqual(view.serviceIncome.radiologistReads?.today);
  });

  it("shows separate counts and income for today and the current level, plus current outside work", () => {
    const { state } = fixture();
    const income = createPrototypePlayerView(state, null, false, null).serviceIncome;
    expect(income.radiologistReads).toEqual({
      today: { inHouseReads: 2, outsideReads: 3, inHouseIncomeLabel: "$10.00", outsideIncomeLabel: "$15.00" },
      thisLevel: { inHouseReads: 12, outsideReads: 23, inHouseIncomeLabel: "$60.00", outsideIncomeLabel: "$115.00" },
    });
    expect(income.activeOperations).toContainEqual(expect.objectContaining({
      displayName: "Outside study read", actorLabel: "Dr. Reader", quoteFeeLabel: "$5.00", statusLabel: "Reading · 5 min remaining",
    }));
    expect(income.catalogLines.find(line => line.id === "income.radiologist_in_house_read")).toMatchObject({ feeLabel: "$5.00", minimumFacilityLevel: 3, arrivalLabel: "Additional fee when each study is read" });
    expect(income.catalogLines.find(line => line.id === "income.radiologist_outside_read")).toMatchObject({ feeLabel: "$5.00", arrivalLabel: "Automatic when idle · 5 min base per read" });
    const html = renderToStaticMarkup(<ServiceIncomePanel serviceIncome={income}
      onAppointmentsEnabledChange={vi.fn()} onStartLaboratoryProcessing={vi.fn()} />);
    expect(html).toContain("Radiologist reads"); expect(html).toContain("This facility level");
    expect(html).toContain("In-house: 2 reads · $10.00"); expect(html).toContain("Outside: 23 reads · $115.00");
    expect(html).toContain("Imaging fees stay unchanged. Each completed in-house read adds its fee.");
  });

  it.each([[undefined, "$120.00"], [5, "$115.00"]] as const)("shows the actual acquisition payment with a legacy withheld fee of %s", (heldFee, paymentLabel) => {
    const { state } = fixture();
    const patient = Object.values(state.encounters)[0]!;
    state.serviceOperations.push({
      id: "scan.center", incomeLineId: "income.ultrasound", catalogVersion: 1,
      actorKind: "encounter", actorId: patient.id, displayName: patient.patientDisplayName,
      appearance: patient.patientAppearance, status: "in_service", createdAtFacilityTick: 0,
      waitDeadlineFacilityTick: 100, startedAtFacilityTick: 0, completedAtFacilityTick: null,
      cancelledAtFacilityTick: null, quoteFee: 120, phaseIndex: 0,
      phaseStartedAtFacilityTick: 0, phaseEndsAtFacilityTick: 45,
      reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null,
      location: patient.patientLocation, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0,
      cancellationReason: null, diagnosticPhysicalWork: {
        version: "diagnostic-physical-work.v1", orderId: "scan.order", encounterId: patient.id,
        componentId: null, billing: "existing_service", readIncomeFee: heldFee,
        phaseBindings: [], phaseWitnesses: [], remainingPhaseMinutes: 40,
      },
    } satisfies ServiceOperationState);
    const income = createPrototypePlayerView(state, null, false, null).serviceIncome;
    expect(income.activeOperations.find(operation => operation.id === "scan.center")?.quoteFeeLabel).toBe(paymentLabel);
    expect(income.catalogLines.find(line => line.id === "income.ultrasound")?.feeLabel).toBe("$120.00");
    expect(income.catalogLines.find(line => line.id === "income.radiologist_in_house_read")?.feeLabel).toBe("$5.00");
  });

  it("names outside and center study work while preserving break and training labels", () => {
    const { state, employee } = fixture();
    expect(describeFacilityCharacter(state, { kind: "staff", id: employee.id })?.activity).toBe("Reading an outside study");
    employee.facilityTask = { kind: "take_break", startedAtFacilityTick: 5, workMinutesRemaining: 10 };
    expect(describeFacilityCharacter(state, { kind: "staff", id: employee.id })?.activity).toBe("On break");
    const patient = Object.values(state.encounters)[0]!;
    employee.facilityTask = { kind: "perform_service", targetId: "read.center", startedAtFacilityTick: 5, workMinutesRemaining: 5 };
    state.serviceOperations.push({
      id: "read.center", diagnosticPhaseWork: { kind: "interpretation", encounterId: patient.id },
    } as unknown as typeof state.serviceOperations[number]);
    expect(describeFacilityCharacter(state, { kind: "staff", id: employee.id })?.activity).toBe(`Reading a study for ${patient.patientDisplayName}`);
  });

  it("shows zeros for legacy save history", () => {
    const { state } = fixture(); delete state.radiologistReadIncome; delete state.outsideRadiologyReads;
    expect(createPrototypePlayerView(state, null, false, null).serviceIncome.radiologistReads).toMatchObject({
      today: { inHouseReads: 0, outsideReads: 0, inHouseIncomeLabel: "$0.00", outsideIncomeLabel: "$0.00" },
      thisLevel: { inHouseReads: 0, outsideReads: 0 },
    });
  });
});
