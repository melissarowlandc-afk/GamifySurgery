import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { ANSWER_CHOICE_TIMING_REGISTRY } from "./answer-choice-timing";
// Scope exact-append assertions to N2; later rewrite projections have their own tests.
import { QUESTION_NEW_N2_PRE_RELEASE,
  QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE as SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { validateSyntheticClinicalRelease } from "./schema";
import { QUESTION_NEW_N1_CASES, QUESTION_NEW_N1_QUESTIONS } from "./question-new-n1-20261104";
import { QUESTION_NEW_N2_AUTHORING_CONCEPTS as concepts, QUESTION_NEW_N2_BATCH_MANIFEST as manifest,
  QUESTION_NEW_N2_CASES as cases, QUESTION_NEW_N2_CASE_REVIEWS as reviews, QUESTION_NEW_N2_CLAIMS as claims,
  QUESTION_NEW_N2_CLAIM_PROVENANCE as provenance, QUESTION_NEW_N2_ITEMS as items, QUESTION_NEW_N2_QUESTIONS as questions,
  QUESTION_NEW_N2_SOURCES as sources, QUESTION_NEW_N2_SOURCE_LINKS as links,
  QUESTION_NEW_N2_STATEMENT_MAPPINGS as mappings, QUESTION_NEW_N2_TIMING_ENTRIES as timings } from "./question-new-n2-20261104";

describe("N2 new independent clinic decision drafts", () => {
  it("appends 39 decision identities while retaining every pre-N2 concept and case, including frozen N1", () => {
    const added = new Set(concepts.map(c=>c.id));
    expect(added.size).toBe(39);
    expect(cases).toHaveLength(39);
    expect(questions).toHaveLength(39);
    expect(QUESTION_NEW_N2_PRE_RELEASE.concepts.some(c=>added.has(c.id))).toBe(false);
    expect(SYNTHETIC_CLINICAL_RELEASE.concepts.filter(c=>!added.has(c.id))).toEqual(QUESTION_NEW_N2_PRE_RELEASE.concepts);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.filter(c=>!c.id.startsWith("case.n2."))).toEqual(QUESTION_NEW_N2_PRE_RELEASE.cases);
    for(const clinicalCase of QUESTION_NEW_N1_CASES)
      expect(SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===clinicalCase.id)).toEqual(clinicalCase);
    expect(QUESTION_NEW_N1_QUESTIONS).toHaveLength(40);
    expect(items.filter(i=>i.level===3)).toHaveLength(15);
    expect(items.filter(i=>i.level===4)).toHaveLength(24);
    expect(()=>validateSyntheticClinicalRelease(SYNTHETIC_CLINICAL_RELEASE)).not.toThrow();
    expect(manifest).toMatchObject({clinicalApproval:false,pipelinePassed:false,publicReleaseAuthorized:false,executableOrdersAdded:false});
  });

  it.each(cases.map((c,i)=>[c.id,c,i] as const))("keeps %s a finite pending-review clinic profile with a complete shuffled task", (_id,clinicalCase,i) => {
    const item=items[i]!,node=clinicalCase.decisionNodes[0]!;
    expect(clinicalCase.decisionNodes).toHaveLength(1);
    expect(clinicalCase).toMatchObject({requiredClinicalSetting:"clinic",requiredCapabilityIds:[],earliestFacilityStage:item.level,tutorialEligible:false,routineEligible:true});
    expect(concepts[i]).toMatchObject({educationalTier:1,acuity:item.acuity,reviewStatus:"needs_clinician_review",lastClinicianReview:null,constructReviewStatus:"pending_independent_novelty_and_overlap_review"});
    expect(questions[i]).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null});
    expect(reviews[i]).toMatchObject({reviewStatus:"needs_clinician_review",educationalTier:1});
    expect(clinicalCase.presentation).toContain("{patientName}");
    expect(clinicalCase.presentation).toContain(`${item.age}-year-old`);
    expect(clinicalCase.prototypeDemographics).toEqual({ageYears:item.age,sexLabel:item.sex});
    expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
    expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
    expect(node.shuffleAnswers).toBe(true);
    expect([3,4]).toContain(node.answerChoices.length);
    expect(node.answerChoices.filter(c=>c.isCorrect)).toHaveLength(1);
    expect(node.answerChoices.every(c=>c.rationale&&c.serviceRequest===null)).toBe(true);
    expect(node.resultGateAfter).toBeNull();
    expect(node.terminalDispositions.every(d=>d.kind==="no_terminal_outcome")).toBe(true);
    expect(node.answerChoices[0]!.label.length).toBeLessThanOrEqual(Math.max(...node.answerChoices.slice(1).map(c=>c.label.length)));
    expect(node.answerChoices.some(c=>/\balone\b|individuali[sz]ed|tailored|management assessment|treatment assessment/i.test(c.label))).toBe(false);
    expect(mappings[i]!.evidenceClaimIds.length).toBeGreaterThan(0);
    expect(item.nearestExistingConceptIds.length).toBeGreaterThan(0);
    expect(item.novelty&&item.inference&&item.closestError&&item.discriminator&&item.counterfactual).toBeTruthy();
    for(const id of item.nearestExistingConceptIds)expect(QUESTION_NEW_N2_PRE_RELEASE.concepts.some(c=>c.id===id),id).toBe(true);
  });

  it("gives exact-label testing estimates using existing profiles without new medical execution", () => {
    const profiles=new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p=>p.id));
    let count=0;
    for(const entry of timings){
      expect(ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>t.caseId===entry.caseId&&t.nodeId===entry.nodeId&&t.questionVariantId===entry.questionVariantId)).toEqual([entry]);
      if(entry.classification.kind!=="test_choices")continue;
      for(const choice of entry.classification.choices)if(choice.timing.kind==="test"){
        expect(profiles.has(choice.timing.timingProfileId),choice.timing.timingProfileId).toBe(true);count++;
      }
    }
    expect(count).toBeGreaterThan(10);
    for(const clinicalCase of cases)for(const choice of clinicalCase.decisionNodes[0]!.answerChoices){
      if(!/\b(?:biopsy|sampling|assays?|serology|capnography|oximetry|manometry|endoscopy|glucose reassessment|pH-impedance monitoring|MRI|MRCP|ERCP)\b/i.test(choice.label))continue;
      const entry=timings.find(t=>t.caseId===clinicalCase.id)!;
      expect(entry.classification.kind,choice.label).toBe("test_choices");
      if(entry.classification.kind==="test_choices")expect(entry.classification.choices.find(c=>c.choiceId===choice.id)?.timing.kind,choice.label).toBe("test");
    }
  });

  it("retains source/check dates, complete provenance and pending review for inherited and derived claims", () => {
    expect(claims).toHaveLength(109);
    expect(sources).toHaveLength(99);
    expect(provenance.filter(p=>!p.statementUnchanged)).toHaveLength(5);
    for(const claim of claims){
      const origin=provenance.find(p=>p.claimId===claim.id)!;
      expect(origin).toBeDefined();
      if(origin.statementUnchanged)expect(claim.lastCheckedOn).toBe(origin.inheritedLastCheckedOn);
      else{
        expect(origin.inheritedLastCheckedOn).toBeNull();
        expect(claim.lastCheckedOn).toBe(origin.checkedLocallyOn);
        expect(origin).toHaveProperty("basisClaimChecks");
      }
      expect(claim).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null});
      expect(claim.limitation).toContain("Offline reuse");
      if(claim.sourceIds.length===1)expect(claim.limitation).toContain("Only one recorded source");
      if(!origin.statementUnchanged){expect(origin).toHaveProperty("basisClaimIds");expect(origin).toHaveProperty("derivation");}
      for(const sourceId of claim.sourceIds)expect(sources.find(s=>s.id===sourceId)?.evidenceClaimIds).toContain(claim.id);
    }
    for(const source of sources){
      for(const key of ["completeCitation","organizationOrJournal","accessedOn","sourceClass","licenseLabel","reuseStatus","reuseNotes","authorityAssessment","usageRole"] as const)
        expect(source[key],`${source.id}/${key}`).toBeTruthy();
      expect(source.officialUrl??source.doi).toBeTruthy();
      expect(source).toMatchObject({reviewStatus:"needs_clinician_review",lastClinicianReview:null});
      expect(source.evidenceClaimIds.some(id=>claims.some(c=>c.id===id))).toBe(true);
    }
    expect(links.every(l=>l.target==="_blank"&&l.rel==="noopener noreferrer")).toBe(true);
  });

  it("checks the independent arithmetic of the constructed evidence exhibits", () => {
    const authored=(slug:string)=>items.find(i=>i.slug===slug)!;
    const table=(slug:string)=>{
      const exhibit=authored(slug).exhibit;
      if(exhibit?.kind!=="table")throw new Error(`Missing constructed table: ${slug}`);
      return exhibit.cells;
    };
    const numbers=(slug:string)=>table(slug).map(row=>row.map(value=>Number(value.replaceAll(",",""))));
    const npv=numbers("negative-predictive-value-denominator");
    const npvLabel=authored("negative-predictive-value-denominator").choices[0].label.match(/^(\d+)\/(\d+)/)!;
    expect(Number(npvLabel[1])).toBe(npv[1]![1]);
    expect(Number(npvLabel[2])).toBe(npv[1]![1]!+npv[0]![1]!);
    const lr=numbers("positive-likelihood-ratio");
    const sensitivity=lr[0]![0]!/(lr[0]![0]!+lr[0]![1]!);
    const falsePositiveRate=lr[1]![0]!/(lr[1]![0]!+lr[1]![1]!);
    expect(Number(authored("positive-likelihood-ratio").choices[0].label)).toBeCloseTo(sensitivity/falsePositiveRate);
    const harm=numbers("number-needed-to-harm");
    expect(parseFloat(authored("number-needed-to-harm").choices[0].label)).toBeCloseTo(1/(harm[0]![0]!/harm[0]![1]!-harm[1]![0]!/harm[1]![1]!));
    const standardized=table("case-mix-standardized-risk").map(row=>row.map(cell=>{
      const [events,total]=cell.split("/").map(Number);return events!/total!;
    }));
    const keyedPercentages=[...authored("case-mix-standardized-risk").choices[0].label.matchAll(/(\d+)%/g)].map(m=>Number(m[1])/100);
    for(const [i,row] of standardized.entries())expect(keyedPercentages[i]).toBeCloseTo(0.5*row[0]!+0.5*row[1]!);
    const pressure=numbers("ventilator-elastic-versus-resistive-load");
    expect(pressure[1]![0]!-pressure[1]![1]!).toBe(pressure[0]![0]!-pressure[0]![1]!);
    expect(pressure[1]![1]).toBeGreaterThan(pressure[0]![1]!);
  });
});
