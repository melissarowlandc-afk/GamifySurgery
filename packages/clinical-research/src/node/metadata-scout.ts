import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { z } from "zod";

import { isoTimestampSchema, stableIdSchema } from "../identifiers.js";
import { evidenceSearchRunSchema } from "../schemas.js";
import {
  ensurePrivateIntakePaths,
  type PrivateIntakePaths,
} from "./private-paths.js";
import { writePrivateJsonAtomic } from "./private-intake.js";

export const NCBI_EUTILS_BASE_URL =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
export const CROSSREF_API_BASE_URL = "https://api.crossref.org";
export const NCBI_COPYRIGHT_INFORMATION_URL =
  "https://www.ncbi.nlm.nih.gov/About/disclaimer.html";
export const MAX_METADATA_JSON_RESPONSE_BYTES = 2 * 1024 * 1024;

export type MetadataProvider = "pubmed" | "crossref";

export const metadataScoutCandidateSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: stableIdSchema,
    provider: z.enum(["pubmed", "crossref"]),
    providerRecordId: z.string(),
    title: z.string(),
    authors: z.array(z.string()),
    publicationDate: z.string().nullable(),
    containerTitle: z.string().nullable(),
    publisher: z.string().nullable(),
    publicationTypes: z.array(z.string()),
    language: z.string().nullable(),
    doi: z.string().nullable(),
    pmid: z.string().nullable(),
    canonicalUrl: z.string(),
    discoveredAt: isoTimestampSchema,
    metadataOnly: z.literal(true),
    abstractStored: z.literal(false),
    fullTextStored: z.literal(false),
    bibliographicStatus: z.literal("unverified"),
  })
  .strict();

export type MetadataScoutCandidate = z.infer<
  typeof metadataScoutCandidateSchema
>;

export const pubMedMetadataSearchRunSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: stableIdSchema,
    provider: z.literal("pubmed"),
    query: z.string(),
    sort: z.enum(["pub date", "relevance"]),
    appliedStructuredFilters: z.array(z.string()),
    searchedAt: isoTimestampSchema,
    totalResultCount: z.number().int().nonnegative(),
    returnedProviderRecordIds: z.array(z.string()),
    candidates: z.array(metadataScoutCandidateSchema),
    metadataOnly: z.literal(true),
    abstractRequested: z.literal(false),
    fullTextRequested: z.literal(false),
    noticeUrl: z.literal(NCBI_COPYRIGHT_INFORMATION_URL),
  })
  .strict();

export type PubMedMetadataSearchRun = z.infer<
  typeof pubMedMetadataSearchRunSchema
>;

export const crossrefMetadataEnrichmentSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: stableIdSchema,
    provider: z.literal("crossref"),
    doi: z.string(),
    enrichedAt: isoTimestampSchema,
    candidate: metadataScoutCandidateSchema,
    metadataOnly: z.literal(true),
    abstractRequested: z.literal(false),
    fullTextRequested: z.literal(false),
  })
  .strict();

export type CrossrefMetadataEnrichment = z.infer<
  typeof crossrefMetadataEnrichmentSchema
>;

export const crossrefMetadataSearchRunSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: stableIdSchema,
    provider: z.literal("crossref"),
    query: z.string(),
    appliedStructuredFilters: z.array(z.string()),
    searchedAt: isoTimestampSchema,
    totalResultCount: z.number().int().nonnegative(),
    returnedProviderRecordIds: z.array(z.string()),
    candidates: z.array(metadataScoutCandidateSchema),
    metadataOnly: z.literal(true),
    abstractRequested: z.literal(false),
    fullTextRequested: z.literal(false),
  })
  .strict();

export type CrossrefMetadataSearchRun = z.infer<
  typeof crossrefMetadataSearchRunSchema
>;

export const metadataScoutRunSchema = z.union([
  pubMedMetadataSearchRunSchema,
  crossrefMetadataEnrichmentSchema,
  crossrefMetadataSearchRunSchema,
]);

