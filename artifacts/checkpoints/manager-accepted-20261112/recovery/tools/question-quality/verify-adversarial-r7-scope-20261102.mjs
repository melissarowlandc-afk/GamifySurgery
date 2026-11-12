import fs from "node:fs";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import "../economy-audit/source-loader.mjs";
const entry=JSON.parse(fs.readFileSync("tools/question-quality/fixtures/adversarial-r7-before-20261102.json","utf8"));
const hash=s=>createHash("sha256").update(s).digest("hex"),read=p=>fs.readFileSync(p,"utf8"),results=[];
function check(path,restore){const current=read(path),restored=restore(current);assert.equal(restored,entry.files[path].text,path+" unrelated source drift");results.push({path,entryHash:entry.files[path].sha256,currentHash:hash(current),restoredExactly:true});}
check("packages/clinical-content/src/index.ts",s=>s.replace('export * from "./question-quality-adversarial-r7-20261102";\n',""));
check("packages/clinical-content/src/synthetic-content.ts",s=>s
 .replace('import { applyQuestionQualityAdversarialR7Revisions, QUESTION_QUALITY_ADVERSARIAL_R7_TESTED_CONCEPTS } from "./question-quality-adversarial-r7-20261102";\n',"")
 .replace(/\nexport const SYNTHETIC_CLINICAL_RELEASE = validateSyntheticClinicalRelease\(\{\n  \.\.\.QUESTION_QUALITY_PRE_ADVERSARIAL_R7_RELEASE,[\s\S]*?\n\}\);\n/,"")
 .replace("export const QUESTION_QUALITY_PRE_ADVERSARIAL_R7_RELEASE =","export const SYNTHETIC_CLINICAL_RELEASE ="));
check("packages/clinical-content/src/answer-choice-timing.ts",s=>s
 .replace('import { QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS } from "./question-quality-adversarial-r7-20261102";\n',"")
 .replace(/^export const QUESTION_QUALITY_(?:PRE_)?ADVERSARIAL_R7_TIMING_ENTRIES[^\n]*\n/gm,"")
 .replace("[...QUESTION_QUALITY_PRE_ADVERSARIAL_R7_TIMING_ENTRIES, ...QUESTION_QUALITY_ADVERSARIAL_R7_TIMING_ENTRIES].map","[...QUESTION_QUALITY_PRE_ADVERSARIAL_R6_TIMING_ENTRIES, ...QUESTION_QUALITY_ADVERSARIAL_R6_TIMING_ENTRIES].map"));
check("packages/clinical-content/src/question-quality-adversarial-20261102.ts",s=>s
 .replace('import { QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS } from "./question-quality-adversarial-r7-20261102";\n',"")
 .replace(/export const QUESTION_QUALITY_CURRENT_REVISIONS = \[\.\.\.new Map\(\n  \[\.\.\.QUESTION_QUALITY_PRE_ADVERSARIAL_R7_REVISIONS,[\s\S]*?\n\)\.values\(\)\];\n/,"")
 .replace("export const QUESTION_QUALITY_PRE_ADVERSARIAL_R7_REVISIONS =","export const QUESTION_QUALITY_CURRENT_REVISIONS ="));
check("packages/clinical-content/src/question-quality-adversarial-r6.test.ts",s=>s
 .replace("QUESTION_QUALITY_PRE_ADVERSARIAL_R7_RELEASE as live,","SYNTHETIC_CLINICAL_RELEASE as live,")
 .replace("QUESTION_QUALITY_PRE_ADVERSARIAL_R7_REVISIONS as current,","QUESTION_QUALITY_CURRENT_REVISIONS as current,")
 .replace("QUESTION_QUALITY_PRE_ADVERSARIAL_R7_TIMING_ENTRIES as timings,","ANSWER_CHOICE_TIMING_REGISTRY as timings,"));
check("packages/clinical-content/src/answer-choice-timing.test.ts",s=>s
 .replace(", QUESTION_QUALITY_ADVERSARIAL_R7_TIMING_ENTRIES }"," }")
 .replace(" + QUESTION_QUALITY_ADVERSARIAL_R7_TIMING_ENTRIES.length", ""));
check("packages/game-domain/tests/test-choice-order-inventory.test.ts",s=>s
 .replace(" QUESTION_QUALITY_PRE_ADVERSARIAL_R7_RELEASE,","")
 .replace(" QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS,","")
 .replace("...QUESTION_QUALITY_PRE_ADVERSARIAL_R7_RELEASE.cases, ","")
 .replace(", ...QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS].map", "].map")
 .replace("toHaveLength(1467)","toHaveLength(1469)"));
check("packages/game-domain/tests/approved-clinical-admission.test.ts",s=>s
 .replace("QUESTION_QUALITY_ADVERSARIAL_R7_TESTED_CONCEPTS, ","")
 .replace("      ...QUESTION_QUALITY_ADVERSARIAL_R7_TESTED_CONCEPTS.map(concept => concept.id),\n",""));
check("packages/game-domain/tests/surgery-center-batch.test.ts",s=>s.replace('    // Round seven retains old histories and scores the revised paired objectives.\n    expected.delete("concept.inguinal-hernia.symptomatic-elective-repair.v2");\n    expected.add("concept.inguinal-hernia.symptomatic-elective-repair.v3");\n    expected.add("concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v4");\n    expected.add("concept.pigmented-skin-lesion.partial-depth-nodal-planning.v1");\n',""));
check("packages/game-domain/src/test-choice-orders.ts",s=>s);
const c=await import("../../packages/clinical-content/src/index.ts");
const old=c.QUESTION_QUALITY_PRE_ADVERSARIAL_R7_RELEASE,now=c.SYNTHETIC_CLINICAL_RELEASE;
assert.equal(now.cases.length,old.cases.length);
for(const cs of old.cases){const after=now.cases.find(a=>a.id===cs.id);assert(after,cs.id);assert.equal(after.decisionNodes.length,cs.decisionNodes.length,cs.id+" node count");}
const result={checkedOn:"2026-11-03",status:"passed",scope:"Read-only exact source restoration after removing only the listed round-seven hooks/expectations, unchanged exact order registry, and per-case node-count preservation. No Git, revert, reset or source write.",results,caseIdsAndNodeCountsPreserved:now.cases.length};
fs.writeFileSync("tools/question-quality/adversarial-r7-scoped-diff-20261102.json",JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify({status:result.status,exactSourceReconstructions:results.length,casesWithSameNodeCount:now.cases.length}));
