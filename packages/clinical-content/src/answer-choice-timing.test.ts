import {QUESTION_PROGRAM_BATCH6_ACCEPTED_TIMING_ENTRIES} from "./question-program-batch6-accepted-20261112";
import {QUESTION_PROGRAM_BATCH5_ACCEPTED_TIMING_ENTRIES} from "./question-program-batch5-accepted-20261111";
import {QUESTION_PROGRAM_BATCH4_ACCEPTED_TIMING_ENTRIES} from "./question-program-batch4-accepted-20261111";
import {QUESTION_PROGRAM_BATCH3_ACCEPTED_TIMING_ENTRIES} from "./question-program-batch3-accepted-20261111";
import {QUESTION_PROGRAM_BATCH2_ACCEPTED_TIMING_ENTRIES} from "./question-program-batch2-accepted-20261111";
import {QUESTION_PROGRAM_BATCH1_ACCEPTED_TIMING_ENTRIES} from "./question-program-batch1-accepted-20261111";
import {QUESTION_N4_ACCEPTED_TIMING_ENTRIES} from "./question-n4-accepted-20261110";
import {QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES} from "./question-flags3-accepted-20261107";
import {QUESTION_STATS1_ACCEPTED_TIMING_ENTRIES,QUESTION_STATS1_RETIRED_FLAGS2_TIMING_ENTRIES,QUESTION_STATS1_RETIRED_FLAGS3_TIMING_ENTRIES} from "./question-stats1-accepted-20261108";
import {QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES} from "./question-flags4-accepted-20261108";
import { QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES } from "./question-new-n3-round3-20261105";
import { QUESTION_NEW_N1_ROUND3_TIMING_ENTRIES } from "./question-new-n1-round3-20261104";
import { QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES } from "./question-flags2-accepted-20261105";
import { QUESTION_FLAGS2_WHOLE_CASE_TIMING_ENTRIES } from "./question-flags2-whole-case-accepted-20261105";
import { QUESTION_NEW_N3_TIMING_ENTRIES } from "./question-new-n3-20261105";
import { QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES } from "./question-new-n3-round2-20261105";
// Ship-gate integration: the complete timing archive is larger than live supply.
import { QUESTION_NEW_N2_ROUND3_TIMING_ENTRIES } from "./question-new-n2-round3-20261104";
import { QUESTION_BANK_BATCH2B_ROUND2_TIMING_ENTRIES } from "./answer-choice-timing";
import { QUESTION_NEW_N2_ROUND3_PRE_RELEASE } from "./synthetic-content";
import { describe, expect, it } from "vitest";
import { ANSWER_CHOICE_TIMING_REGISTRY, LEGACY_QUESTION_QUALITY_TIMING_ENTRIES, RETAINED_QUESTION_QUALITY_DRAFT_TIMING_ENTRIES, LEGACY_QUESTION_QUALITY_BATCH1_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_R3_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_R4_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_R5_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_R6_TIMING_ENTRIES, QUESTION_QUALITY_ADVERSARIAL_R7_TIMING_ENTRIES, QUESTION_FLAG_TIMING_ENTRIES } from "./answer-choice-timing";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { QUESTION_NEW_N1_ROUND2_TIMING_ENTRIES } from "./question-new-n1-round2-20261104";
import { QUESTION_NEW_N2_ROUND2_TIMING_ENTRIES } from "./question-new-n2-round2-20261104";
import { QUESTION_BANK_BATCH2A_ROUND3_TIMING_ENTRIES } from "./answer-choice-timing";
import { QUESTION_FLAG_ROUND2_TIMING_ENTRIES, QUESTION_BANK_BATCH2A_TIMING_ENTRIES, QUESTION_FLAG_ROUND3_TIMING_ENTRIES, QUESTION_BANK_BATCH2A_ROUND2_TIMING_ENTRIES, QUESTION_BANK_BATCH2B_TIMING_ENTRIES } from "./answer-choice-timing";

