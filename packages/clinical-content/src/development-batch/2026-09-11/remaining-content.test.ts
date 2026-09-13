import { describe, expect, it } from "vitest";
import { syntheticClinicalCaseSchema, testedConceptSchema } from "../../schema";
import * as breast from "./lactational-breast-abscess";
import * as voice from "./post-thyroidectomy-voice";
import * as zenker from "./zenker-diverticulum";
import * as pad from "./peripheral-arterial-disease";
import * as colon from "./colon-cancer";
import * as rectal from "./rectal-cancer";
import * as carotid from "./carotid-stenosis";

const families = [
  [breast.LACTATIONAL_BREAST_ABSCESS_CONCEPTS, breast.LACTATIONAL_BREAST_ABSCESS_TESTED_CONCEPTS, breast.LACTATIONAL_BREAST_ABSCESS_QUESTIONS, breast.LACTATIONAL_BREAST_ABSCESS_CASES, breast.LACTATIONAL_BREAST_ABSCESS_CLAIMS, breast.LACTATIONAL_BREAST_ABSCESS_SOURCES, breast.LACTATIONAL_BREAST_ABSCESS_CASE_REVIEWS, breast.LACTATIONAL_BREAST_ABSCESS_SERVICE_CONTRACTS, breast.LACTATIONAL_BREAST_ABSCESS_TIMING_ENTRIES],
  [voice.POST_THYROIDECTOMY_VOICE_CONCEPTS, voice.POST_THYROIDECTOMY_VOICE_TESTED_CONCEPTS, voice.POST_THYROIDECTOMY_VOICE_QUESTIONS, voice.POST_THYROIDECTOMY_VOICE_CASES, voice.POST_THYROIDECTOMY_VOICE_CLAIMS, voice.POST_THYROIDECTOMY_VOICE_SOURCES, voice.POST_THYROIDECTOMY_VOICE_CASE_REVIEWS, voice.POST_THYROIDECTOMY_VOICE_SERVICE_CONTRACTS, voice.POST_THYROIDECTOMY_VOICE_TIMING_ENTRIES],
  [zenker.ZENKER_DIVERTICULUM_CONCEPTS, zenker.ZENKER_DIVERTICULUM_TESTED_CONCEPTS, zenker.ZENKER_DIVERTICULUM_QUESTIONS, zenker.ZENKER_DIVERTICULUM_CASES, zenker.ZENKER_DIVERTICULUM_CLAIMS, zenker.ZENKER_DIVERTICULUM_SOURCES, zenker.ZENKER_DIVERTICULUM_CASE_REVIEWS, zenker.ZENKER_DIVERTICULUM_SERVICE_CONTRACTS, zenker.ZENKER_DIVERTICULUM_TIMING_ENTRIES],
  [pad.PERIPHERAL_ARTERIAL_DISEASE_CONCEPTS, pad.PERIPHERAL_ARTERIAL_DISEASE_TESTED_CONCEPTS, pad.PERIPHERAL_ARTERIAL_DISEASE_QUESTIONS, pad.PERIPHERAL_ARTERIAL_DISEASE_CASES, pad.PERIPHERAL_ARTERIAL_DISEASE_CLAIMS, pad.PERIPHERAL_ARTERIAL_DISEASE_SOURCES, pad.PERIPHERAL_ARTERIAL_DISEASE_CASE_REVIEWS, pad.PERIPHERAL_ARTERIAL_DISEASE_SERVICE_CONTRACTS, pad.PERIPHERAL_ARTERIAL_DISEASE_TIMING_ENTRIES],
  [colon.COLON_CANCER_CONCEPTS, colon.COLON_CANCER_TESTED_CONCEPTS, colon.COLON_CANCER_QUESTIONS, colon.COLON_CANCER_CASES, colon.COLON_CANCER_CLAIMS, colon.COLON_CANCER_SOURCES, colon.COLON_CANCER_CASE_REVIEWS, colon.COLON_CANCER_SERVICE_CONTRACTS, colon.COLON_CANCER_TIMING_ENTRIES],
  [rectal.RECTAL_CANCER_CONCEPTS, rectal.RECTAL_CANCER_TESTED_CONCEPTS, rectal.RECTAL_CANCER_QUESTIONS, rectal.RECTAL_CANCER_CASES, rectal.RECTAL_CANCER_CLAIMS, rectal.RECTAL_CANCER_SOURCES, rectal.RECTAL_CANCER_CASE_REVIEWS, rectal.RECTAL_CANCER_SERVICE_CONTRACTS, rectal.RECTAL_CANCER_TIMING_ENTRIES],
  [carotid.CAROTID_STENOSIS_CONCEPTS, carotid.CAROTID_STENOSIS_TESTED_CONCEPTS, carotid.CAROTID_STENOSIS_QUESTIONS, carotid.CAROTID_STENOSIS_CASES, carotid.CAROTID_STENOSIS_CLAIMS, carotid.CAROTID_STENOSIS_SOURCES, carotid.CAROTID_STENOSIS_CASE_REVIEWS, carotid.CAROTID_STENOSIS_SERVICE_CONTRACTS, carotid.CAROTID_STENOSIS_TIMING_ENTRIES],
] as const;