export type MetadataScoutRun = z.infer<typeof metadataScoutRunSchema>;

export const metadataScoutCoordinatorArtifactSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: stableIdSchema,
    gapRevisionId: stableIdSchema,
    provider: z.enum([
      "pubmed",
      "crossref",
      "clinical_trials",
      "guideline_registry",
      "manual_other",
    ]),
    query: z.string(),
    declaredFilters: z.array(z.string()),
    canonicalSearchRun: evidenceSearchRunSchema,
    canonicalCandidateIds: z.array(stableIdSchema),
    canonicalCandidateObservationIds: z.array(stableIdSchema),
    providerRun: metadataScoutRunSchema.nullable(),
    failure: z
      .object({
        code: z.string(),
        message: z.string(),
      })
      .strict()
      .nullable(),
    manualActionRequired: z.boolean(),
    manualForcedRefresh: z.boolean(),
    metadataOnly: z.literal(true),
    abstractRequested: z.literal(false),
    fullTextRequested: z.literal(false),
  })
  .strict();

export type MetadataScoutCoordinatorArtifact = z.infer<
  typeof metadataScoutCoordinatorArtifactSchema
>;

export const metadataScoutPrivateArtifactSchema = z.union([
  metadataScoutRunSchema,
  metadataScoutCoordinatorArtifactSchema,
]);

export type MetadataScoutPrivateArtifact = z.infer<
  typeof metadataScoutPrivateArtifactSchema
>;

export interface ScoutClock {
  now: () => Date;
  nowMs: () => number;
  sleep: (milliseconds: number) => Promise<void>;
}

const systemClock: ScoutClock = {
  now: () => new Date(),
  nowMs: () => Date.now(),
  sleep: (milliseconds) =>
    new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds)),
};

export type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export interface MetadataScoutClientOptions {
  contactEmail: string;
  toolName: string;
  /** Optional NCBI key. Used only in PubMed requests and never persisted. */
  apiKey?: string;
  fetch?: FetchLike;
  clock?: ScoutClock;
  userAgentProduct?: string;
  /** Per-request wall-clock deadline. Defaults to 20 seconds. */
  requestTimeoutMilliseconds?: number;
}

export class MetadataScoutError extends Error {
  public readonly code: string;
  public readonly provider: MetadataProvider;
  public readonly status: number | null;

  public constructor(
    provider: MetadataProvider,
    code: string,
    message: string,
    status: number | null = null,
  ) {
    super(message);
    this.name = "MetadataScoutError";
    this.provider = provider;
    this.code = code;
    this.status = status;
  }
}

const sha256 = (value: string | Uint8Array): string =>
  createHash("sha256").update(value).digest("hex");

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, canonicalize(nested)]),
  );
};

const normalizeWhitespace = (value: string): string =>
  value.replaceAll(/\s+/g, " ").trim();

const requireContactEmail = (value: string): string => {
  const normalized = value.trim().toLocaleLowerCase();
  if (
    normalized.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
  ) {
    throw new Error(
      "Metadata scouting requires an explicit, valid contact email.",
    );
  }
  return normalized;
};

const requireToolName = (value: string): string => {
  const normalized = value.trim();
  if (!/^[A-Za-z][A-Za-z0-9._-]{2,63}$/.test(normalized)) {
    throw new Error(
      "Metadata scouting requires a short registered-tool identifier.",
    );
  }
  return normalized;
};

export const sanitizeMetadataProviderError = (error: unknown): string => {
  const raw = error instanceof Error ? error.message : "Metadata request failed.";
  return raw
    .replaceAll(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      "[redacted-email]",
    )
    .replaceAll(
      /([?&](?:api_key|token|key|email|mailto)=)[^&\s]+/gi,
      "$1[redacted]",
    )
    .replaceAll(
      /\b(api[_-]?key|token|password|secret)\s*[:=]\s*[^\s&,;]+/gi,
      "$1=[redacted]",
    )
    .replaceAll(/https?:\/\/[^\s]+/gi, (url) => {
      try {
        const parsed = new URL(url);
        parsed.search = "";
        return parsed.toString();
      } catch {
        return "[redacted-url]";
      }
    })
    .slice(0, 500);
};

