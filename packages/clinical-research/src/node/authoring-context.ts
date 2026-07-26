import { createHash } from "node:crypto";
import { lstat, open } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";

import {
  type ClinicalAuthoringWorkspace,
  validateClinicalAuthoringWorkspace,
} from "@gamify-surgery/clinical-authoring";
import { z } from "zod";

import {
  isoTimestampSchema,
  nonBlankTextSchema,
  stableIdSchema,
} from "../identifiers.js";
import {
  clinicalTargetKindSchema,
  externalCitationReferenceSchema,
} from "../schemas.js";
import {
  assertAppendOnlyWorkspaceTransition,
  effectiveCitationVerification,
  type ResearchWorkspace,
  validateResearchWorkspace,
} from "../workspace.js";

const serverOwnedPathBrand: unique symbol = Symbol(
  "ServerOwnedAuthoringWorkspacePath",
);

export interface ServerOwnedAuthoringWorkspacePath {
  readonly absolutePath: string;
  readonly [serverOwnedPathBrand]: true;
}

export class AuthoringContextBridgeError extends Error {
  public readonly code: string;

  public constructor(code: string, message: string) {
    super(message);
    this.name = "AuthoringContextBridgeError";
    this.code = code;
  }
}

/**
 * Marks a path supplied by trusted server configuration. The browser/API
 * boundary must never call this with request data. Requiring an absolute path
 * prevents interpretation relative to an untrusted working directory.
 */
export function designateServerOwnedAuthoringWorkspacePath(
  absolutePath: string,
): ServerOwnedAuthoringWorkspacePath {
  if (!isAbsolute(absolutePath)) {
    throw new AuthoringContextBridgeError(
      "PATH_NOT_SERVER_OWNED",
      "The authoring workspace path must be an absolute server-configured path.",
    );
  }
  return Object.freeze({
    absolutePath: resolve(absolutePath),
    [serverOwnedPathBrand]: true as const,
  });
}

const sanitizedSourceSchema = z
  .object({
    id: stableIdSchema,
    label: nonBlankTextSchema(500),
  })
  .strict();

const sanitizedCitationSchema = externalCitationReferenceSchema
  .safeExtend({
    label: nonBlankTextSchema(800),
    verificationState: z.enum([
      "human_verified",
      "conflict_identified",
    ]),
    verifiedBy: stableIdSchema,
    verifiedAt: isoTimestampSchema,
  })
  .strict();

const sanitizedTargetSchema = z
  .object({
    kind: clinicalTargetKindSchema,
    id: stableIdSchema,
    entityId: stableIdSchema,
    label: nonBlankTextSchema(500),
  })
  .strict();

export const sanitizedAuthoringContextSchema = z
  .object({
    schemaVersion: z.literal(1),
    authoringWorkspaceId: stableIdSchema,
    authoringWorkspaceUpdatedAt: isoTimestampSchema,
    sources: z.array(sanitizedSourceSchema),
    citations: z.array(sanitizedCitationSchema),
    topicRevisions: z.array(
      sanitizedTargetSchema.extend({
        kind: z.literal("clinical_topic_revision"),
      }),
    ),
    structuredFacts: z.array(
      sanitizedTargetSchema.extend({
        kind: z.literal("structured_fact"),
      }),
    ),
    testedConcepts: z.array(
      sanitizedTargetSchema.extend({
        kind: z.literal("tested_concept"),
      }),
    ),
  })
  .strict()
  .superRefine((context, refinement) => {
    const duplicate = <Value>(
      values: readonly Value[],
      key: (value: Value) => string,
      path: string,
    ) => {
      const keys = values.map(key);
      if (new Set(keys).size !== keys.length) {
        refinement.addIssue({
          code: "custom",
          message: `Sanitized authoring context contains duplicate ${path}.`,
          path: [path],
        });
      }
    };
    duplicate(context.sources, (source) => source.id, "sources");
    duplicate(context.citations, (citation) => citation.id, "citations");
    duplicate(
      [
        ...context.topicRevisions,
        ...context.structuredFacts,
        ...context.testedConcepts,
      ],
      (target) => `${target.kind}:${target.id}`,
      "targets",
    );

    const sourceIds = new Set(context.sources.map((source) => source.id));
    context.citations.forEach((citation, index) => {
      if (!sourceIds.has(citation.sourceId)) {
        refinement.addIssue({
          code: "custom",
          message:
            "A sanitized Citation must reference a Source in the same context.",
          path: ["citations", index, "sourceId"],
        });
      }
    });
  });

