import fs from "node:fs";
import assert from "node:assert/strict";
import "../economy-audit/source-loader.mjs";
const c=await import("../../packages/clinical-content/src/index.ts");
const {EXACT_TEST_CHOICE_ORDER_RECORDS:existing}=await import("../../packages/game-domain/src/test-choice-orders.ts");
const records=[];
for(const r of c.QUESTION_QUALITY_ADVERSARIAL_R4_REVISIONS){
  const row=c.QUESTION_QUALITY_ADVERSARIAL_R4_TIMING_ENTRIES.find(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId);
  if(row.classification.kind!=="test_choices")continue;
  for(const choice of r.question.answerChoices){
    const t=row.classification.choices.find(t=>t.choiceId===choice.id);
    if(t.timing.kind!=="test")continue;
    const old=existing.find(e=>e.caseId===r.caseId&&e.nodeId===r.nodeId&&e.questionVariantId===r.previousQuestionVariantId&&e.choiceId===(r.choiceSourceIds?.[choice.id]??choice.id));
    if(!old)continue; // Existing gate/non-executed wrong-choice rules remain unchanged.
    if(!choice.isCorrect)assert.equal(old.disposition.kind,"not_executed");
    let disposition=old.disposition;
    if(r.auditId==="B09"&&choice.isCorrect)disposition={kind:"terminal_service",serviceId:"service.thyroid_fna",allowedRouteIds:["route.thyroid_fna.in_house","route.thyroid_fna.outsourced"]};
    if(r.auditId==="B18"&&choice.isCorrect)disposition={kind:"not_executed",reason:"future_planned"};
    records.push({...old,questionVariantId:r.questionVariantId,choiceId:choice.id,choiceLabel:choice.label,timingProfileId:t.timing.timingProfileId,disposition});
  }
}
const file="packages/game-domain/src/test-choice-orders.ts",source=fs.readFileSync(file,"utf8");
const begin="// BEGIN QUESTION QUALITY ADVERSARIAL R4 20261102 EXACT RECORDS",end="// END QUESTION QUALITY ADVERSARIAL R4 20261102 EXACT RECORDS";
const block=begin+"\nconst questionQualityAdversarialR420261102Records: ExactTestChoiceOrderRecord[] = "+JSON.stringify(records,null,2)+";\n"+end+"\n\n";
let result=source.includes(begin)?source.replace(/\/\/ BEGIN QUESTION QUALITY ADVERSARIAL R4 20261102 EXACT RECORDS[\s\S]*?\/\/ END QUESTION QUALITY ADVERSARIAL R4 20261102 EXACT RECORDS\r?\n\r?\n/,block):
  source.replace("export const EXACT_TEST_CHOICE_ORDER_RECORDS:",block+"export const EXACT_TEST_CHOICE_ORDER_RECORDS:");
if(!result.includes("  ...questionQualityAdversarialR420261102Records,"))result=result.replace("  ...questionQualityAdversarialR320261102Records,","  ...questionQualityAdversarialR420261102Records,\n  ...questionQualityAdversarialR320261102Records,");
assert(result.includes(block));fs.writeFileSync(file,result);
fs.writeFileSync("tools/question-quality/adversarial-r4-exact-records-20261102.json",JSON.stringify(records,null,2)+"\n");
console.log(JSON.stringify({newRecords:records.length,allPriorRecordsRetained:true,existingDispositionKindsOnly:true,explicitChangedTerminalBinding:"B09: ultrasound -> thyroid_fna",explicitFuturePlannedBinding:"B18: targeted nodal sampling"}));
