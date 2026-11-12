import {describe, expect, it} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {SYNTHETIC_CLINICAL_RELEASE as currentLive, QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as currentTiming} from "./answer-choice-timing";
import {
  QUESTION_PROGRAM_BATCH4_ACCEPTED_CASES as cases, QUESTION_PROGRAM_BATCH4_ACCEPTED_ROWS as rows,
  QUESTION_PROGRAM_BATCH4_ACCEPTED_QUESTIONS as questions, QUESTION_PROGRAM_BATCH4_ACCEPTED_SOURCE_VIEWS as views,
  QUESTION_PROGRAM_BATCH4_RETAINED_CASES as retired, QUESTION_PROGRAM_BATCH4_REPLACEMENTS as replacements,
  QUESTION_PROGRAM_BATCH4_CONSOLIDATIONS as consolidations, QUESTION_PROGRAM_BATCH4_FROZEN_PRESERVATION as frozen,
  QUESTION_PROGRAM_BATCH4_ACCEPTED_TEST_ORDER_RECORDS as orders, QUESTION_PROGRAM_BATCH4_CLAIMS as claims,
} from "./question-program-batch4-accepted-20261111";
import {
  beforeProgramBatch4AcceptanceRelease as previous, beforeProgramBatch4AcceptanceManifest as previousManifest,
  beforeProgramBatch4AcceptanceTimings as previousTimings, beforeProgramBatch4AcceptanceSource as previousSource,
  withProgramBatch4PresentationCorrections as correctPresentation,
} from "./question-program-batch4-acceptance-test-support";

import {beforeProgramBatch5AcceptanceRelease, beforeProgramBatch5AcceptanceManifest, beforeProgramBatch5AcceptanceTimings} from "./question-program-batch5-acceptance-test-support";
const live = beforeProgramBatch5AcceptanceRelease(currentLive);
const manifest = beforeProgramBatch5AcceptanceManifest(currentManifest);
const timing = beforeProgramBatch5AcceptanceTimings(currentTiming);

const read = (path: string) => JSON.parse(readFileSync(new URL("../../../" + path, import.meta.url), "utf8"));
const before = read("tools/question-quality/fixtures/question-topic-acceptance-batch4-before-20261111.json");
const decisions = read("docs/research/question-topic-acceptance-batch4-dispositions-20261111.json");
const corrections = read("tools/question-quality/fixtures/question-topic-acceptance-batch4-literal-name-corrections-20261111.json");
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const candidates = before.topics.flatMap((topic: {candidates: Array<{case: {id: string}}>}) => topic.candidates);

