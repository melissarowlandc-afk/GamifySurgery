import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { answerChoiceTimingRegistryEntrySchema, testedConceptSchema } from "../../schema";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "../../answer-choice-timing";
import { PEDIATRIC_CLINIC_PROTOTYPE_ADMISSION_MANIFEST, SYNTHETIC_CLINICAL_RELEASE } from "../../synthetic-content";
import { PRIMARY_MIDLINE_HERNIA_TESTED_CONCEPTS } from "../2026-09-28-pre-endoscopy/primary-midline-hernia";
import { BATCH_CONTENT_VERSION, CHECKED_ON, PEDIATRIC_ART_PROFILES, pediatricDraftCaseSchema } from "./batch-helpers";
import {
  EXCLUDED_SOURCE_CHECKS,
  PEDIATRIC_CLINIC_AUTHORING_CONCEPTS as concepts,
  PEDIATRIC_CLINIC_BATCH_MANIFEST as manifest,
  PEDIATRIC_CLINIC_CASE_REVIEWS as caseReviews,
  PEDIATRIC_CLINIC_CASES as cases,
  PEDIATRIC_CLINIC_CLAIMS as claims,
  PEDIATRIC_CLINIC_FAMILY_CONTEXTS as familyContexts,
  PEDIATRIC_CLINIC_QUESTIONS as questions,
  PEDIATRIC_CLINIC_SERVICE_CONTRACTS as serviceContracts,
  PEDIATRIC_CLINIC_SOURCE_LINKS as sourceLinks,
  PEDIATRIC_CLINIC_SOURCES as sources,
  PEDIATRIC_CLINIC_STATEMENT_MAPPINGS as mappings,
  PEDIATRIC_CLINIC_TESTED_CONCEPTS as tested,
  PEDIATRIC_CLINIC_TIMING_ENTRIES as timings,
  WITHHELD_DISAGREEMENTS,
  WITHHELD_TOPICS,
} from "./pediatric-clinic-batch";
import { renderPediatricSamples } from "./render-samples";

const root = new URL("../../../../../", import.meta.url);
const allDraftRecords = [...concepts, ...questions, ...caseReviews, ...familyContexts, ...mappings, ...claims, ...sources, ...sourceLinks, ...WITHHELD_DISAGREEMENTS, ...WITHHELD_TOPICS, ...EXCLUDED_SOURCE_CHECKS, manifest];

