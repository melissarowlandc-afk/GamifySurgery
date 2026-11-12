import { createNewFsrsCard, PROTOTYPE_DOMAIN_CONTEXT, type DomainContext, type GameState } from "@gamify-surgery/game-domain";

/** Apply only the additive learning part of the local persistence contract.
 * Native snapshot verification/selection stays byte-faithful. Once selected,
 * a playable baseline needs all current and still-frozen concepts BEFORE any
 * command: the evidence contract correctly forbids changing its concept set.
 * Never migrate/replay supplied cards, reviews, frozen questions or world state.
 */
export function completeSnapshotLearning(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT): GameState {
  const concepts = new Set(context.clinicalRelease.concepts.map(concept => concept.id));
  for (const encounter of Object.values(state.encounters))
    for (const node of encounter.frozenCase.decisionNodes) concepts.add(node.primaryConceptId);
  for (const discussion of Object.values(state.employeeDiscussions ?? {}))
    for (const node of discussion.frozenCase.decisionNodes) concepts.add(node.primaryConceptId);
  const missing = [...concepts].filter(id => !Object.hasOwn(state.learningHistories, id));
  if (!missing.length) return state;
  const learningHistories = { ...state.learningHistories };
  for (const conceptId of missing) learningHistories[conceptId] = {
    conceptId, card: createNewFsrsCard(state.createdAtRealMs), reviews: [],
  };
  return { ...state, learningHistories };
}
