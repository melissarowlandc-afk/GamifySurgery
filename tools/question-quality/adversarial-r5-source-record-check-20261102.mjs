import fs from "node:fs";
import assert from "node:assert/strict";
import "../economy-audit/source-loader.mjs";
import {collectAuthoredMetadata} from "./bank.mjs";
const c=await import("../../packages/clinical-content/src/index.ts"),metadata=collectAuthoredMetadata(c);
const claimIds=new Set(c.QUESTION_QUALITY_ADVERSARIAL_R5_REVISIONS.flatMap(r=>r.question.supportingEvidenceClaimIds));
const sourceIds=new Set([...claimIds].flatMap(id=>metadata.claims.get(id).sourceIds));
const required=["id","completeCitation","organizationOrJournal","officialUrl","accessedOn","sourceClass","licenseLabel","reuseStatus","reuseNotes","authorityAssessment","usageRole"];
const missing=[],undated=[];
for(const id of sourceIds){
 const s=metadata.sources.get(id);assert(s,id);
 for(const field of required)if(s[field]===undefined||s[field]===null||s[field]==="")missing.push({id,field});
 assert(Object.hasOwn(s,"publicationYear"),id+" publication-year field");
 if(s.publicationYear===null)undated.push({id,year:"n.d.",accessedOn:s.accessedOn,reason:"Original record is undated web guidance; no publication year is invented from its access date."});
 else assert(Number.isInteger(s.publicationYear),id);
 assert(Array.isArray(s.evidenceClaimIds));assert(Array.isArray(s.authors));
 assert(!/uptodate|accesssurgery|scoreportal|absitemastery/i.test(s.officialUrl),id+" restricted source route");
}
assert.deepEqual(missing,[]);
const entry=JSON.parse(fs.readFileSync("tools/question-quality/fixtures/adversarial-r5-before-20261102.json","utf8"));
for(const a of entry.approvals){
 const old=entry.revisions.find(r=>r.auditId===a.auditId),now=c.QUESTION_QUALITY_CURRENT_REVISIONS.find(r=>r.auditId===a.auditId);
 const before=entry.cases.find(cs=>cs.id===old.caseId),after=c.SYNTHETIC_CLINICAL_RELEASE.cases.find(cs=>cs.id===now.caseId);
 assert.equal(JSON.stringify(after.decisionNodes.find(n=>n.id===now.nodeId)),JSON.stringify(before.decisionNodes.find(n=>n.id===old.nodeId)),a.auditId+" exact serialized runtime node");
}
const result={checkedOn:"2026-11-02",status:"passed",scope:"Offline metadata completeness and exact serialized approved runtime-node proof only; the immutable JSON entry omits undefined optional fields. No fresh source retrieval or clinical approval.",mappedClaims:claimIds.size,sourceRecords:sourceIds.size,requiredFields:required,missing:[],undated,exactApprovedRuntimeNodes:entry.approvals.length};
fs.writeFileSync("tools/question-quality/adversarial-r5-source-record-check-20261102.json",JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({status:result.status,claims:claimIds.size,sources:sourceIds.size,undatedRecords:undated.length,approvedRuntimeNodes:entry.approvals.length}));
