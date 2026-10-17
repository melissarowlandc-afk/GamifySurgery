import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "../../answer-choice-timing";
import { SYNTHETIC_CLINICAL_RELEASE as release, VARIETY3_PROTOTYPE_ADMISSION_MANIFEST as admission } from "../../synthetic-content";
import { VARIETY3_ADULT_CONTEXTS as adults, VARIETY3_BATCH_MANIFEST as draft,
  VARIETY3_CASES as cases, VARIETY3_TESTED_CONCEPTS as concepts, VARIETY3_TIMING_ENTRIES as timings } from "./variety3-batch";

describe("manager-selected Variety-3 prototype admission", () => {
  it("preserves the entire 360-concept intake release byte-normalized outside this additive batch", () => {
    const conceptIds = new Set(concepts.map(item => item.id));
    const caseIds = new Set(cases.map(item => item.id));
    const prior = { ...release, concepts: release.concepts.filter(item => !conceptIds.has(item.id)),
      cases: release.cases.filter(item => !caseIds.has(item.id)) };
    expect([prior.concepts.length, prior.cases.length, prior.cases.flatMap(item => item.decisionNodes).length])
      .toEqual([360, 1090, 1395]);
    // Round 3 full pass: restoring only the 114 scoped cases
    // reproduces the independently captured e590b21f... intake hash.
    // All unrelated records retain 5e456f01... (see the GS-028 ExecPlan).
    expect(createHash("sha256").update(`${JSON.stringify(prior, null, 2)}\n`).digest("hex"))
      .toBe("a559b47f3470797900b15a1033acdc5374c64030025838ab945666935e8758c1");
  });

  it("registers exact concepts, cases and identities once at their declared earliest levels and settings", () => {
    expect(admission).toMatchObject({ batchId: draft.id, contentVersion: draft.contentVersion,
      authorization: "manager_scope_editorial_acceptance", authorizedOn: "2026-10-10",
      assemblyAuthorized: true, clinicalApproval: false, publicReleaseAuthorized: false,
      reviewStatus: "needs_clinician_review", lastClinicianReview: null,
      requiredFacilityStages: [1, 2, 3], requiredClinicalSetting: "clinic", requiredCapabilityIds: [], deferredVariants: [] });
    expect(draft.assemblyAuthorized).toBe(false);
    expect(release.publicationStatus).toBe("synthetic_unapproved_prototype");
    expect([release.concepts.length, release.cases.length, release.cases.flatMap(item => item.decisionNodes).length])
      .toEqual([370, 1110, 1415]);
    expect(admission.conceptIds).toEqual(concepts.map(item => item.id));
    expect(admission.variants.map(item => item.caseId)).toEqual(cases.map(item => item.id));
    expect([1, 2, 3].map(level => concepts.filter(item => item.earliestFacilityStage === level).length)).toEqual([4, 4, 2]);
    for (const concept of concepts) expect(release.concepts.filter(item => item.id === concept.id)).toEqual([concept]);
    for (const clinicalCase of cases) {
      expect(release.cases.filter(item => item.id === clinicalCase.id)).toEqual([clinicalCase]);
      const adult = adults.find(item => item.caseId === clinicalCase.id)!;
      expect(admission.variants.find(item => item.caseId === clinicalCase.id)).toEqual({
        caseId: clinicalCase.id, questionVariantId: clinicalCase.decisionNodes[0]!.questionVariantId,
        conceptId: clinicalCase.decisionNodes[0]!.primaryConceptId, earliestFacilityStage: clinicalCase.earliestFacilityStage,
        releasePointId: clinicalCase.releasePointId, requiredClinicalSetting: clinicalCase.requiredClinicalSetting,
        adultContextId: adult.id, profileId: adult.profileId, patientStillId: adult.patientStillId,
      });
    }
  });

  it("admits every exact wait declaration with its case without adding local procedure promises", () => {
    let timedChoices = 0;
    for (const clinicalCase of cases) {
      const node = clinicalCase.decisionNodes[0]!;
      const entries = ANSWER_CHOICE_TIMING_REGISTRY.filter(item => item.caseId === clinicalCase.id);
      expect(entries).toEqual(timings.filter(item => item.caseId === clinicalCase.id));
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({ nodeId: node.id, questionVariantId: node.questionVariantId });
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(node.resultGateAfter).toBeNull();
      expect(node.answerChoices.every(choice => choice.serviceRequest === null)).toBe(true);
      if (entries[0]!.classification.kind === "test_choices") {
        expect(entries[0]!.classification.choices.map(choice => [choice.choiceId, choice.choiceLabel]))
          .toEqual(node.answerChoices.map(choice => [choice.id, choice.label]));
        timedChoices += entries[0]!.classification.choices.filter(choice => choice.timing.kind === "test").length;
      }
    }
    expect(timedChoices).toBe(28);
  });
});
