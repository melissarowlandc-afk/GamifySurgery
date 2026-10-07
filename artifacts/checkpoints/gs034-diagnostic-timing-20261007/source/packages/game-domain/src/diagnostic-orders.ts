import { getServiceIncomeForRoute } from "@gamify-surgery/balance-config";
import type { DecisionNode } from "@gamify-surgery/clinical-content";
import { forecastDiagnosticOrderPlan, getDiagnosticOrderPlans, hasOutstandingDiagnosticWork } from "./diagnostic-timing";
import { startDiagnosticAcquisitionOperation, startDiagnosticProcessingOperation } from "./service-operations";
import type { DiagnosticChoicePlanning } from "./diagnostic-order-requests";
import type { DiagnosticOrderPhase, DiagnosticOrderPlan, DomainContext, EncounterState, GameState, GridPoint, PatientMovementKind, PendingResult, ServiceOperationState } from "./types";

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const finished = (phase: DiagnosticOrderPhase) => phase.status === "completed";
const samePoint = (a: GridPoint | null, b: GridPoint | undefined) => Boolean(a && b && a.x === b.x && a.y === b.y);

export function createDiagnosticPendingResult(state: GameState, encounter: EncounterState, node: DecisionNode,
  diagnostic: DiagnosticChoicePlanning, plan: DiagnosticOrderPlan): PendingResult {
  const gate = node.resultGateAfter;
  const source = plan.sources[0]!;
  const total = Math.max(plan.resultReady.forecastAtTick, plan.careComplete.forecastAtTick);
  return {
    diagnosticTiming: copy(plan), operationId: plan.orderId,
    gateId: gate?.id ?? `gate.${plan.orderId}`, originatingNodeIndex: encounter.currentNodeIndex,
    resultTypeId: gate?.resultTypeId ?? diagnostic.serviceId ?? diagnostic.timingProfileId!,
    pendingLabel: gate?.pendingLabel ?? `${diagnostic.serviceDisplayName} pending`,
    resultNarrative: gate?.resultNarrative ?? (diagnostic.operationalOrder?.disposition.kind === "test_only_continuation"
      ? diagnostic.operationalOrder.disposition.externalRemainder : ""),
    routeId: source.routeId ?? `route.diagnostic.external.${diagnostic.timingProfileId ?? diagnostic.serviceId}`,
    routeDisplayName: source.routeDisplayName,
    scheduledAtTick: state.facilityTick, serviceDurationTicks: total - state.facilityTick,
    durationTicks: total - state.facilityTick, dueTick: total, deliveredAtTick: null,
    offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null,
    timingPhases: [], resourceReservations: [], imagingTechnicianId: null, phlebotomistId: null, providerReservation: null,
  };
}

/** Update every copy of one order, while keeping historical background work. */
export function replaceDiagnosticOrderPlan(encounter: EncounterState, plan: DiagnosticOrderPlan): void {
  const carriers = [encounter.pendingResult, encounter.testOnlyContinuation, encounter.terminalTestOrder,
    encounter.stagedResultOrder, encounter.stagedResultOrder?.remainder, ...(encounter.stagedResultOrder?.components ?? []),
    ...encounter.steps.flatMap((step) => step.result ? [step.result] : [])];
  for (const carrier of carriers) {
    if (carrier?.diagnosticTiming?.orderId === plan.orderId) {
      carrier.diagnosticTiming = copy(plan);
      if ("dueTick" in carrier && carrier.deliveredAtTick === null) {
        carrier.dueTick = Math.max(plan.resultReady.forecastAtTick, plan.careComplete.forecastAtTick);
        carrier.durationTicks = Math.max(0, carrier.dueTick - carrier.scheduledAtTick);
      }
    }
  }
}

export function encounterHasDiagnosticCareWork(state: GameState, encounterId: string): boolean {
  return getDiagnosticOrderPlans(state).some((plan) => plan.encounterId === encounterId &&
    plan.careComplete.reachedAtTick === null && plan.phases.some((phase) => phase.patientPresent && !finished(phase)));
}

export function encounterHasActiveDiagnosticWalk(state: GameState, encounterId: string): boolean {
  return getDiagnosticOrderPlans(state).some((plan) => plan.encounterId === encounterId && plan.phases.some((phase) =>
    phase.status === "active" && (phase.kind === "patient_departure" || phase.kind === "patient_return")));
}

export interface DiagnosticPatientActions {
  /** Rebase a saved leg from the current tile without changing its endpoint. */
  walkingPath(encounter: EncounterState, phase: DiagnosticOrderPhase): GridPoint[];
  startMovement(encounter: EncounterState, kind: PatientMovementKind, path: GridPoint[], roomId: string | null): void;
  roomAt(point: GridPoint): string | null;
  releaseCare(encounter: EncounterState): void;
  careCompleted(encounter: EncounterState): void;
}

function completePhase(phase: DiagnosticOrderPhase, atTick: number): void {
  phase.status = "completed";
  phase.remainingMinutes = 0;
  phase.completedAtTick = atTick;
}

