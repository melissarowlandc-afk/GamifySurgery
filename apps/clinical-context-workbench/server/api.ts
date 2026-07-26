import type { IncomingMessage, ServerResponse } from "node:http";

import {
  ResearchWorkspaceTransitionError,
  type ResearchWorkspace,
} from "@gamify-surgery/clinical-research";
import type { SanitizedAuthoringContext } from "@gamify-surgery/clinical-research/node";

import { applyWorkbenchCommand, CommandInputError } from "./commands.js";
import type {
  IntakeScanRequest,
  IntakeStatus,
} from "./intake.js";
import { presentWorkspace } from "./presentation.js";
import {
  canAcceptExpertOpinion,
  type LocalReviewerProfile,
} from "./reviewer.js";
import {
  WorkspaceConflictError,
  WorkspaceStore,
  WorkspaceValidationError,
} from "./storage.js";
import {
  assertRequestAuthority,
  RequestSecurityError,
  sendJson,
} from "./security.js";

const DEFAULT_BODY_LIMIT = 256 * 1024;

type NextFunction = (error?: unknown) => void;

export type ApiMiddleware = (
  request: IncomingMessage,
  response: ServerResponse,
  next: NextFunction,
) => void;

export type ScoutStatus = {
  configured: boolean;
  automatic: boolean;
  enabled: boolean;
};

/**
 * Injected by trusted Node configuration only. The browser can request a gap
 * scout, but it cannot supply provider URLs, credentials, contact values, or
 * filesystem paths.
 */
export interface ScoutCoordinator {
  status(): ScoutStatus;
  scout(
    workspace: ResearchWorkspace,
    evidenceGapId: string,
  ): Promise<ResearchWorkspace>;
  scoutDue?(
    workspace: ResearchWorkspace,
  ): Promise<ResearchWorkspace | null>;
}

export interface PrivateIntakeService {
  status(): Promise<IntakeStatus>;
  audit(): Promise<IntakeStatus>;
  recoverLock(reason: string): Promise<IntakeStatus>;
  scan(
    workspace: ResearchWorkspace,
    request: IntakeScanRequest,
  ): Promise<unknown>;
  extract(workspace: ResearchWorkspace): Promise<unknown>;
  safeError(error: unknown): string;
}

export interface AuthoringContextService {
  load(): Promise<SanitizedAuthoringContext>;
  sync(workspace: ResearchWorkspace): Promise<{
    workspace: ResearchWorkspace;
    context: SanitizedAuthoringContext;
  }>;
}

export type ApiOptions = {
  store: WorkspaceStore;
  expectedHost?: string;
  allowedOrigin?: string;
  maxBodyBytes?: number;
  scoutCoordinator?: ScoutCoordinator;
  privateIntake?: PrivateIntakeService;
  authoringContext?: AuthoringContextService;
  reviewer?: LocalReviewerProfile;
};

type ResolvedApiOptions = {
  store: WorkspaceStore;
  expectedHost: string;
  allowedOrigin: string;
  maxBodyBytes: number;
  scoutCoordinator: ScoutCoordinator | null;
  privateIntake: PrivateIntakeService | null;
  authoringContext: AuthoringContextService | null;
  reviewer: LocalReviewerProfile;
};

class ApiInputError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiInputError";
  }
}

async function readJsonBody(
  request: IncomingMessage,
  maxBodyBytes: number,
): Promise<unknown> {
  const contentType = request.headers["content-type"];
  if (
    typeof contentType !== "string" ||
    !contentType.toLowerCase().startsWith("application/json")
  ) {
    throw new ApiInputError(
      415,
      "unsupported_media_type",
      "Content-Type must be application/json.",
    );
  }
  const contentLength = request.headers["content-length"];
  if (typeof contentLength === "string") {
    const declaredSize = Number(contentLength);
    if (
      !Number.isSafeInteger(declaredSize) ||
      declaredSize < 0 ||
      declaredSize > maxBodyBytes
    ) {
      throw new ApiInputError(
        413,
        "body_too_large",
        `Request bodies are limited to ${maxBodyBytes} bytes.`,
      );
    }
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBodyBytes) {
      throw new ApiInputError(
        413,
        "body_too_large",
        `Request bodies are limited to ${maxBodyBytes} bytes.`,
      );
    }
    chunks.push(buffer);
  }
  if (size === 0) {
    throw new ApiInputError(
      400,
      "empty_body",
      "A JSON request document is required.",
    );
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new ApiInputError(
      400,
      "invalid_json",
      "The request body is not valid JSON.",
    );
  }
}

