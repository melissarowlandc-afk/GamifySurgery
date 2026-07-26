import type { SanitizedAuthoringContextDto } from "./api.js";
import type { GapViewDto } from "./model.js";

export type SanitizedAuthoringTarget =
  | SanitizedAuthoringContextDto["topicRevisions"][number]
  | SanitizedAuthoringContextDto["structuredFacts"][number]
  | SanitizedAuthoringContextDto["testedConcepts"][number];

export type EvidenceGapPrefill = {
  title: string;
  clinicalQuestion: string;
  whyNeeded: string;
  acceptanceCriteria: string[];
  targetKind: SanitizedAuthoringTarget["kind"];
  targetId: string;
  preferredSourceTypes: string[];
  provider: "pubmed";
  query: string;
  refreshIntervalDays: number;
};

export function listUncoveredAuthoringTargets(
  context: SanitizedAuthoringContextDto | null,
  gaps: readonly GapViewDto[],
): SanitizedAuthoringTarget[] {
  if (context === null) return [];
  const coveredTargets = new Set(
    gaps.flatMap((gap) =>
      gap.targetContent.map((target) => `${target.kind}:${target.id}`),
    ),
  );
  return [
    ...context.structuredFacts,
    ...context.testedConcepts,
    ...context.topicRevisions,
  ].filter(
    (target) => !coveredTargets.has(`${target.kind}:${target.id}`),
  );
}

function pubMedPhrase(label: string, fallback: string): string {
  const normalized = label
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s.,'’()/-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  return normalized || fallback;
}

export function buildEvidenceGapPrefill(
  target: SanitizedAuthoringTarget,
): EvidenceGapPrefill {
  const searchLabel = pubMedPhrase(target.label, target.entityId);
  return {
    title: `Current evidence for ${target.label}`,
    clinicalQuestion:
      `What current authoritative evidence supports, limits, or conflicts with ${target.label}?`,
    whyNeeded:
      "The synced authoring target has no Evidence Gap in this research workspace.",
    acceptanceCriteria: [
      "At least one current authoritative source is screened, or its absence is documented.",
      "Clinical applicability and limitations are reviewed by an authorized clinical reviewer.",
      "Conflicting, corrected, retracted, or superseded guidance is explicitly recorded.",
    ],
    targetKind: target.kind,
    targetId: target.id,
    preferredSourceTypes: [
      "clinical_guideline",
      "systematic_review",
      "meta_analysis",
    ],
    provider: "pubmed",
    query:
      `"${searchLabel}" AND (` +
      'guideline[pt] OR "practice guideline"[pt] OR systematic[sb] OR meta-analysis[pt])',
    refreshIntervalDays: 90,
  };
}
