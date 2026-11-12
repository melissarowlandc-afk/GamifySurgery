import {QUESTION_PROGRAM_BATCH6_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch6Concepts} from "./question-program-batch6-accepted-20261112";
import {QUESTION_PROGRAM_BATCH5_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch5Concepts} from "./question-program-batch5-accepted-20261111";
import {QUESTION_PROGRAM_BATCH4_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch4Concepts} from "./question-program-batch4-accepted-20261111";
import {QUESTION_PROGRAM_BATCH3_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch3Concepts} from "./question-program-batch3-accepted-20261111";
import {QUESTION_PROGRAM_BATCH2_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch2Concepts} from "./question-program-batch2-accepted-20261111";
import {QUESTION_PROGRAM_BATCH1_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch1Concepts} from "./question-program-batch1-accepted-20261111";
import {QUESTION_N4_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionN4Concepts} from "./question-n4-accepted-20261110";
import {QUESTION_HARDEN1_ACCEPTANCE_SOURCE as harden1, QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE as n3r4, withAcceptedHarden1N3r4Concepts} from "./question-harden1-n3r4-accepted-20261110";
import {QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE as flags3, withAcceptedQuestionFlags3Concepts} from "./question-flags3-accepted-20261107";
import {QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE as stats1,withAcceptedQuestionStats1Concepts} from "./question-stats1-accepted-20261108";
import {QUESTION_FLAGS4_ACCEPTED_SOURCE_RELEASE as flags4} from "./question-flags4-accepted-20261108";
import {beforeFlags3AcceptanceManifest} from "./question-flags3-acceptance-test-support";
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { QUESTION_SHIP_MANIFEST as manifest, type QuestionShipManifest } from "./question-ship-manifest";
import { questionShipManifestIssues } from "./question-ship-manifest-validation";
import { projectManagerAcceptedQuestions } from "./question-ship-projection";
import { QUESTION_NEW_N3_PRE_RELEASE as authoringCatalog, SYNTHETIC_CLINICAL_RELEASE as live,
 QUESTION_CATALOG_RELEASE as completeCatalog, QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE as n3,
 QUESTION_FLAGS_PRE_REVISION_RELEASE as legacy, QUESTION_NEW_N1_PRE_RELEASE as flags,
 QUESTION_BANK_BATCH2A_ROUND3_RELEASE as batch2a, QUESTION_NEW_N2_ROUND3_PRE_RELEASE as n1,
 QUESTION_NEW_N1_ROUND3_PRE_RELEASE as n2, QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE as batch2b } from "./synthetic-content";
