import { describe, expect, it } from "vitest";
import {
  ROW_029_CASES,
  ROW_036_CASES,
  ROW_047_CASES,
  ROW_048_CASES,
  ROW_051_CASES,
  ROW_052_CASES,
  ROW_060_CASES,
  ROW_104_CASES,
  ROW_119_CASES,
  ROW_111_CASES,
  ROW_115_CASES,
  ROW_092_CASES,
  ROW_058_CASES,
  ROW_057_CASES,
  SYNTHETIC_CLINICAL_RELEASE,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  TUTORIAL_ENCOUNTER_ID,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  serializeGameState,
} from "../src";

describe("withdrawn AI-authored clinical pilot", () => {
  it("uses only the baseline synthetic release for new encounters", () => {
    expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease).toBe(
      SYNTHETIC_CLINICAL_RELEASE,
    );
    expect(
      PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.some((clinicalCase) =>
        clinicalCase.id.startsWith("case.pilot."),
      ),
    ).toBe(false);
    expect(
      PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.some((concept) =>
        concept.id.startsWith("concept.pilot."),
      ),
    ).toBe(false);
  });

  it("withdraws every earlier prototype and synthetic patient question from new admissions", () => {
    expect(
      PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.some(
        (clinicalCase) =>
          clinicalCase.id.startsWith("case.prototype.") ||
          clinicalCase.id.startsWith("case.synthetic.") ||
          clinicalCase.id.startsWith("case.pilot."),
      ),
    ).toBe(false);
    expect(
      PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.map(
        (clinicalCase) => clinicalCase.id,
      ),
    ).toEqual([
      "case.ventral-hernia.pulmonary-optimization.a",
      "case.ventral-hernia.pulmonary-optimization.b",
      "case.breast-cyst.under-30-asymptomatic-simple",
      "case.breast-cyst.under-30-painful-simple",
      "case.ebv-associated-malignancy.burkitt",
      "case.ebv-associated-malignancy.gastric",
      "case.ebv-associated-malignancy.nasopharyngeal",
      ...ROW_029_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_036_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_047_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_048_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_051_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_052_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_060_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_104_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_119_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_111_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_115_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_092_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_058_CASES.map((clinicalCase) => clinicalCase.id),
      ...ROW_057_CASES.map((clinicalCase) => clinicalCase.id),
    ]);
  });

  it("rejects a withdrawn pilot case when a new encounter is requested", () => {
    const initial = createInitialGameState(undefined, {
      campaignId: "campaign.withdrawn-case",
      campaignSeed: "withdrawn-case",
      createdAtRealMs: 0,
    });
    const next = gameReducer(initial, {
      type: "ADMIT_PATIENT",
      operationId: "operation.withdrawn-case",
      encounterId: "encounter.withdrawn-case",
      caseId: "case.pilot.appendicitis-classic-transfer",
      patientDisplayName: "Archived Draft Patient",
      arrivalClass: "routine",
    });

    expect(next.encounters["encounter.withdrawn-case"]).toBeUndefined();
    expect(next.operationReceipts["operation.withdrawn-case"]).toMatchObject({
      status: "rejected",
      message: "The clinical case does not exist.",
    });
  });

  it("preserves an already-frozen archived encounter through save reload", () => {
    const state = createInitialGameState(undefined, {
      campaignId: "campaign.archived-frozen-case",
      campaignSeed: "archived-frozen-case",
      createdAtRealMs: 0,
    });
    const encounter = state.encounters[TUTORIAL_ENCOUNTER_ID]!;
    encounter.frozenCase = {
      ...encounter.frozenCase,
      id: "case.pilot.archived-save-only",
      displayName: "Withdrawn archived draft",
      decisionNodes: encounter.frozenCase.decisionNodes.map((node) => ({
        ...node,
        primaryConceptId: "concept.pilot.archived-save-only",
        questionVariantId: "question.pilot.archived-save-only.v1",
      })),
    };

    const reloaded = deserializeGameState(serializeGameState(state));
    expect(
      reloaded.encounters[TUTORIAL_ENCOUNTER_ID]?.frozenCase,
    ).toMatchObject({
      id: "case.pilot.archived-save-only",
      displayName: "Withdrawn archived draft",
    });
    expect(
      reloaded.encounters[TUTORIAL_ENCOUNTER_ID]?.frozenCase.decisionNodes[0],
    ).toMatchObject({
      primaryConceptId: "concept.pilot.archived-save-only",
      questionVariantId: "question.pilot.archived-save-only.v1",
    });
  });
});