class SerialRateLimiter {
  private tail: Promise<void> = Promise.resolve();
  private nextAllowedAt = 0;
  private minimumIntervalMs: number;

  public constructor(
    minimumIntervalMs: number,
    private readonly clock: ScoutClock,
  ) {
    this.minimumIntervalMs = minimumIntervalMs;
  }

  public setMinimumInterval(milliseconds: number): void {
    if (Number.isFinite(milliseconds) && milliseconds >= 0) {
      this.minimumIntervalMs = Math.max(
        this.minimumIntervalMs,
        Math.ceil(milliseconds),
      );
    }
  }

  public deferBy(milliseconds: number): void {
    if (Number.isFinite(milliseconds) && milliseconds > 0) {
      this.nextAllowedAt = Math.max(
        this.nextAllowedAt,
        this.clock.nowMs() + Math.ceil(milliseconds),
      );
    }
  }

  public run<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.tail.then(async () => {
      const delay = Math.max(0, this.nextAllowedAt - this.clock.nowMs());
      if (delay > 0) await this.clock.sleep(delay);
      try {
        return await operation();
      } finally {
        this.nextAllowedAt = Math.max(
          this.nextAllowedAt,
          this.clock.nowMs() + this.minimumIntervalMs,
        );
      }
    });
    this.tail = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const optionalString = (value: unknown): string | null =>
  typeof value === "string" && value.trim()
    ? normalizeWhitespace(value)
    : null;

const firstString = (value: unknown): string | null => {
  if (!Array.isArray(value)) return null;
  return optionalString(value[0]);
};

const parseRetryAfterMilliseconds = (
  response: Response,
  currentEpochMilliseconds: number,
): number => {
  const value = response.headers.get("retry-after");
  if (!value) return 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  const date = Date.parse(value);
  return Number.isNaN(date)
    ? 0
    : Math.max(0, date - currentEpochMilliseconds);
};

const parseCrossrefRateInterval = (response: Response): number => {
  const raw = response.headers.get("x-rate-limit-interval");
  if (!raw) return 0;
  const match = /^(\d+(?:\.\d+)?)\s*(s|ms)?$/i.exec(raw.trim());
  if (!match) return 0;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return 0;
  return match[2]?.toLocaleLowerCase() === "ms"
    ? amount
    : amount * 1000;
};

const metadataResponseTooLargeError = (
  provider: MetadataProvider,
  status: number,
): MetadataScoutError =>
  new MetadataScoutError(
    provider,
    "RESPONSE_TOO_LARGE",
    `${provider} metadata response exceeded the local byte limit.`,
    status,
  );

const readBoundedMetadataResponse = async (
  response: Response,
  provider: MetadataProvider,
): Promise<Uint8Array> => {
  const rawContentLength = response.headers.get("content-length")?.trim();
  if (rawContentLength && /^\d+$/.test(rawContentLength)) {
    const contentLength = Number(rawContentLength);
    if (
      !Number.isSafeInteger(contentLength) ||
      contentLength > MAX_METADATA_JSON_RESPONSE_BYTES
    ) {
      void response.body?.cancel().catch(() => undefined);
      throw metadataResponseTooLargeError(provider, response.status);
    }
  }

  if (response.body === null) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_METADATA_JSON_RESPONSE_BYTES) {
        try {
          await reader.cancel();
        } catch {
          // Preserve the bounded, sanitized error even if cancellation fails.
        }
        throw metadataResponseTooLargeError(provider, response.status);
      }
      if (value.byteLength > 0) chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
};

abstract class MetadataProviderClient {
  protected readonly contactEmail: string;
  protected readonly toolName: string;
  protected readonly fetch: FetchLike;
  protected readonly clock: ScoutClock;
  protected readonly userAgent: string;
  protected readonly requestTimeoutMilliseconds: number;
  protected abstract readonly provider: MetadataProvider;
  protected abstract readonly limiter: SerialRateLimiter;

