import {beforeProgramBatch3AcceptanceRelease,beforeProgramBatch3AcceptanceManifest,beforeProgramBatch3AcceptanceTimings} from "./question-program-batch3-acceptance-test-support";
import {describe, expect, it} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive, QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as actualManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as actualTiming} from "./answer-choice-timing";
import {QUESTION_PROGRAM_BATCH2_ACCEPTED_CASES as cases, QUESTION_PROGRAM_BATCH2_ACCEPTED_ROWS as rows,
  QUESTION_PROGRAM_BATCH2_ACCEPTED_QUESTIONS as questions, QUESTION_PROGRAM_BATCH2_ACCEPTED_SOURCE_VIEWS as views,
  QUESTION_PROGRAM_BATCH2_RETAINED_CASES as retired, QUESTION_PROGRAM_BATCH2_REPLACEMENTS as replacements,
  QUESTION_PROGRAM_BATCH2_CONSOLIDATIONS as consolidations, QUESTION_PROGRAM_BATCH2_FROZEN_PRESERVATION as frozen,
  QUESTION_PROGRAM_BATCH2_ACCEPTED_TEST_ORDER_RECORDS as orders, QUESTION_PROGRAM_BATCH2_CLAIMS as claims} from "./question-program-batch2-accepted-20261111";
import {beforeProgramBatch2AcceptanceRelease as previous, beforeProgramBatch2AcceptanceManifest as previousManifest,
  beforeProgramBatch2AcceptanceTimings as previousTimings, beforeProgramBatch2AcceptanceSource as previousSource} from "./question-program-batch2-acceptance-test-support";
const live=beforeProgramBatch3AcceptanceRelease(actualLive);
const manifest=beforeProgramBatch3AcceptanceManifest(actualManifest);
const timing=beforeProgramBatch3AcceptanceTimings(actualTiming);
const read = (path: string) => JSON.parse(readFileSync(new URL("../../../" + path, import.meta.url), "utf8"));
const before = read("tools/question-quality/fixtures/question-topic-acceptance-batch2-before-20261111.json");
const decisions = read("docs/research/question-topic-acceptance-batch2-dispositions-20261111.json");
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

