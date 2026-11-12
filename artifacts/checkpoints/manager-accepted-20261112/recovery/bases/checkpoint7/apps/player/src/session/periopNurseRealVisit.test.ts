import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getCurrentPeriopNurseAttention, getPeriopNurseAttentionQueue, getPeriopNurseStandingPoints,
  PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { periopRealVisitFixture } from "../../../../packages/game-domain/tests/periop-nurse-real-visit-fixture";
import { periopNurses } from "../../../../packages/game-domain/tests/periop-nurse-flow-fixture";
import { getApprovedRoomOrientation } from "../facility/approvedRoomPresentation";
import { resolveStaffIdleSupports } from "../facility/staffIdleSupports";
import { describeFacilityCharacter } from "./characterActivityPresentation";
import { createPrototypePlayerView } from "./viewModels";

describe("Peri-op nurse presentation through ordinary chart commands", () => {
  it("shows walking, named checks, short walks, seats and automatic coffee-kiosk trips in the approved Level-2 room", () => {
    const clinic = periopRealVisitFixture();
    const trace: Array<{ tick: number; patient: string; nurses: Array<{ id: string; activity: string; location: unknown; moving: boolean }> }> = [];
    const labels = new Set<string>();
    const checked = new Set<string>();
    const visitedSeats = new Set<string>();
    const kioskWalkers = new Set<string>();
    let last = "";
    let exported = false;
    const observe = () => {
      const state = clinic.state;
      const nurses = periopNurses(state);
      const activity = nurses.map((nurse) => describeFacilityCharacter(state, { kind: "staff", id: nurse.id })!.activity);
      activity.forEach((label) => labels.add(label));
      const patient = state.encounters[clinic.patientIds[0]!]!;
      const operation = state.serviceOperations.find((entry) => entry.actorId === patient.id);
      const signature = `${operation?.status}:${operation?.phaseIndex}:${activity.join(";")}`;
      const view = createPrototypePlayerView(state, null, false, null);
      expect(view.serviceIncome.periopNurseQueueLength).toBe(getPeriopNurseAttentionQueue(state).length);
      for (const [index, nurse] of nurses.entries()) {
        const rendered = view.facility.staff.find((entry) => entry.instanceId === nurse.id)!;
        const home = state.rooms.find((room) => room.id === nurse.homeRoomInstanceId)!;
        const room = view.facility.rooms.find((entry) => entry.instanceId === home.id)!;
        expect([room.width, room.height]).toEqual(getApprovedRoomOrientation(home.roomDefinitionId, home.orientation)!.footprint);
        const task = operation && getCurrentPeriopNurseAttention(operation);
        if (task?.employeeId === nurse.id) {
          const moving = nurse.pathIndex < nurse.path.length - 1;
          expect(rendered.location).toEqual(nurse.location);
          expect(rendered.moving).toBe(moving);
          expect(rendered.supportRole).toBeUndefined();
          expect(activity[index]).toBe(`${moving ? `Walking to ${task.kind === "pre_op" ? "pre-op" : "post-op"} check` : `${task.kind === "pre_op" ? "Pre-op" : "Post-op"} check`} · Maya Reed`);
          if (!moving) {
            checked.add(task.kind);
            expect(getPeriopNurseStandingPoints(state, operation!, PROTOTYPE_DOMAIN_CONTEXT)).toContainEqual(rendered.location);
          }
          if (!exported && process.env.PERIOP_SECOND_QA_EXPORT === "1") {
            const disposable = structuredClone(state);
            disposable.paused = true;
            writeFileSync(resolve(process.cwd(), "../../.local-dev/periop-second-fix/qa-real-visit-save.json"), serializeGameState(disposable), "utf8");
            exported = true;
          }
        }
        if (activity[index] === "Sitting between patient checks") {
          expect(rendered.supportRole).toBe("staff-idle");
          expect(resolveStaffIdleSupports(home.roomDefinitionId, home.orientation).find((support) => support.id === rendered.supportId)?.pose).toBe("seated");
          visitedSeats.add(nurse.id);
        }
        if (rendered.moving && ["Going to get coffee", "Walking to the coffee kiosk", "Walking back from the coffee kiosk"].includes(activity[index]!)) kioskWalkers.add(nurse.id);
      }
      if (signature !== last) {
        trace.push({ tick: state.facilityTick, patient: `${patient.checkInStatus} · ${patient.lifecycle} · ${operation?.status ?? "not ordered"} · ${operation?.phaseIndex ?? "-"}`,
          nurses: nurses.map((nurse, index) => {
            const rendered = view.facility.staff.find((entry) => entry.instanceId === nurse.id)!;
            return { id: nurse.id, activity: activity[index]!, location: rendered.location, moving: rendered.moving === true };
          }) });
        last = signature;
      }
    };
    for (let minute = 0; minute < 360; minute++) {
      clinic.advance(); observe();
      if (clinic.state.encounters[clinic.patientIds[0]!]!.lifecycle === "resolved") break;
    }
    expect(checked.size).toBe(2);
    expect(clinic.state.encounters[clinic.patientIds[0]!]!.lifecycle).toBe("resolved");
    // Restore ordinary optional-shopping scheduling for this quiet period.
    // The real retail engine, rather than a hand-created task, sends nurses.
    for (const nurse of periopNurses(clinic.state)) delete clinic.state.retailNextOpportunityTicks[`employee:${nurse.id}`];
    for (let minute = 0; minute < 120; minute++) { clinic.advance(); observe(); }
    expect(visitedSeats.size).toBe(2);
    expect(kioskWalkers.size).toBe(2);
    for (const kind of ["Pre-op", "Post-op"]) {
      expect(labels).toContain(`Walking to ${kind.toLowerCase()} check · Maya Reed`);
      expect(labels).toContain(`${kind} check · Maya Reed`);
    }
    expect(labels).toContain("Taking a short walk");
    expect(labels).toContain("Going to get coffee");
    expect(labels).toContain("Getting coffee");
    expect(labels).toContain("Walking back from the coffee kiosk");
    const trips = clinic.state.retailOperations.filter((trip) => trip.actorKind === "employee" && trip.outletRoomInstanceId === "qa.coffee" && trip.status === "completed");
    if (process.env.PERIOP_SECOND_QA_EXPORT === "1") writeFileSync(resolve(process.cwd(), "../../.local-dev/periop-second-fix/real-visit-activity.json"), JSON.stringify(trace, null, 2), "utf8");
    expect(new Set(trips.map((trip) => trip.actorId)).size, JSON.stringify(clinic.state.retailOperations)).toBe(2);
  }, 30000);
});
