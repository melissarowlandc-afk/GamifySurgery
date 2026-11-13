import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {PROGRAM_BATCH7_ROWS as rows,PROGRAM_BATCH7_RETIREMENTS as retirements} from '../../packages/clinical-content/src/question-program-batch7-accepted-data-20261112.ts';

const dir='packages/clinical-content/src/';
const replace=(text,anchor,value)=>{assert.equal(text.split(anchor).length,2,'Unique anchor '+anchor);return text.replace(anchor,value);};
const manifestPath=dir+'question-ship-manifest.ts';let manifest=fs.readFileSync(manifestPath,'utf8');
assert(manifest.includes('question-ship.2026-11-12.v15'),'One-shot integration already applied');
manifest=replace(manifest,'question-ship.2026-11-12.v15','question-ship.2026-11-12.v16');
manifest=replace(manifest,'\n] satisfies QuestionShipAcceptance[],','\n  // Manager-accepted final PASS complete topic cases and D97 node overrides, batch 7.\n'+JSON.stringify(rows,null,2).slice(1,-1).trimStart()+',\n] satisfies QuestionShipAcceptance[],');
manifest=replace(manifest,'  replacements: [','  retirements: '+JSON.stringify(retirements,null,2)+' satisfies QuestionShipCaseRetirement[],\n  replacements: [');
manifest=replace(manifest,'  headerSources: {','  headerSources: {\n'+[...new Map(rows.map(r=>[r.caseId,r.sourceView]))].map(([id,view])=>'    '+JSON.stringify(id)+': '+JSON.stringify(view)+',').join('\n'));
fs.writeFileSync(manifestPath,manifest);
const sourcePath=dir+'synthetic-content.ts';let source=fs.readFileSync(sourcePath,'utf8');
source='import {QUESTION_PROGRAM_BATCH7_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch7Concepts} from "./question-program-batch7-accepted-20261112";\n'+source;
const start=source.indexOf('projectManagerAcceptedQuestions(')+'projectManagerAcceptedQuestions('.length;
let depth=0,end=start;for(;end<source.length;end++){if(source[end]==='(')depth++;else if(source[end]===')')depth--;else if(source[end]===','&&depth===0)break;}
assert(start>50&&end<source.length);
source=source.slice(0,start)+'withAcceptedQuestionProgramBatch7Concepts('+source.slice(start,end)+')'+source.slice(end);
source=replace(source,', QUESTION_FLAGS_PRE_REVISION_RELEASE, {',', QUESTION_FLAGS_PRE_REVISION_RELEASE, {\n  ...QUESTION_PROGRAM_BATCH7_ACCEPTED_SOURCE_VIEWS,');
fs.writeFileSync(sourcePath,source);
fs.appendFileSync(dir+'index.ts','\n// Batch 7 acceptance and exact owner clinical-review records.\nexport * from "./question-program-batch7-accepted-20261112";\n');
fs.appendFileSync(dir+'answer-choice-timing.ts','\nimport {QUESTION_PROGRAM_BATCH7_ACCEPTED_TIMING_ENTRIES} from "./question-program-batch7-accepted-20261112";\nANSWER_CHOICE_TIMING_REGISTRY.push(...QUESTION_PROGRAM_BATCH7_ACCEPTED_TIMING_ENTRIES);\n');
console.log(JSON.stringify({rows:rows.length,retirements:retirements.length}));
