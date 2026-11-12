import {beforeN4AcceptanceRelease} from "./question-n4-acceptance-test-support";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {SYNTHETIC_CLINICAL_RELEASE as actualLive,QUESTION_CATALOG_RELEASE as catalog} from "./synthetic-content";
import {QUESTION_SHIP_MANIFEST as manifest} from "./question-ship-manifest";
import {ANSWER_CHOICE_TIMING_REGISTRY as timing} from "./answer-choice-timing";
import {QUESTION_HARDEN1_SOURCE_RELEASE as first} from "./question-harden1-20261110";
import {QUESTION_HARDEN1_ROUND2_CASES as cases,QUESTION_HARDEN1_ROUND2_SOURCE_RELEASE as preview,
 QUESTION_HARDEN1_ROUND2_QUESTION as q,QUESTION_HARDEN1_ROUND2_CONCEPT as concept,
 QUESTION_HARDEN1_ROUND2_CLAIMS as claims,QUESTION_HARDEN1_ROUND2_BASIS_CLAIMS as basis,
 QUESTION_HARDEN1_ROUND2_SOURCES as sources,QUESTION_HARDEN1_ROUND2_SOURCE_LINKS as links,
 QUESTION_HARDEN1_ROUND2_TIMING_ENTRIES as estimates,QUESTION_HARDEN1_ROUND2_REVIEWS as reviews} from "./question-harden1-round2-20261110";
