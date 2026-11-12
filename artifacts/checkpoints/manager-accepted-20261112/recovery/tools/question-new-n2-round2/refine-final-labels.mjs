import fs from 'node:fs';
import assert from 'node:assert/strict';
const base='packages/clinical-content/src/question-new-n2-round2-';
function update(group,fn){const p=base+group+'.ts';fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));}
function replace(s,a,b){assert.ok(s.includes(a),a);return s.replaceAll(a,b);}
update('perioperative',s=>{
 for(const[a,b]of [
  ['with no additional sugammadex','with sugammadex dosing complete'],['with additional sugammadex','with further sugammadex administration'],
  ['Remove staples across the involved span for drainage','Remove the affected staple span and evacuate its contents'],
  ['Factor 8 activity, inhibitor testing and mixing assay','Factor 8 assay, inhibitor testing and mixing test'],
  ['Peak-to-plateau gradient at the next matched assessment','Peak minus plateau pressure at the next matched assessment'],
 ])s=replace(s,a,b);return s;
});
update('abdominal',s=>{
 s=replace(s,'Sigmoid colectomy with regional nodes','Sigmoid colon with regional oncologic colectomy');
 s=replace(s,'Right colectomy with regional nodes','Ascending colon with regional oncologic colectomy');
 s=replace(s,'Full-thickness endoscopic excision at site 2','Sigmoid colon with full-thickness endoscopic scar excision');
 const start=s.indexOf('  revise("malignant-polyp-local-versus-regional-risk"'),end=s.indexOf('  revise("',start+5);
 let t=s.slice(start,end);
 const a=t.indexOf('\n    ],',t.indexOf('    choices: ['));
 t=t.slice(0,a)+`\n      c("ascending-scar", "Ascending colon with full-thickness endoscopic scar excision", "This acts locally on the tattooed noninvasive site while failing to address the separate adverse invasive specimen mapped to the sigmoid."),`+t.slice(a);
 const b=t.indexOf('\n      ],',t.indexOf('      distractorMisreadings: ['));
 t=t.slice(0,b)+`\n        {choiceId: "ascending-scar", plausibleMisreading: "Let the tattoo select the site and let clear local edges erase the regional-risk issue.", whenItWouldBeRight: "A demonstrated residual local lesion at the ascending scar, without the separate adverse invasive finding, could support selected local re-excision there.", whyNotThisRecord: "Container 1 is noninvasive and removed, while container 2 has the adverse invasive vascular finding."},`+t.slice(b);
 t=t.replace('Three operations','Four site/operation plans').replace('Three named operations','Four site/operation plans');
 t=t.replace('The tattoo does not appear in a key-specific procedure label.','The complete two-by-two site/procedure set balances both components; each site and operation occurs twice.');
 return s.slice(0,start)+t+s.slice(end);
});
update('research',s=>{
 const a=s.indexOf('  revise("number-needed-to-harm"'),b=s.indexOf('  revise("',a+5);let n=s.slice(a,b);
 n=replace(n,'c("control-both", "NNT 12 / NNH 34; advance", "These figures invert the comparator\'s 9% infection and 3% rash risks rather than the relevant between-group differences.")',
  'c("regimen-risks", "NNT 17 / NNH 13; revise", "These figures invert the new regimen\'s 6% infection and 8% rash risks rather than the between-group differences.")');
 n=replace(n,'{choiceId: "control-both", plausibleMisreading: "Invert comparator risks instead of between-regimen changes for both outcomes.", whenItWouldBeRight: "Actual absolute benefit of 9% and excess harm of 3% would give rounded-up 12 and 34 and meet these stated requirements.", whyNotThisRecord: "The displayed between-group differences are 3% and 5%, respectively."}',
  '{choiceId: "regimen-risks", plausibleMisreading: "Invert the new regimen\'s event risks instead of comparing them with the control group.", whenItWouldBeRight: "Actual absolute benefit of 6% and excess harm of 8% would round to NNT 17 and NNH 13 and fail the stated harm requirement.", whyNotThisRecord: "Those are the new regimen\'s risks, while the between-group changes are 3% and 5%."}');
 n=n.replace('both advancement labels are plausible under their displayed pairs','the advance and revise labels are each coherent with their displayed pairs');
 s=s.slice(0,a)+n+s.slice(b);
 for(const[x,y]of [
  ['About 56%; obtain contrast CT under the study protocol','56%; CT acquisition'],
  ['About 33%; repeat the CRP assay under the study protocol','33%; repeat CRP assay'],
  ['About 67%; obtain contrast CT under the study protocol','67%; CT acquisition'],
 ])s=replace(s,x,y);return s;
});
console.log('Corrected eight residual advisories with explicit clinical labels and a balanced site/operation set.');
