import fs from 'node:fs';import assert from 'node:assert/strict';
const base='packages/clinical-content/src/question-new-n2-round3-';
const changes={
 perioperative:[
 ['"Titrated continuous naloxone infusion"','"Naloxone maintenance infusion"'],
 ['"Combined oral-nasal capnography with synchronized respiratory observation"','"Combined oral-nasal expired-gas waveform recording"'],
 ['"timing.test.basic_labs"','"timing.test.physiology"'],
 ['"Allow succinylcholine recovery"','"Await spontaneous depolarizing-block recovery"'],
 ['"Repeat rocuronium reversal with sugammadex"','"Give additional sugammadex for residual rocuronium"'],
 ['"Treat residual nondepolarizing block with neostigmine"','"Give neostigmine for persistent nondepolarizing block"'],
 ['"Defer volume escalation; the static pressure burden persists"','"Defer volume escalation; the static load persists"'],
 ['"Proceed with volume escalation; total mechanical loading has recovered"','"Proceed with volume escalation; static loading has recovered"'],
 ['"Target airway resistance; the entire rise was flow dependent"','"Target airway resistance; the pressure rise was flow dependent"'],
 ['"Cancel order A and retain order B"','"Stop therapeutic heparin; continue prophylactic enoxaparin"'],
 ['"Retain order A and cancel order B"','"Continue therapeutic heparin; cancel prophylactic enoxaparin"'],
 ['"Cancel order A and cancel order B"','"Defer both heparin prescriptions during initial warfarin resumption"'],
 ['The atrial-fibrillation interruption does not establish routine therapeutic bridging, while the major cancer operation supplies a separate prophylaxis indication.','Routine full-intensity bridging is not established by this history, whereas the cancer operation supplies a different preventive indication.'],
 ['Three equally terse order reconciliations','Three parallel order reconciliations'],
 ['The key is shorter than both bolus alternatives','The maintenance-infusion label is shorter than both bolus alternatives'],
 ],
 nutrition:[
 ['"Reduce combined carbohydrate delivery with electrolyte replacement"','"Reduce intravenous and enteral carbohydrate"'],
 ['"Reduce formula delivery with unchanged intravenous dextrose"','"Maintain intravenous and restrict enteral carbohydrate"'],
 ['"Replace formula calories with matched parenteral carbohydrate"','"Exchange enteral for equivalent parenteral carbohydrate"'],
 ['"Same-volume protein-enriched substitution"','"Repeat extra-volume trial"'],
 ['"Not yet prescribed","The dietitian has prepared an equal-energy, equal-volume substitution using a protein-enriched formula"','"Another added drink displaces the later meal again","Net daily protein delivery remains below the assessed goal"'],
 ['"Substitute the equal-energy protein-enriched formula"','"Use an isocaloric protein-dense formula"'],
 ['A prepared option is not permission or sole availability; the completed extra-volume trial supplies its competing consequence.','No proposed option is described as prepared or uniquely available; repeated extra-volume trials show their net dietary consequence.'],
 ],
 abdominal:[
 ['"Image-guided catheter drainage of the pelvic cavity"','"Image-guided percutaneous catheter drainage"'],
 ['"Extend the skin incision and drain through the wound"','"Extended incisional drainage through the skin wound"'],
 ['"Operative abdominal washout with anastomotic assessment"','"Operative abdominal drainage with anastomotic assessment"'],
 ['"Pancreatic magnetic resonance imaging with MRCP for lesion characterization"','"Magnetic resonance cholangiopancreatography for cyst characterization"'],
 ['"Before the pancreatitis episode"','"Prior imaging"'],
 ['A existed before the pancreatitis and cannot be assigned a post-inflammatory drainage pathway from that episode; characterize the cyst and its duct relationship before puncture planning.','Its presence years earlier prevents assigning a new inflammatory drainage pathway from the recent episode; define its identity and duct relation before planning puncture.'],
 ['the planned graded course ended after that session','the endoscopist ended that session'],
 ['"Place a temporary endoscopic luminal stent"','"Balloon expansion followed by a temporary luminal stent"'],
 ['"Repeat therapeutic upper endoscopy"','"Repeat endoscopic ulcer hemostasis"'],
 ['"Tailored lateral internal sphincterotomy"','"Lateral internal sphincterotomy"'],
 ['"Repeat manometry after supervised oxycodone adjustment"','"Supervised oxycodone adjustment with repeat manometry"'],
 ],
 specialty:[
 ['Continuous sedation was unchanged across the two examinations, and no induction or sedative bolus intervened.','The administration chart records the same sedative infusion at both examinations; the last induction or sedative bolus preceded the first examination.'],
 ['"Supervised sedative interruption with repeat motor examination"','"Contrast-enhanced brain magnetic resonance imaging"'],
 ['Sedation can confound an examination, but an unchanged exposure with preserved contralateral commands does not explain away this new focal change or justify delaying structural assessment.','Magnetic resonance imaging can clarify selected neurologic findings, but noncontrast CT is the appropriate first structural study for this new acute traumatic change.'],
 ['A symmetric global decline temporally related to sedation without focal findings could make medication reassessment the relevant first discriminating assessment.','Persistent unexplained or subacute neurologic findings after the appropriate initial assessment can require magnetic resonance characterization.'],
 ['"Reconsider airway permission now with the patient and document new limits"','"Reconsider airway permission now with the patient and revise the orders"'],
 ['"Which definitive coverage best fits','"Which coverage procedure best fits'],
 ['"Split-thickness skin graft"','"Coverage using a split-thickness skin graft"'],
 ['"Pedicled local muscle flap with skin coverage"','"Coverage using a pedicled local muscle flap"'],
 ['"Free anterolateral-thigh flap with vascular anastomosis"','"Coverage using a free anterolateral-thigh flap"'],
 ['"Arterial and venous pedicle signals recorded"','"Arterial and venous signals recorded"'],
 ["Reconstruct both periods' classes from the operative findings",'Reconstruct both periods from the original surgical reports'],
 ["Reconstruct both periods' classes from the readmission findings",'Reconstruct both periods from later readmission reports'],
 ['Both stored samples below are sufficient for further testing. The original functional experiment did not identify individual antigen targets.','The stored samples and corresponding functional results are recorded below.'],
 ['"Single-antigen bead antibody assay on preimplantation serum"','"Preimplantation serum with single-antigen bead antibody assay"'],
 ['"Single-antigen bead antibody assay on post-treatment serum"','"Post-treatment serum with single-antigen bead antibody assay"'],
 ['"Flow-cytometric donor-cell crossmatch on preimplantation serum"','"Preimplantation serum with flow-cytometric donor-cell crossmatch"'],
 ['"Flow-cytometric donor-cell crossmatch on post-treatment serum"','"Post-treatment serum with flow-cytometric donor-cell crossmatch"'],
 ['"timing.test.genetic"','"timing.test.advanced_diagnostic"'],
 ],
};
for(const [name,rows]of Object.entries(changes)){
 const p=base+name+'.ts';let s=fs.readFileSync(p,'utf8');for(const [old,next]of rows){assert.ok(s.includes(old),`${name}: missing ${old}`);s=s.replaceAll(old,next);}fs.writeFileSync(p,s);
}
// Use three independently derived numerical errors instead of a token-dense
// matrix with a repeated value that visually collapses its distinct quantities.
const p=base+'research.ts';let s=fs.readFileSync(p,'utf8');
const start=s.indexOf(' c("regimen-infection"'),end=s.indexOf('\n ],',start);assert.ok(start>0&&end>start);
s=s.slice(0,start)+` c("regimen-risks","NNT 17 with NNH 13: revise","These invert the new regimen's 6% infection and 8% rash risks rather than the two between-group differences.","Actual absolute benefit of 6% and excess harm of 8% would yield this pair and fail the fictional harm criterion."),`+s.slice(end);
s=s.replace('"NNT 34 with NNH 34: advance"','"NNT 12 with NNH 34: advance"')
 .replace("This calculates benefit correctly but substitutes the comparator's rash risk for added harm.","This inverts the comparator's infection and rash risks rather than the two between-group differences.")
 .replace('An actual excess rash risk of 0.03 with the same benefit would give NNH 34 and meet this fictional progression rule.','Actual absolute infection reduction of 9% and excess rash risk of 3% would produce this pair and meet the fictional rule.')
 .replace('Completed a balanced four-option matrix: each NNT and each NNH/decision component appears twice. The key cannot be assembled from majority components; labels have the same grammar, length and detail.','Three distinct numerical pairs derive from absolute effects, comparator risks or regimen risks. No numerical component repeats across pairs; the twice-occurring revision action cannot assemble a result. Labels retain the same grammar and detail.')
 .replace('Four calculated benefit/harm results with the decision consistently derived from each stated pair.','Three calculated benefit/harm results with the decision consistently derived from each stated pair.')
 .replace('Replaced the three-choice NNT/decision convergence with a full balanced matrix and rechecked component counts.','Replaced repeated NNT components with three distinct complete numerical pairs; rechecked that no repeated quantity assembles the key.');
fs.writeFileSync(p,s);console.log('Applied item-specific cue repairs without suppressions or linter edits.');
