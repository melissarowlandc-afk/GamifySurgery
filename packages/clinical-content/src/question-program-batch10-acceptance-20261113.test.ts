import {beforeProgramBatch11AcceptanceRelease,beforeProgramBatch11AcceptanceManifest,beforeProgramBatch11AcceptanceTimings,beforeProgramBatch11AcceptanceSourceBytes} from "./question-program-batch11-acceptance-test-support";
import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {describe, expect, it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as currentRelease, QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as currentTiming} from "./answer-choice-timing";
import {syntheticClinicalCaseSchema} from "./schema";
import {
  QUESTION_PROGRAM_BATCH10_ACCEPTED_ROWS as rows, QUESTION_PROGRAM_BATCH10_ACCEPTED_CASES as cases,
  QUESTION_PROGRAM_BATCH10_ACCEPTED_QUESTIONS as questions, QUESTION_PROGRAM_BATCH10_FROZEN_PRESERVATION as frozen,
  QUESTION_PROGRAM_BATCH10_ACCEPTED_TIMING_ENTRIES as waits, QUESTION_PROGRAM_BATCH10_ACCEPTED_TEST_ORDER_RECORDS as orders,
  QUESTION_PROGRAM_BATCH10_ACCEPTED_FAMILY_CONTEXTS as families,
} from "./question-program-batch10-accepted-20261113";
import {
  beforeProgramBatch10AcceptanceRelease, beforeProgramBatch10AcceptanceManifest, beforeProgramBatch10AcceptanceTimings,
  beforeProgramBatch10AcceptanceSource, beforeEngI01Schema,
  beforeAuthorizedBatch10IntegrationPins,
} from "./question-program-batch10-acceptance-test-support";

const live=beforeProgramBatch11AcceptanceRelease(currentRelease);
const manifest=beforeProgramBatch11AcceptanceManifest(currentManifest);
const timing=beforeProgramBatch11AcceptanceTimings(currentTiming);
const raw = (path:string) => beforeProgramBatch11AcceptanceSourceBytes(readFileSync(new URL("../../../" + path, import.meta.url)));
const read = (path:string) => JSON.parse(raw(path).toString("utf8"));
const sha = (value:string|Buffer) => createHash("sha256").update(value).digest("hex");
const digest = (value:unknown) => sha(JSON.stringify(value));
const before = read("tools/question-quality/fixtures/question-intraop-acceptance-batch10-before-20261113.json");
const after = read("tools/question-quality/fixtures/question-intraop-acceptance-batch10-after-20261113.json");
const dispositions = read("docs/research/question-intraop-acceptance-batch10-dispositions-20261113.json");

