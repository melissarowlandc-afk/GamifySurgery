import {beforeProgramBatch8AcceptanceRelease,beforeProgramBatch8AcceptanceManifest,beforeProgramBatch8AcceptanceTimings} from "./question-program-batch8-acceptance-test-support";
import {createHash} from "node:crypto";
import {readFileSync,existsSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as currentLive,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as currentTiming} from "./answer-choice-timing";
import {
  QUESTION_PROGRAM_BATCH7_ACCEPTED_CASES as cases,QUESTION_PROGRAM_BATCH7_ACCEPTED_ROWS as rows,
  QUESTION_PROGRAM_BATCH7_ACCEPTED_SOURCE_VIEWS as views,QUESTION_PROGRAM_BATCH7_ACCEPTED_QUESTIONS as questions,
  QUESTION_PROGRAM_BATCH7_RETIREMENTS as retirements,QUESTION_PROGRAM_BATCH7_RETAINED_CASES as retired,
  QUESTION_PROGRAM_BATCH7_ACCEPTED_TIMING_ENTRIES as timings,QUESTION_PROGRAM_BATCH7_ACCEPTED_TEST_ORDER_RECORDS as orders,
  QUESTION_PROGRAM_BATCH7_CLINICAL_CONFIRMATIONS as confirmations,
  QUESTION_PROGRAM_BATCH7_CLINICALLY_APPROVED_QUESTIONS as approved,
  QUESTION_PROGRAM_BATCH7_KEY_CONFIRMED_QUESTIONS as keyOnly,questionProgramBatch7ClinicalReview as clinicalReview,
} from "./question-program-batch7-accepted-20261112";
import {beforeProgramBatch7AcceptanceRelease as previous,beforeProgramBatch7AcceptanceManifest as previousManifest,
  beforeProgramBatch7AcceptanceTimings as previousTimings,beforeProgramBatch7AcceptanceSource as previousSource} from "./question-program-batch7-acceptance-test-support";

