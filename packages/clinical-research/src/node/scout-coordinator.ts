import { createHash } from "node:crypto";

import type {
  EvidenceCandidate,
  EvidenceCandidateObservation,
  EvidenceGapRevision,
  EvidenceSearchRun,
  ScoutPolicy,
  SourceType,
} from "../schemas.js";
import {
  assertAppendOnlyWorkspaceTransition,
  validateResearchWorkspace,
  type ResearchWorkspace,
} from "../workspace.js";
import {
  sanitizeMetadataProviderError,
  writeMetadataScoutArtifact,
  type CrossrefMetadataSearchRun,
  type MetadataScoutCandidate,
  type MetadataScoutCoordinatorArtifact,
  type MetadataScoutRun,
  type PubMedMetadataSearchRun,
} from "./metadata-scout.js";
import type { PrivateIntakePaths } from "./private-paths.js";

export const SCOUT_COORDINATOR_STRATEGY_VERSION =
  "clinical-research.metadata-scout-strategy.v1";
export const SCOUT_COORDINATOR_TOOL_ID =
  "clinical-research.metadata-scout";
export const SCOUT_COORDINATOR_TOOL_VERSION = "1.0.0";

export interface PubMedSearchClient {
  search: (
    query: string,
    options?: {
      maxResults?: number;
      sort?: "pub date" | "relevance";
      publicationYearFloor?: number | null;
    },
  ) => Promise<PubMedMetadataSearchRun>;
}

export interface CrossrefSearchClient {
  search: (
    query: string,
    options?: {
      maxResults?: number;
      publicationYearFloor?: number | null;
      workType?: "journal-article" | "proceedings-article" | null;
    },
  ) => Promise<CrossrefMetadataSearchRun>;
}

export interface MetadataScoutCoordinatorClock {
  now: () => Date;
}

export interface CoordinateDueMetadataScoutsOptions {
  workspace: unknown;
  paths: PrivateIntakePaths;
  pubmed: PubMedSearchClient;
  crossref: CrossrefSearchClient;
  recordedBy: string;
  /**
   * Optional latest gap-revision subset. Omit to evaluate every latest
   * revision. Older revisions are never scouted as though they were current.
   */
  gapRevisionIds?: readonly string[];
  /**
   * Explicit user-triggered "Scout now". Valid only with an explicit revision
   * subset and always appends new runs; it never replaces prior results.
   */
  forceSelected?: boolean;
  clock?: MetadataScoutCoordinatorClock;
}

export interface CoordinateDueMetadataScoutsResult {
  workspace: ResearchWorkspace;
  dueGapRevisionIds: string[];
  searchRunIds: string[];
  /** Every canonical Candidate observed by the completed runs. */
  candidateIds: string[];
  /** Canonical Candidates first created by the completed runs. */
  newCandidateIds: string[];
  candidateObservationIds: string[];
  providerArtifactPaths: string[];
  skippedNotDueGapRevisionIds: string[];
}

interface ProviderExecution {
  providerRun: MetadataScoutRun | null;
  candidates: MetadataScoutCandidate[];
  totalResultCount: number;
  reviewedResultCount: number;
  status: EvidenceSearchRun["status"];
  statusNote: string | null;
  failure: MetadataScoutCoordinatorArtifact["failure"];
  manualActionRequired: boolean;
  appliedFilters: string[];
}

const systemClock: MetadataScoutCoordinatorClock = {
  now: () => new Date(),
};

const sha256 = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, canonicalize(nested)]),
  );
};

const fingerprint = (value: unknown): string =>
  sha256(JSON.stringify(canonicalize(value)));

const clean = (value: string, maximum: number): string =>
  value.replaceAll(/\s+/g, " ").trim().slice(0, maximum).trim();

const unique = <Value>(values: readonly Value[]): Value[] => [
  ...new Set(values),
];

const latestGapRevisions = (
  workspace: ResearchWorkspace,
): EvidenceGapRevision[] => {
  const superseded = new Set(
    workspace.evidenceGapRevisions.flatMap((revision) =>
      revision.supersedesRevisionId ? [revision.supersedesRevisionId] : [],
    ),
  );
  return workspace.evidenceGapRevisions.filter(
    (revision) => !superseded.has(revision.revisionId),
  );
};

