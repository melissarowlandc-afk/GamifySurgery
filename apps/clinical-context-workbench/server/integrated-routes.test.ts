import { createServer, request, type Server } from "node:http";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { SanitizedAuthoringContext } from "@gamify-surgery/clinical-research/node";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createApiMiddleware,
  type ApiOptions,
  type AuthoringContextService,
  type PrivateIntakeService,
  type ScoutCoordinator,
} from "./api.js";
import { applyWorkbenchCommand } from "./commands.js";
import { WorkspaceStore } from "./storage.js";

type TestResponse = {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
  json: Record<string, unknown>;
};

type ApiCaller = (options: {
  path: string;
  method?: string;
  host?: string;
  origin?: string;
  etag?: string;
  body?: string;
}) => Promise<TestResponse>;

const openServers: Server[] = [];
const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    openServers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
    ),
  );
  await Promise.all(
    temporaryRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  );
  vi.restoreAllMocks();
});

async function createHarness(
  services: Pick<
    ApiOptions,
    | "scoutCoordinator"
    | "privateIntake"
    | "authoringContext"
    | "reviewer"
  >,
): Promise<ApiCaller> {
  const temporaryRoot = await mkdtemp(
    join(tmpdir(), "clinical-integrated-routes-"),
  );
  temporaryRoots.push(temporaryRoot);
  const middleware = createApiMiddleware({
    store: new WorkspaceStore(temporaryRoot),
    expectedHost: "workbench.test",
    allowedOrigin: "http://workbench.test",
    ...services,
  });
  const server = createServer((incoming, outgoing) => {
    middleware(incoming, outgoing, () => {
      outgoing.statusCode = 404;
      outgoing.end("outside api");
    });
  });
  openServers.push(server);
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("Expected a TCP test server.");
  }
  const port = address.port;

  return (options) =>
    new Promise((resolve, reject) => {
      const headers: Record<string, string> = {
        Host: options.host ?? "workbench.test",
        Accept: "application/json",
      };
      if (options.origin !== undefined) headers.Origin = options.origin;
      if (options.etag !== undefined) headers["If-Match"] = options.etag;
      if (options.body !== undefined) {
        headers["Content-Type"] = "application/json";
        headers["Content-Length"] = String(
          Buffer.byteLength(options.body),
        );
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
              json: body
                ? (JSON.parse(body) as Record<string, unknown>)
                : {},
            });
          });
        },
      );
      outbound.on("error", reject);
      if (options.body !== undefined) outbound.write(options.body);
      outbound.end();
    });
}

const healthLeakingScout = (): ScoutCoordinator => ({
  status: () =>
    ({
      configured: true,
      automatic: true,
      enabled: true,
      contactEmail: "private-contact@example.test",
      apiKey: "private-api-key",
    }) as never,
  scout: vi.fn(async (workspace) =>
    applyWorkbenchCommand(workspace, {
      type: "create_gap",
      title: "Scout integration marker",
      clinicalQuestion: "Did the selected metadata scout execute?",
      whyNeeded: "The fake appends a valid transition for route testing.",
      acceptanceCriteria: ["The selected gap ID reaches the coordinator."],
      targetKind: "other",
      targetId: "target.local.scout-integration",
      scoutMode: "manual_only",
      preferredSourceTypes: ["journal_article"],
      provider: "manual_other",
      query: "",
      refreshIntervalDays: null,
    }),
  ),
});

const safeIntakeStatus = {
  configured: true as const,
  enabled: true as const,
  maximumSourceBytes: 25 * 1024 * 1024,
  inboxFilenames: ["chapter.txt"],
  unsafeInboxEntryCount: 0,
  intakeLockPresent: false,
  entries: [],
  manifestUpdatedAt: "2026-07-26T12:00:00.000Z",
  integrityAuditStatus: "not_run" as const,
  integrityAuditIssueCount: null,
  integrityAuditedAt: null,
};

