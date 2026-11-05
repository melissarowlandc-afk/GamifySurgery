// Authoring-time metadata reuse, never source retrieval or gameplay inference.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const groups = await Promise.all(['perioperative','abdominal','specialty','research'].map(n => import(`../../packages/clinical-content/src/question-new-n2-${n}.ts`)));
const items = groups.flatMap((group,i) => group[`QUESTION_NEW_N2_${['PERIOPERATIVE','ABDOMINAL','SPECIALTY','RESEARCH'][i]}`]);
const catalog = JSON.parse(fs.readFileSync('.local-dev/question-new-n2-20261104/catalog-before.json','utf8'));
const draft = {contentVersion:'clinical.question-new-n2.2026-11-04.v1',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null};
// New mathematical mappings are explicit derivations from recorded definitions,
// not claims of newly retrieved guidance or measured clinical event rates.
const derived = [
  {id:'claim.n2.derived.negative-predictive-value',statement:'In a completely reference-classified cohort, the proportion without the condition among negative tests is TN/(TN+FN).',
    basis:['claim.gs028se.statistics.sensitivity-specificity','claim.gs028se.statistics.predictive-value-prevalence'],derivation:'Condition on the test-negative column, count reference-negative members and divide by the full column total.'},
  {id:'claim.n2.derived.positive-likelihood-ratio',statement:'The ratio P(test positive | condition)/P(test positive | no condition) equals sensitivity/(1-specificity), the positive likelihood ratio.',
    basis:['claim.gs028se.statistics.sensitivity-specificity'],derivation:'The recorded definitions give sensitivity as the first conditional probability and specificity as the negative probability without the condition; its complement gives the second probability.'},
  {id:'claim.n2.derived.number-needed-to-harm',statement:'For an adverse event with a higher intervention risk than comparator risk over the same horizon, number needed to harm is the reciprocal of that absolute risk increase.',
    basis:['claim.gs028se.statistics.arr-nnt'],derivation:'Apply the recorded reciprocal absolute-risk-difference construction to an excess harmful outcome, preserving comparator and horizon rather than converting its direction into a benefit.'},
  {id:'claim.n2.derived.equivalence-interval-rule',statement:'For the specified two-one-sided-tests equivalence procedure at alpha 0.05, equivalence is supported when the corresponding 90% confidence interval lies wholly within both prespecified equivalence bounds.',
    basis:['claim.qq20261102a.null-test-versus-protocol-magnitude','claim.qq20261102b.specified-interval-decision-rule'],derivation:'Apply the prior recorded TOST/90%-interval limitation to both supplied protocol boundaries; this is not an ordinary zero-effect significance test.'},
  {id:'claim.n2.derived.direct-standardization',statement:'A directly standardized risk for specified strata is the sum of each observed stratum-specific risk multiplied by its common reference weight; the same weights must be used for each group being compared.',
    basis:['claim.gs028se.statistics.bias-confounding'],derivation:'The exercise explicitly defines its common mixture. Its event probability is the weighted sum of the conditional stratum probabilities, by counting the expected events in that constructed mixture.'},
];
const baseById = new Map(catalog.claims.map(c=>[c.id,c]));
const derivedRecords = derived.map(d=>{
  const basis=d.basis.map(id=>{if(!baseById.has(id))throw new Error(`Missing derivation basis ${id}`);return baseById.get(id);});
  return {...draft,id:d.id,statement:d.statement,sourceIds:[...new Set(basis.flatMap(c=>c.sourceIds))],evidenceCategory:'evaluation',certainty:'moderate',
    limitation:`Author mathematical mapping from recorded definitions: ${d.derivation} No new source verification or empirical clinical probability is claimed. Independently review the derivation and application.`,
    applicablePopulation:'Constructed teaching datasets with complete stated denominators, comparator, horizon and protocol assumptions; not clinical event-rate guidance.',
    lastCheckedOn:'2026-11-04'};
});
const byId = new Map([...catalog.claims,...derivedRecords].map(c=>[c.id,c]));
const requested=[...new Set(items.flatMap(i=>i.existingClaimIds))].sort();
const missing=requested.filter(id=>!byId.has(id));
if(missing.length)throw new Error(`Missing recorded claim IDs: ${missing.join(', ')}`);
const inherited=requested.map(id=>byId.get(id));
const publicationKey=id=>{
  const s=catalog.sources.find(s=>s.id===id);if(!s)throw new Error(`Missing source ${id}`);
  return s.doi?`doi:${s.doi.trim().toLowerCase()}`:s.officialUrl?`url:${s.officialUrl.split(/[?#]/)[0].replace(/\/$/,'').toLowerCase()}`:`citation:${s.completeCitation.trim().toLowerCase()}`;
};
const provenance=inherited.map(c=>({claimId:`claim.n2.${createHash('sha256').update(c.id).digest('hex').slice(0,12)}`,
  inheritedClaimId:c.id,inheritedContentVersion:derived.some(d=>d.id===c.id)?null:c.contentVersion,
  inheritedLastCheckedOn:derived.some(d=>d.id===c.id)?null:c.lastCheckedOn,
  checkedLocallyOn:'2026-11-04',verificationBasis:derived.find(d=>d.id===c.id)?'Explicit mathematical derivation from recorded definitions; no fresh source retrieval.':'Previously recorded independent repository synthesis; no source newly retrieved.',
  statementUnchanged:!derived.some(d=>d.id===c.id),sourcePublicationKeys:[...new Set(c.sourceIds.map(publicationKey))],
  ...(derived.find(d=>d.id===c.id)?{basisClaimIds:derived.find(d=>d.id===c.id).basis,
    basisClaimChecks:derived.find(d=>d.id===c.id).basis.map(id=>({claimId:id,lastCheckedOn:baseById.get(id).lastCheckedOn,contentVersion:baseById.get(id).contentVersion})),
    derivation:derived.find(d=>d.id===c.id).derivation}:{})}));
