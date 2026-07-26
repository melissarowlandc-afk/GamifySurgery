import { randomUUID } from "node:crypto";
import { lstat, readdir } from "node:fs/promises";

import {
  authorizeIntakeFromRightsDecision,
  ensurePrivateIntakePaths,
  loadPrivateIntakeManifest,
  processPrivateIntakeWithDefaultExtractors,
  recoverStalePrivateIntakeLock,
  resolvePrivateIntakePaths,
  sanitizePrivateIntakeError,
  scanPrivateIntake,
  validatePrivateIntake,
  type PrivateIntakeManifestEntry,
  type PrivateIntakePaths,
} from "@gamify-surgery/clinical-research/node";
import {
  getEffectiveSourceRightsDecision,
  type ResearchWorkspace,
} from "@gamify-surgery/clinical-research";

const LOCAL_INTAKE_ACTOR = "author.local.workbench";
const SAFE_FILENAME = /^[^./\\][^/\\\u0000]{0,239}$/;
export const WORKBENCH_PILOT_MAX_PRIVATE_SOURCE_BYTES = 25 * 1024 * 1024;

export interface IntakeAssignment {
  filename: string;
  rightsDecisionId: string;
}

export interface IntakeScanRequest {
  assignments: IntakeAssignment[];
  acknowledgement: {
    noIdentifiablePatientInformation: true;
    authorizedLocalStorageAndProcessing: true;
    sharedAndCopyrightedMaterialConsidered: true;
    scope: string;
  };
}

export interface IntakeEntrySummary {
  id: string;
  originalFilename: string;
  sizeBytes: number;
  detectedMediaType: string | null;
  status: PrivateIntakeManifestEntry["status"];
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
}

export interface IntakeStatus {
  configured: true;
  enabled: true;
  maximumSourceBytes: number;
  inboxFilenames: string[];
  unsafeInboxEntryCount: number;
  intakeLockPresent: boolean;
  entries: IntakeEntrySummary[];
  manifestUpdatedAt: string;
  integrityAuditStatus: "not_run" | "passed" | "failed";
  integrityAuditIssueCount: number | null;
  integrityAuditedAt: string | null;
}

export interface IntakeScanSummary {
  queued: number;
  duplicates: number;
  rightsBlocked: number;
  quarantined: number;
  ignored: number;
}

export interface IntakeExtractionSummary {
  extracted: number;
  quarantined: number;
}

const summarizeEntry = (
  entry: PrivateIntakeManifestEntry,
): IntakeEntrySummary => ({
  id: entry.id,
  originalFilename: entry.originalFilename,
  sizeBytes: entry.sizeBytes,
  detectedMediaType: entry.detectedMediaType,
  status: entry.status,
  sourceId: entry.sourceId,
  rightsDecisionId: entry.rightsDecisionId,
  extractionArtifactId: entry.extractionArtifactId,
  parserId: entry.parserId,
  parserVersion: entry.parserVersion,
  chunkerVersion: entry.chunkerVersion,
  extractionOutcome: entry.extractionOutcome,
  errorCode: entry.errorCode,
  errorMessage: entry.errorMessage,
  updatedAt: entry.updatedAt,
});

const ordinaryInboxFilenames = async (
  paths: PrivateIntakePaths,
): Promise<{ filenames: string[]; unsafeCount: number }> => {
  await ensurePrivateIntakePaths(paths);
  const entries = await readdir(paths.inbox, { withFileTypes: true });
  const filenames: string[] = [];
  let unsafeCount = 0;
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (!entry.isFile() || !SAFE_FILENAME.test(entry.name)) {
      unsafeCount += 1;
      continue;
    }
    filenames.push(entry.name);
  }
  return {
    filenames: filenames.sort((left, right) => left.localeCompare(right)),
    unsafeCount,
  };
};

/**
 * Trusted server-only adapter for the fixed ignored private intake root.
 *
 * No caller may provide a filesystem path, and no source text or local path is
 * projected into browser responses.
 */
export class LocalPrivateIntakeService {
  readonly paths: PrivateIntakePaths;
  readonly reviewerId: string;
  private lastIntegrityAudit: {
    valid: boolean;
    issueCount: number;
    auditedAt: string;
  } | null = null;

  constructor(
    repositoryRoot: string,
    reviewerId = LOCAL_INTAKE_ACTOR,
  ) {
    this.paths = resolvePrivateIntakePaths(repositoryRoot);
    this.reviewerId = reviewerId;
  }

