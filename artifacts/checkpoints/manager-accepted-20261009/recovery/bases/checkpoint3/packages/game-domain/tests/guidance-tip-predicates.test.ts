import { describe, it, expect } from "vitest";
import { GUIDANCE_TIP_CATALOG, GUIDANCE_TIP_POLICY, type GuidanceTipId } from "@gamify-surgery/balance-config";
import { evaluateGuidanceTipCandidates, getWorkloadSnapshot, getRoomDefinition, requestEmployeeTraining, TUTORIAL_ENCOUNTER_ID } from "../src";
import { tipsFixture, addLitter, type TipsFixture } from "./guidance-tips-fixtures";

type Scenario = { id: GuidanceTipId; setup: (fixture: TipsFixture) => () => void };
const scenarios: Scenario[] = [
  { id: "tip.staff.salary", setup: (f) => { const e = f.employee(); e.morale = 30; return () => { e.morale = 100; }; } },
  { id: "tip.staff.praise", setup: (f) => { const e = f.employee(); e.morale = 60; return () => { e.lastPraisedAtFacilityTick = f.state.facilityTick; }; } },
  { id: "tip.training.build", setup: (f) => { f.employee(); return () => { f.addRoom("room.training"); }; } },
  { id: "tip.training.role", setup: (f) => { f.employee(); f.addRoom("room.training"); return () => { f.encounter.idleWaitingSinceTick = null; }; } },
  { id: "tip.telehealth.automation", setup: (f) => { const r = f.addRoom("room.glp1_telehealth_suite"); return () => { f.employee("staff.glp1_np", r.room.id); }; } },
  { id: "tip.reception.coverage", setup: (f) => () => { f.employee(); } },
  { id: "tip.access.restore", setup: (f) => { const r = f.addRoom("room.training"); f.employee("staff.receptionist", r.room.id); const d = f.state.doors.find((d) => d.roomId === r.room.id)!; f.state.doors = f.state.doors.filter((entry) => entry !== d); return () => { f.state.doors.push(d); }; } },
  { id: "tip.waiting.build", setup: (f) => () => { f.addRoom("room.waiting"); } },
  { id: "tip.waiting.overflow", setup: (f) => { f.addRoom("room.waiting"); return () => { f.encounter.waitingDestination!.kind = "chair"; }; } },
  { id: "tip.amenities.bathroom", setup: (f) => () => { f.addRoom("room.bathroom"); } },
  { id: "tip.water.manual", setup: (f) => { f.state.environment.waterCoolerFillPercent = 0; f.state.environment.waterCoolerEmptySinceTick = 0; return () => { f.employee(); }; } },
  { id: "tip.evs.coverage", setup: (f) => { addLitter(f.state); return () => { f.roomAndStaff("room.evs_closet", "staff.evs_worker"); }; } },
  { id: "tip.litter.manual", setup: (f) => { addLitter(f.state); return () => { f.state.environment.founderActivity = { kind: "collect_litter", targetId: "tip.litter", lastMovedAtFacilityTick: 0, path: [], pathIndex: 0, workMinutesRemaining: 2 }; }; } },
  { id: "tip.evs.training", setup: (f) => { f.roomAndStaff("room.evs_closet", "staff.evs_worker"); f.addRoom("room.training"); f.state.rooms[0]!.cleanliness = 50; return () => { f.state.employees[0]!.trainingLevel = 5; }; } },
  { id: "tip.evs.room-upgrade", setup: (f) => { const r = f.roomAndStaff("room.evs_closet", "staff.evs_worker"); f.state.rooms[0]!.cleanliness = 50; return () => { r.room.upgradeLevel = 5; }; } },
  { id: "tip.examination.capacity", setup: (f) => { const cap = getWorkloadSnapshot(f.state, f.context).routineLimit; for (let i = 1; i < cap; i++) { const e = structuredClone(f.encounter); e.id = `waiting.${i}`; f.state.encounters[e.id] = e; } return () => { f.encounter.resolutionReason = "completed"; f.encounter.lifecycle = "resolved"; }; } },
  { id: "tip.comfort.room-upgrade", setup: (f) => { f.encounter.assignedRoomInstanceId = "room.fixture.examination"; f.encounter.patientSatisfaction = 80; return () => { f.encounter.patientSatisfaction = 100; }; } },
  { id: "tip.imaging.coverage", setup: (f) => { const d = f.diagnostic("acquisition", "room.xray", ["staff.imaging_technician"]); return () => { d.phase.status = "completed"; }; } },
  { id: "tip.imaging.training", setup: (f) => { f.roomAndStaff("room.xray", "staff.imaging_technician"); f.addRoom("room.training"); const d = f.diagnostic("acquisition", "room.xray", ["staff.imaging_technician"]); return () => { d.phase.mode = "external"; }; } },
  { id: "tip.reading.build", setup: (f) => { f.diagnostic("interpretation", "room.reading", ["staff.radiologist"], "external"); return () => { f.addRoom("room.reading"); }; } },
  { id: "tip.reading.capacity", setup: (f) => { f.roomAndStaff("room.reading", "staff.radiologist"); const d = f.diagnostic("interpretation", "room.reading", ["staff.radiologist"]); return () => { d.phase.forecast.queueMinutes = 0; }; } },
  { id: "tip.reading.training", setup: (f) => { f.roomAndStaff("room.reading", "staff.radiologist"); f.addRoom("room.training"); const d = f.diagnostic("interpretation", "room.reading", ["staff.radiologist"]); return () => { d.phase.mode = "external"; }; } },
  { id: "tip.reading.room-upgrade", setup: (f) => { const r = f.roomAndStaff("room.reading", "staff.radiologist"); f.diagnostic("interpretation", "room.reading", ["staff.radiologist"]); return () => { r.room.upgradeLevel = 5; }; } },
  { id: "tip.labs.coverage", setup: (f) => { const d = f.diagnostic("collection", "room.phlebotomy", ["staff.phlebotomist"]); return () => { d.phase.status = "completed"; }; } },
  { id: "tip.labs.training", setup: (f) => { f.roomAndStaff("room.laboratory", "staff.laboratory_technician"); f.addRoom("room.training"); const d = f.diagnostic("laboratory_processing", "room.laboratory", ["staff.laboratory_technician"]); return () => { d.phase.mode = "external"; }; } },
  { id: "tip.endoscopy.setup", setup: (f) => { f.addRoom("room.endoscopy"); f.service("room.endoscopy", ["staff.endoscopy_nurse"]); return () => { f.addRoom("room.periop_recovery", "staff.periop_nurse"); f.employee("staff.endoscopy_nurse", "room.fixture.endoscopy"); }; } },
  { id: "tip.endoscopy.provider", setup: (f) => { f.roomAndStaff("room.endoscopy", "staff.endoscopy_nurse"); f.roomAndStaff("room.periop_recovery", "staff.periop_nurse"); const active = f.service("room.endoscopy", ["staff.endoscopy_nurse"], "in_service", "founder.service"); active.providerReservation = { kind: "founder" }; f.service("room.endoscopy", ["staff.endoscopy_nurse"]); return () => { f.employee("staff.endoscopist", "room.fixture.endoscopy"); }; } },
  { id: "tip.periop.capacity", setup: (f) => { const r = f.roomAndStaff("room.periop_recovery", "staff.periop_nurse"); const busy = f.service("room.periop_recovery", ["staff.periop_nurse"], "in_service", "busy.nurse"); busy.reservedEmployeeIds = [r.staff[0]!.id]; const queued = f.service("room.periop_recovery", ["staff.periop_nurse"]); queued.location = r.anchor; return () => { busy.reservedEmployeeIds = []; }; } },
  { id: "tip.surgery.setup", setup: (f) => { f.addRoom("room.ambulatory_or"); return () => { f.roomAndStaff("room.periop_recovery", "staff.periop_nurse"); f.employee("staff.or_nurse", "room.fixture.ambulatory_or"); }; } },
  { id: "tip.maintenance.coverage", setup: (f) => { const r = f.addRoom("room.pharmacy"); r.room.maintenance = { status: "due", completedUses: 8, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: null, appliedUseKeys: [] }; return () => { f.roomAndStaff("room.maintenance_workshop", "staff.repair_person"); }; } },
  { id: "tip.maintenance.training", setup: (f) => { f.roomAndStaff("room.maintenance_workshop", "staff.repair_person"); f.addRoom("room.training"); const r = f.addRoom("room.pharmacy"); r.room.maintenance = { status: "due", completedUses: 8, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: null, appliedUseKeys: [] }; return () => { r.room.maintenance!.status = "operational"; }; } },
  { id: "tip.staff.break-room", setup: (f) => { f.employee().morale = 60; return () => { f.addRoom("room.staff_break"); }; } },
  { id: "tip.staff.coffee", setup: (f) => { f.employee().morale = 60; return () => { f.addRoom("room.coffee_kiosk"); }; } },
  { id: "tip.room.other-upgrade", setup: (f) => { const r = f.addRoom("room.bathroom"); r.room.cleanliness = 50; return () => { r.room.cleanliness = 100; }; } },
  { id: "tip.advertising.increase", setup: (f) => { f.state.facilityLevel = 1; f.encounter.resolutionReason = "completed"; f.state.alertHumor.lastPatientArrivalTick = 0; return () => { f.state.advertisingLevel = 1; }; } },
  { id: "tip.advertising.reduce", setup: (f) => { f.state.advertisingLevel = 1; f.state.cash = 1; f.state.cashCents = 100; return () => { f.state.advertisingLevel = 0; }; } },
  { id: "tip.cash.manual-consult", setup: (f) => { f.state.cash = 60; f.state.cashCents = 6000; return () => { f.state.cash = 5000; f.state.cashCents = 500000; }; } },
  { id: "tip.progression.next-step", setup: (f) => { f.state.facilityLevel = 0; f.state.clinicalXp = 0; return () => { f.state.encounters[TUTORIAL_ENCOUNTER_ID]!.resolutionReason = null; }; } },
  { id: "tip.learning.team-discussion", setup: (f) => { const d = f.discussion(f.employee()); return () => { d.lifecycle = "resolved"; }; } },
  { id: "tip.services.appointments", setup: (f) => { f.roomAndStaff("room.endoscopy", "staff.endoscopy_nurse"); f.roomAndStaff("room.periop_recovery", "staff.periop_nurse"); f.state.serviceAppointmentsEnabled = false; return () => { f.state.serviceAppointmentsEnabled = true; }; } },
];

