import { describe, expect, it } from "vitest";
import {
  DIAGNOSTIC_READING_WORKSTATIONS,
} from "@gamify-surgery/balance-config";
import {
  advanceEmployeeTraining, forecastDiagnosticOrderPlan, getFacilityAccessValidation, getNewPeriopServiceOperationPhases, hasOutstandingDiagnosticWork, normalizeDiagnosticOrderPlan, planDiagnosticOrder, requeueDiagnosticPhase, requestEmployeeTraining,
  type DiagnosticOrderPhase, type DiagnosticOrderPlan, type DiagnosticTimingRequest, type ServiceOperationState,
} from "../src";
import { manualLab, pending, timingFixture } from "./diagnostic-timing-fixtures";

function quote(fixture: ReturnType<typeof timingFixture>, request: Partial<DiagnosticTimingRequest> = {}): DiagnosticOrderPlan {
  const result = planDiagnosticOrder(fixture.state, { orderId: "order.fixture", encounterId: fixture.encounter.id, serviceId: "service.basic_labs", ...request }, fixture.context);
  expect(result.kind).toBe("planned");
  if (result.kind !== "planned") throw new Error(result.reason);
  expect(normalizeDiagnosticOrderPlan(result.plan)).toEqual(result.plan);
  return result.plan;
}

const work = (plan: DiagnosticOrderPlan) => plan.phases.filter((phase) => phase.durationMinutes > 0);
const phaseOf = (plan: DiagnosticOrderPlan, kind: DiagnosticOrderPhase["kind"]) => plan.phases.find((phase) => phase.kind === kind)!;

