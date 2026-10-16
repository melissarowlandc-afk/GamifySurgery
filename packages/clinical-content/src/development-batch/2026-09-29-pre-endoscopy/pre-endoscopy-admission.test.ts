import { describe,expect,it } from "vitest";
import { answerChoiceTimingRegistryEntrySchema,syntheticClinicalCaseSchema,testedConceptSchema } from "../../schema";
import { GS028_20260929_AUTHORING_CONCEPTS as concepts,GS028_20260929_TESTED_CONCEPTS as tested,GS028_20260929_QUESTIONS as questions,GS028_20260929_CASES as cases,GS028_20260929_CLAIMS as claims,GS028_20260929_SOURCES as sources,GS028_20260929_TIMING_ENTRIES as timing,GS028_20260929_SERVICE_CONTRACTS as serviceContracts } from "./pre-endoscopy-batch";

describe("GS-028 September 29 pre-Endoscopy batch",()=>{
 it("contains 20 objectives and four substantive variants each",()=>{expect(concepts).toHaveLength(20);expect(questions).toHaveLength(80);for(const c of concepts){const q=questions.filter(x=>x.conceptId===c.id);expect(q).toHaveLength(4);expect(new Set(q.map(x=>x.patientPresentation))).toHaveLength(4);expect(new Set(q.map(x=>x.stem+"|"+x.answerChoices.map(a=>a.label).join("|")))).toHaveLength(4);}});
 it("keeps every objective independently eligible",()=>{for(const c of concepts)expect(cases.some(x=>x.decisionNodes.length===1&&x.decisionNodes[0]?.primaryConceptId===c.id)).toBe(true);});
 it("has exactly one key, randomized answers, coherent profiles, and draft review status",()=>{for(const q of questions){expect(q.answerChoices).toHaveLength(4);expect(q.answerChoices.filter(x=>x.isCorrect)).toHaveLength(1);expect(q.approvedInstantiationProfiles.length).toBeGreaterThan(0);for(const p of q.approvedInstantiationProfiles){expect(p.prototypeDemographics!.ageYears).toBeGreaterThan(17);expect(["Female","Male","Not specified"]).toContain(p.prototypeDemographics!.sexLabel);}expect(q.reviewStatus).toBe("needs_clinician_review");}for(const c of cases)for(const n of c.decisionNodes)expect(n.shuffleAnswers).toBe(true);});
 it("maps every question to claims and every claim bidirectionally to complete sources",()=>{const ci=new Set(claims.map(x=>x.id)),si=new Set(sources.map(x=>x.id));expect(ci.size).toBe(claims.length);expect(si.size).toBe(sources.length);for(const q of questions)for(const id of q.supportingEvidenceClaimIds)expect(ci.has(id)).toBe(true);for(const c of claims)for(const id of c.sourceIds){expect(si.has(id)).toBe(true);expect(sources.find(s=>s.id===id)?.evidenceClaimIds).toContain(c.id);}for(const s of sources){expect(s.completeCitation.length).toBeGreaterThan(30);expect(s.organizationOrJournal.length).toBeGreaterThan(2);expect(s.officialUrl).toMatch(/^https:/);for(const id of s.evidenceClaimIds)expect(ci.has(id)).toBe(true);}});
 it("has one timing entry per question and timed metadata for every service choice",()=>{expect(timing).toHaveLength(80);expect(new Set(timing.map(x=>x.questionVariantId)).size).toBe(80);for(const c of cases)for(const n of c.decisionNodes){const e=timing.find(x=>x.questionVariantId===n.questionVariantId)!;for(const a of n.answerChoices)if(a.serviceRequest){expect(e.classification.kind).toBe("test_choices");if(e.classification.kind==="test_choices")expect(e.classification.choices.find(x=>x.choiceId===a.id)?.timing.kind).toBe("test");}}});
 it("uses only current timing profiles and declared service contracts",()=>{const valid=new Set(["timing.test.ultrasound","timing.test.ct","timing.test.biopsy","timing.test.nuclear_imaging","timing.test.radiography","timing.test.basic_labs","timing.test.breast_imaging_bundle","timing.test.mammography","timing.test.breast_mri"]);const services=new Set(serviceContracts.map(x=>x.serviceId));for(const entry of timing)if(entry.classification.kind==="test_choices")for(const item of entry.classification.choices)if(item.timing.kind==="test")expect(valid.has(item.timing.timingProfileId)).toBe(true);for(const c of cases)for(const n of c.decisionNodes)for(const a of n.answerChoices)if(a.serviceRequest)expect(services.has(a.serviceRequest.serviceId)).toBe(true);});
 it("passes runtime schemas and unique identifier checks",()=>{for(const c of tested)testedConceptSchema.parse(c);for(const c of cases)syntheticClinicalCaseSchema.parse(c);for(const t of timing)answerChoiceTimingRegistryEntrySchema.parse(t);expect(new Set(cases.map(x=>x.id)).size).toBe(cases.length);const nodes=cases.flatMap(x=>x.decisionNodes);expect(new Set(nodes.map(x=>x.id)).size).toBe(nodes.length);expect(new Set(questions.map(x=>x.id)).size).toBe(questions.length);});
 it("keeps final nodes free of inert result gates",()=>{for(const c of cases){const n=c.decisionNodes.at(-1);expect(n?.resultGateAfter).toBeNull();}});
 it("anchors every case to the named patient's story",()=>{const cue=/\b(?:asks?|wants?|requests?|reports?|returns?|arrives?|noticed|notes?|describes?|is seen|comes?|brings?|discuss|reviews?|reviewing|considering|counseled|diagnosed|shows?|discovered|identifies|referred|confirming|evaluated|found|undergoing|preparing|presents?|has|had|develops?|confirms|completed|seeks)\b/i;expect(cases.filter(x=>!cue.test(x.presentation)).map(x=>x.id)).toEqual([]);});
 it("does not reveal the key by making it uniquely longest",()=>{const bad=questions.flatMap(q=>{const key=q.answerChoices.find(x=>x.isCorrect)!;const wrong=q.answerChoices.filter(x=>!x.isCorrect);return key.label.length>Math.max(...wrong.map(x=>x.label.length))?[{id:q.id,key:key.label,wrong:wrong.map(x=>x.label)}]:[];});expect(bad).toEqual([]);});
 it("stays in the clinic release before Endoscopy",()=>{for(const c of cases){expect(c.releasePointId).toBe("release.l0.clinic_evaluation");expect(c.earliestFacilityStage).toBeLessThanOrEqual(2);}});
});

















