const live=beforeN4AcceptanceRelease(actualLive);
const read=(path:string)=>JSON.parse(readFileSync(new URL("../../../"+path,import.meta.url),"utf8"));
const digest=(x:unknown)=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const packet=read("docs/research/question-harden1-round2-20261110.json");
const lint=read("tools/question-quality/question-harden1-round2-lint-20261110.json");
const intake=read("tools/question-quality/fixtures/question-harden1-before-20261110.json");
describe("harden1 hernia round2 isolated application preview",()=>{
 it("keeps accepted live pair and all reviewed first-round clinical definitions exact",()=>{
  expect(digest(first)).toBe("d7b5a4751ac104d5ed6fa26307295bd86faf0a0a37d6cf2de2758d28a3a6c36b");
  expect(digest(live.cases.find(c=>c.id===intake.targets[0].clinicalCase.id))).toBe(digest(intake.targets[0].clinicalCase));
  expect(digest(live)).toBe("01d239ea464a3cbdffd345b107a4035576922a4b143ea57f5c49f0752123ebf4");
  for(const release of [live,catalog]){
   expect(release.cases.some(c=>c.id===cases[0]!.id)).toBe(false);
   expect(release.concepts.some(c=>c.id===concept.id)).toBe(false);
  }
  expect(manifest.accepted.some(r=>r.questionVariantId===q.id)).toBe(false);
  expect(timing.some(t=>t.questionVariantId===q.id)).toBe(false);
 });
 it("provides one separately scored version and preserves its prior meanings without FSRS migration",()=>{
  expect(cases).toHaveLength(1);expect(cases[0]!.decisionNodes).toHaveLength(1);
  expect(concept.id).toBe("concept.groin-hernia.femoral-defect-repair-priority.v3");
  expect(preview.concepts.some(c=>c.id==="concept.groin-hernia.femoral-defect-repair-priority.v2")).toBe(true);
  expect(preview.concepts.some(c=>c.id==="concept.groin-hernia.femoral-defect-repair-priority.v1")).toBe(true);
  expect(q.reviewStatus).toBe("needs_clinician_review");expect(q.lastClinicianReview).toBeNull();
  expect(reviews[0]).toMatchObject({reviewStatus:"needs_clinician_review",acuity:"routine",lastClinicianReview:null});
 });
 it("makes the marked compartment and observation decision explicit without naming the diagnosis in findings",()=>{
  const cs=cases[0]!,n=cs.decisionNodes[0]!;
  expect(cs.chiefComplaint).toBeTruthy();expect(cs.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
  expect(cs.prototypeDemographics).toEqual({ageYears:59,sexLabel:"Male"});
  expect(n.shuffleAnswers).toBe(true);expect(n.stem).toContain("marked lump");expect(n.stem).toContain("watchful waiting");
  expect(q.exhibit?.kind).toBe("keyValue");
  if(q.exhibit?.kind!=="keyValue")throw new Error("Missing raw findings");
  expect(q.exhibit.items.map(i=>i.label)).toEqual(["At the skin marker","Separate cranial finding"]);
  const visible=JSON.stringify({presentation:cs.presentation,exhibit:q.exhibit});
  expect(visible).not.toMatch(/femoral hernia|direct inguinal|failed reduction|compression|no mural signal|caregiving|preserve tissue/i);
  expect(n.resultGateAfter).toBeNull();expect(n.answerChoices.every(a=>a.serviceRequest===null)).toBe(true);
  expect(estimates).toEqual([{caseId:cs.id,nodeId:n.id,questionVariantId:q.id,classification:{kind:"no_test"}}]);
 });
 it("uses a complete balanced same-category option set rather than a uniquely cautious key",()=>{
  expect(q.answerChoices).toHaveLength(4);expect(q.answerChoices.filter(a=>a.isCorrect)).toHaveLength(1);
  const pairs=q.answerChoices.map(a=>a.label.split("; "));
  expect(new Set(pairs.map(p=>p.join("; "))).size).toBe(4);
  for(const diagnosis of ["Femoral hernia","Direct inguinal hernia"])expect(pairs.filter(p=>p[0]===diagnosis)).toHaveLength(2);
  for(const judgment of ["watchful waiting is unsuitable","watchful waiting is reasonable"])expect(pairs.filter(p=>p[1]===judgment)).toHaveLength(2);
 });
 it("maps every teaching fact to a recorded atomic basis and retains genuine source-access metadata",()=>{
  expect(claims.map(c=>c.id)).toEqual(q.supportingEvidenceClaimIds);
  for(const c of claims){expect(c.reviewStatus).toBe("needs_clinician_review");expect(c.sourceIds.length).toBeGreaterThan(0);
   for(const id of c.basisClaimIds)expect(basis.some(b=>b.id===id)).toBe(true);
   for(const id of c.sourceIds)expect(sources.find(s=>s.id===id)!.evidenceClaimIds).toContain(c.id);
  }
  for(const s of sources){const original=intake.sources.find((x:{id:string})=>x.id===s.id);
   expect(s.accessedOn).toBe(original.accessedOn);expect(s.licenseLabel).toBe(original.licenseLabel);
   for(const field of ["completeCitation","organizationOrJournal","officialUrl","sourceClass","reuseStatus"])expect(s[field]).toBeTruthy();
  }
  expect(links.every(l=>l.target==="_blank"&&l.rel==="noopener noreferrer")).toBe(true);
 });
 it("regenerates two clearly duplicated provenance rows with all review notes and unsuppressed lint",()=>{
  expect(packet.map((p:{id:string})=>p.id)).toEqual(["H1-01","H1-02"]);
  expect(packet[0].after).toEqual(packet[1].after);expect(packet[1].afterDuplicateForProvenance).toBe(true);
  for(const row of packet){expect(row.pipelinePassed).toBe(false);expect(row.acceptanceAllowed).toBe(false);
   expect(row.keyOrderNotice).toContain("key shown first for review only");expect(row.after.Options[0]).toMatch(/^\*\*KEY:\*\* /);
   expect(row.reviewResponse).toHaveLength(5);expect(row.selfCheck.counterfactuals).toHaveLength(3);
   expect(row.frozenPreservation.sourceReleaseSha256).toBe(digest(preview));expect(row.holdStatus).toBe("none");
  }
  expect(lint.uniqueCandidates).toBe(1);expect(lint.suppressedFindings).toBe(0);
  expect(lint.after.totals.findings).toBe(1);expect(lint.after.variants[0].findings.map((f:{rule:string})=>f.rule)).toEqual(["convergence"]);
 });
});
