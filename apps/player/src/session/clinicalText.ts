export interface ClinicalDecisionText {
  question: string;
  context?: string;
}

const QUESTION_OPENERS = [
  "Which",
  "What",
  "How",
  "When",
  "Where",
  "Who",
  "Should",
  "Does",
  "Do",
  "Is",
  "Are",
  "Select",
  "Choose",
  "Identify",
] as const;

/**
 * Separates vignette/update prose from the actual decision prompt for display.
 * The authored stem remains untouched in the frozen encounter and provenance
 * records; this only prevents the chart from rendering patient presentation
 * prose a second time above the answer choices.
 */
export function splitClinicalDecisionStem(
  authoredStem: string,
): ClinicalDecisionText {
  const stem = authoredStem.trim().replace(/\s+/g, " ");
  if (!stem) {
    return { question: "" };
  }

  const openerPattern = new RegExp(
    `\\b(${QUESTION_OPENERS.join("|")})\\b`,
    "gi",
  );
  const candidates = [...stem.matchAll(openerPattern)].filter((match) => {
    const index = match.index ?? 0;
    if (index === 0) {
      return true;
    }
    const prefix = stem.slice(0, index);
    const opener = match[0] ?? "";
    return (
      /^[A-Z]/.test(opener) ||
      /[.!?:;,]\s*$/.test(prefix)
    );
  });
  const questionMatch = candidates.at(-1);
  const questionStart = questionMatch?.index ?? -1;

  if (questionStart <= 0) {
    return { question: stem };
  }

  const context = stem.slice(0, questionStart).trim();
  const question = stem.slice(questionStart).trim();
  if (!context || !question) {
    return { question: stem };
  }
  return { context, question };
}
