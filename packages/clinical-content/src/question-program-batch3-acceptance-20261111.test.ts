import {beforeProgramBatch4AcceptanceRelease,beforeProgramBatch4AcceptanceManifest,beforeProgramBatch4AcceptanceTimings} from "./question-program-batch4-acceptance-test-support";
import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {SYNTHETIC_CLINICAL_RELEASE as currentLive,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as currentManifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as currentTiming} from "./answer-choice-timing";
import {QUESTION_PROGRAM_BATCH3_ACCEPTED_CASES as cases,QUESTION_PROGRAM_BATCH3_ACCEPTED_ROWS as rows,
  QUESTION_PROGRAM_BATCH3_ACCEPTED_QUESTIONS as questions,QUESTION_PROGRAM_BATCH3_ACCEPTED_SOURCE_VIEWS as views,
  QUESTION_PROGRAM_BATCH3_RETAINED_CASES as retired,QUESTION_PROGRAM_BATCH3_REPLACEMENTS as replacements,
  QUESTION_PROGRAM_BATCH3_CONSOLIDATIONS as consolidations,QUESTION_PROGRAM_BATCH3_FROZEN_PRESERVATION as frozen,
  QUESTION_PROGRAM_BATCH3_ACCEPTED_TEST_ORDER_RECORDS as orders,QUESTION_PROGRAM_BATCH3_CLAIMS as claims} from "./question-program-batch3-accepted-20261111";
import {beforeProgramBatch3AcceptanceRelease as previous,beforeProgramBatch3AcceptanceManifest as previousManifest,
  beforeProgramBatch3AcceptanceTimings as previousTimings,beforeProgramBatch3AcceptanceSource as previousSource,
  withProgramBatch3PresentationCorrections as correctPresentation} from "./question-program-batch3-acceptance-test-support";
const live=beforeProgramBatch4AcceptanceRelease(currentLive);
const manifest=beforeProgramBatch4AcceptanceManifest(currentManifest);
const timing=beforeProgramBatch4AcceptanceTimings(currentTiming);
const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const before=read("tools/question-quality/fixtures/question-topic-acceptance-batch3-before-20261111.json");
const decisions=read("docs/research/question-topic-acceptance-batch3-dispositions-20261111.json");
const nameCorrections=read("tools/question-quality/fixtures/question-topic-acceptance-batch3-literal-name-corrections-20261111.json");
const digest=(value:unknown)=>createHash("sha256").update(JSON.stringify(value)).digest("hex");

