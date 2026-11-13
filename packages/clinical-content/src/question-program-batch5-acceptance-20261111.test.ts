import {createHash} from "node:crypto";
import {readFileSync,existsSync} from "node:fs";
import {describe, expect, it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as latestLive, QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as latestManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as latestTiming} from "./answer-choice-timing";
import {
  QUESTION_PROGRAM_BATCH5_ACCEPTED_CASES as cases, QUESTION_PROGRAM_BATCH5_ACCEPTED_ROWS as rows,
  QUESTION_PROGRAM_BATCH5_ACCEPTED_QUESTIONS as questions, QUESTION_PROGRAM_BATCH5_ACCEPTED_SOURCE_VIEWS as views,
  QUESTION_PROGRAM_BATCH5_RETAINED_CASES as retired, QUESTION_PROGRAM_BATCH5_REPLACEMENTS as replacements,
  QUESTION_PROGRAM_BATCH5_CONSOLIDATIONS as consolidations, QUESTION_PROGRAM_BATCH5_FROZEN_PRESERVATION as frozen,
  QUESTION_PROGRAM_BATCH5_ACCEPTED_TEST_ORDER_RECORDS as orders, QUESTION_PROGRAM_BATCH5_CLAIMS as claims,
} from "./question-program-batch5-accepted-20261111";
import {
  beforeProgramBatch5AcceptanceRelease as previous, beforeProgramBatch5AcceptanceManifest as previousManifest,
  beforeProgramBatch5AcceptanceTimings as previousTimings, beforeProgramBatch5AcceptanceSource as previousSource,
  withProgramBatch5PresentationCorrections as corrected,
} from "./question-program-batch5-acceptance-test-support";

import {beforeProgramBatch6AcceptanceRelease, beforeProgramBatch6AcceptanceManifest,
  beforeProgramBatch6AcceptanceTimings} from "./question-program-batch6-acceptance-test-support";
const live = beforeProgramBatch6AcceptanceRelease(latestLive);
const manifest = beforeProgramBatch6AcceptanceManifest(latestManifest);
const timing = beforeProgramBatch6AcceptanceTimings(latestTiming);

const read = (path: string) => JSON.parse(readFileSync(new URL("../../../" + path, import.meta.url), "utf8"));
const before = read("tools/question-quality/fixtures/question-topic-acceptance-batch5-before-20261111.json");
const selection = read("tools/question-quality/fixtures/question-topic-acceptance-batch5-selection-20261111.json");
const decisions = read("docs/research/question-topic-acceptance-batch5-dispositions-20261111.json");
const corrections = read("tools/question-quality/fixtures/question-topic-acceptance-batch5-literal-name-corrections-20261111.json");
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const candidates = before.topics.flatMap((topic: {candidates: Array<{case: {id: string}}>}) => topic.candidates);

