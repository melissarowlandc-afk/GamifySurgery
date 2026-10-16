import { characterStillCatalogEntryById, createPatientDisplayName, createPatientPixelAppearance, startRetailPurchase,
  type DomainContext, type GameState, type RetailExternalActorState } from "@gamify-surgery/game-domain";
import { placeLevelFiveRoomsQaRooms } from "./level-five-rooms";
import { prepareLevelFiveExecutiveQaState } from "./level-five-executive";

export const LEVEL_FIVE_GIFT_QA_PREFIX = "campaign.qa.level-five-gift-m5";
/** Explicit adult identity/standing location for a disposable checkout request;
 * quote, route, queue, dispensing and receipt still use production handlers. */
export function addGiftQaVisitor(state: GameState, id: string, giftOnly = true, location = { x: 35, y: 21 }): RetailExternalActorState {
  const seed = `${state.campaignSeed}|gift-retail.v1`, appearance = createPatientPixelAppearance(seed, id, {}, "patient");
  const still = characterStillCatalogEntryById(appearance.stillId)!;
  if (still.category !== "patient" || (still.compatibleSexLabel !== "Female" && still.compatibleSexLabel !== "Male")) throw new Error("Adult gift QA art required.");
  const sexLabel = still.compatibleSexLabel;
  const actor: RetailExternalActorState = { id, kind: "retail_visitor", displayName: createPatientDisplayName(seed, id, sexLabel), appearance,
    ...(giftOnly ? { giftOnlyVisit: { version: "gift-only-visit.v1" as const, opportunitySequence: 0,
      ageYears: still.intendedAge ?? (still.ageBand === "young_adult" ? 24 : still.ageBand === "adult" ? 38 : still.ageBand === "middle_aged" ? 54 : 70), sexLabel } } : {}),
    linkedServiceOperationId: null, linkedEncounterId: null, lifecycle: "onsite", location, path: [location], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, activeRetailOperationId: null };
  state.retailExternalActors.push(actor);
  return actor;
}

/** Real builds and optional real Executive hire. No paid gifts or supplier round
 * seeded. The first opportunity clock / initial queue identities are QA metadata. */
export function prepareLevelFiveGiftQaState(state: GameState, context: DomainContext, scenario: "gift" | "gift-queue" | "gift-suppliers"): GameState {
  state = scenario === "gift-suppliers" ? prepareLevelFiveExecutiveQaState(state, context, "executive") : placeLevelFiveRoomsQaRooms(state, context);
  state.giftRetailDemand = { version: "gift-retail-demand.v1", nextOpportunityAtFacilityTick: state.facilityTick + (scenario === "gift" ? 1 : 120), opportunitySequence: 0 };
  if (scenario === "gift-queue") {
    for (let i = 0; i < 3; i++) {
      const actor = addGiftQaVisitor(state, `gift-qa.${i}`);
      const id = startRetailPurchase(state, "income.gift_shop", "retail_visitor", actor.id, context);
      if (!id) throw new Error(`Gift QA request ${i} did not reserve its actual checkout contact.`);
    }
  }
  // Save/read the real accepted quotes; no simulation reward is inserted.
  return state;
}