export type SanitizedAuthoringContext = z.infer<
  typeof sanitizedAuthoringContextSchema
>;

const sortById = <Value extends { id: string }>(values: Value[]): Value[] =>
  values.sort((left, right) => left.id.localeCompare(right.id));

const currentRevisionLeaves = <
  Value extends {
    revision: {
      revisionId: string;
      parentRevisionId: string | null;
      workflowState: string;
    };
  },
>(
  values: readonly Value[],
): Value[] => {
  const active = values.filter(
    (value) => value.revision.workflowState !== "archived",
  );
  const parentIds = new Set(
    active
      .map((value) => value.revision.parentRevisionId)
      .filter((id): id is string => id !== null),
  );
  return active.filter(
    (value) => !parentIds.has(value.revision.revisionId),
  );
};

/**
 * Projects the canonical authoring workspace into labels and identifiers only.
 * It never returns narratives, fact values, supported claims, source locators,
 * rights notes, provenance notes, or source bytes.
 */
function sanitizeAuthoringWorkspace(
  workspace: ClinicalAuthoringWorkspace,
): SanitizedAuthoringContext {
  const sourceById = new Map(
    workspace.sources.map((source) => [source.id, source]),
  );
  const snapshotById = new Map(
    workspace.sourceSnapshots.map((snapshot) => [snapshot.id, snapshot]),
  );
  const topicById = new Map(
    workspace.topics.map((topic) => [topic.id, topic]),
  );
  const topicRevisionById = new Map(
    workspace.topicRevisions.map((revision) => [
      revision.revision.revisionId,
      revision,
    ]),
  );
  const factTypeById = new Map(
    workspace.factTypeDefinitions.map((definition) => [
      definition.id,
      definition,
    ]),
  );

  const sources = sortById(
    workspace.sources.map((source) => ({
      id: source.id,
      label: source.title,
    })),
  );

  const citations = sortById(
    workspace.citations
      .filter((citation) => citation.verificationState !== "unverified")
      .map((citation) => {
        const snapshot = snapshotById.get(citation.sourceSnapshotId)!;
        const source = sourceById.get(snapshot.sourceId)!;
        return {
          id: citation.id,
          label: `${source.title} - reviewed citation`,
          sourceId: source.id,
          sourceSnapshotId: snapshot.id,
          verificationState: citation.verificationState as
            | "human_verified"
            | "conflict_identified",
          verifiedBy: citation.verificationReviewerId!,
          verifiedAt: citation.verificationRecordedAt!,
        };
      }),
  );

  const topicRevisions = sortById(
    workspace.topics.flatMap((topic) => {
      if (topic.currentWorkingRevisionId === null) return [];
      const revision = topicRevisionById.get(topic.currentWorkingRevisionId);
      if (!revision) return [];
      return [
        {
          kind: "clinical_topic_revision" as const,
          id: revision.revision.revisionId,
          entityId: topic.id,
          label: topic.preferredName,
        },
      ];
    }),
  );

  const structuredFacts = sortById(
    currentRevisionLeaves(workspace.structuredFacts).map((fact) => {
      const topicRevision = topicRevisionById.get(fact.topicRevisionId)!;
      const topic = topicById.get(topicRevision.topicId)!;
      const factType = factTypeById.get(fact.factTypeId)!;
      return {
        kind: "structured_fact" as const,
        id: fact.revision.revisionId,
        entityId: fact.id,
        label: `${topic.preferredName} — ${factType.label}`,
      };
    }),
  );

  const testedConcepts = sortById(
    currentRevisionLeaves(workspace.concepts).map((concept) => ({
      kind: "tested_concept" as const,
      id: concept.revision.revisionId,
      entityId: concept.id,
      label: concept.displayName,
    })),
  );

  return sanitizedAuthoringContextSchema.parse({
    schemaVersion: 1,
    authoringWorkspaceId: workspace.id,
    authoringWorkspaceUpdatedAt: workspace.updatedAt,
    sources,
    citations,
    topicRevisions,
    structuredFacts,
    testedConcepts,
  });
}

