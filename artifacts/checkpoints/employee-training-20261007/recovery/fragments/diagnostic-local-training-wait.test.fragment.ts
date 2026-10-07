// Exact GS-037 test block from packages/game-domain/tests/diagnostic-timing.test.ts.
// Insert inside its existing describe; add advanceEmployeeTraining and requestEmployeeTraining
// to the existing ../src import. Requires its existing timingFixture, quote and phaseOf.
// This supersedes the earlier invalid test that expected temporary absence to outsource work.
  it.each([
    ["staff.phlebotomist", "service.basic_labs", "collection"],
    ["staff.laboratory_technician", "service.basic_labs", "laboratory_processing"],
    ["staff.radiologist", "service.ultrasound", "interpretation"],
  ] as const)("keeps installed work local while %s is away for training", (role, serviceId, phaseKind) => {
    const fixture = timingFixture();
    fixture.state.cash = 10_000;
    fixture.state.cashCents = 1_000_000;
    fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.addRoom("room.reading", "staff.radiologist");
    const training = fixture.addRoom("room.training");
    const employee = fixture.state.employees.find((candidate) => candidate.staffRoleDefinitionId === role)!;
    expect(requestEmployeeTraining(fixture.state, employee.id, fixture.context).applied).toBe(true);
    advanceEmployeeTraining(fixture.state, fixture.context);
    expect(employee.training?.stage).toBe("walking_to_training");
    training.room.maintenance = { completedUses: 0, status: "out_of_service", dueAtFacilityTick: null,
      outOfServiceAtFacilityTick: 0, appliedUseKeys: [] };
    const plan = quote(fixture, { serviceId });
    expect(phaseOf(plan, phaseKind).mode).toBe("local");
    expect(forecastDiagnosticOrderPlan(fixture.state, plan, fixture.context).blockedPhaseIds).toContain(phaseOf(plan, phaseKind).id);
  });