const live=beforeProgramBatch8AcceptanceRelease(currentLive);
const manifest=beforeProgramBatch8AcceptanceManifest(currentManifest);
const timing=beforeProgramBatch8AcceptanceTimings(currentTiming);
const read=(p:string)=>JSON.parse(readFileSync(new URL("../../../"+p,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-topic-acceptance-batch7-before-20261112.json");
const after=read("tools/question-quality/fixtures/question-topic-acceptance-batch7-after-20261112.json");
const disposition=read("docs/research/question-topic-acceptance-batch7-dispositions-20261112.json");
const freeze=read("docs/research/question-topic-acceptance-batch7-source-freeze-20261112.json");
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const raw=(p:string)=>readFileSync(new URL("../../../"+p,import.meta.url));

describe("batch7 exact final PASS acceptance and owner decisions",()=>{
  it("applies review3fix precedence and admits 82 requested nodes while recording five precise skips",()=>{
    expect(disposition.requested).toBe(87);expect(rows).toHaveLength(82);expect(cases).toHaveLength(73);
    expect(before.topics.map((t:{dispositions:unknown[]})=>t.dispositions.length)).toEqual([31,15,9,30]);
    expect(disposition.items.filter((r:{status:string})=>r.status==="skipped").map((r:{questionVariantId:string})=>r.questionVariantId).sort()).toEqual([
      "question.topic.ethics-professionalism.r3.return-to-duties.v3",
      "question.topic.quality-safety-systems.round3.minor-nonurgent-dissent.v1",
      "question.topic.quality-safety-systems.round3.child-protective-authorization.v1",
      "question.topic.quality-safety-systems.round3.error-known-facts.v1",
      "question.topic.quality-safety-systems.round3.sentinel-external-report.v1",
    ].sort());
    for(const r of rows)expect(freeze.records.find((f:{questionVariantId:string})=>f.questionVariantId===r.questionVariantId).reviewRecord.verdict).toBe("PASS");
    const excluded=new Set(before.topics.flatMap((t:{nonpass:Array<{record:{id:string}}>})=>t.nonpass.map(r=>r.record.id)));
    excluded.add("question.topic-soft-tissue-sarcoma-desmoid.calf-core-tract.20261111.v3");
    expect(rows.some(r=>excluded.has(r.questionVariantId))).toBe(false);
  });

  it("accepts only complete topic cases and preserves the two legacy MRI nodes beside D97 overrides",()=>{
    for(const cs of cases){
      const active=live.cases.find(c=>c.id===cs.id)!;expect(active).toEqual(cs);
      const scored=rows.filter(r=>r.caseId===cs.id);
      if(scored[0]!.sourceView!=="topic-batch7-d97aa716")expect(scored).toHaveLength(cs.decisionNodes.length);
      else {
        expect(scored).toHaveLength(1);
        const prior=before.defaultRelease.cases.find((c:{id:string})=>c.id===cs.id);
        expect(cs.decisionNodes[0]).toEqual(prior.decisionNodes[0]);
        expect(cs.decisionNodes[1]!.primaryConceptId).toBe("concept.soft-tissue-mass.specialist-planned-biopsy");
        expect(cs.decisionNodes[1]!.answerChoices.map(c=>[c.id,c.isCorrect])).toEqual(prior.decisionNodes[1].answerChoices.map((c:{id:string;isCorrect:boolean})=>[c.id,c.isCorrect]));
      }
    }
  });

  it("pins every reviewed source and accepted node/question without changing draft status",()=>{
    expect(questions).toHaveLength(82);expect(freeze.records).toHaveLength(82);
    for(const f of freeze.records){
      expect(createHash("sha256").update(f.sourceNodeJson).digest("hex")).toBe(f.sourceNodeSha256);
      expect(createHash("sha256").update(f.sourceQuestionJson).digest("hex")).toBe(f.sourceQuestionSha256);
      const node=cases.find(c=>c.id===f.caseId)!.decisionNodes.find(n=>n.id===f.nodeId)!;
      const q=questions.find(q=>q.id===f.questionVariantId)!;
      expect(digest(node)).toBe(f.sourceNodeSha256);
      expect(digest(q)).toBe(f.sourceQuestionSha256);
      expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();
    }
    expect(read("tools/question-quality/fixtures/question-topic-acceptance-batch7-literal-name-corrections-20261112.json").records).toEqual([]);
  });

  it("keeps all unrelated default cases and every existing concept exact, with no history remapping",()=>{
    const changed=new Set([...cases.map(c=>c.id),...retired.map(c=>c.id)]);
    for(const cs of before.defaultRelease.cases.filter((c:{id:string})=>!changed.has(c.id)))expect(live.cases.find(c=>c.id===cs.id)).toEqual(cs);
    for(const concept of before.defaultRelease.concepts)expect(live.concepts.find(c=>c.id===concept.id)).toEqual(concept);
    expect(digest(previous(live))).toBe(before.defaultSha256);
    expect(previousManifest(manifest)).toEqual(before.manifest);
    expect(previousTimings(timing)).toEqual(before.timing);
    expect(digest(catalog)).toBe(before.catalogSha256);
  });

  it("binds the new default counts, complete authority and source-view hashes",()=>{
    expect(manifest.id).toBe("question-ship.2026-11-12.v16");expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.accepted).toHaveLength(772);expect(digest(manifest)).toBe(after.manifestSha256);
    expect(live.cases).toHaveLength(1408);expect(live.cases.flatMap(c=>c.decisionNodes)).toHaveLength(1612);
    expect(live.concepts).toHaveLength(1105);expect(new Set(live.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size).toBe(907);
    expect(digest(live)).toBe(after.defaultSha256);
    for(const row of rows)expect(manifest.accepted.find(r=>r.acceptanceId===row.acceptanceId)).toEqual(row);
    expect(Object.keys(views)).toHaveLength(5);
  });

  it("retires exactly the three directed standalone cases while retaining their source and concepts",()=>{
    expect(retirements).toHaveLength(3);expect(retired).toHaveLength(3);expect(manifest.retirements).toEqual(retirements);
    for(const cs of retired){
      expect(cs.decisionNodes).toHaveLength(1);expect(live.cases.some(c=>c.id===cs.id)).toBe(false);
      expect(previous(live).cases.find(c=>c.id===cs.id)).toEqual(cs);
      for(const node of cs.decisionNodes)expect(live.concepts.some(c=>c.id===node.primaryConceptId)).toBe(true);
    }
    expect(live.cases.some(cs=>cs.decisionNodes.some(n=>n.questionVariantId==="question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1"))).toBe(true);
    expect(disposition.retirementCoverage.filter((r:{liveCaseIds:string[];status:string})=>r.liveCaseIds.length&&r.status==="accepted_successor")).toEqual([]);
  });

  it("records 17 exact full-version approvals and five key-only confirmations without approving successor wording",()=>{
    expect(confirmations).toHaveLength(22);expect(approved).toHaveLength(17);expect(keyOnly).toHaveLength(5);
    expect(new Set(confirmations.map(c=>c.questionVariantId)).size).toBe(22);
    for(const r of before.ownerConfirmations){
      const q=clinicalReview(r.question.id)!;expect(q).not.toBeNull();
      const {reviewStatus:_s,lastClinicianReview:_r,...other}=q;
      const {reviewStatus:_oldStatus,lastClinicianReview:_oldReview,...old}=r.question;
      expect(other).toEqual(old);
      expect(q.reviewStatus).toBe(r.scope==="full"?"clinically_approved":"needs_clinician_review");
      expect(q.lastClinicianReview).toEqual({reviewer:"Melissa Rowland (clinical sign-off)",reviewedOn:"2026-11-12",contentVersion:r.question.contentVersion});
      expect(confirmations.find(c=>c.questionVariantId===q.id)!.correctChoiceId).toBe(r.correctChoiceId);
      expect(questions.some(candidate=>candidate.id===q.id)).toBe(false);
    }
    expect(keyOnly.map(q=>q.id).sort()).toEqual(before.ownerConfirmations.filter((r:{scope:string})=>r.scope==="key_only").map((r:{question:{id:string}})=>r.question.id).sort());
    expect(clinicalReview("question.unconfirmed.successor.v1")).toBeNull();
  });

  it("limits the D97-2 provenance correction to two packet fields and its ledger mapping",()=>{
    const corrections=read("tools/question-quality/fixtures/question-topic-acceptance-batch7-d97-metadata-correction-20261112.json");
    expect(corrections.playerFacingChanges).toBe(0);expect(corrections.corrections.map((r:{fields:unknown[]})=>r.fields.length)).toEqual([2,1]);
    for(const item of corrections.corrections){
      const original=JSON.parse(before.sourcePreimages.find((r:{path:string})=>r.path===item.file).beforeText);
      for(const field of item.fields){let parent=original;for(const key of field.path.slice(0,-1))parent=parent[key];expect(parent[field.path.at(-1)]).toBe(field.before);parent[field.path.at(-1)]=field.after;}
      expect(read(item.file)).toEqual(original);
    }
    const flag=read("docs/research/question-flag-d97aa716-20261112.json")[1];
    expect(flag.selfCheck.sourceClosure).toContain("biceps-anterior");expect(flag.evidenceMapping[0].type).toContain("upper-arm");
  });

  it("preserves all tested timing tuples and exposes thirteen exact future-planned wait bindings",()=>{
    expect(timings).toHaveLength(82);expect(orders).toHaveLength(13);expect(timing.slice(-82)).toEqual(timings);
    for(const order of orders){const node=cases.find(c=>c.id===order.caseId)!.decisionNodes.find(n=>n.id===order.nodeId)!;
      expect(node.questionVariantId).toBe(order.questionVariantId);expect(node.answerChoices.find(c=>c.id===order.choiceId)!.label).toBe(order.choiceLabel);
      expect(order.disposition).toEqual({kind:"not_executed",reason:"future_planned"});}
    expect(disposition.waitBindingsNeeded).toEqual(orders);
  });

  it("rejects unrelated release, authority and source drift rather than accepting broad historical normalization",()=>{
    const mutated=structuredClone(live);mutated.cases[0]!.presentation+=" changed";expect(()=>previous(mutated)).toThrow();
    const authority=structuredClone(manifest);authority.accepted[0]!.decision+=" changed";expect(()=>previousManifest(authority)).toThrow();
    const sourcePath="packages/clinical-content/src/question-ship-manifest.ts";
    expect(()=>previousSource(sourcePath,raw(sourcePath).toString("utf8")+" changed")).toThrow();
  });

  it("pins exact release source deltas, presence and every immutable epoch preimage",()=>{
    const bytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-program-batch7-release-source-pins-20261112.json",import.meta.url));
    expect(createHash("sha256").update(bytes).digest("hex")).toBe("0207ad4151af480e2d331ee7d323dab5109d739bcd6a1b4fa16415440ba4c9bd");
    const pins=JSON.parse(bytes.toString("utf8"));
    const hash=(path:string)=>createHash("sha256").update(readFileSync(new URL("../../../"+path,import.meta.url))).digest("hex");
    expect(hash(pins.capturePath)).toBe(pins.capturedFixtureSha256);
    expect(hash("packages/clinical-content/src/question-program-batch7-acceptance-test-support.ts")).toBe(pins.testSupportSha256);
    const migration=read(pins.capturePath);expect(pins.paths).toHaveLength(24);
    expect(pins.paths.map((p:{path:string})=>p.path)).toEqual(migration.files.map((r:{path:string})=>r.path));
    for(const pin of pins.paths){
      const row=migration.files.find((r:{path:string})=>r.path===pin.path)!;
      expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
      expect(createHash("sha256").update(row.beforeText).digest("hex")).toBe(row.beforeSha256);
      const url=new URL("../../../"+pin.path,import.meta.url);expect(existsSync(url)).toBe(pin.requiredReleaseSha256!==null);
      const current=existsSync(url)?readFileSync(url,"utf8"):undefined;
      if(current!==undefined)expect(hash(pin.path)).toBe(pin.requiredReleaseSha256);
      expect(createHash("sha256").update(previousSource(pin.path,current as string)).digest("hex")).toBe(row.beforeSha256);
    }
    expect(hash(pins.repairedTopicTestArchivePath)).toBe(pins.repairedTopicTestArchiveSha256);
  });
});
