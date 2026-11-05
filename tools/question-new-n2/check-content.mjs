import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
const batch=await import('../../packages/clinical-content/src/question-new-n2-20261104.ts');
const {PROTOTYPE_BALANCE_RELEASE:balance}=await import('../../packages/balance-config/src/index.ts');
const catalog=JSON.parse(fs.readFileSync('.local-dev/question-new-n2-20261104/catalog-before.json','utf8'));
const existing=new Set(catalog.authoredConcepts.map(c=>c.id));
const profiles=new Set(balance.answerChoiceTimingProfiles.map(p=>p.id));
const missingNearest=[],missingTiming=[],longestKeys=[],missingTestEstimates=[];
for(const item of batch.QUESTION_NEW_N2_ITEMS){
  for(const id of item.nearestExistingConceptIds)if(!existing.has(id))missingNearest.push({slug:item.slug,id});
  for(const c of item.choices)if(c.timingProfileId&&!profiles.has(c.timingProfileId))missingTiming.push({slug:item.slug,choice:c.label,id:c.timingProfileId});
  if(item.choices[0].label.length>Math.max(...item.choices.slice(1).map(c=>c.label.length)))longestKeys.push({slug:item.slug,characters:item.choices.map(c=>c.label.length)});
  for(const c of item.choices)if(/\b(?:biopsy|sampling|assays?|serology|capnography|oximetry|manometry|endoscopy|glucose reassessment|pH-impedance monitoring|MRI|MRCP|ERCP)\b/i.test(c.label)&&!c.timingProfileId)
    missingTestEstimates.push({slug:item.slug,label:c.label});
}
const result={items:batch.QUESTION_NEW_N2_ITEMS.length,claims:batch.QUESTION_NEW_N2_CLAIMS.length,sources:batch.QUESTION_NEW_N2_SOURCES.length,missingNearest,missingTiming,longestKeys,missingTestEstimates};
fs.writeFileSync('.local-dev/question-new-n2-20261104/content-check.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
