import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as live, QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as timings} from "./answer-choice-timing";
import {PROGRAM_BATCH6_TIMINGS as capturedTimings} from "./question-program-batch6-accepted-data-20261112";
import {
  QUESTION_PROGRAM_BATCH6_ACCEPTED_CASES as cases, QUESTION_PROGRAM_BATCH6_ACCEPTED_ROWS as rows,
  QUESTION_PROGRAM_BATCH6_ACCEPTED_QUESTIONS as questions, QUESTION_PROGRAM_BATCH6_ACCEPTED_SOURCE_VIEWS as views,
  QUESTION_PROGRAM_BATCH6_RETAINED_CASES as retired, QUESTION_PROGRAM_BATCH6_REPLACEMENTS as replacements,
  QUESTION_PROGRAM_BATCH6_ACCEPTED_FAMILY_CONTEXTS as families,
  QUESTION_PROGRAM_BATCH6_RUNTIME_FAMILY_CONTEXTS as familyRegistry,
  QUESTION_PROGRAM_BATCH6_FROZEN_PRESERVATION as frozen,
  QUESTION_PROGRAM_BATCH6_ACCEPTED_TEST_ORDER_RECORDS as orders,
} from "./question-program-batch6-accepted-20261112";
import {
  beforeProgramBatch6AcceptanceRelease as previous,
  beforeProgramBatch6AcceptanceManifest as previousManifest,
  beforeProgramBatch6AcceptanceTimings as previousTimings,
  beforeProgramBatch6AcceptanceFamilies as previousFamilies,
  beforeProgramBatch6AcceptanceSource as previousSource,
  withProgramBatch6PresentationCorrections as corrected,
} from "./question-program-batch6-acceptance-test-support";

const read = (path: string) => JSON.parse(readFileSync(new URL("../../../" + path, import.meta.url), "utf8"));
const root = "tools/question-quality/fixtures/question-topic-acceptance-batch6-";
const before = read(root + "before-20261112.json");
const decisions = read("docs/research/question-topic-acceptance-batch6-dispositions-20261112.json");
const corrections = read(root + "literal-name-corrections-20261112.json");
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const candidates = before.topics[0].candidates;

