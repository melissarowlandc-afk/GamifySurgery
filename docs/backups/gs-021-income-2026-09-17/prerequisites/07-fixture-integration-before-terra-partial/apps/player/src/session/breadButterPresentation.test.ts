import { describe, expect, it } from "vitest";
import {
  ANSWER_CHOICE_TIMING_REGISTRY,
  BREAD_BUTTER_20260917_CASES,
} from "@gamify-surgery/clinical-content";
import {
  createInitialGameState,
  gameReducer,
  patientRosterEntryById,
  patientVisualAgeBand,
} from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./viewModels";

function admit(caseId: string, index: number) {
  let state = createInitialGameState();
  state.facilityLevel = 2;
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push({ id: "room.presentation.minor", roomDefinitionId: "room.minor_procedure", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.presentation.minor", roomId: "room.presentation.minor", side: "south", offset: 2, exterior: false });

  const encounterId = `encounter.bread-butter.presentation.${index}`;
  state = gameReducer(state, {
    type: "ADMIT_PATIENT",
    operationId: `bread-butter.presentation.${index}.admit`,
    encounterId,
    caseId,
    patientDisplayName: `Bread Butter Patient ${index}`,
    arrivalClass: "routine",
  });
  const encounter = state.encounters[encounterId]!;
  encounter.lifecycle = "active_action_required";
  encounter.patientMovement = null;
  encounter.patientLocation = { ...state.environment.founderLocation };
  return { state, encounter, encounterId };
}

describe("September 17 bread-and-butter chart presentation", () => {
  it("renders every admitted profile coherently and displays every node choice wait", () => {
    for (const [caseIndex, clinicalCase] of BREAD_BUTTER_20260917_CASES.entries()) {
      const { state, encounter, encounterId } = admit(clinicalCase.id, caseIndex);
      const demographics = encounter.frozenCase.prototypeDemographics!;
      const sexWord = demographics.sexLabel === "Female" ? "woman" : "man";
      const rosterEntry = patientRosterEntryById(encounter.patientAppearance.patientIdentityId)!;

      expect(encounter.frozenCase.presentation)
        .toContain(`${demographics.ageYears}-year-old ${sexWord}`);
      expect(rosterEntry.compatibleSexLabel).toBe(demographics.sexLabel);
      expect(rosterEntry.ageBand).toBe(patientVisualAgeBand(demographics.ageYears));

      for (const [nodeIndex, node] of encounter.frozenCase.decisionNodes.entries()) {
        encounter.currentNodeIndex = nodeIndex;
        encounter.steps.forEach((step, index) => {
          step.status = index < nodeIndex
            ? "completed"
            : index === nodeIndex
              ? "action_required"
              : "locked";
        });
        const chart = createPrototypePlayerView(state, encounterId, false, null).chart!;
        const choices = chart.decisionSteps?.find((step) => step.current)?.answerChoices
          ?? chart.answerChoices;
        const timing = ANSWER_CHOICE_TIMING_REGISTRY.find(
          (entry) => entry.questionVariantId === node.questionVariantId,
        )!;

        expect(chart.presentation).toContain(`Bread Butter Patient ${caseIndex}`);
        expect(chart.presentation).not.toContain("{patientName}");
        expect(chart.presentation).toContain(`${demographics.ageYears}-year-old ${sexWord}`);
        expect(choices).toHaveLength(4);
        expect(choices.map((choice) => choice.id).sort())
          .toEqual(node.answerChoices.map((choice) => choice.id).sort());
        expect(timing).toBeDefined();

        if (timing.classification.kind === "test_choices") {
          for (const choice of choices) {
            const authoredChoice = timing.classification.choices.find(
              (candidate) => candidate.choiceId === choice.id,
            )!;
            expect(authoredChoice).toBeDefined();
            if (authoredChoice.timing.kind === "test") {
              expect(choice.etaLabel, `${clinicalCase.id}/${node.id}/${choice.id}`)
                .toBeTruthy();
              expect(choice.etaLabel, `${clinicalCase.id}/${node.id}/${choice.id}`)
                .not.toBe("No test wait");
              expect(choice.detailLabel, `${clinicalCase.id}/${node.id}/${choice.id}`)
                .toBe("Estimated test wait (game time)");
            } else {
              expect(choice.etaLabel).toBe("No test wait");
              expect(choice.detailLabel).toBeUndefined();
            }
          }
        } else {
          expect(choices.every((choice) => !choice.etaLabel && !choice.detailLabel)).toBe(true);
        }
      }
    }
  });
});
