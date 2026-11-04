import fs from "node:fs";
import assert from "node:assert/strict";
import "../economy-audit/source-loader.mjs";
const domain=await import("../../packages/game-domain/src/index.ts"),clinical=await import("../../packages/clinical-content/src/index.ts");
const name=process.argv.includes("--entry")?"entry":"current",original=domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease;
domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=name==="entry"?clinical.QUESTION_QUALITY_PRE_ADVERSARIAL_R6_RELEASE:original;
try{
 const {createLevelFiveLaunchQaState}=await import("../../tests/fixtures/level-five-launch.ts"),{integrationReviewTime}=await import("../../tests/fixtures/level-five-integration.ts");
 let state=domain.deserializeGameState(domain.serializeGameState(createLevelFiveLaunchQaState("launch-final")));
 state=domain.gameReducer(state,{type:"SET_PAUSED",paused:false,operationId:"m10.final.play"});
 state=domain.gameReducer(state,{type:"ADVANCE_TICK",operationId:"m10.final.minute",advancedAtRealMs:integrationReviewTime(state,state.facilityTick+1)});
 const report=state.levelFive.inspection.lastReport;assert.equal(report.outcome,"completed");
 const result={checkedOn:"2026-11-03",name,scope:"Exact ordinary launch test's final-report actions under a fresh process and selected clinical release. No fixture/evidence/production edit; only inspection of the expected report values.",qualifyingScoredPatientCount:report.qualifyingScoredPatientCount,rawTotalScore:report.rawTotalScore,observedActiveMinutes:report.observedActiveMinutes,categories:report.categories.length};
 fs.writeFileSync("tools/question-quality/adversarial-r6-launch-"+name+"-20261102.json",JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(result));
}finally{domain.PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease=original;}
