import { QUESTION_NEW_N1_ROUND3_PRE_RELEASE } from "@gamify-surgery/clinical-content";
// Ship-gate integration: retained draft tuples remain inspectable, not admissible.
import { QUESTION_CATALOG_RELEASE, QUESTION_NEW_N2_ROUND3_PRE_RELEASE, QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE } from "@gamify-surgery/clinical-content";
import { PROTOTYPE_BALANCE_RELEASE, getServiceIncomeForRoute } from "@gamify-surgery/balance-config";
import { ANSWER_CHOICE_TIMING_REGISTRY, SYNTHETIC_CLINICAL_RELEASE, QUESTION_QUALITY_SOURCE_RELEASE, QUESTION_QUALITY_PRE_BATCH1_RELEASE, QUESTION_QUALITY_PRE_ADVERSARIAL_RELEASE, QUESTION_QUALITY_PRE_ADVERSARIAL_R3_RELEASE, QUESTION_QUALITY_PRE_ADVERSARIAL_R4_RELEASE, QUESTION_QUALITY_PRE_ADVERSARIAL_R5_RELEASE, QUESTION_QUALITY_PRE_ADVERSARIAL_R7_RELEASE, QUESTION_QUALITY_PRE_ADVERSARIAL_R6_RELEASE, QUESTION_QUALITY_REVISIONS, QUESTION_QUALITY_CURRENT_REVISIONS, QUESTION_QUALITY_ADVERSARIAL_REVISIONS, QUESTION_QUALITY_ADVERSARIAL_R3_REVISIONS, QUESTION_QUALITY_ADVERSARIAL_R4_REVISIONS, QUESTION_QUALITY_ADVERSARIAL_R5_REVISIONS, QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS, QUESTION_QUALITY_ADVERSARIAL_R6_REVISIONS, QUESTION_QUALITY_PRIOR_REVISIONS, QUESTION_QUALITY_OWNER_ROUND1_REVISIONS, QUESTION_QUALITY_OWNER_ROUND2_REVISIONS, QUESTION_QUALITY_RETAINED_REVISIONS, QUESTION_QUALITY_BATCH1_REVISIONS, applyQuestionQualityRevisions } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import { QUESTION_FLAG_REVISIONS, QUESTION_FLAG_ROUND2_REVISIONS, QUESTION_FLAGS_PRE_REVISION_RELEASE, QUESTION_FLAGS_ROUND1_RELEASE } from "@gamify-surgery/clinical-content";
import { QUESTION_FLAGS_PRE_ROUND3_RELEASE, QUESTION_NEW_N1_ROUND2_PRE_RELEASE } from "@gamify-surgery/clinical-content";
import { QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE } from "@gamify-surgery/clinical-content";
import { EXACT_TEST_CHOICE_ORDER_RECORDS, getExactTestChoiceOrderRecord } from "../src/test-choice-orders";
import type { EncounterState } from "../src/types";

const keyOf = (caseId: string, nodeId: string, questionVariantId: string, choiceId: string) =>
  `${caseId}|${nodeId}|${questionVariantId}|${choiceId}`;
const priorDraftCases = applyQuestionQualityRevisions(QUESTION_QUALITY_SOURCE_RELEASE.cases, QUESTION_QUALITY_PRIOR_REVISIONS);
const ownerRoundOneCases = applyQuestionQualityRevisions(QUESTION_QUALITY_SOURCE_RELEASE.cases, QUESTION_QUALITY_OWNER_ROUND1_REVISIONS);
const ownerRoundTwoCases = applyQuestionQualityRevisions(QUESTION_QUALITY_SOURCE_RELEASE.cases, QUESTION_QUALITY_OWNER_ROUND2_REVISIONS);

const serviceRoutes = new Map(
  PROTOTYPE_BALANCE_RELEASE.services.map((service) => [service.id, new Map(service.routes.map((route) => [route.id, route]))]),
);