import { withAcceptedQuestionBankBatch2bRound2Concepts } from "./question-bank-batch2b-round2-20261104";
import { withAcceptedQuestionFlags2Concepts } from "./question-flags2-accepted-20261105";
import { QUESTION_FLAGS2_ROUND1_SOURCE_RELEASE as flags2 } from "./question-flags2-20261105";
import { QUESTION_FLAGS2_ROUND3_SOURCE_RELEASE as flags2round3 } from "./question-flags2-round3-20261105";
import { withAcceptedQuestionFlags2WholeCaseConcepts } from "./question-flags2-whole-case-accepted-20261105";
import { withAcceptedQuestionNewN3Round2Concepts } from "./question-new-n3-round2-20261105";
// Match the production registry: exact accepted rewrite meanings are appended;
// unaccepted draft meanings are not added merely for this validation fixture.
const n3Catalog = withAcceptedQuestionNewN3Round2Concepts(completeCatalog,authoringCatalog.concepts);
const priorCatalog = withAcceptedQuestionFlags3Concepts(withAcceptedQuestionFlags2WholeCaseConcepts(withAcceptedQuestionStats1Concepts(withAcceptedQuestionFlags2Concepts(withAcceptedQuestionBankBatch2bRound2Concepts(n3Catalog)))));
const batch2Catalog = withAcceptedQuestionProgramBatch2Concepts(withAcceptedQuestionProgramBatch1Concepts(withAcceptedQuestionN4Concepts(withAcceptedHarden1N3r4Concepts(priorCatalog))));
const catalog=withAcceptedQuestionProgramBatch6Concepts(withAcceptedQuestionProgramBatch5Concepts(withAcceptedQuestionProgramBatch4Concepts(withAcceptedQuestionProgramBatch3Concepts(batch2Catalog))));
const views = {...QUESTION_PROGRAM_BATCH6_ACCEPTED_SOURCE_VIEWS,...QUESTION_PROGRAM_BATCH5_ACCEPTED_SOURCE_VIEWS,...QUESTION_PROGRAM_BATCH4_ACCEPTED_SOURCE_VIEWS,...QUESTION_PROGRAM_BATCH3_ACCEPTED_SOURCE_VIEWS,...QUESTION_PROGRAM_BATCH2_ACCEPTED_SOURCE_VIEWS,...QUESTION_PROGRAM_BATCH1_ACCEPTED_SOURCE_VIEWS,...QUESTION_N4_ACCEPTED_SOURCE_VIEWS, "harden1-round1":harden1,"n3-round4":n3r4, "flags4-accepted":flags4,"stats1-accepted":stats1,"flags3-accepted":flags3, legacy, "flags-round3": flags, "batch2a-round3": batch2a, "n1-round3": n1, "n2-round2": n2, "batch2b-round2": batch2b, "flags2-round1": flags2, "flags2-round3":flags2round3, "n3-round3":n3 };
const readReview = (name: string) => JSON.parse(readFileSync(new URL("../../../docs/research/" + name, import.meta.url), "utf8")) as Array<{id: string; verdict: string}>;

