// Resolve cross-batch context against the complete exported evidence catalog.
// These reference existing records; they do not create a clinical catalog.
import * as catalog from "../../index";
import type { ClinicalSource, EvidenceClaim } from "../../pilot-schema";

const claims = new Map<string, EvidenceClaim>();
const sources = new Map<string, ClinicalSource>();
for (const value of Object.values(catalog)) {
  if (!Array.isArray(value)) continue;
  for (const item of value as unknown[]) {
    const record = item as { id?: unknown; sourceIds?: unknown; evidenceClaimIds?: unknown } | null;
    if (!record || typeof record !== "object" || typeof record.id !== "string") continue;
    if (record.id.startsWith("claim.") && Array.isArray(record.sourceIds)) {
      claims.set(record.id, record as EvidenceClaim);
    }
    if (record.id.startsWith("source.") && Array.isArray(record.evidenceClaimIds)) {
      const source = record as ClinicalSource;
      const prior = sources.get(source.id);
      sources.set(source.id, prior ? {
        ...prior,
        evidenceClaimIds: [...new Set([...prior.evidenceClaimIds, ...source.evidenceClaimIds])],
      } : source);
    }
  }
}

export const EXISTING_ANCHOR_CLAIMS = [...claims.values()];
export const EXISTING_ANCHOR_SOURCES = [...sources.values()];
