import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getCurrentPeriopNurseAttention, getPeriopNurseAttentionQueue, getPeriopNurseStandingPoints,
  PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { periopFlowFixture, periopNurses } from "../../../../packages/game-domain/tests/periop-nurse-flow-fixture";
import { getApprovedRoomOrientation } from "../facility/approvedRoomPresentation";
import { resolveStaffIdleSupports } from "../facility/staffIdleSupports";
import { describeFacilityCharacter } from "./characterActivityPresentation";
import { createPrototypePlayerView } from "./viewModels";

/** Compile the real domain flow into the real player projection, using legal
 * shipped rooms/doors, normal hiring and patient travel (no unit teleport).
 */
describe("Owner peri-op feedback in an approved Level-2/3 clinic", () => {
  it.each([[2, 2], [3, 3]] as const)("shows all %i nurses walking/checking/resting in the compiled Level-%i view", (count, level) => {
    const clinic = periopFlowFixture(count, level, { surgery: level === 3 });
    const ids = clinic.admit(4, level === 3 ? ["income.endoscopy", "income.ambulatory_operation"] : ["income.endoscopy"]);
    const witnessed = new Set<string>();
    const working = new Set<string>();
    const walked = new Set<string>();
    const checked = new Set<string>();
    const trace: unknown[] = [];
    let exported = false;
    for (let minute = 0; minute < 520; minute++) {
      const state = clinic.advance();
      const signature = periopNurses(state).map((employee) => {
        const operation = state.serviceOperations.find((entry) => entry.id === employee.facilityTask?.targetId);
        return `${employee.id}:${operation?.id}:${operation && getCurrentPeriopNurseAttention(operation)?.kind}:${employee.pathIndex < employee.path.length - 1}`;
      }).join(";");
      if (!witnessed.has(signature) && periopNurses(state).some((employee) => employee.facilityTask?.kind === "periop_attention")) {
        witnessed.add(signature);
        const view = createPrototypePlayerView(state, null, false, null);
        expect(view.serviceIncome.periopNurseQueueLength).toBe(getPeriopNurseAttentionQueue(state).length);
        for (const employee of periopNurses(state)) {
          if (employee.facilityTask?.kind !== "periop_attention") continue;
          const operation = state.serviceOperations.find((entry) => entry.id === employee.facilityTask?.targetId)!;
          const task = getCurrentPeriopNurseAttention(operation)!;
          const rendered = view.facility.staff.find((entry) => entry.instanceId === employee.id)!;
          const activity = describeFacilityCharacter(state, { kind: "staff", id: employee.id })!.activity;
          const label = task.kind === "pre_op" ? "Pre-op check" : "Post-op check";
          const moving = employee.pathIndex < employee.path.length - 1;
          expect(rendered.location).toEqual(employee.location);
          expect(rendered.moving).toBe(moving);
          expect(rendered.supportRole).toBeUndefined(); // Real standing position, no chair anchoring.
          expect(activity).toBe(`${moving ? `Walking to ${label.toLowerCase()}` : label} · ${operation.displayName}`);
          working.add(employee.id);
          if (moving) walked.add(employee.id);
          else {
            checked.add(`${operation.id}:${task.kind}`);
            expect(getPeriopNurseStandingPoints(state, operation, PROTOTYPE_DOMAIN_CONTEXT)).toContainEqual(rendered.location);
          }
          trace.push({ tick: state.facilityTick, employeeId: employee.id, patient: operation.displayName, kind: task.kind, location: rendered.location, moving, activity });
        }
        if (!exported && periopNurses(state).filter((employee) => employee.facilityTask?.kind === "periop_attention").length === count && process.env.PERIOP_OWNER_QA_EXPORT === "1") {
          const disposable = structuredClone(state);
          disposable.paused = true;
          writeFileSync(resolve(process.cwd(), `../../.local-dev/periop-owner-feedback/qa-level-${level}-save.json`), serializeGameState(disposable), "utf8");
          exported = true;
        }
      }
      if (ids.every((id) => state.serviceOperations.find((operation) => operation.id === id)?.status === "completed")) break;
    }
    expect(working.size).toBe(count);
    expect(walked.size).toBe(count);
    expect(checked.size).toBe(8);
    expect(clinic.state.serviceOperations.every((operation) => operation.status === "completed")).toBe(true);
    const seats = new Set<string>();
    const seatedNurses = new Set<string>();
    for (let minute = 0; minute < 30 && seatedNurses.size < count; minute++) {
      const state = clinic.advance();
      const view = createPrototypePlayerView(state, null, false, null);
      for (const employee of periopNurses(state)) {
        if (describeFacilityCharacter(state, { kind: "staff", id: employee.id })!.activity !== "Sitting between patient checks") continue;
        const rendered = view.facility.staff.find((entry) => entry.instanceId === employee.id)!;
        const home = state.rooms.find((room) => room.id === employee.homeRoomInstanceId)!;
        const room = view.facility.rooms.find((entry) => entry.instanceId === home.id)!;
        expect([room.width, room.height]).toEqual(getApprovedRoomOrientation(home.roomDefinitionId, home.orientation)!.footprint);
        expect(rendered.moving).toBe(false);
        expect(rendered.supportRole).toBe("staff-idle");
        expect(resolveStaffIdleSupports(home.roomDefinitionId, home.orientation).find((support) => support.id === rendered.supportId)?.pose).toBe("seated");
        seats.add(`${rendered.supportRoomInstanceId}:${rendered.supportId}`);
        seatedNurses.add(employee.id);
      }
    }
    expect(seatedNurses.size).toBe(count);
    expect(seats.size).toBeGreaterThanOrEqual(count);
    if (process.env.PERIOP_OWNER_QA_EXPORT === "1") writeFileSync(resolve(process.cwd(), `../../.local-dev/periop-owner-feedback/qa-level-${level}-trace.json`), JSON.stringify(trace, null, 2), "utf8");
  });

  it("calls out a missing operational assignment instead of describing a spare hire as ready", () => {
    const clinic = periopFlowFixture();
    const employee = periopNurses(clinic.state)[1]!;
    employee.homeRoomInstanceId = null;
    expect(describeFacilityCharacter(clinic.state, { kind: "staff", id: employee.id })!.activity).toBe("Needs an operational Peri-op room");
  });
});