describe("admitted answer-choice timing classification", () => {
  it("classifies every admitted node exactly once and freezes test-choice labels", () => {
    const nodes = SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((clinicalCase) =>
      clinicalCase.decisionNodes.map((node) => ({ clinicalCase, node })),
    );
    // The 38 replaced N1 rows remain for frozen visits; the two PASS rows are not re-added.
    const preShipCatalogNodeCount = QUESTION_NEW_N2_ROUND3_PRE_RELEASE.cases.reduce((count, cs) => count + cs.decisionNodes.length, 0);
    expect(ANSWER_CHOICE_TIMING_REGISTRY).toHaveLength(preShipCatalogNodeCount + LEGACY_QUESTION_QUALITY_TIMING_ENTRIES.length + RETAINED_QUESTION_QUALITY_DRAFT_TIMING_ENTRIES.length + LEGACY_QUESTION_QUALITY_BATCH1_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_R3_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_R4_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_R5_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_R6_TIMING_ENTRIES.length + QUESTION_QUALITY_ADVERSARIAL_R7_TIMING_ENTRIES.length + QUESTION_FLAG_TIMING_ENTRIES.length + QUESTION_FLAG_ROUND2_TIMING_ENTRIES.length + QUESTION_BANK_BATCH2A_TIMING_ENTRIES.length + QUESTION_FLAG_ROUND3_TIMING_ENTRIES.length + QUESTION_BANK_BATCH2A_ROUND2_TIMING_ENTRIES.length + QUESTION_NEW_N1_ROUND2_TIMING_ENTRIES.length + QUESTION_BANK_BATCH2B_TIMING_ENTRIES.length + QUESTION_NEW_N2_ROUND2_TIMING_ENTRIES.length + QUESTION_BANK_BATCH2A_ROUND3_TIMING_ENTRIES.length + QUESTION_NEW_N1_ROUND3_TIMING_ENTRIES.length + QUESTION_NEW_N2_ROUND3_TIMING_ENTRIES.length + QUESTION_BANK_BATCH2B_ROUND2_TIMING_ENTRIES.length + QUESTION_NEW_N3_TIMING_ENTRIES.length + QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES.length + QUESTION_NEW_N3_ROUND2_TIMING_ENTRIES.length + QUESTION_NEW_N3_ROUND3_TIMING_ENTRIES.length + QUESTION_FLAGS2_WHOLE_CASE_TIMING_ENTRIES.length + QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES.length + QUESTION_STATS1_RETIRED_FLAGS2_TIMING_ENTRIES.length + QUESTION_STATS1_RETIRED_FLAGS3_TIMING_ENTRIES.length + QUESTION_STATS1_ACCEPTED_TIMING_ENTRIES.length + QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES.length + QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES.length + QUESTION_N4_ACCEPTED_TIMING_ENTRIES.length + QUESTION_PROGRAM_BATCH1_ACCEPTED_TIMING_ENTRIES.length + QUESTION_PROGRAM_BATCH2_ACCEPTED_TIMING_ENTRIES.length + QUESTION_PROGRAM_BATCH3_ACCEPTED_TIMING_ENTRIES.length + QUESTION_PROGRAM_BATCH4_ACCEPTED_TIMING_ENTRIES.length + QUESTION_PROGRAM_BATCH5_ACCEPTED_TIMING_ENTRIES.length + QUESTION_PROGRAM_BATCH6_ACCEPTED_TIMING_ENTRIES.length);
    const identities = ANSWER_CHOICE_TIMING_REGISTRY.map(entry => JSON.stringify([entry.caseId, entry.nodeId, entry.questionVariantId]));
    expect(new Set(identities).size).toBe(identities.length);

    for (const { clinicalCase, node } of nodes) {
      const matches = ANSWER_CHOICE_TIMING_REGISTRY.filter(
        (entry) =>
          entry.caseId === clinicalCase.id &&
          entry.nodeId === node.id &&
          entry.questionVariantId === node.questionVariantId,
      );
      expect(matches, `${clinicalCase.id} / ${node.id}`).toHaveLength(1);
      const entry = matches[0]!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices).toEqual(
          node.answerChoices.map((choice) =>
            expect.objectContaining({
              choiceId: choice.id,
              choiceLabel: choice.label,
            }),
          ),
        );
        expect(entry.classification.choices.some((choice) => choice.timing.kind === "test")).toBe(true);
      }
    }
  });

  it("keeps diagnosis-only nodes untimed and explicitly classifies mixed choices", () => {
    const diagnosis = ANSWER_CHOICE_TIMING_REGISTRY.find(
      (entry) => entry.nodeId === "node.achalasia.water-and-solids.2",
    );
    expect(diagnosis?.classification).toEqual({ kind: "no_test" });

    const mixed = ANSWER_CHOICE_TIMING_REGISTRY.find(
      (entry) => entry.nodeId === "node.fhh.suggestive-results-confirmation.v1",
    );
    expect(mixed?.classification).toMatchObject({ kind: "test_choices" });
    if (mixed?.classification.kind === "test_choices") {
      expect(mixed.classification.choices.map((choice) => choice.timing.kind)).toEqual([
        "test",
        "no_test",
        "no_test",
        "no_test",
      ]);
    }
  });
});

import {QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES} from "./question-harden1-n3r4-accepted-20261110";