function snapshotPayload(
  workspace: ResearchWorkspace,
  revision: string,
): Record<string, unknown> {
  return {
    ...presentWorkspace(workspace),
    revision,
  };
}

const requiredIfMatch = (request: IncomingMessage): string => {
  const ifMatch = request.headers["if-match"];
  if (typeof ifMatch !== "string" || ifMatch.includes(",")) {
    throw new ApiInputError(
      428,
      "precondition_required",
      "A single current If-Match ETag is required.",
    );
  }
  return ifMatch;
};

const assertCurrentEtag = (
  response: ServerResponse,
  expected: string,
  actual: string,
): boolean => {
  if (expected === actual) return true;
  response.setHeader("ETag", actual);
  sendJson(response, 409, {
    error: "revision_conflict",
    message: "The workspace changed after it was loaded.",
    currentEtag: actual,
  });
  return false;
};

const emptyObjectBody = (value: unknown): void => {
  const body = recordBody(value);
  if (Object.keys(body).length > 0) {
    throw new ApiInputError(
      422,
      "invalid_request",
      "This endpoint accepts only an empty JSON object.",
    );
  }
};

const parseIntakeScanRequest = (value: unknown): IntakeScanRequest => {
  const body = recordBody(value);
  if (
    Object.keys(body).some(
      (key) => key !== "assignments" && key !== "acknowledgement",
    ) ||
    !Array.isArray(body.assignments)
  ) {
    throw new ApiInputError(
      422,
      "invalid_intake_request",
      "An assignments array and safety acknowledgement are required.",
    );
  }
  const assignments = body.assignments.map((candidate) => {
    const assignment = recordBody(candidate);
    if (
      Object.keys(assignment).some(
        (key) => key !== "filename" && key !== "rightsDecisionId",
      ) ||
      typeof assignment.filename !== "string" ||
      typeof assignment.rightsDecisionId !== "string" ||
      !ID_PATTERN.test(assignment.rightsDecisionId)
    ) {
      throw new ApiInputError(
        422,
        "invalid_intake_request",
        "Every intake assignment needs one filename and stable rights-decision ID.",
      );
    }
    return {
      filename: assignment.filename,
      rightsDecisionId: assignment.rightsDecisionId,
    };
  });
  const acknowledgement = recordBody(body.acknowledgement);
  if (
    Object.keys(acknowledgement).some(
      (key) =>
        ![
          "noIdentifiablePatientInformation",
          "authorizedLocalStorageAndProcessing",
          "sharedAndCopyrightedMaterialConsidered",
          "scope",
        ].includes(key),
    ) ||
    acknowledgement.noIdentifiablePatientInformation !== true ||
    acknowledgement.authorizedLocalStorageAndProcessing !== true ||
    acknowledgement.sharedAndCopyrightedMaterialConsidered !== true ||
    typeof acknowledgement.scope !== "string" ||
    acknowledgement.scope.trim().length < 1 ||
    acknowledgement.scope.length > 1_000
  ) {
    throw new ApiInputError(
      422,
      "invalid_intake_request",
      "All safety acknowledgements and a concise scope are required.",
    );
  }
  return {
    assignments,
    acknowledgement: {
      noIdentifiablePatientInformation: true,
      authorizedLocalStorageAndProcessing: true,
      sharedAndCopyrightedMaterialConsidered: true,
      scope: acknowledgement.scope.trim(),
    },
  };
};