function synchronizeOperationPhase(state: GameState, phase: DiagnosticOrderPhase): void {
  const operation = state.serviceOperations.find((candidate) => candidate.id === phase.serviceOperationId);
  if (!operation) return;
  if (operation.diagnosticPhysicalWork) {
    const marker = operation.diagnosticPhysicalWork;
    const witness = marker.phaseWitnesses.find((entry) => entry.operationPhaseId === phase.operationPhaseId);
    if (witness?.completedAtFacilityTick !== null && witness?.completedAtFacilityTick !== undefined) {
      phase.startedAtTick ??= witness.startedAtFacilityTick;
      completePhase(phase, witness.completedAtFacilityTick);
      return;
    }
    const current = operation.frozenOperationPhases?.[operation.phaseIndex];
    if (current?.id === phase.operationPhaseId) {
      phase.resource = copy(marker.phaseBindings.find((entry) => entry.diagnosticPhaseId === phase.id)?.resource ?? null);
      phase.remainingMinutes = marker.remainingPhaseMinutes ?? phase.durationMinutes;
      phase.startedAtTick = operation.phaseStartedAtFacilityTick;
      phase.status = operation.phaseStartedAtFacilityTick === null ? "queued" : "active";
    }
  } else if (operation.diagnosticPhaseWork) {
    phase.resource = copy(operation.diagnosticPhaseWork.resource);
    phase.remainingMinutes = operation.diagnosticPhaseWork.remainingMinutes;
    phase.startedAtTick = operation.phaseStartedAtFacilityTick;
    if (operation.status === "completed" && operation.completedAtFacilityTick !== null) {
      completePhase(phase, operation.completedAtFacilityTick);
    } else {
      phase.status = operation.phaseStartedAtFacilityTick === null ? "queued" : "active";
    }
  }
  if (operation.status === "cancelled" && !finished(phase)) {
    phase.status = "queued";
    phase.startedAtTick = null;
    phase.resource = null;
    phase.serviceOperationId = null;
  }
}

function choiceOrderFor(encounter: EncounterState, plan: DiagnosticOrderPlan, componentId: string | null): NonNullable<ServiceOperationState["testChoiceOrder"]> | null {
  const index = encounter.steps.findIndex((step) => step.result?.diagnosticTiming?.orderId === plan.orderId);
  const terminal = encounter.terminalTestOrder?.diagnosticTiming?.orderId === plan.orderId ? encounter.terminalTestOrder : null;
  const continuation = encounter.testOnlyContinuation?.diagnosticTiming?.orderId === plan.orderId ? encounter.testOnlyContinuation : null;
  const staged = encounter.stagedResultOrder?.diagnosticTiming?.orderId === plan.orderId ? encounter.stagedResultOrder : null;
  const node = terminal ? encounter.frozenCase.decisionNodes.find((entry) => entry.id === terminal.nodeId)
    : encounter.frozenCase.decisionNodes[index >= 0 ? index : staged?.originatingNodeIndex ?? continuation?.originatingNodeIndex ?? encounter.currentNodeIndex];
  const choice = node?.answerChoices.find((entry) => entry.isCorrect);
  const source = plan.sources.find((entry) => entry.componentId === componentId);
  if (!node || !choice || !source?.serviceId || !source.routeId) return null;
  return { version: "test-choice-order.v1", purpose: terminal ? "terminal" : continuation ? "continuation" : staged ? "staged_result_component" : "result_gate",
    caseId: encounter.frozenCase.id, nodeId: node.id, questionVariantId: node.questionVariantId,
    choiceId: choice.id, choiceLabel: choice.label, serviceId: source.serviceId, routeId: source.routeId,
    routeDisplayName: source.routeDisplayName, externalRemainder: terminal?.externalRemainder ?? continuation?.externalRemainder ?? null,
    ...(componentId ? { componentId } : {}) };
}

function canRunPlan(encounter: EncounterState, plan: DiagnosticOrderPlan): boolean {
  if (plan.execution !== "supported") return false;
  const step = encounter.steps.find((candidate) => candidate.result?.diagnosticTiming?.orderId === plan.orderId);
  return step?.status !== "feedback_pending" &&
    !(encounter.testOnlyContinuation?.diagnosticTiming?.orderId === plan.orderId && encounter.testOnlyContinuation.status === "feedback_pending") &&
    !(encounter.stagedResultOrder?.diagnosticTiming?.orderId === plan.orderId && encounter.stagedResultOrder.status === "feedback_pending");
}

