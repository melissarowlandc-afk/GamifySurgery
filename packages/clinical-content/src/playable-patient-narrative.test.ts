import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";

const MULTI_PATIENT_FRAMING = [
  /\bwhich patient\b/i,
  /\b(?:four|several|multiple) (?:stable )?(?:adults|patients)\b/i,
  /\b(?:reviewing|counseling) patients\b/i,
  /\bwhich (?:presentation|referral profile)\b/i,
];

const PATIENT_REFERENCE = /\b(?:patient|adult|woman|man|they|she|he)\b/i;
const STORY_CUE =
  /\b(?:asks?|wants?|reports?|returns?|noticed|comes?|brings?|discuss|reviews?|hoping)\b/i;
const ALTERNATE_PATIENT_CHOICE =
  /^(?:a|an|fit) (?:patient|adult|woman|man)\b/i;

function normalized(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

describe("playable one-patient narratives", () => {
  it("anchors every admitted case to one patient with a brief story", () => {
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      if (clinicalCase.id.startsWith("case.l2.")) continue;
      expect(clinicalCase.presentation, clinicalCase.id).toMatch(
        PATIENT_REFERENCE,
      );
      expect(clinicalCase.presentation, clinicalCase.id).toMatch(STORY_CUE);
      for (const pattern of MULTI_PATIENT_FRAMING) {
        expect(clinicalCase.presentation, clinicalCase.id).not.toMatch(
          pattern,
        );
      }
    }
  });

  it("keeps decision prompts tied to that encounter instead of restating the chart", () => {
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      if (clinicalCase.id.startsWith("case.l2.")) continue;
      const firstPresentationSentence =
        clinicalCase.presentation.match(/^.*?[.!?](?:\s|$)/)?.[0] ?? "";
      for (const node of clinicalCase.decisionNodes) {
        for (const pattern of MULTI_PATIENT_FRAMING) {
          expect(node.stem, node.id).not.toMatch(pattern);
        }
        if (firstPresentationSentence.length >= 50) {
          expect(normalized(node.stem), node.id).not.toContain(
            normalized(firstPresentationSentence),
          );
        }
      }
    }
  });

  it("uses alternative findings rather than a lineup of different patients", () => {
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      for (const node of clinicalCase.decisionNodes) {
        for (const choice of node.answerChoices) {
          expect(choice.label, `${node.id}:${choice.id}`).not.toMatch(
            ALTERNATE_PATIENT_CHOICE,
          );
        }
      }
    }
  });

  it("keeps explicitly female stories attached to female chart identities", () => {
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      if (/\b(?:woman|she|her)\b/i.test(clinicalCase.presentation)) {
        expect(
          clinicalCase.prototypeDemographics?.sexLabel,
          clinicalCase.id,
        ).toBe("Female");
      }
    }
  });
});
