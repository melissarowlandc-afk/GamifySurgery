import {
  readFile,
  mkdir,
  mkdtemp,
  rename,
  rm,
  truncate,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ResearchWorkspace,
  SourceRightsDecision,
} from "@gamify-surgery/clinical-research";
import {
  loadPrivateIntakeManifest,
  type CrossrefMetadataSearchRun,
  type PubMedMetadataSearchRun,
} from "@gamify-surgery/clinical-research/node";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LocalAuthoringContextService } from "./authoring.js";
import { applyWorkbenchCommand } from "./commands.js";
import {
  LocalPrivateIntakeService,
  WORKBENCH_PILOT_MAX_PRIVATE_SOURCE_BYTES,
} from "./intake.js";
import { createLocalScoutCoordinator } from "./scouting.js";
import { createInitialResearchWorkspace } from "./workspace.js";

const canonicalAuthoringExamplePath = fileURLToPath(
  new URL(
    "../../../packages/clinical-authoring/examples/synthetic-workspace.json",
    import.meta.url,
  ),
);

const temporaryRoots: string[] = [];

const makeRoot = async (prefix: string): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), prefix));
  temporaryRoots.push(root);
  return root;
};

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    temporaryRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  );
});

const pubmedRun = (
  query: string,
  sequence: number,
): PubMedMetadataSearchRun => ({
  schemaVersion: 1,
  id: `metadata-scout.pubmed.integration-${sequence}`,
  provider: "pubmed",
  query,
  sort: "pub date",
  appliedStructuredFilters: ["sort=pub date"],
  searchedAt: `2026-07-26T14:0${sequence}:00.000Z`,
  totalResultCount: 1,
  returnedProviderRecordIds: [`pmid-${sequence}`],
  candidates: [
    {
      schemaVersion: 1,
      id: `metadata-candidate.pubmed.integration-${sequence}`,
      provider: "pubmed",
      providerRecordId: `pmid-${sequence}`,
      title: `Metadata-only candidate ${sequence}`,
      authors: ["Researcher A"],
      publicationDate: "2026",
      containerTitle: "Journal of Test Metadata",
      publisher: null,
      publicationTypes: ["Journal Article"],
      language: "eng",
      doi: null,
      pmid: String(1000 + sequence),
      canonicalUrl: `https://pubmed.ncbi.nlm.nih.gov/${1000 + sequence}/`,
      discoveredAt: `2026-07-26T14:0${sequence}:00.000Z`,
      metadataOnly: true,
      abstractStored: false,
      fullTextStored: false,
      bibliographicStatus: "unverified",
    },
  ],
  metadataOnly: true,
  abstractRequested: false,
  fullTextRequested: false,
  noticeUrl: "https://www.ncbi.nlm.nih.gov/About/disclaimer.html",
});

const unusedCrossrefRun = (): CrossrefMetadataSearchRun => ({
  schemaVersion: 1,
  id: "metadata-scout.crossref.unused",
  provider: "crossref",
  query: "unused",
  appliedStructuredFilters: [],
  searchedAt: "2026-07-26T14:00:00.000Z",
  totalResultCount: 0,
  returnedProviderRecordIds: [],
  candidates: [],
  metadataOnly: true,
  abstractRequested: false,
  fullTextRequested: false,
});

const createMetadataGap = (
  workspace: ResearchWorkspace,
): ResearchWorkspace =>
  applyWorkbenchCommand(workspace, {
    type: "create_gap",
    title: "Selected metadata gap",
    clinicalQuestion: "Which current evidence addresses the selected gap?",
    whyNeeded: "The selected question needs a current evidence inventory.",
    acceptanceCriteria: ["A human screens every metadata candidate."],
    targetKind: "other",
    targetId: "target.local.selected-gap",
    scoutMode: "metadata_search",
    preferredSourceTypes: ["journal_article"],
    provider: "pubmed",
    query: "literal selected-gap query",
    refreshIntervalDays: 30,
  });

