import fs from 'node:fs';
import assert from 'node:assert/strict';
import {format} from '@vitest/pretty-format';
const root='tools/question-quality/',base=JSON.parse(fs.readFileSync(root+'fixtures/question-flags-round3-remaining-fixtures-before-20261104.json','utf8'));
const proof=JSON.parse(fs.readFileSync(root+'question-flags-round3-remaining-fixtures-control-20261104.json','utf8'));
for(const r of proof.results)assert(r.runs.entry.matchesSnapshot&&r.runs.entry.matchesLengths);
assert.equal(proof.inventory.filteredCases,1048);assert.equal(proof.inventory.filteredNodes,1343);
assert.deepEqual(Object.fromEntries(Object.entries(proof.inventory.october2).filter(([k])=>k!=='identities')),{records:33,gate:2,terminal:2,external:14});
const pattern=/\.toMatchInlineSnapshot\(`([\s\S]*?)`\)/g;
const clean=s=>{const lines=s.replaceAll('\r\n','\n').split('\n'),nonempty=lines.filter(l=>l.trim()),indent=Math.min(...nonempty.map(l=>l.match(/^\s*/)[0].length));return lines.map(l=>l.slice(Math.min(indent,l.match(/^\s*/)[0].length))).join('\n').trim();};
const reviews=[];
for(const [file,old]of Object.entries(base)){
 let next=old,allowed=[];
 if(file.endsWith('/patient-supply.test.ts')){
  const matches=[...old.matchAll(pattern)];assert.equal(matches.length,2);
  let i=0;next=next.replace(pattern,(_,text)=>{
   const result=proof.results[i++];assert.equal(clean(text),format(result.runs.entry.value,{printBasicPrototype:false}));
   return '.toMatchInlineSnapshot(`\n'+format(result.runs.current.value,{printBasicPrototype:false})+'\n`)';
  });
  const replacements=[['expect(release.concepts).toHaveLength(414);','expect(release.concepts).toHaveLength(462);'],['expect(release.cases).toHaveLength(1008 + 62 + 20 + 20);','expect(release.cases).toHaveLength(1008 + 62 + 20 + 20 + 40);'],['expect(release.cases.flatMap((item) => item.decisionNodes)).toHaveLength(1423);','expect(release.cases.flatMap((item) => item.decisionNodes)).toHaveLength(1463);']];
  for(const[a,b]of replacements){assert.equal(next.split(a).length,2);next=next.replace(a,b);allowed.push([a,b]);}
  next=next.replace('    expect(release.concepts).toHaveLength(462);','    // Final flag round retains eight new constructs; N1 separately appends forty.\n    expect(release.concepts).toHaveLength(462);');
 }else if(file.endsWith('/gs028-20261002-batch.test.ts')){
  const a='expect(records).toHaveLength(31);',b='expect(records).toHaveLength(33);';assert.equal(next.split(a).length,2);next=next.replace(a,b);allowed.push([a,b]);
  next=next.replace('// interval surveillance, leaving 31 current exact testing identities.','// interval surveillance. Final flag revisions retain 33 current exact testing identities.');
 }else{
  for(const[a,b]of [[')).toHaveLength(1008);',')).toHaveLength(1048);'],[')).toHaveLength(1303);',')).toHaveLength(1343);']]){assert.equal(next.split(a).length,2,file);next=next.replace(a,b);allowed.push([a,b]);}
  next=next.replace('    expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(c => !c.id.startsWith("case.gs028g.")','    // N1 appends forty single-node cases; the flag round replaces cases in place.\n    expect(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(c => !c.id.startsWith("case.gs028g.")');
 }
 const beforeCalls=(old.match(/\bexpect\(/g)||[]).length;assert.equal((next.match(/\bexpect\(/g)||[]).length,beforeCalls);
 assert.deepEqual([...next.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]),[...old.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]));
 const normalize=s=>s.replace(pattern,'.toMatchInlineSnapshot(SNAPSHOT)').split('\n').filter(l=>!l.trim().startsWith('//')).join('\n');
 let reversed=next;for(const[a,b]of allowed)reversed=reversed.replace(b,a);
 assert.equal(normalize(reversed),normalize(old),'Only documented literal expectations, snapshots and comments may differ');
 if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8'),next);else{assert.equal(fs.readFileSync(file,'utf8'),old,'Concurrent edit: inspect before applying');fs.writeFileSync(file,next);}
 reviews.push({file,assertionCallSites:beforeCalls,commandsAndDeadlinesUnchanged:true,onlyDocumentedLiteralExpectationsSnapshotsAndComments:true,replacements:allowed});
}
fs.writeFileSync(root+'question-flags-round3-remaining-fixtures-review-20261104.json',JSON.stringify({checkedOn:'2026-11-04',reviews,control:'question-flags-round3-remaining-fixtures-control-20261104.json',scope:'Entry bank reproduces both original patient-supply snapshots. Same-N1 control isolates the eight new constructs from the separate forty-case append; all operational assertions and deadlines are retained. Final acceptance uses actual Vitest results, not the counterfactual harness.'},null,2)+'\n');
console.log(JSON.stringify(reviews));