describe("topic batch3 complete exact PASS acceptance",()=>{
  it("accounts for225 requested nodes with211 acceptances and14 explicit exclusions",()=>{
    expect(decisions.requested).toBe(225);expect(decisions.accepted).toBe(211);expect(decisions.skipped).toBe(14);
    expect(cases).toHaveLength(199);expect(new Set(rows.map(row=>row.nodeId)).size).toBe(211);
    expect(rows.map(row=>row.nodeId).sort()).toEqual(decisions.items.filter((row:{status:string})=>row.status==="accepted").map((row:{nodeId:string})=>row.nodeId).sort());
    for(const cs of cases)for(const node of cs.decisionNodes)expect(rows.filter(row=>row.caseId===cs.id&&row.nodeId===node.id&&row.questionVariantId===node.questionVariantId)).toHaveLength(1);
    for(const item of decisions.items.filter((row:{status:string})=>row.status==="skipped")){
      if(item.evidence?.record.verdict==="PASS")expect(item.unlistedSiblingIds.length).toBeGreaterThan(0);
      else expect(item.evidence.record.verdict).toBe("REVISE");
      expect(live.cases.some(cs=>cs.decisionNodes.some(node=>node.id===item.nodeId))).toBe(false);
    }
  });
  it("pins404 authority rows and1250cases/1514nodes/813registered/646scored meanings",()=>{
    expect(manifest.id).toBe("question-ship.2026-11-11.v12");expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.accepted).toHaveLength(404);expect(manifest.replacements).toHaveLength(28);expect(manifest.topicConsolidations).toHaveLength(30);
    expect(manifest.legacyBindings).toEqual(before.manifest.legacyBindings);
    expect(digest(manifest)).toBe("f513973eb86567fdf9dcb24bd5ceb318fc95403ed5a4776577a4413502a8f18f");
    expect(live.cases).toHaveLength(1250);expect(live.cases.flatMap(cs=>cs.decisionNodes)).toHaveLength(1514);expect(live.concepts).toHaveLength(813);
    expect(new Set(live.cases.flatMap(cs=>cs.decisionNodes.map(node=>node.primaryConceptId))).size).toBe(646);
    expect(digest(live)).toBe("d496267ffb29477ed2437de391119fca352c0a43ac9fd41bb3e979e285927d6a");
    expect(previousManifest(manifest)).toEqual(before.manifest);expect(digest(catalog)).toBe(before.catalogSha256);
  });
  it("restores every prior row and654 meaning definitions with a complete inverse hash",()=>{
    const restored=previous(live);expect(restored.cases).toHaveLength(1174);expect(restored.concepts).toHaveLength(654);expect(digest(restored)).toBe(before.default.sha256);
    expect(retired).toHaveLength(123);expect(retired.flatMap(cs=>cs.decisionNodes)).toHaveLength(188);expect(replacements).toHaveLength(16);expect(consolidations).toHaveLength(29);
    for(const cs of retired){expect(live.cases.some(current=>current.id===cs.id)).toBe(false);expect(restored.cases.find(current=>current.id===cs.id)).toEqual(cs);
      for(const node of cs.decisionNodes)expect(live.concepts.some(concept=>concept.id===node.primaryConceptId)).toBe(true);}
  });
  it("preserves every reviewed field except the exact authorized presentation substitutions",()=>{
    for(const cs of cases){
      const captured=before.topics.flatMap((topic:{candidates:Array<{case:{id:string}}>})=>topic.candidates).find((row:{case:{id:string}})=>row.case.id===cs.id);
      const adjustment=decisions.stageAdjustments.find((row:{caseId:string})=>row.caseId===cs.id);
      const corrected=correctPresentation(captured.case,cs.id);
      expect(cs).toEqual({...corrected,routineEligible:true,earliestFacilityStage:adjustment?.after??captured.case.earliestFacilityStage,learningSummary:cs.decisionNodes.map(node=>node.explanation).join(" ")});
      expect(digest(cs)).toBe(frozen.find(record=>record.caseId===cs.id)!.retainedCaseSha256);
      for(const node of cs.decisionNodes){const source=captured.records.find((record:{node:{id:string}})=>record.node.id===node.id),question=questions.find(question=>question.id===node.questionVariantId)!;
        expect(node).toEqual(corrected.decisionNodes.find((candidate:{id:string})=>candidate.id===node.id));
        expect(question).toEqual(correctPresentation(source.question,question.id));expect(source.evidence.record.verdict).toBe("PASS");
        expect(question.reviewStatus).toBe("needs_clinician_review");expect(question.lastClinicianReview).toBeNull();expect(node.shuffleAnswers).toBe(true);
        for(const claimId of question.supportingEvidenceClaimIds)expect(claims.some(claim=>claim.id===claimId)).toBe(true);
      }
    }
  });
  it("binds27 static source views without mutable topic-worker runtime imports",()=>{
    expect(Object.keys(views)).toHaveLength(27);
    for(const record of decisions.sourceViews)expect(digest(views[record.name]!)).toBe(record.sha256);
    const wrapper=readFileSync(new URL("./question-program-batch3-accepted-20261111.ts",import.meta.url),"utf8");expect(wrapper).not.toMatch(/from\s+["']\.\/question-topic-/);
    const statistics=views["topic-batch3-statistics"]!;expect(statistics.cases).toHaveLength(24);
    for(const cs of statistics.cases){expect(cs.participant?.kind).toBe("employee_discussion");expect(cs.decisionNodes).toHaveLength(1);
      expect((cs.presentation+" "+(cs.decisionNodes[0]!.currentUpdate??"")).trim().split(/\s+/).length).toBeLessThanOrEqual(60);}
  });
  it("retains original reviewed serializations and binds only the authorized presentation differences",()=>{
    const freeze=read("docs/research/question-topic-acceptance-batch3-source-freeze-20261111.json");
    expect(freeze.records).toHaveLength(211);expect(freeze.exactFields).toBe(211);
    for(const record of freeze.records){
      expect(createHash("sha256").update(record.sourceNodeJson).digest("hex")).toBe(record.sourceNodeSha256);
      expect(createHash("sha256").update(record.sourceQuestionJson).digest("hex")).toBe(record.sourceQuestionSha256);
      const node=cases.find(cs=>cs.id===record.caseId)!.decisionNodes.find(node=>node.id===record.nodeId)!;
      const captured=before.topics.flatMap((topic:{candidates:Array<{case:{id:string}}>})=>topic.candidates).find((candidate:{case:{id:string}})=>candidate.case.id===record.caseId);
      const reviewedNode=captured.records.find((candidate:{node:{id:string}})=>candidate.node.id===record.nodeId)!.node;
      expect(JSON.parse(record.sourceNodeJson)).toEqual(reviewedNode);
      expect(digest(reviewedNode)).toBe(record.runtimeNodeSha256);
      const corrected=correctPresentation(captured.case,record.caseId);
      expect(corrected.decisionNodes.find((candidate:{id:string})=>candidate.id===node.id)).toEqual(node);
      expect(correctPresentation(JSON.parse(record.sourceQuestionJson),record.questionVariantId)).toEqual(questions.find(question=>question.id===record.questionVariantId));
      const accepted=frozen.find(row=>row.caseId===record.caseId)!.nodes.find(row=>row.nodeId===record.nodeId)!;
      expect(digest(node)).toBe(accepted.nodeSha256);
      expect(digest(questions.find(question=>question.id===record.questionVariantId))).toBe(accepted.questionSha256);
      expect(before.topics.find((topic:{sourcePath:string})=>topic.sourcePath===record.sourcePath).sourceSha256).toBe(record.sourceFileSha256);
    }
  });
  it("limits all33 naming repairs to148 authorized name-only context and feedback fields",()=>{
    expect(nameCorrections.records).toHaveLength(33);
    expect(nameCorrections.records.flatMap((record:{fields:unknown[]})=>record.fields)).toHaveLength(148);
    for(const record of nameCorrections.records){
      const cs=cases.find(candidate=>candidate.id===record.caseId)!;
      expect(cs.presentation,cs.id).toContain("{patientName}");
      const demographics=cs.prototypeDemographics!;
      expect(cs.presentation,cs.id).toContain(`${demographics.ageYears}-year-old ${demographics.sexLabel==="Male"?"man":"woman"}`);
      for(const profile of cs.approvedInstantiationProfiles??[]){
        expect(profile.presentation,profile.id).toContain("{patientName}");
        expect(profile.prototypeDemographics).toEqual(demographics);
      }
      for(const field of record.fields){
        const path=field.path.join(".");
        if(field.target==="case")expect(path).toMatch(/^(?:presentation|learningSummary|approvedInstantiationProfiles\.\d+\.presentation|decisionNodes\.\d+\.(?:stem|currentUpdate|explanation|answerChoices\.\d+\.rationale|terminalDispositions\.\d+\.clinicalRationale))$/);
        else expect(path).toMatch(/^(?:stem|explanation|answerChoices\.\d+\.(?:rationale|distractorRationale))$/);
        if(/learningSummary|explanation|rationale/i.test(path)){
          expect(["case.topic.hernia-groin.changing-function.v1","case.topic.surgical-infection-antibiotics.incisional-response.v1"]).toContain(record.caseId);
        }
        const expected=field.before.replaceAll(record.literalName+"?s","{patientName}'s")
          .replaceAll(record.literalName,"{patientName}")
          .replace(new RegExp("\\b"+record.literalName.split(" ")[0]+"\\b","g"),"{patientName}");
        expect(field.after).toBe(expected);
      }
      const captured=before.topics.flatMap((topic:{candidates:Array<{case:{id:string}}>})=>topic.candidates).find((candidate:{case:{id:string}})=>candidate.case.id===cs.id);
      const corrected=correctPresentation(captured.case,cs.id);
      expect(cs.prototypeDemographics).toEqual(captured.case.prototypeDemographics);
      const literalName=new RegExp("\\b(?:"+record.literalName+"|"+record.literalName.split(" ")[0]+")\\b");
      const questionCopies=questions.filter(question=>cs.decisionNodes.some(node=>node.questionVariantId===question.id));
      for(const text of [cs.presentation,cs.learningSummary,...(cs.approvedInstantiationProfiles??[]).map(profile=>profile.presentation),
        ...cs.decisionNodes.map(node=>JSON.stringify(node)),...questionCopies.map(question=>JSON.stringify(question))]){
        expect(text,cs.id+" patient-facing content").not.toMatch(literalName);
      }
      for(const node of cs.decisionNodes){
        const original=captured.case.decisionNodes.find((candidate:{id:string})=>candidate.id===node.id);
        const correctedNode=corrected.decisionNodes.find((candidate:{id:string})=>candidate.id===node.id);
        expect(node.answerChoices).toEqual(correctedNode.answerChoices);
        expect(node.answerChoices.map(({rationale,...choice})=>choice))
          .toEqual(original.answerChoices.map(({rationale,...choice}:{rationale?:string;[key:string]:unknown})=>choice));
        expect(node.explanation).toBe(correctedNode.explanation);
        expect(node.teachingPoint).toBe(original.teachingPoint);
        expect(node.primaryConceptId).toBe(original.primaryConceptId);
        expect(node.questionVariantId).toBe(original.questionVariantId);
      }
    }
    expect(nameCorrections.clarifications).toHaveLength(1);
    expect(nameCorrections.clarifications[0]).toMatchObject({requestedFeedbackReferences:3,serializedFields:13});
  });
  it("preserves the immutable reviewed archive after the presentation-only correction",()=>{
    for(const record of nameCorrections.protectedInputs.slice(0,3)){
      const bytes=readFileSync(new URL("../../../"+record.path,import.meta.url));
      expect(createHash("sha256").update(bytes).digest("hex"),record.path).toBe(record.sha256);
    }
    expect(decisions.presentationCorrections.caseIds).toEqual(nameCorrections.records.map((record:{caseId:string})=>record.caseId));
  });
  it("keeps all2343 previous timing tuples and adds211 exact rows and209 pending orders",()=>{
    expect(timing).toHaveLength(2554);expect(previousTimings(timing)).toEqual(before.timing);expect(orders).toHaveLength(209);
    for(const order of orders){expect(order.disposition).toEqual({kind:"not_executed",reason:"future_planned"});const node=cases.find(cs=>cs.id===order.caseId)!.decisionNodes.find(node=>node.id===order.nodeId)!;
      expect(node.questionVariantId).toBe(order.questionVariantId);expect(node.answerChoices.find(choice=>choice.id===order.choiceId)!.label).toBe(order.choiceLabel);}
  });
  it("retires each decomposed paired case once while all exact successor cases are admitted",()=>{
    const references=[...replacements.map(row=>row.replaces),...consolidations.flatMap(row=>row.replaces)];expect(new Set(references).size).toBe(123);expect(references).toHaveLength(123);
    for(const relation of decisions.retirementCoverage){expect(references.filter(id=>id===relation.legacyCaseId)).toHaveLength(1);for(const target of relation.allTargetCaseIds)expect(cases.some(cs=>cs.id===target)).toBe(true);}
    expect(decisions.retirementCoverage.filter((row:{allTargetCaseIds:string[]})=>row.allTargetCaseIds.length>1)).toHaveLength(6);
  });
  it("rejects unrelated content, authority and timing drift before historical reconstruction",()=>{
    const changed=structuredClone(live);changed.cases.find(cs=>!cases.some(accepted=>accepted.id===cs.id))!.presentation+=" drift";expect(()=>previous(changed)).toThrow();
    const authority=structuredClone(manifest);authority.accepted[0]!.conceptId+=".drift";expect(()=>previousManifest(authority)).toThrow();
    const estimates=structuredClone(timing);estimates[0]!.nodeId+=".drift";expect(()=>previousTimings(estimates)).toThrow();
  });
  it("binds every owned source postimage to its immutable intake preimage",()=>{
    const migration=read("tools/question-quality/fixtures/question-topic-acceptance-batch3-source-migration-20261111.json");
    expect(migration.files.length).toBeGreaterThanOrEqual(9);
    const pinBytes=readFileSync(new URL("../../../tools/question-quality/fixtures/question-program-batch3-release-source-pins-20261111.json",import.meta.url));
    expect(createHash("sha256").update(pinBytes).digest("hex")).toBe("12114f123e309fae37d22eb2639570d9fbc01738f8ad185e219f54920a350677");
    const releasePins=JSON.parse(pinBytes.toString("utf8")) as {capturedFixtureSha256:string;testSupportSha256:string;paths:Array<{path:string;mainBeforeSha256:string;mainAfterSha256:string;requiredReleaseSha256:string}>};
    expect(createHash("sha256").update(readFileSync(new URL("../../../tools/question-quality/fixtures/question-topic-acceptance-batch3-source-migration-20261111.json",import.meta.url))).digest("hex")).toBe(releasePins.capturedFixtureSha256);
    expect(createHash("sha256").update(readFileSync(new URL("./question-program-batch3-acceptance-test-support.ts",import.meta.url))).digest("hex")).toBe(releasePins.testSupportSha256);
    expect(releasePins.paths).toHaveLength(3);
    for(const pin of releasePins.paths){const row=migration.files.find((row:{path:string})=>row.path===pin.path);expect(row).toBeDefined();
      expect(pin.mainBeforeSha256).toBe(row.beforeSha256);expect(pin.mainAfterSha256).toBe(row.afterSha256);
      expect(createHash("sha256").update(readFileSync(new URL("../../../"+pin.path,import.meta.url))).digest("hex")).toBe(pin.requiredReleaseSha256);}
    for(const row of migration.files){expect(row.path).not.toMatch(/\/question-topic-/);const current=readFileSync(new URL("../../../"+row.path,import.meta.url),"utf8");
      expect(createHash("sha256").update(previousSource(row.path,current)).digest("hex")).toBe(row.beforeSha256);}
  });
});