describe("topic batch5 final exact manager acceptance", () => {
  it("admits 22 of the 29 requested identities as 21 whole cases and records all seven skips", () => {
    expect(decisions.requested).toBe(29);
    expect(decisions.accepted).toBe(22);
    expect(decisions.skipped).toBe(7);
    expect(cases).toHaveLength(21);
    expect(rows).toHaveLength(22);
    expect(new Set(rows.map(row => row.nodeId)).size).toBe(22);
    const accepted = decisions.items.filter((item: {status: string}) => item.status === "accepted");
    expect(rows.map(row => row.nodeId).sort()).toEqual(accepted.map((item: {nodeId: string}) => item.nodeId).sort());
    for (const item of decisions.items.filter((item: {status: string}) => item.status === "skipped")) {
      expect(live.cases.some(cs => cs.decisionNodes.some(node => node.id === item.nodeId))).toBe(false);
      expect(item.unlistedSiblingIds.length > 0 || !!item.runtimeAdmissionIssue).toBe(true);
    }
    expect(decisions.items.filter((item: {runtimeAdmissionIssue?: string}) => item.runtimeAdmissionIssue)).toHaveLength(5);
  });

  it("pins the v14 default, full manifest and unchanged authoring catalog", () => {
    expect(manifest.id).toBe("question-ship.2026-11-11.v14");
    expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.accepted).toHaveLength(686);
    expect(manifest.replacements).toHaveLength(52);
    expect(manifest.topicConsolidations).toHaveLength(70);
    expect(digest(manifest)).toBe("6e074c70648de65270be5f86610d55f0a3a1ab2212df453ac0e5adee1834c9ce");
    expect(live.cases).toHaveLength(1338);
    expect(live.cases.flatMap(cs => cs.decisionNodes)).toHaveLength(1533);
    expect(live.concepts).toHaveLength(1035);
    expect(new Set(live.cases.flatMap(cs => cs.decisionNodes.map(node => node.primaryConceptId))).size).toBe(840);
    expect(digest(live)).toBe("2c524904fafc7e915dab19256a191397e0a00f5a68bf0ebc9e2e37fe69394921");
    expect(previousManifest(manifest)).toEqual(before.manifest);
    expect(digest(catalog)).toBe(before.catalogSha256);
  });

  it("restores the exact 1330 prior cases and all 1019 prior meaning definitions", () => {
    const restored = previous(live);
    expect(digest(restored)).toBe(before.default.sha256);
    expect(restored.cases).toHaveLength(1330);
    expect(restored.concepts).toHaveLength(1019);
    expect(retired).toHaveLength(13);
    expect(retired.flatMap(cs => cs.decisionNodes)).toHaveLength(19);
    for (const cs of retired) {
      expect(live.cases.some(current => current.id === cs.id), cs.id).toBe(false);
      expect(restored.cases.find(current => current.id === cs.id)).toEqual(cs);
      for (const node of cs.decisionNodes) expect(live.concepts.some(concept => concept.id === node.primaryConceptId)).toBe(true);
    }
  });

  it("preserves every reviewed question and scored node through exact name-only corrections", () => {
    for (const cs of cases) {
      const source = candidates.find((candidate: {case: {id: string}}) => candidate.case.id === cs.id);
      const correctedCase = corrected(source.case, cs.id);
      const stage = decisions.stageAdjustments.find((row: {caseId: string}) => row.caseId === cs.id);
      expect(cs).toEqual({...correctedCase, routineEligible: true,
        earliestFacilityStage: stage?.after ?? source.case.earliestFacilityStage,
        learningSummary: cs.decisionNodes.map(node => node.explanation).join(" ")});
      expect(digest(cs)).toBe(frozen.find(record => record.caseId === cs.id)!.retainedCaseSha256);
      for (const node of cs.decisionNodes) {
        const record = source.records.find((record: {node: {id: string}}) => record.node.id === node.id);
        const question = questions.find(question => question.id === node.questionVariantId)!;
        expect(node).toEqual(correctedCase.decisionNodes.find((original: {id: string}) => original.id === node.id));
        expect(question).toEqual(corrected(record.question, question.id));
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

  it("binds four static source views and five real pediatric clinic contexts", () => {
    expect(Object.keys(views)).toHaveLength(4);
    for (const record of decisions.sourceViews) expect(digest(views[record.name]!)).toBe(record.sha256);
    for (const cs of cases) {
      expect(cs.requiredClinicalSetting).toBe("clinic");
      expect(cs.routineEligible).toBe(true);
      expect(rows.filter(row => row.caseId === cs.id)).toHaveLength(cs.decisionNodes.length);
    }
    const pediatric = cases.filter(cs => cs.pediatricProfile);
    expect(pediatric).toHaveLength(5);
    for (const cs of pediatric) {
      const selected = selection.selected.find((row: {caseId: string}) => row.caseId === cs.id);
      expect(selected.runtime).toMatchObject({route: "pediatric_clinic", clinicAdmissible: true,
        requiredRoomDefinitionId: "room.pediatric_examination", receipt: {status: "applied"}});
      expect(selected.runtime.childStillId).toBeTruthy();
      expect(selected.runtime.pediatricFamilyId).toBeTruthy();
      expect(cs.approvedInstantiationProfiles).toHaveLength(1);
      expect(cs.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(cs.prototypeDemographics);
    }
    const wrapper = readFileSync(new URL("./question-program-batch5-accepted-20261111.ts", import.meta.url), "utf8");
    expect(wrapper).not.toMatch(/from\s+["']\.\/question-topic-/);
  });

  it("freezes reviewed serializations and every recorded source hash without shipping working copies", () => {
    const archive = read("docs/research/question-topic-acceptance-batch5-source-freeze-20261111.json");
    expect(archive.records).toHaveLength(22);
    expect(archive.objectKeyOrderNormalizations).toBe(6);
    for (const record of archive.records) {
      expect(createHash("sha256").update(record.sourceNodeJson).digest("hex")).toBe(record.sourceNodeSha256);
      expect(createHash("sha256").update(record.sourceQuestionJson).digest("hex")).toBe(record.sourceQuestionSha256);
      const source = candidates.find((candidate: {case: {id: string}}) => candidate.case.id === record.caseId)
        .records.find((candidate: {node: {id: string}}) => candidate.node.id === record.nodeId);
      expect(JSON.parse(record.sourceNodeJson)).toEqual(source.node);
      expect(JSON.parse(record.sourceQuestionJson)).toEqual(source.question);
      expect(digest(source.node)).toBe(record.runtimeNodeSha256);
    }
    // Release uses immutable reviewed serializations, never mutable draft files.
    // Bind every original whole-file hash to the exact intake, and require all
    // excluded source paths to remain absent rather than importing current drafts.
    const inventoryBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-topic-batch5-release-source-inventory-20261112.json",import.meta.url));
    expect(createHash("sha256").update(inventoryBytes).digest("hex")).toBe("ceded15752656dce88fc111c0b239e18a91cd9570f0f91c339b86b0651dffbf5");
    const inventory=JSON.parse(inventoryBytes.toString("utf8"));
    for(const input of [{path:inventory.beforePath,sha256:inventory.beforeSha256},
      {path:inventory.reviewedArchivePath,sha256:inventory.reviewedArchiveSha256}])
      expect(createHash("sha256").update(readFileSync(new URL("../../../"+input.path,import.meta.url))).digest("hex")).toBe(input.sha256);
    const recorded=before.topics.flatMap((topic: {sourcePath:string;sourceSha256:string;packetPath:string;packetSha256:string;ledgerPath:string;ledgerSha256:string;reviews:Array<{path:string;sha256:string}>})=>[
      {path:topic.sourcePath,sha256:topic.sourceSha256},{path:topic.packetPath,sha256:topic.packetSha256},
      {path:topic.ledgerPath,sha256:topic.ledgerSha256},...topic.reviews]);
    expect(inventory.records.map(({requiredReleasePresent,...input}: {requiredReleasePresent:boolean;path:string;sha256:string})=>input)).toEqual(recorded);
    for(const input of inventory.records){const url=new URL("../../../"+input.path,import.meta.url);
      expect(existsSync(url),input.path+" exact release presence").toBe(input.requiredReleasePresent);
      if(input.requiredReleasePresent)expect(createHash("sha256").update(readFileSync(url)).digest("hex")).toBe(input.sha256);
    }
    for(const record of archive.records){const topic=before.topics.find((topic:{sourcePath:string})=>topic.sourcePath===record.sourcePath);
      expect(topic).toBeDefined();expect(record.sourceFileSha256).toBe(topic.sourceSha256);}

  });

  it("restricts all 65 presentation substitutions to the recorded patient names", () => {
    expect(corrections.records).toHaveLength(12);
    expect(corrections.records.flatMap((record: {fields: unknown[]}) => record.fields)).toHaveLength(65);
    for (const record of corrections.records) for (const field of record.fields) {
      const expected = field.before.replaceAll(record.literalName, "{patientName}")
        .replace(new RegExp("\\b" + record.literalName.split(" ")[0] + "\\b", "g"), "{patientName}");
      expect(field.after).toBe(expected);
      expect(field.path.join(".")).not.toMatch(/(?:^|\.)(?:id|isCorrect|primaryConceptId|questionVariantId)(?:\.|$)/);
    }
  });

  it("retains all 2814 timing tuples and appends 22 exact rows with 24 pending test choices", () => {
    expect(timing).toHaveLength(2836);
    expect(previousTimings(timing)).toEqual(before.timing);
    expect(orders).toHaveLength(24);
    for (const order of orders) {
      expect(order.disposition).toEqual({kind: "not_executed", reason: "future_planned"});
      const node = cases.find(cs => cs.id === order.caseId)!.decisionNodes.find(node => node.id === order.nodeId)!;
      expect(node.answerChoices.find(choice => choice.id === order.choiceId)!.label).toBe(order.choiceLabel);
    }
    for (const cs of cases.filter(cs => cs.pediatricProfile)) for (const node of cs.decisionNodes) {
      expect(timing.find(entry => entry.caseId === cs.id && entry.nodeId === node.id)!.classification).toEqual({kind: "no_test"});
    }
  });

  it("retires 13 old identities once and preserves all declared successor coverage", () => {
    expect(replacements).toHaveLength(1);
    expect(consolidations).toHaveLength(4);
    const references = [...replacements.map(row => row.replaces), ...consolidations.flatMap(row => row.replaces)];
    expect(references).toHaveLength(13);
    expect(new Set(references).size).toBe(13);
    for (const relation of decisions.retirementCoverage) {
      expect(references.filter(id => id === relation.legacyCaseId)).toHaveLength(1);
      for (const caseId of relation.allTargetCaseIds) expect(cases.some(cs => cs.id === caseId)).toBe(true);
    }
  });

  it("rejects unrelated content, authority and timing drift before restoring history", () => {
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

  it("binds every scoped existing-source correction to its captured preimage", () => {
    const migration = read("tools/question-quality/fixtures/question-topic-acceptance-batch5-source-migration-20261111.json");
    const pinBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-program-batch5-release-source-pins-20261111.json",import.meta.url));
    expect(createHash("sha256").update(pinBytes).digest("hex")).toBe("35ff11223a88929b560a79c2a23346c408a5c2f8ed5d0e86dd70af010337cb2c");
    const releasePins=JSON.parse(pinBytes.toString("utf8")) as {capturedFixtureSha256:string;testSupportSha256:string;repairedTopicTestArchivePath?:string;repairedTopicTestArchiveSha256?:string;paths:Array<{path:string;mainBeforeSha256:string;mainAfterSha256:string;requiredReleaseSha256:string|null}>};
    expect(createHash("sha256").update(readFileSync(new URL("../../../tools/question-quality/fixtures/question-topic-acceptance-batch5-source-migration-20261111.json",import.meta.url))).digest("hex")).toBe(releasePins.capturedFixtureSha256);
    expect(createHash("sha256").update(readFileSync(new URL("./question-program-batch5-acceptance-test-support.ts",import.meta.url))).digest("hex")).toBe(releasePins.testSupportSha256);
    expect(releasePins.paths).toHaveLength(27);
    for(const pin of releasePins.paths){const row=migration.files.find((row:{path:string})=>row.path===pin.path);expect(row).toBeDefined();
      expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
      if(pin.requiredReleaseSha256===null)expect(existsSync(new URL("../../../"+pin.path,import.meta.url))).toBe(false);
      else expect(createHash("sha256").update(readFileSync(new URL("../../../"+pin.path,import.meta.url))).digest("hex")).toBe(pin.requiredReleaseSha256);}
    expect(releasePins.paths.filter(pin=>pin.requiredReleaseSha256===null)).toHaveLength(25);
    expect(createHash("sha256").update(readFileSync(new URL("../../../"+releasePins.repairedTopicTestArchivePath!,import.meta.url))).digest("hex")).toBe(releasePins.repairedTopicTestArchiveSha256);
    for (const row of migration.files) {
      if (row.path.includes("/question-topic-")) expect(row.path).toMatch(/\.test\.ts$/);
      const sourceUrl=new URL("../../../"+row.path,import.meta.url);
      const current=existsSync(sourceUrl)?readFileSync(sourceUrl,"utf8"):undefined;
      expect(createHash("sha256").update(previousSource(row.path, current)).digest("hex"), row.path).toBe(row.beforeSha256);
    }
  });
});
