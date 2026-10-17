import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { SyntheticClinicalCase } from "../../schema";
import { STATISTICS_QI_FAMILIES } from "./statistics-qi";
import { ETHICS_CLINICAL_ANCHOR_BY_QUESTION, ETHICS_FAMILIES } from "./ethics";
import { PATIENT_SAFETY_FAMILY, SAFETY_CLINICAL_ANCHOR_KEYS } from "../2026-10-07-variety-2/patient-safety";
import { ASSENT_FAMILY, ASSENT_CLINICAL_ANCHOR_KEYS } from "../2026-10-08-pediatric-clinic/assent";
import { GS028_STATS_ETHICS_20260929_CLAIMS, GS028_STATS_ETHICS_20260929_SOURCES } from "./statistics-ethics-batch";
import { PEDIATRIC_CLINIC_CLAIMS, PEDIATRIC_CLINIC_SOURCES } from "../2026-10-08-pediatric-clinic/evidence-claims";
import { CLINICAL_ANCHORS, RESEARCH_PREMISES, RESEARCH_PREMISE_BY_QUESTION, STATISTICS_CLINICAL_ANCHOR_BY_QUESTION } from "./statistics-variants";
import { EXISTING_ANCHOR_CLAIMS, EXISTING_ANCHOR_SOURCES } from "./clinical-anchor-test-catalog";

const mainFamilies = [...STATISTICS_QI_FAMILIES, ...ETHICS_FAMILIES];
const questions = [
  ...mainFamilies.flatMap((family) => family.questions),
  ...PATIENT_SAFETY_FAMILY.questions, ...ASSENT_FAMILY.questions,
];
const cases: SyntheticClinicalCase[] = [...mainFamilies.flatMap((family) => family.cases), ...PATIENT_SAFETY_FAMILY.cases, ...ASSENT_FAMILY.cases];
const concepts = [...mainFamilies.flatMap((family) => family.testedConcepts), ...PATIENT_SAFETY_FAMILY.testedConcepts, ...ASSENT_FAMILY.testedConcepts];
const claims = new Map([...GS028_STATS_ETHICS_20260929_CLAIMS, ...PATIENT_SAFETY_FAMILY.claims, ...PEDIATRIC_CLINIC_CLAIMS, ...EXISTING_ANCHOR_CLAIMS].map((claim) => [claim.id, claim]));
const sources = [...GS028_STATS_ETHICS_20260929_SOURCES, ...PATIENT_SAFETY_FAMILY.sources, ...PEDIATRIC_CLINIC_SOURCES, ...EXISTING_ANCHOR_SOURCES];
const anchorsByQuestion = {
  ...STATISTICS_CLINICAL_ANCHOR_BY_QUESTION, ...ETHICS_CLINICAL_ANCHOR_BY_QUESTION,
  ...Object.fromEntries(PATIENT_SAFETY_FAMILY.questions.map((question, index) => [question.id, SAFETY_CLINICAL_ANCHOR_KEYS[index]!])),
  ...Object.fromEntries(ASSENT_FAMILY.questions.map((question, index) => [question.id, ASSENT_CLINICAL_ANCHOR_KEYS[index]!])),
};
const words = (text: string) => text.replaceAll("{patientName}", "Alex Morgan").trim().split(/\s+/).length;

