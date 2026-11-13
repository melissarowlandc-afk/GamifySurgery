import {QUESTION_PROGRAM_BATCH7_ACCEPTED_SOURCE_VIEWS} from "./question-program-batch7-accepted-20261112";
import {QUESTION_PROGRAM_BATCH4_ACCEPTED_SOURCE_VIEWS,QUESTION_PROGRAM_BATCH4_FROZEN_PRESERVATION} from "./question-program-batch4-accepted-20261111";
import {createHash} from "node:crypto";
import { describe, expect, it } from "vitest";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import {QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE} from "./question-stats1-accepted-20261108";
import {QUESTION_PROGRAM_BATCH3_ACCEPTED_SOURCE_VIEWS} from "./question-program-batch3-accepted-20261111";
import type {SyntheticClinicalCase} from "./schema";

// The owner-approved non-clinical statistics style retains exact reviewed
// presentation-only staff profiles. They never introduce patient demographics.
// Every other staff discussion keeps the original no-profile assertion.
function expectStaffProfiles(clinicalCase:SyntheticClinicalCase):void {
 const exact=[...Object.values(QUESTION_PROGRAM_BATCH7_ACCEPTED_SOURCE_VIEWS).flatMap(view=>view.cases),...QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE.cases,...Object.values(QUESTION_PROGRAM_BATCH4_ACCEPTED_SOURCE_VIEWS).flatMap(view=>view.cases),...QUESTION_PROGRAM_BATCH3_ACCEPTED_SOURCE_VIEWS["topic-batch3-statistics"]!.cases].find(c=>c.id===clinicalCase.id&&
  c.participant?.kind==="employee_discussion"&&c.decisionNodes[0]!.questionVariantId===clinicalCase.decisionNodes[0]!.questionVariantId);
 if(!exact){expect(clinicalCase.approvedInstantiationProfiles,clinicalCase.id).toBeUndefined();return;}
 expect(clinicalCase.approvedInstantiationProfiles,clinicalCase.id).toEqual(exact.approvedInstantiationProfiles);
 expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
 for(const profile of clinicalCase.approvedInstantiationProfiles!){
  expect(profile.prototypeDemographics).toBeUndefined();expect(profile.prototypeVitalSigns).toBeUndefined();
  expect(profile.presentation).toBe(clinicalCase.presentation);expect(profile.chiefComplaint).toBe(exact.chiefComplaint);
  expect(Object.keys(profile).sort()).toEqual(["chiefComplaint","id","presentation"]);
 }
}

const MULTI_PATIENT_FRAMING = [
  /\bwhich patient\b/i,
  /\b(?:four|several|multiple) (?:stable )?(?:adults|patients)\b/i,
  /\b(?:reviewing|counseling) patients\b/i,
  /\bwhich (?:presentation|referral profile)\b/i,
];

const PATIENT_REFERENCE =
  /(?:\{patientName\}|\b(?:patient|adult|woman|man|recipient|they|she|he|\d{1,3}-year-old)\b)/i;
const STORY_CUE =
  /\b(?:asks?|wants?|requests?|reports?|returns?|arrives?|attends?|noticed|notes?|describes?|is seen|is reviewed|is offered|is invited|comes?|visits?|brings?|discuss(?:es|ing)?|reviews?|reviewing|hoping|considering|counseled|diagnosed|hypercalcemia|shows?|showing|discovered|identifies|referred|confirming|evaluated|evaluates?|assess(?:ed|ing)|wakes?|found|undergoing|underway|continues?|preparing|prepared|presents?|has|have|had|develops?|confirms|completed|scheduled|plans|starts|persists|decides|receives|reads?|sees?|declines?|lacks?|overhears?|recognizes?|waits?|considers?|compares?|moves?|records?|measures?|tabulates?|cross-classifies|tracks?|designs?|tests?|recalls?|cannot|eats?|viene|consulta|llega|quiere|dice|pregunta|está|comprende)\b/i;
