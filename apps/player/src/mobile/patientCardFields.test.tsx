import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PATIENT_LIBRARY_CASE_WORDING_REVISIONS } from "@gamify-surgery/clinical-content";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import { normalizeFrozenClinicalText } from "../session/clinicalText";
import { PatientLists } from "../ui/PatientLists";
import type { PatientTabView } from "../ui/types";
import { MobilePatients } from "./MobilePatients";
import { allElements, cleanupPhoneTests, noop, phoneTestDom } from "./screenTestUtils";

const stages = [
  { id: "new", lifecycle: "waiting_unopened", folder: "waiting", resolutionReason: null },
  { id: "existing", lifecycle: "active_action_required", folder: "active", resolutionReason: null },
  { id: "pending", lifecycle: "active_pending_result", folder: "active", resolutionReason: null },
  { id: "ready-to-file", lifecycle: "resolved_summary_available", folder: "active", resolutionReason: "completed" },
  { id: "filed", lifecycle: "resolved", folder: "resolved", resolutionReason: "completed" },
  { id: "walked-out", lifecycle: "resolved", folder: "resolved", resolutionReason: "walkout" },
] as const;

function clinic(): GameState {
  const state = createInitialGameState();
  const template = Object.values(state.encounters)[0]!;
  state.encounters = Object.fromEntries(stages.map((stage, index) => {
    const encounter = structuredClone(template);
    encounter.id = stage.id;
    encounter.patientDisplayName = `Fixture Person ${index + 1}`;
    encounter.lifecycle = stage.lifecycle;
    encounter.resolutionReason = stage.resolutionReason;
    encounter.checkInStatus = "checked_in";
    encounter.patientMovement = null;
    encounter.frozenCase.id = `case.mobile-patient-fields.${stage.id}`;
    encounter.frozenCase.prototypeDemographics = { ageYears: 38 + index, sexLabel: index % 2 ? "Male" : "Female" };
    encounter.frozenCase.chiefComplaint = `Frozen fixture visit ${index + 1}`;
    return [encounter.id, encounter];
  }));
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  return state;
}

function patientRows(state: GameState): PatientTabView[] {
  return createPrototypePlayerView(state, null, false, null).patients;
}

function stripCardFields(rows: PatientTabView[]): PatientTabView[] {
  return rows.map(({ ageLabel: _age, sexLabel: _sex, chiefComplaint: _complaint, ...legacy }) => legacy);
}

afterEach(cleanupPhoneTests);

describe("frozen patient-card projection", () => {
  it.each(stages)("projects the frozen age/sex/complaint for $id without changing the campaign", (stage) => {
    const state = clinic();
    const before = structuredClone(state);
    const encounter = state.encounters[stage.id]!;
    const demographics = encounter.frozenCase.prototypeDemographics!;
    expect(patientRows(state).find((patient) => patient.id === encounter.id)).toMatchObject({
      folder: stage.folder,
      name: encounter.patientDisplayName,
      ageLabel: `${demographics.ageYears} years`,
      sexLabel: demographics.sexLabel,
      chiefComplaint: encounter.frozenCase.chiefComplaint,
    });
    expect(state).toEqual(before);
  });

  it.each(stages)("leaves missing legacy frozen fields undefined for $id", (stage) => {
    const state = clinic();
    const encounter = state.encounters[stage.id]!;
    delete encounter.frozenCase.prototypeDemographics;
    delete encounter.frozenCase.chiefComplaint;
    const row = patientRows(state).find((patient) => patient.id === encounter.id)!;
    expect(row.ageLabel).toBeUndefined();
    expect(row.sexLabel).toBeUndefined();
    expect(row.chiefComplaint).toBeUndefined();
  });

  it.each(["ageYears", "sexLabel"] as const)("does not fill a partially missing legacy %s", (field) => {
    const state = clinic();
    const encounter = state.encounters.new!;
    Reflect.deleteProperty(encounter.frozenCase.prototypeDemographics!, field);
    const row = patientRows(state).find((patient) => patient.id === encounter.id)!;
    expect(row.ageLabel).toBe(field === "ageYears" ? undefined : "38 years");
    expect(row.sexLabel).toBe(field === "sexLabel" ? undefined : "Female");
  });

  it("keeps an explicitly frozen age of zero", () => {
    const state = clinic();
    state.encounters.new!.frozenCase.prototypeDemographics!.ageYears = 0;
    expect(patientRows(state).find((patient) => patient.id === "new")?.ageLabel).toBe("0 years");
  });

  it("keeps saved demographics and custom complaint even when the live case differs", () => {
    const state = clinic();
    const encounter = state.encounters.new!;
    const liveCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((candidate) => candidate.prototypeDemographics)!;
    const before = structuredClone(liveCase);
    encounter.frozenCase.id = liveCase.id;
    encounter.frozenCase.prototypeDemographics = { ageYears: 0, sexLabel: "Not specified" };
    expect(patientRows(state).find((patient) => patient.id === encounter.id)).toMatchObject({
      ageLabel: "0 years", sexLabel: "Not specified", chiefComplaint: "Frozen fixture visit 1",
    });
    expect(liveCase).toEqual(before);
  });

  it("does not supply a missing complaint from the wording repair map", () => {
    const repair = PATIENT_LIBRARY_CASE_WORDING_REVISIONS.find((revision) => revision.sourceChiefComplaint === null)!;
    expect(repair).toBeDefined();
    const state = clinic();
    const encounter = state.encounters.new!;
    encounter.frozenCase.id = repair.caseId;
    delete encounter.frozenCase.chiefComplaint;
    // This is the legacy fallback used elsewhere; cards must preserve absence.
    expect(normalizeFrozenClinicalText({ clinicalCaseId: repair.caseId, patientDisplayName: encounter.patientDisplayName,
      field: "chiefComplaint", text: undefined })).toBeTruthy();
    const row = patientRows(state).find((patient) => patient.id === encounter.id)!;
    expect(row.chiefComplaint).toBeUndefined();
    const markup = renderToStaticMarkup(<MobilePatients patients={[row]} onOpen={noop} onOpenDiscussion={noop} />);
    expect(markup).not.toContain("mobile-patient-complaint");
  });

  it("uses the established wording repair only when the complaint is present in the frozen record", () => {
    const repair = PATIENT_LIBRARY_CASE_WORDING_REVISIONS.find((revision) => revision.sourceChiefComplaint !== null)!;
    const state = clinic();
    const encounter = state.encounters.new!;
    encounter.frozenCase.id = repair.caseId;
    encounter.frozenCase.chiefComplaint = repair.sourceChiefComplaint!.replaceAll("{patientName}", encounter.patientDisplayName);
    expect(patientRows(state).find((patient) => patient.id === encounter.id)?.chiefComplaint)
      .toBe(repair.revisedChiefComplaint.replaceAll("{patientName}", encounter.patientDisplayName));
  });
});