describe("round-3 clinically anchored statistics, ethics, safety, and assent wording", () => {
  it("keeps the closed 30-concept / 118-variant / 114-case inventory and existing pairing boundary", () => {
    expect(concepts).toHaveLength(30);
    expect(questions).toHaveLength(118);
    expect(cases).toHaveLength(114);
    expect(new Set(questions.map((question) => question.id)).size).toBe(118);
    expect(new Set(cases.map((clinicalCase) => clinicalCase.id)).size).toBe(114);
    const paired = cases.filter((clinicalCase) => clinicalCase.decisionNodes.length > 1);
    expect(paired).toHaveLength(4);
    for (const clinicalCase of paired) {
      expect(clinicalCase.decisionNodes.map((node) => node.primaryConceptId)).toEqual([
        "concept.statistics-ethics.qualified-interpreter", "concept.statistics-ethics.informed-consent",
      ]);
    }
    for (const concept of concepts) {
      expect(questions.filter((question) => question.conceptId === concept.id))
        .toHaveLength(concept.id === "concept.pediatric-clinic.developmental-assent-discussion" ? 2 : 4);
    }
  });

  it("anchors every decision to admitted clinical evidence and separates patients from employee hosts", () => {
    expect(Object.keys(anchorsByQuestion)).toHaveLength(118);
    for (const clinicalCase of cases) for (const node of clinicalCase.decisionNodes) {
      const anchorKey = anchorsByQuestion[node.questionVariantId]!;
      const anchor = CLINICAL_ANCHORS[anchorKey];
      expect(anchor, node.questionVariantId).toBeDefined();
      const authored = questions.find((question) => question.id === node.questionVariantId)!;
      expect(authored.supportingEvidenceClaimIds, node.questionVariantId).toEqual(expect.arrayContaining([...anchor.claimIds]));
      const story = node.currentUpdate ?? clinicalCase.presentation;
      expect(anchor.claimIds.length, node.questionVariantId).toBeGreaterThan(0);
      if (clinicalCase.participant) {
        expect(story, node.questionVariantId).toMatch(/^\{patientName\}, the .+ lead,/);
        expect(story.toLowerCase(), node.questionVariantId).toContain(anchor.storyTerm.toLowerCase());
        // A clinical research discussion uses one employee lead, without an
        // unrelated named patient introduction or employee demographics.
        expect(story, node.questionVariantId).not.toMatch(/\d+-year-old|\{patientAge\}|\{patientSex\}/);
        expect(clinicalCase.prototypeDemographics).toBeUndefined();
      } else {
        expect(clinicalCase.prototypeDemographics, node.questionVariantId).toBeDefined();
        const expandedStory = story.replaceAll("{patientAge}", String(clinicalCase.prototypeDemographics!.ageYears));
        expect(expandedStory, node.questionVariantId).toMatch(/\d+-year-old|una mujer de \d+ años/);
        if (node.primaryConceptId === "concept.statistics-ethics.qualified-interpreter") {
          const spanishAnchors: Record<string, RegExp> = {
            gallstones: /cálculos biliares/, graves: /Graves/,
            "cutaneous-scc": /carcinoma escamoso cutáneo/, achalasia: /acalasia/,
          };
          expect(story, node.questionVariantId).toMatch(spanishAnchors[anchorKey]!);
        } else if (anchorKey === "child-groin") {
          expect(story, node.questionVariantId).toMatch(/groin bulge/);
        } else {
          expect(story.toLowerCase(), node.questionVariantId).toContain(anchor.storyTerm.toLowerCase());
        }
      }
      expect(story, node.questionVariantId).not.toMatch(/retained sponge|retained surgical sponge/i);
    }
  });

  it("caps diagnoses and investigational premises across the bank and diversifies siblings", () => {
    const diagnoses = new Map<string, number>();
    const premises = new Map<string, number>();
    expect(Object.keys(RESEARCH_PREMISE_BY_QUESTION).sort()).toEqual(questions.map((question) => question.id).sort());
    for (const concept of concepts) {
      const siblings = questions.filter((question) => question.conceptId === concept.id);
      const keys = siblings.map((question) => CLINICAL_ANCHORS[anchorsByQuestion[question.id]!].diagnosisKey);
      expect(new Set(keys).size, concept.id).toBe(siblings.length);
    }
    for (const question of questions) {
      const diagnosis = CLINICAL_ANCHORS[anchorsByQuestion[question.id]!].diagnosisKey;
      diagnoses.set(diagnosis, (diagnoses.get(diagnosis) ?? 0) + 1);
      const premise = RESEARCH_PREMISE_BY_QUESTION[question.id];
      if (premise) {
        expect(RESEARCH_PREMISES[premise], question.id).toBeDefined();
        premises.set(premise, (premises.get(premise) ?? 0) + 1);
      }
    }
    for (const [diagnosis, count] of diagnoses) expect(count, diagnosis).toBeLessThanOrEqual(10);
    for (const [premise, count] of premises) expect(count, premise).toBeLessThanOrEqual(6);
    expect(new Set([...premises.keys()].map((key) => RESEARCH_PREMISES[key as keyof typeof RESEARCH_PREMISES].kind)))
      .toEqual(new Set(["drug", "test", "device", "technique", "care pathway", "screening program"]));
    expect(CLINICAL_ANCHORS["child-groin"].diagnosisKey).toBe(CLINICAL_ANCHORS.inguinal.diagnosisKey);
    expect(CLINICAL_ANCHORS.enterotomy.diagnosisKey).toBe(CLINICAL_ANCHORS.incisional.diagnosisKey);
  });

  it("labels every statistics exhibit as invented investigational work and preserves clinical outcomes", () => {
    for (const question of STATISTICS_QI_FAMILIES.flatMap((family) => family.questions)) {
      const exhibit = JSON.stringify(question.exhibit);
      expect(exhibit, question.id).toMatch(/unnamed investigational/i);
      expect(exhibit, question.id).toMatch(/invented|constructed|simulated/i);
      expect(exhibit, question.id).not.toMatch(/\bFIT\b|mammograph|\bPSA\b|\bCEA\b|readmission|turnover|reminder|checklist|badge|queue/i);
    }
    const diff = questions.find((question) => question.id === "question.statistics-ethics.confidence-interval.v2")!;
    expect(JSON.stringify(diff.exhibit)).toMatch(/recurrence risk difference/);
    expect(JSON.stringify(diff.exhibit)).toMatch(/percentage points/);
    expect(diff.explanation).toContain("risk difference");
  });

  it("provides complete stories, visible beginner lessons, distinct fallbacks, and aligned rationale fields", () => {
    for (const clinicalCase of cases) for (const node of clinicalCase.decisionNodes) {
      const question = questions.find((candidate) => candidate.id === node.questionVariantId)!;
      const story = node.currentUpdate ?? question.patientPresentation;
      expect(words(story), question.id).toBeGreaterThanOrEqual(45);
      expect(words(story), question.id).toBeLessThanOrEqual(60);
      expect(words(node.teachingPoint!), question.id).toBeGreaterThanOrEqual(40);
      expect(words(node.teachingPoint!), question.id).toBeLessThanOrEqual(55);
      expect(words(node.explanation), question.id).toBeGreaterThanOrEqual(20);
      expect(words(node.explanation), question.id).toBeLessThanOrEqual(40);
      expect(node.explanation, question.id).not.toBe(node.teachingPoint);
      expect(node.explanation, question.id).toMatch(/[.!?]$/);
      expect(node.stem, question.id).toMatch(/\?$/);
      // Present the situation here; the separately displayed question supplies
      // the instruction. A character may still voice a claim for evaluation.
      expect(story, question.id).not.toMatch(/(?:^|[.!?]\s+)(?:Choose|Decide|Determine|Identify|Select|Use|Explain|Clarify)\b/);
      expect(question.stem).toBe(node.stem);
      expect(question.explanation).toBe(node.explanation);
      expect(question.teachingPoint).toBe(node.teachingPoint);
      expect(node.shuffleAnswers).toBe(true);
      expect(node.answerChoices).toHaveLength(4);
      expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(new Set(node.answerChoices.map((choice) => choice.rationale)).size).toBe(4);
      const rationaleSentences = node.answerChoices.map((choice) => choice.rationale!.trim().split(/(?<=[.!?])\s+/));
      const choiceBySentence = new Map<string, number>();
      for (const [choiceIndex, sentences] of rationaleSentences.entries()) {
        expect(sentences.length, `${question.id}: ${node.answerChoices[choiceIndex]!.id}`).toBeLessThanOrEqual(2);
        for (const sentence of sentences) {
          // Copying a fact sentence into every choice hides the misconception
          // specific to each distractor, even when the complete strings differ.
          if (sentence.split(/\s+/).length < 8) continue;
          expect(choiceBySentence.has(sentence), `${question.id}: repeated rationale sentence: ${sentence}`).toBe(false);
          choiceBySentence.set(sentence, choiceIndex);
        }
      }
      for (const choice of node.answerChoices) {
        const authored = question.answerChoices.find((candidate) => candidate.id === choice.id)!;
        expect(choice.rationale?.trim().split(/\s+/).length, `${question.id}: ${choice.id}`).toBeGreaterThanOrEqual(10);
        expect(choice.rationale, `${question.id}: ${choice.id}`).toMatch(/[.!?]$/);
        expect(choice.rationale).not.toBe(choice.label);
        expect(authored.rationale).toBe(choice.rationale);
        expect(authored.label).toBe(choice.label);
        expect(authored.distractorRationale).toBe(choice.isCorrect ? null : choice.rationale);
      }
    }
    const exhibits = STATISTICS_QI_FAMILIES.flatMap((family) => family.questions).map((question) => question.exhibit!);
    expect(exhibits).toHaveLength(72);
    for (const exhibit of exhibits) {
      expect(JSON.stringify(exhibit)).not.toMatch(/Teaching dataset/i);
      expect(JSON.stringify(exhibit)).toMatch(/practice|illustrative/i);
      if (exhibit.kind === "table") expect(exhibit.caption).toMatch(/count/);
    }
  });

  it("resolves every added claim binding to existing draft claims and reciprocal sources", () => {
    for (const question of questions) {
      expect(question.reviewStatus).toBe("needs_clinician_review");
      expect(question.lastClinicianReview).toBeNull();
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of question.supportingEvidenceClaimIds) {
        const claim = claims.get(id);
        expect(claim, `${question.id}: ${id}`).toBeDefined();
        if (id.startsWith("claim.gs028se.")) expect(claim!.reviewStatus).toBe("needs_clinician_review");
        else if (claim!.reviewStatus === "clinically_approved") expect(claim!.lastClinicianReview?.reviewer).toBeTruthy();
        else expect(claim!.reviewStatus).toBe("needs_clinician_review");
        for (const sourceId of claim!.sourceIds) {
          expect(sources.some((source) => source.id === sourceId && source.evidenceClaimIds.includes(id)), `${id}: ${sourceId}`).toBe(true);
        }
      }
    }
  });

  it("varies unconstrained adult prototypes while preserving Spanish and child identities", () => {
    const patientQuestions = questions.filter((question) => !cases.find((clinicalCase) => clinicalCase.decisionNodes.some((node) => node.questionVariantId === question.id))!.participant);
    for (const concept of concepts) {
      const variants = patientQuestions.filter((question) => question.conceptId === concept.id);
      if (!variants.length || concept.id.startsWith("concept.pediatric-clinic.")) continue;
      const profiles = variants.map((question) => question.approvedInstantiationProfiles[0]!.prototypeDemographics!);
      if (/qualified-interpreter|informed-consent/.test(concept.id)) {
        expect(new Set(profiles.map((profile) => profile.sexLabel))).toEqual(new Set(["Female"]));
        expect(new Set(profiles.map((profile) => profile.ageYears))).toEqual(new Set([43, 68]));
      } else {
        expect(new Set(profiles.map((profile) => profile.sexLabel))).toEqual(new Set(["Female", "Male"]));
        expect(new Set(profiles.map((profile) => profile.ageYears)).size).toBe(4);
      }
    }
    for (const clinicalCase of cases.filter((item) => item.decisionNodes[0]!.primaryConceptId === "concept.statistics-ethics.qualified-interpreter")) {
      expect(clinicalCase.presentation).toMatch(/una mujer de (43|68) años/);
      expect(clinicalCase.approvedInstantiationProfiles!.every((profile) => profile.prototypeDemographics!.sexLabel === "Female")).toBe(true);
    }
    expect(ASSENT_FAMILY.cases.map((clinicalCase) => [clinicalCase.patientDisplayName, clinicalCase.prototypeDemographics])).toEqual([
      ["Lily Walker", { ageYears: 6, sexLabel: "Female" }],
      ["Ruby Anderson", { ageYears: 11, sexLabel: "Female" }],
    ]);
    expect(ASSENT_FAMILY.familyContexts.map((family) => [family.parentName, family.parentRelationship, family.childStillId])).toEqual([
      ["Susan Walker", "mother", "level3-roster-v2.021"],
      ["Thomas Anderson", "father", "level3-roster-v2.027"],
    ]);
  });

  it("lists every current variant in the owner review with key-first ordering explicitly limited to review", () => {
    const review = readFileSync(new URL("../../../../../docs/reviews/stats-ethics-round2-full-20261015.md", import.meta.url), "utf8");
    expect(review).toContain("KEY FIRST FOR REVIEW ONLY");
    expect(review).toContain("Runtime randomizes all answer choices");
    expect(review).toContain("Diagnosis distribution");
    expect(review).toContain("Investigational premise distribution");
    const sections = review.split(/(?=^### `question\.)/m).slice(1);
    expect(sections).toHaveLength(118);
    for (const question of questions) {
      const section = sections.find((candidate) => candidate.startsWith(`### \`${question.id}\``))!;
      expect(section, question.id).toBeDefined();
      const key = question.answerChoices.find((choice) => choice.isCorrect)!;
      // Names are illustrative in the artifact; compare the complete non-name fields.
      expect(section).toContain(`A. ${key.label} **(key)**`);
      expect(section).toContain(question.teachingPoint!);
      expect(section).toContain(question.explanation);
      for (const choice of question.answerChoices) expect(section).toContain(choice.rationale!);
      expect(section).toMatch(/\*\*Humor:\*\* (Situational|Straight)/);
      expect(section).toContain(`**Diagnosis anchor:** ${CLINICAL_ANCHORS[anchorsByQuestion[question.id]!].label}`);
    }
  });
});
