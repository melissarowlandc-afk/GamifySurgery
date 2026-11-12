import { getAnswerChoiceServicePreview, type GameState } from "@gamify-surgery/game-domain";

/** One chart projection owns this cache; both its header and decision rows read
 * the same preview, including null/non-testing choices and distractor waits. */
export function diagnosticChoicePreviews(state: GameState) {
  const previews = new Map<string, ReturnType<typeof getAnswerChoiceServicePreview>>();
  return (encounterId: string, choiceId: string) => {
    const key = JSON.stringify([encounterId, choiceId]);
    if (!previews.has(key)) previews.set(key, getAnswerChoiceServicePreview(state, encounterId, choiceId));
    return previews.get(key)!;
  };
}