const strategyFingerprint = (
  revision: EvidenceGapRevision,
  strategyIndex: number,
): string =>
  fingerprint({
    gapRevisionId: revision.revisionId,
    scoutPolicy: revision.scoutPolicy,
    strategyIndex,
    strategy: revision.scoutPolicy.providerStrategies[strategyIndex],
    coordinatorStrategyVersion: SCOUT_COORDINATOR_STRATEGY_VERSION,
  });

const FAILED_SCOUT_RETRY_BASE_MILLISECONDS = 6 * 60 * 60 * 1_000;
const FAILED_SCOUT_RETRY_MAX_MILLISECONDS = 24 * 60 * 60 * 1_000;

const isStrategyDue = (
  workspace: ResearchWorkspace,
  revision: EvidenceGapRevision,
  strategyIndex: number,
  now: Date,
): boolean => {
  const refreshDays = revision.scoutPolicy.refreshIntervalDays;
  if (refreshDays === null) return false;
  const input = strategyFingerprint(revision, strategyIndex);
  const matchingRuns = workspace.searchRuns
    .filter(
      (run) =>
        run.gapRevisionIds.includes(revision.revisionId) &&
        run.inputFingerprint === input,
    )
    .sort(
      (left, right) =>
        Date.parse(right.completedAt) - Date.parse(left.completedAt),
    );
  const latest = matchingRuns[0];
  if (!latest) return true;
  if (latest.status === "failed") {
    const consecutiveFailures = matchingRuns.findIndex(
      (run) => run.status !== "failed",
    );
    const failureCount =
      consecutiveFailures === -1
        ? matchingRuns.length
        : consecutiveFailures;
    const retryDelay = Math.min(
      FAILED_SCOUT_RETRY_MAX_MILLISECONDS,
      FAILED_SCOUT_RETRY_BASE_MILLISECONDS *
        2 ** Math.max(0, failureCount - 1),
    );
    return (
      now.getTime() - Date.parse(latest.completedAt) >= retryDelay
    );
  }
  return (
    now.getTime() - Date.parse(latest.completedAt) >=
    refreshDays * 24 * 60 * 60 * 1_000
  );
};

const recognizedPubMedSort = (
  filters: readonly string[],
): "pub date" | "relevance" => {
  const relevance = filters.some((filter) =>
    /^sort\s*[:=]\s*relevance$/i.test(filter.trim()),
  );
  return relevance ? "relevance" : "pub date";
};

const recognizedCrossrefWorkType = (
  filters: readonly string[],
): "journal-article" | "proceedings-article" | null => {
  for (const filter of filters) {
    const normalized = filter.trim().toLocaleLowerCase().replaceAll("_", " ");
    if (
      ["journal article", "type:journal-article", "type=journal-article"].includes(
        normalized,
      )
    ) {
      return "journal-article";
    }
    if (
      [
        "proceedings article",
        "type:proceedings-article",
        "type=proceedings-article",
      ].includes(normalized)
    ) {
      return "proceedings-article";
    }
  }
  return null;
};

const normalizeLanguage = (language: string | null): string | null => {
  if (!language) return null;
  const normalized = language.trim().toLocaleLowerCase();
  const known: Record<string, string> = {
    eng: "English",
    en: "English",
    english: "English",
    spa: "Spanish",
    es: "Spanish",
    fre: "French",
    fra: "French",
    fr: "French",
    ger: "German",
    deu: "German",
    de: "German",
  };
  return known[normalized] ?? clean(language, 80);
};

const publicationClassification = (
  candidate: MetadataScoutCandidate,
): {
  sourceType: SourceType;
  authoritySignals: EvidenceCandidate["authoritySignals"];
} => {
  const types = candidate.publicationTypes
    .map((value) => value.toLocaleLowerCase())
    .join(" ");
  if (types.includes("meta-analysis") || types.includes("meta analysis")) {
    return {
      sourceType: "meta_analysis",
      authoritySignals: [],
    };
  }
  if (types.includes("systematic review")) {
    return {
      sourceType: "systematic_review",
      authoritySignals: [],
    };
  }
  if (types.includes("guideline")) {
    return {
      sourceType: "clinical_guideline",
      authoritySignals: [],
    };
  }
  return {
    sourceType: "journal_article",
    authoritySignals: [],
  };
};

