/** Account presentation only: never mutate the frozen choices or their order. */
export function visibleQuestionChoices<T extends { isCorrect: boolean }>(
  choices: readonly T[], casualMode: boolean | null,
): readonly T[] {
  // A hosted account's initial access check must finish before exposing choices.
  if (casualMode === null) return [];
  return casualMode ? choices.filter(choice => choice.isCorrect) : choices;
}
