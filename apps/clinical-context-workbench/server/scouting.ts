import {
  CrossrefMetadataClient,
  PubMedMetadataClient,
  coordinateDueMetadataScouts,
  resolvePrivateIntakePaths,
  type CrossrefSearchClient,
  type PubMedSearchClient,
} from "@gamify-surgery/clinical-research/node";
import type {
  EvidenceGapRevision,
  ResearchWorkspace,
} from "@gamify-surgery/clinical-research";

import type { ScoutCoordinator, ScoutStatus } from "./api.js";

const LOCAL_SCOUT_ACTOR = "automation.local.metadata-scout";
const LOCAL_SCOUT_TOOL = "gamify_surgery_clinical_context_workbench";

export interface ClinicalScoutEnvironment {
  CLINICAL_SCOUT_CONTACT_EMAIL?: string;
  CLINICAL_SCOUT_AUTO?: string;
  NCBI_API_KEY?: string;
}

export interface CreateLocalScoutCoordinatorOptions {
  repositoryRoot: string;
  environment: ClinicalScoutEnvironment;
  pubmed?: PubMedSearchClient;
  crossref?: CrossrefSearchClient;
}

const parseAutomatic = (value: string | undefined): boolean => {
  if (value === undefined || value.trim() === "") return true;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
};

const latestGapRevision = (
  workspace: ResearchWorkspace,
  gapId: string,
): EvidenceGapRevision | null => {
  const revisions = workspace.evidenceGapRevisions.filter(
    (revision) => revision.gapId === gapId,
  );
  if (revisions.length === 0) return null;
  const superseded = new Set(
    revisions.flatMap((revision) =>
      revision.supersedesRevisionId
        ? [revision.supersedesRevisionId]
        : [],
    ),
  );
  const leaves = revisions.filter(
    (revision) => !superseded.has(revision.revisionId),
  );
  return (
    leaves.sort(
      (left, right) =>
        Date.parse(right.recordedAt) - Date.parse(left.recordedAt),
    )[0] ?? null
  );
};

/**
 * Construct the trusted Node-only metadata scout.
 *
 * Provider contact values and API keys stay in this closure. The browser sees
 * only the three booleans returned from status().
 */
export const createLocalScoutCoordinator = (
  options: CreateLocalScoutCoordinatorOptions,
): ScoutCoordinator => {
  const contactEmail =
    options.environment.CLINICAL_SCOUT_CONTACT_EMAIL?.trim() ?? "";
  const automatic = parseAutomatic(
    options.environment.CLINICAL_SCOUT_AUTO,
  );
  const configured =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) &&
    contactEmail.length <= 320;
  const paths = resolvePrivateIntakePaths(options.repositoryRoot);

  const pubmed =
    options.pubmed ??
    (configured
      ? new PubMedMetadataClient({
          contactEmail,
          toolName: LOCAL_SCOUT_TOOL,
          apiKey: options.environment.NCBI_API_KEY,
        })
      : null);
  const crossref =
    options.crossref ??
    (configured
      ? new CrossrefMetadataClient({
          contactEmail,
          toolName: LOCAL_SCOUT_TOOL,
        })
      : null);
  const enabled = configured && pubmed !== null && crossref !== null;

  const status = (): ScoutStatus => ({
    configured,
    automatic,
    enabled,
  });

  const run = async (
    workspace: ResearchWorkspace,
    gapRevisionIds?: readonly string[],
    forceSelected = false,
  ): Promise<ResearchWorkspace> => {
    if (!enabled || pubmed === null || crossref === null) {
      return workspace;
    }
    const result = await coordinateDueMetadataScouts({
      workspace,
      paths,
      pubmed,
      crossref,
      recordedBy: LOCAL_SCOUT_ACTOR,
      gapRevisionIds,
      forceSelected,
    });
    return result.workspace;
  };

  return {
    status,
    async scout(workspace, evidenceGapId) {
      const revision = latestGapRevision(workspace, evidenceGapId);
      if (!revision) {
        throw new Error("The selected evidence gap has no current revision.");
      }
      return run(workspace, [revision.revisionId], true);
    },
    async scoutDue(workspace) {
      if (!automatic) return null;
      const next = await run(workspace);
      return next.updatedAt === workspace.updatedAt ? null : next;
    },
  };
};
