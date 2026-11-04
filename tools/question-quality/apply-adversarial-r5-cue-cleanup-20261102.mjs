// Apply after the ongoing first validation run has finished. Only the 26
// returned specifications change; no independently passed clinical version.
import fs from "node:fs";
import assert from "node:assert/strict";
import {entry,specs} from "./adversarial-r5-specs-20261102.mjs";
const touch=id=>{assert.equal(entry.review.find(r=>r.id===id).verdict,"REVISE");return specs.get(id);};
assert(specs.get("B11-context").task.includes("diagnostic"),"Cue cleanup already applied");
for(const id of ["B11-context","B12-context","B17-context","B18-context"]){
 const s=touch(id);s.task="Which specimen plan should be arranged next for {patientName}'s residual lesion?";
 s.options[0][0]="Full-thickness excisional biopsy";
 s.attack+=" The neutral specimen task and option wording remove the key-only 'diagnostic' echo found during the final packet audit.";
 s.responses.suggestions[0]+=" The task/key-only diagnostic-word match is also removed.";
}
for(const id of ["B05","B07"]){
 const s=touch(id);s.options[0][0]="Standing dynamic ultrasound of the groin";
 s.options[1][0]=id==="B05"?"Routine supine MRI of the groin and hip":"Routine supine MRI of the groin and adductors";
 s.options[2][0]="Contrast CT of the groin and pelvis at rest";
 s.attack+=" All imaging labels name the groin, so the region word cannot uniquely match the key. The actual prior ultrasound history remains decision-critical.";
 s.responses.suggestions[1]+=" Every offered protocol names the groin; a repeated region word no longer selects one option.";
}
touch("B02-context").options[0][0]="Single wet swallows after baseline recovery";
const b6=touch("B06-context");b6.options[0][0]="Adductor rehabilitation; hernia observation";b6.options[2][0]="Elective hernia repair before adductor rehabilitation";
b6.attack+=" The operative sequence also names adductor rehabilitation, preventing that body term from matching only the key.";
const b8=touch("B08-context");b8.options[2][0]="Elective hernia repair before abdominal rehabilitation";
b8.attack+=" The operative sequence also names abdominal rehabilitation; the attachment term is not a key-only word match.";
const b24=touch("B24");b24.options[0][0]="Clonal B-cell infiltrate; assess cytology and architecture";
b24.options[1][0]="Clonal B-cell infiltrate, MALT type; assess large-cell component";
b24.options[2][0]="Clonal B-cell infiltrate, reactive type; assess Helicobacter activity";
b24.attack+=" Every interpretation shares 'Clonal B-cell infiltrate'; the repeated stem phrase cannot identify the key. The distinction is what additional classification the current morphology supports.";
b24.responses.cues[0]+=" All three interpretations now share the observed clonal B-cell finding, removing the unique stem/key phrase.";
const b36=touch("B36");b36.options[0][0]="Form workflow versus prefilled fields";
b36.options[1][0]="Form workflow versus a reconciliation checklist";
b36.options[2][0]="Form workflow versus reordered review items";
b36.attack+=" Every option uses the form-workflow baseline and none uniquely repeats 'form entry'. The workload values must select the component.";
b36.responses.cues[2]+=" A common form-workflow prefix removes key-only 'form' and 'form entry' matching.";
const p="tools/question-quality/adversarial-r5-specs-20261102.mjs",text=fs.readFileSync(p,"utf8"),a=text.indexOf("export const specs=new Map("),b=text.indexOf("\n\nexport function validateSpecs",a);
assert(a>0&&b>a);fs.writeFileSync(p,text.slice(0,a)+"export const specs=new Map("+JSON.stringify([...specs],null,2)+");"+text.slice(b));
console.log(JSON.stringify({returnedOnly:true,clinicalSourceNotGenerated:true,reason:"Remove lead-in/key echoes and shared-case word-matching shortcuts before final validation"}));