describe("standalone pediatric clinic batch admission", () => {
  it("contains ten objectives, two distinct named-child variants each, and no release authorization", () => {
    expect(manifest).toMatchObject({ authoringConceptCount: 10, testedConceptCount: 10, newConceptCount: 9, questionVariantCount: 20, caseCount: 20, decisionNodeCount: 20, timingEntryCount: 20, sourceCount: 12, assemblyAuthorized: false, publicReleaseAuthorized: false, admissionScope: "standalone_draft_for_manager_scope_review" });
    expect(cases).toHaveLength(20);
    expect(caseReviews).toHaveLength(20);
    expect(familyContexts).toHaveLength(20);
    expect(mappings).toHaveLength(20);
    for (const concept of concepts) {
      const variants = questions.filter((item) => item.conceptId === concept.id);
      expect(variants).toHaveLength(2);
      expect(new Set(variants.map((item) => item.patientPresentation)).size).toBe(2);
    }
    for (const collection of [concepts, questions, cases, claims, sources, familyContexts, mappings]) {
      expect(new Set(collection.map((item) => item.id)).size).toBe(collection.length);
    }
  });

  it("retains clinician-review status on every authored record and keeps agent review nonclinical", () => {
    for (const record of allDraftRecords) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
      expect(record.contentVersion).toBe(BATCH_CONTENT_VERSION);
    }
    for (const record of [...concepts, ...questions, ...caseReviews, ...familyContexts, ...mappings]) expect(record.agentReview.clinicianSignOff).toBe(false);
  });

  it("preserves the existing midline-recognition concept identity and semantic record", () => {
    const id = "concept.umbilical-epigastric-hernia.clinical-recognition";
    expect(manifest.reusedConceptIds).toEqual([id]);
    expect(tested.find((item) => item.id === id)).toEqual(PRIMARY_MIDLINE_HERNIA_TESTED_CONCEPTS.find((item) => item.id === id));
    for (const concept of tested) testedConceptSchema.parse(concept);
    expect(concepts.filter((item) => item.identityDisposition === "new_objective").every((item) => item.earliestFacilityStage === 4)).toBe(true);
  });

  it("validates all L4 draft shapes and rejects population, stage, testing and adult-fallback drift", () => {
    for (const item of cases) pediatricDraftCaseSchema.parse(item);
    const base = cases[0]!;
    for (const age of [4, 18]) {
      const mutated = structuredClone(base);
      mutated.prototypeDemographics!.ageYears = age;
      mutated.approvedInstantiationProfiles![0]!.prototypeDemographics!.ageYears = age;
      expect(pediatricDraftCaseSchema.safeParse(mutated).success).toBe(false);
    }
    expect(pediatricDraftCaseSchema.safeParse({ ...base, earliestFacilityStage: 3 }).success).toBe(false);
    expect(pediatricDraftCaseSchema.safeParse({ ...base, pediatricProfile: undefined }).success).toBe(false);
    expect(pediatricDraftCaseSchema.safeParse({ ...base, requiredClinicalSetting: "ambulatory_surgery" }).success).toBe(false);
    expect(pediatricDraftCaseSchema.safeParse({ ...base, prototypeVitalSigns: { heartRateBpm: 76, systolicBloodPressureMmHg: 118, diastolicBloodPressureMmHg: 74, temperatureF: 98.4, oxygenSaturationPercent: 99 } }).success).toBe(false);
    const testChoice = structuredClone(base);
    testChoice.decisionNodes[0]!.answerChoices[1]!.serviceRequest = { serviceId: "service.ultrasound" };
    expect(pediatricDraftCaseSchema.safeParse(testChoice).success).toBe(false);
    const unshuffled = structuredClone(base);
    unshuffled.decisionNodes[0]!.shuffleAnswers = false;
    expect(pediatricDraftCaseSchema.safeParse(unshuffled).success).toBe(false);
  });

  it("matches age/sex to authored art metadata and preserves one named parent and one frozen profile", () => {
    const roster = JSON.parse(readFileSync(new URL("tools/character-mapping/level3-roster-complete-v2/roster.json", root), "utf8")) as { identities: { stableId: string; visualAge: number; brief: string }[] };
    for (const profile of Object.values(PEDIATRIC_ART_PROFILES)) {
      const metadata = roster.identities.find((item) => item.stableId === profile.stillId)!;
      expect(metadata.visualAge).toBe(profile.ageYears);
      // Read only explicit boy/girl tokens in metadata, never skin, hairstyle or apparent sex.
      expect(metadata.brief.startsWith(profile.sexLabel === "Female" ? `girl${profile.ageYears},` : `boy${profile.ageYears},`)).toBe(true);
    }
    for (const family of familyContexts) {
      const item = cases.find((candidate) => candidate.id === family.caseId)!;
      const profile = item.approvedInstantiationProfiles![0]!;
      expect(item.approvedInstantiationProfiles).toHaveLength(1);
      expect(item.pediatricProfile).toEqual({ version: "pediatric-patient-profile.v1", requiresParent: true, clinicalScope: "outpatient" });
      expect(profile.pediatricProfile).toEqual(item.pediatricProfile);
      expect(family.parentCount).toBe(1);
      expect(family.parentPlacement).toBe("same_room_throughout");
      expect(family.childName).toBe(item.patientDisplayName);
      expect(family.profileId).toBe(profile.id);
      expect(family.prototypeDemographics).toEqual(item.prototypeDemographics);
      expect(profile.prototypeDemographics).toEqual(item.prototypeDemographics);
      expect(profile.presentation).toBe(item.presentation);
      expect(item.presentation).toContain(family.parentName);
      expect(item.presentation).toContain(`${family.prototypeDemographics.ageYears === 11 ? "an" : "a"} ${family.prototypeDemographics.ageYears}-year-old ${family.prototypeDemographics.sexLabel === "Female" ? "girl" : "boy"}`);
      expect(item.presentation).toContain("same room throughout the visit");
      expect(item.prototypeVitalSigns).toBeUndefined();
      expect(profile.prototypeVitalSigns).toBeUndefined();
      expect(family.profileValuesBasis).toBe("editorial_art_contract_not_disease_probability");
    }
  });

  it("keeps educational tier, acuity, stage and capability as separate authoring fields", () => {
    for (const review of caseReviews) {
      expect([0, 1]).toContain(review.educationalTier);
      expect(["stable", "urgent_stable"]).toContain(review.acuity);
      expect(review.earliestFacilityStage).toBe(4);
      expect(review.requiredCapabilityIds).toEqual(["capability.pediatric_examination"]);
      expect(review.requiredClinicalSetting).toBe("clinic");
      expect(review.profileValuesBasis).toBe("editorial_simulation_not_prevalence_or_diagnostic_threshold");
    }
  });

  it("maps every clinical text field and choice to real atomic claims and both source directions", () => {
    const claimIds = new Set(claims.map((item) => item.id));
    const sourceIds = new Set(sources.map((item) => item.id));
    for (const concept of concepts) for (const id of concept.evidenceClaimIds) expect(claimIds.has(id)).toBe(true);
    for (const mapping of mappings) {
      const question = questions.find((item) => item.id === mapping.questionVariantId)!;
      const used = [...mapping.presentation, ...mapping.stem, ...mapping.explanation, ...mapping.teachingPoint, ...(mapping.exhibit ?? []), ...mapping.choices.flatMap((item) => item.labelAndRationale)];
      for (const group of [mapping.presentation, mapping.stem, mapping.explanation, mapping.teachingPoint]) expect(group.length).toBeGreaterThan(0);
      expect([...new Set(used)].sort()).toEqual([...question.supportingEvidenceClaimIds].sort());
      expect(mapping.choices.map((item) => item.answerChoiceId)).toEqual(question.answerChoices.map((item) => item.id));
      for (const choice of mapping.choices) expect(choice.labelAndRationale.length).toBeGreaterThan(0);
      for (const id of used) expect(claimIds.has(id)).toBe(true);
      const item = cases.find((candidate) => candidate.id === mapping.caseId)!;
      const expectedSources = [...new Set(used.flatMap((id) => claims.find((claim) => claim.id === id)!.sourceIds))].sort();
      expect([...item.sourceLabels].sort()).toEqual(expectedSources);
    }
    for (const claim of claims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.statement.length).toBeGreaterThan(15);
      expect(claim.lastCheckedOn).toBe(CHECKED_ON);
      expect(claim.applicablePopulation.length).toBeGreaterThan(0);
      expect(claim.limitation).toBeTruthy();
      for (const id of claim.sourceIds) {
        expect(sourceIds.has(id)).toBe(true);
        expect(sources.find((source) => source.id === id)!.evidenceClaimIds).toContain(claim.id);
      }
    }
    for (const source of sources) {
      expect(source.evidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of source.evidenceClaimIds) expect(claims.find((claim) => claim.id === id)!.sourceIds).toContain(source.id);
    }
  });

  it("records complete bibliographic, access, authority and actual rights metadata", () => {
    for (const source of sources) {
      expect(source.completeCitation).toContain(source.title);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.publicationYear).not.toBeNull();
      expect(source.organizationOrJournal).toBeTruthy();
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe(CHECKED_ON);
      expect(source.sourceClass).toBeTruthy();
      expect(source.licenseLabel).toBeTruthy();
      expect(source.reuseStatus).toBeTruthy();
      expect(source.reuseNotes).toBeTruthy();
      expect(source.authorityAssessment).toBeTruthy();
      expect(source.usageRole).toBeTruthy();
      expect(source.accessMethod).toBeTruthy();
      expect(source.completeCitation).not.toMatch(/placeholder|citation needed|\bTBD\b/i);
    }
    const restricted = sources.find((item) => item.doi === "10.21037/tp-22-361")!;
    expect(restricted.licenseLabel).toContain("CC BY-NC-ND 4.0");
    expect(restricted.reuseStatus).toBe("copyrighted_targeted_verification_only");
    expect(sources.find((item) => item.doi === "10.1016/j.amsu.2021.102233")!.reuseStatus).toBe("cc_by_4_0");
  });

  it("withholds conflicted claims and prohibited sources from all questions", () => {
    const disputed = claims.filter((item) => item.certainty === "conflicting").map((item) => item.id);
    expect(disputed).toHaveLength(2);
    expect(WITHHELD_DISAGREEMENTS.map((item) => item.claimId).sort()).toEqual([...disputed].sort());
    for (const question of questions) for (const id of disputed) expect(question.supportingEvidenceClaimIds).not.toContain(id);
    expect(WITHHELD_DISAGREEMENTS.every((item) => item.disputedTeachingPointWithheld)).toBe(true);
    const admittedHosts = sources.map((item) => new URL(item.officialUrl!).hostname);
    for (const host of ["www.facs.org", "uroweb.org", "www.rch.org.au"]) expect(admittedHosts).not.toContain(host);
    expect(EXCLUDED_SOURCE_CHECKS).toHaveLength(4);
    expect(WITHHELD_TOPICS.some((item) => item.topic.includes("Varicocele") || item.topic.includes("varicocele"))).toBe(true);
  });

  it("keeps source links safe and all choice timing complete without operational tests", () => {
    expect(serviceContracts).toEqual([]);
    expect(timings).toHaveLength(20);
    for (const timing of timings) {
      answerChoiceTimingRegistryEntrySchema.parse(timing);
      expect(timing.classification).toEqual({ kind: "no_test" });
      const item = cases.find((candidate) => candidate.id === timing.caseId)!;
      expect(item.decisionNodes[0]!.id).toBe(timing.nodeId);
      expect(item.decisionNodes[0]!.questionVariantId).toBe(timing.questionVariantId);
    }
    for (const link of sourceLinks) expect(link).toMatchObject({ target: "_blank", rel: "noopener noreferrer", retrieveDuringGameplay: false });
    for (const item of cases) for (const node of item.decisionNodes) {
      expect(node.shuffleAnswers).toBe(true);
      expect(node.resultGateAfter).toBeNull();
      expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
      expect(node.terminalDispositions.every((disposition) => disposition.kind === "no_terminal_outcome")).toBe(true);
    }
  });

  it("admits only the exact manager-selected unapproved prototype variants without clinical promotion", () => {
    const admission = PEDIATRIC_CLINIC_PROTOTYPE_ADMISSION_MANIFEST;
    expect(admission).toMatchObject({ batchId: manifest.id, contentVersion: BATCH_CONTENT_VERSION,
      assemblyAuthorized: true, publicReleaseAuthorized: false, clinicalApproval: false,
      reviewStatus: "needs_clinician_review", lastClinicianReview: null,
      authorization: "manager_scope_editorial_acceptance", authorizedOn: "2026-10-09",
      requiredFacilityStage: 4, requiredCapabilityIds: ["capability.pediatric_examination"],
      careRoomDefinitionId: "room.pediatric_examination", deferredVariants: [] });
    expect(manifest.assemblyAuthorized).toBe(false); // Original authoring receipt is retained.
    expect(SYNTHETIC_CLINICAL_RELEASE.publicationStatus).toBe("synthetic_unapproved_prototype");
    expect(admission.variants.map(item => item.caseId)).toEqual(cases.map(item => item.id));
    for (const item of cases) {
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter(candidate => candidate.id === item.id)).toEqual([item]);
      const node = item.decisionNodes[0]!;
      const family = familyContexts.find(candidate => candidate.caseId === item.id)!;
      expect(admission.variants.find(candidate => candidate.caseId === item.id)).toEqual({ caseId: item.id,
        questionVariantId: node.questionVariantId, conceptId: node.primaryConceptId,
        familyContextId: family.id, profileId: family.profileId });
      expect(ANSWER_CHOICE_TIMING_REGISTRY.filter(candidate => candidate.caseId === item.id)).toEqual(timings.filter(candidate => candidate.caseId === item.id));
    }
    for (const concept of tested) expect(SYNTHETIC_CLINICAL_RELEASE.concepts.filter(candidate => candidate.id === concept.id)).toEqual([concept]);
  });

  it("keeps the read-through exact to exports, key-first labelled, safe-linked and UTF-8 without BOM", () => {
    const samplesUrl = new URL("docs/handoffs/PEDIATRIC_BATCH_SAMPLES.md", root);
    const samples = readFileSync(samplesUrl, "utf8");
    expect(samples).toBe(renderPediatricSamples());
    expect((samples.match(/KEY FIRST FOR REVIEW/g) ?? []).length).toBe(10);
    expect(samples).toContain("Runtime nodes randomize all answer choices");
    expect(samples).toContain('target="_blank" rel="noopener noreferrer"');
    const files = readdirSync(new URL("./", import.meta.url)).filter((name) => /\.(ts|mjs|md)$/.test(name)).map((name) => new URL(name, import.meta.url));
    for (const file of [...files, samplesUrl]) {
      const bytes = readFileSync(file);
      expect(bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))).toBe(false);
      expect(bytes.toString("utf8")).not.toContain("\uFFFD");
    }
  });
});