describe("projection-only manager shipping manifest", () => {
 it("validates all legacy and accepted bindings at build/test time", () => {
  expect(questionShipManifestIssues(catalog, legacy, views)).toEqual([]);
  expect(manifest.legacyBindings).toHaveLength(1423);
  // Separate exact-version tests pin the sixteen 2b rows and the single G06
  // row; every earlier lane retains its exact acceptance checks below.
  expect(beforeFlags3AcceptanceManifest(manifest).accepted.filter(row => !["batch2b-round2", "flags2-round1", "flags2-round3", "n3-round3"].includes(row.sourceView))).toHaveLength(45);
  expect(live.cases).toHaveLength(1340);
  expect(catalog.cases).toHaveLength(1229);
 });
 it("ships exactly twelve N1 review-three acceptances and parks all twenty-eight returned drafts", () => {
  const review = readReview("question-new-n1-review3-20261104.json");
  const rows = manifest.accepted.filter(row => row.acceptanceId.startsWith("review.n1."));
  expect(rows.map(row => row.acceptanceId).sort()).toEqual(review.filter(row => row.verdict === "PASS").map(row => row.id).sort());
  expect(review.filter(row => row.verdict === "REVISE")).toHaveLength(28);
  for (const row of review) {
   const source = n1.cases.find(cs => cs.decisionNodes.some(node => node.questionVariantId === row.id.replace("review.", "question.")))!;
   expect(source, row.id).toBeDefined();
   const current = live.cases.find(cs => cs.id === source.id);
   if (row.verdict === "PASS") expect(current).toEqual(source);
   else { expect(current).toBeUndefined(); expect(catalog.cases.some(cs => cs.id === source.id)).toBe(true); }
  }
  expect(rows.every(row => row.decision === "docs/research/question-new-manager-decision-20261105.md")).toBe(true);
 });
 it("ships only source-screened N2 review-three PASS versions and parks all returned/source-held drafts", () => {
  const review = readReview("question-new-n2-review3-20261104.json");
  const disposition = JSON.parse(readFileSync(new URL("../../../docs/research/question-new-n2-source-hold-disposition-20261105.json", import.meta.url), "utf8")) as {
   acceptedIds: string[]; sourceHeldPassIds: string[]; parkedReviseIds: string[];
   mapping: Array<{id: string; classification: string; accepted: boolean; heldClaimIds: string[]; itemEdited: boolean}>;
  };
  expect(review.filter(row => row.verdict === "PASS")).toHaveLength(19);
  expect(disposition.mapping).toHaveLength(10);
  expect(disposition.mapping.filter(row => row.classification === "hold_on_key")).toHaveLength(5);
  expect(disposition.mapping.every(row => !row.itemEdited)).toBe(true);
  const rows = manifest.accepted.filter(row => row.acceptanceId.startsWith("review.n2."));
  expect(rows).toHaveLength(14);
  expect(rows.map(row => row.acceptanceId).sort()).toEqual(disposition.acceptedIds.slice().sort());
  expect(rows.every(row => row.decision === "docs/research/question-new-manager-decision-20261105.md")).toBe(true);
  expect(disposition.acceptedIds.slice().sort()).toEqual(review.filter(row => row.verdict === "PASS" && !disposition.sourceHeldPassIds.includes(row.id)).map(row => row.id).sort());
  expect(disposition.parkedReviseIds.slice().sort()).toEqual(review.filter(row => row.verdict === "REVISE").map(row => row.id).sort());
  expect(disposition.parkedReviseIds).toHaveLength(20);
  for (const row of rows) expect(live.cases.find(cs => cs.id === row.caseId)).toEqual(catalog.cases.find(cs => cs.id === row.caseId));
  for (const cs of catalog.cases.filter(cs => cs.id.startsWith("case.n2.") && !rows.some(row => row.caseId === cs.id))) expect(live.cases.some(row => row.id === cs.id)).toBe(false);
  for (const row of disposition.mapping.filter(row => !row.accepted)) {
   expect(row.heldClaimIds.length).toBeGreaterThan(0);
   expect(rows.some(accepted => accepted.acceptanceId === row.id)).toBe(false);
  }
 });
 it("ships the exact directed flags and batch-2a versions, with legacy nodes for all other rewrites", () => {
  expect(manifest.accepted.filter(row => /^F\d\d$/.test(row.acceptanceId)).map(row => row.acceptanceId).sort()).toEqual(["F01","F03","F05","F09","F10","F11","F12","F15","F17"]);
  expect(beforeFlags3AcceptanceManifest(manifest).accepted.filter(row => /^B2A/.test(row.acceptanceId)).map(row => row.acceptanceId).sort()).toEqual(["B2A01","B2A02","B2A04","B2A05","B2A06","B2A07","B2A08","B2A09","B2A10","B2A11"]);
  for (const row of manifest.accepted) {
   const replacement=manifest.replacements.find(r=>r.replaces===row.caseId) ??
     manifest.topicConsolidations.find(r=>r.replaces.includes(row.caseId));
   if(replacement&&manifest.accepted.find(r=>r.questionVariantId===replacement.with)!.caseId!==row.caseId){
    const accepted=manifest.accepted.find(r=>r.questionVariantId===replacement.with)!;
    expect(live.cases.some(cs=>cs.id===row.caseId)).toBe(false);
    expect(live.cases.find(cs=>cs.id===accepted.caseId)).toEqual(views[accepted.sourceView as keyof typeof views]!.cases.find(cs=>cs.id===accepted.caseId));
    continue;
   }
   const node = live.cases.find(cs => cs.id === row.caseId)!.decisionNodes.find(node => node.id === row.nodeId)!;
   expect(node).toMatchObject({ questionVariantId: row.questionVariantId, primaryConceptId: row.conceptId });
  }
  for (const cs of legacy.cases) for (const node of cs.decisionNodes) {
   const relation = manifest.replacements.find(row => row.replaces === cs.id) ??
     manifest.topicConsolidations.find(row => row.replaces.includes(cs.id));
   if(relation){
    const accepted=manifest.accepted.find(row=>row.questionVariantId===relation.with)!;
    expect(live.cases.find(row=>row.id===accepted.caseId)).toEqual(views[accepted.sourceView as keyof typeof views]!.cases.find(row=>row.id===accepted.caseId));
    if(accepted.caseId!==cs.id)expect(live.cases.some(row=>row.id===cs.id)).toBe(false);
    continue;
   }
   if (!manifest.accepted.some(row => row.caseId === cs.id && row.nodeId === node.id)) expect(live.cases.find(row => row.id === cs.id)!.decisionNodes.find(row => row.id === node.id)).toEqual(node);
  }
  const mixed = live.cases.find(cs => cs.id === "case.achalasia.night-regurgitation")!;
  expect(mixed.decisionNodes[0]).toEqual(legacy.cases.find(cs => cs.id === mixed.id)!.decisionNodes[0]);
  expect(mixed.decisionNodes[1]!.questionVariantId).toBe("question.achalasia.manometric-recognition.v2.r7");
 });
 it.each(["missing-view", "duplicate-node", "unknown-version", "changed-concept", "unknown-node"] as const)
 ("reports %s in tests while runtime warns and preserves the affected legacy case", kind => {
  const row = manifest.accepted.find(row => row.acceptanceId === "F01")!;
  const bad: QuestionShipManifest = { ...manifest, accepted: [{ ...row }] };
  if (kind === "missing-view") bad.accepted = [{ ...row, sourceView: "missing" }];
  if (kind === "duplicate-node") bad.accepted = [row, row];
  if (kind === "unknown-version") bad.accepted = [{ ...row, questionVariantId: row.questionVariantId + ".unknown" }];
  if (kind === "changed-concept") bad.accepted = [{ ...row, conceptId: "concept.unknown" }];
  if (kind === "unknown-node") bad.accepted = [{ ...row, nodeId: row.nodeId + ".unknown" }];
  expect(questionShipManifestIssues(catalog, legacy, views, bad).length).toBeGreaterThan(0);
  const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
  try {
   let projected: typeof live | undefined;
   expect(() => { projected = projectManagerAcceptedQuestions(catalog, legacy, views, bad); }).not.toThrow();
   expect(projected!.cases.find(cs => cs.id === row.caseId)).toEqual(legacy.cases.find(cs => cs.id === row.caseId));
   expect(warning).toHaveBeenCalledWith(expect.stringContaining("retaining legacy case"));
  } finally { warning.mockRestore(); }
 });
 it("retains the legacy bank when source views are unavailable and omits unverifiable new additions", () => {
  expect(questionShipManifestIssues(catalog, legacy, {})).toContain("missing or changed legacy view");
  const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
  try { expect(projectManagerAcceptedQuestions({ ...catalog, cases: [] }, legacy, {}).cases).toEqual(legacy.cases); expect(warning).toHaveBeenCalled(); }
  finally { warning.mockRestore(); }
 });
 it("detects duplicate source/header nodes and falls back without a runtime exception", () => {
  const row = manifest.accepted.find(row => row.acceptanceId === "F01")!;
  const source = flags.cases.find(cs => cs.id === row.caseId)!;
  const corrupted = { ...views, "flags-round3": { ...flags, cases: flags.cases.map(cs => cs.id === source.id ? { ...cs, decisionNodes: [...cs.decisionNodes, cs.decisionNodes[0]!] } : cs) } };
  expect(questionShipManifestIssues(catalog, legacy, corrupted).some(issue => issue.includes("duplicate"))).toBe(true);
  const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
  try { expect(projectManagerAcceptedQuestions(catalog, legacy, corrupted).cases.find(cs => cs.id === row.caseId)).toEqual(legacy.cases.find(cs => cs.id === row.caseId)); expect(warning).toHaveBeenCalled(); }
  finally { warning.mockRestore(); }
 });
 it("does not confer clinical approval, mutate sources or discard historical concepts", () => {
  const before = JSON.stringify({ catalog, views });
  const projected = projectManagerAcceptedQuestions(catalog, legacy, views);
  expect(projected.cases).toEqual(live.cases);
  expect(projected.concepts).toBe(catalog.concepts);
  expect(JSON.stringify({ catalog, views })).toBe(before);
  expect(manifest.clinicalApproval).toBe(false);
  expect(projected.publicationStatus).toBe("synthetic_unapproved_prototype");
 });
});
