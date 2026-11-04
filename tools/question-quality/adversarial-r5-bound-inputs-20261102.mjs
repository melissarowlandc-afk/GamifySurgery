import fs from "node:fs";
import {createHash} from "node:crypto";
const read=p=>fs.readFileSync(p,"utf8"),hash=p=>createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const entry=JSON.parse(read("tools/question-quality/fixtures/adversarial-r5-before-20261102.json"));
const evidence=JSON.parse(read("tools/qa/level-five-integration-results-20261012.json"));
const edited=[
  "packages/clinical-content/src/answer-choice-timing.ts",
  "packages/clinical-content/src/index.ts",
  "packages/clinical-content/src/synthetic-content.ts",
  "packages/clinical-content/src/question-quality-adversarial-20261102.ts",
  "packages/game-domain/src/test-choice-orders.ts",
];
const added=[
  "packages/clinical-content/src/question-quality-adversarial-r5-20261102.ts",
  "packages/clinical-content/src/question-quality-adversarial-r5-20261102-data.ts",
  "packages/clinical-content/src/question-quality-adversarial-r5-evidence-20261102.ts",
];
const paths=[];
function collect(dir){for(const f of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+"/"+f.name;if(f.isDirectory())collect(p);else if(!/\.(test|spec)\./.test(p)&&/\.(ts|json)$/.test(p))paths.push(p);}}
for(const dir of ["packages/game-domain/src","packages/balance-config/src","packages/clinical-content/src"])collect(dir);
paths.push("tests/fixtures/level-five-integration.ts","tests/fixtures/level-five-rooms.ts","tests/fixtures/level-four-rooms.ts","tools/economy-audit/level-four-simulation.ts","tools/qa/level-five-integration-run.mjs");
const current=Object.fromEntries(paths.sort().map(p=>[p,hash(p)])),owned=new Set([...edited,...added]);
const result={checkedOn:"2026-11-02",scope:"Fifth author revision only. Read-only input hashes; no evidence/checkpoint/driver edit, queue routing or save change.",
  recordedInputCount:Object.keys(evidence.inputs).length,currentInputCount:paths.length,
  changedBoundInputsThisRound:edited.map(p=>({path:p,entry:entry.files[p].sha256,current:current[p],recorded:evidence.inputs[p]??null})),
  newBoundInputsThisRound:added.map(p=>({path:p,current:current[p]})),
  allRecordedDifferences:Object.entries(evidence.inputs).filter(([p,h])=>current[p]!==h).map(([p,h])=>({path:p,recorded:h,current:current[p]??null,ownership:owned.has(p)?"this round":"prior/shared-tree input; not edited by this round"})),
  allNewSinceEvidenceManifest:paths.filter(p=>!evidence.inputs[p]).map(p=>({path:p,current:current[p],ownership:owned.has(p)?"this round":"prior/shared-tree addition; not edited by this round"})),
  protected:Object.entries(entry.protected).map(([p,h])=>({path:p,entry:h,current:hash(p),unchanged:h===hash(p)})),
  artifactInputs:Object.entries(evidence.artifactInputs??{}).map(([p,h])=>({path:p,recorded:h,current:hash(p),unchanged:h===hash(p)})),
  excludedTests:["packages/clinical-content/src/question-quality-adversarial-r5.test.ts","packages/clinical-content/src/question-quality-adversarial-r3.test.ts","packages/clinical-content/src/approved-data/colonic-lipoma.test.ts","packages/clinical-content/src/development-batch/2026-09-11/board-expansion-admission.test.ts","packages/clinical-content/src/development-batch/2026-09-12/board-expansion-admission.test.ts","packages/clinical-content/src/development-batch/2026-09-13/early-levels-admission.test.ts","packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-admission.test.ts","packages/clinical-content/src/development-batch/2026-09-17-bread-and-butter/bread-butter-admission.test.ts","packages/clinical-content/src/answer-choice-timing.test.ts","packages/game-domain/tests/test-choice-order-inventory.test.ts","packages/game-domain/tests/gs028-20261007-level3-batch.test.ts"],
  rebind:"Manager must run the actual Level 5 rebind after acceptance in the release lane; copying hashes or suppressing the assertion is not a rebind."};
fs.writeFileSync("tools/question-quality/adversarial-r5-bound-inputs-20261102.json",JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({recorded:result.recordedInputCount,current:result.currentInputCount,edited:edited.length,added:added.length,recordedDifferences:result.allRecordedDifferences.length,newSinceEvidence:result.allNewSinceEvidenceManifest.length,protectedUnchanged:result.protected.every(p=>p.unchanged)}));
