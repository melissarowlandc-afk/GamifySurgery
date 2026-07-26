import { createServer, request, type Server } from "node:http";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApiMiddleware } from "./api.js";
import { WorkspaceStore } from "./storage.js";

type TestResponse = {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
  json: Record<string, unknown>;
};

let server: Server;
let port: number;
let temporaryRoot: string;

function callApi(options: {
  path: string;
  method?: string;
  host?: string;
  origin?: string;
  fetchSite?: string;
  etag?: string;
  body?: string;
}): Promise<TestResponse> {
  return new Promise((resolve, reject) => {
    const headers: Record<string, string> = {
      Host: options.host ?? "workbench.test",
      Accept: "application/json",
    };
    if (options.origin !== undefined) headers.Origin = options.origin;
    if (options.fetchSite !== undefined) {
      headers["Sec-Fetch-Site"] = options.fetchSite;
    }
    if (options.etag !== undefined) headers["If-Match"] = options.etag;
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = String(Buffer.byteLength(options.body));
    }
    const outbound = request(
      {
        hostname: "127.0.0.1",
        port,
        path: options.path,
        method: options.method ?? "GET",
        headers,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          resolve({
            status: response.statusCode ?? 0,
            headers: response.headers,
            body,
            json: body ? (JSON.parse(body) as Record<string, unknown>) : {},
          });
        });
      },
    );
    outbound.on("error", reject);
    if (options.body !== undefined) outbound.write(options.body);
    outbound.end();
  });
}

beforeEach(async () => {
  temporaryRoot = await mkdtemp(join(tmpdir(), "clinical-context-api-"));
  const middleware = createApiMiddleware({
    store: new WorkspaceStore(temporaryRoot),
    expectedHost: "workbench.test",
    allowedOrigin: "http://workbench.test",
  });
  server = createServer((incoming, outgoing) => {
    middleware(incoming, outgoing, () => {
      outgoing.statusCode = 404;
      outgoing.end("outside api");
    });
  });
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        throw new Error("Expected a TCP test server.");
      }
      port = address.port;
      resolve();
    });
  });
});

afterEach(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await rm(temporaryRoot, { recursive: true, force: true });
});

describe("local workbench API", () => {
  it("reports only non-sensitive scouting capability state and emits no CORS", async () => {
    const response = await callApi({ path: "/api/health" });

    expect(response.status).toBe(200);
    expect(response.json).toMatchObject({
      status: "ok",
      persistence: "local-only",
      externalAi: false,
      scouting: {
        configured: false,
        automatic: false,
        enabled: false,
      },
      reviewer: {
        id: "reviewer.local.owner",
        role: "owner",
        configuredExplicitly: false,
      },
      reviewerCapabilities: {
        canAcceptExpertOpinion: true,
      },
    });
    expect(response.body.toLowerCase()).not.toContain("contact");
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    expect(response.headers["cache-control"]).toBe("no-store");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("rejects unexpected hosts, cross-origin reads, and mutation without Origin", async () => {
    expect(
      (await callApi({ path: "/api/workspace", host: "evil.test" })).status,
    ).toBe(403);
    expect(
      (
        await callApi({
          path: "/api/workspace",
          origin: "https://evil.test",
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await callApi({
          path: "/api/workspace",
          fetchSite: "cross-site",
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await callApi({
          path: "/api/commands",
          method: "POST",
          etag: '"placeholder"',
          body: "{}",
        })
      ).status,
    ).toBe(403);
  });

  it("returns derived DTOs and appends a valid command with ETag concurrency", async () => {
    const initial = await callApi({ path: "/api/workspace" });
    const initialEtag = initial.headers.etag;
    expect(initial.status).toBe(200);
    expect(typeof initialEtag).toBe("string");
    expect(initial.json).toHaveProperty("view");
    expect(initial.json).toHaveProperty("briefs");
    expect(initial.json).not.toHaveProperty("evidenceGapRevisions");

    const command = JSON.stringify({
      type: "create_gap",
      title: "API-created gap",
      clinicalQuestion: "Which evidence is required?",
      whyNeeded: "A distinct question needs a bounded research record.",
      acceptanceCriteria: ["A human screening decision is present."],
      targetKind: "other",
      targetId: "target.local.api",
      scoutMode: "manual_only",
      preferredSourceTypes: ["journal_article"],
      provider: "manual_other",
      query: "",
      refreshIntervalDays: null,
    });
    const saved = await callApi({
      path: "/api/commands",
      method: "POST",
      origin: "http://workbench.test",
      etag: String(initialEtag),
      body: command,
    });

    expect(saved.status).toBe(200);
    expect(saved.headers.etag).not.toBe(initialEtag);
    const savedView = saved.json.view as { gaps: unknown[] };
    const initialView = initial.json.view as { gaps: unknown[] };
    expect(savedView.gaps).toHaveLength(initialView.gaps.length + 1);

    const stale = await callApi({
      path: "/api/commands",
      method: "POST",
      origin: "http://workbench.test",
      etag: String(initialEtag),
      body: command,
    });
    expect(stale.status).toBe(409);
    expect(stale.json.error).toBe("revision_conflict");
  });

  it("rejects unknown path-like command fields without changing the revision", async () => {
    const initial = await callApi({ path: "/api/workspace" });
    const response = await callApi({
      path: "/api/commands",
      method: "POST",
      origin: "http://workbench.test",
      etag: String(initial.headers.etag),
      body: JSON.stringify({
        type: "create_gap",
        title: "Invalid",
        clinicalQuestion: "Can this carry a path?",
        whyNeeded: "It must be rejected.",
        acceptanceCriteria: ["No path input is accepted."],
        targetKind: "other",
        targetId: "target.local.invalid",
        scoutMode: "manual_only",
        preferredSourceTypes: ["journal_article"],
        provider: "manual_other",
        query: "",
        refreshIntervalDays: null,
        path: "../../.private-clinical-data/source.pdf",
      }),
    });

    expect(response.status).toBe(422);
    expect(response.body).toContain("path");
    expect((await callApi({ path: "/api/workspace" })).headers.etag).toBe(
      initial.headers.etag,
    );
  });

  it("enforces the request-body limit before parsing JSON", async () => {
    const initial = await callApi({ path: "/api/workspace" });
    const response = await callApi({
      path: "/api/commands",
      method: "POST",
      origin: "http://workbench.test",
      etag: String(initial.headers.etag),
      body: JSON.stringify({ value: "x".repeat(300_000) }),
    });

    expect(response.status).toBe(413);
    expect(response.json.error).toBe("body_too_large");
  });

  it("does not implement PUT, preflight CORS, or unconfigured scouting", async () => {
    expect(
      (
        await callApi({
          path: "/api/workspace",
          method: "PUT",
          origin: "http://workbench.test",
          body: "{}",
        })
      ).status,
    ).toBe(405);
    const preflight = await callApi({
      path: "/api/commands",
      method: "OPTIONS",
      origin: "http://workbench.test",
    });
    expect(preflight.status).toBe(405);
    expect(preflight.headers["access-control-allow-origin"]).toBeUndefined();

    const initial = await callApi({ path: "/api/workspace" });
    expect(
      (
        await callApi({
          path: "/api/scout",
          method: "POST",
          origin: "http://workbench.test",
          etag: String(initial.headers.etag),
          body: JSON.stringify({ gapId: "gap.example.evidence-plan" }),
        })
      ).status,
    ).toBe(503);
  });
});
