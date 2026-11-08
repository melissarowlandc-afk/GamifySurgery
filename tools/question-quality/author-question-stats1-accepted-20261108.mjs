import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=read('tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json');
const ledger=read('docs/research/sources-question-stats1-20261108.json');
const draft={contentVersion:'question-authoring.2026-11-08.stats1-r2',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null};
const repairs=new Map();
function repair(id,change,summary,claim){
 const old=before.reviewedRevisions.find(r=>r.auditId===id);assert(old);
 assert.equal(before.reviews.find(r=>r.id===id).verdict,'REVISE');
 const r=structuredClone(old),q=r.question;
 q.id=q.id.replace(/\.r(\d+)$/,(_,n)=>'.r'+(Number(n)+1));r.questionVariantId=q.id;
 Object.assign(q,draft);change(q,r);r.focus=summary;
 q.answerChoices=q.answerChoices.map((a,i)=>({...a,id:'choice.stats1.20261108.r2.'+id.toLowerCase()+'.'+(i===0?'key':'d'+i)}));
 const app='claim.stats1.20261108.'+id.toLowerCase()+'.application';
 q.supportingEvidenceClaimIds=q.supportingEvidenceClaimIds.filter(c=>c!==app);
 q.supportingEvidenceClaimIds.push('claim.stats1.20261108.r2.'+id.toLowerCase()+'.application');
 if(['S21','S25','S26','S27','S28'].includes(id))q.supportingEvidenceClaimIds.push('claim.stats1.20261108.r2.expected-cell');
 repairs.set(id,{definition:r,summary,statement:claim});
}
function choices(q,pairs){q.answerChoices=pairs.map(([label,rationale],i)=>({id:'pending',label,isCorrect:i===0,rationale,distractorRationale:i===0?null:rationale}));}
const kv=q=>{assert.equal(q.exhibit.kind,'keyValue');return q.exhibit.items;};

for(const [id,group,outcome,unit,plural]of [
 ['S01','dressing','Healing time','days','healing times'],
 ['S02','hospital','Blood loss','mL','blood losses'],
 ['S03','surgical-approach','Incision length','cm','incision lengths'],
 ['S04','rehabilitation-program','Walking distance','meters','walking distances'],
])repair(id,q=>{
 kv(q)[0].value='Two '+group+' groups; independent, unpaired patients.';
 kv(q)[1].value=outcome+' in '+unit+'; approximately normal within groups, with similar variances.';
 q.explanation=[
  'Two independent groups with approximately normal '+plural+' within groups and similar variances: use the independent-samples t-test.',
  'It compares the two population mean '+plural+'.',
  'A paired t-test needs matched pairs or repeated observations.',
 ].join('\n');
 q.answerChoices[0].rationale=q.explanation.split('\n')[0];
 q.answerChoices[1].rationale='This needs matched pairs or repeated observations; the stated groups are independent and unpaired.';
 q.answerChoices[1].distractorRationale=q.answerChoices[1].rationale;
},'Make independence/unpaired sampling explicit; teach the actual normal-within-group and similar-variance assumptions for two groups. Remove shared-assessor language; label the individual outcome, not its mean.',
 'In this constructed comparison, two independent unpaired groups have approximately normal '+plural+' within groups and similar variances; an independent-samples t-test directly compares their population means.');

for(const [id,count,group,outcome,unit]of [
 ['S09',3,'dressing','healing time','days'],['S10',4,'ward','length of stay','days'],
 ['S11',3,'training-program','task-completion time','seconds'],['S12',4,'device','blood loss','mL'],
])repair(id,q=>{
 kv(q)[0].value=count+' '+group+' groups; independent patients.';
 kv(q)[1].value=outcome+' in '+unit+'; approximately normal within groups with similar variances.';
 q.explanation=[
  count+' independent groups with approximately normal '+outcome+' within groups and similar variances: use one-way ANOVA.',
  'Null: all '+count+' population means are equal; rejection does not identify which pair differs.',
  'A two-sample t-test compares only two group means.',
 ].join('\n');
 q.answerChoices[0].rationale=count+' independent groups, approximately normal outcomes within groups and similar variances support one ANOVA comparison of all '+count+' population means.';
},'State independence and teach the actual '+count+'-group normality/similar-variance assumptions. Keep the conventional test names and the one omnibus comparison.',
 'With '+count+' independent groups, approximately normal '+outcome+' within groups and similar variances in this constructed example, one-way ANOVA tests equality of all '+count+' population means without identifying a particular pair.');

