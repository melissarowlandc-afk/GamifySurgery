import { describe, expect, it } from "vitest";
import { commitPediatricPairPlan, planPediatricWaiting, planPediatricExam } from "@gamify-surgery/game-domain";
import { createPediatricFamilyFixture } from "../../../../tests/fixtures/pediatric-families";
import { pediatricActorSupport } from "./pediatricFamilyPresentation";

describe("pediatric family supports", () => {
  it.each([9, 10])("binds age %i and an adult parent to their exact waiting seats", age => {
    const { state, context, family, encounter } = createPediatricFamilyFixture(age);
    const plan = planPediatricWaiting(state, context, family)!;
    commitPediatricPairPlan(family, plan);
    expect(pediatricActorSupport(state, "encounter", encounter.id, plan.reservation!.childLocation, false)).toMatchObject({
      supportRole: "pediatric-waiting-seat", supportId: plan.reservation!.childSeatId, seated: true });
    expect(pediatricActorSupport(state, "companion", family.parentActorId, plan.reservation!.parentLocation, false)).toMatchObject({
      supportRole: "pediatric-waiting-seat", supportId: plan.reservation!.parentSeatId, seated: true });
    expect(pediatricActorSupport(state, "companion", family.parentActorId, plan.reservation!.parentLocation, true)).toEqual({});
  });
  it("binds the child table and parent chair without borrowing a provider or patient slot", () => {
    const { state, context, family, encounter } = createPediatricFamilyFixture();
    const plan = planPediatricExam(state, context, family, state.rooms.find(room => room.id === "room.peds.exam")!)!;
    commitPediatricPairPlan(family, plan);
    expect(pediatricActorSupport(state, "encounter", encounter.id, plan.reservation!.childLocation, false)).toMatchObject({ supportRole: "pediatric-examination-patient", supportId: "table:patient" });
    expect(pediatricActorSupport(state, "companion", family.parentActorId, plan.reservation!.parentLocation, false)).toMatchObject({ supportRole: "pediatric-parent-seat", supportId: "parentChair" });
    expect(pediatricActorSupport(state, "service_visitor", "ordinary-adult", plan.reservation!.childLocation, false)).toEqual({});
  });
});