  protected constructor(options: MetadataScoutClientOptions) {
    this.contactEmail = requireContactEmail(options.contactEmail);
    this.toolName = requireToolName(options.toolName);
    this.fetch = options.fetch ?? globalThis.fetch;
    if (!this.fetch) {
      throw new Error("This Node runtime does not provide fetch.");
    }
    this.clock = options.clock ?? systemClock;
    const product =
      options.userAgentProduct?.trim() || "GamifySurgeryClinicalResearch/0.1";
    this.userAgent = `${product} (${this.toolName}; mailto:${this.contactEmail})`;
    const requestTimeoutMilliseconds =
      options.requestTimeoutMilliseconds ?? 20_000;
    if (
      !Number.isSafeInteger(requestTimeoutMilliseconds) ||
      requestTimeoutMilliseconds < 10 ||
      requestTimeoutMilliseconds > 120_000
    ) {
      throw new Error(
        "Metadata request timeout must be an integer from 10 through 120000 milliseconds.",
      );
    }
    this.requestTimeoutMilliseconds = requestTimeoutMilliseconds;
  }

  protected async requestJson(url: URL): Promise<unknown> {
    return this.limiter.run(async () => {
      const controller = new AbortController();
      const timeoutError = new MetadataScoutError(
        this.provider,
        "REQUEST_TIMEOUT",
        `${this.provider} metadata request exceeded its local deadline.`,
      );
      let timeout: ReturnType<typeof setTimeout> | undefined;
      const deadline = new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(() => {
          controller.abort();
          reject(timeoutError);
        }, this.requestTimeoutMilliseconds);
      });
      try {
        let response: Response;
        try {
          response = await Promise.race([
            this.fetch(url, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "User-Agent": this.userAgent,
              },
              signal: controller.signal,
            }),
            deadline,
          ]);
        } catch (error) {
          if (error instanceof MetadataScoutError) throw error;
          if (controller.signal.aborted) throw timeoutError;
          throw new MetadataScoutError(
            this.provider,
            "NETWORK_ERROR",
            sanitizeMetadataProviderError(error),
          );
        }

        if (this.provider === "crossref") {
          this.limiter.setMinimumInterval(
            parseCrossrefRateInterval(response),
          );
        }
        if (!response.ok) {
          if (response.status === 429 || response.status === 503) {
            this.limiter.deferBy(
              Math.max(
                parseRetryAfterMilliseconds(
                  response,
                  this.clock.now().getTime(),
                ),
                1000,
              ),
            );
          }
          throw new MetadataScoutError(
            this.provider,
            "HTTP_ERROR",
            `${this.provider} metadata request failed with HTTP ${response.status}.`,
            response.status,
          );
        }

        let responseBytes: Uint8Array;
        try {
          responseBytes = await Promise.race([
            readBoundedMetadataResponse(response, this.provider),
            deadline,
          ]);
        } catch (error) {
          if (error instanceof MetadataScoutError) throw error;
          if (controller.signal.aborted) throw timeoutError;
          throw new MetadataScoutError(
            this.provider,
            "NETWORK_ERROR",
            sanitizeMetadataProviderError(error),
            response.status,
          );
        }

        try {
          const responseText = new TextDecoder("utf-8", {
            fatal: true,
          }).decode(responseBytes);
          return JSON.parse(responseText) as unknown;
        } catch {
          throw new MetadataScoutError(
            this.provider,
            "INVALID_JSON",
            `${this.provider} returned invalid metadata JSON.`,
            response.status,
          );
        }
      } finally {
        if (timeout !== undefined) clearTimeout(timeout);
      }
    });
  }
}

export class PubMedMetadataClient extends MetadataProviderClient {
  protected readonly provider = "pubmed" as const;
  // 350 ms is below NCBI's unauthenticated ceiling of three requests/second.
  protected readonly limiter: SerialRateLimiter;
  private readonly apiKey: string | null;

