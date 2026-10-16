import { ANSWER_CHOICE_TIMING_REGISTRY, type DecisionNode } from "@gamify-surgery/clinical-content";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { getRoomNavigationAnchor } from "./spatial";
import { getExactTestChoiceOrderRecord, type ExactTestChoiceOrderRecord } from "./test-choice-orders";
import { getDiagnosticResultDisposition } from "./diagnostic-result-dispositions";
import { planDiagnosticOrder, type DiagnosticTimingQuote, type DiagnosticTimingRequest } from "./diagnostic-timing";
import type { DomainContext, EncounterState, GameState, GridPoint } from "./types";

export function getDiagnosticFrontDeskTarget(state: GameState, context: DomainContext): GridPoint | undefined {
  const room = state.rooms.filter((candidate) => candidate.roomDefinitionId === "room.front_desk").sort((a, b) => a.id.localeCompare(b.id))[0];
  const definition = room && context.balanceRelease.facility.roomDefinitions.find((candidate) => candidate.id === room.roomDefinitionId);
  return room && definition ? getRoomNavigationAnchor(room, definition, "primary") : undefined;
}

export interface DiagnosticChoicePlanning {
  request: DiagnosticTimingRequest;
  quote: DiagnosticTimingQuote;
  timingProfileId: string | null;
  serviceId: string | null;
  serviceDisplayName: string;
  operationalOrder: ExactTestChoiceOrderRecord | null;
  executionAllowed: boolean;
}