describe("local metadata-scout adapter", () => {
  it("keeps credentials server-side and forces only the selected gap on Scout now", async () => {
    const repositoryRoot = await makeRoot("clinical-scout-service-");
    let callCount = 0;
    const search = vi.fn(async (query: string) => {
      callCount += 1;
      return pubmedRun(query, callCount);
    });
    const crossrefSearch = vi.fn(async () => unusedCrossrefRun());
    const coordinator = createLocalScoutCoordinator({
      repositoryRoot,
      environment: {
        CLINICAL_SCOUT_CONTACT_EMAIL: "private-contact@example.test",
        CLINICAL_SCOUT_AUTO: "false",
        NCBI_API_KEY: "private-ncbi-key",
      },
      pubmed: { search },
      crossref: { search: crossrefSearch },
    });
    const workspace = createMetadataGap(
      createInitialResearchWorkspace("2026-07-26T13:00:00.000Z"),
    );
    const selectedGap = workspace.evidenceGaps.at(-1)!;

    expect(coordinator.status()).toEqual({
      configured: true,
      automatic: false,
      enabled: true,
    });
    expect(JSON.stringify(coordinator.status())).not.toContain(
      "private-contact@example.test",
    );
    expect(JSON.stringify(coordinator.status())).not.toContain(
      "private-ncbi-key",
    );

    const first = await coordinator.scout(workspace, selectedGap.id);
    const second = await coordinator.scout(first, selectedGap.id);

    expect(search).toHaveBeenCalledTimes(2);
    expect(search.mock.calls.map(([query]) => query)).toEqual([
      "literal selected-gap query",
      "literal selected-gap query",
    ]);
    expect(crossrefSearch).not.toHaveBeenCalled();
    expect(second.searchRuns).toHaveLength(first.searchRuns.length + 1);
    expect(second.searchRuns.at(-1)?.gapRevisionIds).toEqual([
      workspace.evidenceGapRevisions.at(-1)!.revisionId,
    ]);
    expect(second.searchRuns.at(-1)?.queries[0]?.filters).toContain(
      "manual forced refresh",
    );
  });
});

const permissions = {
  bibliographicMetadata: true,
  privateStorage: true,
  localTextExtraction: true,
  localStructuredIndexing: true,
  externalAiProcessing: false,
  derivedClinicalContent: true,
  projectParaphrasePublication: false,
  publicSourceTextReuse: false,
  runtimeRedistribution: false,
  commercialDistribution: false,
};

const rightsDecision = (
  id: string,
  supersedesDecisionId: string | null,
  recordedAt: string,
): SourceRightsDecision => ({
  id,
  sourceId: "source.local.intake-test",
  supersedesDecisionId,
  decisionStatus: "permitted_with_conditions",
  legalBasis: "owner_authored",
  permissions: { ...permissions },
  territories: ["Global"],
  licenseLabel: null,
  licenseUrl: null,
  termsUrl: null,
  attributionStatement: null,
  requiredNotices: [],
  nonCommercialOnly: false,
  shareAlikeRequired: false,
  thirdPartyMaterialPolicy: "not_applicable",
  fairUseAssessment: null,
  permissionEvidenceReferenceIds: [],
  reviewBasis: "owner_attestation",
  reviewedBy: "reviewer.local.owner",
  reviewedAt: recordedAt,
  effectiveAt: recordedAt,
  expiresAt: null,
  recordedAt,
  notes: "Owner-authored local pilot material approved for private processing.",
});

const workspaceWithCurrentRights = (): ResearchWorkspace => {
  const workspace = createInitialResearchWorkspace(
    "2026-07-26T12:00:00.000Z",
  );
  workspace.externalReferences.sources.push({
    id: "source.local.intake-test",
  });
  workspace.sourceRightsDecisions.push(
    rightsDecision(
      "rights.local.intake-test.v1",
      null,
      "2026-07-26T12:01:00.000Z",
    ),
    rightsDecision(
      "rights.local.intake-test.v2",
      "rights.local.intake-test.v1",
      "2026-07-26T12:02:00.000Z",
    ),
  );
  workspace.updatedAt = "2026-07-26T12:02:00.000Z";
  return workspace;
};

const acknowledgement = {
  noIdentifiablePatientInformation: true as const,
  authorizedLocalStorageAndProcessing: true as const,
  sharedAndCopyrightedMaterialConsidered: true as const,
  scope: "Owner-authored, non-PHI pilot source for local extraction testing.",
};