  public constructor(options: MetadataScoutClientOptions) {
    super(options);
    const apiKey = options.apiKey?.trim() ?? "";
    if (
      apiKey &&
      (apiKey.length < 8 ||
        apiKey.length > 200 ||
        !/^[A-Za-z0-9_-]+$/.test(apiKey))
    ) {
      throw new Error("NCBI API key has an invalid format.");
    }
    this.apiKey = apiKey || null;
    // NCBI permits up to ten requests/second when a valid key is supplied.
    this.limiter = new SerialRateLimiter(this.apiKey ? 100 : 350, this.clock);
  }

  public async search(
    query: string,
    options: {
      maxResults?: number;
      sort?: "pub date" | "relevance";
      publicationYearFloor?: number | null;
    } = {},
  ): Promise<PubMedMetadataSearchRun> {
    const literalQuery = query;
    if (!literalQuery.trim() || literalQuery.length > 2000) {
      throw new Error("PubMed metadata query must contain 1–2000 characters.");
    }
    const maxResults = options.maxResults ?? 20;
    if (
      !Number.isSafeInteger(maxResults) ||
      maxResults < 1 ||
      maxResults > 100
    ) {
      throw new Error("PubMed metadata search may return 1–100 records.");
    }
    const sort = options.sort ?? "pub date";
    const publicationYearFloor = options.publicationYearFloor ?? null;
    if (
      publicationYearFloor !== null &&
      (!Number.isSafeInteger(publicationYearFloor) ||
        publicationYearFloor < 1800 ||
        publicationYearFloor > this.clock.now().getUTCFullYear())
    ) {
      throw new Error("PubMed publicationYearFloor is outside the supported range.");
    }

    const searchUrl = new URL(`${NCBI_EUTILS_BASE_URL}/esearch.fcgi`);
    searchUrl.searchParams.set("db", "pubmed");
    searchUrl.searchParams.set("retmode", "json");
    searchUrl.searchParams.set("retmax", String(maxResults));
    searchUrl.searchParams.set("term", literalQuery);
    searchUrl.searchParams.set("sort", sort);
    const appliedStructuredFilters = [`sort=${sort}`];
    if (publicationYearFloor !== null) {
      searchUrl.searchParams.set("datetype", "pdat");
      searchUrl.searchParams.set("mindate", `${publicationYearFloor}/01/01`);
      searchUrl.searchParams.set(
        "maxdate",
        this.clock.now().toISOString().slice(0, 10).replaceAll("-", "/"),
      );
      appliedStructuredFilters.push(
        `publicationYearFloor=${publicationYearFloor}`,
      );
    }
    searchUrl.searchParams.set("tool", this.toolName);
    searchUrl.searchParams.set("email", this.contactEmail);
    if (this.apiKey) searchUrl.searchParams.set("api_key", this.apiKey);
    const rawSearch = await this.requestJson(searchUrl);
    if (!isRecord(rawSearch) || !isRecord(rawSearch.esearchresult)) {
      throw new MetadataScoutError(
        "pubmed",
        "UNEXPECTED_RESPONSE",
        "PubMed ESearch response omitted its metadata result.",
      );
    }
    const result = rawSearch.esearchresult;
    const rawIds = Array.isArray(result.idlist) ? result.idlist : [];
    const ids = rawIds
      .filter((id): id is string => typeof id === "string" && /^\d+$/.test(id))
      .slice(0, maxResults);
    const totalResultCount = Number.parseInt(
      typeof result.count === "string" ? result.count : "0",
      10,
    );

    let candidates: MetadataScoutCandidate[] = [];
    if (ids.length > 0) {
      const summaryUrl = new URL(`${NCBI_EUTILS_BASE_URL}/esummary.fcgi`);
      summaryUrl.searchParams.set("db", "pubmed");
      summaryUrl.searchParams.set("retmode", "json");
      summaryUrl.searchParams.set("id", ids.join(","));
      summaryUrl.searchParams.set("tool", this.toolName);
      summaryUrl.searchParams.set("email", this.contactEmail);
      if (this.apiKey) summaryUrl.searchParams.set("api_key", this.apiKey);
      const rawSummary = await this.requestJson(summaryUrl);
      candidates = this.parseSummaries(rawSummary, ids);
    }

    const searchedAt = this.clock.now().toISOString();
    return {
      schemaVersion: 1,
      id: `metadata-scout.pubmed.${sha256(
        `${literalQuery}\u0000${searchedAt}`,
      )}`,
      provider: "pubmed",
      query: literalQuery,
      sort,
      appliedStructuredFilters,
      searchedAt,
      totalResultCount: Number.isSafeInteger(totalResultCount)
        ? Math.max(0, totalResultCount)
        : 0,
      returnedProviderRecordIds: ids,
      candidates,
      metadataOnly: true,
      abstractRequested: false,
      fullTextRequested: false,
      noticeUrl: NCBI_COPYRIGHT_INFORMATION_URL,
    };
  }