repair('S21',q=>{
 q.exhibit.caption='Constructed independent patients; smoking status at admission, one category each.';
 q.exhibit.columnHeaders=['Current','Former','Never'];q.exhibit.rowHeaders=['Group A','Group B'];
},'Use one mutually exclusive current/former/never smoking category per independent patient at admission. Keep all six counts, the single association task and options.',
 'The constructed table counts each independent patient once by group and mutually exclusive smoking status at admission (current, former or never); its smallest expected cell is 50 x 20 / 100 = 10, supporting the Pearson chi-square approximation.');

for(const [id,row,event,n,expected]of [['S25',8,2,16,1],['S26',10,1,20,0.5],['S27',10,2,20,1],['S28',12,1,24,0.5]])
 repair(id,q=>{
  const line='Expected event count = row total x event-column total / N = '+row+' x '+event+' / '+n+' = '+expected+' per group.';
  q.explanation=q.explanation.split('\n').map((s,i)=>i===1?line:s).join('\n');
  q.answerChoices[0].rationale='The groups are independent and the event cells are sparse. '+line;
 },'Show the expected-cell formula with the actual row total, event-column total and grand total. Retain the sparse independent 2x2 rule and conventional procedure choices.',
 'For the constructed independent 2x2 table, expected events under independence equal row total times event-column total divided by grand total: '+row+' x '+event+' / '+n+' = '+expected+' in each group; Fisher exact testing avoids the unreliable sparse-cell Pearson approximation.');

repair('S30',q=>{
 kv(q)[0].value='Consecutive surgical charts from last year, selected regardless of infection; compare recorded postoperative infections by preoperative smoking status.';
 q.explanation=[
  'A retrospective cohort identifies a population without selecting on outcome.',
  'Consecutive patients enter regardless of infection; smoking precedes the recorded infections.',
  'Case-control studies select people by outcome status.',
 ].join('\n');
 choices(q,[
  ['Cohort study','Consecutive historical charts enter without outcome-based selection, then outcomes are compared by earlier exposure.'],
  ['Case-control study','This would select patients according to infection status, which is not the sampling basis here.'],
  ['Cross-sectional study','These records preserve exposure before the later postoperative outcome rather than a single simultaneous assessment.'],
 ]);
},'Specify consecutive historical charts selected without regard to infection; distinguish sampling basis from exposure-outcome chronology in the feedback.',
 'Selecting consecutive historical surgical charts regardless of infection, then comparing recorded infections by earlier preoperative smoking, is a retrospective cohort design rather than outcome-selected case-control sampling.');

repair('S48',q=>{
 choices(q,[
  ['Risk is 50% lower','A risk ratio of 0.5 means group A has half the event risk of group B.'],
  ['Risk is 50% higher','A 50% higher risk would correspond to a risk ratio of 1.5, not 0.5.'],
  ['Risk is unchanged','Equal risk corresponds to a risk ratio of 1, not 0.5.'],
 ]);
 q.explanation=[
  'Risk ratio 0.5 = half the comparison risk = 50% lower risk.',
  'This is a relative probability, not an absolute percentage-point difference.',
  'A 50% higher risk would require a risk ratio of 1.5.',
 ].join('\n');
},'Use parallel risk statements differing in direction or magnitude; remove the risk/odds and percent/percentage-point component-convergence shortcut.',
 'The constructed risk ratio A/B = 0.5 means 50% lower risk in A; 50% higher corresponds to 1.5 and unchanged risk to 1.');

