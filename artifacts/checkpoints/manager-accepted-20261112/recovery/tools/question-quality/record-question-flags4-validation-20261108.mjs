import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const dir='.local-dev/question-flags4-20261108/';
const read=path=>{const bytes=fs.readFileSync(path);return (bytes[0]===0xff&&bytes[1]===0xfe?bytes.toString('utf16le'):bytes.toString('utf8')).replace(/^\uFEFF/,'').replace(/\x1b\[[0-9;]*m/g,'');};
const hash=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const full=read(dir+'clinical-full-final.log'),typecheck=read(dir+'typecheck-seven-final.log'),lint=read(dir+'linter-tests.log');
const clinicalCounts=full.match(/Test Files\s+(\d+) passed \((\d+)\)[\s\S]*?Tests\s+(\d+) passed \((\d+)\)/);
assert(clinicalCounts,'Full clinical suite has not completed successfully');
assert.equal(clinicalCounts[1],clinicalCounts[2]);assert.equal(clinicalCounts[3],clinicalCounts[4]);
const workspaceNames=[...typecheck.matchAll(/> (@gamify-surgery\/[\w-]+)@[^\r\n]+ typecheck/g)].map(m=>m[1]);
assert.equal(workspaceNames.length,7);assert(!/error TS\d+|Lifecycle script .* failed/.test(typecheck));
assert.match(lint,/tests 33/);assert.match(lint,/pass 33/);assert.match(lint,/fail 0/);
const record={checkedOn:'2026-11-08',clinicalApproval:false,sourceCheck:'Offline source reuse only; tests do not clinically approve the candidate.',
 runs:[
  {cwd:'packages/clinical-content',command:'npm.cmd test -- --pool=threads',nativeExitCode:0,filesPassed:Number(clinicalCounts[1]),filesFailed:0,testsPassed:Number(clinicalCounts[3]),testsFailed:0,
   durationSeconds:Number(full.match(/Duration\s+([\d.]+)s/)[1]),log:dir+'clinical-full-final.log',logSha256:hash(dir+'clinical-full-final.log'),
   exactSummary:full.slice(full.indexOf(' Test Files')).trim()},
  {cwd:'.',command:'npm.cmd run typecheck',nativeExitCode:0,workspaceCount:7,workspaces:workspaceNames,log:dir+'typecheck-seven-final.log',logSha256:hash(dir+'typecheck-seven-final.log'),exactOutput:typecheck.trim()},
  {cwd:'.',command:'npm.cmd run clinical:lint:test',nativeExitCode:0,testsPassed:33,testsFailed:0,durationMilliseconds:Number(lint.match(/duration_ms ([\d.]+)/)[1]),
   log:dir+'linter-tests.log',logSha256:hash(dir+'linter-tests.log'),exactSummary:lint.slice(lint.lastIndexOf('tests 33')-2).trim()},
 ],
 candidateChecks:{authorRegenerationCommand:'node tools/question-quality/author-question-flags4-20261108.mjs --check',packetRegenerationCommand:'node tools/question-quality/review-question-flags4-20261108.mjs --check',nativeExitCode:0,
  beforeCueFindings:1,afterCueFindings:0,suppressedFindings:0,protectedExistingSourcePaths:1327,changedExistingSourcePaths:0},
 notes:[
  'The final clinical run includes all 10 flags4 tests. Earlier diagnostic runs are not substituted for this final-content result.',
  'The first focused invocation did not start because its relative log destination was wrong. It was corrected; no test failure was hidden or assertion/budget changed.',
  'Node prints the existing experimental TypeScript-strip warning. The linter command exits 0 with 33 passing tests.',
  'No game-domain or player suite was required or run for this candidate-only milestone. No result from a previous milestone is reported as current.',
 ],
};
const path='docs/research/question-flags4-validation-20261108.json';
fs.writeFileSync(path,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({path,clinical:record.runs[0],typecheckWorkspaces:workspaceNames,linter:{passed:33,failed:0,durationMilliseconds:record.runs[2].durationMilliseconds}},null,2));
