import {describe, expect, it, vi} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as live} from "./synthetic-content";
import {QUESTION_PROGRAM_BATCH2_ACCEPTED_CASES as cases, QUESTION_PROGRAM_BATCH2_ACCEPTED_ROWS as rows,
  QUESTION_PROGRAM_BATCH2_CONSOLIDATIONS as consolidations, QUESTION_PROGRAM_BATCH2_RETAINED_CASES as retired} from "./question-program-batch2-accepted-20261111";
import {projectManagerAcceptedQuestions} from "./question-ship-projection";
import {resolveQuestionShipCaseReplacements} from "./question-ship-case-replacements";
import {questionShipManifestIssues} from "./question-ship-manifest-validation";
import type {QuestionShipManifest} from "./question-ship-manifest";

function fixture() {
  const group = structuredClone(consolidations[0]!);
  const target = rows.find(row => row.questionVariantId === group.with)!;
  const source = cases.find(cs => cs.id === target.caseId)!;
  const old = retired.filter(cs => group.replaces.includes(cs.id));
  const control = retired.find(cs => !group.replaces.includes(cs.id))!;
  const legacy = {...live, cases:[...old, control]};
  const view = {...live, cases:[source]};
  const views = {legacy, [target.sourceView]:view};
  const manifest: QuestionShipManifest = {
    legacyBindings:legacy.cases.flatMap(cs => cs.decisionNodes.map(node => [cs.id, node.id, node.questionVariantId, node.primaryConceptId] as const)),
    accepted:rows.filter(row => row.caseId === source.id), headerSources:{[source.id]:target.sourceView},
    replacements:[], topicConsolidations:[group],
  };
  return {group, target, source, old, control, legacy, views, manifest};
}

describe("explicit topic-program whole-case consolidation", () => {
  it("replaces all seven duplicate legacy cases with one complete accepted pair", () => {
    const f = fixture();
    const snapshot = structuredClone(f);
    expect(questionShipManifestIssues(live, f.legacy, f.views, f.manifest)).toEqual([]);
    const resolved = resolveQuestionShipCaseReplacements(live, f.legacy, f.views, f.manifest);
    expect(resolved.issues).toEqual([]);
    expect([...resolved.byLegacy.keys()]).toEqual(f.group.replaces);
    const projected = projectManagerAcceptedQuestions(live, f.legacy, f.views, f.manifest);
    expect(projected.cases).toEqual([f.source, f.control]);
    expect(projected.concepts).toEqual(live.concepts);
    expect(f).toEqual(snapshot);
  });

  it("admits the target once when legacy iteration is reversed", () => {
    const f = fixture();
    const projected = projectManagerAcceptedQuestions(live, {...f.legacy, cases:[...f.legacy.cases].reverse()}, f.views, f.manifest);
    expect(projected.cases.filter(cs => cs.id === f.source.id)).toEqual([f.source]);
    expect(projected.cases).toHaveLength(2);
  });

  it.each(["missing-legacy", "duplicate-alias", "duplicate-group", "unmarked-duplicates", "conflicting-single",
    "missing-decision", "wrong-program", "missing-view", "partial-source", "wrong-header"] as const)
  ("retains every original case atomically for %s", defect => {
    const f = fixture();
    const group = f.manifest.topicConsolidations![0]!;
    if (defect === "missing-legacy") group.replaces = [...group.replaces, "case.missing"];
    if (defect === "duplicate-alias") group.replaces = [...group.replaces, f.old[0]!.decisionNodes[0]!.questionVariantId];
    if (defect === "duplicate-group") f.manifest.topicConsolidations = [group, structuredClone(group)];
    if (defect === "unmarked-duplicates") {
      f.manifest.topicConsolidations = [];
      f.manifest.replacements = group.replaces.map(replaces => ({replaces, with:group.with}));
    }
    if (defect === "conflicting-single") f.manifest.replacements = [{replaces:f.old[0]!.id, with:f.source.decisionNodes[1]!.questionVariantId}];
    if (defect === "missing-decision") group.decision = "";
    if (defect === "wrong-program") group.program = "other" as typeof group.program;
    if (defect === "missing-view") f.manifest.accepted = f.manifest.accepted.map(row => ({...row, sourceView:"missing"}));
    if (defect === "partial-source") f.manifest.accepted = f.manifest.accepted.slice(0,1);
    if (defect === "wrong-header") f.manifest.headerSources = {[f.source.id]:"legacy"};
    expect(questionShipManifestIssues(live, f.legacy, f.views, f.manifest).some(issue => issue.includes("replacement"))).toBe(true);
    const warnings = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const projected = projectManagerAcceptedQuestions(live, f.legacy, f.views, f.manifest);
      expect(projected.cases).toEqual(f.legacy.cases);
      expect(warnings).toHaveBeenCalled();
    } finally {
      warnings.mockRestore();
    }
  });
});