const isPreprint = (candidate: MetadataScoutCandidate): boolean =>
  candidate.publicationTypes.some((publicationType) =>
    /(?:^|\b)(?:preprint|posted-content)(?:\b|$)/i.test(publicationType),
  );

const satisfiesPublicationYearFloor = (
  candidate: MetadataScoutCandidate,
  floor: number | null,
): boolean => {
  if (floor === null || candidate.publicationDate === null) return true;
  const match = /(?:^|\D)(\d{4})(?:\D|$)/.exec(candidate.publicationDate);
  return match ? Number(match[1]) >= floor : true;
};

const eligibleProviderCandidate = (
  candidate: MetadataScoutCandidate,
  policy: ScoutPolicy,
): boolean =>
  (policy.includePreprints || !isPreprint(candidate)) &&
  satisfiesPublicationYearFloor(candidate, policy.publicationYearFloor);

const validUrl = (value: string): string | null => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
};

const mapCandidate = (
  providerCandidate: MetadataScoutCandidate,
  runId: string,
  query: string,
  gapRevision: EvidenceGapRevision,
  discoveredAt: string,
  recordedAt: string,
  recordedBy: string,
): EvidenceCandidate | null => {
  const title = clean(providerCandidate.title, 700);
  if (!title) return null;
  const authors = providerCandidate.authors
    .map((author) => clean(author, 200))
    .filter(Boolean);
  const organizationCandidate =
    providerCandidate.publisher ?? providerCandidate.containerTitle;
  const organization =
    organizationCandidate && !authors.length
      ? clean(organizationCandidate, 300)
      : null;
  if (authors.length === 0 && !organization) return null;
  const publicationTypes = providerCandidate.publicationTypes
    .map((publicationType) => clean(publicationType, 160))
    .filter(Boolean);
  const classification = publicationClassification(providerCandidate);
  const doi =
    providerCandidate.doi &&
    /^10\.\d{4,9}\/\S+$/i.test(providerCandidate.doi)
      ? providerCandidate.doi.toLocaleLowerCase()
      : null;
  const pmid =
    providerCandidate.pmid && /^\d+$/.test(providerCandidate.pmid)
      ? providerCandidate.pmid
      : null;
  const publicationDate = providerCandidate.publicationDate
    ? clean(providerCandidate.publicationDate, 40)
    : null;
  const container = providerCandidate.containerTitle
    ? clean(providerCandidate.containerTitle, 300)
    : null;
  const lead = authors[0] ?? organization!;
  const citation = clean(
    [
      lead,
      title,
      container,
      publicationDate,
      doi ? `doi:${doi}` : null,
      pmid ? `PMID:${pmid}` : null,
    ]
      .filter((value): value is string => Boolean(value))
      .join(". "),
    1_600,
  );
  const bibliographicIdentity = doi
    ? { kind: "doi", value: doi }
    : pmid
      ? { kind: "pmid", value: pmid }
      : {
          kind: "provider_record",
          provider: providerCandidate.provider,
          value: providerCandidate.providerRecordId,
        };
  const id = `evidence-candidate.${fingerprint(bibliographicIdentity)}`;
  return {
    id,
    searchRunId: runId,
    sourceType: classification.sourceType,
    title,
    authors,
    organization,
    publicationDate,
    doi,
    pmid,
    url: validUrl(providerCandidate.canonicalUrl),
    citation,
    publicationTypes,
    language: normalizeLanguage(providerCandidate.language),
    authoritySignals: unique(classification.authoritySignals),
    surfacingRationale: clean(
      `Matched the literal ${providerCandidate.provider} strategy for evidence gap "${gapRevision.title}": ${query}`,
      1_200,
    ),
    accessHint: "unknown",
    matchedExistingSourceId: null,
    metadataFingerprint: fingerprint(providerCandidate),
    discoveredAt,
    recordedAt,
    recordedBy,
  };
};

