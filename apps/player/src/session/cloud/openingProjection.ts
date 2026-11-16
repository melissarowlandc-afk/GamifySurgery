import type { GameState } from "@gamify-surgery/game-domain";
import { getInitialFacilityCamera } from "../../facility/defaultCamera";
import { createFacilityCameraPreferenceSession } from "../facilityCameraPreference";
import { loadQuestionReviewFlags } from "../questionReviewFlags";
import type { OperationalViewArguments } from "./operationalViewProjection";

/** Match the first usePrototypeSession render, including origin-local inputs.
 * Reading preferences neither revises a campaign nor queues a save. */
export function cloudOpeningProjection(state: GameState, accountId: string, casualMode: boolean | null): OperationalViewArguments {
  const camera = createFacilityCameraPreferenceSession().restore(state.campaignId, getInitialFacilityCamera(state));
  return [state.openChartEncounterId, false, null, false, null, 0, camera, loadQuestionReviewFlags(undefined, accountId), casualMode];
}
