import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  CrossrefMetadataClient,
  MAX_METADATA_JSON_RESPONSE_BYTES,
  MetadataScoutError,
  PubMedMetadataClient,
  writeMetadataScoutRun,
  type FetchLike,
  type ScoutClock,
} from "./metadata-scout.js";
import {
  ensurePrivateIntakePaths,
  resolvePrivateIntakePaths,
} from "./private-paths.js";

const temporaryRoots: string[] = [];

const makeFakeClock = () => {
  let elapsed = 0;
  const sleeps: number[] = [];
  const base = Date.parse("2026-07-26T12:00:00.000Z");
  const clock: ScoutClock = {
    now: () => new Date(base + elapsed),
    nowMs: () => elapsed,
    sleep: async (milliseconds) => {
      sleeps.push(milliseconds);
      elapsed += milliseconds;
    },
  };
  return { clock, sleeps };
};

const jsonResponse = (
  value: unknown,
  init: ResponseInit = {},
): Response =>
  new Response(JSON.stringify(value), {
    status: 200,
    headers: { "content-type": "application/json", ...init.headers },
    ...init,
  });

afterEach(async () => {
  await Promise.all(
    temporaryRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe("metadata-only clinical research scouting", () => {
  it("requires an explicit contact email and tool identifier", () => {
    expect(
      () =>
        new PubMedMetadataClient({
          contactEmail: "not-an-email",
          toolName: "GamifySurgery",
        }),
    ).toThrow(/contact email/);
    expect(
      () =>
        new PubMedMetadataClient({
          contactEmail: "researcher@example.org",
          toolName: "x",
        }),
    ).toThrow(/tool/i);
  });

  it("uses only PubMed ESearch and ESummary and projects no abstract", async () => {
    const { clock, sleeps } = makeFakeClock();
    const calls: URL[] = [];
    const responses = [
      jsonResponse({
        esearchresult: { count: "1", idlist: ["12345"] },
      }),
      jsonResponse({
        result: {
          uids: ["12345"],
          "12345": {
            uid: "12345",
            title: "A surgical metadata result",
            pubdate: "2025 Jan",
            fulljournalname: "Journal of Metadata",
            authors: [{ name: "Doe J" }],
            pubtype: ["Systematic Review", "Journal Article"],
            lang: ["eng"],
            articleids: [
              { idtype: "pubmed", value: "12345" },
              { idtype: "doi", value: "10.1234/example" },
            ],
            abstract: "This protected abstract must never be projected.",
          },
        },
      }),
    ];
    const fetch: FetchLike = async (input) => {
      calls.push(new URL(String(input)));
      return responses.shift()!;
    };
    const client = new PubMedMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      fetch,
      clock,
    });

    const run = await client.search("surgery  guideline", { maxResults: 5 });

    expect(calls.map((url) => url.pathname)).toEqual([
      "/entrez/eutils/esearch.fcgi",
      "/entrez/eutils/esummary.fcgi",
    ]);
    for (const url of calls) {
      expect(url.searchParams.get("tool")).toBe("GamifySurgeryResearch");
      expect(url.searchParams.get("email")).toBe(
        "researcher@example.org",
      );
      expect(url.searchParams.get("retmode")).toBe("json");
    }
    expect(calls[0]?.searchParams.get("sort")).toBe("pub date");
    expect(calls[0]?.searchParams.get("term")).toBe("surgery  guideline");
    expect(run.query).toBe("surgery  guideline");
    expect(sleeps).toEqual([350]);
    expect(run).toMatchObject({
      provider: "pubmed",
      metadataOnly: true,
      abstractRequested: false,
      fullTextRequested: false,
      returnedProviderRecordIds: ["12345"],
    });
    expect(run.candidates[0]).toMatchObject({
      pmid: "12345",
      doi: "10.1234/example",
      metadataOnly: true,
      abstractStored: false,
      fullTextStored: false,
      bibliographicStatus: "unverified",
      publicationTypes: ["Systematic Review", "Journal Article"],
      language: "eng",
    });
    expect(JSON.stringify(run)).not.toContain("protected abstract");
  });

  it("uses an optional NCBI API key only in requests and applies the keyed rate ceiling", async () => {
    const { clock, sleeps } = makeFakeClock();
    const calls: URL[] = [];
    const responses = [
      jsonResponse({
        esearchresult: { count: "1", idlist: ["777"] },
      }),
      jsonResponse({
        result: {
          uids: ["777"],
          "777": {
            title: "Keyed metadata result",
            authors: [{ name: "Researcher K" }],
            articleids: [],
          },
        },
      }),
    ];
    const client = new PubMedMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      apiKey: "privatekey123",
      fetch: async (input) => {
        calls.push(new URL(String(input)));
        return responses.shift()!;
      },
      clock,
    });

    const run = await client.search("keyed query");

    expect(calls).toHaveLength(2);
    expect(calls.every((url) => url.searchParams.get("api_key") === "privatekey123")).toBe(true);
    expect(sleeps).toEqual([100]);
    expect(JSON.stringify(run)).not.toContain("privatekey123");
  });

  it("searches Crossref works metadata without requesting abstracts or full text", async () => {
    const { clock } = makeFakeClock();
    const calls: URL[] = [];
    const client = new CrossrefMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      clock,
      fetch: async (input) => {
        calls.push(new URL(String(input)));
        return jsonResponse({
          message: {
            "total-results": 1,
            items: [
              {
                DOI: "10.1234/search.result",
                title: ["Surgical metadata search result"],
                author: [{ given: "Casey", family: "Researcher" }],
                issued: { "date-parts": [[2026, 4, 1]] },
                "container-title": ["Surgery"],
                publisher: "Example Publisher",
                type: "journal-article",
                language: "en",
                abstract: "Must not be retained.",
                link: [{ URL: "https://example.test/full-text.pdf" }],
              },
            ],
          },
        });
      },
    });

    const run = await client.search("literal surgical query", {
      maxResults: 5,
      publicationYearFloor: 2020,
      workType: "journal-article",
    });

    expect(calls[0]?.pathname).toBe("/works");
    expect(calls[0]?.searchParams.get("query.bibliographic")).toBe(
      "literal surgical query",
    );
    expect(calls[0]?.searchParams.get("filter")).toBe(
      "from-pub-date:2020-01-01,type:journal-article",
    );
    expect(calls[0]?.searchParams.get("select")).not.toContain("abstract");
    expect(run.candidates[0]).toMatchObject({
      doi: "10.1234/search.result",
      publicationTypes: ["journal-article"],
      language: "en",
      metadataOnly: true,
      abstractStored: false,
      fullTextStored: false,
    });
    expect(JSON.stringify(run)).not.toContain("Must not be retained");
    expect(JSON.stringify(run)).not.toContain("full-text.pdf");
  });

  it("serializes Crossref requests, honors rate headers, and caches DOI metadata", async () => {
    const { clock, sleeps } = makeFakeClock();
    const calls: URL[] = [];
    const values = ["10.1234/first", "10.1234/second"];
    const fetch: FetchLike = async (input, init) => {
      const url = new URL(String(input));
      calls.push(url);
      expect(init?.headers).toMatchObject({
        Accept: "application/json",
      });
      const doi = values[calls.length - 1]!;
      return jsonResponse(
        {
          message: {
            DOI: doi,
            title: [`Title for ${doi}`],
            author: [{ given: "Alex", family: "Surgeon" }],
            issued: { "date-parts": [[2026, 7, calls.length]] },
            "container-title": ["Surgical Journal"],
            publisher: "Example Publisher",
            abstract: "Never retain this.",
            link: [{ URL: "https://example.org/full-text.pdf" }],
          },
        },
        { headers: { "x-rate-limit-interval": "1s" } },
      );
    };
    const client = new CrossrefMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      fetch,
      clock,
    });

    const first = await client.enrichDoi(values[0]!);
    const cached = await client.enrichDoi(values[0]!);
    const second = await client.enrichDoi(values[1]!);

    expect(cached).toBe(first);
    expect(calls).toHaveLength(2);
    expect(calls[0]?.searchParams.get("mailto")).toBe(
      "researcher@example.org",
    );
    expect(sleeps).toEqual([1000]);
    expect(second.candidate).toMatchObject({
      doi: "10.1234/second",
      canonicalUrl: "https://doi.org/10.1234/second",
      metadataOnly: true,
      abstractStored: false,
      fullTextStored: false,
    });
    expect(JSON.stringify([first, second])).not.toContain("Never retain");
    expect(JSON.stringify([first, second])).not.toContain("full-text.pdf");
  });

  it("redacts provider failures and never includes response bodies", async () => {
    const { clock } = makeFakeClock();
    const client = new PubMedMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      clock,
      fetch: async () => {
        throw new Error(
          "https://example.org/fail?email=researcher@example.org&token=secret",
        );
      },
    });

    await expect(client.search("test query")).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof MetadataScoutError &&
        error.code === "NETWORK_ERROR" &&
        !error.message.includes("researcher@example.org") &&
        !error.message.includes("secret"),
    );
  });

  it("aborts a metadata request that exceeds its local deadline", async () => {
    const { clock } = makeFakeClock();
    const client = new PubMedMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      clock,
      requestTimeoutMilliseconds: 10,
      fetch: async (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new Error("request aborted")),
          );
        }),
    });

    await expect(client.search("test query")).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof MetadataScoutError &&
        error.code === "REQUEST_TIMEOUT" &&
        !error.message.includes("researcher@example.org"),
    );
  });

  it("keeps the request deadline active while consuming the response body", async () => {
    const { clock } = makeFakeClock();
    let bodyAborted = false;
    const client = new PubMedMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      clock,
      requestTimeoutMilliseconds: 10,
      fetch: async (_input, init) =>
        new Response(
          new ReadableStream<Uint8Array>({
            start: (controller) => {
              init?.signal?.addEventListener(
                "abort",
                () => {
                  bodyAborted = true;
                  controller.error(new Error("slow body aborted"));
                },
                { once: true },
              );
            },
          }),
          { headers: { "content-type": "application/json" } },
        ),
    });

    await expect(client.search("test query")).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof MetadataScoutError &&
        error.code === "REQUEST_TIMEOUT" &&
        !error.message.includes("researcher@example.org"),
    );
    expect(bodyAborted).toBe(true);
  });

  it("rejects declared and streamed metadata bodies above the byte limit", async () => {
    const { clock } = makeFakeClock();
    const declaredLengthClient = new PubMedMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      clock,
      fetch: async () =>
        new Response("{}", {
          headers: {
            "content-length": String(
              MAX_METADATA_JSON_RESPONSE_BYTES + 1,
            ),
            "content-type": "application/json",
          },
        }),
    });
    const streamedBodyClient = new PubMedMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      clock,
      fetch: async () =>
        new Response(
          new ReadableStream<Uint8Array>({
            start: (controller) => {
              controller.enqueue(
                new TextEncoder().encode('{"private":"body-secret"}'),
              );
              controller.enqueue(
                new Uint8Array(MAX_METADATA_JSON_RESPONSE_BYTES),
              );
              controller.close();
            },
          }),
          { headers: { "content-type": "application/json" } },
        ),
    });
    const isSanitizedSizeError = (error: unknown) =>
      error instanceof MetadataScoutError &&
      error.code === "RESPONSE_TOO_LARGE" &&
      !error.message.includes("body-secret") &&
      !error.message.includes("researcher@example.org");

    await expect(
      declaredLengthClient.search("declared oversized response"),
    ).rejects.toSatisfy(isSanitizedSizeError);
    await expect(
      streamedBodyClient.search("streamed oversized response"),
    ).rejects.toSatisfy(isSanitizedSizeError);
  });

  it("sanitizes response-body read failures", async () => {
    const { clock } = makeFakeClock();
    const client = new PubMedMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      clock,
      fetch: async () =>
        new Response(
          new ReadableStream<Uint8Array>({
            start: (controller) => {
              controller.error(
                new Error(
                  "https://example.org/body?email=researcher@example.org&token=private-token",
                ),
              );
            },
          }),
          { headers: { "content-type": "application/json" } },
        ),
    });

    await expect(client.search("body error")).rejects.toSatisfy(
      (error: unknown) =>
        error instanceof MetadataScoutError &&
        error.code === "NETWORK_ERROR" &&
        !error.message.includes("researcher@example.org") &&
        !error.message.includes("private-token"),
    );
  });

  it("writes immutable metadata-only provider manifests under the private root", async () => {
    const projectRoot = await mkdtemp(
      join(tmpdir(), "gamify-surgery-metadata-scout-"),
    );
    temporaryRoots.push(projectRoot);
    const paths = resolvePrivateIntakePaths(projectRoot);
    await ensurePrivateIntakePaths(paths);
    const { clock } = makeFakeClock();
    const responses = [
      jsonResponse({
        esearchresult: { count: "1", idlist: ["42"] },
      }),
      jsonResponse({
        result: {
          uids: ["42"],
          "42": { title: "Metadata only", articleids: [] },
        },
      }),
    ];
    const client = new PubMedMetadataClient({
      contactEmail: "researcher@example.org",
      toolName: "GamifySurgeryResearch",
      clock,
      fetch: async () => responses.shift()!,
    });
    const run = await client.search("metadata test");
    const path = await writeMetadataScoutRun(paths, run);

    expect(path.startsWith(paths.providerDiscovery)).toBe(true);
    const stored = await readFile(path, "utf8");
    expect(stored).toContain('"metadataOnly": true');
    expect(stored).not.toMatch(/"abstract"\s*:/i);
    await expect(writeMetadataScoutRun(paths, run)).resolves.toBe(path);

    const candidate = run.candidates[0]!;
    const unsafeRuns = [
      {
        ...run,
        id: "metadata-scout.pubmed.unsafe-content",
        content: "full text",
      },
      {
        ...run,
        id: "metadata-scout.pubmed.unsafe-text",
        candidates: [{ ...candidate, text: "full text" }],
      },
      {
        ...run,
        id: "metadata-scout.pubmed.unsafe-excerpt",
        candidates: [{ ...candidate, excerpt: "full text" }],
      },
    ];
    for (const unsafeRun of unsafeRuns) {
      await expect(
        writeMetadataScoutRun(paths, unsafeRun as never),
      ).rejects.toThrow(/unrecognized|content|text|excerpt/i);
    }
    expect(await readdir(paths.providerDiscovery)).toEqual([`${run.id}.json`]);
  });
});
