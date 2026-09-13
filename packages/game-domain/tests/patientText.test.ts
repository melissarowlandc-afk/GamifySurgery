import { describe, expect, it } from "vitest";
import { TWENTY_CONCEPT_BATCH_CASES, type SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { materializePatientName } from "../src/patientText";

describe("patient-name materialization", () => {
  it("materializes every allowlisted patient-facing field without mutating source data or identifiers", () => {
    const source = JSON.parse(JSON.stringify(TWENTY_CONCEPT_BATCH_CASES.find((item) => item.decisionNodes.length > 1)!)) as SyntheticClinicalCase;
    source.id = "case.{patientName}.identifier";
    source.patientDisplayName = "Legacy authored label";
    source.chiefComplaint = "{patientName} complaint";
    source.learningSummary = "Summary for {patientName}";
    source.sourceLabels = ["source.{patientName}.must-remain"];
    source.approvedInstantiationProfiles![0]!.chiefComplaint = "Profile complaint for {patientName}";
    source.patientPresentationRevision = {
      id: "revision.patient-name.test",
      patientPresentationVariantId: source.patientPresentationVariantId,
      contentVersion: "presentation-revision.patient-name.test",
      revisedChiefComplaint: "Revised complaint for {patientName}",
      revisedPresentation: "Revised presentation for {patientName}",
      revisedFields: ["chiefComplaint", "presentation"],
      revisedProfilePresentations: [{
        id: "revision.patient-name.profile.test",
        approvedInstantiationProfileId: source.approvedInstantiationProfiles![0]!.id,
        contentVersion: "presentation-revision.patient-name.test",
        revisedPresentation: "Revised profile for {patientName}",
        revisedFields: ["presentation"],
        aiAssistedDrafting: true,
        reviewStatus: "needs_clinician_review",
        lastClinicianReview: null,
      }],
      aiAssistedDrafting: true,
      reviewStatus: "needs_clinician_review",
      lastClinicianReview: null,
    };
    const first = source.decisionNodes[0]!;
    first.currentUpdate = "Update for {patientName}";
    first.stem = "Question for {patientName}";
    first.answerChoices[0]!.label = "Choice for {patientName}";
    first.explanation = "Explanation for {patientName}";
    first.resultGateAfter!.pendingLabel = "Test for {patientName} pending";
    first.resultGateAfter!.resultNarrative = "Result for {patientName}";
    const final = source.decisionNodes.at(-1)!;
    final.terminalDispositions[0] = {
      answerChoiceId: final.answerChoices.find((choice) => !choice.isCorrect)!.id,
      kind: "terminal_outcome",
      outcome: {
        id: "outcome.patient-name-test",
        severity: "minor",
        narrative: "Outcome for {patientName}",
        causalFraming: "possible_consequence",
        clinicalRationale: "Rationale for {patientName}",
        sourceLabels: ["outcome-source.{patientName}.must-remain"],
      },
    };
    const noOutcome = final.terminalDispositions[1]!;
    if (noOutcome.kind === "no_terminal_outcome") {
      noOutcome.consequenceNarrative = "Consequence for {patientName}";
      noOutcome.clinicalRationale = "Disposition rationale for {patientName}";
    }
    const before = JSON.stringify(source);

    const materialized = materializePatientName(source, "Cash $& Stone");

    expect(JSON.stringify(source)).toBe(before);
    expect(materialized.patientDisplayName).toBe("Cash $& Stone");
    expect(JSON.stringify(materialized)).toContain("Cash $& Stone");
    const patientFacing = [
      materialized.patientDisplayName,
      materialized.presentation,
      materialized.chiefComplaint,
      materialized.learningSummary,
      ...materialized.approvedInstantiationProfiles!.flatMap((profile) => [profile.presentation, profile.chiefComplaint]),
      materialized.patientPresentationRevision?.revisedChiefComplaint,
      materialized.patientPresentationRevision?.revisedPresentation,
      materialized.patientPresentationRevision?.revisedProfilePresentations?.[0]?.revisedPresentation,
      ...materialized.decisionNodes.flatMap((node) => [
        node.currentUpdate,
        node.stem,
        node.explanation,
        ...node.answerChoices.map((choice) => choice.label),
        node.resultGateAfter?.pendingLabel,
        node.resultGateAfter?.resultNarrative,
        ...node.terminalDispositions.flatMap((disposition) =>
          disposition.kind === "terminal_outcome"
            ? [disposition.outcome.narrative, disposition.outcome.clinicalRationale]
            : [disposition.consequenceNarrative, disposition.clinicalRationale],
        ),
      ]),
    ].filter(Boolean).join(" ");
    expect(patientFacing).not.toMatch(/\{patientName\}/);
    expect(materialized.id).toBe("case.{patientName}.identifier");
    expect(materialized.sourceLabels).toEqual(["source.{patientName}.must-remain"]);
    const outcome = materialized.decisionNodes.at(-1)!.terminalDispositions[0]!;
    expect(outcome.kind === "terminal_outcome" && outcome.outcome.sourceLabels).toEqual(["outcome-source.{patientName}.must-remain"]);
  });
});
