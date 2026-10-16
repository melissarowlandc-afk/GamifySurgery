import { describe, expect, it } from "vitest";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalCaseSchema,
  testedConceptSchema,
} from "../../schema";
import { BATCH_CONTENT_VERSION, CHECKED_ON } from "./batch-helpers";
import { GYNECOLOGY_FAMILY } from "./gynecology";
import { PERIPHERAL_NERVE_FAMILY } from "./peripheral-nerve-localization";
import { NECK_MASS_FAMILY } from "./neck-mass-workup";
import { RECONSTRUCTION_FAMILY } from "./reconstruction-principles";
import { TRANSPLANT_RELATIONSHIPS_FAMILY } from "./transplant-relationships";
import { LOCAL_ANESTHETIC_FAMILY } from "./local-anesthetic-mechanism";

const families = [GYNECOLOGY_FAMILY, PERIPHERAL_NERVE_FAMILY, NECK_MASS_FAMILY,
  RECONSTRUCTION_FAMILY, TRANSPLANT_RELATIONSHIPS_FAMILY, LOCAL_ANESTHETIC_FAMILY];
const concepts = families.flatMap((family) => family.authoringConcepts);
const questions = families.flatMap((family) => family.questions);
const cases = families.flatMap((family) => family.cases);
const nodes = cases.flatMap((clinicalCase) => clinicalCase.decisionNodes);
const timings = families.flatMap((family) => family.timingEntries);
const reviews = families.flatMap((family) => family.caseReviews);
const claims = families.flatMap((family) => family.claims);
const sources = families.flatMap((family) => family.sources);
const EXPECTED_IDS = [
  "concept.gs028f.gynecology.pregnancy-testing-pelvic-pain",
  "concept.gs028f.gynecology.suspected-ectopic-urgent-evaluation",
  "concept.gs028f.plastic.median-carpal-tunnel-localization",
  "concept.gs028f.plastic.ulnar-cubital-tunnel-localization",
  "concept.gs028f.head-neck.persistent-mass-malignancy-ct",
  "concept.gs028f.head-neck.initial-fna-not-open-biopsy",
  "concept.gs028f.plastic.graft-versus-flap-blood-supply",
  "concept.gs028f.plastic.split-thickness-donor-epithelial-regrowth",
  "concept.gs028f.transplantation.donor-recipient-relationships",
  "concept.gs028f.pharmacology.local-anesthetic-sodium-channel-block",
];

