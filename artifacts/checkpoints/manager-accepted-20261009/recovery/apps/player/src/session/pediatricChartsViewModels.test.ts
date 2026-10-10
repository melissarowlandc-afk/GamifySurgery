import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PEDIATRIC_CLINIC_CASES, PEDIATRIC_CLINIC_FAMILY_CONTEXTS } from "@gamify-surgery/clinical-content";
import { gameReducer, getAnswerChoiceServicePreview, pediatricFamilyForActor, pediatricPairAtReservation,
  PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext } from "../../../../tests/fixtures/level-four-rooms";
import { createPediatricChartsQaState, PEDIATRIC_CHARTS_QA_ENCOUNTER_ID as encounterId } from "../../../../tests/fixtures/pediatric-charts";
import { createPrototypePlayerView } from "./viewModels";

const context = createLevelFourRoomsQaContext();
const originalBalance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease; });
afterAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = originalBalance; });

describe("M7 scored pediatric chart presentation", () => {
  it.each(PEDIATRIC_CLINIC_CASES.map(clinicalCase => [clinicalCase.id, clinicalCase] as const))
    ("projects the exact named family, age/sex, prose and no-test choices for %s", (_id, clinicalCase) => {
      const state = createPediatricChartsQaState(context, clinicalCase.id);
      const child = state.encounters[encounterId]!;
      const family = PEDIATRIC_CLINIC_FAMILY_CONTEXTS.find(row => row.caseId === clinicalCase.id)!;
      // Display-only snapshot; real movement/attendance is exercised below and
      // by the M7 domain lifecycle tests, without changing authored content.
      child.checkInStatus = "checked_in"; child.patientMovement = null;
      child.lifecycle = "active_action_required"; state.openChartEncounterId = encounterId;
      const chart = createPrototypePlayerView(state, encounterId, false, null).chart!;
      expect(chart).toMatchObject({ patientName: family.childName, ageLabel: `${family.prototypeDemographics.ageYears} years`,
        sexLabel: family.prototypeDemographics.sexLabel, presentation: clinicalCase.presentation,
        chiefComplaint: clinicalCase.chiefComplaint });
      expect(chart.vitals).toBeUndefined();
      expect(chart.decisionSteps![0]!.questionPrompt).toBe(clinicalCase.decisionNodes[0]!.stem);
      expect(chart.answerChoices.map(choice => choice.label)).toEqual(child.frozenCase.decisionNodes[0]!.answerChoices.map(choice => choice.label));
      for (const choice of chart.answerChoices) expect(getAnswerChoiceServicePreview(state, encounterId, choice.id)).toBeNull();
    });

  it("renders the real scored child and parent at M5's exam supports with their frozen identities", () => {
    let state = createPediatricChartsQaState(context);
    let opened = false;
    for (let i = 0; i < 180; i++) {
      state = gameReducer({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `m7.view.tick.${i}` }, context);
      if (!opened && state.encounters[encounterId]!.checkInStatus === "checked_in" && !state.encounters[encounterId]!.patientMovement) {
        state = gameReducer(state, { type: "OPEN_CHART", operationId: "m7.view.open", encounterId }, context);
        expect(state.operationReceipts["m7.view.open"]?.status).toBe("applied"); opened = true;
      }
      const family = pediatricFamilyForActor(state, "encounter", encounterId)!;
      if (!opened || family.reservation?.roomInstanceId !== "room.peds.exam" || !pediatricPairAtReservation(state, family)) continue;
      const view = createPrototypePlayerView(state, encounterId, false, null);
      expect(view.facility.patients?.find(child => child.instanceId === encounterId)).toMatchObject({
        supportRole: "pediatric-examination-patient", supportId: "table:patient", supportRoomInstanceId: "room.peds.exam",
        appearance: { stillId: "level3-roster-v2.022" } });
      expect(view.facility.retailExternalActors?.find(parent => parent.instanceId === family.parentActorId)).toMatchObject({
        supportRole: "pediatric-parent-seat", supportId: "parentChair", supportRoomInstanceId: "room.peds.exam" });
      expect(view.chart).toMatchObject({ patientName: "Noah Bennett", ageLabel: "5 years", sexLabel: "Male" });
      expect(view.chart!.presentation).toContain("Daniel Bennett");
      return;
    }
    throw new Error("Scored pediatric chart did not reach the paired exam supports.");
  });
});