async function handleApiRequest(
  request: IncomingMessage,
  response: ServerResponse,
  options: ResolvedApiOptions,
): Promise<void> {
  const method = request.method ?? "GET";
  const requestUrl = new URL(request.url ?? "/", options.allowedOrigin);
  const isMutation = method === "POST";
  assertRequestAuthority(request, {
    expectedHost: options.expectedHost,
    allowedOrigin: options.allowedOrigin,
    requireOrigin: isMutation,
  });

  if (requestUrl.search.length > 0 || requestUrl.hash.length > 0) {
    throw new ApiInputError(
      400,
      "unsupported_request_target",
      "API query strings and fragments are not supported.",
    );
  }

  if (requestUrl.pathname === "/api/health" && method === "GET") {
    const scouting = options.scoutCoordinator?.status() ?? {
      configured: false,
      automatic: false,
      enabled: false,
    };
    sendJson(response, 200, {
      status: "ok",
      persistence: "local-only",
      externalAi: false,
      scouting: {
        configured: scouting.configured,
        automatic: scouting.automatic,
        enabled: scouting.enabled,
      },
      intake: {
        configured: options.privateIntake !== null,
        enabled: options.privateIntake !== null,
      },
      authoringContext: {
        configured: options.authoringContext !== null,
      },
      reviewer: { ...options.reviewer },
      reviewerCapabilities: {
        canAcceptExpertOpinion: canAcceptExpertOpinion(
          options.reviewer.role,
        ),
      },
    });
    return;
  }

  if (requestUrl.pathname === "/api/workspace" && method === "GET") {
    const current = await options.store.read();
    response.setHeader("ETag", current.etag);
    sendJson(
      response,
      200,
      snapshotPayload(current.workspace, current.revision),
    );
    return;
  }

  if (requestUrl.pathname === "/api/commands" && method === "POST") {
    const ifMatch = requiredIfMatch(request);
    const command = await readJsonBody(request, options.maxBodyBytes);
    const current = await options.store.read();
    if (!assertCurrentEtag(response, ifMatch, current.etag)) return;
    const next = applyWorkbenchCommand(
      current.workspace,
      command,
      options.reviewer.id,
      options.reviewer.role,
    );
    const stored = await options.store.save(next, ifMatch);
    response.setHeader("ETag", stored.etag);
    sendJson(
      response,
      200,
      snapshotPayload(stored.workspace, stored.revision),
    );
    return;
  }

  if (requestUrl.pathname === "/api/scout" && method === "POST") {
    const coordinator = options.scoutCoordinator;
    const scouting = coordinator?.status();
    if (
      coordinator === null ||
      scouting?.configured !== true ||
      scouting.enabled !== true
    ) {
      throw new ApiInputError(
        503,
        "scouting_not_configured",
        "Metadata scouting is not configured for this local workbench.",
      );
    }
    const ifMatch = requiredIfMatch(request);
    const body = recordBody(
      await readJsonBody(request, options.maxBodyBytes),
    );
    if (Object.keys(body).some((key) => key !== "gapId")) {
      throw new ApiInputError(
        422,
        "invalid_scout_request",
        "Only gapId is accepted by the scouting endpoint.",
      );
    }
    const gapId = body.gapId;
    if (typeof gapId !== "string" || !ID_PATTERN.test(gapId)) {
      throw new ApiInputError(
        422,
        "invalid_scout_request",
        "gapId must be a stable identifier.",
      );
    }
    const current = await options.store.read();
    if (!assertCurrentEtag(response, ifMatch, current.etag)) return;
    const next = await coordinator.scout(current.workspace, gapId);
    const stored = await options.store.save(next, ifMatch);
    response.setHeader("ETag", stored.etag);
    sendJson(
      response,
      200,
      snapshotPayload(stored.workspace, stored.revision),
    );
    return;
  }

  if (requestUrl.pathname === "/api/intake" && method === "GET") {
    if (options.privateIntake === null) {
      throw new ApiInputError(
        503,
        "intake_not_configured",
        "Private intake is not configured for this local workbench.",
      );
    }
    try {
      sendJson(response, 200, await options.privateIntake.status());
    } catch (error) {
      throw new ApiInputError(
        422,
        "intake_unavailable",
        options.privateIntake.safeError(error),
      );
    }
    return;
  }

  if (requestUrl.pathname === "/api/intake/scan" && method === "POST") {
    if (options.privateIntake === null) {
      throw new ApiInputError(
        503,
        "intake_not_configured",
        "Private intake is not configured for this local workbench.",
      );
    }
    const ifMatch = requiredIfMatch(request);
    const intakeRequest = parseIntakeScanRequest(
      await readJsonBody(request, options.maxBodyBytes),
    );
    const current = await options.store.read();
    if (!assertCurrentEtag(response, ifMatch, current.etag)) return;
    try {
      sendJson(
        response,
        200,
        await options.privateIntake.scan(
          current.workspace,
          intakeRequest,
        ),
      );
    } catch (error) {
      throw new ApiInputError(
        422,
        "intake_scan_failed",
        options.privateIntake.safeError(error),
      );
    }
    return;
  }

  if (requestUrl.pathname === "/api/intake/extract" && method === "POST") {
    if (options.privateIntake === null) {
      throw new ApiInputError(
        503,
        "intake_not_configured",
        "Private intake is not configured for this local workbench.",
      );
    }
    const ifMatch = requiredIfMatch(request);
    emptyObjectBody(await readJsonBody(request, options.maxBodyBytes));
    const current = await options.store.read();
    if (!assertCurrentEtag(response, ifMatch, current.etag)) return;
    try {
      sendJson(
        response,
        200,
        await options.privateIntake.extract(current.workspace),
      );
    } catch (error) {
      throw new ApiInputError(
        422,
        "intake_extraction_failed",
        options.privateIntake.safeError(error),
      );
    }
    return;
  }

  if (requestUrl.pathname === "/api/intake/audit" && method === "POST") {
    if (options.privateIntake === null) {
      throw new ApiInputError(
        503,
        "intake_not_configured",
        "Private intake is not configured for this local workbench.",
      );
    }
    const ifMatch = requiredIfMatch(request);
    emptyObjectBody(await readJsonBody(request, options.maxBodyBytes));
    const current = await options.store.read();
    if (!assertCurrentEtag(response, ifMatch, current.etag)) return;
    try {
      sendJson(response, 200, await options.privateIntake.audit());
    } catch (error) {
      throw new ApiInputError(
        422,
        "intake_audit_failed",
        options.privateIntake.safeError(error),
      );
    }
    return;
  }

  if (
    requestUrl.pathname === "/api/intake/recover-lock" &&
    method === "POST"
  ) {
    if (options.privateIntake === null) {
      throw new ApiInputError(
        503,
        "intake_not_configured",
        "Private intake is not configured for this local workbench.",
      );
    }
    const ifMatch = requiredIfMatch(request);
    const body = recordBody(
      await readJsonBody(request, options.maxBodyBytes),
    );
    if (
      Object.keys(body).some((key) => key !== "reason") ||
      typeof body.reason !== "string" ||
      body.reason.trim().length < 4 ||
      body.reason.trim().length > 500
    ) {
      throw new ApiInputError(
        422,
        "invalid_lock_recovery",
        "Stale-lock recovery requires one concise reason.",
      );
    }
    const current = await options.store.read();
    if (!assertCurrentEtag(response, ifMatch, current.etag)) return;
    try {
      sendJson(
        response,
        200,
        await options.privateIntake.recoverLock(body.reason.trim()),
      );
    } catch (error) {
      throw new ApiInputError(
        422,
        "intake_lock_recovery_failed",
        options.privateIntake.safeError(error),
      );
    }
    return;
  }

  if (
    requestUrl.pathname === "/api/authoring/context" &&
    method === "GET"
  ) {
    if (options.authoringContext === null) {
      throw new ApiInputError(
        503,
        "authoring_context_not_configured",
        "The local authoring-context bridge is not configured.",
      );
    }
    try {
      sendJson(response, 200, await options.authoringContext.load());
    } catch {
      throw new ApiInputError(
        404,
        "authoring_context_unavailable",
        "No valid compiled authoring workspace is available yet.",
      );
    }
    return;
  }

  if (
    requestUrl.pathname === "/api/authoring/sync" &&
    method === "POST"
  ) {
    if (options.authoringContext === null) {
      throw new ApiInputError(
        503,
        "authoring_context_not_configured",
        "The local authoring-context bridge is not configured.",
      );
    }
    const ifMatch = requiredIfMatch(request);
    emptyObjectBody(await readJsonBody(request, options.maxBodyBytes));
    const current = await options.store.read();
    if (!assertCurrentEtag(response, ifMatch, current.etag)) return;
    try {
      const synchronized = await options.authoringContext.sync(
        current.workspace,
      );
      const stored = await options.store.save(
        synchronized.workspace,
        ifMatch,
      );
      response.setHeader("ETag", stored.etag);
      sendJson(response, 200, {
        ...snapshotPayload(stored.workspace, stored.revision),
        authoringContext: synchronized.context,
      });
    } catch {
      throw new ApiInputError(
        422,
        "authoring_sync_failed",
        "The validated authoring context contains no new compatible references.",
      );
    }
    return;
  }

  if (
    [
      "/api/health",
      "/api/workspace",
      "/api/commands",
      "/api/scout",
      "/api/intake",
      "/api/intake/scan",
      "/api/intake/extract",
      "/api/intake/audit",
      "/api/intake/recover-lock",
      "/api/authoring/context",
      "/api/authoring/sync",
    ].includes(requestUrl.pathname)
  ) {
    response.setHeader(
      "Allow",
      requestUrl.pathname === "/api/health" ||
        requestUrl.pathname === "/api/workspace" ||
        requestUrl.pathname === "/api/intake" ||
        requestUrl.pathname === "/api/authoring/context"
        ? "GET"
        : "POST",
    );
    throw new ApiInputError(
      405,
      "method_not_allowed",
      "The request method is not allowed.",
    );
  }

  throw new ApiInputError(404, "not_found", "API route not found.");
}

