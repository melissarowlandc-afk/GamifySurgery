import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getCurrentPeriopNurseAttention, getPeriopNurseAttentionQueue, serializeGameState } from "@gamify-surgery/game-domain";
import { ownerBlake, periopOwnerSaveFixture } from "../../../../packages/game-domain/tests/periop-nurse-owner-save-fixture";
import { describeFacilityCharacter } from "./characterActivityPresentation";
import { createPrototypePlayerView } from "./viewModels";

describe("Owner-save Blake after legacy coverage release", () => {
  it("shows paid training, walking to named checks, checking and sitting in the owner's Level-3 room geometry", () => {
    const clinic = periopOwnerSaveFixture();
    if (process.env.PERIOP_OWNER_SAVE_QA_EXPORT === "1") {
      const disposable = structuredClone(clinic.state);
      disposable.paused = true;
      writeFileSync(resolve(process.cwd(), "../../.local-dev/periop-legacy-release/owner-save-qa.json"), serializeGameState(disposable), "utf8");
    }
    clinic.reload();
    const labels = new Set<string>();
    const working = new Set<string>();
    let seated = false;
    const trace: unknown[] = [];
    let lastLabels = "";
    const observe = () => {
      const state = clinic.state;
      const employee = ownerBlake(state);
      const label = describeFacilityCharacter(state, { kind: "staff", id: employee.id })!.activity;
      labels.add(label);
      expect(label).not.toBe("Covering Peri-op/Recovery");
      const view = createPrototypePlayerView(state, null, false, null);
      const activities = [clinic.rileyId, clinic.blakeId].map((id) => ({
        id, name: state.employees.find((entry) => entry.id === id)!.displayName,
        activity: describeFacilityCharacter(state, { kind: "staff", id })!.activity,
      }));
      const signature = JSON.stringify(activities);
      if (signature !== lastLabels) {
        trace.push({ tick: state.facilityTick, activities, blakeTraining: employee.training, queue: getPeriopNurseAttentionQueue(state).length });
        lastLabels = signature;
      }
      expect(view.serviceIncome.periopNurseQueueLength).toBe(getPeriopNurseAttentionQueue(state).length);
      const periop = view.facility.rooms.find((room) => room.instanceId === "qa.periop.0")!;
      expect([periop.tileX, periop.tileY, periop.width, periop.height]).toEqual([23, 26, 6, 6]);
      for (const id of ["qa.endoscopy.0", "qa.endoscopy.1"]) {
        const room = view.facility.rooms.find((entry) => entry.instanceId === id)!;
        expect([room.width, room.height]).toEqual([3, 4]);
      }
      const rendered = view.facility.staff.find((entry) => entry.instanceId === employee.id)!;
      if (employee.facilityTask?.kind === "periop_attention") {
        const operation = state.serviceOperations.find((entry) => entry.id === employee.facilityTask!.targetId)!;
        const task = getCurrentPeriopNurseAttention(operation)!;
        const prefix = task.kind === "pre_op" ? "Pre-op" : "Post-op";
        const moving = employee.pathIndex < employee.path.length - 1;
        expect(label).toBe(`${moving ? `Walking to ${prefix.toLowerCase()} check` : `${prefix} check`} · ${operation.displayName}`);
        expect(rendered.location).toEqual(employee.location);
        expect(rendered.moving).toBe(moving);
        expect(rendered.supportRole).toBeUndefined();
        working.add(task.kind);
      }
      if (label === "Sitting between patient checks") {
        expect(rendered.supportRole).toBe("staff-idle");
        seated = true;
      }
    };
    for (let minute = 0; minute < 140; minute++) {
      clinic.advance(); observe();
      if (!ownerBlake(clinic.state).training) break;
    }
    const ids = clinic.admit();
    for (let minute = 0; minute < 430; minute++) {
      clinic.advance(); observe();
      if (ids.every((id) => clinic.state.serviceOperations.find((operation) => operation.id === id)?.status === "completed")) break;
    }
    for (let minute = 0; minute < 30; minute++) { clinic.advance(); observe(); }
    expect([...labels].some((label) => label.toLowerCase().includes("walking to training"))).toBe(true);
    expect([...labels].some((label) => label.toLowerCase().includes("training") && !label.toLowerCase().includes("walking"))).toBe(true);
    expect([...labels].some((label) => label.startsWith("Walking to pre-op check · "))).toBe(true);
    expect([...labels].some((label) => label.startsWith("Walking to post-op check · "))).toBe(true);
    expect(working).toEqual(new Set(["pre_op", "post_op"]));
    expect(seated).toBe(true);
    if (process.env.PERIOP_OWNER_SAVE_QA_EXPORT === "1") writeFileSync(resolve(process.cwd(), "../../.local-dev/periop-legacy-release/owner-save-activity.json"), JSON.stringify(trace, null, 2) + "\n", "utf8");
  }, 30000);
});