const concepts = families.flatMap((family) => [...family[0]]);
const testedConcepts = families.flatMap((family) => [...family[1]]);
const questions = families.flatMap((family) => [...family[2]]);
const cases = families.flatMap((family) => [...family[3]]);
const claims = families.flatMap((family) => [...family[4]]);
const sources = families.flatMap((family) => [...family[5]]);
const reviews = families.flatMap((family) => [...family[6]]);
const contracts = families.flatMap((family) => [...family[7]]);
const timingEntries = families.flatMap((family) => [...family[8]]);

describe("2026-09-11 remaining board-expansion authoring", () => {
  it("contains fourteen concepts, fifty-six variants, and twenty-eight gated two-node cases", () => {
    expect(concepts).toHaveLength(14);
    expect(testedConcepts).toHaveLength(14);
    expect(questions).toHaveLength(56);
    expect(cases).toHaveLength(28);
    expect(new Set(concepts.map((item) => item.id)).size).toBe(14);
    expect(new Set(questions.map((item) => item.id)).size).toBe(56);
    expect(new Set(cases.map((item) => item.id)).size).toBe(28);
    for (const concept of concepts) expect(questions.filter((item) => item.conceptId === concept.id)).toHaveLength(4);
    expect(cases.flatMap((item) => item.decisionNodes).filter((node) => node.resultGateAfter)).toHaveLength(28);
  });

  it("is schema-valid, patient-linked, and withholds all returned results from intake", () => {
    for (const item of testedConcepts) expect(testedConceptSchema.parse(item)).toEqual(item);
    for (const item of cases) {
      expect(syntheticClinicalCaseSchema.parse(item)).toEqual(item);
      expect(item.patientDisplayName).toBe("{patientName}");
      expect(item.presentation).toContain("{patientName}");
      expect(item.approvedInstantiationProfiles).toHaveLength(4);
      expect(item.chiefComplaint).toMatch(/^(I|My)\b/);
      const [first, second] = item.decisionNodes;
      expect(first?.resultGateAfter).not.toBeNull();
      expect(second?.resultGateAfter).toBeNull();
      expect(second?.currentUpdate).toBe(first?.resultGateAfter?.resultNarrative);
      expect(item.presentation).not.toContain(first?.resultGateAfter?.resultNarrative ?? "");
      for (const node of item.decisionNodes) {
        expect(node.shuffleAnswers).toBe(true);
        expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      }
      expect(first?.answerChoices.find((choice) => choice.isCorrect)?.serviceRequest?.serviceId).toBe(first?.resultGateAfter?.resultTypeId);
    }
  });

  it("keeps every record unapproved and every claim linked bidirectionally to evidence", () => {
    for (const item of [...concepts, ...questions, ...claims, ...sources, ...reviews]) {
      expect(item.reviewStatus).toBe("needs_clinician_review");
      expect(item.lastClinicianReview).toBeNull();
      expect(item.aiAssistedDrafting).toBe(true);
    }
    const sourceById = new Map(sources.map((item) => [item.id, item]));
    for (const evidenceClaim of claims) for (const sourceId of evidenceClaim.sourceIds) expect(sourceById.get(sourceId)?.evidenceClaimIds).toContain(evidenceClaim.id);
    for (const item of sources) for (const claimId of item.evidenceClaimIds) expect(claims.find((claim) => claim.id === claimId)?.sourceIds).toContain(item.id);
  });

  it("declares exact timing for every choice and uses diagnostic gates only on first nodes", () => {
    expect(timingEntries).toHaveLength(56);
    expect(contracts).toHaveLength(7);
    const nodeIds = new Set(cases.flatMap((item) => item.decisionNodes.map((node) => node.id)));
    expect(new Set(timingEntries.map((entry) => entry.nodeId))).toEqual(nodeIds);
    for (const item of cases) {
      const [first, second] = item.decisionNodes;
      const firstTiming = timingEntries.find((entry) => entry.nodeId === first?.id);
      const secondTiming = timingEntries.find((entry) => entry.nodeId === second?.id);
      expect(firstTiming?.classification.kind).toBe("test_choices");
      if (item.id.startsWith("case.lactational-breast-abscess.")) {
        expect(secondTiming?.classification.kind).toBe("test_choices");
        if (secondTiming?.classification.kind === "test_choices") {
          expect(secondTiming.classification.choices.filter((choice) => choice.timing.kind === "test")).toHaveLength(1);
          expect(secondTiming.classification.choices.filter((choice) => choice.timing.kind === "no_test")).toHaveLength(3);
        }
      } else {
        expect(secondTiming?.classification.kind).toBe("no_test");
      }
      if (firstTiming?.classification.kind === "test_choices") {
        expect(firstTiming.classification.choices).toHaveLength(4);
        expect(firstTiming.classification.choices.every((choice) => choice.timing.kind === "test")).toBe(true);
        for (const timingChoice of firstTiming.classification.choices) {
          expect(first?.answerChoices.find((choice) => choice.id === timingChoice.choiceId)?.label).toBe(timingChoice.choiceLabel);
        }
      }
    }
  });

  it("uses the specific timing profile for overnight, angiographic, PET, manometry, and aspiration choices", () => {
    const profileByChoiceId = new Map(
      timingEntries.flatMap((entry) => entry.classification.kind === "test_choices"
        ? entry.classification.choices.map((choice) => [choice.choiceId, choice.timing] as const)
        : []),
    );
    expect(profileByChoiceId.get("cta_runoff_1")).toEqual({ kind: "test", timingProfileId: "timing.test.ct_angiography" });
    expect(profileByChoiceId.get("pet_ct_1")).toEqual({ kind: "test", timingProfileId: "timing.test.pet_ct" });
    expect(profileByChoiceId.get("manometry_1")).toEqual({ kind: "test", timingProfileId: "timing.test.esophageal_manometry" });
    expect(profileByChoiceId.get("guided_aspiration_1")).toEqual({ kind: "test", timingProfileId: "timing.test.image_guided_aspiration_culture" });
  });

  it("preserves the key clinical boundaries in the seven families", () => {
    expect(JSON.stringify(breast.LACTATIONAL_BREAST_ABSCESS_CASES)).toContain("contact precautions");
    expect(JSON.stringify(voice.POST_THYROIDECTOMY_VOICE_CASES)).toContain("preserved ordinary vocal-fold mobility");
    expect(JSON.stringify(zenker.ZENKER_DIVERTICULUM_CASES)).toContain("above the cricopharyngeus");
    expect(pad.PERIPHERAL_ARTERIAL_DISEASE_CASES.every((item) => item.presentation.includes("risk-reduction") || item.presentation.includes("Risk-reduction"))).toBe(true);
    expect(JSON.stringify(rectal.RECTAL_CANCER_CASES)).toContain("surgery remains valid");
    expect(JSON.stringify(carotid.CAROTID_STENOSIS_CASES)).toContain("without distal collapse or complete occlusion");
  });
});