const ID_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

function recordBody(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiInputError(
      422,
      "invalid_request",
      "The request body must be an object.",
    );
  }
  return value as Record<string, unknown>;
}

export function createApiMiddleware(options: ApiOptions): ApiMiddleware {
  const resolved: ResolvedApiOptions = {
    store: options.store,
    expectedHost: options.expectedHost ?? "127.0.0.1:4174",
    allowedOrigin: options.allowedOrigin ?? "http://127.0.0.1:4174",
    maxBodyBytes: options.maxBodyBytes ?? DEFAULT_BODY_LIMIT,
    scoutCoordinator: options.scoutCoordinator ?? null,
    privateIntake: options.privateIntake ?? null,
    authoringContext: options.authoringContext ?? null,
    reviewer: options.reviewer ?? {
      id: "reviewer.local.owner",
      role: "owner",
      configuredExplicitly: false,
    },
  };
  return (request, response, next) => {
    const pathname = (request.url ?? "").split("?", 1)[0];
    if (!pathname?.startsWith("/api/")) {
      next();
      return;
    }
    void handleApiRequest(request, response, resolved).catch((error: unknown) => {
      if (response.writableEnded) {
        return;
      }
      if (error instanceof RequestSecurityError) {
        sendJson(response, error.statusCode, {
          error: "forbidden",
          message: error.message,
        });
        return;
      }
      if (error instanceof ApiInputError) {
        sendJson(response, error.statusCode, {
          error: error.code,
          message: error.message,
        });
        return;
      }
      if (
        error instanceof CommandInputError ||
        error instanceof WorkspaceValidationError ||
        error instanceof ResearchWorkspaceTransitionError
      ) {
        sendJson(response, 422, {
          error: "invalid_transition",
          message: error.message,
        });
        return;
      }
      if (error instanceof WorkspaceConflictError) {
        response.setHeader("ETag", error.actualEtag);
        sendJson(response, 409, {
          error: "revision_conflict",
          message: error.message,
          currentEtag: error.actualEtag,
        });
        return;
      }
      sendJson(response, 500, {
        error: "internal_error",
        message: "The local workspace request could not be completed.",
      });
    });
  };
}