const existingCandidateFor = (
  candidates: readonly EvidenceCandidate[],
  candidate: EvidenceCandidate,
): { candidate: EvidenceCandidate | null; collision: boolean } => {
  const matches = candidates.filter(
    (existing) =>
      existing.id === candidate.id ||
      (candidate.doi !== null &&
        existing.doi?.toLocaleLowerCase() ===
          candidate.doi.toLocaleLowerCase()) ||
      (candidate.pmid !== null && existing.pmid === candidate.pmid),
  );
  const candidateIds = new Set(matches.map((match) => match.id));
  return candidateIds.size > 1
    ? { candidate: null, collision: true }
    : { candidate: matches[0] ?? null, collision: false };
};

const executeProvider = async (
  revision: EvidenceGapRevision,
  strategyIndex: number,
  clients: Pick<CoordinateDueMetadataScoutsOptions, "pubmed" | "crossref">,
): Promise<ProviderExecution> => {
  const strategy = revision.scoutPolicy.providerStrategies[strategyIndex]!;
  const maximumCandidates = Math.min(
    revision.scoutPolicy.maximumCandidates,
    100,
  );
  try {
    if (strategy.provider === "pubmed") {
      const providerRun = await clients.pubmed.search(strategy.query, {
        maxResults: maximumCandidates,
        sort: recognizedPubMedSort(strategy.filters),
        publicationYearFloor: revision.scoutPolicy.publicationYearFloor,
      });
      return {
        providerRun,
        candidates: providerRun.candidates,
        totalResultCount: Math.max(
          providerRun.totalResultCount,
          providerRun.candidates.length,
        ),
        reviewedResultCount: providerRun.candidates.length,
        status: "completed",
        statusNote: null,
        failure: null,
        manualActionRequired: false,
        appliedFilters: providerRun.appliedStructuredFilters,
      };
    }
    if (strategy.provider === "crossref") {
      const providerRun = await clients.crossref.search(strategy.query, {
        maxResults: maximumCandidates,
        publicationYearFloor: revision.scoutPolicy.publicationYearFloor,
        workType: recognizedCrossrefWorkType(strategy.filters),
      });
      return {
        providerRun,
        candidates: providerRun.candidates,
        totalResultCount: Math.max(
          providerRun.totalResultCount,
          providerRun.candidates.length,
        ),
        reviewedResultCount: providerRun.candidates.length,
        status: "completed",
        statusNote: null,
        failure: null,
        manualActionRequired: false,
        appliedFilters: providerRun.appliedStructuredFilters,
      };
    }
    return {
      providerRun: null,
      candidates: [],
      totalResultCount: 0,
      reviewedResultCount: 0,
      status: "partial",
      statusNote: clean(
        `Provider "${strategy.provider}" is not automated; this literal strategy requires manual execution and recording.`,
        2_000,
      ),
      failure: {
        code: "MANUAL_PROVIDER_REQUIRED",
        message: `Provider "${strategy.provider}" requires manual execution.`,
      },
      manualActionRequired: true,
      appliedFilters: [],
    };
  } catch (error) {
    return {
      providerRun: null,
      candidates: [],
      totalResultCount: 0,
      reviewedResultCount: 0,
      status: "failed",
      statusNote: clean(
        `Metadata-only ${strategy.provider} strategy failed: ${sanitizeMetadataProviderError(error)}`,
        2_000,
      ),
      failure: {
        code:
          isRecord(error) && typeof error.code === "string"
            ? clean(error.code, 160)
            : "PROVIDER_EXECUTION_FAILED",
        message: sanitizeMetadataProviderError(error),
      },
      manualActionRequired: false,
      appliedFilters: [],
    };
  }
};

const queryFilters = (
  strategy: ScoutPolicy["providerStrategies"][number],
  appliedFilters: readonly string[],
  manuallyForced: boolean,
): string[] =>
  unique([
    ...strategy.filters,
    ...appliedFilters,
    ...(manuallyForced ? ["manual forced refresh"] : []),
  ]);