describe("frozen diagnostic timing planner", () => {
  it("quotes wholly external named labs at120 even with a staffed Lab but no collector", () => {
    const fixture = timingFixture();
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    for (const serviceId of ["service.basic_labs", "service.genetic_testing", "service.hiv_hcv_serology", "service.primary_aldosteronism_screen", "service.h_pylori_urea_breath"]) {
      const plan = quote(fixture, { serviceId });
      expect(work(plan).map((phase) => [phase.kind, phase.mode, phase.durationMinutes])).toEqual([["collection", "external", 120]]);
      expect(plan.resultReady.forecastAtTick).toBe(120 + phaseOf(plan, "patient_departure").forecast.walkingMinutes);
    }
  });

  it("freezes15 collection plus60 external or15 local processing with no patient trip to Lab", () => {
    const fixture = timingFixture();
    const collection = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    const sendout = quote(fixture, { patientOrigin: collection.anchor });
    expect(work(sendout).map((phase) => [phase.durationMinutes, phase.mode])).toEqual([[15, "local"], [60, "external"]]);
    expect(sendout.resultReady.forecastAtTick).toBe(75);
    expect(sendout.careComplete.forecastAtTick).toBe(15);
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    const local = quote(fixture, { patientOrigin: collection.anchor });
    expect(work(local).map((phase) => [phase.durationMinutes, phase.mode])).toEqual([[15, "local"], [15, "local"]]);
    expect(local.resultReady.forecastAtTick).toBe(30);
    expect(phaseOf(local, "laboratory_processing").forecast.patientPath).toEqual([]);
    expect(phaseOf(local, "laboratory_processing").patientPresent).toBe(false);
  });

  it("keeps bladder5 local /30 offsite independent of reading capacity", () => {
    const fixture = timingFixture();
    fixture.state.rooms = fixture.state.rooms.filter((room) => room.roomDefinitionId !== "room.examination");
    fixture.state.doors = fixture.state.doors.filter((door) => !door.roomId.includes("examination"));
    const external = quote(fixture, { serviceId: "service.bladder_scan" });
    expect(work(external).map((phase) => phase.durationMinutes)).toEqual([30]);
    const ultrasound = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    const local = quote(fixture, { serviceId: "service.bladder_scan", patientOrigin: ultrasound.anchor });
    expect(work(local).map((phase) => phase.durationMinutes)).toEqual([5]);
    expect(local.phases.some((phase) => phase.kind === "interpretation")).toBe(false);
  });

  it("quotes a local-only representative's supplied outside profile with walking, while remaining preview-only", () => {
    const fixture = timingFixture();
    const plan = quote(fixture, { serviceId: undefined, timingProfileId: "timing.test.upper_endoscopy",
      patientReturnLocation: fixture.encounter.patientLocation! });
    expect(plan.execution).toBe("preview_only");
    expect(plan.sources[0]).toMatchObject({ kind: "retained_profile", routeId: null, inclusiveDurationMinutes: 180 });
    expect(work(plan)).toEqual([expect.objectContaining({ kind: "procedure", mode: "external", durationMinutes: 180 })]);
    expect(plan.phases.find((phase) => phase.kind === "patient_departure")!.forecast.walkingMinutes).toBeGreaterThan(0);
    expect(plan.careComplete.forecastAtTick).toBeGreaterThan(180);
  });

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

  it("retains US45 and CT60 acquisition, adds one30/5 interpretation, and ignores generic upgrade speed", () => {
    const fixture = timingFixture();
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    const ct = fixture.addRoom("room.ct", "staff.imaging_technician");
    // Distinct concrete workers avoid an accidental shared acquisition queue.
    fixture.state.employees.at(-1)!.id = "staff.imaging_technician.ct";
    for (const [serviceId, acquisition, origin] of [["service.ultrasound", 45, us.anchor], ["service.ct", 60, ct.anchor]] as const) {
      const plan = quote(fixture, { serviceId, patientOrigin: origin });
      expect(work(plan).map((phase) => phase.durationMinutes)).toEqual([acquisition, 30]);
    }
    fixture.addRoom("room.reading", "staff.radiologist");
    fixture.state.rooms.forEach((room) => { room.upgradeLevel = 5; });
    const local = quote(fixture, { serviceId: "service.ct", patientOrigin: ct.anchor });
    expect(work(local).map((phase) => phase.durationMinutes)).toEqual([60, 5]);
    expect(phaseOf(local, "interpretation").patientPresent).toBe(false);
    expect(phaseOf(local, "interpretation").resource?.stationId).toBe("northwest");
    const offsite = quote(fixture, { serviceId: "service.ct", allowedRouteIds: ["route.ct.outsourced"], patientOrigin: ct.anchor });
    expect(work(offsite).map((phase) => phase.durationMinutes)).toEqual([150, 5]);
    expect(phaseOf(offsite, "interpretation").mode).toBe("local");
  });

  it("includes deterministic patient/worker walking and leaves every preview input unchanged", () => {
    const fixture = timingFixture();
    fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    const original = JSON.stringify(fixture.state);
    const request = { serviceId: "service.basic_labs", patientOrigin: { x: 9, y: 4 } };
    const first = quote(fixture, request);
    const second = quote(fixture, request);
    expect(first).toEqual(second);
    expect(phaseOf(first, "collection").forecast.walkingMinutes).toBeGreaterThan(0);
    expect(first.resultReady.forecastAtTick).toBeGreaterThan(75);
    expect(first.careComplete.afterPhaseIds).toContain("diagnostic.patient_return");
    expect(JSON.stringify(fixture.state)).toBe(original);
  });

  it("uses installed busy collection capacity, but falls back for absent, inaccessible and nonfunctional capacity", () => {
    const fixture = timingFixture();
    const room = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    const old = pending();
    old.dueTick = 100;
    old.timingPhases = [{ id: "collection", durationTicks: 40, resourceBound: true, startsAtTick: 0, endsAtTick: 40 }, { id: "external", durationTicks: 60, resourceBound: false, startsAtTick: 40, endsAtTick: 100 }];
    old.resourceReservations = [{ roomDefinitionId: "room.phlebotomy", staffRoleDefinitionId: "staff.phlebotomist" }];
    old.phlebotomistId = fixture.state.employees[0]!.id;
    fixture.encounter.pendingResult = old;
    const busy = quote(fixture, { patientOrigin: room.anchor });
    expect(phaseOf(busy, "collection").mode).toBe("local");
    expect(phaseOf(busy, "collection").forecast.queueMinutes).toBe(40);
    fixture.encounter.pendingResult = null;
    room.room.maintenance = { status: "out_of_service", completedUses: 0, dueAtFacilityTick: null, outOfServiceAtFacilityTick: 0, appliedUseKeys: [] };
    expect(work(quote(fixture))[0]?.durationMinutes).toBe(120);
    delete room.room.maintenance;
    fixture.state.doors = fixture.state.doors.filter((door) => door.roomId !== room.room.id);
    expect(work(quote(fixture))[0]?.mode).toBe("external");
    fixture.state.employees = [];
    expect(work(quote(fixture))[0]?.durationMinutes).toBe(120);
  });

  it("includes existing manual Lab60 and its queued successor before new15 processing", () => {
    const fixture = timingFixture();
    const collector = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    fixture.state.serviceOperations.push(manualLab(fixture.state));
    const active = quote(fixture, { patientOrigin: collector.anchor });
    expect(phaseOf(active, "laboratory_processing").forecast.startsAtTick).toBe(60);
    fixture.state.serviceOperations.push(manualLab(fixture.state, "waiting_for_resources", "manual.lab.queued"));
    const queued = quote(fixture, { patientOrigin: collector.anchor });
    expect(phaseOf(queued, "laboratory_processing").forecast.startsAtTick).toBe(120);
    expect(queued.resultReady.forecastAtTick).toBe(135);
  });

  it("gives four radiologists separate station queues in one room, one study per worker", () => {
    const fixture = timingFixture();
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    const reading = fixture.addRoom("room.reading", "staff.radiologist", 4);
    const first = quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    const resource = phaseOf(first, "interpretation").resource!;
    const job: ServiceOperationState = { ...manualLab({ ...fixture.state, rooms: [{ ...reading.room, roomDefinitionId: "room.laboratory" }], employees: [{ ...fixture.state.employees[1]!, staffRoleDefinitionId: "staff.laboratory_technician" }] }),
      id: "read.busy", incomeLineId: "income.image_read", actorKind: "remote", actorId: fixture.encounter.id, quoteFee: 0,
      phaseEndsAtFacilityTick: 200, reservedRoomInstanceIds: [reading.room.id], reservedEmployeeIds: [resource.employeeIds[0]!],
      frozenOperationPhases: [{ id: "interpretation", roomDefinitionId: "room.reading", durationMinutes: 5, staffRoleDefinitionIds: ["staff.radiologist"] }],
      diagnosticPhaseWork: { version: "diagnostic-phase-work.v1", orderId: "read.order", encounterId: fixture.encounter.id, phaseId: "read.phase", kind: "interpretation", billing: "none", durationMinutes: 5, remainingMinutes: 5, resource } };
    fixture.state.serviceOperations.push(job);
    const four = quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    expect(phaseOf(four, "interpretation").forecast.startsAtTick).toBeLessThan(200);
    expect(phaseOf(four, "interpretation").resource?.employeeIds[0]).not.toBe(resource.employeeIds[0]);
    expect(DIAGNOSTIC_READING_WORKSTATIONS.map((station) => station.id)).toContain(phaseOf(four, "interpretation").resource?.stationId);
    fixture.state.employees = fixture.state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.radiologist" || employee.id === resource.employeeIds[0]);
    const one = quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    expect(phaseOf(one, "interpretation").forecast.startsAtTick).toBe(200);
    expect(phaseOf(one, "interpretation").mode).toBe("local");
    fixture.state.employees = fixture.state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.radiologist");
    expect(phaseOf(quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor }), "interpretation").durationMinutes).toBe(30);
  });

  it("makes every reader station honor a legacy whole-room read reservation", () => {
    const fixture = timingFixture();
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    const reading = fixture.addRoom("room.reading", "staff.radiologist", 4);
    const worker = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.radiologist")!;
    fixture.state.serviceOperations.push({
      ...manualLab({ ...fixture.state, rooms: [{ ...reading.room, roomDefinitionId: "room.laboratory" }], employees: [{ ...worker, staffRoleDefinitionId: "staff.laboratory_technician" }] }),
      id: "legacy.whole-room.read", incomeLineId: "income.image_read", phaseEndsAtFacilityTick: 200,
      reservedRoomInstanceIds: [reading.room.id], reservedEmployeeIds: [worker.id],
      frozenOperationPhases: [{ id: "interpretation", roomDefinitionId: "room.reading", durationMinutes: 30, staffRoleDefinitionIds: ["staff.radiologist"] }],
    });
    const plan = quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    expect(phaseOf(plan, "interpretation").forecast.startsAtTick).toBe(200);
  });

  it("shares one Periop nurse across separate beds while retaining bed and suite queues", () => {
    const fixture = timingFixture();
    const endoscopy = fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    const periop = fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    fixture.state.environment.founderLocation = endoscopy.anchor;
    const first = quote(fixture, { orderId: "order.first", serviceId: "service.endoscopy", patientOrigin: periop.anchor, resultKind: "visual" });
    fixture.encounter.pendingResult = pending(first);
    const nurse = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.periop_nurse")!;
    nurse.facilityTask = { kind: "cover_periop", targetId: periop.room.id, startedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
    const second = quote(fixture, { orderId: "order.second", serviceId: "service.endoscopy", patientOrigin: periop.anchor, resultKind: "visual" });
    expect(phaseOf(second, "preparation").resource?.stationId).not.toBe(phaseOf(first, "preparation").resource?.stationId);
    expect(phaseOf(second, "preparation").resource?.employeeIds).toEqual(phaseOf(first, "preparation").resource?.employeeIds);
    expect(phaseOf(second, "preparation").forecast.startsAtTick).toBeLessThan(phaseOf(first, "procedure").forecast.endsAtTick);
    expect(phaseOf(second, "procedure").forecast.startsAtTick).toBeGreaterThanOrEqual(phaseOf(first, "procedure").forecast.endsAtTick);
  });

  it("includes finite staff path/work and Founder tasks but releases this chart's attendance", () => {
    const fixture = timingFixture();
    const collector = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    const worker = fixture.state.employees[0]!;
    worker.path = [collector.anchor, { x: collector.anchor.x + 1, y: collector.anchor.y }];
    worker.pathIndex = 0;
    worker.facilityTask = { kind: "take_break", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
    const lab = quote(fixture, { patientOrigin: collector.anchor });
    const walking = Math.ceil(1 / fixture.context.balanceRelease.facility.characterTravelTilesPerTick);
    expect(phaseOf(lab, "collection").forecast.queueMinutes).toBe(10 + walking);
    expect(phaseOf(lab, "collection").forecast.walkingMinutes).toBe(walking);
    const endoscopy = fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    const periop = fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    fixture.state.environment.founderLocation = endoscopy.anchor;
    fixture.state.environment.founderActivity = { kind: "refill_water", targetId: "water", path: [endoscopy.anchor], pathIndex: 0, lastMovedAtFacilityTick: 0, workMinutesRemaining: 100 };
    const busy = quote(fixture, { serviceId: "service.endoscopy", patientOrigin: periop.anchor, resultKind: "visual" });
    expect(phaseOf(busy, "procedure").forecast.startsAtTick).toBe(100 + phaseOf(busy, "procedure").forecast.walkingMinutes);
    fixture.state.environment.founderActivity = { ...fixture.state.environment.founderActivity, kind: "attend_encounter", targetId: fixture.encounter.id, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
    const currentChart = quote(fixture, { serviceId: "service.endoscopy", patientOrigin: periop.anchor, resultKind: "visual" });
    expect(phaseOf(currentChart, "procedure").forecast.startsAtTick).toBeLessThan(100);
  });

  it("honors an accepted reader choice and actual linked acquisition completion instead of stale quote clocks", () => {
    const fixture = timingFixture();
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.addRoom("room.reading", "staff.radiologist");
    const accepted = quote(fixture, { orderId: "order.accepted", serviceId: "service.ultrasound", patientOrigin: us.anchor });
    const acquired = phaseOf(accepted, "acquisition");
    acquired.status = "active";
    acquired.startedAtTick = 0;
    acquired.serviceOperationId = "acquisition.delayed";
    fixture.encounter.pendingResult = pending(accepted);
    const technician = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.imaging_technician")!;
    fixture.state.serviceOperations.push({ ...manualLab({ ...fixture.state, rooms: [{ ...us.room, roomDefinitionId: "room.laboratory" }], employees: [{ ...technician, staffRoleDefinitionId: "staff.laboratory_technician" }] }),
      id: "acquisition.delayed", incomeLineId: "income.ultrasound", actorKind: "encounter", actorId: fixture.encounter.id,
      phaseEndsAtFacilityTick: 150, reservedRoomInstanceIds: [us.room.id], reservedEmployeeIds: [technician.id], location: us.anchor,
      frozenOperationPhases: [{ id: "acquisition", roomDefinitionId: "room.ultrasound", durationMinutes: 45, staffRoleDefinitionIds: ["staff.imaging_technician"] }] });
    const later = quote(fixture, { orderId: "order.later", serviceId: "service.ct", allowedRouteIds: ["route.ct.outsourced"], patientOrigin: fixture.state.environment.founderLocation });
    expect(phaseOf(accepted, "interpretation").forecast.readyAtTick).toBe(45);
    expect(phaseOf(later, "interpretation").forecast.startsAtTick).toBeGreaterThanOrEqual(155);

    // A saved northeast queue must not move to a now-idle northwest reader.
    const other = timingFixture();
    const otherUs = other.addRoom("room.ultrasound", "staff.imaging_technician");
    const reading = other.addRoom("room.reading", "staff.radiologist", 2);
    const old = quote(other, { orderId: "order.northeast", serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced"], patientOrigin: other.state.environment.founderLocation });
    const read = phaseOf(old, "interpretation");
    const northeast = other.state.employees.find((employee) => employee.id === "staff.radiologist.2")!;
    read.resource = { ...read.resource!, stationId: "northeast", employeeIds: [northeast.id], staffAnchor: { x: reading.room.x + 3, y: reading.room.y + 1 } };
    other.encounter.pendingResult = pending(old);
    const next = quote(other, { orderId: "order.next", serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced"], patientOrigin: other.state.environment.founderLocation });
    expect(phaseOf(next, "interpretation").resource?.employeeIds).toEqual(["staff.radiologist.1"]);
    expect(read.resource.employeeIds).toEqual(["staff.radiologist.2"]);
  });

  it("seeds every active reservation before forecasting another operation's future phases", () => {
    const fixture = timingFixture();
    const endoscopy = fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    const periop = fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    const minor = fixture.addRoom("room.minor_procedure");
    const phases = getNewPeriopServiceOperationPhases("income.endoscopy")!;
    const nurse = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.periop_nurse")!;
    const endoNurse = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.endoscopy_nurse")!;
    fixture.state.environment.founderLocation = endoscopy.anchor;
    const base = manualLab({ ...fixture.state, rooms: [{ ...periop.room, roomDefinitionId: "room.laboratory" }], employees: [{ ...nurse, staffRoleDefinitionId: "staff.laboratory_technician" }] });
    fixture.state.serviceOperations.push({ ...base, id: "a.preparation", incomeLineId: "income.endoscopy", actorKind: "visitor", location: periop.anchor,
      frozenOperationPhases: phases, phaseEndsAtFacilityTick: 10, reservedRoomInstanceIds: [periop.room.id], reservedEmployeeIds: [nurse.id],
      periopBedFlowVersion: 1, phaseFlowVersion: 1, periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: periop.room.id, bedId: "N3", endpoint: periop.anchor } },
      { ...base, id: "b.procedure", incomeLineId: "income.endoscopy", actorKind: "visitor", location: endoscopy.anchor, phaseIndex: 1,
        frozenOperationPhases: phases, phaseEndsAtFacilityTick: 40, reservedRoomInstanceIds: [endoscopy.room.id], reservedEmployeeIds: [endoNurse.id], providerReservation: { kind: "founder" },
        periopBedFlowVersion: 1, phaseFlowVersion: 1, periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: periop.room.id, bedId: "N4", endpoint: { x: periop.anchor.x + 1, y: periop.anchor.y } } });
    const next = quote(fixture, { serviceId: "service.anoscopy", patientOrigin: minor.anchor });
    expect(phaseOf(next, "procedure").mode).toBe("local");
    expect(phaseOf(next, "procedure").durationMinutes).toBe(15);
    expect(phaseOf(next, "procedure").forecast.startsAtTick).toBeGreaterThanOrEqual(85);
  });

  it("uses actor locations at the candidate time and preserves travel to the next reservation", () => {
    const fixture = timingFixture();
    const us = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    const ct = fixture.addRoom("room.ct");
    const technician = fixture.state.employees[0]!;
    const queued = { ...manualLab({ ...fixture.state, rooms: [{ ...ct.room, roomDefinitionId: "room.laboratory" }], employees: [{ ...technician, staffRoleDefinitionId: "staff.laboratory_technician" }] }, "waiting_for_resources"),
      id: "future.ct", incomeLineId: "income.ct", frozenOperationPhases: [
        { id: "retained.external", roomDefinitionId: null, durationMinutes: 100, staffRoleDefinitionIds: [] },
        { id: "acquisition", roomDefinitionId: "room.ct", durationMinutes: 60, staffRoleDefinitionIds: ["staff.imaging_technician"] },
      ] };
    fixture.state.serviceOperations.push(queued);
    const early = quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    expect(phaseOf(early, "acquisition").forecast.walkingMinutes).toBe(0);
    expect(phaseOf(early, "acquisition").forecast.startsAtTick).toBe(0);
    queued.frozenOperationPhases[0]!.durationMinutes = 46;
    const tooClose = quote(fixture, { serviceId: "service.ultrasound", patientOrigin: us.anchor });
    expect(phaseOf(tooClose, "acquisition").forecast.queueMinutes).toBeGreaterThanOrEqual(106);
    expect(phaseOf(tooClose, "acquisition").forecast.walkingMinutes).toBeGreaterThan(0);
  });

  it("retains local procedure queues and keeps inferred profile representatives preview-only", () => {
    const fixture = timingFixture();
    const minor = fixture.addRoom("room.minor_procedure");
    fixture.state.environment.founderLocation = minor.anchor;
    const anoscopy = quote(fixture, { serviceId: "service.anoscopy", patientOrigin: minor.anchor });
    expect(work(anoscopy).map((phase) => [phase.kind, phase.mode, phase.durationMinutes])).toEqual([["procedure", "local", 15]]);
    expect(phaseOf(anoscopy, "procedure").resource?.provider).toEqual({ kind: "founder" });
    const profile = quote(fixture, { serviceId: undefined, timingProfileId: "timing.test.lower_endoscopy" });
    expect(profile.execution).toBe("preview_only");
    expect(profile.phases.some((phase) => phase.kind === "pathology")).toBe(false);
    const concrete = quote(fixture, { serviceId: "service.colonoscopy", timingProfileId: "timing.test.lower_endoscopy" });
    expect(concrete.execution).toBe("supported");
    expect(concrete.phases.some((phase) => phase.kind === "pathology")).toBe(false);
    const sampling = quote(fixture, { serviceId: "service.colonoscopy", timingProfileId: "timing.test.lower_endoscopy", specimenCollected: true, resultKind: "pathology" });
    expect(sampling.phases.some((phase) => phase.kind === "pathology")).toBe(true);
  });

  it("protects unfinished care and return after visual result readiness", () => {
    const fixture = timingFixture();
    fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    const plan = quote(fixture, { serviceId: "service.endoscopy", resultKind: "visual" });
    for (const phase of plan.phases.filter((phase) => phase.kind === "preparation" || phase.kind === "procedure")) {
      phase.status = "completed"; phase.remainingMinutes = 0; phase.startedAtTick = phase.forecast.startsAtTick; phase.completedAtTick = phase.forecast.endsAtTick;
    }
    plan.resultReady.reachedAtTick = plan.resultReady.forecastAtTick;
    plan.visualResultReady!.reachedAtTick = plan.resultReady.reachedAtTick;
    expect(normalizeDiagnosticOrderPlan(plan)).toEqual(plan);
    expect(hasOutstandingDiagnosticWork(plan)).toBe(true);
    for (const phase of plan.phases) {
      phase.status = "completed"; phase.remainingMinutes = 0; phase.startedAtTick = phase.forecast.startsAtTick; phase.completedAtTick = phase.forecast.endsAtTick;
    }
    plan.careComplete.reachedAtTick = plan.careComplete.forecastAtTick;
    expect(hasOutstandingDiagnosticWork(plan)).toBe(false);
  });

  it("exposes endoscopy visual findings and starts pathology at procedure completion while recovery continues", () => {
    const fixture = timingFixture();
    fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    expect(getFacilityAccessValidation(fixture.state, fixture.context).unreachableRoomIds).toEqual([]);
    const pathology = quote(fixture, { serviceId: "service.colonoscopy", specimenCollected: true, resultKind: "pathology" });
    const procedure = phaseOf(pathology, "procedure");
    const processing = phaseOf(pathology, "pathology");
    const recovery = phaseOf(pathology, "recovery");
    expect(work(pathology).map((phase) => phase.durationMinutes)).toEqual([30, 45, 30, 60]);
    expect(processing.dependsOn).toEqual([procedure.id]);
    expect(processing.forecast.readyAtTick).toBe(procedure.forecast.endsAtTick);
    expect(pathology.visualResultReady?.forecastAtTick).toBe(procedure.forecast.endsAtTick);
    expect(pathology.resultReady.forecastAtTick).toBeLessThan(recovery.forecast.endsAtTick);
    expect(pathology.careComplete.forecastAtTick).toBeGreaterThan(pathology.resultReady.forecastAtTick);
    const visual = quote(fixture, { serviceId: "service.endoscopy", resultKind: "visual", specimenCollected: false });
    expect(visual.phases.some((phase) => phase.kind === "pathology")).toBe(false);
    expect(visual.resultReady).toEqual(visual.visualResultReady);
  });

  it("preserves opaque external inclusive totals and quotes generic biopsy without invented onsite eligibility", () => {
    const fixture = timingFixture();
    const biopsy = quote(fixture, { serviceId: "service.breast_excisional_biopsy" });
    expect(work(biopsy).map((phase) => phase.durationMinutes)).toEqual([180, 60]);
    expect(biopsy.sources[0]?.kind).toBe("retained_inclusive_total");
    const generic = quote(fixture, { serviceId: undefined, timingProfileId: "timing.test.biopsy" });
    expect(generic.execution).toBe("preview_only");
    expect(work(generic).map((phase) => phase.durationMinutes)).toEqual([120, 60]);
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    expect(work(quote(fixture, { serviceId: "service.breast_excisional_biopsy" })).map((phase) => phase.durationMinutes)).toEqual([180, 30]);
  });

  it("retains specialist profiles and explicit mixed work remainders", () => {
    const fixture = timingFixture();
    const collector = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    const protocol = quote(fixture, { patientOrigin: collector.anchor, remainder: { label: "24-hour urine protocol", durationMinutes: 1440, mode: "retained_protocol", startsAfter: "acquisition" } });
    expect(work(protocol).map((phase) => phase.durationMinutes)).toEqual([15, 60, 1440]);
    expect(protocol.sources.at(-1)?.routeDisplayName).toBe("24-hour urine protocol");
    const mri = quote(fixture, { serviceId: undefined, timingProfileId: "timing.test.mri" });
    expect(work(mri).map((phase) => phase.durationMinutes)).toEqual([180]);
    expect(mri.phases.some((phase) => phase.kind === "interpretation" || phase.kind === "pathology")).toBe(false);
  });

  it("resumes remaining frozen processing after resource loss without restarting completed collection", () => {
    const fixture = timingFixture();
    const collection = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    const accepted = quote(fixture, { patientOrigin: collection.anchor });
    const draw = phaseOf(accepted, "collection");
    draw.status = "completed"; draw.startedAtTick = 0; draw.completedAtTick = 15; draw.remainingMinutes = 0;
    accepted.careComplete.reachedAtTick = 15;
    const processing = phaseOf(accepted, "laboratory_processing");
    processing.status = "active"; processing.startedAtTick = 15; processing.serviceOperationId = "processor.old";
    const resumed = requeueDiagnosticPhase(accepted, processing.id, 20);
    expect(phaseOf(resumed, "laboratory_processing").remainingMinutes).toBe(10);
    expect(phaseOf(resumed, "laboratory_processing").durationMinutes).toBe(15);
    expect(phaseOf(resumed, "laboratory_processing").resource).toBeNull();
    expect(phaseOf(resumed, "collection")).toEqual(draw);
    expect(processing.remainingMinutes).toBe(15);
    expect(normalizeDiagnosticOrderPlan(resumed)).toEqual(resumed);
  });

  it("forecasts frozen work against live queues, preserves progress and reports lost capacity", () => {
    const fixture = timingFixture();
    const collector = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    const accepted = quote(fixture, { patientOrigin: collector.anchor });
    const draw = phaseOf(accepted, "collection");
    draw.status = "completed"; draw.startedAtTick = 0; draw.completedAtTick = 15; draw.remainingMinutes = 0;
    accepted.careComplete.reachedAtTick = 15;
    const processing = phaseOf(accepted, "laboratory_processing");
    processing.status = "queued";
    fixture.encounter.pendingResult = pending(accepted);
    fixture.state.facilityTick = 20;
    fixture.state.serviceOperations.push(manualLab(fixture.state));
    const before = JSON.stringify(fixture.state);
    const forecast = forecastDiagnosticOrderPlan(fixture.state, accepted, fixture.context);
    expect(forecast.blockedPhaseIds).toEqual([]);
    expect(phaseOf(forecast.plan, "laboratory_processing").forecast.startsAtTick).toBe(60);
    expect(forecast.plan.resultReady.forecastAtTick).toBe(75);
    expect(forecast.plan.careComplete.reachedAtTick).toBe(15);
    expect(forecast.plan.sources).toEqual(accepted.sources);
    expect(forecast.plan.phases.map(({ forecast: _forecast, ...phase }) => phase)).toEqual(accepted.phases.map(({ forecast: _forecast, ...phase }) => phase));
    expect(normalizeDiagnosticOrderPlan(forecast.plan)).toEqual(forecast.plan);
    expect(JSON.stringify(fixture.state)).toBe(before);
    fixture.state.employees = fixture.state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.laboratory_technician");
    const liveJob = fixture.state.serviceOperations[0]!;
    liveJob.id = "marked.processing"; liveJob.quoteFee = 0; liveJob.actorId = fixture.encounter.id;
    liveJob.frozenOperationPhases = [{ id: processing.id, roomDefinitionId: "room.laboratory", durationMinutes: 15, staffRoleDefinitionIds: ["staff.laboratory_technician"] }];
    liveJob.diagnosticPhaseWork = { version: "diagnostic-phase-work.v1", orderId: accepted.orderId, encounterId: fixture.encounter.id, phaseId: processing.id,
      kind: "laboratory_processing", billing: "none", durationMinutes: 15, remainingMinutes: 15, resource: processing.resource };
    processing.serviceOperationId = liveJob.id;
    const lost = forecastDiagnosticOrderPlan(fixture.state, accepted, fixture.context);
    expect(lost.blockedPhaseIds).toEqual([processing.id]);
    expect(lost.plan.resultReady.forecastAtTick).toBe(accepted.resultReady.forecastAtTick);
    expect(phaseOf(lost.plan, "laboratory_processing").resource).toEqual(processing.resource);
    fixture.state.serviceOperations = [];
    const resumed = requeueDiagnosticPhase(accepted, processing.id, 20);
    phaseOf(resumed, "laboratory_processing").remainingMinutes = 5;
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    fixture.context.balanceRelease.services.find((service) => service.id === "service.basic_labs")!.routes[0]!.durationTicks = 999;
    const remaining = forecastDiagnosticOrderPlan(fixture.state, resumed, fixture.context);
    expect(phaseOf(remaining.plan, "laboratory_processing").forecast.endsAtTick - phaseOf(remaining.plan, "laboratory_processing").forecast.startsAtTick).toBe(5);
    expect(phaseOf(remaining.plan, "laboratory_processing").durationMinutes).toBe(15);
    expect(phaseOf(remaining.plan, "laboratory_processing").resource).toBeNull();
  });

  it("uses a live acquisition end in the accepted order forecast without replaying active work", () => {
    const fixture = timingFixture();
    const ultrasound = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.addRoom("room.reading", "staff.radiologist");
    const accepted = quote(fixture, { serviceId: "service.ultrasound", patientOrigin: ultrasound.anchor });
    const acquisition = phaseOf(accepted, "acquisition");
    acquisition.status = "active"; acquisition.startedAtTick = 0; acquisition.serviceOperationId = "acquisition.actual";
    const technician = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.imaging_technician")!;
    fixture.state.serviceOperations.push({ ...manualLab({ ...fixture.state, rooms: [{ ...ultrasound.room, roomDefinitionId: "room.laboratory" }], employees: [{ ...technician, staffRoleDefinitionId: "staff.laboratory_technician" }] }),
      id: "acquisition.actual", incomeLineId: "income.ultrasound", actorKind: "encounter", actorId: fixture.encounter.id, location: ultrasound.anchor,
      phaseEndsAtFacilityTick: 150, reservedRoomInstanceIds: [ultrasound.room.id], reservedEmployeeIds: [technician.id],
      frozenOperationPhases: [{ id: "acquisition", roomDefinitionId: "room.ultrasound", durationMinutes: 45, staffRoleDefinitionIds: ["staff.imaging_technician"] }] });
    fixture.state.facilityTick = 100;
    const forecast = forecastDiagnosticOrderPlan(fixture.state, accepted, fixture.context);
    expect(phaseOf(forecast.plan, "acquisition").forecast.endsAtTick).toBe(150);
    expect(phaseOf(forecast.plan, "interpretation").forecast.readyAtTick).toBe(150);
    expect(forecast.plan.resultReady.forecastAtTick).toBeGreaterThanOrEqual(155);
    expect(acquisition.forecast.endsAtTick).toBe(45);
    const external = quote(fixture, { serviceId: "service.basic_labs" });
    const departure = phaseOf(external, "patient_departure");
    departure.status = "completed"; departure.startedAtTick = 100; departure.completedAtTick = 100; departure.remainingMinutes = 0;
    const collection = phaseOf(external, "collection");
    collection.status = "active"; collection.startedAtTick = 100;
    fixture.state.facilityTick = 110;
    expect(phaseOf(forecastDiagnosticOrderPlan(fixture.state, external, fixture.context).plan, "collection").forecast.endsAtTick).toBe(220);
  });

  it("treats waiting-for-next-phase work as completed and holds the outgoing room through transfer", () => {
    const fixture = timingFixture();
    const endoscopy = fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    const periop = fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    const minor = fixture.addRoom("room.minor_procedure");
    const accepted = quote(fixture, { serviceId: "service.endoscopy", patientOrigin: periop.anchor, resultKind: "visual" });
    const prep = phaseOf(accepted, "preparation");
    prep.status = "completed"; prep.startedAtTick = 0; prep.completedAtTick = 30; prep.remainingMinutes = 0;
    const procedure = phaseOf(accepted, "procedure");
    procedure.status = "active"; procedure.startedAtTick = 30; procedure.serviceOperationId = "endo.waiting";
    phaseOf(accepted, "recovery").serviceOperationId = "endo.waiting";
    const nurse = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.periop_nurse")!;
    const base = manualLab({ ...fixture.state, rooms: [{ ...periop.room, roomDefinitionId: "room.laboratory" }], employees: [{ ...nurse, staffRoleDefinitionId: "staff.laboratory_technician" }] });
    fixture.state.serviceOperations.push({ ...base, id: "endo.waiting", incomeLineId: "income.endoscopy", actorKind: "visitor", status: "waiting_for_next_phase",
      phaseIndex: 1, phaseEndsAtFacilityTick: null, phaseStartedAtFacilityTick: null, nextPhaseReadyAtFacilityTick: 40, location: endoscopy.anchor,
      reservedRoomInstanceIds: [], reservedEmployeeIds: [], transitionHeldRoomInstanceIds: [endoscopy.room.id],
      frozenOperationPhases: getNewPeriopServiceOperationPhases("income.endoscopy")!, periopBedFlowVersion: 1, phaseFlowVersion: 1,
      periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: periop.room.id, bedId: "N3", endpoint: periop.anchor } });
    fixture.state.facilityTick = 50;
    fixture.state.environment.founderLocation = endoscopy.anchor;
    const forecast = forecastDiagnosticOrderPlan(fixture.state, accepted, fixture.context);
    expect(phaseOf(forecast.plan, "procedure").forecast.endsAtTick).toBe(40);
    expect(forecast.plan.resultReady.forecastAtTick).toBe(40);
    expect(phaseOf(forecast.plan, "recovery").forecast.endsAtTick).toBeLessThan(130);
    expect(phaseOf(quote(fixture, { serviceId: "service.anoscopy", patientOrigin: minor.anchor }), "procedure").forecast.queueMinutes).toBe(0);
  });

  it("seeds every occupied bed during active procedures and recovers in the originally held bed", () => {
    const fixture = timingFixture();
    const endoscopy = fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    const periop = fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    const accepted = quote(fixture, { serviceId: "service.endoscopy", patientOrigin: periop.anchor, resultKind: "visual" });
    const phases = getNewPeriopServiceOperationPhases("income.endoscopy")!;
    const nurse = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.periop_nurse")!;
    const endoNurse = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.endoscopy_nurse")!;
    const base = manualLab({ ...fixture.state, rooms: [{ ...periop.room, roomDefinitionId: "room.laboratory" }], employees: [{ ...nurse, staffRoleDefinitionId: "staff.laboratory_technician" }] });
    fixture.state.serviceOperations.push({ ...base, id: "a.prep", incomeLineId: "income.endoscopy", actorKind: "visitor", location: { x: periop.anchor.x + 1, y: periop.anchor.y },
      phaseEndsAtFacilityTick: 10, frozenOperationPhases: phases, reservedRoomInstanceIds: [periop.room.id], reservedEmployeeIds: [nurse.id],
      periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: periop.room.id, bedId: "N4", endpoint: { x: periop.anchor.x + 1, y: periop.anchor.y } } },
      { ...base, id: "b.procedure", incomeLineId: "income.endoscopy", actorKind: "visitor", location: endoscopy.anchor, phaseIndex: 1, phaseEndsAtFacilityTick: 40,
        frozenOperationPhases: phases, reservedRoomInstanceIds: [endoscopy.room.id], reservedEmployeeIds: [endoNurse.id], providerReservation: { kind: "founder" },
        periopBedReservation: { version: "periop-bed-reservation.v1", roomInstanceId: periop.room.id, bedId: "N3", endpoint: periop.anchor } });
    for (const phase of accepted.phases) if (phase.kind !== "patient_return") phase.serviceOperationId = "b.procedure";
    const prep = phaseOf(accepted, "preparation");
    prep.status = "completed"; prep.startedAtTick = 0; prep.completedAtTick = 10; prep.remainingMinutes = 0;
    const forecast = forecastDiagnosticOrderPlan(fixture.state, accepted, fixture.context);
    expect(phaseOf(forecast.plan, "recovery").forecast.endsAtTick).toBeLessThan(150);
    expect(phaseOf(forecast.plan, "recovery").resource?.stationId).toBe("N3");
    const next = quote(fixture, { orderId: "order.next", serviceId: "service.endoscopy", patientOrigin: periop.anchor, resultKind: "visual" });
    expect(phaseOf(next, "preparation").forecast.startsAtTick).toBeGreaterThanOrEqual(phaseOf(forecast.plan, "recovery").forecast.endsAtTick);
  });

  it("uses engine clinician, shared nursing and primary patient anchors when they differ", () => {
    const fixture = timingFixture();
    const collector = fixture.addRoom("room.phlebotomy", "staff.phlebotomist");
    const phlebotomy = fixture.context.balanceRelease.facility.roomDefinitions.find((definition) => definition.id === "room.phlebotomy")!;
    phlebotomy.navigation!.patientCareAnchor = { x: 2, y: 1 };
    phlebotomy.navigation!.clinicianCareAnchor = { x: 3, y: 1 };
    const collection = phaseOf(quote(fixture, { patientOrigin: collector.anchor }), "collection");
    expect(collection.resource?.patientAnchor).toEqual({ x: collector.room.x + 2, y: collector.room.y + 1 });
    expect(collection.resource?.staffAnchor).toEqual({ x: collector.room.x + 3, y: collector.room.y + 1 });
    expect(collection.forecast.employeePaths[0]?.path.at(-1)).toEqual(collection.resource?.staffAnchor);
    const ultrasound = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
    fixture.context.balanceRelease.facility.roomDefinitions.find((definition) => definition.id === "room.ultrasound")!.navigation!.patientCareAnchor = { x: 3, y: 2 };
    expect(phaseOf(quote(fixture, { serviceId: "service.ultrasound", patientOrigin: ultrasound.anchor }), "acquisition").resource?.patientAnchor).toEqual(ultrasound.anchor);
    fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    const periop = fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    fixture.context.balanceRelease.facility.roomDefinitions.find((definition) => definition.id === "room.periop_recovery")!.navigation!.sharedStaffAnchor = { x: 3, y: 1 };
    expect(phaseOf(quote(fixture, { serviceId: "service.endoscopy", patientOrigin: periop.anchor, resultKind: "visual" }), "preparation").resource?.staffAnchor).toEqual({ x: periop.room.x + 3, y: periop.room.y + 1 });
    const reading = fixture.addRoom("room.reading", "staff.radiologist");
    const reader = fixture.state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.radiologist")!;
    reader.readingStationId = "southwest";
    const read = phaseOf(quote(fixture, { serviceId: "service.ultrasound", patientOrigin: ultrasound.anchor }), "interpretation");
    expect(read.resource?.stationId).toBe("southwest");
    expect(read.resource?.staffAnchor).toEqual({ x: reading.room.x, y: reading.room.y + 2 });
  });

  it("keeps visual sampled endoscopy ready while background pathology can outlive recovery", () => {
    const fixture = timingFixture();
    fixture.addRoom("room.endoscopy", "staff.endoscopy_nurse");
    fixture.addRoom("room.periop_recovery", "staff.periop_nurse");
    fixture.addRoom("room.laboratory", "staff.laboratory_technician");
    const lab = manualLab(fixture.state); lab.phaseEndsAtFacilityTick = 300;
    fixture.state.serviceOperations.push(lab);
    const plan = quote(fixture, { serviceId: "service.colonoscopy", specimenCollected: true, resultKind: "visual" });
    expect(plan.resultReady).toEqual(plan.visualResultReady);
    expect(phaseOf(plan, "pathology").forecast.endsAtTick).toBe(330);
    expect(plan.careComplete.forecastAtTick).toBeLessThan(330);
    for (const phase of plan.phases.filter((phase) => phase.kind !== "pathology")) {
      phase.status = "completed"; phase.remainingMinutes = 0; phase.startedAtTick = phase.forecast.startsAtTick; phase.completedAtTick = phase.forecast.endsAtTick;
    }
    plan.resultReady.reachedAtTick = plan.resultReady.forecastAtTick;
    plan.visualResultReady!.reachedAtTick = plan.resultReady.reachedAtTick;
    plan.careComplete.reachedAtTick = plan.careComplete.forecastAtTick;
    expect(hasOutstandingDiagnosticWork(plan)).toBe(true);
    expect(normalizeDiagnosticOrderPlan(plan)).toEqual(plan);
  });

  it("uses an explicit local-only service profile fallback and exact offscreen/return endpoints", () => {
    const fixture = timingFixture();
    const frontDesk = fixture.state.environment.founderLocation;
    const external = quote(fixture, { serviceId: "service.endoscopy", timingProfileId: "timing.test.upper_endoscopy", resultKind: "visual", patientReturnLocation: frontDesk });
    expect(external.execution).toBe("supported");
    expect(work(external).map((phase) => phase.durationMinutes)).toEqual([180]);
    expect(external.sources[0]?.kind).toBe("retained_profile");
    expect(external.sources[0]?.routeId).toBeNull();
    const departure = phaseOf(external, "patient_departure");
    const returning = phaseOf(external, "patient_return");
    expect(departure.forecast.patientPath.at(-1)?.x).toBe(-2);
    expect(returning.forecast.patientPath.at(-1)).toEqual(frontDesk);
    const sampled = quote(fixture, { serviceId: "service.endoscopy", timingProfileId: "timing.test.upper_endoscopy", specimenCollected: true, resultKind: "pathology", patientReturnLocation: frontDesk });
    expect(work(sampled).map((phase) => phase.durationMinutes)).toEqual([120, 60]);
    expect(planDiagnosticOrder(fixture.state, { orderId: "missing.profile", encounterId: fixture.encounter.id, serviceId: "service.endoscopy" }, fixture.context)).toEqual({ kind: "unavailable", reason: "missing_acquisition_contract", estimateMinutes: null });
    const mixed = quote(fixture, { components: [{ serviceId: "service.basic_labs" }, { serviceId: "service.basic_labs" }], patientReturnLocation: frontDesk });
    const departures = mixed.phases.filter((phase) => phase.kind === "patient_departure");
    expect(departures[1]?.forecast.patientPath[0]).toEqual(frontDesk);
    const activeWalking = JSON.parse(JSON.stringify(external)) as DiagnosticOrderPlan;
    const walking = phaseOf(activeWalking, "patient_departure");
    walking.status = "active"; walking.startedAtTick = 0;
    fixture.state.facilityTick = 2;
    const once = forecastDiagnosticOrderPlan(fixture.state, activeWalking, fixture.context).plan;
    fixture.state.facilityTick = 3;
    const twice = forecastDiagnosticOrderPlan(fixture.state, once, fixture.context).plan;
    expect(phaseOf(twice, "patient_departure").forecast.walkingMinutes).toBe(departure.forecast.walkingMinutes - 3);
  });
});