describe("all forty approved guidance predicates", () => {
  it("covers every stable catalog ID once", () => { expect(scenarios.map((scenario) => scenario.id)).toEqual(GUIDANCE_TIP_CATALOG.map((tip) => tip.id)); });
  it.each(scenarios)("$id requires its actual trigger and loses eligibility on resolution/suppression", ({ id, setup }) => {
    const f = tipsFixture(); const suppress = setup(f);
    const candidate = evaluateGuidanceTipCandidates(f.state, f.context).find((tip) => tip.id === id);
    expect(candidate, id).toBeDefined(); expect(candidate!.actionLabel).not.toContain("undefined");
    suppress(); expect(evaluateGuidanceTipCandidates(f.state, f.context).some((tip) => tip.id === id)).toBe(false);
  });
  it("requires continuous diagnostic dependencies and useful local work for training", () => {
    const f = tipsFixture(); f.roomAndStaff("room.xray", "staff.imaging_technician"); f.addRoom("room.training");
    const { phase } = f.diagnostic("acquisition", "room.xray", ["staff.imaging_technician"]); phase.dependsOn = ["unfinished"];
    expect(evaluateGuidanceTipCandidates(f.state, f.context).some((tip) => tip.id === "tip.imaging.training")).toBe(false);
    phase.dependsOn = []; phase.forecast.queueMinutes = 0;
    expect(evaluateGuidanceTipCandidates(f.state, f.context).some((tip) => tip.id === "tip.imaging.training")).toBe(false);
  });
  it("keeps the sole employee holding present patient care and treats installed busy coverage as coverage", () => {
    const f = tipsFixture(); const staffed = f.roomAndStaff("room.endoscopy", "staff.endoscopy_nurse");
    f.roomAndStaff("room.periop_recovery", "staff.periop_nurse"); f.addRoom("room.training");
    const active = f.service("room.endoscopy", ["staff.endoscopy_nurse"], "in_service");
    active.actorKind = "encounter"; active.actorId = f.encounter.id;
    active.reservedEmployeeIds = [staffed.staff[0]!.id];
    const rows = () => evaluateGuidanceTipCandidates(f.state, f.context);
    expect(rows().some((tip) => tip.id === "tip.training.role" && tip.targetKey === staffed.staff[0]!.id)).toBe(false);
    expect(rows().some((tip) => tip.id === "tip.endoscopy.setup")).toBe(false);
    active.actorKind = "remote";
    expect(rows().some((tip) => tip.id === "tip.training.role" && tip.targetKey === staffed.staff[0]!.id)).toBe(true);
  });
  it("suppresses paid training, a new welfare fix and spending that consumes the cash buffer", () => {
    const f = tipsFixture(); const e = f.employee(); f.addRoom("room.training"); e.morale = 30;
    requestEmployeeTraining(f.state, e.id, f.context);
    expect(evaluateGuidanceTipCandidates(f.state, f.context).some((tip) => tip.id === "tip.training.role")).toBe(false);
    e.lastPraisedAtFacilityTick = f.state.facilityTick;
    expect(evaluateGuidanceTipCandidates(f.state, f.context).some((tip) => tip.id === "tip.staff.salary")).toBe(false);
    const cost = getRoomDefinition("room.coffee_kiosk", f.context)!.constructionCost;
    f.state.cash = cost + f.context.balanceRelease.emergencyGlp1.lowCashAlertThreshold - 1; f.state.cashCents = Math.round(f.state.cash * 100);
    e.lastPraisedAtFacilityTick = null;
    expect(evaluateGuidanceTipCandidates(f.state, f.context).some((tip) => tip.id === "tip.staff.coffee")).toBe(false);
  });
  it("uses runtime prices and consult payment instead of embedding balance amounts in copy", () => {
    const f = tipsFixture(); f.state.cash = 60; f.state.cashCents = 6000;
    f.context.balanceRelease.emergencyGlp1.payment = 73;
    const tip = evaluateGuidanceTipCandidates(f.state, f.context).find((tip) => tip.id === "tip.cash.manual-consult")!;
    expect(tip.values.payment).toBe("$73.00"); expect(tip.actionLabel).toContain("$73.00");
    expect(GUIDANCE_TIP_POLICY.intervalMinutes).toBe(180);
  });
  it("selects one named access tip instead of telling the player to hire into an inaccessible setup", () => {
    const f = tipsFixture(); const room = f.addRoom("room.glp1_telehealth_suite").room;
    f.state.doors = f.state.doors.filter((door) => door.roomId !== room.id);
    const rows = evaluateGuidanceTipCandidates(f.state, f.context);
    expect(rows.some((tip) => tip.id === "tip.telehealth.automation")).toBe(false);
    expect(rows.filter((tip) => tip.id === "tip.access.restore" && tip.targetKey === room.id)).toHaveLength(1);
    expect(rows.find((tip) => tip.id === "tip.access.restore")?.values.room).toContain("Telehealth");
  });
  it("offers Examination Room capacity beyond the first room and respects the real room cap", () => {
    const f = tipsFixture(); const second = f.addRoom("room.examination").room;
    second.id = "second.exam";
    f.state.doors.at(-1)!.roomId = second.id; f.state.doors.at(-1)!.id = "second.exam.door";
    for (let index = 0; index < 12; index++) f.state.encounters[`waiting.${index}`] = { ...structuredClone(f.encounter), id: `waiting.${index}` };
    expect(evaluateGuidanceTipCandidates(f.state, f.context).some((tip) => tip.id === "tip.examination.capacity")).toBe(true);
    // The predicate reads the pinned balance cap rather than assuming twenty.
    getRoomDefinition("room.examination", f.context)!.maximumInstances = 2;
    expect(evaluateGuidanceTipCandidates(f.state, f.context).some((tip) => tip.id === "tip.examination.capacity")).toBe(false);
  });
  it("requires useful future training for a Training Room upgrade and preserves the spending buffer", () => {
    const f = tipsFixture(); const employee = f.employee(); const room = f.addRoom("room.training").room;
    const row = () => evaluateGuidanceTipCandidates(f.state, f.context).find((tip) => tip.id === "tip.room.other-upgrade" && tip.targetKey === room.id);
    expect(row()?.values.benefit).toContain("newly accepted training sessions");
    requestEmployeeTraining(f.state, employee.id, f.context); expect(row()).toBeUndefined();
    const other = tipsFixture(); other.employee();
    const cost = getRoomDefinition("room.training", other.context)!.constructionCost;
    other.state.cash = cost + other.context.balanceRelease.emergencyGlp1.lowCashAlertThreshold - 1;
    other.state.cashCents = Math.round(other.state.cash * 100);
    expect(evaluateGuidanceTipCandidates(other.state, other.context).some((tip) => tip.id === "tip.training.build")).toBe(false);
  });
  it("does not nag for another team discussion just after an answer receipt", () => {
    const f = tipsFixture(); const employee = f.employee(); f.discussion(employee);
    f.state.events.push({ id: "discussion.answered", type: "employee_discussion_decision", facilityTick: f.state.facilityTick - 1,
      encounterId: null, target: { kind: "employee", id: employee.id }, message: "Existing answer receipt." });
    expect(evaluateGuidanceTipCandidates(f.state, f.context).some((tip) => tip.id === "tip.learning.team-discussion")).toBe(false);
  });
  it("puts a real accepted surgery setup blocker ahead of long-unmet goal advice", () => {
    const f = tipsFixture();
    const candidate = () => evaluateGuidanceTipCandidates(f.state, f.context).find((tip) => tip.id === "tip.surgery.setup");
    expect(candidate()?.priority).toBe(2);
    f.service("room.ambulatory_or", ["staff.or_nurse"]);
    expect(candidate()?.priority).toBe(0);
  });
});