const createFakeIntake = (): PrivateIntakeService => ({
  status: vi.fn(async () => safeIntakeStatus),
  audit: vi.fn(async () => ({
    ...safeIntakeStatus,
    integrityAuditStatus: "passed" as const,
    integrityAuditIssueCount: 0,
    integrityAuditedAt: "2026-07-26T12:01:00.000Z",
  })),
  recoverLock: vi.fn(async () => safeIntakeStatus),
  scan: vi.fn(async () => ({
    report: {
      queued: 1,
      duplicates: 0,
      rightsBlocked: 0,
      quarantined: 0,
      ignored: 0,
    },
    status: safeIntakeStatus,
  })),
  extract: vi.fn(async (_workspace) => ({
    report: { extracted: 1, quarantined: 0 },
    status: safeIntakeStatus,
  })),
  safeError: () => "Private intake request failed safely.",
});

const sanitizedContext: SanitizedAuthoringContext = {
  schemaVersion: 1,
  authoringWorkspaceId: "authoring.workspace.integration",
  authoringWorkspaceUpdatedAt: "2026-07-26T12:00:00.000Z",
  sources: [{ id: "source.authoring.integration", label: "Source label" }],
  citations: [],
  topicRevisions: [],
  structuredFacts: [],
  testedConcepts: [],
};

const createFakeAuthoring = (): AuthoringContextService => ({
  load: vi.fn(async () => sanitizedContext),
  sync: vi.fn(async (workspace) => {
    const next = structuredClone(workspace);
    next.externalReferences.sources.push({
      id: "source.authoring.integration",
    });
    next.updatedAt = new Date(
      Date.parse(workspace.updatedAt) + 1,
    ).toISOString();
    return { workspace: next, context: sanitizedContext };
  }),
});

const validAcknowledgement = {
  noIdentifiablePatientInformation: true,
  authorizedLocalStorageAndProcessing: true,
  sharedAndCopyrightedMaterialConsidered: true,
  scope: "Owner-authored non-PHI local pilot source.",
};

