import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { advanceEmployeeMovement, advanceServiceOperations, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createPediatricAppointmentsQaState } from "../../../../tests/fixtures/pediatric-appointments";
import { createLevelFourRoomsQaContext } from "../../../../tests/fixtures/level-four-rooms";
import { createPrototypePlayerView } from "./viewModels";
import { describeFacilityCharacter } from "./characterActivityPresentation";

const context = createLevelFourRoomsQaContext();
const originalBalance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease; });
afterAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = originalBalance; });
describe("pediatric appointment presentation", () => {
  it("shows staffed demand, exact child/parent/provider supports and named age/sex activity", () => {
    const state = createPediatricAppointmentsQaState(context);
    let waitingSeen = false;
    for (let i = 0; i < 180; i++) {
      state.facilityTick++; advanceEmployeeMovement(state, context); advanceServiceOperations(state, context);
      const view = createPrototypePlayerView(state, null, false, null);
      const child = view.facility.serviceVisitors?.[0];
      const parent = view.facility.retailExternalActors?.[0];
      if (child?.supportRole === "pediatric-waiting-seat") {
        waitingSeen = true;
        expect(parent?.supportRole).toBe("pediatric-waiting-seat");
        expect(parent?.supportRoomInstanceId).toBe(child.supportRoomInstanceId);
        expect(parent?.supportId?.startsWith("kid")).toBe(false);
      }
      if (state.serviceOperations[0]?.status !== "in_service") continue;
      expect(waitingSeen).toBe(true);
      const visit = state.serviceOperations[0]!;
      expect(child).toMatchObject({ supportRole: "pediatric-examination-patient", supportId: "table:patient", supportRoomInstanceId: "room.peds.exam.0" });
      expect(parent).toMatchObject({ supportRole: "pediatric-parent-seat", supportId: "parentChair", supportRoomInstanceId: "room.peds.exam.0" });
      expect(view.facility.staff.find(row => row.instanceId === "app.peds.0")).toMatchObject({
        supportRole: "pediatric-examination-clinician", supportId: "stool:clinician", supportRoomInstanceId: "room.peds.exam.0" });
      const line = view.serviceIncome.catalogLines.find(row => row.id === "income.pediatric_consult")!;
      expect(line.available).toBe(true); expect(line.arrivalLabel).toContain("90 min"); expect(line.arrivalLabel).toContain("unscored");
      expect(view.serviceIncome.activeOperations[0]?.actorLabel).toContain("With parent");
      expect(describeFacilityCharacter(state, { kind: "service-visitor", id: visit.actorId })?.name).toContain(`${visit.clinicVisit!.demographics.ageYears}-year-old`);
      expect(describeFacilityCharacter(state, { kind: "companion", id: parent!.instanceId })?.name).toContain(`Parent of ${visit.displayName}`);
      expect(view.facility.patients).toHaveLength(0);
      return;
    }
    throw new Error("Pediatric QA visit did not reach care.");
  });
});
