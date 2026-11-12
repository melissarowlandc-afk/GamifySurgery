import fs from "node:fs";
import assert from "node:assert/strict";
import {buildReview} from "./review-adversarial-r7-20261102.mjs";
const b=await buildReview();
const dispositions={
 B03:["revised_returned_precursor","B03-context now corrects a limited reserve/outflow report. Its feedback names neither achalasia, distal spasm, opioids nor myotomy; the later classification/medication decision still needs its own record."],
 B11:["frozen_pass_precursor","B11-context is now PASS and must remain exact. Its mapped-specimen teaching remains visible. It does not supply the later sentinel-node/reconstruction sequence; no fresh sequence rating is inferred."],
 B12:["revised_returned_precursor","B12-context now concerns specimen provenance and the appropriate pathology-review request. It does not discuss tissue-positive regional nodes, distant staging or multidisciplinary sequencing."],
 B17:["revised_returned_precursor","B17-context supplies the missing dermal negative and selects primary diagnostic extent. Its feedback contains no sentinel-node/reconstruction timing instruction. The later completed invasion-depth/graft record remains necessary."],
 B18:["revised_returned_precursor_partial_topic_overlap","B18-context concerns whether existing partial-depth evidence supports a discussion, not a nodal procedure. The later PASS question has an abnormal node and a nonrepresentative aspirate; those current findings still decide targeted core versus occult staging. Prior discussion eligibility is visible topic overlap and must not be called a fresh unscaffolded nodal-eligibility assessment."],
 B19:["scaffold_removed_in_returned_precursor","B19-context now asks about acquisition comparability; all target/tract, rectus/adductor and core/open teaching is removed from its scored task, options and feedback. Later A/B labels first appear in the unchanged completed MRI report. The earlier question no longer rehearses the later tract rule."],
 B21:["frozen_pass_precursor_residual_caveat","B21-context is PASS and is frozen by the round-seven instruction. Its existing authoring phrase 'passed management premise' remains a recorded learner-text defect. No returned item can remove that phrase without editing a PASS version; manager direction would be required for a later correction. Do not imply that this round fixed it."],
 B22:["frozen_pass_precursor_residual_scaffold","B22-context is PASS and is frozen. Its existing caution against repeat sampling partially scaffolds B22's repeat-endoscopy alternative. Preserve it exactly and carry the reviewer's limitation; do not claim an independent repeat-biopsy assessment or new difficulty finding."],
};
const rows=Object.entries(dispositions).map(([id,[status,response]])=>{
 const p=b.all.find(p=>p.id===id);assert(p.pipelinePassed);
 return {id,status,response,questionVersionUnchanged:p.after.variantId,beforeVisibleHistory:p.visibleHistory.before,afterVisibleHistory:p.visibleHistory.after,
  earlierItemIds:b.all.filter(x=>x.caseId===p.caseId&&x.id!==id).map(x=>({id:x.id,returnedInThisRound:!x.pipelinePassed,variantId:x.after.variantId})),
  clinicalApprovalConferred:false,freshDifficultyAssessment:false};
});
const mr=b.all.find(p=>p.id==="B19-context");const projection=JSON.stringify([mr.after,mr.rationalePairs.after]);
assert(!/rectus|adductor|compartment|core biopsy|incisional|path A|path B/i.test(projection));
const result={checkedOn:"2026-11-03",scope:"All eight changed-preceding-feedback flags from review six, inspected in actual node order. PASS clinical fields remain exact; residual frozen-feedback limits are explicit rather than silently repaired.",rows};
fs.writeFileSync("tools/question-quality/adversarial-r7-sequence-audit-20261102.json",JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({sequences:rows.length,returnedPrecursors:rows.filter(r=>r.status.startsWith("revised")||r.status.startsWith("scaffold")).length,residualFrozenCaveats:["B21","B22"],B19TractScaffoldRemoved:true}));