for(const [id,pairs,last]of [
 ['S49',[
  ['10 patients','ARR = 0.20 - 0.10 = 0.10; NNT = 1 / 0.10 = 10 over 30 days.'],
  ['5 patients','This is 1 / 0.20, the reciprocal of control risk rather than risk reduction.'],
  ['20 patients','This treats the control percentage as a patient count instead of taking the reciprocal risk difference.'],
 ],'5 patients is 1 / 0.20, using control risk instead of risk reduction.'],
 ['S50',[
  ['5 percentage points','ARR = 15% - 10% = 5 percentage points.'],
  ['10 percentage points','This substitutes the treatment event rate for the between-group difference.'],
  ['15 percentage points','This substitutes the control event rate for the between-group difference.'],
 ],'The 10-point option substitutes the treatment event rate for the risk difference.'],
 ['S51',[
  ['25 patients','ARR = 0.12 - 0.08 = 0.04; NNT = 1 / 0.04 = 25 over 30 days.'],
  ['4 patients','This uses the raw percentage-point reduction as a patient count without taking its reciprocal as a proportion.'],
  ['33 patients','This uses the rounded relative percentage reduction as a patient count instead of the reciprocal absolute reduction.'],
 ],'4 is the percentage-point reduction, not its reciprocal expressed as a proportion.'],
 ['S52',[
  ['20 patients','ARR = 0.30 - 0.25 = 0.05; NNT = 1 / 0.05 = 20 over 30 days.'],
  ['5 patients','This uses the raw percentage-point reduction instead of its reciprocal as a proportion.'],
  ['25 patients','This uses the treatment percentage as a patient count instead of the reciprocal absolute reduction.'],
 ],'5 is the percentage-point reduction; NNT requires 1 / 0.05.'],
])repair(id,q=>{
 choices(q,pairs);const exp=q.explanation.split('\n');exp[2]=last;q.explanation=exp.join('\n');
},id==='S50'?'Offer feasible same-scale 5/10/15-point values and explain the offered treatment-rate substitution; remove impossible large distractors.':
 'Put plausible values on both sides of the key, breaking the repeated sole-large/two-digit-key pattern. Retain rates/outcome/30-day horizon and explain an actual offered error.',
 id==='S50'?'For the constructed 30-day risks 15% versus 10%, absolute reduction is 5 percentage points; the two individual rates are not the difference.':
 id==='S49'?'For constructed 30-day risks 20% versus 10%, ARR is 0.10 and NNT is 10; reciprocal control risk gives 5 and does not answer NNT.':
 id==='S51'?'For constructed 30-day risks 12% versus 8%, ARR is 0.04 and NNT is 25; neither the raw 4-point reduction nor the rounded relative reduction is a patient count.':
 'For constructed 30-day risks 30% versus 25%, ARR is 0.05 and NNT is 20; the raw 5-point reduction and treatment percentage are not the reciprocal absolute reduction.');

repair('S54',q=>{
 kv(q)[1]={label:'Target benefit threshold',value:'2 days.'};
 q.stem='Where does the target threshold fall relative to the confidence interval?';
 choices(q,[
  ['Threshold lies inside the interval','The 2-day threshold is greater than 1 and less than 3.'],
  ['Threshold lies below the interval','The interval begins at 1 day, below the 2-day threshold.'],
  ['Threshold lies above the interval','The interval extends to 3 days, above the 2-day threshold.'],
 ]);
 q.explanation=[
  'Compare the single target threshold with both interval endpoints.',
  '1 < 2 < 3 days: the interval includes reductions below and above the threshold.',
  'The threshold is not below the interval, whose lower endpoint is 1 day.',
 ].join('\n');
},'State the target as the single 2-day threshold and use threshold consistently in task/options/feedback; show both sides of the threshold in the interval.',
 'In the constructed reduction interval of 1 to 3 days, the single target threshold of 2 days lies inside because 1 < 2 < 3; reductions both below and above that threshold remain within the interval.');

