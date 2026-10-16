import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { SyntheticClinicalCase } from "../../schema";
import { STATISTICS_QI_FAMILIES } from "./statistics-qi";
import { ETHICS_FAMILIES } from "./ethics";
import { PATIENT_SAFETY_FAMILY } from "../2026-10-07-variety-2/patient-safety";
import { ASSENT_FAMILY } from "../2026-10-08-pediatric-clinic/assent";
import { GS028_STATS_ETHICS_20260929_CLAIMS, GS028_STATS_ETHICS_20260929_SOURCES } from "./statistics-ethics-batch";
import { PEDIATRIC_CLINIC_CLAIMS, PEDIATRIC_CLINIC_SOURCES } from "../2026-10-08-pediatric-clinic/evidence-claims";

const mainFamilies = [...STATISTICS_QI_FAMILIES, ...ETHICS_FAMILIES];
const questions = [
  ...mainFamilies.flatMap((family) => family.questions),
  ...PATIENT_SAFETY_FAMILY.questions, ...ASSENT_FAMILY.questions,
];
const cases: SyntheticClinicalCase[] = [...mainFamilies.flatMap((family) => family.cases), ...PATIENT_SAFETY_FAMILY.cases, ...ASSENT_FAMILY.cases];
const concepts = [...mainFamilies.flatMap((family) => family.testedConcepts), ...PATIENT_SAFETY_FAMILY.testedConcepts, ...ASSENT_FAMILY.testedConcepts];
const claims = new Map([...GS028_STATS_ETHICS_20260929_CLAIMS, ...PATIENT_SAFETY_FAMILY.claims, ...PEDIATRIC_CLINIC_CLAIMS].map((claim) => [claim.id, claim]));
const sources = [...GS028_STATS_ETHICS_20260929_SOURCES, ...PATIENT_SAFETY_FAMILY.sources, ...PEDIATRIC_CLINIC_SOURCES];
const words = (text: string) => text.replaceAll("{patientName}", "Alex Morgan").trim().split(/\s+/).length;

describe("round-2 focused statistics, ethics, safety, and assent wording", () => {
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
        expect(claim!.reviewStatus).toBe("needs_clinician_review");
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
    }
  });
});
