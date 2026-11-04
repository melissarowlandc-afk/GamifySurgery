import fs from "node:fs";
import assert from "node:assert/strict";
import "../economy-audit/source-loader.mjs";
const clinical=await import("../../packages/clinical-content/src/index.ts");
const domain=await import("../../packages/game-domain/src/test-choice-orders.ts");
const records=[];
for(const r of clinical.QUESTION_QUALITY_ADVERSARIAL_REVISIONS){
  const prior=domain.EXACT_TEST_CHOICE_ORDER_RECORDS.filter(x=>x.caseId===r.caseId&&x.nodeId===r.nodeId&&x.questionVariantId===r.previousQuestionVariantId);
  const timing=clinical.QUESTION_QUALITY_ADVERSARIAL_TIMING_ENTRIES.find(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId);
  for(const choice of r.question.answerChoices){
    const current=timing.classification.kind==="test_choices"?timing.classification.choices.find(c=>c.choiceId===choice.id):null;
    if(current?.timing.kind!=="test")continue;
    const old=prior.find(x=>x.choiceId===(r.choiceSourceIds?.[choice.id]??choice.id));
    if(old){if(!choice.isCorrect)assert.equal(old.disposition.kind,"not_executed");records.push({...old,questionVariantId:r.questionVariantId,choiceId:choice.id,choiceLabel:choice.label,timingProfileId:current.timing.timingProfileId});}
    else if(r.auditId==="B24"&&choice.isCorrect){
      // New wording makes the diagnostic repeat procedure explicit. Preserve
      // this terminal educational decision's no-extra-order behavior, rather
      // than inventing a gate/route or silently executing a new procedure.
      records.push({caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,choiceId:choice.id,choiceLabel:choice.label,timingProfileId:current.timing.timingProfileId,disposition:{kind:"not_executed",reason:"future_planned"}});
    }
  }
}
const file="packages/game-domain/src/test-choice-orders.ts",source=fs.readFileSync(file,"utf8");
const block="// BEGIN QUESTION QUALITY ADVERSARIAL 20261102 EXACT RECORDS\nconst questionQualityAdversarial20261102Records: ExactTestChoiceOrderRecord[] = "+JSON.stringify(records,null,2)+";\n// END QUESTION QUALITY ADVERSARIAL 20261102 EXACT RECORDS\n\n";
let result=source.includes("// BEGIN QUESTION QUALITY ADVERSARIAL 20261102 EXACT RECORDS")?source.replace(/\/\/ BEGIN QUESTION QUALITY ADVERSARIAL 20261102 EXACT RECORDS[\s\S]*?\/\/ END QUESTION QUALITY ADVERSARIAL 20261102 EXACT RECORDS\r?\n\r?\n/,block):source.replace("export const EXACT_TEST_CHOICE_ORDER_RECORDS:",block+"export const EXACT_TEST_CHOICE_ORDER_RECORDS:");
if(!result.includes("  ...questionQualityAdversarial20261102Records,"))result=result.replace("  ...questionQuality20261102Records,","  ...questionQualityAdversarial20261102Records,\n  ...questionQuality20261102Records,");
assert(result.includes(block));fs.writeFileSync(file,result);
fs.writeFileSync("tools/question-quality/exact-adversarial-records-20261102.json",JSON.stringify(records,null,2)+"\n");
console.log(JSON.stringify({newExactRecords:records.length,explicitNewTerminalClassification:"B24: not_executed/future_planned",priorRecordsRetained:true}));