describe("integrated local Workbench route boundaries", () => {
  it("does not let a developer accept Expert Opinion through the API", async () => {
    const call = await createHarness({
      reviewer: {
        id: "reviewer.local.developer",
        role: "developer",
        configuredExplicitly: true,
      },
    });
    const initial = await call({ path: "/api/workspace" });
    const initialView = initial.json.view as {
      gaps: { id: string }[];
    };
    const proposed = await call({
      path: "/api/commands",
      method: "POST",
      origin: "http://workbench.test",
      etag: String(initial.headers.etag),
      body: JSON.stringify({
        type: "add_expert_opinion",
        gapId: initialView.gaps[0]!.id,
        statement: "A developer may propose this bounded perspective.",
        rationale: "A clinical reviewer still needs to accept it.",
        clinicalScope: "Role-gate API testing only.",
        limitations: ["It is not formal evidence."],
      }),
    });
    expect(proposed.status).toBe(200);
    const proposedView = proposed.json.view as {
      expertOpinions: { id: string; reviewStatus: string }[];
    };
    const blocked = await call({
      path: "/api/commands",
      method: "POST",
      origin: "http://workbench.test",
      etag: String(proposed.headers.etag),
      body: JSON.stringify({
        type: "review_expert_opinion",
        opinionId: proposedView.expertOpinions[0]!.id,
        disposition: "accepted",
        reviewNote: "A developer attempts clinical acceptance.",
      }),
    });

    expect(blocked.status).toBe(422);
    expect(blocked.body).toMatch(/only an owner or clinical reviewer/i);
    const persisted = await call({ path: "/api/workspace" });
    const persistedView = persisted.json.view as {
      expertOpinions: { reviewStatus: string }[];
      contributions: unknown[];
    };
    expect(persisted.headers.etag).toBe(proposed.headers.etag);
    expect(persistedView.expertOpinions[0]!.reviewStatus).toBe(
      "proposed",
    );
    expect(persistedView.contributions).toHaveLength(0);
  });

  it("redacts scout configuration and binds Scout now to one selected gap", async () => {
    const coordinator = healthLeakingScout();
    const call = await createHarness({ scoutCoordinator: coordinator });
    const health = await call({ path: "/api/health" });

    expect(health.status).toBe(200);
    expect(health.json.scouting).toEqual({
      configured: true,
      automatic: true,
      enabled: true,
    });
    expect(health.body).not.toContain("private-contact@example.test");
    expect(health.body).not.toContain("private-api-key");

    const initial = await call({ path: "/api/workspace" });
    const etag = String(initial.headers.etag);
    const selectedGapId = "gap.example.evidence-plan";
    expect(
      (
        await call({
          path: "/api/scout",
          method: "POST",
          origin: "http://workbench.test",
          body: JSON.stringify({ gapId: selectedGapId }),
        })
      ).status,
    ).toBe(428);
    expect(
      (
        await call({
          path: "/api/scout",
          method: "POST",
          etag,
          body: JSON.stringify({ gapId: selectedGapId }),
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await call({
          path: "/api/scout",
          method: "POST",
          host: "evil.test",
          origin: "http://workbench.test",
          etag,
          body: JSON.stringify({ gapId: selectedGapId }),
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await call({
          path: "/api/scout",
          method: "POST",
          origin: "http://workbench.test",
          etag,
          body: JSON.stringify({
            gapId: selectedGapId,
            contactEmail: "attacker@example.test",
            path: "../../source.pdf",
          }),
        })
      ).status,
    ).toBe(422);

    const response = await call({
      path: "/api/scout",
      method: "POST",
      origin: "http://workbench.test",
      etag,
      body: JSON.stringify({ gapId: selectedGapId }),
    });
    expect(response.status).toBe(200);
    expect(coordinator.scout).toHaveBeenCalledTimes(1);
    expect(coordinator.scout).toHaveBeenCalledWith(
      expect.any(Object),
      selectedGapId,
    );
  });

  it("rejects paths and incomplete safety input at intake routes and applies same-origin/ETag policy", async () => {
    const privateIntake = createFakeIntake();
    const call = await createHarness({ privateIntake });

    expect(
      (
        await call({
          path: "/api/intake",
          origin: "https://evil.test",
        })
      ).status,
    ).toBe(403);
    const status = await call({ path: "/api/intake" });
    expect(status.status).toBe(200);
    expect(status.body).not.toMatch(
      /(?:manifestPath|storageRelativePath|sourceText|artifactPath)/,
    );

    const initial = await call({ path: "/api/workspace" });
    const etag = String(initial.headers.etag);
    const validRequest = {
      assignments: [
        {
          filename: "chapter.txt",
          rightsDecisionId: "rights.local.chapter.current",
        },
      ],
      acknowledgement: validAcknowledgement,
    };
    expect(
      (
        await call({
          path: "/api/intake/scan",
          method: "POST",
          origin: "http://workbench.test",
          body: JSON.stringify(validRequest),
        })
      ).status,
    ).toBe(428);
    expect(
      (
        await call({
          path: "/api/intake/scan",
          method: "POST",
          etag,
          body: JSON.stringify(validRequest),
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await call({
          path: "/api/intake/scan",
          method: "POST",
          origin: "http://workbench.test",
          etag,
          body: JSON.stringify({
            ...validRequest,
            path: "../../.private-clinical-data",
          }),
        })
      ).status,
    ).toBe(422);
    expect(
      (
        await call({
          path: "/api/intake/scan",
          method: "POST",
          origin: "http://workbench.test",
          etag,
          body: JSON.stringify({
            ...validRequest,
            acknowledgement: {
              ...validAcknowledgement,
              noIdentifiablePatientInformation: false,
            },
          }),
        })
      ).status,
    ).toBe(422);
    expect(
      (
        await call({
          path: "/api/intake/scan",
          method: "POST",
          origin: "http://workbench.test",
          etag: '"stale"',
          body: JSON.stringify(validRequest),
        })
      ).status,
    ).toBe(409);

    const scanned = await call({
      path: "/api/intake/scan",
      method: "POST",
      origin: "http://workbench.test",
      etag,
      body: JSON.stringify(validRequest),
    });
    expect(scanned.status).toBe(200);
    expect(privateIntake.scan).toHaveBeenCalledWith(
      expect.any(Object),
      validRequest,
    );
    expect(scanned.body).not.toMatch(
      /(?:manifestPath|storageRelativePath|sourceText|artifactPath)/,
    );

    expect(
      (
        await call({
          path: "/api/intake/extract",
          method: "POST",
          origin: "http://workbench.test",
          body: "{}",
        })
      ).status,
    ).toBe(428);
    expect(
      (
        await call({
          path: "/api/intake/extract",
          method: "POST",
          etag,
          body: "{}",
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await call({
          path: "/api/intake/extract",
          method: "POST",
          origin: "http://workbench.test",
          etag: '"stale"',
          body: "{}",
        })
      ).status,
    ).toBe(409);
    expect(
      (
        await call({
          path: "/api/intake/extract",
          method: "POST",
          origin: "http://workbench.test",
          etag,
          body: JSON.stringify({ path: "../../source.txt" }),
        })
      ).status,
    ).toBe(422);
    const extracted = await call({
      path: "/api/intake/extract",
      method: "POST",
      origin: "http://workbench.test",
      etag,
      body: "{}",
    });
    expect(extracted.status).toBe(200);
    expect(privateIntake.extract).toHaveBeenCalledWith(expect.any(Object));
    expect(extracted.body).not.toMatch(
      /(?:manifestPath|storageRelativePath|sourceText|artifactPath)/,
    );
    expect(
      (
        await call({
          path: "/api/intake/audit",
          method: "POST",
          etag,
          body: "{}",
        })
      ).status,
    ).toBe(403);
    const audited = await call({
      path: "/api/intake/audit",
      method: "POST",
      origin: "http://workbench.test",
      etag,
      body: "{}",
    });
    expect(audited.status).toBe(200);
    expect(privateIntake.audit).toHaveBeenCalledTimes(1);
    expect(audited.json).toMatchObject({
      integrityAuditStatus: "passed",
      integrityAuditIssueCount: 0,
    });
    expect(
      (
        await call({
          path: "/api/intake/recover-lock",
          method: "POST",
          origin: "http://workbench.test",
          etag,
          body: JSON.stringify({ reason: "x" }),
        })
      ).status,
    ).toBe(422);
    const recovered = await call({
      path: "/api/intake/recover-lock",
      method: "POST",
      origin: "http://workbench.test",
      etag,
      body: JSON.stringify({
        reason: "Confirmed prior local process terminated.",
      }),
    });
    expect(recovered.status).toBe(200);
    expect(privateIntake.recoverLock).toHaveBeenCalledWith(
      "Confirmed prior local process terminated.",
    );
  });

  it("exposes only sanitized authoring context and protects fixed-path sync with same-origin/ETag checks", async () => {
    const authoringContext = createFakeAuthoring();
    const call = await createHarness({ authoringContext });

    expect(
      (
        await call({
          path: "/api/authoring/context",
          origin: "https://evil.test",
        })
      ).status,
    ).toBe(403);
    const context = await call({ path: "/api/authoring/context" });
    expect(context.status).toBe(200);
    expect(context.json).toEqual(sanitizedContext);
    expect(context.body).not.toMatch(
      /(?:path|narrative|supportedClaim|sourceText)/,
    );

    const initial = await call({ path: "/api/workspace" });
    const etag = String(initial.headers.etag);
    expect(
      (
        await call({
          path: "/api/authoring/sync",
          method: "POST",
          origin: "http://workbench.test",
          body: "{}",
        })
      ).status,
    ).toBe(428);
    expect(
      (
        await call({
          path: "/api/authoring/sync",
          method: "POST",
          etag,
          body: "{}",
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await call({
          path: "/api/authoring/sync",
          method: "POST",
          origin: "http://workbench.test",
          etag: '"stale"',
          body: "{}",
        })
      ).status,
    ).toBe(409);
    expect(
      (
        await call({
          path: "/api/authoring/sync",
          method: "POST",
          origin: "http://workbench.test",
          etag,
          body: JSON.stringify({
            path: "../../alternate-authoring-workspace.json",
          }),
        })
      ).status,
    ).toBe(422);

    const synchronized = await call({
      path: "/api/authoring/sync",
      method: "POST",
      origin: "http://workbench.test",
      etag,
      body: "{}",
    });
    expect(synchronized.status).toBe(200);
    expect(authoringContext.sync).toHaveBeenCalledTimes(1);
    expect(synchronized.json.authoringContext).toEqual(sanitizedContext);
    expect(synchronized.body).not.toMatch(
      /(?:path|narrative|supportedClaim|sourceText)/,
    );
  });
});
