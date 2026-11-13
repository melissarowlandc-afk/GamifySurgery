import {beforeProgramBatch8AcceptanceRelease,beforeProgramBatch8AcceptanceManifest,programBatch8HistoricalMembership} from "./question-program-batch8-acceptance-test-support";
import {createHash} from "node:crypto";
import {existsSync,readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {SYNTHETIC_CLINICAL_RELEASE as currentLive} from "./synthetic-content";
import {topicQuestionAcceptance,topicCaseIsExplicitlyLive,retainedTopicCase} from "./question-program-batch6-acceptance-test-support";

const manifest=beforeProgramBatch8AcceptanceManifest(currentManifest);
const live=beforeProgramBatch8AcceptanceRelease(currentLive);
const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const digest=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const repairs=read("tools/question-quality/fixtures/question-topic-batches45-repaired-tests-20261112.json") as {
  records:Array<{path:string;beforeSha256:string;afterSha256:string;afterText:string}>;
};
const archives=[1,2,3,4,5,6].map(n=>read(`tools/question-quality/fixtures/question-topic-acceptance-batch${n}-before-${n===6?"20261112":"20261111"}.json`));
// Batch1's original archive names these fields differently. Normalize only
// the recorded container names; every captured object and ID remains intact.
const topics=archives.flatMap((archive,index)=>archive.topics.map((topic: {config:{slug:string};candidates:Array<{case:{id:string};records?:unknown[];nodeRecords?:unknown[]}>})=>({
  ...topic,candidates:topic.candidates.map(candidate=>({
    ...candidate,records:index===0?candidate.nodeRecords!:candidate.records!,
  })),
})));
const retainedCases=archives.flatMap((archive,index)=>index===0?archive.default.replacementBeforeCases:archive.default.retainedCases);
const migration=read("tools/question-quality/fixtures/question-topic-acceptance-batch5-source-migration-20261111.json");
const topicRows=manifest.accepted.filter(row=>row.sourceView.startsWith("topic-batch"));
const batch6Repairs=read("tools/question-quality/fixtures/question-topic-batch6-repaired-tests-20261112.json") as {
  records:Array<{path:string;beforeSha256:string;afterSha256:string;afterText:string}>;
};
const batch6Migration=read("tools/question-quality/fixtures/question-topic-acceptance-batch6-source-migration-20261112.json");
const repairedTopics=[...repairs.records,...batch6Repairs.records.filter(record=>!repairs.records.some(previous=>previous.path===record.path))].map(record=>({record,slug:record.path.match(/question-topic-(.*)-20261111\.test\.ts$/)![1]!}));

describe("frozen repaired topic acceptance membership in the release",()=>{
  it("retains all25 exact repaired source postimages without importing raw draft modules",()=>{
    expect(repairs.records).toHaveLength(25);
    for(const record of repairs.records){
      const original=migration.files.find((row:{path:string})=>row.path===record.path);
      expect(original,record.path).toBeDefined();
      expect(record.beforeSha256).toBe(original.beforeSha256);
      expect(record.afterSha256).toBe(original.afterSha256);
      expect(createHash("sha256").update(record.afterText).digest("hex")).toBe(original.afterSha256);
      expect(existsSync(new URL("../../../"+record.path,import.meta.url)),record.path+" excluded authoring dependency").toBe(false);
    }
  });

  it("retains both exact batch6 repaired authoring postimages and requires absent raw modules",()=>{
    expect(batch6Repairs.records).toHaveLength(2);
    for(const record of batch6Repairs.records){
      const row=batch6Migration.files.find((row:{path:string})=>row.path===record.path);
      expect(row,record.path).toBeDefined();
      expect(record.beforeSha256).toBe(row.beforeSha256);
      expect(record.afterSha256).toBe(row.afterSha256);
      expect(createHash("sha256").update(record.afterText).digest("hex")).toBe(row.afterSha256);
      expect(existsSync(new URL("../../../"+record.path,import.meta.url))).toBe(false);
    }
  });

  it.each(repairedTopics)("checks every captured $slug proposal against exact accepted/live authority",({record,slug})=>{
    const capturedTopics=topics.filter(topic=>topic.config.slug===slug);
    expect(capturedTopics.length,record.path).toBeGreaterThan(0);
    const candidates=capturedTopics.flatMap(topic=>topic.candidates);
    for(const candidate of candidates)expect(Array.isArray(candidate.records),slug+" complete captured records").toBe(true);
    const ids=[...new Set<string>(candidates.flatMap(candidate=>candidate.records.map((row:unknown)=>(row as {question:{id:string}}).question.id)))];
    expect(ids.length,slug).toBeGreaterThan(0);
    for(const id of ids){
      const accepted=topicQuestionAcceptance(id);
      expect(accepted.accepted).toBe(manifest.accepted.some(row=>row.questionVariantId===id));
      expect(accepted.live).toBe(live.cases.some(cs=>cs.decisionNodes.some(node=>node.questionVariantId===id)));
    }
    for(const candidate of candidates){
      expect(topicCaseIsExplicitlyLive(candidate.case.id)).toBe(live.cases.some(cs=>cs.id===candidate.case.id));
    }
  });

  it("checks all627 historical topic authority rows and every retained topic case",()=>{
    expect(topicRows).toHaveLength(627);
    for(const id of new Set(topicRows.map(row=>row.questionVariantId)))expect(topicQuestionAcceptance(id).accepted).toBe(true);
    const retiredIds=new Set<string>(retainedCases.map((cs:{id:string})=>cs.id));
    for(const id of retiredIds){
      const retained=retainedTopicCase(id)!;
      expect(retained.id).toBe(id);
      const originals=retainedCases.filter((cs:{id:string})=>cs.id===id);
      expect(originals.some((cs:unknown)=>digest(cs)===digest(retained)),id+" immutable retained definition").toBe(true);
      for(const node of retained.decisionNodes)expect(live.concepts.some(co=>co.id===node.primaryConceptId)).toBe(true);
    }
  });

  it("binds all622 current topic rows and all777 current acceptances before historical membership checks",()=>{
    expect(currentManifest.accepted).toHaveLength(777);
    expect(currentManifest.accepted.filter(r=>r.sourceView.startsWith("topic-batch"))).toHaveLength(622);
    for(const row of currentManifest.accepted)programBatch8HistoricalMembership(currentLive,currentManifest,{questionVariantId:row.questionVariantId});
    const archiveBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-topic-batch7-retained-authoring-tests-20261112.json",import.meta.url));
    expect(createHash("sha256").update(archiveBytes).digest("hex")).toBe("0b8003094103b1a53578ef1a3eac96d190e273a3c8bccbe2f99cc1c16cd55060");
    const archive=JSON.parse(archiveBytes.toString("utf8"));expect(archive.records).toHaveLength(4);
    for(const record of archive.records){
      expect(createHash("sha256").update(record.sourceText).digest("hex")).toBe(record.sha256);
      expect(existsSync(new URL("../../../"+record.path,import.meta.url))).toBe(false);
    }
  });
});
