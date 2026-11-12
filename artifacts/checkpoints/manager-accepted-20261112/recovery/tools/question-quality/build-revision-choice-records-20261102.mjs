import fs from "node:fs";
import assert from "node:assert/strict";
import "../economy-audit/source-loader.mjs";

// Compile explicit current identities from exact existing records. No alias,
// guessed route, service resolver, runtime rule or historical-record mutation.
const clinical=await import("../../packages/clinical-content/src/index.ts");
const domain=await import("../../packages/game-domain/src/test-choice-orders.ts");
const revisions=[...clinical.QUESTION_QUALITY_REVISIONS.filter(r=>r.ownerRound3Review),...clinical.QUESTION_QUALITY_BATCH1_REVISIONS];
const records=[];
for(const r of revisions){
  const prior=domain.EXACT_TEST_CHOICE_ORDER_RECORDS.filter(x=>x.caseId===r.caseId&&x.nodeId===r.nodeId&&x.questionVariantId===r.previousQuestionVariantId);
  const timing=clinical.ANSWER_CHOICE_TIMING_REGISTRY.find(t=>t.caseId===r.caseId&&t.nodeId===r.nodeId&&t.questionVariantId===r.questionVariantId);
  for(const choice of r.question.answerChoices){
    const sourceId=r.choiceSourceIds?.[choice.id]??choice.id,old=prior.find(x=>x.choiceId===sourceId);
    if(!old)continue; // Existing result gates may classify a correct test instead.
    const current=timing.classification.kind==="test_choices"?timing.classification.choices.find(c=>c.choiceId===choice.id):null;
    assert.equal(current?.timing.kind,"test",r.auditId+" cannot bind a non-test");
    if(!choice.isCorrect)assert.equal(old.disposition.kind,"not_executed");
    records.push({...old,questionVariantId:r.questionVariantId,choiceId:choice.id,choiceLabel:choice.label,timingProfileId:current.timing.timingProfileId});
  }
}
const file="packages/game-domain/src/test-choice-orders.ts",text=fs.readFileSync(file,"utf8");
const block="// BEGIN QUESTION QUALITY 20261102 EXACT RECORDS\nconst questionQuality20261102Records: ExactTestChoiceOrderRecord[] = "+JSON.stringify(records,null,2)+";\n// END QUESTION QUALITY 20261102 EXACT RECORDS\n\n";
let updated=text;
if(updated.includes("// BEGIN QUESTION QUALITY 20261102 EXACT RECORDS"))updated=updated.replace(/\/\/ BEGIN QUESTION QUALITY 20261102 EXACT RECORDS[\s\S]*?\/\/ END QUESTION QUALITY 20261102 EXACT RECORDS\r?\n\r?\n/,block);
else updated=updated.replace("export const EXACT_TEST_CHOICE_ORDER_RECORDS:",block+"export const EXACT_TEST_CHOICE_ORDER_RECORDS:");
if(!updated.includes("  ...questionQuality20261102Records,"))updated=updated.replace("  ...questionQualityOwnerRound2Records,","  ...questionQuality20261102Records,\n  ...questionQualityOwnerRound2Records,");
assert(updated.includes(block));fs.writeFileSync(file,updated);
fs.writeFileSync("tools/question-quality/exact-revision-records-20261102.json",JSON.stringify(records,null,2)+"\n");
process.stdout.write(JSON.stringify({newExactRecords:records.length,source:"Exact pre-revision records; disposition/service/routes unchanged"})+"\n");
