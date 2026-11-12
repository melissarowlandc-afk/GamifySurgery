import {beforeProgramBatch3AcceptanceRelease} from "./question-program-batch3-acceptance-test-support";
import {beforeFlags3AcceptanceManifest} from "./question-flags3-acceptance-test-support";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ANSWER_CHOICE_TIMING_REGISTRY,
  QUESTION_BANK_BATCH2B_REVISIONS,
  QUESTION_BANK_BATCH2B_ROUND2_REVISIONS,
  QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE as source,
  SYNTHETIC_CLINICAL_RELEASE as actualLive,
} from "./index";
import { QUESTION_SHIP_MANIFEST as manifest, type QuestionShipManifest } from "./question-ship-manifest";
import { QUESTION_FLAGS2_ROUND3_SOURCE_RELEASE as acceptedFlags2 } from "./question-flags2-round3-20261105";
import { beforeN3AcceptanceRelease } from "./question-new-n3-acceptance-test-support";

const read = (path: string): string => readFileSync(new URL("../../../" + path, import.meta.url), "utf8");
const sha = (text: string): string => createHash("sha256").update(text).digest("hex");
const intake = JSON.parse(read("tools/question-quality/fixtures/batch2b-acceptance-before-20261105.json")) as {
  release: typeof live;
  manifest: QuestionShipManifest;
  packet: Array<{ id: string; caseId: string; nodeId: string; after: { variantId: string } }>;
  review: Array<{ id: string; verdict: string }>;
};
const changes = JSON.parse(read("tools/question-quality/batch2b-acceptance-changes-20261105.json")) as {
  acceptedRows: QuestionShipManifest["accepted"];
  holds: Array<{ id: string; classification: string; accepted: boolean; itemEdited: boolean; claimIds: string[] }>;
  digestReconciliation: {
    count: number; captures: number;
    rows: Array<{ capture: string; path: string; expected: string; actual: string }>;
    files: Array<{ path: string; beforeSha256: string; currentSha256: string }>;
  };
};
const acceptedIds = [
  "B2B01", "B2B02", "B2B06", "B2B08", "B2B09", "B2B10", "B2B17", "B2B21",
  "B2B23", "B2B24", "B2B25", "B2B30", "B2B33", "B2B39", "B2B40", "B2B42",
];
const heldIds = ["B2B32", "F13"];
const ownRows = manifest.accepted.filter(row => row.sourceView === "batch2b-round2");
const saved = (value: unknown): string | undefined => JSON.stringify(value);
const nodeFor = (release: typeof live, caseId: string, nodeId: string) =>
  release.cases.find(cs => cs.id === caseId)!.decisionNodes.find(node => node.id === nodeId)!;

const live=beforeProgramBatch3AcceptanceRelease(actualLive);

