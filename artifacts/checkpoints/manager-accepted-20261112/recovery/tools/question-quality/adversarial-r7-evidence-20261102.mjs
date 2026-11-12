import fs from "node:fs";
import assert from "node:assert/strict";
import {entry} from "./adversarial-r7-specs-20261102.mjs";
const draft={contentVersion:"evidence.question-quality.2026-11-02.v10",reviewStatus:"needs_clinician_review",aiAssistedDrafting:true,lastClinicianReview:null};
const claims=[
 {id:"claim.qq20261102f.integrated-partial-depth-planning",statement:"A smaller invasive-depth measurement from a different partial specimen does not erase a greater valid demonstrated invasive extent; an incomplete whole-lesion maximum can still have a known lower bound relevant to a supported planning discussion.",sourceIds:["source.qq20261102f.esmo2025","source.qq20261102f.nci-melanoma"],evidenceCategory:"evaluation",certainty:"moderate",limitation:"Original cross-specimen application of previously verified full-thickness sampling and maximum-depth reporting guidance, not a separately retrieved specimen-integration rule. Dermatopathology must confirm validity and mapping. The 1.8-mm value is retained from this case's existing completed-primary record and 0.6 mm from its existing partial report; their new constructed placement is not a management cutoff. The actual greater-than-1-mm nodal-discussion boundary is separately mapped to existing claim.qq20261102a.melanoma-integrated-node-staging."},
 {id:"claim.qq20261102f.mri-comparable-contrast-acquisition",statement:"Assessment of contrast-related signal change in an intrinsically bright soft-tissue mass region requires accounting for acquisition settings; a pre/post comparison that also changes suppression cannot simply assign all signal differences to enhancement.",sourceIds:["source.qq20261102f.essr2023"],evidenceCategory:"evaluation",certainty:"moderate",limitation:"Technical application of previously verified primary MRI characterization/contrast-targeting guidance, reused offline. Only one adequate medical primary consensus source is mapped; no new direct verification of the exact constructed sequence pair occurred. MSK radiology must confirm this comparison and its priority. No universal sequence mandate, contrast dose, numerical enhancement criterion, tract or histologic diagnosis is inferred."},
].map(c=>({...draft,...c,applicablePopulation:"The identified named synthetic adult teaching cases; measurements and acquisition observations are constructed, not empirical patient/gameplay data.",lastCheckedOn:"2026-11-03"}));
const sources=[
 ["source.qq20261102e.esmo2025","source.qq20261102f.esmo2025"],
 ["source.qq20261102e.nci-melanoma","source.qq20261102f.nci-melanoma"],
 ["source.qq20261102c.essr2023","source.qq20261102f.essr2023"],
].map(([from,id])=>{
 const old=entry.sources.find(s=>s.id===from);assert(old,from);
 return {...old,...draft,id,authorityAssessment:old.authorityAssessment+" Round seven retains the original publication, rights and access date for offline use. This new mapping ID is neither a fresh source retrieval nor independent corroboration; the technical/cross-specimen application remains clinician review.",evidenceClaimIds:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id)};
});
const text='import type {EvidenceClaim, AuthoredClinicalRecord} from "./pilot-schema";\n\n/** Original limited synthesis; prior primary-source checks reused offline. */\nexport const QUESTION_QUALITY_ADVERSARIAL_R7_CLAIMS: (EvidenceClaim & AuthoredClinicalRecord)[] = '+JSON.stringify(claims,null,2)+';\n\nexport const QUESTION_QUALITY_ADVERSARIAL_R7_SOURCES = '+JSON.stringify(sources,null,2)+';\n';
const path="packages/clinical-content/src/question-quality-adversarial-r7-evidence-20261102.ts";
if(process.argv.includes("--check"))assert.equal(fs.readFileSync(path,"utf8"),text);else fs.writeFileSync(path,text);
console.log(JSON.stringify({claims:claims.length,sources:sources.length,freshRetrieval:false}));
