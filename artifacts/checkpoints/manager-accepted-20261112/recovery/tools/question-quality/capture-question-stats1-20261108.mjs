import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata} from './bank.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),meta=collectAuthoredMetadata(c),live=c.SYNTHETIC_CLINICAL_RELEASE;
const output='tools/question-quality/fixtures/question-stats1-before-20261108.json';
assert(!fs.existsSync(output),'Immutable stats1 capture already exists; do not refresh');
const families=['arr-nnt','bias-confounding','chi-square','confidence-interval','errors-power','fisher-exact','independent-t','one-way-anova','p-value','paired-t','predictive-value-prevalence','rank-sum','risk-ratio-odds-ratio','sensitivity-specificity','signed-rank','study-design'];
const familyFor=n=>families.find(f=>[n.primaryConceptId,n.questionVariantId].some(id=>new RegExp('^(?:concept|question)\\.statistics-ethics\\.'+f+'(?:\\.|$)').test(id)));
const extraSlugs=['negative-predictive-value-denominator','positive-likelihood-ratio','mcnemar-paired-binary-outcomes','equivalence-margin-versus-null-test'];
const targets=[],additional=[];
for(const cs of live.cases)for(const node of cs.decisionNodes){
 const family=familyFor(node),extra=extraSlugs.find(s=>cs.id==='case.n2.'+s+'.v1');
 if(!family&&!extra)continue;
 const row={id:family?'S'+String(targets.length+1).padStart(2,'0'):'SX'+String(additional.length+1).padStart(2,'0'),family:family??extra,
  clinicalCase:cs,node,concept:meta.concepts.get(node.primaryConceptId),authored:meta.questions.get(node.questionVariantId)??[],
  timing:c.ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>t.caseId===cs.id&&t.nodeId===node.id&&t.questionVariantId===node.questionVariantId)};
 (family?targets:additional).push(row);
}
assert.equal(targets.length,64);assert.equal(new Set(targets.map(t=>t.node.questionVariantId)).size,64);
assert(targets.every(t=>t.clinicalCase.decisionNodes.length===1));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const files={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())walk(p);else if(/\.(ts|tsx|json)$/.test(e.name))files[p]=hash(p);}}
for(const dir of ['packages/clinical-content/src','packages/game-domain/src','packages/balance-config/src','apps/player/src/session/cloud'])walk(dir);
const standardPath='docs/clinical/question-authoring-standard.md';files[standardPath]=hash(standardPath);
files['tools/qa/level-five-integration-results-20261012.json']=hash('tools/qa/level-five-integration-results-20261012.json');
const record={capturedOn:'2026-11-08',scope:'Exact live statistics nodes/metadata; mathematical teaching values only. No private feedback or external source prose.',families,targets,additional,
 live:{cases:live.cases.length,nodes:live.cases.reduce((n,cs)=>n+cs.decisionNodes.length,0),concepts:live.concepts.length,sha256:digest(live)},
 releaseHeader:{id:live.id,schemaVersion:live.schemaVersion,publicationStatus:live.publicationStatus,disclaimer:live.disclaimer},
 catalogSha256:digest(c.QUESTION_CATALOG_RELEASE),manifestSha256:digest(c.QUESTION_SHIP_MANIFEST),timingSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),
 concepts:[...meta.concepts.values()],claims:[...meta.claims.values()],sources:[...meta.sources.values()],questionIds:[...meta.questions.keys()],
 files,standardBeforeText:fs.readFileSync(standardPath,'utf8'),testSupportBeforeText:fs.readFileSync('packages/clinical-content/src/question-flags3-acceptance-test-support.ts','utf8')};
fs.writeFileSync(output,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({output,namedNodes:targets.length,additionalNodes:additional.length,files:Object.keys(files).length,live:record.live,bytes:fs.statSync(output).size},null,2));