export const DEFAULT_MAX_AUTHORING_WORKSPACE_BYTES = 25 * 1024 * 1024;

/**
 * Loads one ordinary JSON file selected by trusted server configuration,
 * validates the complete canonical workspace, and returns only its sanitized
 * label/ID projection.
 */
export async function loadSanitizedAuthoringContext(
  ownedPath: ServerOwnedAuthoringWorkspacePath,
  maximumBytes = DEFAULT_MAX_AUTHORING_WORKSPACE_BYTES,
): Promise<SanitizedAuthoringContext> {
  if (
    !ownedPath ||
    ownedPath[serverOwnedPathBrand] !== true ||
    !isAbsolute(ownedPath.absolutePath)
  ) {
    throw new AuthoringContextBridgeError(
      "PATH_NOT_SERVER_OWNED",
      "A designated server-owned authoring workspace path is required.",
    );
  }
  if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 1) {
    throw new AuthoringContextBridgeError(
      "INVALID_SIZE_LIMIT",
      "The authoring workspace size limit must be a positive safe integer.",
    );
  }

  let handle;
  try {
    const pathDetails = await lstat(ownedPath.absolutePath);
    if (pathDetails.isSymbolicLink() || !pathDetails.isFile()) {
      throw new AuthoringContextBridgeError(
        "NOT_ORDINARY_FILE",
        "The configured authoring workspace must be an ordinary file.",
      );
    }
    handle = await open(ownedPath.absolutePath, "r");
    const details = await handle.stat();
    if (!details.isFile()) {
      throw new AuthoringContextBridgeError(
        "NOT_ORDINARY_FILE",
        "The configured authoring workspace must be an ordinary file.",
      );
    }
    if (details.size > maximumBytes) {
      throw new AuthoringContextBridgeError(
        "WORKSPACE_TOO_LARGE",
        "The configured authoring workspace exceeds the server size limit.",
      );
    }
    const parsed = JSON.parse(await handle.readFile("utf8")) as unknown;
    return sanitizeAuthoringWorkspace(
      validateClinicalAuthoringWorkspace(parsed),
    );
  } catch (error) {
    if (error instanceof AuthoringContextBridgeError) throw error;
    throw new AuthoringContextBridgeError(
      "INVALID_AUTHORING_WORKSPACE",
      "The configured authoring workspace could not be loaded and validated.",
    );
  } finally {
    await handle?.close();
  }
}

const sameCitationIdentity = (
  left: ResearchWorkspace["externalReferences"]["citations"][number],
  right: ResearchWorkspace["externalReferences"]["citations"][number],
) =>
  left.id === right.id &&
  left.sourceId === right.sourceId &&
  left.sourceSnapshotId === right.sourceSnapshotId;

const verificationSignalId = (
  citationId: string,
  verificationState: "human_verified" | "conflict_identified",
  verifiedBy: string,
  verifiedAt: string,
) =>
  `citation-verification.${createHash("sha256")
    .update(
      JSON.stringify([
        citationId,
        verificationState,
        verifiedBy,
        verifiedAt,
      ]),
    )
    .digest("hex")}`;

/**
 * Purely appends new external references from a sanitized context. Existing
 * references are retained byte-for-byte; a reused Citation ID with different
 * provenance is rejected rather than overwritten.
 */
