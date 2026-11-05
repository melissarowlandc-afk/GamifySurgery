import type { SyntheticClinicalRelease } from "@gamify-surgery/clinical-content";
import { PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState, gameReducer } from "@gamify-surgery/game-domain";

/** Historical authoring goldens exercise an explicit complete stage. Default
 * release admission is covered separately by question-ship-gate.test.ts. */
export function createClinicalAuthorStage(release: SyntheticClinicalRelease) {
  const context = { ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: release };
  const initial: typeof createInitialGameState = (provided = context, options) => createInitialGameState(provided, options);
  const reduce: typeof gameReducer = (state, command, provided = context) => gameReducer(state, command, provided);
  const restore: typeof deserializeGameState = (serialized, provided = context) => deserializeGameState(serialized, provided);
  return { context, createInitialGameState: initial, gameReducer: reduce, deserializeGameState: restore };
}