repair('S55',q=>{
 q.explanation=q.explanation.replace('do not reject the equal-means null.','do not reject the tested null hypothesis.');
},'Use only the stated p-value and significance level: refer to the tested null, without inventing an equal-means null or adding data.',
 'For the constructed test with p = 0.20 and prespecified significance level 0.05, the tested null is not rejected; the result does not establish equivalence.');
repair('S59',q=>{
 q.explanation=q.explanation.replace('A negative point estimate does not override an interval containing 0.','A negative lower endpoint alone does not establish a significant decrease.');
},'Explain the shown negative lower endpoint, not an unstated point estimate; retain the interval, matching test and choices.',
 'The constructed two-sided 95% interval -2 to +1 days contains the zero mean-difference null, so the matching 5% test does not find a difference; a negative lower endpoint alone does not establish a decrease.');

assert.equal(repairs.size,22);assert.deepEqual([...repairs.keys()].sort(),before.reviews.filter(r=>r.verdict==='REVISE').map(r=>r.id).sort());
const definitions=[...repairs.values()].map(r=>r.definition);
const claims=definitions.map(r=>{
 const old=ledger.claims.find(c=>c.id==='claim.stats1.20261108.'+r.auditId.toLowerCase()+'.application');assert(old);
 return {...old,...draft,id:'claim.stats1.20261108.r2.'+r.auditId.toLowerCase()+'.application',statement:repairs.get(r.auditId).statement};
});
const expectedBasis=ledger.basisClaims.find(c=>c.id==='claim.gs028se.statistics.chi-square');assert(expectedBasis);
claims.push({...claims[0],id:'claim.stats1.20261108.r2.expected-cell',
 statement:'In a contingency table under independence, an expected cell count is its row total times its column total divided by the grand total.',
 basisClaimIds:[expectedBasis.id],sourceIds:expectedBasis.sourceIds,evidenceCategory:'definition'});
const responses=[...repairs].map(([id,r])=>({id,summary:r.summary,
 notes:['cues','fairness','explanationIssues','suggestions'].flatMap(field=>before.reviews.find(v=>v.id===id)[field].map(note=>({field,note,response:
  field==='cues'&&['S09','S10','S11','S12','S25','S26','S27','S28'].includes(id)?'Reviewer explicitly accepts these conventional procedure labels for focused practice. Retain all choices; no added pre-answer rationale or difficulty. '+r.summary:r.summary}))),
 sourceHold:'none',meaning:'same',clinicalReviewStatus:'needs_clinician_review'}));
for(const d of definitions){assert.equal(d.question.answerChoices.filter(a=>a.isCorrect).length,1);assert.equal(d.question.explanation.split('\n').length,3);}
const outputs=[
 ['packages/clinical-content/src/question-stats1-accepted-data-20261108.ts',
  'import type {Stats1Definition} from "./question-stats1-20261108-data";\nimport type {EvidenceClaim} from "./pilot-schema";\n'+
  'export const QUESTION_STATS1_REPAIRED_DEFINITIONS:Stats1Definition[]='+JSON.stringify(definitions,null,2)+';\n'+
  'export const QUESTION_STATS1_REPAIRED_CLAIMS:(EvidenceClaim&{basisClaimIds:string[];verificationScope:string})[]='+JSON.stringify(claims,null,2)+';\n'],
 ['docs/research/question-stats1-review-response-20261108.json',JSON.stringify(responses,null,2)+'\n'],
];
for(const[p,text]of outputs)if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),text,p+' stale');else fs.writeFileSync(p,text);
console.log(JSON.stringify({revised:definitions.length,newClaims:claims.length,unchangedPass:42,newVariantIds:definitions.map(r=>({id:r.auditId,variant:r.questionVariantId}))}));
