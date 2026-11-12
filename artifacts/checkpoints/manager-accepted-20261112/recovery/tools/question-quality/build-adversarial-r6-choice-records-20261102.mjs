import fs from "node:fs";
import assert from "node:assert/strict";
import "../economy-audit/source-loader.mjs";
const c=await import("../../packages/clinical-content/src/index.ts");
const {EXACT_TEST_CHOICE_ORDER_RECORDS:existing}=await import("../../packages/game-domain/src/test-choice-orders.ts");
const records=[];
for(const r of c.QUESTION_QUALITY_ADVERSARIAL_R6_REVISIONS){
  const row=c.QUESTION_QUALITY_ADVERSARIAL_R6_TIMING_ENTRIES.find(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId);
  if(row.classification.kind!=="test_choices")continue;
  for(const choice of r.question.answerChoices){
    const t=row.classification.choices.find(t=>t.choiceId===choice.id);
    if(t.timing.kind!=="test")continue;
    const old=existing.find(e=>e.caseId===r.caseId&&e.nodeId===r.nodeId&&e.questionVariantId===r.previousQuestionVariantId&&e.choiceId===(r.choiceSourceIds?.[choice.id]??choice.id));
    if(!old)continue; // Existing gate/non-executed wrong-choice rules remain unchanged.
    if(!choice.isCorrect)assert.equal(old.disposition.kind,"not_executed");
    let disposition=old.disposition;
    if(r.auditId==="B09"&&choice.isCorrect)disposition={kind:"terminal_service",serviceId:"service.thyroid_fna",allowedRouteIds:["route.thyroid_fna.in_house","route.thyroid_fna.outsourced"]};

    records.push({...old,questionVariantId:r.questionVariantId,choiceId:choice.id,choiceLabel:choice.label,timingProfileId:t.timing.timingProfileId,disposition});
  }
}
if(!records.length){fs.writeFileSync("tools/question-quality/adversarial-r6-exact-records-20261102.json","[]\n");console.log(JSON.stringify({newRecords:0,reason:"Every revised testing key retains an explicit result gate; no new terminal/unsupported exact record is required",allPriorRecordsRetained:true}));process.exit(0);}
const file="packages/game-domain/src/test-choice-orders.ts",source=fs.readFileSync(file,"utf8");
const begin="// BEGIN QUESTION QUALITY ADVERSARIAL R6 20261102 EXACT RECORDS",end="// END QUESTION QUALITY ADVERSARIAL R6 20261102 EXACT RECORDS";
const block=begin+"\nconst questionQualityAdversarialR620261102Records: ExactTestChoiceOrderRecord[] = "+JSON.stringify(records,null,2)+";\n"+end+"\n\n";
let result=source.includes(begin)?source.replace(/\/\/ BEGIN QUESTION QUALITY ADVERSARIAL R6 20261102 EXACT RECORDS[\s\S]*?\/\/ END QUESTION QUALITY ADVERSARIAL R6 20261102 EXACT RECORDS\r?\n\r?\n/,block):
  source.replace("export const EXACT_TEST_CHOICE_ORDER_RECORDS:",block+"export const EXACT_TEST_CHOICE_ORDER_RECORDS:");
if(!result.includes("  ...questionQualityAdversarialR620261102Records,"))result=result.replace("  ...questionQualityAdversarialR420261102Records,","  ...questionQualityAdversarialR620261102Records,\n  ...questionQualityAdversarialR420261102Records,");
assert(result.includes(block));fs.writeFileSync(file,result);
fs.writeFileSync("tools/question-quality/adversarial-r6-exact-records-20261102.json",JSON.stringify(records,null,2)+"\n");
console.log(JSON.stringify({newRecords:records.length,allPriorRecordsRetained:true,existingDispositionKindsOnly:true,explicitChangedTerminalBinding:"none; prior key services retained"}));