describe("GS-028 second October 7 variety batch: first ten", () => {
  it("keeps the locked ten meanings, four substantive patient contexts each and two pairs", () => {
    expect(concepts.map((concept) => concept.id)).toEqual(EXPECTED_IDS);
    expect(questions).toHaveLength(40);
    expect(cases).toHaveLength(38);
    expect(nodes).toHaveLength(40);
    expect(nodes.filter((node) => node.resultGateAfter)).toHaveLength(2);
    for (const concept of concepts) {
      const variants = questions.filter((question) => question.conceptId === concept.id);
      expect(variants, concept.id).toHaveLength(4);
      expect(new Set(variants.map((question) => question.stem)).size, concept.id).toBe(4);
      const contexts = variants.map((question) => `${question.patientPresentation} ${question.reachedCurrentUpdate ?? ""}`
        .replace(/\d+-year-old (?:woman|man)/g, "adult"));
      expect(new Set(contexts).size, concept.id).toBe(4);
    }
  });

  it("passes actual runtime schemas and preserves exact node/question/timing bindings", () => {
    for (const concept of families.flatMap((family) => family.testedConcepts)) {
      expect(testedConceptSchema.parse(concept)).toEqual(concept);
    }
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.parse(clinicalCase)).toEqual(clinicalCase);
      expect(clinicalCase.id).toMatch(/^case\.gs028f\./);
      for (const node of clinicalCase.decisionNodes) {
        const question = questions.find((item) => item.id === node.questionVariantId)!;
        expect(question.conceptId).toBe(node.primaryConceptId);
        expect(question.stem).toBe(node.stem);
        expect(question.answerChoices.map(({ id, label, isCorrect }) => ({ id, label, isCorrect })))
          .toEqual(node.answerChoices.map(({ id, label, isCorrect }) => ({ id, label, isCorrect })));
        expect(question.reachedCurrentUpdate).toBe(node.currentUpdate);
      }
    }
    for (const entry of timings) expect(answerChoiceTimingRegistryEntrySchema.parse(entry)).toEqual(entry);
    for (const records of [concepts, questions, cases, claims, sources, nodes]) {
      expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
    }
  });

  it("keeps every authoring, evidence and case-review record unapproved", () => {
    expect(BATCH_CONTENT_VERSION).toBe("development-batch.2026-10-07.variety.2");
    expect(CHECKED_ON).toBe("2026-10-07");
    expect(reviews).toHaveLength(38);
    for (const record of [...concepts, ...questions, ...claims, ...sources, ...reviews]) {
      expect(record.contentVersion).toBe(BATCH_CONTENT_VERSION);
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const record of [...concepts, ...questions, ...reviews]) {
      expect(record.agentReview.clinicianSignOff).toBe(false);
    }
  });

  it("links all clinical teachings to dated atomic claims and reciprocal complete sources", () => {
    expect(claims).toHaveLength(25);
    expect(sources).toHaveLength(18);
    for (const family of families) {
      const claimById = new Map(family.claims.map((claim) => [claim.id, claim]));
      const sourceById = new Map(family.sources.map((source) => [source.id, source]));
      for (const concept of family.authoringConcepts) {
        expect(concept.evidenceClaimIds.length, concept.id).toBeGreaterThan(0);
        for (const id of concept.evidenceClaimIds) expect(claimById.has(id), id).toBe(true);
      }
      for (const question of family.questions) {
        expect(question.supportingEvidenceClaimIds.length, question.id).toBeGreaterThan(0);
        for (const id of question.supportingEvidenceClaimIds) expect(claimById.has(id), id).toBe(true);
      }
      for (const claim of family.claims) {
        expect(claim.lastCheckedOn).toBe(CHECKED_ON);
        expect(claim.limitation?.length, claim.id).toBeGreaterThan(30);
        expect(claim.applicablePopulation.length, claim.id).toBeGreaterThan(20);
        expect(claim.sourceIds.length, claim.id).toBeGreaterThan(0);
        for (const id of claim.sourceIds) expect(sourceById.get(id)?.evidenceClaimIds, id).toContain(claim.id);
      }
      for (const source of family.sources) {
        expect(source.accessedOn).toBe(CHECKED_ON);
        expect(source.completeCitation.length, source.id).toBeGreaterThan(80);
        expect(source.organizationOrJournal.length, source.id).toBeGreaterThan(2);
        expect(source.authors.length, source.id).toBeGreaterThan(0);
        expect(source.officialUrl).toMatch(/^https:\/\//);
        expect(source.licenseLabel.length, source.id).toBeGreaterThan(60);
        expect(source.authorityAssessment.length, source.id).toBeGreaterThan(80);
        expect(source.reuseNotes).toMatch(/no source prose/i);
        expect(source.evidenceClaimIds.length, source.id).toBeGreaterThan(0);
        for (const id of source.evidenceClaimIds) expect(claimById.get(id)?.sourceIds, id).toContain(source.id);
      }
    }
  });

  it("retains honest rights, inaccessible-source and single-source limitations", () => {
    expect(sources.map((source) => source.officialUrl).join(" "))
      .not.toMatch(/nice\.org|entnet\.org|orthoinfo\.aaos|rcpi\.ie|uptodate|accesssurgery/i);
    const nhs = sources.find((source) => source.id === "source.gs028f.nhs.ectopic-pregnancy.2022")!;
    expect(nhs.licenseLabel).toContain("Open Government Licence v3.0");
    expect(nhs.reuseStatus).toBe("copyrighted_targeted_verification_only");
    expect(nhs.authorityAssessment).toMatch(/overdue/i);
    const qld = sources.find((source) => source.id === "source.gs028f.qld.early-pregnancy-loss.2025")!;
    expect(qld.licenseLabel).toContain("CC BY-NC-ND 4.0");
    expect(qld.reuseStatus).toBe("copyrighted_targeted_verification_only");
    const neck = sources.find((source) => source.id === "source.gs028f.rsna-acr.neck-mass-imaging.2022")!;
    expect(neck.authorityAssessment).toMatch(/inaccessible.*not claim evidence/i);
    expect(neck.authorityAssessment).toMatch(/No universal CT superiority/i);
    expect(claims.find((claim) => claim.id === "claim.gs028f.neck.needle-before-open")?.limitation).toMatch(/Single independent guideline/i);
    expect(claims.find((claim) => claim.id === "claim.gs028f.reconstruction.donor-retained-epithelium")?.limitation).toMatch(/sole direct donor-site source/i);
    for (const source of sources.filter((item) => item.reuseStatus === "cc_by_4_0")) {
      expect(source.licenseLabel).toMatch(/CC BY\s*4\.0/);
      expect(source.licenseLabel).toMatch(/verified/i);
      expect(source.officialUrl).toMatch(/^https:\/\//);
    }
  });

  it("uses coherent adult named profiles with clinically constrained sex and short complaints", () => {
    const profiles = cases.flatMap((clinicalCase) => clinicalCase.approvedInstantiationProfiles);
    expect(profiles).toHaveLength(134);
    expect(new Set(profiles.map((profile) => profile.id)).size).toBe(profiles.length);
    for (const clinicalCase of cases) {
      expect(clinicalCase.patientDisplayName).toBe("{patientName}");
      expect(clinicalCase.chiefComplaint.trim().split(/\s+/).length, clinicalCase.id).toBeLessThanOrEqual(5);
      expect(clinicalCase.chiefComplaint.trim().length).toBeGreaterThan(0);
      for (const profile of clinicalCase.approvedInstantiationProfiles) {
        const demographics = profile.prototypeDemographics!;
        expect(demographics.ageYears).toBeGreaterThanOrEqual(18);
        expect(profile.presentation).toContain(`{patientName}, a ${demographics.ageYears}-year-old ${demographics.sexLabel === "Female" ? "woman" : "man"}`);
        expect(profile.presentation).not.toMatch(/\{patientAge\}|\{patientSex\}|^A patient with/i);
        expect(profile.prototypeVitalSigns).toBeDefined();
      }
    }
    for (const clinicalCase of GYNECOLOGY_FAMILY.cases) {
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(2);
      for (const profile of clinicalCase.approvedInstantiationProfiles) expect(profile.prototypeDemographics!.sexLabel).toBe("Female");
    }
  });

  it("uses complete patient tasks, one key, explicit feedback and balanced shuffled choices", () => {
    for (const question of questions) {
      expect(question.stem, question.id).toMatch(/\?$/);
      expect(question.stem, question.id).toMatch(/patient|supplied/i);
      expect(question.stem.trim().split(/\s+/).length, question.id).toBeGreaterThanOrEqual(6);
      expect(question.answerChoices).toHaveLength(4);
      const keys = question.answerChoices.filter((choice) => choice.isCorrect);
      expect(keys, question.id).toHaveLength(1);
      const key = keys[0]!;
      const wrong = question.answerChoices.filter((choice) => !choice.isCorrect);
      expect(key.label.length, `${question.id}: uniquely longest key ${key.label}`)
        .toBeLessThanOrEqual(Math.max(...wrong.map((choice) => choice.label.length)));
      expect(question.explanation, question.id).toContain(`The correct answer is “${key.label}.”`);
      expect(new Set(question.answerChoices.map((choice) => choice.label)).size).toBe(4);
      for (const choice of wrong) {
        expect(choice.distractorRationale?.length, question.id).toBeGreaterThan(15);
        expect(choice.label).not.toMatch(/^Only\b|\balone$/i);
      }
      const prose = `${question.patientPresentation} ${question.stem} ${question.explanation}`;
      expect(prose, question.id).not.toMatch(/service\.|route\.|timing\.|the question does not|question requiring|has not been offered as a wrong choice/i);
      expect(prose, question.id).not.toMatch(/\b\d+\s*(?:minutes?|hours?|ticks?|mg|mcg)\b/i);
    }
    for (const clinicalCase of cases) {
      expect(clinicalCase.learningSummary).toBe(clinicalCase.decisionNodes.map((node) => node.explanation).join(" "));
      for (const node of clinicalCase.decisionNodes) expect(node.shuffleAnswers).toBe(true);
    }
  });

  it("classifies every testing alternative with neutral central timing and no fabricated FNA service", () => {
    expect(timings).toHaveLength(40);
    const testEntries = timings.filter((entry) => entry.classification.kind === "test_choices");
    expect(testEntries).toHaveLength(7);
    let timedChoiceCount = 0;
    for (const entry of timings) {
      const clinicalCase = cases.find((item) => item.id === entry.caseId)!;
      const node = clinicalCase.decisionNodes.find((item) => item.id === entry.nodeId)!;
      expect(entry.questionVariantId).toBe(node.questionVariantId);
      if (entry.classification.kind !== "test_choices") continue;
      expect(entry.classification.choices.map(({ choiceId, choiceLabel }) => ({ id: choiceId, label: choiceLabel })))
        .toEqual(node.answerChoices.map(({ id, label }) => ({ id, label })));
      for (const choice of entry.classification.choices) {
        if (choice.timing.kind !== "test") continue;
        timedChoiceCount += 1;
        expect(Object.keys(choice.timing).sort()).toEqual(["kind", "timingProfileId"]);
        expect(choice.timing.timingProfileId).toMatch(/^timing\.test\./);
      }
    }
    expect(timedChoiceCount).toBe(26);
    const labEntries = GYNECOLOGY_FAMILY.timingEntries.filter((entry) => entry.classification.kind === "test_choices");
    expect(labEntries).toHaveLength(3);
    for (const entry of labEntries) {
      if (entry.classification.kind !== "test_choices") throw new Error("Expected testing alternatives");
      expect(entry.classification.choices.map((choice) => choice.timing))
        .toEqual(Array.from({ length: 4 }, () => ({ kind: "test", timingProfileId: "timing.test.basic_labs" })));
    }
    expect(GYNECOLOGY_FAMILY.serviceContracts[0]!.allowedRouteIds)
      .toEqual(["route.basic_labs.phlebotomy_sendout", "route.basic_labs.outsourced"]);
    expect(nodes.flatMap((node) => node.answerChoices).map((choice) => choice.serviceRequest?.serviceId).join(" "))
      .not.toMatch(/thyroid_fna|neck_fna/);
  });

  it("offers at least two independent early starting siblings per concept and real no-leak CT pairs", () => {
    for (const clinicalCase of cases) {
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.routineEligible).toBe(true);
    }
    for (const concept of concepts) {
      const independent = cases.filter((clinicalCase) => clinicalCase.decisionNodes.length === 1
        && clinicalCase.decisionNodes[0]!.primaryConceptId === concept.id);
      expect(independent.length, concept.id).toBeGreaterThanOrEqual(2);
    }
    const paired = NECK_MASS_FAMILY.cases.filter((clinicalCase) => clinicalCase.decisionNodes.length === 2);
    expect(paired).toHaveLength(2);
    for (const clinicalCase of paired) {
      const [first, second] = clinicalCase.decisionNodes;
      const gate = first!.resultGateAfter!;
      expect(first!.primaryConceptId).toBe(EXPECTED_IDS[4]);
      expect(second!.primaryConceptId).toBe(EXPECTED_IDS[5]);
      expect(gate.resultTypeId).toBe("service.ct");
      expect(gate.allowedServiceRouteIds).toEqual(["route.ct.in_house", "route.ct.outsourced"]);
      expect(first!.answerChoices.find((choice) => choice.isCorrect)!.serviceRequest).toEqual({ serviceId: "service.ct" });
      expect(second!.currentUpdate).toBe(gate.resultNarrative);
      expect(clinicalCase.presentation).not.toContain(gate.resultNarrative);
      expect(clinicalCase.presentation).not.toMatch(/completed contrast-enhanced neck CT|initial needle sample|CT shows/i);
      expect(first!.currentUpdate).toBeUndefined();
      expect(second!.resultGateAfter).toBeNull();
      expect(reviews.find((review) => review.caseId === clinicalCase.id)!.acuity).toBe("stable");
    }
  });

  it("keeps stable-but-suspected ectopic assessment urgent with no outpatient result wait", () => {
    const ectopic = GYNECOLOGY_FAMILY.cases.filter((clinicalCase) => clinicalCase.decisionNodes[0]!.primaryConceptId === EXPECTED_IDS[1]);
    expect(ectopic).toHaveLength(4);
    for (const clinicalCase of ectopic) {
      const node = clinicalCase.decisionNodes[0]!;
      expect(reviews.find((review) => review.caseId === clinicalCase.id)!.acuity).toBe("urgent");
      expect(node.resultGateAfter).toBeNull();
      expect(node.answerChoices.every((choice) => choice.serviceRequest == null)).toBe(true);
      expect(timings.find((entry) => entry.nodeId === node.id)!.classification).toEqual({ kind: "no_test" });
      expect(node.answerChoices.find((choice) => choice.isCorrect)!.label).toBe("Urgent gynecology assessment");
      for (const profile of clinicalCase.approvedInstantiationProfiles) {
        expect(profile.prototypeVitalSigns).toMatchObject({ heartRateBpm: 78, systolicBloodPressureMmHg: 118, oxygenSaturationPercent: 99 });
      }
    }
    const completedAssay = GYNECOLOGY_FAMILY.cases.find((clinicalCase) => clinicalCase.id.includes("outside-assay-record"))!;
    expect(timings.find((entry) => entry.caseId === completedAssay.id)!.classification).toEqual({ kind: "no_test" });
  });

  it("keeps completed reports and principle audits independent from new test ordering", () => {
    const interpretationCases = NECK_MASS_FAMILY.cases.filter((clinicalCase) => clinicalCase.decisionNodes.length === 1);
    expect(interpretationCases).toHaveLength(4);
    for (const clinicalCase of interpretationCases) {
      expect(timings.find((entry) => entry.caseId === clinicalCase.id)!.classification).toEqual({ kind: "no_test" });
      expect(clinicalCase.decisionNodes[0]!.answerChoices.every((choice) => choice.serviceRequest == null)).toBe(true);
    }
    const proposal = interpretationCases.find((clinicalCase) => clinicalCase.id.includes("proposed-open-plan"))!;
    expect(proposal.presentation).not.toContain("appropriate for an initial needle sample");
    const recipient = RECONSTRUCTION_FAMILY.cases.find((clinicalCase) => clinicalCase.id.includes("recipient-bed"))!;
    expect(recipient.presentation).not.toContain("The graft was");
    expect(recipient.chiefComplaint).not.toMatch(/graft/i);
    const reservoir = RECONSTRUCTION_FAMILY.cases.find((clinicalCase) => clinicalCase.id.includes("partial-depth-preservation"))!;
    expect(reservoir.presentation).not.toMatch(/appendage|hair follicle/i);
    expect(reservoir.decisionNodes[0]!.answerChoices.find((choice) => choice.isCorrect)!.label)
      .toBe("Retained hair-follicle epithelium");
  });
});
