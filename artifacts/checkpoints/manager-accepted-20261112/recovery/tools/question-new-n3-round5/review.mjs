import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {decisions} from './decisions.mjs';
import {inventoryRelease,collectAuthoredMetadata} from '../question-quality/bank.mjs';

const dir='.local-dev/question-new-n3-round5-20261110';
fs.mkdirSync(dir,{recursive:true});
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
const priorPath='docs/research/question-new-n3-round4-20261110.json';
const independentPath='docs/research/question-new-n3-round4-review-20261110.json';
const prior=read(priorPath),review=read(independentPath);
const b=await import('../../packages/clinical-content/src/question-new-n3-round4-20261110.ts');
const current=await import('../../packages/clinical-content/src/index.ts');
const metadata=collectAuthoredMetadata(current);
const returned=review.filter(r=>r.verdict==='REVISE');
const passed=review.filter(r=>r.verdict==='PASS');
assert.equal(review.length,5);assert.equal(returned.length,3);assert.equal(passed.length,2);
assert.deepEqual(new Set(returned.map(r=>r.id)),new Set(decisions.map(d=>`review.n3.${d.slug}.v4`)));
assert.equal(prior.ownerApprovalsNeeded.length,13);assert.equal(prior.drops.length,17);

// Diagnostic lint of retained versions only. No empty release or invented
// candidate is presented as a successful resident-level revision.
const cases=b.QUESTION_NEW_N3_ROUND4_CASES.filter(c=>decisions.some(d=>c.id===`case.n3.${d.slug}.v1`));
assert.equal(cases.length,3);
const conceptIds=new Set(cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId)));
const retainedRelease={...b.QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE,cases,
 concepts:b.QUESTION_NEW_N3_ROUND4_SOURCE_RELEASE.concepts.filter(c=>conceptIds.has(c.id))};
const lint=inventoryRelease(retainedRelease,collectAuthoredMetadata(b));
assert.equal(lint.totals.findings,0,'Retained-version lexical lint is not an author PASS');
fs.writeFileSync(dir+'/retained-lint.json',JSON.stringify(lint,null,2)+'\n');

const claimIds=[...new Set(decisions.flatMap(d=>d.basisClaimIds))];
const claims=claimIds.map(id=>{const c=metadata.claims.get(id);assert.ok(c,id);return c;});
const sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))];
const sources=sourceIds.map(id=>{const s=metadata.sources.get(id);assert.ok(s,id);
 for(const f of ['completeCitation','organizationOrJournal','authors','publicationYear','accessedOn','sourceClass','licenseLabel','reuseStatus','authorityAssessment','usageRole'])assert.ok(s[f],id+':'+f);
 assert.ok(s.officialUrl||s.doi);return s;});
const recorded=read(dir+'/recorded-catalog.json');
for(const c of claims)assert.deepEqual(c,recorded.claims.find(p=>p.id===c.id),'No new fact or refreshed check date');
for(const s of sources)assert.deepEqual(s,recorded.sources.find(p=>p.id===s.id),'No changed source metadata');

const parked=decisions.map(d=>{
 const id=`review.n3.${d.slug}.v4`,old=prior.variants.find(v=>v.id===id),independent=returned.find(r=>r.id===id);
 assert.ok(old&&independent);const authored=cases.find(c=>c.id===old.caseId);assert.deepEqual(authored,old.authoredTemplate);
 assert.equal(hash(authored),old.exactVersionSha256);
 return {id,disposition:d.disposition,reviewStatus:'needs_clinician_review',newVariantId:null,candidateEmitted:false,
  managerAcceptanceRequested:false,foundationalAcceptanceRequested:false,
  retainedVersion:{sourcePacket:priorPath,questionVariantId:old.questionVariantId,conceptId:authored.decisionNodes[0].primaryConceptId,
   exactVersionSha256:hash(authored),keyShownFirstForReviewOnly:true,after:old.after,
   status:'Unchanged historical draft; included to explain parking, not submitted as a round-five candidate.'},
  independentReview:{source:independentPath,...independent},
  originalObjective:d.originalObjective,supportedBoundary:d.supportedBoundary,
  reviewResponse:d.reviewResponse,prospectiveConstruction:{...d.prospectiveConstruction,
   status:'Considered outline only; no invented resolving observations, proposed key or executable variant.'},
  missingSupport:d.missingSupport,reentryTask:d.reentryTask,
  selfCheck:{kind:'manual_author_reassessment',independent:false,clinicalApproval:false,
   rubric:'question-authoring.2026-11-08.v15',authorVerdict:'PARK_NOT_PASS',
   calibratedToReviewer:{difficulty:independent.difficulty,twoStep:independent.twoStep,disagreement:false},
   ...d.selfCheck,decidingObservation:d.prospectiveConstruction.decidingObservationNeeded,
   counterfactual:d.prospectiveConstruction.counterfactual,closestCompetitor:d.prospectiveConstruction.closestCompetitor},
  evidenceAudit:d.basisClaimIds.map(id=>{const c=metadata.claims.get(id);return {claimId:id,statement:c.statement,limitation:c.limitation,lastCheckedOn:c.lastCheckedOn,sourceIds:c.sourceIds,
   use:'Recorded boundary only; does not verify the unrecorded extension identified above.'};}),
  ownerQuestion:null,
 };
});

