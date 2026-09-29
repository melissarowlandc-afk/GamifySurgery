import { PROTOTYPE_BALANCE_RELEASE, getServiceIncomeForRoute } from "@gamify-surgery/balance-config";
import { ANSWER_CHOICE_TIMING_REGISTRY, SYNTHETIC_CLINICAL_RELEASE } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import { EXACT_TEST_CHOICE_ORDER_RECORDS, getExactTestChoiceOrderRecord } from "../src/test-choice-orders";
import type { EncounterState } from "../src/types";

const keyOf = (caseId: string, nodeId: string, questionVariantId: string, choiceId: string) =>
  `${caseId}|${nodeId}|${questionVariantId}|${choiceId}`;

const serviceRoutes = new Map(
  PROTOTYPE_BALANCE_RELEASE.services.map((service) => [service.id, new Map(service.routes.map((route) => [route.id, route]))]),
);

describe("active-release test-choice order inventory", () => {
  it("preserves the active release timing inventory counts", () => {
    const timed = SYNTHETIC_CLINICAL_RELEASE.cases.flatMap((clinicalCase) => clinicalCase.decisionNodes.flatMap((node, index) => {
      const entry = ANSWER_CHOICE_TIMING_REGISTRY.find((candidate) => candidate.caseId === clinicalCase.id && candidate.nodeId === node.id && candidate.questionVariantId === node.questionVariantId);
      return entry?.classification.kind === "test_choices" ? entry.classification.choices.map((choice) => ({ isTerminal: index === clinicalCase.decisionNodes.length - 1, isCorrect: node.answerChoices.find((candidate) => candidate.id === choice.choiceId)?.isCorrect === true, timing: choice.timing })) : [];
    })).filter((item) => item.timing.kind === "test");
    expect(timed).toHaveLength(1225);
    expect(timed.filter((item) => item.isTerminal && item.isCorrect)).toHaveLength(82);
  });

  it("classifies every timing.test choice and leaves incorrect selections without an added order", () => {
    const registryByNode = new Map(
      ANSWER_CHOICE_TIMING_REGISTRY.map((entry) => [`${entry.caseId}|${entry.nodeId}|${entry.questionVariantId}`, entry]),
    );
    const records = new Map(EXACT_TEST_CHOICE_ORDER_RECORDS.map((record) => [keyOf(record.caseId, record.nodeId, record.questionVariantId, record.choiceId), record]));
    expect(records.size).toBe(EXACT_TEST_CHOICE_ORDER_RECORDS.length);

    const seenCorrectTestKeys = new Set<string>();
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      clinicalCase.decisionNodes.forEach((node, index) => {
        const entry = registryByNode.get(`${clinicalCase.id}|${node.id}|${node.questionVariantId}`);
        expect(entry, `${clinicalCase.id}/${node.id} needs timing metadata`).toBeDefined();
        const timings = entry?.classification.kind === "test_choices" ? new Map(entry.classification.choices.map((choice) => [choice.choiceId, choice])) : new Map();
        for (const choice of node.answerChoices) {
          const timing = timings.get(choice.id)?.timing;
          const key = keyOf(clinicalCase.id, node.id, node.questionVariantId, choice.id);
          const record = records.get(key);
          if (timing?.kind !== "test") {
            expect(record, `non-test ${key} must not have an execution record`).toBeUndefined();
            continue;
          }
          if (!choice.isCorrect) {
            expect(record, `incorrect test selection ${key} must retain no-extra-order policy`).toBeUndefined();
            continue;
          }
          seenCorrectTestKeys.add(key);
          const gateClassifiesChoice = index < clinicalCase.decisionNodes.length - 1 &&
            node.resultGateAfter?.resultTypeId === choice.serviceRequest?.serviceId;
          expect(
            Boolean(record) || gateClassifiesChoice,
            `correct timing.test ${key} is uncategorized; add an exact record or a result gate`,
          ).toBe(true);
          if (record) {
            expect(record.choiceLabel).toBe(choice.label);
            expect(record.timingProfileId).toBe(timing.timingProfileId);
            expect(choice.isCorrect).toBe(true);
          }
        }
      });
    }
    expect(seenCorrectTestKeys.size).toBeGreaterThan(0);
  });

  it("binds every exact record to an active correct choice, exact timing metadata, and valid routes", () => {
    const activeChoices = new Map<string, { label: string; correct: boolean; timingProfileId: string }>();
    for (const clinicalCase of SYNTHETIC_CLINICAL_RELEASE.cases) {
      for (const node of clinicalCase.decisionNodes) {
        const timingEntry = ANSWER_CHOICE_TIMING_REGISTRY.find((entry) => entry.caseId === clinicalCase.id && entry.nodeId === node.id && entry.questionVariantId === node.questionVariantId);
        if (timingEntry?.classification.kind !== "test_choices") continue;
        for (const registered of timingEntry.classification.choices) {
          const choice = node.answerChoices.find((candidate) => candidate.id === registered.choiceId);
          if (choice && registered.timing.kind === "test") activeChoices.set(keyOf(clinicalCase.id, node.id, node.questionVariantId, choice.id), { label: choice.label, correct: choice.isCorrect, timingProfileId: registered.timing.timingProfileId });
        }
      }
    }
    for (const record of EXACT_TEST_CHOICE_ORDER_RECORDS) {
      const exactKey = keyOf(record.caseId, record.nodeId, record.questionVariantId, record.choiceId);
      const active = activeChoices.get(exactKey);
      expect(active, `orphan or guessed record ${exactKey}`).toBeDefined();
      expect(active?.correct).toBe(true);
      expect(active?.label).toBe(record.choiceLabel);
      expect(active?.timingProfileId).toBe(record.timingProfileId);
      if ("serviceId" in record.disposition) {
        const routes = serviceRoutes.get(record.disposition.serviceId);
        expect(routes, `${exactKey} references unknown service`).toBeDefined();
        for (const routeId of record.disposition.allowedRouteIds) {
          const route = routes?.get(routeId);
          expect(route, `${exactKey} references unknown route ${routeId}`).toBeDefined();
          if (route?.patientTravel) {
            expect(getServiceIncomeForRoute(routeId), `${exactKey} onsite component needs an income operation`).not.toBeNull();
          }
        }
        if (record.disposition.kind === "test_only_continuation") expect(record.disposition.externalRemainder.length).toBeGreaterThan(0);
      }
    }
  });

  it("requires the independently identified onsite gate families to retain their exact facility routes", () => {
    const expected = [
      ["case.fap.new-parent", "node.fap.new-parent.1", "panel_1", "service.genetic_testing", "route.genetic_testing.phlebotomy_sendout"],
      ["case.carotid-stenosis.retinal-event", "node.carotid-stenosis.retinal-event.1", "carotid_cta_1", "service.carotid_cta", "route.carotid_cta.in_house"],
      ["case.postoperative-dvt.colectomy", "node.postoperative-dvt.colectomy.1", "duplex_1", "service.venous_duplex", "route.venous_duplex.in_house"],
      ["case.persistent-itp.four-month", "node.persistent-itp.four-month.1", "viral_serology_1", "service.hiv_hcv_serology", "route.hiv_hcv_serology.phlebotomy_sendout"],
      ["case.chronic-mesenteric-ischemia.meal-pain", "node.chronic-mesenteric-ischemia.meal-pain.1", "cta_1", "service.mesenteric_cta", "route.mesenteric_cta.in_house"],
      ["case.primary-aldosteronism.resistant-three-drugs", "node.primary-aldosteronism.resistant-three-drugs.1", "arr_1", "service.primary_aldosteronism_screen", "route.primary_aldosteronism_screen.phlebotomy_sendout"],
      ["case.celiac.chronic-diarrhea", "node.celiac.chronic-diarrhea.2", "endoscopy_biopsy_1", "service.upper_endoscopy_duodenal_biopsy", "route.upper_endoscopy_duodenal_biopsy.in_house"],
      ["case.colorectal.routine-screen", "node.colorectal.routine-screen.1", "colonoscopy_1", "service.colonoscopy", "route.colonoscopy.in_house"],
      ["case.recovered-diverticulitis.drained-abscess", "node.recovered-diverticulitis.drained-abscess.1", "colonoscopy_1", "service.colonoscopy", "route.colonoscopy.in_house"],
      ["case.eoe.meat-sticks", "node.eoe.meat-sticks.1", "egd_biopsy_1", "service.esophageal_multilevel_biopsy", "route.esophageal_multilevel_biopsy.in_house"],
    ] as const;
    for (const [caseId, nodeId, choiceId, serviceId, onsiteRouteId] of expected) {
      const matches = EXACT_TEST_CHOICE_ORDER_RECORDS.filter((record) => record.caseId === caseId && record.nodeId === nodeId && record.choiceId === choiceId);
      expect(matches, `${caseId}/${nodeId}/${choiceId} needs one exact gate override`).toHaveLength(1);
      const disposition = matches[0]!.disposition;
      expect(disposition.kind).toBe("result_gate_route_override");
      if (disposition.kind === "result_gate_route_override") {
        expect(disposition.serviceId).toBe(serviceId);
        expect(disposition.allowedRouteIds).toContain(onsiteRouteId);
      }
    }
  });

  it("requires supported terminal work and mixed remainders to stay explicit", () => {
    const terminalServiceFamilies = [
      ["case.mondor-disease.uncertain-targeted-ultrasound", "node.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1", "targeted_doppler_ultrasound"],
      ["case.fhh.suggestive-results-confirmation", "node.fhh.suggestive-results-confirmation.v1", "suspect_fhh_genetic_testing"],
      ["case.graves-trab-diagnostic-support.v1", "node.graves-trab-diagnostic-support.v1", "answer.graves-trab-diagnostic-support.v1.4"],
      ["case.cushing-classification.progressive-features", "node.cushing-classification.progressive-features.2", "adrenal_ct_next_1"],
      ["case.adrenal-incidentaloma.lung-cancer-mass", "node.adrenal-incidentaloma.lung-cancer-mass.1", "metanephrines_1"],
      ["case.iron-deficiency.adult-man-fatigue", "node.iron-deficiency.adult-man-fatigue.2", "bidirectional_1"],
    ] as const;
    for (const [caseId, nodeId, choiceId] of terminalServiceFamilies) {
      const record = EXACT_TEST_CHOICE_ORDER_RECORDS.find((candidate) => candidate.caseId === caseId && candidate.nodeId === nodeId && candidate.choiceId === choiceId);
      expect(record?.disposition.kind, `${caseId}/${nodeId}/${choiceId} must be terminal service work`).toBe("terminal_service");
    }
    const mixed = [
      ["case.fhh.evaluation-to-confirmed-management", "node.fhh.initial-biochemical-evaluation.v1", "paired_24h_urine_serum_values"],
      ["case.nephrolithiasis.recurrent-flank-pain", "node.nephrolithiasis.recurrent-flank-pain.2", "stone_metabolic_1"],
      ["case.primary-aldosteronism.resistant-three-drugs", "node.primary-aldosteronism.resistant-three-drugs.2", "ct_avs_1"],
      ["case.mammary-paget.crusted-nipple", "node.mammary-paget.crusted-nipple.2", "mammo_us_1"],
    ] as const;
    for (const [caseId, nodeId, choiceId] of mixed) {
      const record = EXACT_TEST_CHOICE_ORDER_RECORDS.find((candidate) => candidate.caseId === caseId && candidate.nodeId === nodeId && candidate.choiceId === choiceId);
      expect(record?.disposition.kind, `${caseId}/${nodeId}/${choiceId} needs explicit mixed handling`).toMatch(/terminal_service|test_only_continuation/);
      if (record?.disposition.kind === "terminal_service" || record?.disposition.kind === "test_only_continuation") expect(record.disposition.externalRemainder?.length).toBeGreaterThan(0);
    }
  });

  it("uses exact identity and label matching, never a broad timing-profile fallback", () => {
    const mondorCase = SYNTHETIC_CLINICAL_RELEASE.cases.find((clinicalCase) => clinicalCase.id === "case.mondor-disease.uncertain-targeted-ultrasound")!;
    const mondorNode = mondorCase.decisionNodes.find((node) => node.id === "node.mondor-disease.evaluation.uncertain-doppler-ultrasound.v1")!;
    const choiceId = "targeted_doppler_ultrasound";
    const encounter = { frozenCase: mondorCase } as EncounterState;
    expect(getExactTestChoiceOrderRecord(encounter, mondorNode, choiceId)?.disposition.kind).toBe("terminal_service");

    const changedLabelNode = {
      ...mondorNode,
      answerChoices: mondorNode.answerChoices.map((choice) => choice.id === choiceId ? { ...choice, label: "Changed wording" } : choice),
    };
    expect(getExactTestChoiceOrderRecord(encounter, changedLabelNode, choiceId)).toBeNull();
    expect(getExactTestChoiceOrderRecord({ ...encounter, frozenCase: { ...mondorCase, id: "case.synthetic.changed" } }, mondorNode, choiceId)).toBeNull();
    expect(getExactTestChoiceOrderRecord(encounter, { ...mondorNode, questionVariantId: "question.synthetic.changed" }, choiceId)).toBeNull();

    const unrelatedCase = SYNTHETIC_CLINICAL_RELEASE.cases.find((clinicalCase) => clinicalCase.id === "case.gallstones.symptomatic-postmeal-episodes")!;
    const unrelatedNode = unrelatedCase.decisionNodes[0]!;
    // It uses the same ultrasound timing profile as the positive control but receives its work from its own result gate.
    expect(getExactTestChoiceOrderRecord({ frozenCase: unrelatedCase } as EncounterState, unrelatedNode, "abdominal_ultrasound_1")).toBeNull();
  });
});
