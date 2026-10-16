import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "../../../../balance-config/src/prototype-balance";
import { answerChoiceTimingRegistryEntrySchema, testedConceptSchema } from "../../schema";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "../../answer-choice-timing";
import { SYNTHETIC_CLINICAL_RELEASE, VARIETY3_PROTOTYPE_ADMISSION_MANIFEST } from "../../synthetic-content";
import { ADULT_ART_PROFILES, BATCH_CONTENT_VERSION, CHECKED_ON, adultDraftCaseSchema } from "./batch-helpers";
import { C } from "./evidence-claims";
import { renderVariety3Samples } from "./render-samples";
import {
  VARIETY3_AUTHORING_CONCEPTS as concepts, VARIETY3_TESTED_CONCEPTS as tested,
  VARIETY3_CASES as cases, VARIETY3_QUESTIONS as questions, VARIETY3_CASE_REVIEWS as reviews,
  VARIETY3_ADULT_CONTEXTS as adults, VARIETY3_STATEMENT_MAPPINGS as mappings,
  VARIETY3_TIMING_ENTRIES as timings, VARIETY3_CLAIMS as claims, VARIETY3_SOURCES as sources,
  VARIETY3_SOURCE_LINKS as links, VARIETY3_BATCH_MANIFEST as manifest, VARIETY3_SERVICE_CONTRACTS,
  WITHHELD_DISAGREEMENTS, WITHHELD_TOPICS, EXCLUDED_SOURCE_CHECKS,
} from "./variety3-batch";

const root = new URL("../../../../../", import.meta.url);
const allDraftRecords = [...concepts, ...questions, ...reviews, ...adults, ...mappings, ...claims, ...sources, ...links, ...WITHHELD_DISAGREEMENTS, ...WITHHELD_TOPICS, ...EXCLUDED_SOURCE_CHECKS, manifest];