  private parseSummaries(
    raw: unknown,
    requestedIds: readonly string[],
  ): MetadataScoutCandidate[] {
    if (!isRecord(raw) || !isRecord(raw.result)) {
      throw new MetadataScoutError(
        "pubmed",
        "UNEXPECTED_RESPONSE",
        "PubMed ESummary response omitted its metadata result.",
      );
    }
    const discoveredAt = this.clock.now().toISOString();
    const records = raw.result;
    return requestedIds.flatMap((pmid) => {
      const value = records[pmid];
      if (!isRecord(value)) return [];
      const title = optionalString(value.title);
      if (!title) return [];
      const authors = Array.isArray(value.authors)
        ? value.authors.flatMap((author) =>
            isRecord(author) && optionalString(author.name)
              ? [optionalString(author.name)!]
              : [],
          )
        : [];
      const articleIds = Array.isArray(value.articleids)
        ? value.articleids
        : [];
      const doi =
        articleIds
          .map((articleId) => {
            if (!isRecord(articleId)) return null;
            return articleId.idtype === "doi"
              ? optionalString(articleId.value)
              : null;
          })
          .find((item): item is string => item !== null) ?? null;
      const publicationTypes = Array.isArray(value.pubtype)
        ? value.pubtype.flatMap((publicationType) => {
            const normalized = optionalString(publicationType);
            return normalized ? [normalized] : [];
          })
        : [];
      const language = Array.isArray(value.lang)
        ? value.lang
            .map(optionalString)
            .find((item): item is string => item !== null) ?? null
        : optionalString(value.lang);
      return [
        {
          schemaVersion: 1 as const,
          id: `metadata-candidate.pubmed.${sha256(pmid)}`,
          provider: "pubmed" as const,
          providerRecordId: pmid,
          title,
          authors,
          publicationDate: optionalString(value.pubdate),
          containerTitle:
            optionalString(value.fulljournalname) ??
            optionalString(value.source),
          publisher: null,
          publicationTypes,
          language,
          doi,
          pmid,
          canonicalUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
          discoveredAt,
          metadataOnly: true as const,
          abstractStored: false as const,
          fullTextStored: false as const,
          bibliographicStatus: "unverified" as const,
        },
      ];
    });
  }
}

export class CrossrefMetadataClient extends MetadataProviderClient {
  protected readonly provider = "crossref" as const;
  protected readonly limiter: SerialRateLimiter;
  private readonly cache = new Map<string, CrossrefMetadataEnrichment>();

  public constructor(options: MetadataScoutClientOptions) {
    super(options);
    // Crossref publishes rate headers; 100 ms is a conservative initial value.
    this.limiter = new SerialRateLimiter(100, this.clock);
  }