describe("active-release test-choice order inventory", () => {
  it("preserves the pre-ship catalog timing inventory counts", () => {
    const timed = QUESTION_NEW_N2_ROUND3_PRE_RELEASE.cases.flatMap((clinicalCase) => clinicalCase.decisionNodes.flatMap((node, index) => {
      const entry = ANSWER_CHOICE_TIMING_REGISTRY.find((candidate) => candidate.caseId === clinicalCase.id && candidate.nodeId === node.id && candidate.questionVariantId === node.questionVariantId);
      return entry?.classification.kind === "test_choices" ? entry.classification.choices.map((choice) => ({ isTerminal: index === clinicalCase.decisionNodes.length - 1, isCorrect: node.answerChoices.find((candidate) => candidate.id === choice.choiceId)?.isCorrect === true, timing: choice.timing })) : [];
    })).filter((item) => item.timing.kind === "test");
    // Question flags: +3 prospective neck-biopsy previews, -1 HIDA CT option,
    // -1 repeat mammography option. SLNB previews remain two; ALND is not a test.
    // All earlier labels, timings and exact records remain bound to their frozen
    // versions; no new duration or terminal execution rule is introduced.
    // Round two replaces 12 timed choices with 22 (+10). Four additional keys
    // are planned outside studies; all are explicit non-execution records.
    // Batch 2a: two repeat-US distractors (+2), a four-choice pressure
    // interpretation becomes non-testing (-4), cortisol-only choices (-1).
    // Net -3 offered studies; terminal correct-test count remains unchanged.
    // Flag round three: 19 old offered studies become 18 (-1), with one fewer
    // terminal testing key. Concurrent N1 adds 37 studies / 13 terminal keys.
    // Both deltas were computed independently against the retained entry bank;
    // all exact label/timing/route and frozen-record checks below still apply.
    // N2 adds 14 existing-profile previews, four on keyed terminal choices.
    // All are explicit external-only non-execution records, tested separately.
    // Batch 2a round two replaces fourteen offered studies with seventeen (+3),
    // and adds one terminal testing key. Old tuples remain available unchanged.
    // N1 round two replaces 34 offered previews with 47 (+13), and 12 testing keys with 15 (+3).
    // The original exact tuples are retained for frozen encounters.
    // Batch 2b replaces 34 offered studies with 60 (+26), including nine
    // additional terminal testing keys. Existing three service paths persist;
    // every other new timed plan is explicitly nonexecuted.
    // N2 round two: 14 offered previews become 38 (+24), four terminal keys become 12 (+8).
    // Every original exact tuple remains available for a frozen encounter.
    // N1 round three replaces 34 previews with 43 (+9), and 11 testing keys with 14 (+3).
    // The pre-round-three assembly preserves every exact superseded v2 choice.
    expect(timed).toHaveLength(1511 + 14 + 3 + 13 + 26 + 24 + 9);
    expect(timed.filter((item) => item.isTerminal && item.isCorrect)).toHaveLength(155 + 4 + 1 + 3 + 9 + 8 + 3);
  });

  it("classifies every timing.test choice and permits incorrect records only as explicit non-execution", () => {
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
            if (record) {
              expect(record.disposition.kind, `incorrect test selection ${key} must retain no-extra-order policy`).toBe("not_executed");
              expect(record.choiceLabel).toBe(choice.label);
              expect(record.timingProfileId).toBe(timing.timingProfileId);
            }
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

  it("binds every exact record to an active or explicitly retained frozen choice, exact timing metadata, and valid routes", () => {
    const activeChoices = new Map<string, { label: string; correct: boolean; timingProfileId: string }>();
    const retained = new Set([...QUESTION_QUALITY_REVISIONS, ...QUESTION_QUALITY_BATCH1_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_R3_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_R4_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_R5_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_R6_REVISIONS, ...QUESTION_QUALITY_ADVERSARIAL_R7_REVISIONS, ...QUESTION_FLAG_REVISIONS, ...QUESTION_FLAG_ROUND2_REVISIONS].map(r => keyOf(r.caseId, r.nodeId, r.previousQuestionVariantId, "")));
    const legacyCases = QUESTION_QUALITY_SOURCE_RELEASE.cases.map(c => ({ ...c,
      decisionNodes: c.decisionNodes.filter(n => retained.has(keyOf(c.id, n.id, n.questionVariantId, ""))),
    })).filter(c => c.decisionNodes.length);
    const retainedDraftIds = new Set(QUESTION_QUALITY_RETAINED_REVISIONS.map(r => r.questionVariantId));
    const retainedDraftCases = [...priorDraftCases, ...ownerRoundOneCases, ...ownerRoundTwoCases].map(c => ({ ...c, decisionNodes: c.decisionNodes.filter(n => retainedDraftIds.has(n.questionVariantId)) })).filter(c => c.decisionNodes.length);
    // Round-two encounters retain their exact timed choices after the seven
    // round-three replacements. Validate those tuples against their real stage.
    for (const clinicalCase of [...SYNTHETIC_CLINICAL_RELEASE.cases, ...QUESTION_CATALOG_RELEASE.cases, ...QUESTION_NEW_N2_ROUND3_PRE_RELEASE.cases, ...QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE.cases, ...QUESTION_NEW_N1_ROUND3_PRE_RELEASE.cases, ...QUESTION_BANK_PRE_BATCH2A_ROUND3_RELEASE.cases, ...QUESTION_NEW_N1_ROUND2_PRE_RELEASE.cases, ...QUESTION_FLAGS_PRE_ROUND3_RELEASE.cases, ...QUESTION_FLAGS_ROUND1_RELEASE.cases, ...QUESTION_FLAGS_PRE_REVISION_RELEASE.cases, ...QUESTION_QUALITY_PRE_ADVERSARIAL_R7_RELEASE.cases, ...QUESTION_QUALITY_PRE_ADVERSARIAL_R6_RELEASE.cases, ...QUESTION_QUALITY_PRE_ADVERSARIAL_R5_RELEASE.cases, ...QUESTION_QUALITY_PRE_ADVERSARIAL_R4_RELEASE.cases, ...QUESTION_QUALITY_PRE_ADVERSARIAL_R3_RELEASE.cases, ...QUESTION_QUALITY_PRE_ADVERSARIAL_RELEASE.cases, ...QUESTION_QUALITY_PRE_BATCH1_RELEASE.cases, ...legacyCases, ...retainedDraftCases]) {
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
      if (!active?.correct) expect(record.disposition.kind).toBe("not_executed");
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

  it("preserves the four original and prior-draft keyed contracts and binds their exact revised identities", () => {
    const expected = [
      ["A02", "not_executed", "external_only"],
      ["A06-context", "terminal_service", "service.diagnostic_breast_imaging"],
      ["A17", "terminal_service", "service.basic_labs"],
      ["A28-context", "not_executed", "specialist_or_unsupported_service"],
    ] as const;
    for (const [auditId, kind, detail] of expected) {
      const r = QUESTION_QUALITY_CURRENT_REVISIONS.find(r => r.auditId === auditId)!;
      const priorCase = QUESTION_QUALITY_SOURCE_RELEASE.cases.find(c => c.id === r.caseId)!;
      const liveCase = SYNTHETIC_CLINICAL_RELEASE.cases.find(c => c.id === r.caseId)!;
      const priorCaseDraft = priorDraftCases.find(c => c.id === r.caseId)!;
      const oldNode = priorCase.decisionNodes.find(n => n.id === r.nodeId)!;
      const liveNode = liveCase.decisionNodes.find(n => n.id === r.nodeId)!;
      const choiceId = liveNode.answerChoices.find(c => c.isCorrect)!.id;
      const old = getExactTestChoiceOrderRecord({ frozenCase: priorCase } as EncounterState, oldNode, choiceId);
      const current = getExactTestChoiceOrderRecord({ frozenCase: liveCase } as EncounterState, liveNode, choiceId);
      const priorNode = priorCaseDraft.decisionNodes.find(n => n.id === r.nodeId)!;
      const prior = getExactTestChoiceOrderRecord({ frozenCase: priorCaseDraft } as EncounterState, priorNode, choiceId);
      expect(old, auditId + " frozen contract").not.toBeNull();
      expect(current, auditId + " revised contract").not.toBeNull();
      expect(prior, auditId + " prior draft frozen contract").not.toBeNull();
      expect(current!.questionVariantId).toBe(r.questionVariantId);
      expect(current!.choiceLabel).toBe(liveNode.answerChoices.find(c => c.id === choiceId)!.label);
      expect(current!.timingProfileId).toBe(old!.timingProfileId);
      expect(current!.disposition).toEqual(old!.disposition);
      expect(prior!.disposition).toEqual(old!.disposition);
      expect(prior!.timingProfileId).toBe(old!.timingProfileId);
      expect(current!.disposition.kind).toBe(kind);
      expect(current!.disposition.kind === "not_executed" ? current!.disposition.reason : "serviceId" in current!.disposition ? current!.disposition.serviceId : null).toBe(detail);
      expect(liveNode.primaryConceptId).toBe(oldNode.primaryConceptId);
    }
  });

  it("preserves every batch choice record disposition and binds new labels to exact identities", () => {
    for (const r of QUESTION_QUALITY_BATCH1_REVISIONS) {
      const frozen = QUESTION_QUALITY_SOURCE_RELEASE.cases.find(c => c.id === r.caseId)!;
      const live = QUESTION_QUALITY_PRE_ADVERSARIAL_RELEASE.cases.find(c => c.id === r.caseId)!;
      const oldNode = frozen.decisionNodes.find(n => n.id === r.nodeId)!;
      const currentNode = live.decisionNodes.find(n => n.id === r.nodeId)!;
      for (const choice of currentNode.answerChoices) {
        const sourceId = r.choiceSourceIds?.[choice.id] ?? choice.id;
        const old = getExactTestChoiceOrderRecord({ frozenCase: frozen } as EncounterState, oldNode, sourceId);
        const current = getExactTestChoiceOrderRecord({ frozenCase: live } as EncounterState, currentNode, choice.id);
        if (!old) { expect(current).toBeNull(); continue; } // The existing gate may classify the test.
        expect(current, r.auditId + "/" + choice.id).not.toBeNull();
        expect(current!.disposition).toEqual(old.disposition);
        expect(current!.choiceLabel).toBe(choice.label);
        expect(current!.questionVariantId).toBe(r.questionVariantId);
        expect(current!.timingProfileId).toBe(r.timingProfileOverrides?.[choice.id] ?? old.timingProfileId);
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
