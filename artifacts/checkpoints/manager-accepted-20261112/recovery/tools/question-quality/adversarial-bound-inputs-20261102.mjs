import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
const read=p=>fs.readFileSync(p,"utf8"),hash=p=>createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const entry=JSON.parse(read("tools/question-quality/fixtures/adversarial-before-20261102.json")),evidence=JSON.parse(read("tools/qa/level-five-integration-results-20261012.json"));
const paths=[];
function collect(dir){for(const f of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+"/"+f.name;if(f.isDirectory())collect(p);else if(!/\.(test|spec)\./.test(p)&&/\.(ts|json)$/.test(p))paths.push(p);}}
for(const p of["packages/game-domain/src","packages/balance-config/src","packages/clinical-content/src"])collect(p);
paths.push("tests/fixtures/level-five-integration.ts","tests/fixtures/level-five-rooms.ts","tests/fixtures/level-four-rooms.ts","tools/economy-audit/level-four-simulation.ts","tools/qa/level-five-integration-run.mjs");
const current=Object.fromEntries(paths.sort().map(p=>[p,hash(p)]));
const edited=["packages/clinical-content/src/answer-choice-timing.ts","packages/clinical-content/src/index.ts","packages/clinical-content/src/synthetic-content.ts","packages/clinical-content/src/question-quality-pilot-20261028.ts","packages/game-domain/src/test-choice-orders.ts"];
const added=["packages/clinical-content/src/question-quality-clinical-approvals-20261102.ts","packages/clinical-content/src/question-quality-adversarial-20261102.ts","packages/clinical-content/src/question-quality-adversarial-20261102-data.ts","packages/clinical-content/src/question-quality-adversarial-evidence-20261102.ts"];
const owned=new Set([...edited,...added]),protectedPaths=Object.keys(entry.files).filter(p=>/spatial\.ts|game-evidence(?:-json|-index)?\.ts|level-five-(?:integration|latent-bugs)\.test\.ts|integration-results|integration-checkpoints|evidence-incremental\.mjs/.test(p));
const priorImpact=JSON.parse(read("tools/question-quality/bound-inputs-20261102.json"));
const priorRecorded=new Set(priorImpact.changed.map(x=>x.path)),priorAdded=new Set(priorImpact.added.map(x=>x.path));
const result={checkedOn:"2026-11-02",scope:"Read-only hash comparison; no evidence, checkpoint, driver, save schema or released evidence-incremental file edited.",recordedInputCount:Object.keys(evidence.inputs).length,currentInputCount:paths.length,
  changedBoundInputsThisContinuation:edited.map(p=>({path:p,entry:entry.files[p].sha256,current:current[p],alreadyInEvidenceManifest:!!evidence.inputs[p],recorded:evidence.inputs[p]??null})),
  newBoundInputsThisContinuation:added.map(p=>({path:p,current:current[p]})),
  allRecordedDifferences:Object.entries(evidence.inputs).filter(([p,h])=>current[p]!==h).map(([p,h])=>({path:p,recorded:h,current:current[p],ownership:owned.has(p)?"this continuation":priorRecorded.has(p)?"recorded in previous handoff; not changed by this continuation":"unowned shared-tree delta beyond the previous handoff; no entry baseline, not edited by this worker"})),
  allNewSinceEvidenceManifest:paths.filter(p=>!evidence.inputs[p]).map(p=>({path:p,current:current[p],ownership:owned.has(p)?"this continuation":priorAdded.has(p)?"previous question-quality milestone or released file; not changed by this continuation":"unowned shared-tree addition beyond the previous handoff; not edited by this worker"})),
  protected:protectedPaths.map(p=>({path:p,entry:entry.files[p].sha256,current:hash(p),unchanged:hash(p)===entry.files[p].sha256})),
  artifactInputs:Object.entries(evidence.artifactInputs??{}).map(([p,h])=>({path:p,recorded:h,current:hash(p),unchanged:h===hash(p)})),
  omittedFromRuntimeManifest:["packages/clinical-content/src/question-quality-adversarial.test.ts","packages/clinical-content/src/question-quality-review.test.helpers.ts","packages/game-domain/tests/test-choice-order-inventory.test.ts","apps/player/src/session/variety3ChartsViewModels.test.ts","apps/player/src/session/earlyLevelsPresentation.test.ts"],
  rebind:"Manager must run the actual Level 5 rebind in the release lane after independent review/acceptance. Do not copy hashes into evidence or suppress the binding assertion."};
fs.writeFileSync("tools/question-quality/adversarial-bound-inputs-20261102.json",JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({recorded:result.recordedInputCount,current:result.currentInputCount,editedThisContinuation:edited.length,addedThisContinuation:added.length,recordedDifferences:result.allRecordedDifferences.length,allAdded:result.allNewSinceEvidenceManifest.length,protectedUnchanged:result.protected.every(p=>p.unchanged)}));