describe("standalone variety-3 batch content", () => {
  it("has ten new objectives with two distinct adult variants each and no assembly authorization", () => {
    expect(manifest).toMatchObject({ newConceptCount: 10, authoringConceptCount: 10, testedConceptCount: 10, caseCount: 20, questionVariantCount: 20, decisionNodeCount: 20, evidenceClaimCount: 35, sourceCount: 19, timingEntryCount: 20, assemblyAuthorized: false, publicReleaseAuthorized: false, admissionScope: "standalone_draft_for_manager_scope_review", reusedConceptIds: [] });
    expect(new Set(concepts.map(item => item.id)).size).toBe(10);
    for (const concept of concepts) {
      const variants = questions.filter(item => item.conceptId === concept.id);
      expect(variants).toHaveLength(2);
      expect(new Set(variants.map(item => item.id)).size).toBe(2);
      expect(new Set(variants.map(item => item.patientPresentation)).size).toBe(2);
      expect(concept.identityDisposition).toBe("new_objective");
    }
    expect(reviews).toHaveLength(20); expect(adults).toHaveLength(20); expect(mappings).toHaveLength(20);
    expect(VARIETY3_SERVICE_CONTRACTS).toEqual([]);
  });

  it("keeps every authored envelope under clinician review with exact draft version and no sign-off", () => {
    for (const record of allDraftRecords) expect(record).toMatchObject({ contentVersion: BATCH_CONTENT_VERSION, reviewStatus: "needs_clinician_review", aiAssistedDrafting: true, lastClinicianReview: null });
    for (const item of [...concepts, ...questions, ...reviews, ...adults, ...mappings]) expect(item.agentReview).toMatchObject({ reviewedOn: CHECKED_ON, clinicianSignOff: false });
  });

  it("validates existing concept/case/timing shapes and rejects uncontrolled or pediatric profiles", () => {
    for (const concept of tested) expect(testedConceptSchema.safeParse(concept).success, concept.id).toBe(true);
    for (const item of cases) expect(adultDraftCaseSchema.safeParse(item).success, item.id).toBe(true);
    for (const timing of timings) expect(answerChoiceTimingRegistryEntrySchema.safeParse(timing).success).toBe(true);
    const example = cases[0]!;
    expect(adultDraftCaseSchema.safeParse({ ...example, prototypeDemographics: { ageYears: 12, sexLabel: "Male" } }).success).toBe(false);
    expect(adultDraftCaseSchema.safeParse({ ...example, approvedInstantiationProfiles: [] }).success).toBe(false);
    expect(adultDraftCaseSchema.safeParse({ ...example, decisionNodes: [{ ...example.decisionNodes[0]!, shuffleAnswers: false }] }).success).toBe(false);
  });

  it("preserves art-matched adult identities, named introductions and constrained profile text", () => {
    const roster = JSON.parse(readFileSync(new URL("tools/character-mapping/patient-demographics20-v4/roster.json", root), "utf8")) as { identities: { stableId: string; intendedAge: number; compatibleSexLabel: string }[] };
    const registry = JSON.parse(readFileSync(new URL("apps/player/src/art/characterStillRegistry.generated.json", root), "utf8")) as { characters: { id: string; intendedAge?: number; intendedSex?: string }[] };
    for (const art of Object.values(ADULT_ART_PROFILES)) {
      expect(roster.identities.find(item => item.stableId === art.stillId)).toMatchObject({ intendedAge: art.ageYears, compatibleSexLabel: art.sexLabel });
      expect(registry.characters.find(item => item.id === art.stillId)).toMatchObject({ intendedAge: art.ageYears, intendedSex: art.sexLabel });
    }
    for (const adult of adults) {
      const item = cases.find(candidate => candidate.id === adult.caseId)!;
      const profile = item.approvedInstantiationProfiles![0]!;
      expect(profile.id).toBe(adult.profileId);
      expect(item.prototypeDemographics).toEqual(adult.prototypeDemographics);
      expect(profile.prototypeDemographics).toEqual(item.prototypeDemographics);
      expect(profile.presentation).toBe(item.presentation);
      expect(profile.chiefComplaint).toBe(item.chiefComplaint);
      expect(item.presentation.startsWith(`${adult.patientName}, a ${adult.prototypeDemographics.ageYears}-year-old ${adult.prototypeDemographics.sexLabel === "Female" ? "woman" : "man"}, visits the clinic.`)).toBe(true);
      expect(item.prototypeVitalSigns).toBeUndefined(); expect(profile.prototypeVitalSigns).toBeUndefined();
      expect(item.pediatricProfile).toBeUndefined();
      expect(adult.profileValuesBasis).toBe("editorial_art_contract_not_disease_probability");
    }
  });

  it("keeps progression, tier, acuity, setting and capability separate in existing lanes", () => {
    expect([1, 2, 3].map(level => concepts.filter(item => item.earliestFacilityStage === level).length)).toEqual([4, 4, 2]);
    for (const review of reviews) {
      expect([0, 1]).toContain(review.educationalTier); expect(["stable", "urgent_stable"]).toContain(review.acuity);
      expect(review.requiredClinicalSetting).toBe("clinic"); expect(review.requiredCapabilityIds).toEqual([]);
      expect(review.profileValuesBasis).toBe("editorial_simulation_not_prevalence_or_diagnostic_threshold");
      expect(cases.find(item => item.id === review.caseId)!.earliestFacilityStage).toBe(review.earliestFacilityStage);
    }
  });

  it("uses short complaints, complete named tasks, one decision, shuffled choices and teaching points", () => {
    for (const item of cases) {
      const words = item.chiefComplaint!.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(1); expect(words).toBeLessThanOrEqual(5);
      expect(item.presentation).not.toMatch(/^A patient with/i);
      expect(item.decisionNodes).toHaveLength(1);
      const node = item.decisionNodes[0]!;
      expect(node.stem).toContain(item.patientDisplayName); expect(node.stem).toMatch(/^(Which|What) .+\?$/);
      expect(node.stem).not.toBe(item.presentation); expect(node.shuffleAnswers).toBe(true); expect(node.teachingPoint).toBeTruthy();
      expect(node.resultGateAfter).toBeNull(); expect(node.answerChoices.every(choice => choice.serviceRequest === null)).toBe(true);
      expect(JSON.stringify(item)).not.toMatch(/\{patient(Name|Age|Sex)\}|\b\d+\s*(?:minutes?|hours?|days?|weeks?|months?|years?)\b/i);
    }
  });

  it("has four parallel concise options, a rationale for each and no uniquely longest key", () => {
    for (const question of questions) {
      expect(question.answerChoices).toHaveLength(4);
      expect(new Set(question.answerChoices.map(choice => choice.label)).size).toBe(4);
      const keys = question.answerChoices.filter(choice => choice.isCorrect); expect(keys).toHaveLength(1);
      const wordCounts = question.answerChoices.map(choice => choice.label.trim().split(/\s+/).length);
      const lengths = question.answerChoices.map(choice => choice.label.length);
      expect(Math.max(...wordCounts) / Math.min(...wordCounts), question.id).toBeLessThanOrEqual(1.75);
      expect(Math.max(...lengths) / Math.min(...lengths), question.id).toBeLessThanOrEqual(1.75);
      expect(keys[0]!.label.length, question.id).toBeLessThanOrEqual(Math.max(...question.answerChoices.filter(choice => !choice.isCorrect).map(choice => choice.label.length)));
      for (const choice of question.answerChoices) {
        expect(choice.rationale).toBeTruthy(); expect(choice.distractorRationale).toBe(choice.isCorrect ? null : choice.rationale);
        expect(choice.label).not.toMatch(/because|which would|unlike|\([^)]+\)/i);
      }
    }
  });

  it("maps every clinical field and proposed/rejected choice to existing atomic claims", () => {
    const byId = new Map(claims.map(claim => [claim.id, claim]));
    const used = new Set<string>();
    for (const concept of concepts) for (const id of concept.evidenceClaimIds) expect(byId.has(id)).toBe(true);
    for (const mapping of mappings) {
      const question = questions.find(item => item.id === mapping.questionVariantId)!;
      const groups = [mapping.presentation, mapping.stem, mapping.explanation, mapping.teachingPoint, ...mapping.choices.map(choice => choice.labelAndRationale)];
      expect(groups.every(group => group.length > 0)).toBe(true);
      const referenced = [...new Set(groups.flat())];
      expect(referenced.sort()).toEqual([...question.supportingEvidenceClaimIds].sort());
      expect(mapping.choices.map(choice => choice.answerChoiceId)).toEqual(question.answerChoices.map(choice => choice.id));
      for (const [index, choice] of mapping.choices.entries()) expect(choice.proposalStatus).toBe(question.answerChoices[index]!.isCorrect ? "supported_answer" : "rejected_distractor");
      for (const id of referenced) { expect(byId.has(id)).toBe(true); used.add(id); }
      const item = cases.find(candidate => candidate.id === mapping.caseId)!;
      const expected = [...new Set(referenced.flatMap(id => byId.get(id)!.sourceIds))].sort();
      expect([...item.sourceLabels].sort()).toEqual(expected);
      expect([...item.decisionNodes[0]!.sourceLabels].sort()).toEqual(expected);
    }
    expect([...used].sort()).toEqual(claims.map(item => item.id).sort());
  });

  it("has complete reciprocal source metadata, real URLs and dated limited claims", () => {
    expect(new Set(claims.map(item => item.id)).size).toBe(claims.length);
    expect(new Set(sources.map(item => item.id)).size).toBe(sources.length);
    for (const claim of claims) {
      expect(claim.lastCheckedOn).toBe(CHECKED_ON); expect(claim.statement).toBeTruthy();
      expect(claim.applicablePopulation).toBeTruthy(); expect(claim.limitation).toBeTruthy(); expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const id of claim.sourceIds) expect(sources.find(source => source.id === id)!.evidenceClaimIds).toContain(claim.id);
    }
    for (const source of sources) {
      for (const field of [source.title, source.completeCitation, source.organizationOrJournal, source.licenseLabel, source.reuseNotes, source.authorityAssessment, source.usageRole, source.accessMethod]) expect(field).toBeTruthy();
      expect(source.authors.length).toBeGreaterThan(0); expect(source.accessedOn).toBe(CHECKED_ON);
      expect(source.officialUrl).toMatch(/^https:\/\//); expect(source.officialUrl).not.toMatch(/example\.(org|com)|placeholder/i);
      expect(source.evidenceClaimIds.length).toBeGreaterThan(0);
      if (source.publicationYear === null) expect(source.publicationDateNote).toBeTruthy();
      for (const id of source.evidenceClaimIds) expect(claims.find(claim => claim.id === id)!.sourceIds).toContain(source.id);
    }
  });

  it("classifies every testing/procedure choice, including all distractors, with existing wait hooks", () => {
    const profileIds = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(item => item.id));
    expect(timings.filter(item => item.classification.kind === "test_choices")).toHaveLength(8);
    let timedChoices = 0;
    for (const item of cases) {
      const node = item.decisionNodes[0]!;
      const matches = timings.filter(timing => timing.caseId === item.id && timing.nodeId === node.id && timing.questionVariantId === node.questionVariantId);
      expect(matches).toHaveLength(1);
      const classification = matches[0]!.classification;
      const testsExpected = /variety3\.(prep-|snare-|barrett-|allergy-)/.test(item.id);
      expect(classification.kind).toBe(testsExpected ? "test_choices" : "no_test");
      if (classification.kind === "test_choices") {
        expect(classification.choices.map(choice => [choice.choiceId, choice.choiceLabel])).toEqual(node.answerChoices.map(choice => [choice.id, choice.label]));
        for (const choice of classification.choices) {
          const testing = !item.id.includes("allergy-") || /\.(skin|challenge)$/.test(choice.choiceId);
          expect(choice.timing.kind).toBe(testing ? "test" : "no_test");
          if (choice.timing.kind === "test") { expect(profileIds.has(choice.timing.timingProfileId)).toBe(true); timedChoices++; }
        }
      }
    }
    expect(timedChoices).toBe(28);
  });

  it("keeps safe source links and the separate unapproved assembly boundary", () => {
    for (const link of links) expect(link).toMatchObject({ target: "_blank", rel: "noopener noreferrer", fetchDuringGameplay: false });
    expect(manifest.assemblyAuthorized).toBe(false); // Preserve the original authoring receipt.
    expect(VARIETY3_PROTOTYPE_ADMISSION_MANIFEST).toMatchObject({ assemblyAuthorized: true, clinicalApproval: false,
      publicReleaseAuthorized: false, reviewStatus: "needs_clinician_review", lastClinicianReview: null });
    expect(SYNTHETIC_CLINICAL_RELEASE.publicationStatus).toBe("synthetic_unapproved_prototype");
    expect(SYNTHETIC_CLINICAL_RELEASE.concepts.filter(item => item.id.startsWith("concept.variety3."))).toEqual(tested);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter(item => item.id.startsWith("case.variety3."))).toEqual(cases);
    expect(ANSWER_CHOICE_TIMING_REGISTRY.filter(item => item.caseId.startsWith("case.variety3."))).toEqual(timings);
  });

  it("retains clinical boundaries and explicitly limited/withheld extensions", () => {
    for (const question of questions.filter(item => item.conceptId.endsWith("thrombosed-external-hemorrhoid-recognition"))) expect(question.supportingEvidenceClaimIds).toContain(C.externalClot);
    for (const question of questions.filter(item => item.conceptId.endsWith("nondysplastic-barrett-surveillance"))) expect(question.supportingEvidenceClaimIds).toContain(C.barrettNoAblation);
    for (const question of questions.filter(item => item.conceptId.endsWith("surgical-hair-preparation"))) expect(question.patientPresentation).toContain("non-genital");
    for (const id of [C.snareDiminutive, C.snareSmall, C.hairLeave, C.hairClip]) expect(claims.find(item => item.id === id)!.limitation).toMatch(/sole adequate/i);
    expect(WITHHELD_DISAGREEMENTS.map(item => item.id)).toContain("withheld.variety3.repeat-schedule");
    expect(WITHHELD_DISAGREEMENTS.map(item => item.id)).toContain("withheld.variety3.cefazolin-selection");
  });

  it("keeps the all-variant sample artifact synchronized with exact current exports", () => {
    const rendered = renderVariety3Samples();
    expect(readFileSync(new URL("docs/handoffs/VARIETY3_BATCH_SAMPLES.md", root), "utf8")).toBe(rendered);
    expect(rendered).toContain("KEY FIRST FOR REVIEW ONLY");
    for (const question of questions) expect(rendered).toContain(`### ${question.id}`);
  });

  it("uses UTF-8 without BOM and LF for every batch file and requested handoff artifact", () => {
    const directory = new URL("./", import.meta.url);
    const files = [...readdirSync(directory).map(name => new URL(name, directory)), new URL("docs/handoffs/VARIETY3_BATCH_SAMPLES.md", root), new URL("docs/handoffs/CONCEPT_COVERAGE_AUDIT_20261010.md", root)];
    for (const file of files) {
      const bytes = readFileSync(file);
      expect(bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])), file.pathname).toBe(false);
      expect(bytes.toString("utf8"), file.pathname).not.toContain("\r");
    }
  });
});
