/// <reference types="node" />

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { syntheticClinicalCaseSchema, syntheticClinicalReleaseSchema } from "../../schema";
import {
  GRAVES_CASES,
  GRAVES_CLAIMS,
  GRAVES_CONCEPTS,
  GRAVES_SNAPSHOT_BINDINGS,
  GRAVES_SOURCES,
  GRAVES_VARIANTS,
} from "./graves";

const REPOSITORY_ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));

interface FrozenVariant {
  id: string;
  conceptId: string;
  contentVersion: string;
  patientPresentationVariantId: string;
  originalName: string;
  patientPresentation: string;
  stem: string;
  choices: string[];
  correctChoiceIndex: number;
  explanation: string;
  supportingEvidenceClaimIds: string[];
}

const normalize = (value: string): string => value.replace(/\r\n/g, "\n").trim();
const replaceName = (value: string, name: string): string =>
  normalize(value).replace(new RegExp(`\\b${name}\\b`, "g"), "{patientName}");

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

function parseFrozenVariants(
  binding: (typeof GRAVES_SNAPSHOT_BINDINGS)[number],
): FrozenVariant[] {
  const markdown = normalize(readFileSync(resolve(REPOSITORY_ROOT, binding.path), "utf8"));
  const contentVersion = markdown.match(/- Review version: `([^`]+)`/)?.[1];
  expect(contentVersion, binding.path).toBeDefined();
  const sections = [...markdown.matchAll(
    /^### `(presentation\.[^`]+)` \/ `(question\.[^`]+)`\n([\s\S]*?)(?=^### `presentation\.|^## |(?![\s\S]))/gm,
  )];
  expect(sections, binding.path).toHaveLength(4);

  return sections.map((section) => {
    const block = section[3]!;
    const presentation = block.match(/\*\*Current patient presentation:\*\* ([\s\S]*?)\n\n\*\*Question:\*\*/)?.[1];
    const stem = block.match(/\*\*Question:\*\* ([\s\S]*?)\n\n1\. /)?.[1];
    const choicesBlock = block.match(/\n\n1\. ([\s\S]*?)\n\n\*\*Key:\*\*/)?.[1];
    const key = Number(block.match(/\*\*Key:\*\* (\d+)/)?.[1]);
    const explanation = block.match(/\*\*Explanation:\*\* ([\s\S]*?)\n\n- Claim mapping:/)?.[1];
    const claimBlock = block.match(/- Claim mapping: ([\s\S]*?)\n- Exact-version status:/)?.[1];
    expect(presentation, section[1]).toBeDefined();
    expect(stem, section[1]).toBeDefined();
    expect(choicesBlock, section[1]).toBeDefined();
    expect(explanation, section[1]).toBeDefined();
    expect(claimBlock, section[1]).toBeDefined();

    const originalName = presentation!.match(/^([A-Z][a-z]+)\b/)?.[1];
    expect(originalName, section[1]).toBeDefined();
    const choices = `1. ${choicesBlock!}`.split("\n")
      .map((line) => line.match(/^\d+\. (.+)$/)?.[1])
      .filter((choice): choice is string => choice !== undefined);
    const claims = [...claimBlock!.matchAll(/`(claim\.[^`]+)`/g)].map((match) => match[1]!);
    expect(choices, section[1]).toHaveLength(4);
    expect(key, section[1]).toBeGreaterThanOrEqual(1);
    expect(key, section[1]).toBeLessThanOrEqual(4);
    expect(claims, section[1]).not.toHaveLength(0);

    return {
      id: section[2]!,
      conceptId: binding.concept,
      contentVersion: contentVersion!,
      patientPresentationVariantId: section[1]!,
      originalName: originalName!,
      patientPresentation: replaceName(presentation!, originalName!),
      stem: replaceName(stem!, originalName!),
      choices: choices.map((choice) => replaceName(choice, originalName!)),
      correctChoiceIndex: key - 1,
      explanation: replaceName(explanation!, originalName!),
      supportingEvidenceClaimIds: claims,
    };
  });
}

const frozenVariants = GRAVES_SNAPSHOT_BINDINGS.flatMap(parseFrozenVariants);
const originalNames = frozenVariants.map((variant) => variant.originalName);

describe("unadmitted Graves development batch", () => {
  it("binds all six frozen snapshots to their canonical SHA-256 digests", () => {
    expect(GRAVES_SNAPSHOT_BINDINGS).toHaveLength(6);
    for (const binding of GRAVES_SNAPSHOT_BINDINGS) {
      const bytes = Buffer.from(
        readFileSync(resolve(REPOSITORY_ROOT, binding.path), "utf8").replace(/\r\n/g, "\n"),
        "utf8",
      );
      expect(createHash("sha256").update(bytes).digest("hex"), binding.path).toBe(binding.hash);
      expect(() => readFileSync(resolve(REPOSITORY_ROOT, binding.receipt), "utf8")).not.toThrow();
    }
  });

  it("matches all 24 approved clinical records with only the authorized name slot", () => {
    expect(frozenVariants).toHaveLength(24);
    expect(GRAVES_VARIANTS).toHaveLength(24);
    expect(GRAVES_CASES).toHaveLength(24);

    for (const frozen of frozenVariants) {
      const variant = GRAVES_VARIANTS.find((candidate) => candidate.id === frozen.id);
      const clinicalCase = GRAVES_CASES.find(
        (candidate) => candidate.patientPresentationVariantId === frozen.patientPresentationVariantId,
      );
      expect(variant, frozen.id).toBeDefined();
      expect(clinicalCase, frozen.id).toBeDefined();
      expect(variant).toMatchObject({
        id: frozen.id,
        conceptId: frozen.conceptId,
        contentVersion: frozen.contentVersion,
        patientPresentationVariantId: frozen.patientPresentationVariantId,
        patientPresentation: frozen.patientPresentation,
        stem: frozen.stem,
        explanation: frozen.explanation,
        supportingEvidenceClaimIds: frozen.supportingEvidenceClaimIds,
        reviewStatus: "clinically_approved",
        lastClinicianReview: {
          reviewer: "Melissa Rowland, MD",
          reviewedOn: "2026-09-09",
          contentVersion: frozen.contentVersion,
        },
      });
      expect(variant!.answerChoices.map((choice) => choice.label)).toEqual(frozen.choices);
      expect(variant!.answerChoices.findIndex((choice) => choice.isCorrect)).toBe(frozen.correctChoiceIndex);
      expect(variant!.runtimeAdaptationReview).toMatchObject({
        reviewStatus: "needs_clinician_review",
        lastClinicianReview: null,
        authority: "owner-delegated agent review",
        clinicianSignOff: false,
      });

      const node = clinicalCase!.decisionNodes[0]!;
      expect(clinicalCase!.presentation).toBe(frozen.patientPresentation);
      expect(clinicalCase!.learningSummary).toBe(frozen.explanation);
      expect(node.questionVariantId).toBe(frozen.id);
      expect(node.stem).toBe(frozen.stem);
      expect(node.answerChoices.map((choice) => choice.label)).toEqual(frozen.choices);
      expect(node.answerChoices.findIndex((choice) => choice.isCorrect)).toBe(frozen.correctChoiceIndex);
      expect(node.explanation).toBe(frozen.explanation);
      expect(node.terminalDispositions.every(
        (outcome) => outcome.clinicalRationale === frozen.explanation,
      )).toBe(true);
    }

    const runtimeText = JSON.stringify({ variants: GRAVES_VARIANTS, cases: GRAVES_CASES });
    for (const name of originalNames) {
      expect(runtimeText, `missed illustrative name ${name}`).not.toMatch(new RegExp(`\\b${name}\\b`));
    }
    expect(
      collectStrings({ variants: GRAVES_VARIANTS, cases: GRAVES_CASES })
        .flatMap((value) => value.match(/\{[^}]+\}/g) ?? [])
        .filter((token) => token !== "{patientName}"),
    ).toEqual([]);
  });

  it("keeps pronoun-dependent profiles coherent and supplies varied adult ages", () => {
    for (const variant of GRAVES_VARIANTS) {
      const text = [
        variant.patientPresentation,
        variant.stem,
        ...variant.answerChoices.map((choice) => choice.label),
        variant.explanation,
      ].join("\n");
      const female = /\b(?:she|her|hers)\b/i.test(text);
      const male = /\b(?:he|him|his)\b/i.test(text);
      const pregnancyOrLactation = /pregnancy|breastfeed|nursing infant/i.test(text);
      const sexes = new Set(variant.approvedInstantiationProfiles.map(
        (profile) => profile.prototypeDemographics!.sexLabel,
      ));
      const ages = new Set(variant.approvedInstantiationProfiles.map(
        (profile) => profile.prototypeDemographics!.ageYears,
      ));
      expect(female && male, variant.id).toBe(false);
      expect(ages.size, variant.id).toBeGreaterThan(1);
      expect(variant.approvedInstantiationProfiles.every(
        (profile) => profile.presentation === variant.patientPresentation,
      )).toBe(true);
      if (pregnancyOrLactation || female) expect(sexes, variant.id).toEqual(new Set(["Female"]));
      else if (male) expect(sexes, variant.id).toEqual(new Set(["Male"]));
      else expect(sexes, variant.id).toEqual(new Set(["Female", "Male"]));
    }
  });

  it("uses complete source and claim records with bidirectional references", () => {
    expect(GRAVES_SOURCES).toHaveLength(11);
    expect(new Set(GRAVES_SOURCES.map((source) => source.id)).size).toBe(11);
    expect(new Set(GRAVES_CLAIMS.map((claim) => claim.id)).size).toBe(GRAVES_CLAIMS.length);
    const sourceIds = new Set(GRAVES_SOURCES.map((source) => source.id));
    const claimIds = new Set(GRAVES_CLAIMS.map((claim) => claim.id));

    for (const source of GRAVES_SOURCES) {
      expect(source.completeCitation, source.id).not.toHaveLength(0);
      expect(source.organizationOrJournal, source.id).not.toHaveLength(0);
      expect(source.authors.length, source.id).toBeGreaterThan(0);
      expect(source.officialUrl, source.id).toMatch(/^https:\/\//);
      expect(source.licenseLabel, source.id).not.toHaveLength(0);
      expect(source.reuseNotes, source.id).not.toHaveLength(0);
      expect(source.authorityAssessment, source.id).not.toHaveLength(0);
      expect(source.evidenceClaimIds.length, source.id).toBeGreaterThan(0);
      expect(source.reviewStatus, source.id).toBe("needs_clinician_review");
      expect(source.lastClinicianReview, source.id).toBeNull();
      if (source.publicationYear === null) {
        expect(source.completeCitation, source.id).toContain("Undated");
        expect(source.publicationDateNote, source.id).toBe(
          "Source is explicitly undated; no publication year is claimed.",
        );
      } else expect(source.publicationYear, source.id).toBeGreaterThan(1900);
      expect(source.evidenceClaimIds, source.id).toEqual(
        GRAVES_CLAIMS.filter((claim) => claim.sourceIds.includes(source.id)).map((claim) => claim.id),
      );
    }

    for (const claim of GRAVES_CLAIMS) {
      expect(claim.sourceIds.length, claim.id).toBeGreaterThan(0);
      expect(claim.sourceIds.every((id) => sourceIds.has(id)), claim.id).toBe(true);
      expect(claim.statement, claim.id).not.toHaveLength(0);
      expect(claim.limitation, claim.id).not.toHaveLength(0);
      expect(claim.applicablePopulation, claim.id).not.toHaveLength(0);
      expect(claim.reviewStatus, claim.id).toBe("needs_clinician_review");
      expect(claim.lastClinicianReview, claim.id).toBeNull();
      expect(claim.lastCheckedOn, claim.id).toBe("2026-09-09");
      expect(claim).not.toHaveProperty("sources");
      expect(claim).not.toHaveProperty("checked");
      expect(claim).not.toHaveProperty("category");
    }
    expect(GRAVES_VARIANTS.every((variant) =>
      variant.supportingEvidenceClaimIds.every((id) => claimIds.has(id)),
    )).toBe(true);
  });

  it("keeps IDs, concept types, and runtime clinical-reference labels correct", () => {
    expect(GRAVES_CONCEPTS.map((concept) => concept.conceptType)).toEqual([
      "diagnosis", "workup", "management", "management", "management", "management",
    ]);
    expect(GRAVES_CONCEPTS.every((concept) =>
      concept.learningObjective.length > 80 && !concept.learningObjective.endsWith(" to"),
    )).toBe(true);
    expect(new Set(GRAVES_CONCEPTS.map((concept) => concept.id)).size).toBe(6);
    expect(new Set(GRAVES_VARIANTS.map((variant) => variant.id)).size).toBe(24);
    expect(new Set(GRAVES_VARIANTS.map(
      (variant) => variant.patientPresentationVariantId,
    )).size).toBe(24);
    expect(new Set(GRAVES_CASES.map((clinicalCase) => clinicalCase.id)).size).toBe(24);

    for (const clinicalCase of GRAVES_CASES) {
      expect(clinicalCase.displayName).not.toMatch(/Graves/i);
      const node = clinicalCase.decisionNodes[0]!;
      expect(node.sourceLabels.length, clinicalCase.id).toBeGreaterThan(0);
      expect(node.sourceLabels.every(
        (label) => label.startsWith("Clinical reference:"),
      ), clinicalCase.id).toBe(true);
      expect(clinicalCase.sourceLabels.some(
        (label) => label.startsWith("Clinician-approved frozen wording:"),
      )).toBe(true);
      expect(node.sourceLabels.some((label) => GRAVES_SOURCES.some(
        (source) => label.includes(source.title) && label.includes(source.id),
      ))).toBe(true);
    }
  });

  it("passes case and release schemas without admitting the batch", () => {
    for (const clinicalCase of GRAVES_CASES) {
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success, clinicalCase.id).toBe(true);
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(clinicalCase.decisionNodes[0]!.shuffleAnswers).toBe(true);
      expect(clinicalCase.decisionNodes[0]!.answerChoices.filter(
        (choice) => choice.isCorrect,
      )).toHaveLength(1);
    }
    expect(syntheticClinicalReleaseSchema.safeParse({
      id: "release.development.graves-row-061.unadmitted",
      schemaVersion: 1,
      publicationStatus: "synthetic_unapproved_prototype",
      disclaimer: "Synthetic development content; not clinically approved for public release.",
      concepts: GRAVES_CONCEPTS,
      cases: GRAVES_CASES,
    }).success).toBe(true);
  });
});
