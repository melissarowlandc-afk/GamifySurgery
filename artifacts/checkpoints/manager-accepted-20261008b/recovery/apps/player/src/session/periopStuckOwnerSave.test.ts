import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getPeriopNurseAttentionQueue, serializeGameState } from "@gamify-surgery/game-domain";
import { stuckPeriopOwnerSaveFixture } from "../../../../packages/game-domain/tests/periop-stuck-owner-save-fixture";
import { describeFacilityCharacter } from "./characterActivityPresentation";
import { createPrototypePlayerView } from "./viewModels";

describe("Compiled Level-3 presentation of the supplied stranded save shapes", () => {
  it("renders the recovered walks, named checks, companion chair and departures, then idle nurses", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    const exporting = process.env.PERIOP_STUCK_SAVE_QA_EXPORT === "1";
    if (exporting) {
      const disposable = structuredClone(clinic.state); disposable.paused = true;
      writeFileSync(resolve(process.cwd(), "../../.local-dev/periop-stuck-flow/qa-stuck-save.json"), serializeGameState(disposable), "utf8");
    }
    clinic.reload();
    const trace: unknown[] = [];
    const labels = new Set<string>();
    let patientWalking = false;
    let companionSeated = false;
    let idleNurseSeated = false;
    let last = "";
    const observe = () => {
      const state = clinic.state;
      const view = createPrototypePlayerView(state, null, false, null);
      const activities = [clinic.rileyId, clinic.blakeId].map((id) => {
        const nurse = state.employees.find((employee) => employee.id === id)!;
        const activity = describeFacilityCharacter(state, { kind: "staff", id })!.activity;
        labels.add(activity);
        expect(activity).not.toBe("Covering Peri-op/Recovery");
        const rendered = view.facility.staff.find((employee) => employee.instanceId === id)!;
        expect(rendered.location).toEqual(nurse.location);
        idleNurseSeated ||= activity === "Sitting between patient checks" && rendered.supportRole === "staff-idle";
        return { name: nurse.displayName, activity, location: nurse.location, moving: rendered.moving };
      });
      const current = clinic.current();
      const patient = view.facility.patients?.find((patient) => patient.instanceId === current.actorId);
      if (current.pathIndex < current.path.length - 1 && current.status === "in_service") {
        expect(patient?.moving).toBe(true);
        expect(patient?.location).toEqual(current.location);
        expect(describeFacilityCharacter(state, { kind: "patient", id: current.actorId })!.activity).toBe("Walking to a peri-op bed");
        patientWalking = true;
      }
      const companion = view.facility.retailExternalActors?.find((actor) => actor.instanceId === "companion.59");
      if (clinic.lane().procedureCompanion?.waitingReservation?.kind === "chair" && companion?.moving === false) {
        expect(companion.procedureCompanion?.waitingReservation?.location).toEqual(companion.location);
        companionSeated = true;
      }
      expect(view.serviceIncome.periopNurseQueueLength).toBe(getPeriopNurseAttentionQueue(state).length);
      const signature = JSON.stringify([activities, current.status, current.phaseIndex, current.location, clinic.legacy().status,
        clinic.legacy().phaseIndex, clinic.legacy().location, clinic.lane().lifecycle, clinic.lane().location]);
      if (signature !== last) {
        trace.push({ tick: state.facilityTick, activities,
          current: { status: current.status, phase: current.phaseIndex, location: current.location, tasks: current.periopNurseAttention?.tasks },
          maxwell: { status: clinic.legacy().status, phase: clinic.legacy().phaseIndex, location: clinic.legacy().location },
          lane: { lifecycle: clinic.lane().lifecycle, location: clinic.lane().location, flow: clinic.lane().procedureCompanion } });
        last = signature;
      }
    };
    observe();
    for (let minute = 0; minute < 350; minute++) {
      clinic.advance(); observe();
      if (clinic.current().status === "completed" && clinic.legacy().status === "completed" && clinic.lane().lifecycle === "departed") break;
    }
    clinic.advance(20); observe();
    expect(patientWalking).toBe(true); expect(companionSeated).toBe(true); expect(idleNurseSeated).toBe(true);
    expect([...labels].some((label) => label.includes("Pre-op check") && label.includes("Maya Reed"))).toBe(true);
    expect([...labels].some((label) => label.includes("Post-op check") && label.includes("Maya Reed"))).toBe(true);
    expect(clinic.current().status).toBe("completed"); expect(clinic.legacy().status).toBe("completed");
    expect(clinic.lane().lifecycle).toBe("departed");
    if (exporting) writeFileSync(resolve(process.cwd(), "../../.local-dev/periop-stuck-flow/qa-stuck-activity.json"), JSON.stringify(trace, null, 2) + "\n", "utf8");
  }, 30000);

  it("shows the watchdog reason for blocked companion exits and indefinite service queues", () => {
    const clinic = stuckPeriopOwnerSaveFixture();
    clinic.state.employees = clinic.state.employees.filter((employee) => employee.staffRoleDefinitionId !== "staff.endoscopy_nurse");
    clinic.reload(); clinic.advance(75);
    const view = createPrototypePlayerView(clinic.state, null, false, null);
    expect(view.serviceIncome.activeOperations.find((operation) => operation.id === clinic.legacy().id)?.statusLabel).toMatch(/waiting for/i);
    clinic.lane().movementWaitReason = "Waiting for a connected exit route";
    clinic.reload();
    expect(describeFacilityCharacter(clinic.state, { kind: "companion", id: "companion.59" })?.activity).toBe("Waiting for a connected exit route");
  }, 30000);
});
