import type {
  KnownVsNeededBriefDto,
  WorkbenchCommand,
  WorkbenchViewDto,
} from "./model.js";

export type WorkspaceSnapshot = {
  view: WorkbenchViewDto;
  briefs: KnownVsNeededBriefDto[];
  etag: string;
  revision: string;
};

export type WorkbenchHealth = {
  status: "ok";
  persistence: "local-only";
  externalAi: false;
  scouting: {
    configured: boolean;
    automatic: boolean;
    enabled: boolean;
  };
  intake: {
    configured: boolean;
    enabled: boolean;
  };
  authoringContext: {
    configured: boolean;
  };
  reviewer: {
    id: string;
    role:
      | "owner"
      | "developer"
      | "clinical_reviewer"
      | "rights_reviewer"
      | "administrator";
    configuredExplicitly: boolean;
  };
  reviewerCapabilities: {
    canAcceptExpertOpinion: boolean;
  };
};

export type IntakeStatusDto = {
  configured: true;
  enabled: true;
  maximumSourceBytes: number;
  inboxFilenames: string[];
  unsafeInboxEntryCount: number;
  intakeLockPresent: boolean;
  entries: {
    id: string;
    originalFilename: string;
    sizeBytes: number;
    detectedMediaType: string | null;
    status: string;
    sourceId: string | null;
    rightsDecisionId: string | null;
    extractionArtifactId: string | null;
    parserId: string | null;
    parserVersion: string | null;
    chunkerVersion: string | null;
    extractionOutcome: "complete" | "ocr_required" | null;
    errorCode: string | null;
    errorMessage: string | null;
    updatedAt: string;
  }[];
  manifestUpdatedAt: string;
  integrityAuditStatus: "not_run" | "passed" | "failed";
  integrityAuditIssueCount: number | null;
  integrityAuditedAt: string | null;
};

export type SanitizedAuthoringContextDto = {
  schemaVersion: 1;
  authoringWorkspaceId: string;
  authoringWorkspaceUpdatedAt: string;
  sources: { id: string; label: string }[];
  citations: {
    id: string;
    label: string;
    sourceId: string;
    sourceSnapshotId: string;
    verificationState: "human_verified" | "conflict_identified";
    verifiedBy: string;
    verifiedAt: string;
  }[];
  topicRevisions: {
    kind: "clinical_topic_revision";
    id: string;
    entityId: string;
    label: string;
  }[];
  structuredFacts: {
    kind: "structured_fact";
    id: string;
    entityId: string;
    label: string;
  }[];
  testedConcepts: {
    kind: "tested_concept";
    id: string;
    entityId: string;
    label: string;
  }[];
};

export class WorkbenchApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "WorkbenchApiError";
  }
}

async function decodeSnapshot(response: Response): Promise<WorkspaceSnapshot> {
  const payload = (await response.json()) as {
    view?: WorkbenchViewDto;
    briefs?: KnownVsNeededBriefDto[];
    revision?: unknown;
    error?: unknown;
    message?: unknown;
  };
  if (!response.ok) {
    throw new WorkbenchApiError(
      response.status,
      typeof payload.error === "string" ? payload.error : "request_failed",
      typeof payload.message === "string"
        ? payload.message
        : "The workspace request failed.",
    );
  }
  const etag = response.headers.get("ETag");
  if (
    etag === null ||
    typeof payload.revision !== "string" ||
    payload.view === undefined ||
    !Array.isArray(payload.briefs)
  ) {
    throw new WorkbenchApiError(
      500,
      "invalid_response",
      "The local API returned an incomplete workspace projection.",
    );
  }
  return {
    view: payload.view,
    briefs: payload.briefs,
    etag,
    revision: payload.revision,
  };
}

export async function loadHealth(): Promise<WorkbenchHealth> {
  const response = await fetch("/api/health", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new WorkbenchApiError(
      response.status,
      "health_failed",
      "The local API health check failed.",
    );
  }
  return (await response.json()) as WorkbenchHealth;
}

export async function loadWorkspace(): Promise<WorkspaceSnapshot> {
  const response = await fetch("/api/workspace", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });
  return decodeSnapshot(response);
}

export async function executeCommand(
  command: WorkbenchCommand,
  etag: string,
): Promise<WorkspaceSnapshot> {
  const response = await fetch("/api/commands", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "If-Match": etag,
    },
    body: JSON.stringify(command),
  });
  return decodeSnapshot(response);
}

export async function scoutGap(
  gapId: string,
  etag: string,
): Promise<WorkspaceSnapshot> {
  const response = await fetch("/api/scout", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "If-Match": etag,
    },
    body: JSON.stringify({ gapId }),
  });
  return decodeSnapshot(response);
}

async function decodeJsonResponse<Value>(response: Response): Promise<Value> {
  const payload = (await response.json()) as {
    error?: unknown;
    message?: unknown;
  };
  if (!response.ok) {
    throw new WorkbenchApiError(
      response.status,
      typeof payload.error === "string" ? payload.error : "request_failed",
      typeof payload.message === "string"
        ? payload.message
        : "The local request failed.",
    );
  }
  return payload as Value;
}

export async function loadIntake(): Promise<IntakeStatusDto> {
  const response = await fetch("/api/intake", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  return decodeJsonResponse<IntakeStatusDto>(response);
}

export async function scanIntake(
  etag: string,
  assignments: { filename: string; rightsDecisionId: string }[],
  scope: string,
): Promise<{ status: IntakeStatusDto }> {
  const response = await fetch("/api/intake/scan", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "If-Match": etag,
    },
    body: JSON.stringify({
      assignments,
      acknowledgement: {
        noIdentifiablePatientInformation: true,
        authorizedLocalStorageAndProcessing: true,
        sharedAndCopyrightedMaterialConsidered: true,
        scope,
      },
    }),
  });
  return decodeJsonResponse<{ status: IntakeStatusDto }>(response);
}

export async function extractIntake(etag: string): Promise<{
  status: IntakeStatusDto;
}> {
  const response = await fetch("/api/intake/extract", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "If-Match": etag,
    },
    body: "{}",
  });
  return decodeJsonResponse<{ status: IntakeStatusDto }>(response);
}

export async function auditIntake(
  etag: string,
): Promise<IntakeStatusDto> {
  const response = await fetch("/api/intake/audit", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "If-Match": etag,
    },
    body: "{}",
  });
  return decodeJsonResponse<IntakeStatusDto>(response);
}

export async function recoverIntakeLock(
  etag: string,
  reason: string,
): Promise<IntakeStatusDto> {
  const response = await fetch("/api/intake/recover-lock", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "If-Match": etag,
    },
    body: JSON.stringify({ reason }),
  });
  return decodeJsonResponse<IntakeStatusDto>(response);
}

export async function loadAuthoringContext(): Promise<SanitizedAuthoringContextDto> {
  const response = await fetch("/api/authoring/context", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  return decodeJsonResponse<SanitizedAuthoringContextDto>(response);
}

export async function syncAuthoringContext(
  etag: string,
): Promise<WorkspaceSnapshot> {
  const response = await fetch("/api/authoring/sync", {
    method: "POST",
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "If-Match": etag,
    },
    body: "{}",
  });
  return decodeSnapshot(response);
}
