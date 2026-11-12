import fs from "node:fs";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const target="tools/question-quality/adversarial-r7-validation-window-20261102.json";
const paths=[];
function collect(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+"/"+e.name;if(e.isDirectory())collect(p);else if(/\.(ts|json)$/.test(p))paths.push(p);}}
for(const dir of ["packages/game-domain/src","packages/game-domain/tests","packages/balance-config/src","packages/clinical-content/src"])collect(dir);
paths.push("tests/fixtures/level-five-integration.ts","tests/fixtures/level-five-rooms.ts","tests/fixtures/level-four-rooms.ts","tools/economy-audit/level-four-simulation.ts","tools/qa/level-five-integration-run.mjs","tools/qa/level-five-integration-results-20261012.json","tests/fixtures/level-five-integration-checkpoints-20261012.json");
const current=Object.fromEntries([...new Set(paths)].sort().map(p=>[p,createHash("sha256").update(fs.readFileSync(p)).digest("hex")]));
const mode=process.argv[2];assert(["--begin","--sample","--end"].includes(mode));
const record=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,"utf8")):{scope:"Read-only code/test/input hashes around validation in a shared working tree; no player data. Begin/end and sampled equality do not prove absence of an unobserved transient edit.",runs:[]};
if(mode==="--begin")record.runs.push({startedAt:new Date().toISOString(),beginInputs:current,samples:[]});
else{
 const run=record.runs.at(-1);assert(run&&!run.endedAt,"No active validation window");
 const changes=[...new Set([...Object.keys(run.beginInputs),...Object.keys(current)])].filter(p=>run.beginInputs[p]!==current[p]).map(path=>({path,before:run.beginInputs[path]??null,current:current[path]??null}));
 run.samples.push({at:new Date().toISOString(),changes});
 if(mode==="--end"){run.endedAt=new Date().toISOString();run.endInputs=current;run.inputsEqualAtEverySample=run.samples.every(s=>s.changes.length===0);}
}
fs.writeFileSync(target,JSON.stringify(record,null,2)+"\n");
const run=record.runs.at(-1);console.log(JSON.stringify({mode,inputs:Object.keys(current).length,samples:run.samples.length,changedSinceBegin:run.samples.at(-1)?.changes.length??0,endedAt:run.endedAt??null}));