describe("topic batch6 exact pediatric salvage acceptance", () => {
  it("admits exactly four complete salvage PASS cases and keeps the two dropped nodes outside authority", () => {
    expect(decisions.requested).toBe(4);
    expect(decisions.accepted).toBe(4);
    expect(decisions.skipped).toBe(0);
    expect(cases).toHaveLength(4);
    expect(rows).toHaveLength(4);
    expect(Object.keys(views)).toHaveLength(1);
    expect(rows.map(row => row.nodeId).sort()).toEqual(before.topics[0].requested.map((row: {nodeId: string}) => row.nodeId).sort());
    for (const cs of cases) {
      expect(cs.decisionNodes).toHaveLength(1);
      expect(rows.filter(row => row.caseId === cs.id)).toHaveLength(1);
      expect(live.cases.find(current => current.id === cs.id)).toEqual(cs);
    }
    for (const suffix of ["negative-exploration", "pyogenic-drainage"]) {
      const nodeId = "node.pediatric-neck-thoracic-gu.20261111." + suffix;
      expect(manifest.accepted.some(row => row.nodeId === nodeId)).toBe(false);
      expect(live.cases.some(cs => cs.decisionNodes.some(node => node.id === nodeId))).toBe(false);
    }
  });

  it("pins the v15 projection, full authority and unchanged authoring catalog", () => {
    expect(manifest.id).toBe("question-ship.2026-11-12.v15");
    expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.accepted).toHaveLength(690);
    expect(manifest.replacements).toHaveLength(54);
    expect(manifest.topicConsolidations).toHaveLength(70);
    expect(digest(manifest)).toBe("75c681e29d13d5dbe27fa5f5599244276f9e314b3e9ef1b95f0a91fa41a0ad91");
    expect(live.cases).toHaveLength(1340);
    expect(live.cases.flatMap(cs => cs.decisionNodes)).toHaveLength(1535);
    expect(live.concepts).toHaveLength(1039);
    expect(new Set(live.cases.flatMap(cs => cs.decisionNodes.map(node => node.primaryConceptId))).size).toBe(844);
    expect(digest(live)).toBe("4eef72623a1de415f302d7d44819b40a4749b523d18c325102ad35b5d0c5d2e7");
    expect(previousManifest(manifest)).toEqual(before.manifest);
    expect(digest(catalog)).toBe(before.catalogSha256);
  });

  it("restores all 1338 prior cases, 1035 meanings and two exact frozen source cases", () => {
    const restored = previous(live);
    expect(digest(restored)).toBe(before.default.sha256);
    expect(restored.cases).toHaveLength(1338);
    expect(restored.concepts).toHaveLength(1035);
    expect(retired).toHaveLength(2);
    expect(replacements).toHaveLength(2);
    for (const cs of retired) {
      expect(live.cases.some(current => current.id === cs.id)).toBe(false);
      expect(restored.cases.find(current => current.id === cs.id)).toEqual(cs);
      expect(replacements.filter(row => row.replaces === cs.id)).toHaveLength(1);
      for (const node of cs.decisionNodes) expect(live.concepts.some(concept => concept.id === node.primaryConceptId)).toBe(true);
    }
  });

  it("retains reviewed nodes, options, explanations and source identities through exact name substitutions", () => {
    for (const cs of cases) {
      const source = candidates.find((candidate: {case: {id: string}}) => candidate.case.id === cs.id);
      const original = corrected(source.case, cs.id);
      const stage = decisions.stageAdjustments.find((row: {caseId: string}) => row.caseId === cs.id);
      expect(cs).toEqual({...original, routineEligible: true,
        earliestFacilityStage: stage?.after ?? source.case.earliestFacilityStage,
        learningSummary: cs.decisionNodes.map(node => node.explanation).join(" ")});
      const node = cs.decisionNodes[0]!;
      const record = source.records[0];
      const question = questions.find(question => question.id === node.questionVariantId)!;
      expect(node).toEqual(original.decisionNodes[0]);
      expect(question).toEqual(corrected(record.question, question.id));
      expect(record.evidence.path).toContain("-review-salvage-");
      expect(record.evidence.record.verdict).toBe("PASS");
      expect(question.reviewStatus).toBe("needs_clinician_review");
      expect(question.lastClinicianReview).toBeNull();
      expect(node.shuffleAnswers).toBe(true);
      expect(node.answerChoices).toHaveLength(3);
      expect(node.answerChoices.filter(choice => choice.isCorrect)).toHaveLength(1);
      expect(digest(cs)).toBe(frozen.find(row => row.caseId === cs.id)!.retainedCaseSha256);
    }
    expect(corrections.records).toHaveLength(3);
    expect(corrections.records.flatMap((row: {fields: unknown[]}) => row.fields)).toHaveLength(6);
    for (const row of corrections.records) for (const field of row.fields) {
      expect(field.after).toBe(field.before.replaceAll(row.literalName, "{patientName}")
        .replace(new RegExp("\\b" + row.literalName.split(" ")[0] + "\\b", "g"), "{patientName}"));
      expect(field.path.join(".")).not.toMatch(/(?:^|\.)(?:id|isCorrect|primaryConceptId|questionVariantId)(?:\.|$)/);
    }
  });

  it("binds all four exact child, parent and art contexts while retaining the twenty original families", () => {
    expect(families).toHaveLength(4);
    expect(familyRegistry).toHaveLength(24);
    expect(previousFamilies(familyRegistry)).toEqual(before.familyRegistryBefore);
    for (const family of families) {
      const source = candidates.find((candidate: {case: {id: string}}) => candidate.case.id === family.caseId);
      expect(family).toEqual(source.familyContexts[0]);
      expect(family.reviewStatus).toBe("needs_clinician_review");
      expect(family.lastClinicianReview).toBeNull();
      const cs = cases.find(cs => cs.id === family.caseId)!;
      expect(cs.prototypeDemographics).toEqual(family.prototypeDemographics);
      expect(cs.approvedInstantiationProfiles).toHaveLength(1);
      expect(cs.approvedInstantiationProfiles![0]!.id).toBe(family.profileId);
      expect(cs.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(family.prototypeDemographics);
      expect(source.runtime).toMatchObject({clinicAdmissible: true, issue: null,
        proposedTimingsInstalledForProbe: true, proposedFamiliesInstalledForProbe: true,
        childStillId: family.childStillId, parentName: family.parentName, receipt: {status: "applied"}});
    }
  });

  it("retains source timing rows and installs exactly the eight manager-approved outside-record wait previews", () => {
    expect(timings).toHaveLength(2840);
    expect(previousTimings(timings)).toEqual(before.timing);
    const proposals = read("docs/research/question-topic-acceptance-batch6-packet-20261112.json").outsideRecordTestingChoices as Array<{
      caseId: string; nodeId: string; questionVariantId: string; choiceId: string; choiceLabel: string; proposedProfileId: string;
    }>;
    expect(proposals).toHaveLength(8);
    expect(orders).toEqual(proposals.map(row => ({caseId: row.caseId, nodeId: row.nodeId, questionVariantId: row.questionVariantId,
      choiceId: row.choiceId, choiceLabel: row.choiceLabel, timingProfileId: row.proposedProfileId,
      disposition: {kind: "not_executed", reason: "future_planned"}})));
    expect(capturedTimings).toHaveLength(4);
    expect(capturedTimings.every(entry => entry.classification.kind === "no_test")).toBe(true);
    for (const cs of cases) for (const node of cs.decisionNodes) {
      const approved = proposals.filter(row => row.caseId === cs.id && row.nodeId === node.id && row.questionVariantId === node.questionVariantId);
      const entry = timings.find(entry => entry.caseId === cs.id && entry.nodeId === node.id && entry.questionVariantId === node.questionVariantId)!;
      expect(entry.classification).toEqual(approved.length ? {kind: "test_choices", choices: node.answerChoices.map(choice => {
        const proposal = approved.find(row => row.choiceId === choice.id && row.choiceLabel === choice.label);
        return {choiceId: choice.id, choiceLabel: choice.label, timing: proposal
          ? {kind: "test", timingProfileId: proposal.proposedProfileId} : {kind: "no_test"}};
      })} : {kind: "no_test"});
      expect(node.resultGateAfter).toBeNull();
      expect(node.answerChoices.every(choice => choice.serviceRequest === null)).toBe(true);
    }
  });

  it("pins the reviewed serialized bytes and rejects unrelated content, authority, timing or family drift", () => {
    const archive = read("docs/research/question-topic-acceptance-batch6-source-freeze-20261112.json");
    expect(archive.records).toHaveLength(4);
    expect(archive.objectKeyOrderNormalizations).toBe(0);
    for (const record of archive.records) {
      expect(createHash("sha256").update(record.sourceNodeJson).digest("hex")).toBe(record.sourceNodeSha256);
      expect(createHash("sha256").update(record.sourceQuestionJson).digest("hex")).toBe(record.sourceQuestionSha256);
    }
    const release = structuredClone(live);
    release.cases.find(cs => !cases.some(accepted => accepted.id === cs.id))!.presentation += " drift";
    expect(() => previous(release)).toThrow();
    const authority = structuredClone(manifest);
    authority.accepted[0]!.conceptId += ".drift";
    expect(() => previousManifest(authority)).toThrow();
    const estimates = structuredClone(timings);
    estimates[0]!.nodeId += ".drift";
    expect(() => previousTimings(estimates)).toThrow();
    const outsideEstimates = structuredClone(timings);
    const outsideEntry = outsideEstimates.find(entry => entry.caseId === orders[0]!.caseId && entry.nodeId === orders[0]!.nodeId)!;
    if (outsideEntry.classification.kind !== "test_choices") throw new Error("Missing approved batch 6 testing choices.");
    const outsideChoice = outsideEntry.classification.choices.find(choice => choice.choiceId === orders[0]!.choiceId)!;
    if (outsideChoice.timing.kind !== "test") throw new Error("Missing approved batch 6 wait profile.");
    outsideChoice.timing.timingProfileId += ".drift";
    expect(() => previousTimings(outsideEstimates)).toThrow();
    const familyCopy = familyRegistry.map(family => ({...family}));
    familyCopy[0]!.parentName += " drift";
    expect(() => previousFamilies(familyCopy)).toThrow();
  });

  it("preserves protected topic input bytes and binds every integration preimage", () => {
    for (const topic of before.topics) for (const input of [
      {path: topic.sourcePath, sha256: topic.sourceSha256}, {path: topic.packetPath, sha256: topic.packetSha256},
      {path: topic.ledgerPath, sha256: topic.ledgerSha256}, ...topic.reviews,
    ]) expect(createHash("sha256").update(readFileSync(new URL("../../../" + input.path, import.meta.url))).digest("hex"), input.path).toBe(input.sha256);
    const migration = read(root + "source-migration-20261112.json");
    for (const row of migration.files) {
      if (row.path.includes("/question-topic-")) expect(row.path).toMatch(/\.test\.ts$/);
      const current = readFileSync(new URL("../../../" + row.path, import.meta.url), "utf8");
      expect(createHash("sha256").update(previousSource(row.path, current)).digest("hex"), row.path).toBe(row.beforeSha256);
    }
  });
});
