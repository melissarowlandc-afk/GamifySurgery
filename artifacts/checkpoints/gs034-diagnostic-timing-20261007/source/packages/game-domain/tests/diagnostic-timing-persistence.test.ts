import { describe, expect, it } from "vitest";
import {
  deserializeGameState, hasOutstandingDiagnosticWork, normalizeDiagnosticOrderPlan, normalizeDiagnosticPhaseWork,
  planDiagnosticOrder, serializeGameState, type DiagnosticOrderPlan,
} from "../src";
import { manualLab, pending, timingFixture } from "./diagnostic-timing-fixtures";

function savedFixture() {
  const fixture = timingFixture();
  const drawRoom = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
  fixture.addRoom("room.laboratory", "staff.laboratory_technician");
  const quote = planDiagnosticOrder(fixture.state, { orderId: "order.persisted", encounterId: fixture.encounter.id, serviceId: "service.basic_labs", patientOrigin: drawRoom.anchor }, fixture.context);
  if (quote.kind !== "planned") throw new Error(quote.reason);
  return { ...fixture, plan: quote.plan };
}

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

describe("additive diagnostic timing persistence", () => {
  it("roundtrips plans on pending, continuation, staged/components/remainder and terminal carriers", () => {
    const fixture = savedFixture();
    const { encounter, plan } = fixture;
    encounter.pendingResult = pending(plan);
    encounter.testOnlyContinuation = {
      version: "test-only-continuation.v1", originatingNodeIndex: 0, serviceId: "service.basic_labs", routeId: "route.basic_labs.phlebotomy_sendout",
      routeDisplayName: "Collection", incomeLineId: "income.collection", externalRemainder: "Frozen urine protocol", status: "waiting_for_service",
      serviceOperationId: "draw.operation", scheduledAtFacilityTick: 0, completedAtFacilityTick: null, diagnosticTiming: clone(plan),
    };
    encounter.stagedResultOrder = {
      version: "staged-result-order.v1", originatingNodeIndex: 0, caseId: encounter.frozenCase.id, nodeId: "node.fixture", questionVariantId: "question.fixture",
      choiceId: "choice.fixture", choiceLabel: "Fixture mixed work", status: "waiting_for_component", remainderMode: "external_processing", currentComponentIndex: 0,
      components: [{ componentId: "blood", serviceId: "service.basic_labs", routeId: "route.basic_labs.phlebotomy_sendout", routeDisplayName: "Collection", incomeLineId: "income.collection", quoteFee: 50,
        operationPhases: [{ id: "collection", roomDefinitionId: "room.phlebotomy", durationMinutes: 15, staffRoleDefinitionIds: ["staff.phlebotomist"] }],
        externalRemainder: "Preserved molecular remainder", status: "waiting_for_service", serviceOperationId: "draw.operation", diagnosticTiming: clone(plan) }],
      remainder: pending(clone(plan)), diagnosticTiming: clone(plan),
    };
    encounter.terminalTestOrder = {
      version: "terminal-test-order.v1", caseId: encounter.frozenCase.id, nodeId: "node.fixture", questionVariantId: "question.fixture", choiceId: "choice.fixture", choiceLabel: "Fixture laboratory work",
      serviceId: "service.basic_labs", routeId: "route.basic_labs.phlebotomy_sendout", routeDisplayName: "Collection", externalRemainder: null,
      status: "onsite_service", serviceOperationId: "draw.operation", scheduledAtFacilityTick: 0, diagnosticTiming: clone(plan),
    };
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context).encounters[encounter.id]!;
    expect(restored.pendingResult?.diagnosticTiming).toEqual(plan);
    expect(restored.testOnlyContinuation?.diagnosticTiming).toEqual(plan);
    expect(restored.stagedResultOrder?.diagnosticTiming).toEqual(plan);
    expect(restored.stagedResultOrder?.components[0]?.diagnosticTiming).toEqual(plan);
    expect(restored.stagedResultOrder?.remainder.diagnosticTiming).toEqual(plan);
    expect(restored.terminalTestOrder?.diagnosticTiming).toEqual(plan);
  });

  it("retains frozen durations, progress, completion witnesses and remote job links when balance changes", () => {
    const fixture = savedFixture();
    const { plan } = fixture;
    const draw = plan.phases.find((phase) => phase.kind === "collection")!;
    draw.status = "completed"; draw.remainingMinutes = 0; draw.startedAtTick = 0; draw.completedAtTick = 15;
    plan.careComplete.reachedAtTick = 15;
    const processing = plan.phases.find((phase) => phase.kind === "laboratory_processing")!;
    processing.status = "active"; processing.startedAtTick = 15; processing.serviceOperationId = "diagnostic.processor";
    fixture.encounter.pendingResult = pending(plan);
    const job = manualLab(fixture.state);
    job.id = "diagnostic.processor";
    job.actorId = fixture.encounter.id;
    job.quoteFee = 0;
    job.phaseStartedAtFacilityTick = 15;
    job.phaseEndsAtFacilityTick = 30;
    job.frozenOperationPhases = [{ id: processing.id, roomDefinitionId: "room.laboratory", durationMinutes: 15, staffRoleDefinitionIds: ["staff.laboratory_technician"] }];
    job.diagnosticPhaseWork = { version: "diagnostic-phase-work.v1", orderId: plan.orderId, encounterId: plan.encounterId, phaseId: processing.id,
      kind: "laboratory_processing", billing: "none", durationMinutes: 15, remainingMinutes: 15, resource: processing.resource };
    fixture.state.serviceOperations.push(job);
    const serialized = serializeGameState(fixture.state);
    for (const route of fixture.context.balanceRelease.services.find((service) => service.id === "service.basic_labs")!.routes) route.durationTicks = 900;
    fixture.context.balanceRelease.facility.characterTravelTilesPerTick = 9;
    const restored = deserializeGameState(serialized, fixture.context);
    expect(restored.encounters[fixture.encounter.id]?.pendingResult?.diagnosticTiming).toEqual(plan);
    expect(restored.serviceOperations.find((operation) => operation.id === job.id)?.diagnosticPhaseWork).toEqual(job.diagnosticPhaseWork);
    expect(restored.serviceOperations.find((operation) => operation.id === job.id)?.frozenOperationPhases).toEqual(job.frozenOperationPhases);
    expect(hasOutstandingDiagnosticWork(plan)).toBe(true);
  });

  it("leaves legacy saved/frozen and resource-queued work unmarked and unchanged", () => {
    const fixture = savedFixture();
    const legacy = pending();
    legacy.serviceDurationTicks = 180;
    legacy.durationTicks = 187;
    legacy.dueTick = 187;
    legacy.timingPhases = [{ id: "collection", durationTicks: 15, resourceBound: true, startsAtTick: 0, endsAtTick: 15 }, { id: "external", durationTicks: 165, resourceBound: false, startsAtTick: 15, endsAtTick: 180 }];
    legacy.resourceQueue = { version: "onsite-resource-queue.v1", status: "waiting_for_resources", serviceId: "service.genetic_testing", routeId: "route.genetic_testing.phlebotomy_sendout", allowedRouteIds: null, queuedAtTick: 0 };
    fixture.encounter.pendingResult = legacy;
    const oldJob = manualLab(fixture.state, "waiting_for_resources");
    fixture.state.serviceOperations.push(oldJob);
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    const result = restored.encounters[fixture.encounter.id]!.pendingResult!;
    expect(result.diagnosticTiming).toBeUndefined();
    expect(result.serviceDurationTicks).toBe(180);
    expect(result.durationTicks).toBe(187);
    expect(result.dueTick).toBe(187);
    expect(result.timingPhases).toEqual(legacy.timingPhases);
    expect(result.resourceQueue).toEqual(legacy.resourceQueue);
    expect(restored.serviceOperations[0]?.diagnosticPhaseWork).toBeUndefined();
    expect(restored.serviceOperations[0]?.frozenOperationPhases).toBeUndefined();
  });

  it.each(["pending", "continuation", "staged", "terminal"] as const)("rejects a malformed new plan on the %s carrier instead of loading it as legacy work", (carrier) => {
    const fixture = savedFixture();
    const malformed = clone(fixture.plan) as DiagnosticOrderPlan;
    malformed.phases[0]!.dependsOn = [malformed.phases[0]!.id];
    const raw = JSON.parse(serializeGameState(fixture.state));
    const encounter = raw.encounters[fixture.encounter.id];
    if (carrier === "pending") encounter.pendingResult = { ...pending(), diagnosticTiming: malformed };
    if (carrier === "continuation") encounter.testOnlyContinuation = { diagnosticTiming: malformed };
    if (carrier === "staged") encounter.stagedResultOrder = { diagnosticTiming: malformed };
    if (carrier === "terminal") encounter.terminalTestOrder = { diagnosticTiming: malformed };
    expect(() => deserializeGameState(JSON.stringify(raw), fixture.context)).toThrow("diagnostic order plan is invalid");
  });

  it("rejects malformed nonbillable remote markers and incompatible operation contracts", () => {
    const fixture = savedFixture();
    const processing = fixture.plan.phases.find((phase) => phase.kind === "laboratory_processing")!;
    const job = manualLab(fixture.state);
    job.actorId = fixture.encounter.id;
    job.quoteFee = 0;
    job.frozenOperationPhases = [{ id: processing.id, roomDefinitionId: "room.laboratory", durationMinutes: 15, staffRoleDefinitionIds: ["staff.laboratory_technician"] }];
    job.diagnosticPhaseWork = { version: "diagnostic-phase-work.v1", orderId: fixture.plan.orderId, encounterId: fixture.encounter.id, phaseId: processing.id,
      kind: "laboratory_processing", billing: "none", durationMinutes: 15, remainingMinutes: 15, resource: processing.resource };
    fixture.state.serviceOperations = [job];
    expect(deserializeGameState(serializeGameState(fixture.state), fixture.context).serviceOperations[0]?.diagnosticPhaseWork).toEqual(job.diagnosticPhaseWork);
    for (const mutate of [(raw: typeof job) => { raw.quoteFee = 80; }, (raw: typeof job) => { raw.actorId = "manual.actor"; },
      (raw: typeof job) => { raw.frozenOperationPhases![0]!.durationMinutes = 60; },
      (raw: typeof job) => { raw.phaseIndex = 1; }, (raw: typeof job) => { raw.phaseIndex = -1; }]) {
      fixture.state.serviceOperations = [clone(job)];
      mutate(fixture.state.serviceOperations[0]!);
      expect(() => deserializeGameState(serializeGameState(fixture.state), fixture.context)).toThrow(/diagnostic/);
    }
    expect(normalizeDiagnosticPhaseWork({ ...job.diagnosticPhaseWork, billing: "paid" })).toBeNull();
  });

  it("persists exact reading workstation IDs and rejects unknown assignments", () => {
    const fixture = savedFixture();
    fixture.addRoom("room.reading", "staff.radiologist", 2);
    const readers = fixture.state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.radiologist");
    readers[0]!.readingStationId = "northeast";
    readers[1]!.readingStationId = "southwest";
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    expect(restored.employees.find((employee) => employee.id === readers[0]!.id)?.readingStationId).toBe("northeast");
    expect(restored.employees.find((employee) => employee.id === readers[1]!.id)?.readingStationId).toBe("southwest");
    readers[0]!.readingStationId = "unknown";
    expect(() => deserializeGameState(serializeGameState(fixture.state), fixture.context)).toThrow("reading workstation is invalid");
  });

  it("checks dependencies, milestone completion and stable reader station identity strictly", () => {
    const fixture = savedFixture();
    const invalid = clone(fixture.plan);
    invalid.resultReady.reachedAtTick = 30;
    expect(normalizeDiagnosticOrderPlan(invalid)).toBeNull();
    const reading = { roomInstanceId: "room.reading.fixture", roomDefinitionId: "room.reading", stationId: "fifth_desk", employeeIds: ["reader"], provider: null,
      patientAnchor: { x: 1, y: 1 }, staffAnchor: { x: 1, y: 1 } };
    expect(normalizeDiagnosticPhaseWork({ version: "diagnostic-phase-work.v1", orderId: "order", encounterId: "encounter", phaseId: "phase",
      kind: "interpretation", billing: "none", durationMinutes: 5, remainingMinutes: 5, resource: reading })).toBeNull();
  });
});