const allowed=new Set(['id','contentVersion','reviewStatus','aiAssistedDrafting','lastClinicianReview','statement','sourceIds','evidenceCategory','certainty','limitation','applicablePopulation','lastCheckedOn']);
const claims=inherited.map((c,i)=>({...Object.fromEntries(Object.entries(c).filter(([k])=>allowed.has(k))),...draft,id:provenance[i].claimId,
  limitation:[c.limitation,'Offline reuse: source verification and currentness have not been refreshed for N2. The exact clinical application, decision boundary and option ranking require review.',
    new Set(c.sourceIds.map(publicationKey)).size===1?'Only one recorded source publication supports this atomic claim; no independent management cross-check has been added.':null].filter(Boolean).join(' ')}));
const sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))].sort();
const sources=sourceIds.map(id=>{
  const source=catalog.sources.find(s=>s.id===id);if(!source)throw new Error(`Missing source ${id}`);
  return {...source,...draft,evidenceClaimIds:[...new Set([...source.evidenceClaimIds,...claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id)])],
    reuseNotes:`${source.reuseNotes} N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed.`};
});
const target='packages/clinical-content/src/question-new-n2-evidence-20261104.ts';
fs.writeFileSync(target,'// Generated by tools/question-new-n2/build-evidence.mjs; offline metadata only.\n// Inherited verification/access dates remain authoritative; mathematical derivations are explicit.\nimport type { ClinicalSource, EvidenceClaim } from "./pilot-schema";\n\n'+
  `export const QUESTION_NEW_N2_CLAIM_PROVENANCE = ${JSON.stringify(provenance,null,2)} as const;\n\n`+
  `export const QUESTION_NEW_N2_CLAIMS: EvidenceClaim[] = ${JSON.stringify(claims,null,2)};\n\n`+
  `export const QUESTION_NEW_N2_SOURCES: ClinicalSource[] = ${JSON.stringify(sources,null,2)};\n`);
console.log(JSON.stringify({items:items.length,claims:claims.length,sources:sources.length,derivedMappings:derived.length,
  levels:Object.fromEntries([3,4].map(level=>[level,items.filter(i=>i.level===level).length]))}));