describe("batch 2b manager-directed exact-version acceptance", () => {
  it("accepts exactly the sixteen unconditional PASS tuples and their reviewed headers", () => {
    expect(ownRows.map(row => row.acceptanceId).sort()).toEqual(acceptedIds.slice().sort());
    expect(ownRows).toEqual(changes.acceptedRows);
    expect(new Set(ownRows.map(row => row.caseId)).size).toBe(16);
    for (const row of ownRows) {
      expect(intake.review.find(item => item.id === row.acceptanceId)?.verdict).toBe("PASS");
      expect(row.decision).toBe("docs/research/question-bank-batch2b-manager-decision-20261105.md");
      expect(manifest.headerSources[row.caseId]).toBe("batch2b-round2");
    }
  });

  it.each(acceptedIds)("projects %s exactly, with its historical timing tuple and draft review status", id => {
    const row = ownRows.find(row => row.acceptanceId === id)!;
    const current = live.cases.find(cs => cs.id === row.caseId)!;
    const authored = source.cases.find(cs => cs.id === row.caseId)!;
    const node = nodeFor(live, row.caseId, row.nodeId);
    expect(node).toEqual(nodeFor(source, row.caseId, row.nodeId));
    expect(node).toMatchObject({ questionVariantId: row.questionVariantId, primaryConceptId: row.conceptId, shuffleAnswers: true });
    expect(current.presentation).toBe(authored.presentation);
    expect(current.chiefComplaint).toBe(authored.chiefComplaint);
    expect(current.approvedInstantiationProfiles).toEqual(authored.approvedInstantiationProfiles);
    const revision = [...QUESTION_BANK_BATCH2B_REVISIONS, ...QUESTION_BANK_BATCH2B_ROUND2_REVISIONS]
      .find(candidate => candidate.questionVariantId === row.questionVariantId)!;
    expect(revision.question.reviewStatus).toBe("needs_clinician_review");
    expect(revision.question.lastClinicianReview).toBeNull();
    const timings = ANSWER_CHOICE_TIMING_REGISTRY.filter(timing => timing.caseId === row.caseId &&
      timing.nodeId === row.nodeId && timing.questionVariantId === row.questionVariantId);
    expect(timings).toHaveLength(1);
    const classification = timings[0]!.classification;
    if (classification.kind === "test_choices") {
      expect(classification.choices).toHaveLength(node.answerChoices.length);
      for (const choice of node.answerChoices) {
        expect(classification.choices.find(timing => timing.choiceId === choice.id)?.choiceLabel).toBe(choice.label);
      }
    }
  });

  it("keeps both source-held PASS keys live without editing or accepting either draft", () => {
    expect(changes.holds.map(row => row.id).sort()).toEqual(heldIds.slice().sort());
    for (const hold of changes.holds) {
      expect(hold).toMatchObject({ classification: "hold_on_key", accepted: false, itemEdited: false });
      expect(hold.claimIds.length).toBeGreaterThan(0);
      expect(ownRows.some(row => row.acceptanceId === hold.id)).toBe(false);
      const packet = intake.packet.find(row => row.id === hold.id)!;
      expect(saved(nodeFor(live, packet.caseId, packet.nodeId)))
        .toBe(saved(nodeFor(intake.release, packet.caseId, packet.nodeId)));
    }
  });

  it("parks all twenty-two REVISE drafts, preserving fallback except the later exact flags2 whole-case acceptance", () => {
    const revise = intake.review.filter(row => row.verdict === "REVISE");
    expect(revise).toHaveLength(22);
    for (const item of revise) {
      const packet = intake.packet.find(row => row.id === item.id)!;
      if(manifest.replacements.some(r=>r.replaces===packet.caseId)){
        expect(live.cases.find(c=>c.id===packet.caseId)).toEqual(acceptedFlags2.cases.find(c=>c.id===packet.caseId));
      }else{
        expect(saved(nodeFor(live, packet.caseId, packet.nodeId)))
          .toBe(saved(nodeFor(intake.release, packet.caseId, packet.nodeId)));
      }
      expect(manifest.accepted.some(row => row.caseId === packet.caseId && row.nodeId === packet.nodeId &&
        row.questionVariantId === packet.after.variantId)).toBe(false);
    }
    const g03 = intake.packet.find(row => row.id === "B2B36")!;
    expect(nodeFor(live, g03.caseId, g03.nodeId).questionVariantId)
      .toBe("question.palpable-breast.negative-mammogram-targeted-us.v1.r4");
  });

  it("preserves every historical legacy binding and existing non-N2 acceptance", () => {
    expect(manifest.legacyBindings).toEqual(intake.manifest.legacyBindings);
    for (const old of intake.manifest.accepted.filter(row => !row.acceptanceId.startsWith("review.n2."))) {
      expect(beforeFlags3AcceptanceManifest(manifest).accepted.find(row => row.acceptanceId === old.acceptanceId)).toEqual(old);
    }
    for (const old of intake.release.concepts) {
      expect(live.concepts.find(row => row.id === old.id)).toEqual(old);
    }
    expect(beforeN3AcceptanceRelease(live).cases).toHaveLength(intake.release.cases.length);
  });

  it("composes B2B24 with the exact old second node and gate, without importing a neighboring draft", () => {
    const row = ownRows.find(row => row.acceptanceId === "B2B24")!;
    const current = live.cases.find(cs => cs.id === row.caseId)!;
    const old = intake.release.cases.find(cs => cs.id === row.caseId)!;
    expect(current.decisionNodes).toHaveLength(2);
    expect(current.decisionNodes[0]).toEqual(nodeFor(source, row.caseId, row.nodeId));
    expect(saved(current.decisionNodes[1])).toBe(saved(old.decisionNodes[1]));
    expect(saved(current.decisionNodes[0]!.resultGateAfter)).toBe(saved(old.decisionNodes[0]!.resultGateAfter));
    const exhibit = current.decisionNodes[0]!.exhibit!;
    expect(exhibit.kind).toBe("image");
    if (exhibit.kind === "image") expect(existsSync(new URL("../../../apps/player/public/" + exhibit.assetPath, import.meta.url))).toBe(true);
    const preview = JSON.parse(read("docs/research/question-bank-batch2b-composed-preview-20261105.json")) as {
      label: string; acceptedCount: number; mixedCases: Array<{ caseId: string; sequenceLimitation: string }>;
      cases: Array<{ caseId: string; nodes: Array<{ Options: string[] }> }>;
    };
    expect(preview.label).toContain("key shown first for review only");
    expect(preview.acceptedCount).toBe(16);
    expect(preview.mixedCases).toHaveLength(1);
    expect(preview.mixedCases[0]!.caseId).toBe(row.caseId);
    expect(preview.mixedCases[0]!.sequenceLimitation).toContain("rehearsed/easy");
    expect(preview.cases.find(cs => cs.caseId === row.caseId)!.nodes.every(node => node.Options[0]!.startsWith("**KEY:** "))).toBe(true);
  });

  it("reconciles only the three receipt-authorized scalar hashes in the two captures", () => {
    expect(changes.digestReconciliation.count).toBe(3);
    expect(changes.digestReconciliation.captures).toBe(2);
    expect(changes.digestReconciliation.rows).toHaveLength(3);
    for (const capture of changes.digestReconciliation.files) {
      const current = read(capture.path);
      expect(sha(current)).toBe(capture.currentSha256);
      let reversed = current;
      for (const row of changes.digestReconciliation.rows.filter(row => row.capture === capture.path)) {
        const needle = JSON.stringify(row.path) + ": " + JSON.stringify(row.actual);
        expect(reversed.split(needle)).toHaveLength(2);
        reversed = reversed.replace(needle, JSON.stringify(row.path) + ": " + JSON.stringify(row.expected));
        expect(sha(read(row.path))).toBe(row.actual);
      }
      // Byte-for-byte reversal proves that no other capture field was altered.
      expect(sha(reversed)).toBe(capture.beforeSha256);
    }
  });
});
