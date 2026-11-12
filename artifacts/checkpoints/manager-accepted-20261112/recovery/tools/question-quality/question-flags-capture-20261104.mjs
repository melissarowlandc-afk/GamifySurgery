import fs from 'node:fs';
import crypto from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import { collectAuthoredMetadata } from './bank.mjs';

const destination='tools/question-quality/fixtures/question-flags-before-20261104.json';
if(fs.existsSync(destination))throw new Error('Immutable starting snapshot already exists');
const lines=fs.readFileSync('.local-dev/tester-feedback/feedback-2026-11-04T12-06-28.919Z.md','utf8').split(/\r?\n/);
const headings=lines.map((line,index)=>({index,match:line.match(/^(#{1,6})\s+(.*)/)})).filter(x=>x.match);
const flags=headings.filter(x=>/^Question flag\s/.test(x.match[2])).map(h=>{
  const end=headings.find(x=>x.index>h.index&&x.match[1].length<=h.match[1].length)?.index??lines.length;
  const section=lines.slice(h.index,end).join('\n').replace(/\\([._+])/g,'$1');
  const note=section.split('\n').filter(l=>l.startsWith('>')).map(l=>l.replace(/^>\s?/,'' )).join('\n');
  const record={flagId:h.match[2].replace('Question flag ',''),questionVariantId:section.match(/Variant: (\S+)/)?.[1],conceptId:section.match(/Concept: (\S+)/)?.[1],note};
  if(Object.values(record).some(x=>!x)||/@/.test(JSON.stringify(record)))throw new Error('Invalid or identifying flag content');
  return record;
});
const content=await import('../../packages/clinical-content/src/index.ts');
const metadata=collectAuthoredMetadata(content), release=content.SYNTHETIC_CLINICAL_RELEASE;
const ids=new Set(flags.map(f=>f.questionVariantId));
const matches=release.cases.flatMap(cs=>cs.decisionNodes.filter(n=>ids.has(n.questionVariantId)).map(n=>({questionVariantId:n.questionVariantId,caseId:cs.id,nodeId:n.id})));
if(matches.length!==ids.size)throw new Error('Flag identity mismatch');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const files={};
const visit=dir=>{if(!fs.existsSync(dir))return;for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const path=dir+'/'+entry.name;if(entry.isDirectory()&&!['node_modules','.git','dist'].includes(entry.name))visit(path);
  else if(entry.isFile()&&/\.(?:ts|tsx|mjs|cjs|json|md|sql)$/.test(path))files[path]=hash(fs.readFileSync(path));
}};
for(const root of ['packages/clinical-content/src','packages/clinical-content/tests','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','tests/fixtures','tools/qa','tools/economy-audit','apps/player/src/session','supabase'])visit(root);
for(const path of ['tools/question-quality/lint.mjs','tools/question-quality/lint.test.mjs','docs/clinical/question-authoring-standard.md'])files[path]=hash(fs.readFileSync(path));
const batchMatches=flags.map(f=>({...f,live:matches.filter(m=>m.questionVariantId===f.questionVariantId),batch1Revisions:(content.QUESTION_QUALITY_CURRENT_REVISIONS??[]).filter(r=>r.previousQuestionVariantId===f.questionVariantId||r.questionVariantId===f.questionVariantId).map(r=>({auditId:r.auditId,questionVariantId:r.questionVariantId})),conceptSiblingRevisions:(content.QUESTION_QUALITY_CURRENT_REVISIONS??[]).filter(r=>r.question.primaryConceptId===f.conceptId).map(r=>({auditId:r.auditId,questionVariantId:r.questionVariantId}))}));
const snapshot={schemaVersion:1,capturedOn:'2026-11-04',sourcePolicy:'Only Question flag sections extracted. No identity/email fields, unrelated feedback, external source text or network retrieval.',managerReportedLiveBatch1:'7b8cff7a',flags:batchMatches,release,questions:Object.fromEntries(metadata.questions),claims:Object.fromEntries(metadata.claims),sources:Object.fromEntries(metadata.sources),conceptMetadata:Object.fromEntries(metadata.concepts),approvals:content.QUESTION_QUALITY_CLINICAL_APPROVALS,timings:content.ANSWER_CHOICE_TIMING_REGISTRY,files};
fs.mkdirSync('tools/question-quality/fixtures',{recursive:true});fs.writeFileSync(destination,JSON.stringify(snapshot,null,2)+'\n');
console.log(JSON.stringify({snapshot:destination,flags:flags.length,distinctVariants:ids.size,liveMatches:matches.length,protectedFiles:Object.keys(files).length,bytes:fs.statSync(destination).size},null,2));