  public async search(
    query: string,
    options: {
      maxResults?: number;
      publicationYearFloor?: number | null;
      workType?: "journal-article" | "proceedings-article" | null;
    } = {},
  ): Promise<CrossrefMetadataSearchRun> {
    const literalQuery = query;
    if (!literalQuery.trim() || literalQuery.length > 2_000) {
      throw new Error("Crossref metadata query must contain 1-2000 characters.");
    }
    const maxResults = options.maxResults ?? 20;
    if (
      !Number.isSafeInteger(maxResults) ||
      maxResults < 1 ||
      maxResults > 100
    ) {
      throw new Error("Crossref metadata search may return 1-100 records.");
    }
    const publicationYearFloor = options.publicationYearFloor ?? null;
    if (
      publicationYearFloor !== null &&
      (!Number.isSafeInteger(publicationYearFloor) ||
        publicationYearFloor < 1800 ||
        publicationYearFloor > this.clock.now().getUTCFullYear())
    ) {
      throw new Error(
        "Crossref publicationYearFloor is outside the supported range.",
      );
    }

    const url = new URL(`${CROSSREF_API_BASE_URL}/works`);
    url.searchParams.set("query.bibliographic", literalQuery);
    url.searchParams.set("rows", String(maxResults));
    url.searchParams.set("mailto", this.contactEmail);
    url.searchParams.set("sort", "published");
    url.searchParams.set("order", "desc");
    url.searchParams.set(
      "select",
      "DOI,title,author,issued,container-title,publisher,type,language,URL",
    );
    const filters: string[] = [];
    const appliedStructuredFilters = ["sort=published:desc"];
    if (publicationYearFloor !== null) {
      filters.push(`from-pub-date:${publicationYearFloor}-01-01`);
      appliedStructuredFilters.push(
        `publicationYearFloor=${publicationYearFloor}`,
      );
    }
    if (options.workType) {
      filters.push(`type:${options.workType}`);
      appliedStructuredFilters.push(`type=${options.workType}`);
    }
    if (filters.length > 0) url.searchParams.set("filter", filters.join(","));

    const raw = await this.requestJson(url);
    if (!isRecord(raw) || !isRecord(raw.message)) {
      throw new MetadataScoutError(
        "crossref",
        "UNEXPECTED_RESPONSE",
        "Crossref search response omitted its metadata result.",
      );
    }
    const message = raw.message;
    const items = Array.isArray(message.items) ? message.items : [];
    const searchedAt = this.clock.now().toISOString();
    const candidates = items
      .slice(0, maxResults)
      .flatMap((item) =>
        isRecord(item)
          ? this.projectCrossrefCandidate(item, searchedAt)
          : [],
      );
    const total = Number(message["total-results"]);
    return {
      schemaVersion: 1,
      id: `metadata-scout.crossref-search.${sha256(
        `${literalQuery}\u0000${searchedAt}`,
      )}`,
      provider: "crossref",
      query: literalQuery,
      appliedStructuredFilters,
      searchedAt,
      totalResultCount:
        Number.isSafeInteger(total) && total >= 0 ? total : candidates.length,
      returnedProviderRecordIds: candidates.map(
        (candidate) => candidate.providerRecordId,
      ),
      candidates,
      metadataOnly: true,
      abstractRequested: false,
      fullTextRequested: false,
    };
  }

