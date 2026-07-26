import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { makeResearchWorkspace } from "../../tests/fixture.js";
import { validateResearchWorkspace } from "../workspace.js";
import {
  writeMetadataScoutArtifact,
  type CrossrefMetadataSearchRun,
  type PubMedMetadataSearchRun,
} from "./metadata-scout.js";
import {
  coordinateDueMetadataScouts,
  type CrossrefSearchClient,
  type PubMedSearchClient,
} from "./scout-coordinator.js";
import { resolvePrivateIntakePaths } from "./private-paths.js";

const roots: string[] = [];
const now = new Date("2026-07-26T14:00:00.000Z");

const pubmedRun = (): PubMedMetadataSearchRun => ({
  schemaVersion: 1,
  id: "metadata-scout.pubmed.test",
  provider: "pubmed",
  query: "literal query",
  sort: "pub date",
  appliedStructuredFilters: [
    "sort=pub date",
    "publicationYearFloor=2020",
  ],
  searchedAt: now.toISOString(),
  totalResultCount: 12,
  returnedProviderRecordIds: ["12345"],
  candidates: [
    {
      schemaVersion: 1,
      id: "metadata-candidate.pubmed.test",
      provider: "pubmed",
      providerRecordId: "12345",
      title: "A systematic review of surgical imaging",
      authors: ["Reviewer A"],
      publicationDate: "2026",
      containerTitle: "Journal of Surgery",
      publisher: null,
      publicationTypes: ["Systematic Review", "Journal Article"],
      language: "eng",
      doi: "10.1234/systematic.review",
      pmid: "12345",
      canonicalUrl: "https://pubmed.ncbi.nlm.nih.gov/12345/",
      discoveredAt: now.toISOString(),
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

const crossrefRun = (): CrossrefMetadataSearchRun => ({
  schemaVersion: 1,
  id: "metadata-scout.crossref-search.test",
  provider: "crossref",
  query: "literal crossref query",
  appliedStructuredFilters: [
    "sort=published:desc",
    "publicationYearFloor=2020",
    "type=journal-article",
  ],
  searchedAt: now.toISOString(),
  totalResultCount: 3,
  returnedProviderRecordIds: ["10.1234/crossref"],
  candidates: [
    {
      schemaVersion: 1,
      id: "metadata-candidate.crossref.test",
      provider: "crossref",
      providerRecordId: "10.1234/crossref",
      title: "Current surgical evidence",
      authors: ["Surgeon B"],
      publicationDate: "2025",
      containerTitle: "Surgery",
      publisher: "Surgical Publisher",
      publicationTypes: ["journal-article"],
      language: "en",
      doi: "10.1234/crossref",
      pmid: null,
      canonicalUrl: "https://doi.org/10.1234/crossref",
      discoveredAt: now.toISOString(),
      metadataOnly: true,
      abstractStored: false,
      fullTextStored: false,
      bibliographicStatus: "unverified",
    },
  ],
  metadataOnly: true,
  abstractRequested: false,
  fullTextRequested: false,
});

const makePaths = async () => {
  const root = await mkdtemp(join(tmpdir(), "scout-coordinator-"));
  roots.push(root);
  return resolvePrivateIntakePaths(root);
};

afterEach(async () => {
  await Promise.all(
    roots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
  vi.restoreAllMocks();
});

describe("append-only metadata scout coordinator", () => {
  it("runs a due literal PubMed strategy, maps bibliographic signals, and remains due-only", async () => {
    const workspace = makeResearchWorkspace();
    const query =
      workspace.evidenceGapRevisions[0]!.scoutPolicy.providerStrategies[0]!
        .query;
    const search = vi.fn(async (actualQuery: string) => ({
      ...pubmedRun(),
      query: actualQuery,
    }));
    const pubmed: PubMedSearchClient = { search };
    const crossref: CrossrefSearchClient = {
      search: vi.fn(async () => crossrefRun()),
    };
    const paths = await makePaths();

    const result = await coordinateDueMetadataScouts({
      workspace,
      paths,
      pubmed,
      crossref,
      recordedBy: "scout.test",
      clock: { now: () => now },
    });

    expect(search).toHaveBeenCalledWith(query, {
      maxResults: 25,
      sort: "pub date",
      publicationYearFloor: 2020,
    });
    expect(result.searchRunIds).toHaveLength(1);
    expect(result.candidateIds).toHaveLength(1);
    expect(result.newCandidateIds).toEqual(result.candidateIds);
    expect(result.candidateObservationIds).toHaveLength(1);
    const addedRun = result.workspace.searchRuns.at(-1)!;
    expect(addedRun.queries[0]).toMatchObject({
      query,
      filters: expect.arrayContaining([
        "sort=pub date",
        "publicationYearFloor=2020",
      ]),
    });
    expect(result.workspace.candidates.at(-1)).toMatchObject({
      searchRunId: addedRun.id,
      sourceType: "systematic_review",
      publicationTypes: ["Systematic Review", "Journal Article"],
      language: "English",
      authoritySignals: [],
    });
    expect(result.workspace.candidateObservations.at(-1)).toMatchObject({
      candidateId: result.candidateIds[0],
      searchRunId: addedRun.id,
    });
    expect(result.workspace.screeningDecisions).toEqual(
      workspace.screeningDecisions,
    );
    expect(() => validateResearchWorkspace(result.workspace)).not.toThrow();
    const artifact = await readFile(result.providerArtifactPaths[0]!, "utf8");
    expect(artifact).toContain('"metadataOnly": true');
    expect(artifact).not.toMatch(/"abstract"\s*:/i);
    expect(artifact).not.toMatch(/"fullText"\s*:/i);
    await expect(
      writeMetadataScoutArtifact(paths, {
        ...(JSON.parse(artifact) as Record<string, unknown>),
        id: "provider-discovery.unsafe-content",
        content: "full text",
      } as never),
    ).rejects.toThrow(/unrecognized|content/i);

    const notDue = await coordinateDueMetadataScouts({
      workspace: result.workspace,
      paths,
      pubmed,
      crossref,
      recordedBy: "scout.test",
      clock: { now: () => now },
    });
    expect(notDue.searchRunIds).toEqual([]);
    expect(notDue.workspace).toEqual(result.workspace);
  });

  it("does not project non-HTTPS provider candidate URLs", async () => {
    const workspace = makeResearchWorkspace();
    const insecureRun = pubmedRun();
    insecureRun.candidates = insecureRun.candidates.map((candidate) => ({
      ...candidate,
      canonicalUrl: "http://provider.example.test/insecure-record",
    }));
    const paths = await makePaths();

    const result = await coordinateDueMetadataScouts({
      workspace,
      paths,
      pubmed: {
        search: async (query) => ({ ...insecureRun, query }),
      },
      crossref: {
        search: async () => crossrefRun(),
      },
      recordedBy: "scout.test",
      clock: { now: () => now },
    });

    const projectedCandidate = result.workspace.candidates.at(-1);
    expect(projectedCandidate?.url).toBeNull();
    expect(JSON.stringify(projectedCandidate)).not.toContain(
      "http://provider.example.test",
    );
  });

  it("withholds provider records whose DOI and PMID resolve to different Candidates", async () => {
    const workspace = makeResearchWorkspace();
    const conflictingRun = pubmedRun();
    conflictingRun.candidates = conflictingRun.candidates.map(
      (candidate) => ({
        ...candidate,
        doi: workspace.candidates[1]!.doi,
        pmid: workspace.candidates[0]!.pmid,
      }),
    );

    const result = await coordinateDueMetadataScouts({
      workspace,
      paths: await makePaths(),
      pubmed: {
        search: async (query) => ({ ...conflictingRun, query }),
      },
      crossref: { search: async () => crossrefRun() },
      recordedBy: "scout.test",
      clock: { now: () => now },
    });

    expect(result.newCandidateIds).toEqual([]);
    expect(result.candidateObservationIds).toEqual([]);
    expect(result.workspace.searchRuns.at(-1)).toMatchObject({
      status: "partial",
      candidateCountCaptured: 0,
      statusNote: expect.stringMatching(/identities conflicted/i),
    });
    expect(() => validateResearchWorkspace(result.workspace)).not.toThrow();
  });

  it("supports explicit append-only Scout now refreshes without replacing prior runs", async () => {
    const initial = await coordinateDueMetadataScouts({
      workspace: makeResearchWorkspace(),
      paths: await makePaths(),
      pubmed: { search: vi.fn(async () => pubmedRun()) },
      crossref: { search: vi.fn(async () => crossrefRun()) },
      recordedBy: "scout.test",
      clock: { now: () => now },
    });
    const forced = await coordinateDueMetadataScouts({
      workspace: initial.workspace,
      paths: await makePaths(),
      pubmed: { search: vi.fn(async () => pubmedRun()) },
      crossref: { search: vi.fn(async () => crossrefRun()) },
      recordedBy: "scout.test",
      gapRevisionIds: ["gap.rev.one"],
      forceSelected: true,
      clock: { now: () => now },
    });

    expect(forced.searchRunIds).toHaveLength(1);
    expect(forced.workspace.searchRuns).toHaveLength(
      initial.workspace.searchRuns.length + 1,
    );
    expect(forced.workspace.candidates).toHaveLength(
      initial.workspace.candidates.length,
    );
    expect(forced.workspace.candidateObservations).toHaveLength(
      initial.workspace.candidateObservations.length + 1,
    );
    expect(forced.candidateIds).toEqual(initial.candidateIds);
    expect(forced.newCandidateIds).toEqual([]);
    expect(forced.candidateObservationIds).toHaveLength(1);
    expect(
      forced.workspace.candidateObservations.at(-1),
    ).toMatchObject({
      candidateId: initial.candidateIds[0],
      searchRunId: forced.searchRunIds[0],
    });
    expect(forced.workspace.searchRuns.at(-1)?.queries[0]?.filters).toContain(
      "manual forced refresh",
    );
    expect(forced.workspace.searchRuns.at(-1)?.id).not.toBe(
      initial.workspace.searchRuns.at(-1)?.id,
    );
  });

  it("appends failed and unsupported-provider runs with auditable private artifacts", async () => {
    const failedPaths = await makePaths();
    const failed = await coordinateDueMetadataScouts({
      workspace: makeResearchWorkspace(),
      paths: failedPaths,
      pubmed: {
        search: vi.fn(async () => {
          throw new Error("upstream token=secret failed");
        }),
      },
      crossref: { search: vi.fn(async () => crossrefRun()) },
      recordedBy: "scout.test",
      clock: { now: () => now },
    });

    expect(failed.workspace.searchRuns.at(-1)).toMatchObject({
      status: "failed",
      candidateCountCaptured: 0,
    });
    const failedArtifact = await readFile(
      failed.providerArtifactPaths[0]!,
      "utf8",
    );
    expect(failedArtifact).not.toContain("secret");
    const beforeFailureBackoff = await coordinateDueMetadataScouts({
      workspace: failed.workspace,
      paths: await makePaths(),
      pubmed: { search: vi.fn(async () => pubmedRun()) },
      crossref: { search: vi.fn(async () => crossrefRun()) },
      recordedBy: "scout.test",
      clock: {
        now: () => new Date(now.getTime() + 5 * 60 * 60 * 1_000),
      },
    });
    expect(beforeFailureBackoff.searchRunIds).toEqual([]);
    const afterFailureBackoff = await coordinateDueMetadataScouts({
      workspace: failed.workspace,
      paths: await makePaths(),
      pubmed: { search: vi.fn(async () => pubmedRun()) },
      crossref: { search: vi.fn(async () => crossrefRun()) },
      recordedBy: "scout.test",
      clock: {
        now: () =>
          new Date(now.getTime() + 6 * 60 * 60 * 1_000 + 1),
      },
    });
    expect(afterFailureBackoff.searchRunIds).toHaveLength(1);
    expect(afterFailureBackoff.workspace.searchRuns.at(-1)?.status).toBe(
      "completed",
    );

    const manualWorkspace = structuredClone(makeResearchWorkspace());
    manualWorkspace.evidenceGapRevisions[0]!.scoutPolicy.providerStrategies = [
      {
        provider: "guideline_registry",
        query: "literal manual guideline search",
        filters: ["United States"],
      },
    ];
    const manual = await coordinateDueMetadataScouts({
      workspace: manualWorkspace,
      paths: await makePaths(),
      pubmed: { search: vi.fn(async () => pubmedRun()) },
      crossref: { search: vi.fn(async () => crossrefRun()) },
      recordedBy: "scout.test",
      clock: { now: () => now },
    });
    expect(manual.workspace.searchRuns.at(-1)).toMatchObject({
      status: "partial",
      providerResultCountTotal: 0,
      candidateCountCaptured: 0,
      statusNote: expect.stringMatching(/manual/i),
    });
  });

  it("executes polite Crossref works search with recognized date and type filters", async () => {
    const workspace = structuredClone(makeResearchWorkspace());
    workspace.evidenceGapRevisions[0]!.scoutPolicy.providerStrategies = [
      {
        provider: "crossref",
        query: "literal crossref query",
        filters: ["type:journal-article", "English"],
      },
    ];
    const search = vi.fn(async () => crossrefRun());
    const result = await coordinateDueMetadataScouts({
      workspace,
      paths: await makePaths(),
      pubmed: { search: vi.fn(async () => pubmedRun()) },
      crossref: { search },
      recordedBy: "scout.test",
      clock: { now: () => now },
    });

    expect(search).toHaveBeenCalledWith("literal crossref query", {
      maxResults: 25,
      publicationYearFloor: 2020,
      workType: "journal-article",
    });
    expect(result.workspace.searchRuns.at(-1)?.queries[0]?.query).toBe(
      "literal crossref query",
    );
    expect(result.workspace.candidates.at(-1)).toMatchObject({
      sourceType: "journal_article",
      authoritySignals: [],
      language: "English",
    });
  });
});