  async status(): Promise<IntakeStatus> {
    const inbox = await ordinaryInboxFilenames(this.paths);
    const manifest = await loadPrivateIntakeManifest(this.paths);
    let intakeLockPresent = false;
    try {
      const lockDetails = await lstat(this.paths.lockFile);
      intakeLockPresent =
        lockDetails.isFile() && !lockDetails.isSymbolicLink();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    return {
      configured: true,
      enabled: true,
      maximumSourceBytes: WORKBENCH_PILOT_MAX_PRIVATE_SOURCE_BYTES,
      inboxFilenames: inbox.filenames,
      unsafeInboxEntryCount: inbox.unsafeCount,
      intakeLockPresent,
      entries: manifest.entries.map(summarizeEntry),
      manifestUpdatedAt: manifest.updatedAt,
      integrityAuditStatus:
        this.lastIntegrityAudit === null
          ? "not_run"
          : this.lastIntegrityAudit.valid
            ? "passed"
            : "failed",
      integrityAuditIssueCount:
        this.lastIntegrityAudit?.issueCount ?? null,
      integrityAuditedAt: this.lastIntegrityAudit?.auditedAt ?? null,
    };
  }

  async audit(): Promise<IntakeStatus> {
    const validation = await validatePrivateIntake(this.paths);
    this.lastIntegrityAudit = {
      valid: validation.valid,
      issueCount: validation.issues.length,
      auditedAt: new Date().toISOString(),
    };
    return this.status();
  }

  async recoverLock(reason: string): Promise<IntakeStatus> {
    await recoverStalePrivateIntakeLock(this.paths, {
      confirmed: true,
      recoveredBy: this.reviewerId,
      reason,
    });
    this.lastIntegrityAudit = null;
    return this.status();
  }

  async scan(
    workspace: ResearchWorkspace,
    request: IntakeScanRequest,
  ): Promise<{
    report: IntakeScanSummary;
    status: IntakeStatus;
  }> {
    const inbox = await ordinaryInboxFilenames(this.paths);
    if (inbox.unsafeCount > 0) {
      throw new Error(
        "The intake inbox contains a link, directory, or unsafe filename.",
      );
    }
    const assignments = new Map<string, string>();
    for (const assignment of request.assignments) {
      if (
        !SAFE_FILENAME.test(assignment.filename) ||
        assignments.has(assignment.filename)
      ) {
        throw new Error("Each safe inbox filename must be assigned once.");
      }
      assignments.set(assignment.filename, assignment.rightsDecisionId);
    }
    if (
      assignments.size !== inbox.filenames.length ||
      inbox.filenames.some((filename) => !assignments.has(filename))
    ) {
      throw new Error(
        "Every ordinary file currently in the intake inbox must have a rights assignment.",
      );
    }

    const now = new Date().toISOString();
    const authorizations = new Map(
      inbox.filenames.map((filename) => {
        const selectedId = assignments.get(filename)!;
        const selected = workspace.sourceRightsDecisions.find(
          (decision) => decision.id === selectedId,
        );
        if (!selected) {
          throw new Error("An intake assignment references unknown rights.");
        }
        const effective = getEffectiveSourceRightsDecision(
          workspace,
          selected.sourceId,
          now,
        );
        if (effective?.id !== selected.id) {
          throw new Error(
            "An intake assignment does not use the current effective rights decision.",
          );
        }
        return [filename, authorizeIntakeFromRightsDecision(selected)] as const;
      }),
    );

    const acknowledgement = request.acknowledgement;
    if (
      acknowledgement.noIdentifiablePatientInformation !== true ||
      acknowledgement.authorizedLocalStorageAndProcessing !== true ||
      acknowledgement.sharedAndCopyrightedMaterialConsidered !== true ||
      !acknowledgement.scope.trim()
    ) {
      throw new Error(
        "All private-intake safety acknowledgements and a scope are required.",
      );
    }
    const privateReport = await scanPrivateIntake({
      paths: this.paths,
      maxBytes: WORKBENCH_PILOT_MAX_PRIVATE_SOURCE_BYTES,
      acknowledgement: {
        id: `intake-acknowledgement.${randomUUID()}`,
        noIdentifiablePatientInformation: true,
        authorizedLocalStorageAndProcessing: true,
        sharedAndCopyrightedMaterialConsidered: true,
        acknowledgedBy: this.reviewerId,
        acknowledgedAt: now,
        scope: acknowledgement.scope.trim(),
      },
      resolveRights: (filename) => authorizations.get(filename) ?? null,
    });
    this.lastIntegrityAudit = null;
    return {
      report: {
        queued: privateReport.queued,
        duplicates: privateReport.duplicates,
        rightsBlocked: privateReport.rightsBlocked,
        quarantined: privateReport.quarantined,
        ignored: privateReport.ignored,
      },
      status: await this.status(),
    };
  }

  async extract(workspace: ResearchWorkspace): Promise<{
    report: IntakeExtractionSummary;
    status: IntakeStatus;
  }> {
    const manifest = await loadPrivateIntakeManifest(this.paths);
    const now = new Date().toISOString();
    for (const entry of manifest.entries.filter((candidate) =>
      ["queued", "extracting"].includes(candidate.status),
    )) {
      if (!entry.sourceId || !entry.rightsDecisionId) {
        throw new Error(
          "A queued source lacks an immutable rights decision.",
        );
      }
      const effective = getEffectiveSourceRightsDecision(
        workspace,
        entry.sourceId,
        now,
      );
      if (
        effective?.id !== entry.rightsDecisionId ||
        effective.decisionStatus !== "permitted_with_conditions" ||
        !effective.permissions.privateStorage ||
        !effective.permissions.localTextExtraction
      ) {
        throw new Error(
          "Current source rights no longer permit local extraction.",
        );
      }
    }
    const privateReport = await processPrivateIntakeWithDefaultExtractors({
      paths: this.paths,
      maxBytes: WORKBENCH_PILOT_MAX_PRIVATE_SOURCE_BYTES,
      extractor: {
        maximumSourceBytes: WORKBENCH_PILOT_MAX_PRIVATE_SOURCE_BYTES,
      },
    });
    this.lastIntegrityAudit = null;
    return {
      report: {
        extracted: privateReport.extracted,
        quarantined: privateReport.quarantined,
      },
      status: await this.status(),
    };
  }

  safeError(error: unknown): string {
    return sanitizePrivateIntakeError(error);
  }
}