const ALTERNATE_PATIENT_CHOICE =
  /^(?:a|an|fit) (?:patient|adult|woman|man)\b/i;

function normalized(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

describe("playable one-patient narratives", () => {
  it("anchors every admitted case to one patient with a brief story", () => {
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      if (clinicalCase.id.startsWith("case.l2.")) continue;
      if (clinicalCase.participant?.kind === "employee_discussion") {
        expect(clinicalCase.presentation, clinicalCase.id).toContain(
          "{patientName}",
        );
        expect(clinicalCase.presentation, clinicalCase.id).toMatch(STORY_CUE);
        expect(clinicalCase.prototypeDemographics, clinicalCase.id).toBeUndefined();
        expect(clinicalCase.prototypeVitalSigns, clinicalCase.id).toBeUndefined();
        expectStaffProfiles(clinicalCase);
        continue;
      }
      expect(clinicalCase.presentation, clinicalCase.id).toMatch(
        PATIENT_REFERENCE,
      );
      expect(clinicalCase.presentation, clinicalCase.id).toMatch(STORY_CUE);
      let patientStory=clinicalCase.presentation;
      if(clinicalCase.id==="case.topic.quality-safety-systems.specimen-observed-barrier.standalone.v1"){
        // This reviewed single-patient chart describes a batch-printing error.
        // Bind the exact background sentence before testing the patient story.
        const background="Labels for several patients had been printed together and placed at the shared collection bench. ";
        expect(patientStory).toContain(background);
        expect(createHash("sha256").update(JSON.stringify(clinicalCase)).digest("hex"))
          .toBe(QUESTION_PROGRAM_BATCH4_FROZEN_PRESERVATION.find(row=>row.caseId===clinicalCase.id)!.retainedCaseSha256);
        patientStory=patientStory.replace(background,"");
      }
      for (const pattern of MULTI_PATIENT_FRAMING) {
        expect(patientStory, clinicalCase.id).not.toMatch(
          pattern,
        );
      }
    }
  });

  it("keeps decision prompts tied to that encounter instead of restating the chart", () => {
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      if (clinicalCase.id.startsWith("case.l2.")) continue;
      const firstPresentationSentence =
        clinicalCase.presentation.match(/^.*?[.!?](?:\s|$)/)?.[0] ?? "";
      for (const node of clinicalCase.decisionNodes) {
        for (const pattern of MULTI_PATIENT_FRAMING) {
          expect(node.stem, node.id).not.toMatch(pattern);
        }
        if (firstPresentationSentence.length >= 50) {
          expect(normalized(node.stem), node.id).not.toContain(
            normalized(firstPresentationSentence),
          );
        }
      }
    }
  });

  it("uses alternative findings rather than a lineup of different patients", () => {
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      for (const node of clinicalCase.decisionNodes) {
        for (const choice of node.answerChoices) {
          expect(choice.label, `${node.id}:${choice.id}`).not.toMatch(
            ALTERNATE_PATIENT_CHOICE,
          );
        }
      }
    }
  });

  it("keeps explicitly female stories attached to female chart identities", () => {
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      if (clinicalCase.participant?.kind === "employee_discussion") {
        expect(clinicalCase.prototypeDemographics, clinicalCase.id).toBeUndefined();
        expectStaffProfiles(clinicalCase);
        continue;
      }
      const profiles = clinicalCase.approvedInstantiationProfiles ?? [];
      if (profiles.length > 0) {
        for (const profile of profiles) {
          if (/\b(?:woman|she|her)\b/i.test(profile.presentation)) {
            expect(profile.prototypeDemographics?.sexLabel, `${clinicalCase.id}/${profile.id}`).toBe("Female");
          }
        }
      } else if (/\b(?:woman|she|her)\b/i.test(clinicalCase.presentation)) {
        expect(clinicalCase.prototypeDemographics?.sexLabel, clinicalCase.id).toBe("Female");
      }
    }
  });
});
