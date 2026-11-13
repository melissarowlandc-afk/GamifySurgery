import {readFileSync,existsSync} from "node:fs";
import {createHash} from "node:crypto";
import {describe,it,expect} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as live} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {QUESTION_PROGRAM_BATCH9_ACCEPTED_CASES} from "./question-program-batch9-accepted-20261112";
import {QUESTION_PROGRAM_BATCH10_ACCEPTED_CASES} from "./question-program-batch10-accepted-20261113";
import {QUESTION_PROGRAM_BATCH11_ACCEPTED_CASES} from "./question-program-batch11-accepted-20261113";
import {beforeProgramBatch10AcceptanceRelease} from "./question-program-batch10-acceptance-test-support";
import {beforeProgramBatch11AcceptanceRelease} from "./question-program-batch11-acceptance-test-support";

const root=new URL("../../../",import.meta.url);
const raw=(path:string)=>readFileSync(new URL(path,root));
const sha=(value:string|Buffer)=>createHash("sha256").update(value).digest("hex");
const read=(path:string)=>JSON.parse(raw(path).toString("utf8"));

describe("release37 frozen intraop membership, without working authoring modules",()=>{
  it("preserves all18 complete accepted authoring-test repairs as hash-pinned source provenance",()=>{
    const path="tools/question-quality/fixtures/question-intraop-batches9-11-retained-authoring-tests-20261113.json";
    const bytes=raw(path);
    expect(sha(bytes)).toBe("cf1295b6156d128d02a202ec4be44c4d41543f39c8c190cd2e26aa3671b9541b");
    const archive=JSON.parse(bytes.toString("utf8"));
    expect(archive.records).toHaveLength(18);
    expect(new Set(archive.records.map((r:{path:string})=>r.path)).size).toBe(18);
    for(const row of archive.records){
      expect(sha(row.sourceText),row.path).toBe(row.sha256);
      expect(existsSync(new URL(row.path,root)),row.path+" authoring test is archived").toBe(false);
      expect(existsSync(new URL(row.path.replace(/\.test\.ts$/,".ts"),root)),row.path+" working draft stays out").toBe(false);
    }
  });

  it("admits exactly the34 frozen accepted nodes and excludes every withheld whole case",()=>{
    const accepted=[];
    const definitions=[...QUESTION_PROGRAM_BATCH9_ACCEPTED_CASES,...QUESTION_PROGRAM_BATCH10_ACCEPTED_CASES,...QUESTION_PROGRAM_BATCH11_ACCEPTED_CASES];
    for(const [batch,date] of [[9,"20261112"],[10,"20261113"],[11,"20261113"]] as const){
      const records=read(`docs/research/question-intraop-acceptance-batch${batch}-source-freeze-${date}.json`).records;
      const dispositions=read(`docs/research/question-intraop-acceptance-batch${batch}-dispositions-${date}.json`);
      for(const frozen of records){
        expect(sha(frozen.sourceCaseJson)).toBe(frozen.sourceCaseSha256);
        expect(sha(frozen.sourceNodeJson)).toBe(frozen.sourceNodeSha256);
        expect(sha(frozen.sourceQuestionJson)).toBe(frozen.sourceQuestionSha256);
        const clinicalCase=live.cases.find(c=>c.id===frozen.caseId)!;
        expect(clinicalCase,frozen.caseId).toBeDefined();
        const node=clinicalCase.decisionNodes.find(n=>n.id===frozen.nodeId)!;
        const definition=definitions.find(c=>c.id===frozen.caseId)!;
        expect(sha(JSON.stringify(definition))).toBe(frozen.acceptedCaseSha256);
        expect(sha(JSON.stringify(definition.decisionNodes.find(n=>n.id===frozen.nodeId)))).toBe(frozen.acceptedNodeSha256);
        expect(clinicalCase).toEqual(definition);
        expect(manifest.accepted.filter(row=>row.caseId===clinicalCase.id&&row.nodeId===node.id&&row.questionVariantId===node.questionVariantId)).toHaveLength(1);
        accepted.push(frozen);
      }
      const epoch=batch===9?beforeProgramBatch10AcceptanceRelease(live):batch===10?beforeProgramBatch11AcceptanceRelease(live):live;
      for(const withheld of dispositions.skipped)expect(epoch.cases.some(c=>c.id===withheld.caseId),withheld.caseId+" withheld at its recorded acceptance epoch").toBe(false);
    }
    expect(accepted).toHaveLength(34);
    expect(new Set(accepted.map(row=>row.caseId)).size).toBe(29);
  });
});