describe("patient-card fields are phone presentation only", () => {
  it("renders every projected frozen card fact with no chart open, retaining patient-ID callbacks", async () => {
    const state = clinic();
    const rows = patientRows(state);
    const env = phoneTestDom();
    const open = vi.fn();
    await env.render(<MobilePatients patients={rows} onOpen={open} onOpenDiscussion={noop} />);
    await env.click("Resolved, 2 charts");
    const cards = allElements(env.element, (element) => element.attributes["data-patient-id"] !== undefined);
    expect(cards).toHaveLength(stages.length);
    for (const stage of stages) {
      const row = rows.find((patient) => patient.id === stage.id)!;
      const card = cards.find((element) => element.attributes["data-patient-id"] === stage.id)!;
      expect(card.textContent).toContain(`${row.ageLabel} · ${row.sexLabel}`);
      expect(card.textContent).toContain(row.chiefComplaint);
      await env.clickElement(card);
    }
    expect(open.mock.calls).toEqual(stages.map((stage) => [stage.id]));
    expect(state.openChartEncounterId).toBeNull();
  });

  it("leaves missing frozen facts out of all legacy phone cards", () => {
    const state = clinic();
    for (const encounter of Object.values(state.encounters)) {
      delete encounter.frozenCase.prototypeDemographics;
      delete encounter.frozenCase.chiefComplaint;
    }
    const markup = renderToStaticMarkup(<MobilePatients patients={patientRows(state)} onOpen={noop} onOpenDiscussion={noop} />);
    expect(markup).not.toContain("mobile-patient-complaint");
    expect(markup).not.toContain(" years");
    expect(markup).not.toContain("Female");
    expect(markup).not.toContain("Male");
  });

  it("renders desktop patient rows byte-identically with or without the additive fields", () => {
    const state = clinic();
    const rows = patientRows(state).map((patient) => ({ ...patient, selected: patient.id === "existing" }));
    const props = { onOpen: noop, tutorialTargetEncounterId: "new", showTutorialCallout: true };
    const legacyMarkup = renderToStaticMarkup(<PatientLists {...props} patients={stripCardFields(rows)} />);
    const enrichedMarkup = renderToStaticMarkup(<PatientLists {...props} patients={rows} />);
    expect(enrichedMarkup).toBe(legacyMarkup);
    expect(enrichedMarkup.match(/class="patient-tab patient-tab-slide/g)).toHaveLength(stages.length);
    expect(enrichedMarkup).toContain("is-selected");
    expect(enrichedMarkup).toContain("tutorial-tab-callout");
    expect(enrichedMarkup).toContain("is-compact");
    for (const patient of rows) {
      expect(enrichedMarkup).not.toContain(patient.ageLabel);
      expect(enrichedMarkup).not.toContain(patient.chiefComplaint);
    }
  });
});
