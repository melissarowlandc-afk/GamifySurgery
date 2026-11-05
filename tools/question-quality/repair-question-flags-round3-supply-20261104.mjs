import fs from 'node:fs';
import assert from 'node:assert/strict';
import {format} from '@vitest/pretty-format';
const base=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags-round3-supply-before-20261104.json','utf8'));
const proof=JSON.parse(fs.readFileSync('tools/question-quality/question-flags-round3-supply-control-20261104.json','utf8'));
assert(proof.runs.entryWithSameN1.matchesCurrentFixture,'The counterfactual must reproduce the original exact snapshot');
assert(!proof.runs.current.matchesCurrentFixture,'No update needed if current already matches');
const pattern=/\.toMatchInlineSnapshot\(`([\s\S]*?)`\)/g,matches=[...base.text.matchAll(pattern)];assert.equal(matches.length,1);
const oldText=matches[0][1];
const clean=s=>{const lines=s.replaceAll('\r\n','\n').split('\n');const nonempty=lines.filter(l=>l.trim());const indent=Math.min(...nonempty.map(l=>l.match(/^\s*/)[0].length));return lines.map(l=>l.slice(Math.min(indent,l.match(/^\s*/)[0].length))).join('\n').trim();};
const renderedBefore=format(proof.runs.entryWithSameN1.value,{printBasicPrototype:false});
assert.equal(clean(oldText),renderedBefore,'Use the existing Vitest serializer format, not a looser comparison');
const currentSnapshot=format(proof.runs.current.value,{printBasicPrototype:false});
const next=base.text.replace(pattern,'.toMatchInlineSnapshot(`\n'+currentSnapshot+'\n`)');
assert.equal(next.replace(pattern,'.toMatchInlineSnapshot(SNAPSHOT)'),base.text.replace(pattern,'.toMatchInlineSnapshot(SNAPSHOT)'));
const beforeAssertions=(base.text.match(/\bexpect\(/g)||[]).length;assert.equal((next.match(/\bexpect\(/g)||[]).length,beforeAssertions);
assert.deepEqual([...next.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]),[...base.text.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]));
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(base.file,'utf8'),next);
else{assert.equal(fs.readFileSync(base.file,'utf8'),base.text,'Concurrent fixture edit: inspect and preserve');fs.writeFileSync(base.file,next);}
const summarize=x=>({...x,unseenAvailableConceptIds:x.unseenAvailableConceptIds.length});
fs.writeFileSync('tools/question-quality/question-flags-round3-supply-fixture-review-20261104.json',JSON.stringify({checkedOn:'2026-11-04',file:base.file,assertionCallSites:beforeAssertions,
 onlyInlineSnapshotChanged:true,commandsAndDeadlinesUnchanged:true,sourceControl:'question-flags-round3-supply-control-20261104.json',
 justification:'The same domain runtime and same N1 cases reproduce the old exact snapshot with the entry clinical bank. Versioned objectives change the deterministic unseen-concept patient mix. Only that resulting snapshot is updated; no routing, scheduling, save or patient-flow assertion changes.',
 before:summarize(proof.runs.entryWithSameN1.value),after:summarize(proof.runs.current.value),
 limitation:'The disposable diagnostic is not a Vitest pass or performance benchmark. The actual focused test must pass its unchanged deadline.'},null,2)+'\n');
console.log(JSON.stringify({file:base.file,assertionCallSites:beforeAssertions,onlyInlineSnapshotChanged:true,beforeCompleted:proof.runs.entryWithSameN1.value.completed,afterCompleted:proof.runs.current.value.completed}));