/** The same exact request is used for answer previews and accepted new work. */
export function getDiagnosticChoicePlanning(state: GameState, encounter: EncounterState, node: DecisionNode,
  choiceId: string, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): DiagnosticChoicePlanning | null {
  const choice = node.answerChoices.find((candidate) => candidate.id === choiceId);
  if (!choice || encounter.arrivalClass === "tutorial") return null;
  const entry = ANSWER_CHOICE_TIMING_REGISTRY.find((candidate) => candidate.caseId === encounter.frozenCase.id &&
    candidate.nodeId === node.id && candidate.questionVariantId === node.questionVariantId);
  if (entry?.classification.kind !== "test_choices" || entry.classification.choices.length !== node.answerChoices.length ||
    !node.answerChoices.every((candidate) => entry.classification.kind === "test_choices" && entry.classification.choices.some((registered) =>
      registered.choiceId === candidate.id && registered.choiceLabel === candidate.label))) return null;
  const timing = entry?.classification.kind === "test_choices" ? entry.classification.choices.find((candidate) =>
    candidate.choiceId === choice.id && candidate.choiceLabel === choice.label)?.timing : null;
  if (timing?.kind === "no_test") return null;
  if (!timing && !choice.serviceRequest) return null;
  const timingProfileId = timing?.kind === "test" ? timing.timingProfileId : null;
  const profile = context.balanceRelease.answerChoiceTimingProfiles.find((candidate) => candidate.id === timingProfileId);
  const order = getExactTestChoiceOrderRecord(encounter, node, choiceId);
  const disposition = order?.disposition;
  const direct = disposition?.kind === "terminal_service" || disposition?.kind === "test_only_continuation" || disposition?.kind === "result_gate_route_override"
    ? disposition : null;
  const serviceId = direct?.serviceId ?? choice.serviceRequest?.serviceId ?? profile?.serviceId ?? null;
  const requestServiceId = direct?.serviceId ?? choice.serviceRequest?.serviceId ??
    (serviceId === node.resultGateAfter?.resultTypeId ? serviceId : null);
  const service = context.balanceRelease.services.find((candidate) => candidate.id === serviceId);
  let allowedRouteIds = direct?.allowedRouteIds ?? (serviceId === node.resultGateAfter?.resultTypeId ? node.resultGateAfter.allowedServiceRouteIds : null);
  let allowOnsiteEquivalents = direct && "allowOnsiteEquivalents" in direct ? direct.allowOnsiteEquivalents ?? true : true;
  if (disposition?.kind === "not_executed" && disposition.reason === "external_only" && service) {
    allowedRouteIds = service.routes.filter((route) => !route.patientTravel && !route.patientRemainsOnsite && !route.resourceRequirements.length).map((route) => route.id);
    allowOnsiteEquivalents = false;
  }
  const request: DiagnosticTimingRequest = {
    orderId: `diagnostic.${encounter.id}.${node.id}.${choice.id}`, encounterId: encounter.id,
    ...(requestServiceId ? { serviceId: requestServiceId } : {}), ...(timingProfileId ? { timingProfileId } : {}),
    allowedRouteIds, allowOnsiteEquivalents,
    ...(encounter.patientLocation ? { patientOrigin: { ...encounter.patientLocation } } : {}),
    patientReturnLocation: getDiagnosticFrontDeskTarget(state, context),
    ...(getDiagnosticResultDisposition(encounter, node, choiceId) ?? {}),
  };
  const executionAllowed = choice.isCorrect && disposition?.kind !== "not_executed" &&
    (Boolean(direct) || disposition?.kind === "staged_result_gate" || serviceId === node.resultGateAfter?.resultTypeId);
  if (disposition?.kind === "staged_result_gate") {
    const components = disposition.components.flatMap((component) => {
      const input = { componentId: component.componentId, serviceId: component.serviceId, allowedRouteIds: component.allowedRouteIds,
        ...(getDiagnosticResultDisposition(encounter, node, choiceId, component.componentId) ?? {}) };
      const probe = planDiagnosticOrder(state, { ...request, ...input, orderId: `${request.orderId}.probe.${component.componentId}` }, context);
      return probe.kind === "planned" && probe.plan.phases.some((phase) => phase.mode === "local" && phase.patientPresent && phase.requirement)
        ? [input] : [];
    });
    if (components.length && profile) {
      request.components = components;
      request.remainder = { label: disposition.components.map((component) => component.externalRemainder).join(" "), durationMinutes: profile.durationTicks,
        mode: disposition.remainderMode, startsAfter: disposition.remainderMode === "external_processing" ? "acquisition" : "care_completion" };
    } else if (profile) {
      request.retainedExternalProtocol = { timingProfileId: profile.id, label: profile.displayName, mode: "external_patient_visit" };
    }
  } else if ((direct?.kind === "terminal_service" || direct?.kind === "test_only_continuation") && direct.externalRemainder && profile) {
    // The mammography remainder has its own existing profile. Other protocols
    // retain their explicit opaque profile rather than inventing a phase split.
    const remainderProfile = profile.id === "timing.test.breast_imaging_bundle"
      ? context.balanceRelease.answerChoiceTimingProfiles.find((candidate) => candidate.id === "timing.test.mammography") ?? profile : profile;
    const probe = planDiagnosticOrder(state, request, context);
    const hasLocalComponent = probe.kind === "planned" && probe.plan.phases.some((phase) => phase.mode === "local" && phase.patientPresent && phase.requirement);
    if (hasLocalComponent) {
      const mode = direct.externalRemainderMode ?? "retained_protocol";
      request.remainder = { label: direct.externalRemainder, durationMinutes: remainderProfile.durationTicks,
        mode, startsAfter: mode === "external_patient_visit" ? "care_completion" : "acquisition" };
    } else {
      request.retainedExternalProtocol = { timingProfileId: profile.id, label: profile.displayName, mode: "external_patient_visit" };
    }
  }
  const quote = planDiagnosticOrder(state, request, context);
  if (quote.kind === "planned" && !executionAllowed) quote.plan.execution = "preview_only";
  return { request, quote, timingProfileId, serviceId, serviceDisplayName: service?.displayName ?? profile?.displayName ?? choice.label,
    operationalOrder: order, executionAllowed };
}