export function appendSanitizedAuthoringReferences(
  previous: ResearchWorkspace,
  candidateContext: unknown,
  updatedAt: string,
): ResearchWorkspace {
  const context = sanitizedAuthoringContextSchema.parse(candidateContext);
  const recordedAt = isoTimestampSchema.parse(updatedAt);
  const next = structuredClone(previous);
  let appended = 0;

  const sourceIds = new Set(
    next.externalReferences.sources.map((source) => source.id),
  );
  for (const source of context.sources) {
    if (sourceIds.has(source.id)) continue;
    next.externalReferences.sources.push({ id: source.id });
    sourceIds.add(source.id);
    appended += 1;
  }

  const citationsById = new Map(
    next.externalReferences.citations.map((citation) => [
      citation.id,
      citation,
    ]),
  );
  for (const citation of context.citations) {
    const reference = {
      id: citation.id,
      sourceId: citation.sourceId,
      sourceSnapshotId: citation.sourceSnapshotId,
      verificationState: citation.verificationState,
      verifiedBy: citation.verifiedBy,
      verifiedAt: citation.verifiedAt,
    };
    const existing = citationsById.get(citation.id);
    if (existing) {
      if (!sameCitationIdentity(existing, reference)) {
        throw new AuthoringContextBridgeError(
          "CITATION_REFERENCE_CONFLICT",
          "An existing Citation ID has different immutable provenance.",
        );
      }
    } else {
      next.externalReferences.citations.push(reference);
      citationsById.set(reference.id, reference);
      appended += 1;
    }

    const current = effectiveCitationVerification(
      next,
      citation.id,
      previous.updatedAt,
    );
    if (
      current.verificationState === citation.verificationState &&
      current.verifiedBy === citation.verifiedBy &&
      current.verifiedAt === citation.verifiedAt
    ) {
      continue;
    }
    const matchingPriorSignal = next.citationVerificationSignals.find(
      (signal) =>
        signal.citationId === citation.id &&
        signal.verificationState === citation.verificationState &&
        signal.verifiedBy === citation.verifiedBy &&
        signal.verifiedAt === citation.verifiedAt,
    );
    if (matchingPriorSignal !== undefined) {
      throw new AuthoringContextBridgeError(
        "STALE_CITATION_VERIFICATION",
        "The authoring context contains a superseded Citation verification state.",
      );
    }
    if (
      current.recordedAt !== null &&
      Date.parse(recordedAt) <= Date.parse(current.recordedAt)
    ) {
      throw new AuthoringContextBridgeError(
        "NON_MONOTONIC_VERIFICATION_SIGNAL",
        "A new Citation verification signal must be recorded after the current signal.",
      );
    }
    next.citationVerificationSignals.push({
      id: verificationSignalId(
        citation.id,
        citation.verificationState,
        citation.verifiedBy,
        citation.verifiedAt,
      ),
      citationId: citation.id,
      supersedesSignalId: current.signalId,
      verificationState: citation.verificationState,
      verifiedBy: citation.verifiedBy,
      verifiedAt: citation.verifiedAt,
      recordedAt,
    });
    appended += 1;
  }

  const targetKeys = new Set(
    next.externalReferences.clinicalTargets.map(
      (target) => `${target.kind}:${target.id}`,
    ),
  );
  const targets = [
    ...context.topicRevisions,
    ...context.structuredFacts,
    ...context.testedConcepts,
  ];
  for (const target of targets) {
    const key = `${target.kind}:${target.id}`;
    if (targetKeys.has(key)) continue;
    next.externalReferences.clinicalTargets.push({
      kind: target.kind,
      id: target.id,
    });
    targetKeys.add(key);
    appended += 1;
  }

  if (appended === 0) {
    return validateResearchWorkspace(previous);
  }
  next.updatedAt = recordedAt;
  return assertAppendOnlyWorkspaceTransition(previous, next);
}