export const coordinateDueMetadataScouts = async (
  options: CoordinateDueMetadataScoutsOptions,
): Promise<CoordinateDueMetadataScoutsResult> => {
  const previous = validateResearchWorkspace(options.workspace);
  if (
    !/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(options.recordedBy)
  ) {
    throw new Error("recordedBy must be a stable lowercase identifier.");
  }
  if (options.forceSelected && !options.gapRevisionIds) {
    throw new Error(
      "forceSelected is valid only with explicit gapRevisionIds.",
    );
  }
  const clock = options.clock ?? systemClock;
  const actualNow = clock.now();
  if (Number.isNaN(actualNow.getTime())) {
    throw new Error("Coordinator clock returned an invalid date.");
  }
  const selectedIds = options.gapRevisionIds
    ? new Set(options.gapRevisionIds)
    : null;
  const latest = latestGapRevisions(previous);
  if (selectedIds) {
    for (const id of selectedIds) {
      if (!latest.some((revision) => revision.revisionId === id)) {
        throw new Error(
          `Selected gap revision is unknown or no longer current: ${id}`,
        );
      }
    }
  }
  const active = latest.filter(
    (revision) =>
      (selectedIds === null || selectedIds.has(revision.revisionId)) &&
      !["resolved", "deferred", "withdrawn"].includes(revision.status) &&
      revision.scoutPolicy.mode !== "manual_only",
  );
  const due = active.filter(
    (revision) =>
      options.forceSelected ||
      revision.scoutPolicy.providerStrategies.some((_strategy, index) =>
        isStrategyDue(previous, revision, index, actualNow),
      ),
  );
  const skippedNotDue = active
    .filter((revision) => !due.includes(revision))
    .map((revision) => revision.revisionId);
  if (due.length === 0) {
    return {
      workspace: previous,
      dueGapRevisionIds: [],
      searchRunIds: [],
      candidateIds: [],
      newCandidateIds: [],
      candidateObservationIds: [],
      providerArtifactPaths: [],
      skippedNotDueGapRevisionIds: skippedNotDue,
    };
  }

  let logicalMilliseconds = Math.max(
    actualNow.getTime(),
    Date.parse(previous.updatedAt) + 1,
  );
  const timestamp = () =>
    new Date(logicalMilliseconds++).toISOString();
  const additions: EvidenceSearchRun[] = [];
  const candidateAdditions: EvidenceCandidate[] = [];
  const observationAdditions: EvidenceCandidateObservation[] = [];
  const observedCandidateIds = new Set<string>();
  const providerArtifactPaths: string[] = [];

  for (const revision of due) {
    for (
      let strategyIndex = 0;
      strategyIndex < revision.scoutPolicy.providerStrategies.length;
      strategyIndex += 1
    ) {
      if (
        !options.forceSelected &&
        !isStrategyDue(previous, revision, strategyIndex, actualNow)
      ) {
        continue;
      }
      const strategy =
        revision.scoutPolicy.providerStrategies[strategyIndex]!;
      const inputFingerprint = strategyFingerprint(revision, strategyIndex);
      const startedAt = timestamp();
      const execution = await executeProvider(revision, strategyIndex, options);
      const completedAt = timestamp();
      const runId = `evidence-search-run.${fingerprint({
        inputFingerprint,
        startedAt,
      })}`;
      const mappedCandidates = execution.candidates
        .filter((candidate) =>
          eligibleProviderCandidate(candidate, revision.scoutPolicy),
        )
        .slice(0, revision.scoutPolicy.maximumCandidates)
        .flatMap((candidate) => {
          const mapped = mapCandidate(
            candidate,
            runId,
            strategy.query,
            revision,
            startedAt,
            completedAt,
            options.recordedBy,
          );
          return mapped
            ? [
                {
                  candidate: mapped,
                  provider: candidate.provider,
                  providerRecordId: candidate.providerRecordId,
                },
              ]
            : [];
        });
      const canonicalCandidates: EvidenceCandidate[] = [];
      const runCandidateIds = new Set<string>();
      const observationStart = observationAdditions.length;
      let identityCollisionCount = 0;
      for (const mapped of mappedCandidates) {
        const mappedCandidate = mapped.candidate;
        const resolution = existingCandidateFor(
          [...previous.candidates, ...candidateAdditions],
          mappedCandidate,
        );
        if (resolution.collision) {
          identityCollisionCount += 1;
          continue;
        }
        const existing = resolution.candidate;
        const canonical = existing ?? mappedCandidate;
        if (runCandidateIds.has(canonical.id)) continue;
        runCandidateIds.add(canonical.id);
        canonicalCandidates.push(canonical);
        observedCandidateIds.add(canonical.id);
        if (existing === null) candidateAdditions.push(canonical);
        observationAdditions.push({
          id: `evidence-candidate-observation.${fingerprint({
            candidateId: canonical.id,
            runId,
          })}`,
          candidateId: canonical.id,
          searchRunId: runId,
          provider: mapped.provider,
          providerRecordId: mapped.providerRecordId,
          observedDoi: mappedCandidate.doi,
          observedPmid: mappedCandidate.pmid,
          metadataFingerprint: mappedCandidate.metadataFingerprint,
          observedAt: mappedCandidate.discoveredAt,
          recordedAt: completedAt,
          recordedBy: options.recordedBy,
        });
      }
      const runStatus =
        identityCollisionCount > 0 && execution.status === "completed"
          ? "partial"
          : execution.status;
      const collisionNote =
        identityCollisionCount > 0
          ? `${identityCollisionCount} provider record(s) were withheld because DOI/PMID identities conflicted with distinct canonical Candidates.`
          : null;
      const runStatusNote = [execution.statusNote, collisionNote]
        .filter((note): note is string => note !== null)
        .join(" ") || null;
      const run: EvidenceSearchRun = {
        id: runId,
        gapRevisionIds: [revision.revisionId],
        strategyVersion: SCOUT_COORDINATOR_STRATEGY_VERSION,
        scoutPolicyFingerprint: fingerprint(revision.scoutPolicy),
        queries: [
          {
            databaseOrRegistry: strategy.provider,
            query: strategy.query,
            filters: queryFilters(
              strategy,
              [
                ...execution.appliedFilters,
                ...(!revision.scoutPolicy.includePreprints
                  ? ["excludePreprints=true"]
                  : []),
              ],
              options.forceSelected === true,
            ),
          },
        ],
        startedAt,
        completedAt,
        searchThroughDate: completedAt.slice(0, 10),
        status: runStatus,
        providerResultCountTotal: execution.totalResultCount,
        providerRecordsInspected: Math.min(
          execution.reviewedResultCount,
          execution.totalResultCount,
        ),
        candidateCountCaptured: canonicalCandidates.length,
        toolId: SCOUT_COORDINATOR_TOOL_ID,
        toolVersion: SCOUT_COORDINATOR_TOOL_VERSION,
        inputFingerprint,
        statusNote: runStatusNote,
        recordedAt: completedAt,
        recordedBy: options.recordedBy,
      };
      const runObservationIds = observationAdditions
        .slice(observationStart)
        .map((observation) => observation.id);
      additions.push(run);
      const artifact: MetadataScoutCoordinatorArtifact = {
        schemaVersion: 1,
        id: `provider-discovery.${runId}`,
        gapRevisionId: revision.revisionId,
        provider: strategy.provider,
        query: strategy.query,
        declaredFilters: [...strategy.filters],
        canonicalSearchRun: run,
        canonicalCandidateIds: canonicalCandidates.map(
          (candidate) => candidate.id,
        ),
        canonicalCandidateObservationIds: runObservationIds,
        providerRun: execution.providerRun,
        failure: execution.failure,
        manualActionRequired: execution.manualActionRequired,
        manualForcedRefresh: options.forceSelected === true,
        metadataOnly: true,
        abstractRequested: false,
        fullTextRequested: false,
      };
      providerArtifactPaths.push(
        await writeMetadataScoutArtifact(options.paths, artifact),
      );
    }
  }

  const nextCandidate: ResearchWorkspace = {
    ...previous,
    updatedAt: timestamp(),
    searchRuns: [...previous.searchRuns, ...additions],
    candidates: [...previous.candidates, ...candidateAdditions],
    candidateObservations: [
      ...previous.candidateObservations,
      ...observationAdditions,
    ],
  };
  const next = assertAppendOnlyWorkspaceTransition(previous, nextCandidate);
  return {
    workspace: next,
    dueGapRevisionIds: due.map((revision) => revision.revisionId),
    searchRunIds: additions.map((run) => run.id),
    candidateIds: [...observedCandidateIds],
    newCandidateIds: candidateAdditions.map((candidate) => candidate.id),
    candidateObservationIds: observationAdditions.map(
      (observation) => observation.id,
    ),
    providerArtifactPaths,
    skippedNotDueGapRevisionIds: skippedNotDue,
  };
};