  public async enrichDoi(
    doi: string,
  ): Promise<CrossrefMetadataEnrichment> {
    const normalizedDoi = doi.trim().replace(/^https?:\/\/doi\.org\//i, "").toLocaleLowerCase();
    if (!/^10\.\d{4,9}\/\S+$/.test(normalizedDoi)) {
      throw new Error("Crossref enrichment requires a valid DOI.");
    }
    const cached = this.cache.get(normalizedDoi);
    if (cached) return cached;

    const url = new URL(
      `${CROSSREF_API_BASE_URL}/works/${encodeURIComponent(normalizedDoi)}`,
    );
    url.searchParams.set("mailto", this.contactEmail);
    const raw = await this.requestJson(url);
    if (!isRecord(raw) || !isRecord(raw.message)) {
      throw new MetadataScoutError(
        "crossref",
        "UNEXPECTED_RESPONSE",
        "Crossref response omitted its metadata record.",
      );
    }
    const message = raw.message;
    const enrichedAt = this.clock.now().toISOString();
    const candidate = this.projectCrossrefCandidate(
      { ...message, DOI: normalizedDoi },
      enrichedAt,
    )[0];
    if (!candidate) {
      throw new MetadataScoutError(
        "crossref",
        "MISSING_TITLE",
        "Crossref metadata record does not contain a title.",
      );
    }
    const result: CrossrefMetadataEnrichment = {
      schemaVersion: 1,
      id: `metadata-scout.crossref.${sha256(
        `${normalizedDoi}\u0000${enrichedAt}`,
      )}`,
      provider: "crossref",
      doi: normalizedDoi,
      enrichedAt,
      candidate,
      metadataOnly: true,
      abstractRequested: false,
      fullTextRequested: false,
    };
    this.cache.set(normalizedDoi, result);
    return result;
  }

  private projectCrossrefCandidate(
    message: Record<string, unknown>,
    discoveredAt: string,
  ): MetadataScoutCandidate[] {
    const title = firstString(message.title);
    if (!title) return [];
    const rawDoi = optionalString(message.DOI);
    const doi =
      rawDoi && /^10\.\d{4,9}\/\S+$/i.test(rawDoi)
        ? rawDoi.toLocaleLowerCase()
        : null;
    const authors = Array.isArray(message.author)
      ? message.author.flatMap((author) => {
          if (!isRecord(author)) return [];
          const name = normalizeWhitespace(
            [optionalString(author.given), optionalString(author.family)]
              .filter((part): part is string => part !== null)
              .join(" "),
          );
          return name ? [name] : [];
        })
      : [];
    const dateParts =
      isRecord(message.issued) && Array.isArray(message.issued["date-parts"])
        ? message.issued["date-parts"]
        : [];
    const firstDate = Array.isArray(dateParts[0]) ? dateParts[0] : [];
    const publicationDate =
      firstDate.length > 0 &&
      firstDate.every(
        (part) => typeof part === "number" && Number.isSafeInteger(part),
      )
        ? firstDate
            .slice(0, 3)
            .map((part, index) =>
              index === 0 ? String(part) : String(part).padStart(2, "0"),
            )
            .join("-")
        : null;
    const providerRecordId =
      doi ??
      optionalString(message.URL) ??
      `crossref-record-${sha256(JSON.stringify(canonicalize(message)))}`;
    return [
      {
        schemaVersion: 1,
        id: `metadata-candidate.crossref.${sha256(providerRecordId)}`,
        provider: "crossref",
        providerRecordId,
        title,
        authors,
        publicationDate,
        containerTitle: firstString(message["container-title"]),
        publisher: optionalString(message.publisher),
        publicationTypes: optionalString(message.type)
          ? [optionalString(message.type)!]
          : [],
        language: optionalString(message.language),
        doi,
        pmid: null,
        canonicalUrl:
          doi !== null
            ? `https://doi.org/${doi}`
            : optionalString(message.URL) ??
              `${CROSSREF_API_BASE_URL}/works/${encodeURIComponent(providerRecordId)}`,
        discoveredAt,
        metadataOnly: true,
        abstractStored: false,
        fullTextStored: false,
        bibliographicStatus: "unverified",
      },
    ];
  }
}

export const writeMetadataScoutRun = async (
  paths: PrivateIntakePaths,
  run: MetadataScoutRun,
): Promise<string> => writeMetadataScoutArtifact(paths, run);

export const writeMetadataScoutArtifact = async (
  paths: PrivateIntakePaths,
  run: MetadataScoutPrivateArtifact,
): Promise<string> => {
  const artifact = metadataScoutPrivateArtifactSchema.parse(run);
  await ensurePrivateIntakePaths(paths);
  const path = resolve(paths.providerDiscovery, `${artifact.id}.json`);
  const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
  try {
    const existing = await readFile(path, "utf8");
    if (existing !== serialized) {
      throw new Error(
        "Immutable metadata scout run exists with different content.",
      );
    }
    return path;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await writePrivateJsonAtomic(path, artifact);
  return path;
};