describe("topic batch2 complete exact PASS acceptance", () => {
  it("accounts for43 requested nodes with26 complete-case acceptances and17 skipped contexts", () => {
    expect(decisions.requested).toBe(43);
    expect(decisions.accepted).toBe(26);
    expect(decisions.skipped).toBe(17);
    expect(cases).toHaveLength(20);
    expect(rows.map(row => row.nodeId).sort()).toEqual(decisions.items.filter((row: {status: string}) => row.status === "accepted")
      .map((row: {nodeId: string}) => row.nodeId).sort());
    for (const cs of cases) for (const node of cs.decisionNodes)
      expect(rows.filter(row => row.caseId === cs.id && row.nodeId === node.id && row.questionVariantId === node.questionVariantId)).toHaveLength(1);
    for (const item of decisions.items.filter((row: {status: string}) => row.status === "skipped")) {
      expect(item.unlistedSiblingIds.length).toBeGreaterThan(0);
      expect(live.cases.some(cs => cs.decisionNodes.some(node => node.id === item.nodeId))).toBe(false);
    }
  });

  it("pins193 authority rows and the1174-case/1491-node/654-meaning default", () => {
    expect(manifest.id).toBe("question-ship.2026-11-11.v11");
    expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.accepted).toHaveLength(193);
    expect(manifest.replacements).toHaveLength(12);
    expect(manifest.topicConsolidations).toEqual(consolidations);
    expect(manifest.legacyBindings).toHaveLength(1423);
    expect(digest(manifest)).toBe("8eee58d13a936d3771573f705edc66e20852f8fa3a20f1f11dcd4219e052352c");
    expect(live.cases).toHaveLength(1174);
    expect(live.cases.flatMap(cs => cs.decisionNodes)).toHaveLength(1491);
    expect(live.concepts).toHaveLength(654);
    expect(new Set(live.cases.flatMap(cs => cs.decisionNodes.map(node => node.primaryConceptId))).size).toBe(497);
    expect(digest(live)).toBe("751b750e5cd139229a933570244fc5c613f4d60f7fa626bf5e7eb4fc5fa4feab");
    expect(previousManifest(manifest)).toEqual(before.manifest);
    expect(digest(catalog)).toBe(before.catalogSha256);
  });

  it("restores all631 prior meaning definitions and every untouched default row exactly", () => {
    const restored = previous(live);
    expect(restored.cases).toHaveLength(1167);
    expect(restored.concepts).toHaveLength(631);
    expect(digest(restored)).toBe(before.default.sha256);
    expect(retired).toHaveLength(13);
    expect(replacements).toHaveLength(6);
    expect(consolidations).toHaveLength(1);
    expect(consolidations[0]!.replaces).toHaveLength(7);
    for (const cs of retired) {
      expect(live.cases.some(current => current.id === cs.id)).toBe(false);
      expect(restored.cases.find(current => current.id === cs.id)).toEqual(cs);
      for (const node of cs.decisionNodes) expect(live.concepts.some(concept => concept.id === node.primaryConceptId)).toBe(true);
    }
  });

  it("preserves every scored field, reviewed question, option, explanation and ID", () => {
    for (const cs of cases) {
      const captured = before.topics.flatMap((topic: {candidates: Array<{case: {id: string}}>}) => topic.candidates)
        .find((row: {case: {id: string}}) => row.case.id === cs.id);
      const adjustment = decisions.stageAdjustments.find((row: {caseId: string}) => row.caseId === cs.id);
      expect(cs).toEqual({...captured.case, earliestFacilityStage:adjustment?.after ?? captured.case.earliestFacilityStage,
        learningSummary:cs.decisionNodes.map(node => node.explanation).join(" ")});
      expect(digest(cs)).toBe(frozen.find(record => record.caseId === cs.id)!.retainedCaseSha256);
      for (const node of cs.decisionNodes) {
        const source = captured.records.find((record: {node: {id: string}}) => record.node.id === node.id);
        const question = questions.find(question => question.id === node.questionVariantId)!;
        expect(node).toEqual(source.node);
        expect(question).toEqual(source.question);
        expect(source.evidence.record.verdict).toBe("PASS");
        expect(question.reviewStatus).toBe("needs_clinician_review");
        expect(question.lastClinicianReview).toBeNull();
        expect(node.shuffleAnswers).toBe(true);
        expect(node.resultGateAfter).toBeNull();
        expect(node.answerChoices.every(choice => choice.serviceRequest === null)).toBe(true);
        for (const claimId of question.supportingEvidenceClaimIds) expect(claims.some(claim => claim.id === claimId)).toBe(true);
      }
    }
    expect(decisions.stageAdjustments).toEqual([{caseId:"case.vascular-aorta.screening-review.v2", before:0, after:1,
      reason:"Preserve the existing registered meaning's facility-stage floor."}]);
  });

  it("binds four static source views without runtime topic-worker imports", () => {
    for (const record of decisions.sourceViews) expect(digest(views[record.name]!)).toBe(record.sha256);
    expect(Object.keys(views)).toHaveLength(4);
    const wrapper = readFileSync(new URL("./question-program-batch2-accepted-20261111.ts", import.meta.url), "utf8");
    expect(wrapper).not.toMatch(/from\s+["']\.\/question-topic-/);
  });

  it("preserves2317 estimates and exports33 exact deferred diagnostic tuples", () => {
    expect(timing).toHaveLength(2343);
    expect(previousTimings(timing)).toEqual(before.timing);
    expect(orders).toHaveLength(33);
    for (const order of orders) {
      expect(order.disposition).toEqual({kind:"not_executed", reason:"future_planned"});
      const node = cases.find(cs => cs.id === order.caseId)!.decisionNodes.find(node => node.id === order.nodeId)!;
      expect(node.questionVariantId).toBe(order.questionVariantId);
      expect(node.answerChoices.find(choice => choice.id === order.choiceId)!.label).toBe(order.choiceLabel);
    }
  });

  it("rejects unrelated content, authority and timing drift before restoring historical epochs", () => {
    const changed = structuredClone(live);
    changed.cases.find(cs => !cases.some(accepted => accepted.id === cs.id))!.presentation += " drift";
    expect(() => previous(changed)).toThrow();
    const authority = structuredClone(manifest);
    authority.accepted[0]!.conceptId += ".drift";
    expect(() => previousManifest(authority)).toThrow();
    const estimates = structuredClone(timing);
    estimates[0]!.nodeId += ".drift";
    expect(() => previousTimings(estimates)).toThrow();
  });

  it("binds twelve owned source deltas through the original preimages", () => {
    const migration = read("tools/question-quality/fixtures/question-topic-acceptance-batch2-source-migration-20261111.json");
    expect(migration.files).toHaveLength(12);
  const pinBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-program-batch2-release-source-pins-20261111.json",import.meta.url));
  expect(createHash("sha256").update(pinBytes).digest("hex")).toBe("261f749bdc81552c18ec2403f36a444d48fb2124faf56d072b640f8e9261f97c");
  const releasePins=JSON.parse(pinBytes.toString("utf8")) as {capturedFixtureSha256:string;testSupportSha256:string;paths:Array<{path:string;mainBeforeSha256:string;mainAfterSha256:string;requiredReleaseSha256:string}>};
  expect(createHash("sha256").update(readFileSync(new URL("../../../tools/question-quality/fixtures/question-topic-acceptance-batch2-source-migration-20261111.json",import.meta.url))).digest("hex")).toBe(releasePins.capturedFixtureSha256);
  expect(createHash("sha256").update(readFileSync(new URL("./question-program-batch2-acceptance-test-support.ts",import.meta.url))).digest("hex")).toBe(releasePins.testSupportSha256);
  expect(releasePins.paths).toHaveLength(2);
  for(const pin of releasePins.paths){const row=migration.files.find((row:{path:string})=>row.path===pin.path);expect(row).toBeDefined();
   expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
   expect(createHash("sha256").update(readFileSync(new URL("../../../"+pin.path,import.meta.url))).digest("hex")).toBe(pin.requiredReleaseSha256);}

    for (const row of migration.files) {
      expect(row.path).not.toMatch(/\/question-topic-/);
      const current = readFileSync(new URL("../../../" + row.path, import.meta.url), "utf8");
      expect(createHash("sha256").update(previousSource(row.path, current)).digest("hex")).toBe(row.beforeSha256);
    }
  });
});