describe("fixed-root private intake adapter", () => {
  it("requires complete current-rights assignments and all safety acknowledgements", async () => {
    const repositoryRoot = await makeRoot("clinical-intake-service-");
    const service = new LocalPrivateIntakeService(repositoryRoot);
    await mkdir(service.paths.inbox, { recursive: true });
    await writeFile(
      join(service.paths.inbox, "chapter.txt"),
      "CONFIDENTIAL_SOURCE_SENTINEL\nOriginal local source text.",
      "utf8",
    );
    const workspace = workspaceWithCurrentRights();

    await expect(
      service.scan(workspace, {
        assignments: [
          {
            filename: "../chapter.txt",
            rightsDecisionId: "rights.local.intake-test.v2",
          },
        ],
        acknowledgement,
      }),
    ).rejects.toThrow(/safe inbox filename/i);
    await expect(
      service.scan(workspace, {
        assignments: [],
        acknowledgement,
      }),
    ).rejects.toThrow(/every ordinary file/i);
    await expect(
      service.scan(workspace, {
        assignments: [
          {
            filename: "chapter.txt",
            rightsDecisionId: "rights.local.intake-test.v1",
          },
        ],
        acknowledgement,
      }),
    ).rejects.toThrow(/current effective rights/i);
    await expect(
      service.scan(workspace, {
        assignments: [
          {
            filename: "chapter.txt",
            rightsDecisionId: "rights.local.intake-test.v2",
          },
        ],
        acknowledgement: {
          ...acknowledgement,
          noIdentifiablePatientInformation: false,
        } as never,
      }),
    ).rejects.toThrow(/all private-intake safety acknowledgements/i);
  });

  it("projects only safe counts/status and never returns paths or source text", async () => {
    const repositoryRoot = await makeRoot("clinical-intake-projection-");
    const service = new LocalPrivateIntakeService(repositoryRoot);
    await mkdir(service.paths.inbox, { recursive: true });
    const sourceText =
      "CONFIDENTIAL_SOURCE_SENTINEL\nOwner-authored local source text.";
    await writeFile(
      join(service.paths.inbox, "chapter.txt"),
      sourceText,
      "utf8",
    );

    const scanned = await service.scan(workspaceWithCurrentRights(), {
      assignments: [
        {
          filename: "chapter.txt",
          rightsDecisionId: "rights.local.intake-test.v2",
        },
      ],
      acknowledgement,
    });
    const extracted = await service.extract(workspaceWithCurrentRights());
    const status = await service.status();
    const privateManifest = await loadPrivateIntakeManifest(service.paths);
    const projected = JSON.stringify({
      scanned,
      extracted,
      status,
    });

    expect(scanned.report).toEqual({
      queued: 1,
      duplicates: 0,
      rightsBlocked: 0,
      quarantined: 0,
      ignored: 0,
    });
    expect(Object.keys(scanned.report)).not.toContain("manifestPath");
    expect(Object.keys(extracted.report)).not.toContain("manifestPath");
    expect(status.maximumSourceBytes).toBe(
      WORKBENCH_PILOT_MAX_PRIVATE_SOURCE_BYTES,
    );
    expect(status.entries[0]).not.toHaveProperty("sha256");
    expect(privateManifest.entries[0]?.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(projected).not.toContain(repositoryRoot);
    expect(projected).not.toContain("CONFIDENTIAL_SOURCE_SENTINEL");
    expect(projected).not.toContain(sourceText);
    expect(projected).not.toMatch(
      /(?:storageRelativePath|manifestPath|artifactPath|sourcePath)/,
    );
  });

  it("quarantines sources above the 25 MiB workbench pilot limit", async () => {
    const repositoryRoot = await makeRoot("clinical-intake-size-limit-");
    const service = new LocalPrivateIntakeService(repositoryRoot);
    await mkdir(service.paths.inbox, { recursive: true });
    const oversizedPath = join(service.paths.inbox, "oversized.txt");
    await writeFile(oversizedPath, "x", "utf8");
    await truncate(
      oversizedPath,
      WORKBENCH_PILOT_MAX_PRIVATE_SOURCE_BYTES + 1,
    );

    const scanned = await service.scan(workspaceWithCurrentRights(), {
      assignments: [
        {
          filename: "oversized.txt",
          rightsDecisionId: "rights.local.intake-test.v2",
        },
      ],
      acknowledgement,
    });

    expect(WORKBENCH_PILOT_MAX_PRIVATE_SOURCE_BYTES).toBe(25 * 1024 * 1024);
    expect(scanned.report).toMatchObject({
      queued: 0,
      quarantined: 1,
    });
    expect(scanned.status.entries[0]).toMatchObject({
      originalFilename: "oversized.txt",
      sizeBytes: WORKBENCH_PILOT_MAX_PRIVATE_SOURCE_BYTES + 1,
      status: "quarantined",
      errorCode: "SOURCE_TOO_LARGE",
    });
  });

  it("rechecks the current rights ledger immediately before extraction", async () => {
    const repositoryRoot = await makeRoot("clinical-intake-revocation-");
    const service = new LocalPrivateIntakeService(repositoryRoot);
    await mkdir(service.paths.inbox, { recursive: true });
    await writeFile(
      join(service.paths.inbox, "chapter.txt"),
      "Owner-authored local source queued before rights changed.",
      "utf8",
    );
    const original = workspaceWithCurrentRights();
    await service.scan(original, {
      assignments: [
        {
          filename: "chapter.txt",
          rightsDecisionId: "rights.local.intake-test.v2",
        },
      ],
      acknowledgement,
    });
    const revoked = structuredClone(original);
    revoked.sourceRightsDecisions.push({
      ...rightsDecision(
        "rights.local.intake-test.v3",
        "rights.local.intake-test.v2",
        "2026-07-26T12:03:00.000Z",
      ),
      decisionStatus: "revoked",
      permissions: Object.fromEntries(
        Object.keys(permissions).map((permission) => [permission, false]),
      ) as typeof permissions,
      notes: "Local extraction permission was revoked before processing.",
    });
    revoked.updatedAt = "2026-07-26T12:03:00.000Z";

    await expect(service.extract(revoked)).rejects.toThrow(
      /rights no longer permit local extraction/i,
    );
    expect((await service.status()).entries[0]?.status).toBe("queued");
  });
});

describe("fixed-path authoring-context adapter", () => {
  it("loads only the fixed compiled workspace and synchronizes sanitized references", async () => {
    const repositoryRoot = await makeRoot("clinical-authoring-service-");
    const privateRoot = join(repositoryRoot, ".clinical-workbench");
    await mkdir(privateRoot, { recursive: true });
    const sourceDocument = await readFile(
      canonicalAuthoringExamplePath,
      "utf8",
    );
    const raw = JSON.parse(sourceDocument) as {
      sources: Array<{ scopeNote: string }>;
      citations: Array<{ supportedClaim: string }>;
      topicRevisions: Array<{ sections: Array<{ narrative: string }> }>;
      structuredFacts: Array<{ population: string }>;
      concepts: Array<{ learningObjective: string }>;
    };
    const compiledPath = join(privateRoot, "compiled-workspace.json");
    await writeFile(compiledPath, sourceDocument, "utf8");
    await writeFile(
      join(privateRoot, "caller-selected-workspace.json"),
      JSON.stringify({ path: "must never be selected" }),
      "utf8",
    );
    const service = new LocalAuthoringContextService(repositoryRoot);

    const context = await service.load();
    const synchronized = await service.sync(
      createInitialResearchWorkspace("2026-07-26T13:00:00.000Z"),
    );
    const serialized = JSON.stringify(synchronized);

    expect(context.sources.length).toBeGreaterThan(0);
    expect(context.citations.every(
      (citation) => citation.verificationState === "human_verified",
    )).toBe(true);
    expect(
      synchronized.workspace.externalReferences.sources.map(
        (source) => source.id,
      ),
    ).toEqual(expect.arrayContaining(context.sources.map((source) => source.id)));
    expect(serialized).not.toContain(repositoryRoot);
    expect(serialized).not.toContain(raw.sources[0]!.scopeNote);
    expect(serialized).not.toContain(raw.citations[0]!.supportedClaim);
    expect(serialized).not.toContain(
      raw.topicRevisions[0]!.sections[0]!.narrative,
    );
    expect(serialized).not.toContain(raw.structuredFacts[0]!.population);
    expect(serialized).not.toContain(raw.concepts[0]!.learningObjective);

    await rename(compiledPath, `${compiledPath}.moved`);
    await expect(service.load()).rejects.toThrow();
  });
});