describe("topic batch4 complete reviewed acceptance", () => {
  it("accounts for the271 exact requested nodes with260 acceptances and11 explicit skips", () => {
    expect(decisions.requested).toBe(271);
    expect(decisions.accepted).toBe(260);
    expect(decisions.skipped).toBe(11);
    expect(cases).toHaveLength(252);
    expect(new Set(rows.map(row => row.nodeId)).size).toBe(260);
    const accepted = decisions.items.filter((item: {status: string}) => item.status === "accepted");
    expect(rows.map(row => row.nodeId).sort()).toEqual(accepted.map((item: {nodeId: string}) => item.nodeId).sort());
    for (const item of decisions.items.filter((item: {status: string}) => item.status === "skipped")) {
      expect(live.cases.some(cs => cs.decisionNodes.some(node => node.id === item.nodeId))).toBe(false);
      expect(item.unlistedSiblingIds.length > 0 || !!item.runtimeAdmissionIssue || !item.evidence).toBe(true);
    }
    expect(decisions.items.filter((item: {runtimeAdmissionIssue?: string}) => item.runtimeAdmissionIssue)).toHaveLength(6);
  });

  it("pins664 authority rows and1330cases/1530nodes/1019registered/824scored meanings", () => {
    expect(manifest.id).toBe("question-ship.2026-11-11.v13");
    expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.accepted).toHaveLength(664);
    expect(manifest.replacements).toHaveLength(51);
    expect(manifest.topicConsolidations).toHaveLength(66);
    expect(digest(manifest)).toBe("a0c686005c23c9d7adeae3fe955903ad945f715c8a2703f0962982a1c0edd20c");
    expect(live.cases).toHaveLength(1330);
    expect(live.cases.flatMap(cs => cs.decisionNodes)).toHaveLength(1530);
    expect(live.concepts).toHaveLength(1019);
    expect(new Set(live.cases.flatMap(cs => cs.decisionNodes.map(node => node.primaryConceptId))).size).toBe(824);
    expect(digest(live)).toBe("b4cbb9a4bd96272f4ce9c14fef811aa55c5cbeae40b34a4bb6884e35ad34a234");
    expect(previousManifest(manifest)).toEqual(before.manifest);
    expect(digest(catalog)).toBe(before.catalogSha256);
  });

  it("restores all1250 prior cases and813 exact meaning definitions", () => {
    const restored = previous(live);
    expect(digest(restored)).toBe(before.default.sha256);
    expect(restored.cases).toHaveLength(1250);
    expect(restored.concepts).toHaveLength(813);
    expect(retired).toHaveLength(172);
    expect(retired.flatMap(cs => cs.decisionNodes)).toHaveLength(244);
    for (const cs of retired) {
      expect(live.cases.some(current => current.id === cs.id), cs.id).toBe(false);
      expect(restored.cases.find(current => current.id === cs.id)).toEqual(cs);
      for (const node of cs.decisionNodes) expect(live.concepts.some(concept => concept.id === node.primaryConceptId)).toBe(true);
    }
  });

  it("preserves exact reviewed fields through the recorded name substitutions", () => {
    for (const cs of cases) {
      const captured = candidates.find((candidate: {case: {id: string}}) => candidate.case.id === cs.id);
      const corrected = correctPresentation(captured.case, cs.id);
      const adjustment = decisions.stageAdjustments.find((row: {caseId: string}) => row.caseId === cs.id);
      expect(cs).toEqual({...corrected, routineEligible: true,
        earliestFacilityStage: adjustment?.after ?? captured.case.earliestFacilityStage,
        learningSummary: cs.decisionNodes.map(node => node.explanation).join(" ")});
      expect(digest(cs)).toBe(frozen.find(record => record.caseId === cs.id)!.retainedCaseSha256);
      for (const node of cs.decisionNodes) {
        const record = captured.records.find((record: {node: {id: string}}) => record.node.id === node.id);
        const question = questions.find(question => question.id === node.questionVariantId)!;
        expect(node).toEqual(corrected.decisionNodes.find((candidate: {id: string}) => candidate.id === node.id));
        expect(question).toEqual(correctPresentation(record.question, question.id));
        expect(record.evidence.record.verdict).toBe("PASS");
        expect(question.reviewStatus).toBe("needs_clinician_review");
        expect(question.lastClinicianReview).toBeNull();
        expect(node.shuffleAnswers).toBe(true);
        expect([3, 4]).toContain(node.answerChoices.length);
        expect(node.answerChoices.filter(choice => choice.isCorrect)).toHaveLength(1);
        for (const claimId of question.supportingEvidenceClaimIds) expect(claims.some(claim => claim.id === claimId)).toBe(true);
      }
    }
  });

  it("binds32 static accepted source views and complete clinic participant contexts", () => {
    expect(Object.keys(views)).toHaveLength(32);
    for (const record of decisions.sourceViews) expect(digest(views[record.name]!)).toBe(record.sha256);
    for (const cs of cases) {
      expect(cs.requiredClinicalSetting).toBe("clinic");
      expect(cs.routineEligible).toBe(true);
      expect(rows.filter(row => row.caseId === cs.id)).toHaveLength(cs.decisionNodes.length);
    }
    const staff = cases.filter(cs => cs.participant?.kind === "employee_discussion");
    expect(staff).toHaveLength(3);
    expect(staff.flatMap(cs => cs.decisionNodes)).toHaveLength(4);
    const wrapper = readFileSync(new URL("./question-program-batch4-accepted-20261111.ts", import.meta.url), "utf8");
    expect(wrapper).not.toMatch(/from\s+["']\.\/question-topic-/);
  });

  it("retains every reviewed serialization and the original input hashes", () => {
    const archive = read("docs/research/question-topic-acceptance-batch4-source-freeze-20261111.json");
    expect(archive.records).toHaveLength(260);
    for (const record of archive.records) {
      expect(createHash("sha256").update(record.sourceNodeJson).digest("hex")).toBe(record.sourceNodeSha256);
      expect(createHash("sha256").update(record.sourceQuestionJson).digest("hex")).toBe(record.sourceQuestionSha256);
      const captured = candidates.find((candidate: {case: {id: string}}) => candidate.case.id === record.caseId);
      const source = captured.records.find((candidate: {node: {id: string}}) => candidate.node.id === record.nodeId);
      expect(JSON.parse(record.sourceNodeJson)).toEqual(source.node);
      expect(JSON.parse(record.sourceQuestionJson)).toEqual(source.question);
      expect(digest(source.node)).toBe(record.runtimeNodeSha256);
      const accepted = frozen.find(row => row.caseId === record.caseId)!.nodes.find(row => row.nodeId === record.nodeId)!;
      const node = cases.find(cs => cs.id === record.caseId)!.decisionNodes.find(node => node.id === record.nodeId)!;
      expect(digest(node)).toBe(accepted.nodeSha256);
      expect(digest(questions.find(question => question.id === record.questionVariantId))).toBe(accepted.questionSha256);
    }
  });

  it("limits the112 presentation repairs to exact patient-name substitutions", () => {
    expect(corrections.records).toHaveLength(30);
    expect(corrections.records.flatMap((record: {fields: unknown[]}) => record.fields)).toHaveLength(112);
    for (const record of corrections.records) {
      const cs = cases.find(cs => cs.id === record.caseId)!;
      for (const field of record.fields) {
        const expected = field.before.replaceAll(record.literalName, "{patientName}")
          .replace(new RegExp("\\b" + record.literalName.split(" ")[0] + "\\b", "g"), "{patientName}");
        expect(field.after).toBe(expected);
        expect(field.path.join(".")).not.toMatch(/(?:^|\.)(?:id|isCorrect|primaryConceptId|questionVariantId)(?:\.|$)/);
      }
      const literal = new RegExp("\\b(?:" + record.literalName + "|" + record.literalName.split(" ")[0] + ")\\b");
      const copies = questions.filter(question => cs.decisionNodes.some(node => node.questionVariantId === question.id));
      for (const text of [cs.presentation, cs.learningSummary, ...(cs.approvedInstantiationProfiles ?? []).map(profile => profile.presentation),
        ...cs.decisionNodes.map(node => JSON.stringify(node)), ...copies.map(question => JSON.stringify(question))]) {
        expect(text, cs.id).not.toMatch(literal);
      }
    }
  });

  it("keeps all2554 prior timing tuples and adds260 rows plus292 pending test choices", () => {
    expect(timing).toHaveLength(2814);
    expect(previousTimings(timing)).toEqual(before.timing);
    expect(orders).toHaveLength(292);
    for(const adjustment of decisions.noTestClassificationAdjustments){
      expect(adjustment.before.choices.every((choice:{timing:{kind:string}})=>choice.timing.kind==="no_test")).toBe(true);
      expect(timing.find(entry=>entry.caseId===adjustment.caseId&&entry.nodeId===adjustment.nodeId)!.classification)
        .toEqual({kind:"no_test"});
    }
    for(const adjustment of decisions.timingOrderAdjustments){
      const source=candidates.find((candidate:{case:{id:string}})=>candidate.case.id===adjustment.caseId);
      const original=source.timing.find((entry:{nodeId:string})=>entry.nodeId===adjustment.nodeId);
      const accepted=timing.find(entry=>entry.caseId===adjustment.caseId&&entry.nodeId===adjustment.nodeId)!;
      expect(accepted.classification.kind).toBe("test_choices");
      if(accepted.classification.kind==="test_choices"){
        expect(accepted.classification.choices.map(choice=>choice.choiceId)).toEqual(adjustment.afterChoiceIds);
        for(const choice of accepted.classification.choices)
          expect(choice).toEqual(original.classification.choices.find((item:{choiceId:string})=>item.choiceId===choice.choiceId));
      }
    }
    for (const order of orders) {
      expect(order.disposition).toEqual({kind: "not_executed", reason: "future_planned"});
      const node = cases.find(cs => cs.id === order.caseId)!.decisionNodes.find(node => node.id === order.nodeId)!;
      expect(node.answerChoices.find(choice => choice.id === order.choiceId)!.label).toBe(order.choiceLabel);
    }
  });

  it("retires all172 identities once and retains every declared successor", () => {
    expect(replacements).toHaveLength(23);
    expect(consolidations).toHaveLength(36);
    const references = [...replacements.map(row => row.replaces), ...consolidations.flatMap(row => row.replaces)];
    expect(references).toHaveLength(172);
    expect(new Set(references).size).toBe(172);
    for (const relation of decisions.retirementCoverage) {
      expect(references.filter(id => id === relation.legacyCaseId)).toHaveLength(1);
      for (const caseId of relation.allTargetCaseIds) expect(cases.some(cs => cs.id === caseId)).toBe(true);
    }
  });

  it("rejects unrelated content, authority and timing drift before historical reconstruction", () => {
    const release = structuredClone(live);
    release.cases.find(cs => !cases.some(accepted => accepted.id === cs.id))!.presentation += " drift";
    expect(() => previous(release)).toThrow();
    const authority = structuredClone(manifest);
    authority.accepted[0]!.conceptId += ".drift";
    expect(() => previousManifest(authority)).toThrow();
    const estimates = structuredClone(timing);
    estimates[0]!.nodeId += ".drift";
    expect(() => previousTimings(estimates)).toThrow();
  });

  it("binds each integration source to its exact intake preimage", () => {
    const migration = read("tools/question-quality/fixtures/question-topic-acceptance-batch4-source-migration-20261111.json");
    const pinBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-program-batch4-release-source-pins-20261111.json",import.meta.url));
    expect(createHash("sha256").update(pinBytes).digest("hex")).toBe("6619820930bac31312fceea1624b2b10ad708a3fb1b62341978e62d7381e17cc");
    const releasePins=JSON.parse(pinBytes.toString("utf8")) as {capturedFixtureSha256:string;testSupportSha256:string;repairedTopicTestArchivePath?:string;repairedTopicTestArchiveSha256?:string;paths:Array<{path:string;mainBeforeSha256:string;mainAfterSha256:string;requiredReleaseSha256:string|null}>};
    expect(createHash("sha256").update(readFileSync(new URL("../../../tools/question-quality/fixtures/question-topic-acceptance-batch4-source-migration-20261111.json",import.meta.url))).digest("hex")).toBe(releasePins.capturedFixtureSha256);
    expect(createHash("sha256").update(readFileSync(new URL("./question-program-batch4-acceptance-test-support.ts",import.meta.url))).digest("hex")).toBe(releasePins.testSupportSha256);
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