const frozen=passed.map(r=>{
 const old=prior.variants.find(v=>v.id===r.id),cs=b.QUESTION_NEW_N3_ROUND4_CASES.find(c=>c.id===old.caseId);
 assert.deepEqual(cs,old.authoredTemplate);assert.equal(hash(cs),old.exactVersionSha256);
 return {id:r.id,questionVariantId:old.questionVariantId,authoredCaseSha256:hash(cs),preservedExact:true,
  manifestOwner:'Manager/rewrite lane; this worker makes no acceptance or integration change.'};
});
const held=prior.ownerApprovalsNeeded;
const packet={schemaVersion:1,generatedOn:'2026-11-10',batch:'N3 round 5',
 label:'Key shown first for review only in retained prior-version records; no round-five keyed candidates.',
 reviewStatus:'needs_clinician_review',clinicalSignoff:'Melissa Rowland; source reuse, tests and author checks do not confer clinical approval.',
 purpose:'Resolve the three returned round-four items; the manager explicitly permits parking when a genuinely two-step revision is not supportable.',
 dispositionCounts:{inputs:3,revisedCandidates:0,parked:3,newOwnerQuestions:0},
 variants:[],parkedItems:parked,
 executableCandidates:{count:0,sourceFiles:[],sourceRelease:null,previewCommand:null,
  reason:'All three fail the requested supported two-step construction. No new source release, timing row, question ID or executable key is emitted.'},
 frozenPreservation:frozen,
 existingOwnerHolds:{count:13,sourcePacket:priorPath,exactPriorArraySha256:hash(held),unchanged:true,newQuestions:[],
  status:'Awaiting Melissa; no held item is reopened or rewritten here.'},
 previouslyProposedDrops:{count:17,sourcePacket:priorPath,exactPriorArraySha256:hash(prior.drops),
  managerDecision:'Accepted as drops in the current brief; historical source definitions and FSRS identities are retained, with no retirement migration.'},
 earlierPassPreservation:prior.frozenPreservation,
 sourceMode:{networkCalls:0,newAtomicFacts:0,newSourceRecords:0,refreshedVerificationDates:0,
  description:'Read only locally recorded permitted atomic claims, bibliography and verification/approval ledgers. A citation is not verification of an unrecorded recommendation.',
  localCrossChecks:[
   {path:'docs/execplans/concept-expansion-source-review-2026-09-11.md',use:'Lactational-abscess scope and source limitations; no new milk-handling protocol.'},
   {path:'docs/clinical-workbench/approvals/owner-row-037-postoperative-chylous-ascites.md',use:'Exact large symptomatic inpatient approval scope; excludes approval of a stable low-output or rigid escalation variant.'},
   {path:'docs/research/question-new-n3-review2-20261105.json',use:'Avoid repeating the easy deep-abscess and A-better/B-worse constructions.'},
  ]},
 claims,sources,sourceLinks:sources.map(s=>({sourceId:s.id,url:s.officialUrl??`https://doi.org/${s.doi}`,
  target:'_blank',rel:'noopener noreferrer',referrerPolicy:'no-referrer'})),
 lint:{scope:'Diagnostic rerun of the three unchanged v4 drafts, including their finite profile contexts; no new candidate is claimed clean or passed.',
  newCandidateCount:0,retainedVersions:3,totals:lint.totals,linterVersion:lint.linterVersion,findings:[]},
 runtime:{newRuntimeDefinitions:0,newConceptVersions:0,historyMigrations:0,registryEdits:0,manifestEdits:0,
  randomization:'Retained definitions still have shuffleAnswers=true. No new choices or test waits were authored.',
  saveEffect:'No runtime code or historical definition changes by this lane; no new save-compatibility behavior or test is claimed.',
  level5BoundInputEdits:[]},
 statistics:'No statistics item, constructed statistical dataset or added statistical objective.',
};
const file='docs/research/question-new-n3-round5-20261110.json';
fs.writeFileSync(file,JSON.stringify(packet,null,2)+'\n');
const receipt={path:file,sha256:hash(fs.readFileSync(file)),inputs:3,candidates:0,parked:3,
 frozenRound4Exact:frozen.length,earlierFrozenPassCount:prior.frozenPreservation.length,
 existingOwnerHolds:13,acceptedHistoricalDrops:17,claims:claims.length,sources:sources.length,
 newAtomicFacts:0,sourceRetrievals:0,lint:packet.lint};
fs.writeFileSync(dir+'/packet-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt));
