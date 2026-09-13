import { describe, expect, it } from "vitest";
import {
  PATIENT_LIBRARY_CASE_WORDING_REVISIONS,
  PATIENT_LIBRARY_NODE_STEM_REVISIONS,
  PATIENT_LIBRARY_PROFILE_WORDING_REVISIONS,
} from "@gamify-surgery/clinical-content";
import {
  normalizeFrozenClinicalText,
  splitClinicalDecisionStem,
} from "./clinicalText";

const patientName = "Quinn Example";
const materialize = (text: string) => text.replaceAll("{patientName}", patientName);

describe("clinical chart text separation", () => {
  it("keeps a question-only stem unchanged", () => {
    expect(
      splitClinicalDecisionStem("What evaluation should be obtained next?"),
    ).toEqual({ question: "What evaluation should be obtained next?" });
  });

  it("removes a repeated patient vignette from above the answer choices", () => {
    expect(
      splitClinicalDecisionStem(
        "A patient returns to finalize elective repair of a stable hernia. The patient continues to have poorly controlled COPD symptoms. Which plan is most appropriate?",
      ),
    ).toEqual({
      context:
        "A patient returns to finalize elective repair of a stable hernia. The patient continues to have poorly controlled COPD symptoms.",
      question: "Which plan is most appropriate?",
    });
  });

  it("preserves later-step findings as context while isolating the question", () => {
    expect(
      splitClinicalDecisionStem(
        "Targeted ultrasound shows a concordant simple cyst. It causes persistent focal discomfort. What is the most appropriate initial procedure?",
      ),
    ).toEqual({
      context:
        "Targeted ultrasound shows a concordant simple cyst. It causes persistent focal discomfort.",
      question: "What is the most appropriate initial procedure?",
    });
  });

  it("handles a question clause after a comma", () => {
    expect(
      splitClinicalDecisionStem(
        "With these results available, what is the next step?",
      ),
    ).toEqual({
      context: "With these results available,",
      question: "what is the next step?",
    });
  });

  it("repairs only exact known frozen case text with the saved patient name", () => {
    const revision = PATIENT_LIBRARY_CASE_WORDING_REVISIONS.find(
      (candidate) => candidate.caseId === "case.fhh.evaluation-to-confirmed-management",
    )!;
    expect(normalizeFrozenClinicalText({
      clinicalCaseId: revision.caseId,
      patientDisplayName: patientName,
      text: materialize(revision.sourceChiefComplaint!),
      field: "chiefComplaint",
    })).toBe(materialize(revision.revisedChiefComplaint));
    expect(normalizeFrozenClinicalText({
      clinicalCaseId: revision.caseId,
      patientDisplayName: patientName,
      text: materialize(revision.sourcePresentation),
      field: "presentation",
    })).toBe(materialize(revision.revisedPresentation));
    expect(normalizeFrozenClinicalText({
      clinicalCaseId: revision.caseId,
      patientDisplayName: patientName,
      text: "My custom saved wording.",
      field: "presentation",
    })).toBe("My custom saved wording.");
  });

  it("repairs only mapped missing chief complaints", () => {
    const missingComplaintRevision = PATIENT_LIBRARY_CASE_WORDING_REVISIONS.find(
      (candidate) => candidate.sourceChiefComplaint === null,
    )!;
    expect(normalizeFrozenClinicalText({
      clinicalCaseId: missingComplaintRevision.caseId,
      patientDisplayName: patientName,
      text: undefined,
      field: "chiefComplaint",
    })).toBe(materialize(missingComplaintRevision.revisedChiefComplaint));
    expect(normalizeFrozenClinicalText({
      clinicalCaseId: "case.unknown.custom",
      patientDisplayName: patientName,
      text: undefined,
      field: "chiefComplaint",
    })).toBeUndefined();
    expect(normalizeFrozenClinicalText({
      clinicalCaseId: missingComplaintRevision.caseId,
      patientDisplayName: patientName,
      text: "",
      field: "chiefComplaint",
    })).toBe("");
  });

  it("uses selected profile and node identities before displaying a known repair", () => {
    const profile = PATIENT_LIBRARY_PROFILE_WORDING_REVISIONS[0]!;
    expect(normalizeFrozenClinicalText({
      clinicalCaseId: profile.caseId,
      patientDisplayName: patientName,
      text: materialize(profile.sourcePresentation),
      field: "presentation",
      selectedInstantiationProfileId: profile.approvedInstantiationProfileId,
    })).toBe(materialize(profile.revisedPresentation));
    expect(normalizeFrozenClinicalText({
      clinicalCaseId: profile.caseId,
      patientDisplayName: patientName,
      text: materialize(profile.sourcePresentation),
      field: "presentation",
      selectedInstantiationProfileId: "profile.not-a-match",
    })).toBe(materialize(profile.sourcePresentation));

    const hsilStem = PATIENT_LIBRARY_NODE_STEM_REVISIONS.find(
      (candidate) => candidate.caseId === "case.anal-hsil.hpv.3b",
    )!;
    const repairedStem = normalizeFrozenClinicalText({
      clinicalCaseId: hsilStem.caseId,
      patientDisplayName: patientName,
      text: materialize(hsilStem.sourceStem),
      field: "stem",
      decisionNodeId: hsilStem.nodeId,
      questionVariantId: hsilStem.questionVariantId,
    });
    expect(repairedStem).toBe(materialize(hsilStem.revisedStem));
    expect(repairedStem).toMatch(/\?$/);
    expect(repairedStem).not.toBe("Which answer is appropriate?");
  });
});