/** Called before and after service execution; it never completes work from an ETA. */
export function advanceDiagnosticOrders(state: GameState, context: DomainContext, actions: DiagnosticPatientActions): void {
  for (const frozenPlan of getDiagnosticOrderPlans(state)) {
    const encounter = state.encounters[frozenPlan.encounterId];
    if (!encounter || !hasOutstandingDiagnosticWork(frozenPlan) || !canRunPlan(encounter, frozenPlan)) continue;
    let plan = copy(frozenPlan);
    const careWasComplete = plan.careComplete.reachedAtTick !== null;
    for (const phase of plan.phases) {
      if (finished(phase) || phase.status === "cancelled") continue;
      if (phase.serviceOperationId) {
        synchronizeOperationPhase(state, phase);
        if (phase.serviceOperationId || finished(phase)) continue;
      }
      if (!phase.dependsOn.every((id) => plan.phases.some((entry) => entry.id === id && finished(entry)))) continue;
      const dependenciesAt = Math.max(plan.createdAtTick, ...phase.dependsOn.map((id) => plan.phases.find((entry) => entry.id === id)!.completedAtTick!));
      if (phase.kind === "patient_departure" || phase.kind === "patient_return") {
        if (phase.status === "active") {
          if (encounter.patientMovement === null && (phase.kind === "patient_departure" ? encounter.patientLocation === null
            : samePoint(encounter.patientLocation, phase.forecast.patientPath.at(-1)))) completePhase(phase, state.facilityTick);
          continue;
        }
        if (encounter.patientMovement !== null) continue;
        const path = actions.walkingPath(encounter, phase);
        if (!path.length) { phase.status = "queued"; continue; }
        phase.forecast.patientPath = copy(path);
        phase.startedAtTick = state.facilityTick;
        phase.status = "active";
        replaceDiagnosticOrderPlan(encounter, plan);
        actions.releaseCare(encounter);
        actions.startMovement(encounter, phase.kind === "patient_departure" ? "departing_for_offsite_testing"
          : encounter.patientLocation === null ? "returning_from_offsite_testing" : "returning_from_onsite_service", path,
          phase.kind === "patient_departure" ? null : actions.roomAt(path.at(-1)!));
        if (encounter.patientMovement === null && (phase.kind === "patient_departure" ? encounter.patientLocation === null
          : samePoint(encounter.patientLocation, path.at(-1)))) completePhase(phase, state.facilityTick);
      } else if (phase.mode === "local" && phase.requirement) {
        if (phase.patientPresent) {
          if (encounter.patientMovement !== null) continue;
          const choiceOrder = choiceOrderFor(encounter, plan, phase.componentId);
          if (!choiceOrder) continue;
          const source = plan.sources.find((entry) => entry.componentId === phase.componentId)!;
          const id = startDiagnosticAcquisitionOperation(state, encounter, plan, phase.componentId,
            source.routeId ? getServiceIncomeForRoute(source.routeId)?.id ?? null : null, choiceOrder, context);
          if (!id) { phase.status = "queued"; continue; }
          for (const physical of plan.phases.filter((entry) => entry.componentId === phase.componentId && entry.mode === "local" && entry.patientPresent && entry.requirement)) {
            if (!finished(physical)) physical.serviceOperationId = id;
          }
          if (encounter.terminalTestOrder?.diagnosticTiming?.orderId === plan.orderId) encounter.terminalTestOrder.serviceOperationId = id;
          if (encounter.testOnlyContinuation?.diagnosticTiming?.orderId === plan.orderId) encounter.testOnlyContinuation.serviceOperationId = id;
          const component = encounter.stagedResultOrder?.components.find((entry) => entry.componentId === phase.componentId);
          if (component) component.serviceOperationId = id;
          synchronizeOperationPhase(state, phase);
        } else {
          const id = startDiagnosticProcessingOperation(state, plan, phase.id, context);
          if (!id) { phase.status = "queued"; continue; }
          phase.serviceOperationId = id;
          synchronizeOperationPhase(state, phase);
        }
      } else {
        if (phase.patientPresent && phase.mode === "local" && encounter.patientMovement !== null) continue;
        if (phase.status !== "active") {
          phase.startedAtTick = Math.max(dependenciesAt, state.facilityTick);
          phase.status = "active";
        }
        const ends = phase.startedAtTick! + phase.remainingMinutes;
        if (state.facilityTick >= ends) completePhase(phase, ends);
      }
    }
    for (const milestone of [plan.resultReady, plan.careComplete, plan.visualResultReady]) {
      if (milestone && milestone.reachedAtTick === null && milestone.afterPhaseIds.every((id) => plan.phases.some((phase) => phase.id === id && finished(phase)))) {
        milestone.reachedAtTick = Math.max(plan.createdAtTick, ...milestone.afterPhaseIds.map((id) => plan.phases.find((phase) => phase.id === id)!.completedAtTick!));
      }
    }
    plan = forecastDiagnosticOrderPlan(state, plan, context).plan;
    replaceDiagnosticOrderPlan(encounter, plan);
    if (!careWasComplete && plan.careComplete.reachedAtTick !== null) {
      if (encounter.testOnlyContinuation?.diagnosticTiming?.orderId === plan.orderId) {
        encounter.testOnlyContinuation.status = "completed";
        encounter.testOnlyContinuation.completedAtFacilityTick = plan.careComplete.reachedAtTick;
      }
      actions.careCompleted(encounter);
    }
  }
}
