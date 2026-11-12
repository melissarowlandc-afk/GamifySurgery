import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
const c=await import('../../packages/clinical-content/src/synthetic-content.ts');
const b=await import('../../packages/clinical-content/src/question-new-n3-20261105.ts');
const {QUESTION_SHIP_MANIFEST:manifest}=await import('../../packages/clinical-content/src/question-ship-manifest.ts');
function census(release){
 let prior=new Set();
 return [0,1,2,3,4].map(stage=>{
  const cases=release.cases.filter(cs=>cs.routineEligible&&cs.earliestFacilityStage<=stage&&cs.participant?.kind!=='employee_discussion');
  const concepts=new Set(cases.flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId)));
  const result={stage,cases:cases.length,concepts:concepts.size,unlocked:[...concepts].filter(id=>!prior.has(id)).length,
   variants:new Set(cases.flatMap(cs=>cs.decisionNodes.map(n=>n.questionVariantId))).size};
  prior=concepts;return result;
 });
}
const hypothetical={...c.SYNTHETIC_CLINICAL_RELEASE,
 concepts:[...c.SYNTHETIC_CLINICAL_RELEASE.concepts,...b.QUESTION_NEW_N3_TESTED_CONCEPTS],
 cases:[...c.SYNTHETIC_CLINICAL_RELEASE.cases,...b.QUESTION_NEW_N3_CASES]};
const report={schemaVersion:1,capturedOn:'2026-11-05',
 basis:'All capabilities assumed; routine patient encounters only, excluding employee discussions. Structural census, not a measured owner throughput or difficulty result.',
 live:census(c.SYNTHETIC_CLINICAL_RELEASE),hypotheticalAfterAllN3Accepted:census(hypothetical),
 hypotheticalLimitation:'Forty proposed identities require independent novelty/quality review and clinical sign-off; no N3 acceptance is authorized. Do not count these as shipped supply.',
 newConceptsByLevel:{3:16,4:24},registered:{live:c.SYNTHETIC_CLINICAL_RELEASE.concepts.length,catalog:c.QUESTION_CATALOG_RELEASE.concepts.length},
 manifest:{totalDirectedAcceptances:manifest.accepted.length,n2:manifest.accepted.filter(r=>r.acceptanceId.startsWith('review.n2.')).length,n3:manifest.accepted.filter(r=>r.acceptanceId.startsWith('review.n3.')).length},
 target:'Prior N0 planning target remains 75-100 fresh concepts per late level; it is an editorial reserve assumption, not a validated engagement threshold.',
 runtime:'The focused supply test consumes every unseen N3 identity, observes no selectable case while all reviews are future-due, then observes a due review. No timer or selection code changes.'};
fs.writeFileSync('docs/research/question-new-n3-supply-20261105.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('.local-dev/question-new-n3-20261105/supply-after.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
