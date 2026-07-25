import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { SYNTHETIC_CLINICAL_RELEASE } from "@gamify-surgery/clinical-content";
import type { DomainContext } from "./types";

export function validateDomainContext(context: DomainContext): DomainContext {
  const services = new Map(
    context.balanceRelease.services.map((service) => [service.id, service]),
  );
  const rewardTierIds = new Set(
    context.balanceRelease.clinicalSettlement.patientRewardTiers.map(
      (tier) => tier.id,
    ),
  );
  for (const clinicalCase of context.clinicalRelease.cases) {
    if (!rewardTierIds.has(clinicalCase.rewardTierId)) {
      throw new Error(
        `Clinical case ${clinicalCase.id} references missing reward tier ${clinicalCase.rewardTierId}.`,
      );
    }
    for (const node of clinicalCase.decisionNodes) {
      for (const choice of node.answerChoices) {
        const requestedServiceId = choice.serviceRequest?.serviceId;
        if (requestedServiceId && !services.has(requestedServiceId)) {
          throw new Error(
            `Answer choice ${choice.id} references missing service ${requestedServiceId}.`,
          );
        }
      }
      const gate = node.resultGateAfter;
      if (!gate) {
        continue;
      }
      const service = services.get(gate.resultTypeId);
      if (!service) {
        throw new Error(
          `Clinical gate ${gate.id} references missing service ${gate.resultTypeId}.`,
        );
      }
      const routeIds = new Set(service.routes.map((route) => route.id));
      for (const routeId of gate.allowedServiceRouteIds) {
        if (!routeIds.has(routeId)) {
          throw new Error(
            `Clinical gate ${gate.id} references missing route ${routeId}.`,
          );
        }
      }
    }
  }
  return context;
}

export const PROTOTYPE_DOMAIN_CONTEXT: DomainContext = validateDomainContext({
  clinicalRelease: SYNTHETIC_CLINICAL_RELEASE,
  balanceRelease: PROTOTYPE_BALANCE_RELEASE,
});

export const TUTORIAL_ENCOUNTER_ID = "encounter.synthetic.tutorial";
export const SECOND_TUTORIAL_ENCOUNTER_ID =
  "encounter.prototype.tutorial-laceration";