describe("batch10 exact whole-case procedure and salvage acceptance", () => {
  it("accounts for every requested scored node, requires whole-case PASS and excludes polypectomy", () => {
    expect(rows).toHaveLength(13);
    expect(cases).toHaveLength(11);
    expect(questions).toHaveLength(13);
    expect(dispositions.skipped).toHaveLength(3);
    const requested = new Set(before.candidates.flatMap((row:{case:{decisionNodes:Array<{id:string}>}}) => row.case.decisionNodes.map(node => node.id)));
    const accounted = new Set([...rows.map(row => row.nodeId),
      ...dispositions.skipped.flatMap((row:{nodeIds:string[]}) => row.nodeIds)]);
    expect(accounted).toEqual(requested);
    for (const clinicalCase of cases) {
      expect(live.cases.find(row => row.id === clinicalCase.id)).toEqual(clinicalCase);
      for (const node of clinicalCase.decisionNodes) {
        expect(rows.filter(row => row.caseId === clinicalCase.id && row.nodeId === node.id &&
          row.questionVariantId === node.questionVariantId && row.conceptId === node.primaryConceptId)).toHaveLength(1);
        expect(frozen.find(row => row.caseId === clinicalCase.id && row.nodeId === node.id)!.review!.record!.verdict).toBe("PASS");
      }
    }
    for (const row of dispositions.skipped) expect(live.cases.some(candidate => candidate.id === row.caseId)).toBe(false);
    expect(rows.some(row => row.caseId.includes("ascending-emr-completion"))).toBe(false);
  });

  it("pins exact reviewed source and accepted bytes and validates every case", () => {
    const inventoryBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-intraop-batch10-release-source-inventory-20261113.json",import.meta.url));
    expect(sha(inventoryBytes)).toBe("12499e3149181701f9585d9d46bf6d6230b12df9804a8f9ccfeb784caba50fc0");
    const inventory=JSON.parse(inventoryBytes.toString("utf8"));
    expect(sha(readFileSync(new URL("../../../"+inventory.capturePath,import.meta.url)))).toBe(inventory.capturedFixtureSha256);
    const expectedInputs=[...before.sourceInputs];
    expect(inventory.records.map(({requiredReleasePresent,reason,...row}:{requiredReleasePresent:boolean;reason:string;path:string;sha256:string})=>row)).toEqual(expectedInputs);
    for(const input of inventory.records){
      expect(existsSync(new URL("../../../"+input.path,import.meta.url)),input.path+" exact release presence").toBe(input.requiredReleasePresent);
      if(input.requiredReleasePresent)expect(sha(raw(input.path)),input.path+" exact historical source epoch").toBe(input.sha256);
    }
    for (const record of frozen) {
      expect(sha(record.sourceQuestionJson)).toBe(record.sourceQuestionSha256);
      expect(sha(record.sourceNodeJson)).toBe(record.sourceNodeSha256);
      expect(sha(record.sourceCaseJson)).toBe(record.sourceCaseSha256);
      const clinicalCase = cases.find(row => row.id === record.caseId)!;
      expect(digest(clinicalCase)).toBe(record.acceptedCaseSha256);
      expect(digest(clinicalCase.decisionNodes.find(node => node.id === record.nodeId))).toBe(record.acceptedNodeSha256);
      expect(digest(questions.find(row => row.id === record.questionVariantId))).toBe(record.acceptedQuestionSha256);
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success, clinicalCase.id).toBe(true);
      expect(clinicalCase.decisionNodes.map(node => node.id)).toEqual(JSON.parse(record.sourceCaseJson).decisionNodes.map((node:{id:string}) => node.id));
    }
  });

  it("preserves all old cases, FSRS meanings, authority rows and the catalog", () => {
    expect(live.cases).toHaveLength(1432);
    expect(live.cases.flatMap(row => row.decisionNodes)).toHaveLength(1640);
    expect(live.concepts).toHaveLength(1138);
    expect(new Set(live.cases.flatMap(row => row.decisionNodes.map(node => node.primaryConceptId))).size).toBe(939);
    for (const clinicalCase of before.defaultRelease.cases) expect(live.cases.find(row => row.id === clinicalCase.id)).toEqual(clinicalCase);
    expect(live.concepts.slice(0, before.defaultRelease.concepts.length)).toEqual(before.defaultRelease.concepts);
    expect(manifest.accepted.slice(0, before.manifest.accepted.length)).toEqual(before.manifest.accepted);
    expect(manifest.accepted).toHaveLength(807);
    expect(manifest).toEqual({...before.manifest, id:"question-ship.2026-11-13.v19",
      accepted:[...before.manifest.accepted, ...rows],
      headerSources:{...before.manifest.headerSources, ...Object.fromEntries(rows.map(row => [row.caseId, row.sourceView]))}});
    expect(digest(catalog)).toBe(before.catalogSha256);
    expect(digest(live)).toBe(after.defaultSha256);
    expect(digest(manifest)).toBe(after.manifestSha256);
    expect(beforeProgramBatch10AcceptanceRelease(live)).toEqual(before.defaultRelease);
    expect(beforeProgramBatch10AcceptanceManifest(manifest)).toEqual(before.manifest);
    expect(beforeProgramBatch10AcceptanceTimings(timing)).toEqual(before.timing);
  });

  it("retains the complete timing prefix and binds all eleven testing choices exactly once", () => {
    expect(timing.slice(0, before.timing.length)).toEqual(before.timing);
    expect(timing.slice(before.timing.length)).toEqual(waits);
    expect(waits).toHaveLength(13);
    expect(orders).toHaveLength(11);
    for (const clinicalCase of cases) for (const node of clinicalCase.decisionNodes) {
      const matches = timing.filter(row => row.caseId === clinicalCase.id && row.nodeId === node.id && row.questionVariantId === node.questionVariantId);
      expect(matches).toHaveLength(1);
      const classification = matches[0]!.classification;
      if (classification.kind !== "test_choices") continue;
      for (const choice of classification.choices) {
        expect(node.answerChoices.find(row => row.id === choice.choiceId)!.label).toBe(choice.choiceLabel);
        const exact = orders.filter(row => row.caseId === clinicalCase.id && row.nodeId === node.id && row.questionVariantId === node.questionVariantId && row.choiceId === choice.choiceId);
        if (choice.timing.kind === "no_test") expect(exact).toEqual([]);
        else {
          expect(exact).toHaveLength(1);
          expect(exact[0]).toMatchObject({timingProfileId:choice.timing.timingProfileId, disposition:{kind:"not_executed", reason:"future_planned"}});
        }
      }
    }
  });

  it("uses ten live cases, one chart review and three supported pediatric profiles without clinical promotion", () => {
    expect(cases.filter(row => row.procedureContext?.mode === "live")).toHaveLength(10);
    expect(cases.filter(row => row.procedureContext?.mode === "chart_review")).toHaveLength(1);
    expect(families).toHaveLength(3);
    for (const clinicalCase of cases) {
      expect(clinicalCase.routineEligible).toBe(true);
      for (const node of clinicalCase.decisionNodes) {
        expect(node.shuffleAnswers).toBe(true);
        expect(node.resultGateAfter ?? null).toBeNull();
        expect(node.answerChoices.every(choice => !choice.serviceRequest)).toBe(true);
      }
    }
    for (const question of questions) {
      expect(question.reviewStatus).toBe("needs_clinician_review");
      expect(question.lastClinicianReview).toBeNull();
    }
    expect(manifest.clinicalApproval).toBe(false);
  });

  it("fails unrelated postimage mutations and preserves the original I11 schema pin", () => {
    const changed = structuredClone(live);
    changed.cases[0]!.presentation += " unauthorized";
    expect(() => beforeProgramBatch10AcceptanceRelease(changed)).toThrow();
    expect(() => beforeProgramBatch10AcceptanceManifest({...manifest, accepted:manifest.accepted.slice(1)})).toThrow();
    const changedTiming = structuredClone(timing);
    changedTiming[0]!.nodeId += ".unauthorized";
    expect(() => beforeProgramBatch10AcceptanceTimings(changedTiming)).toThrow();
    const path = "packages/clinical-content/src/question-ship-manifest.ts";
    expect(() => beforeProgramBatch10AcceptanceSource(path, raw(path).toString("utf8") + "\n// unauthorized\n")).toThrow();
    expect(sha(beforeProgramBatch10AcceptanceSource(path, raw(path).toString("utf8")))).toBe(before.observed[path]);
    const schema = raw("packages/clinical-content/src/schema.ts");
    expect(sha(beforeEngI01Schema(schema))).toBe("c4d1640ba549c49b6a3dc7bfdf9155504611dd04c756865bc9f5fa0fd40015c7");
    expect(() => beforeEngI01Schema(Buffer.concat([schema, Buffer.from("\n// unauthorized\n")]))).toThrow();
    const reconciliation = read("tools/question-quality/fixtures/question-intraop-acceptance-batch10-source-reconciliation-20261113.json");
    const archiveBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-intraop-batch10-reconciliation-archive-20261113.json",import.meta.url));
    expect(sha(archiveBytes)).toBe("612551dd56fa127ba511d482b04c4933a47e15c48c954849986506f8f5de8019");
    const archive=JSON.parse(archiveBytes.toString("utf8"));
    expect(archive.records.map((r:{path:string})=>r.path)).toEqual(["packages/clinical-content/src/question-intraop-anesthetic-intraoperative-crises-20261112.ts", "packages/clinical-content/src/question-intraop-anorectal-eua-and-fistula-20261112.ts", "packages/clinical-content/src/question-intraop-endoscopic-upper-gi-hemostasis-20261112.ts", "packages/clinical-content/src/question-intraop-parathyroid-localization-and-preservation-20261112.ts", "packages/clinical-content/src/question-intraop-pediatric-anesthesia-events-20261112.ts", "packages/clinical-content/src/question-intraop-pediatric-orchiopexy-findings-20261112.ts", "packages/clinical-content/src/question-intraop-polypectomy-technique-and-bleeding-20261112.ts", "docs/research/question-intraop-anesthetic-intraoperative-crises-20261112.json", "docs/research/question-intraop-anesthetic-intraoperative-crises-20261112.md"]);
    for (const record of reconciliation.records) {
      const archived=archive.records.find((r:{path:string})=>r.path===record.path);
      if(archived)expect(existsSync(new URL("../../../"+record.path,import.meta.url)),record.path+" excluded working source").toBe(false);
      const current = archived?Buffer.from(archived.sourceText):raw(record.path);
      if(archived)expect(sha(current)).toBe(archived.sha256);
      expect(sha(current), record.path + " complete authorized postimage").toBe(record.afterSha256);
      expect(sha(beforeAuthorizedBatch10IntegrationPins(current)), record.path + " original pinned bytes").toBe(record.beforeSha256);
      const mutation = Buffer.concat([current, Buffer.from("\n// unauthorized\n")]);
      expect(sha(beforeAuthorizedBatch10IntegrationPins(mutation))).not.toBe(record.beforeSha256);
    }
  });

  it("pins exact release source deltas, presence and every immutable epoch preimage",()=>{
    const bytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-program-batch10-release-source-pins-20261113.json",import.meta.url));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe("a2ec9c0efa82b6b812197e5e5a5d95b7f8b1e4540feb1afe2e7cd62608755265");
    const pins=JSON.parse(bytes.toString("utf8"));
    const hash=(path:string)=>createHash("sha256").update(readFileSync(new URL("../../../"+path,import.meta.url))).digest("hex");
    expect(hash(pins.capturePath)).toBe(pins.capturedFixtureSha256);
    expect(hash("packages/clinical-content/src/question-program-batch10-acceptance-test-support.ts")).toBe(pins.testSupportSha256);
    expect(hash(pins.repairedTopicTestArchivePath)).toBe(pins.repairedTopicTestArchiveSha256);
    const migration=read(pins.capturePath);expect(pins.paths).toHaveLength(19);
    expect(pins.paths.map((p:{path:string})=>p.path)).toEqual(migration.files.map((r:{path:string})=>r.path));
    for(const pin of pins.paths){
      const row=migration.files.find((r:{path:string})=>r.path===pin.path)!;
      expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
      expect(createHash("sha256").update(row.beforeText).digest("hex")).toBe(row.beforeSha256);
      const url=new URL("../../../"+pin.path,import.meta.url);expect(existsSync(url)).toBe(pin.requiredReleaseSha256!==null);
      const current=existsSync(url)?readFileSync(url,"utf8"):undefined;
      if(current!==undefined)expect(hash(pin.path)).toBe(pin.requiredReleaseSha256);
      expect(createHash("sha256").update(beforeProgramBatch10AcceptanceSource(pin.path,current)!).digest("hex")).toBe(row.beforeSha256);
      if(current!==undefined)expect(()=>beforeProgramBatch10AcceptanceSource(pin.path,current+"\n// unauthorized\n")).toThrow();
    }
  });
});
