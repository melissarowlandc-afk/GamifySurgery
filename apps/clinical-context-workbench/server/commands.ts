import { createHash, randomUUID } from "node:crypto";

import {
  currentSynthesisEligibleContributions,
  denyAllSourceRights,
  validateResearchWorkspace,
  type ClinicalTargetReference,
  type EvidenceGapRevision,
  type ResearchWorkspace,
  type SourceRightsPermissions,
} from "@gamify-surgery/clinical-research";

import type {
  FairUseAssessmentDto,
  GapStatus,
  RightsPermissionsDto,
  WorkbenchCommand,
} from "../client/src/model.js";
import {
  canAcceptExpertOpinion,
  type ReviewerRole,
} from "./reviewer.js";

const LOCAL_ACTOR = "author.local.workbench";
const ID_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

const TARGET_KINDS = [
  "clinical_topic_revision",
  "topic_section",
  "structured_fact",
  "tested_concept",
  "patient_variant",
  "question_variant",
  "clinical_release",
  "other",
] as const;
const SOURCE_TYPES = [
  "official_outline",
  "clinical_guideline",
  "systematic_review",
  "meta_analysis",
  "journal_article",
  "regulatory_document",
  "classification_standard",
  "structured_database",
  "book_chapter",
  "professional_guidance",
  "reference_website",
  "owner_notes",
  "other",
] as const;
const PROVIDERS = [
  "pubmed",
  "crossref",
  "clinical_trials",
  "guideline_registry",
  "manual_other",
] as const;
const GAP_STATUSES = [
  "open",
  "scouting",
  "candidates_found",
  "awaiting_review",
  "resolved",
  "deferred",
  "withdrawn",
] as const;
const CONTRIBUTION_TYPES = [
  "definition",
  "epidemiology",
  "risk_factor",
  "presentation",
  "diagnosis",
  "workup",
  "management",
  "complication",
  "prognosis",
  "safety",
  "teaching_point",
  "context_only",
] as const;

export class CommandInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommandInputError";
  }
}

function fail(message: string): never {
  throw new CommandInputError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return fail(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
}

const COMMAND_KEYS: Record<WorkbenchCommand["type"], readonly string[]> = {
  create_gap: [
    "type",
    "title",
    "clinicalQuestion",
    "whyNeeded",
    "acceptanceCriteria",
    "targetKind",
    "targetId",
    "scoutMode",
    "preferredSourceTypes",
    "provider",
    "query",
    "refreshIntervalDays",
  ],
  revise_gap: [
    "type",
    "gapId",
    "title",
    "clinicalQuestion",
    "whyNeeded",
    "acceptanceCriteria",
    "status",
    "resolutionNote",
    "changeSummary",
    "targetKind",
    "targetId",
    "scoutMode",
    "preferredSourceTypes",
    "provider",
    "query",
    "refreshIntervalDays",
  ],
  capture_candidate: [
    "type",
    "gapId",
    "title",
    "citation",
    "organization",
    "sourceType",
  ],
  screen_candidate: [
    "type",
    "candidateId",
    "gapId",
    "disposition",
    "resolvedSourceId",
    "reason",
  ],
  record_source_rights: [
    "type",
    "sourceId",
    "sourceLabel",
    "decisionStatus",
    "legalBasis",
    "permissions",
    "territories",
    "licenseLabel",
    "licenseUrl",
    "termsUrl",
    "attributionStatement",
    "requiredNotices",
    "nonCommercialOnly",
    "shareAlikeRequired",
    "thirdPartyMaterialPolicy",
    "fairUseAssessment",
    "permissionEvidenceReferenceIds",
    "reviewBasis",
    "effectiveAt",
    "expiresAt",
    "notes",
  ],
  add_expert_opinion: [
    "type",
    "gapId",
    "statement",
    "rationale",
    "clinicalScope",
    "limitations",
  ],
  review_expert_opinion: [
    "type",
    "opinionId",
    "disposition",
    "reviewNote",
  ],
  register_citation: [
    "type",
    "citationId",
    "sourceId",
    "sourceSnapshotId",
    "verificationState",
  ],
  propose_contribution: [
    "type",
    "gapId",
    "sourceId",
    "citationIds",
    "role",
    "contributionTypes",
    "statement",
    "applicabilityNote",
    "sourceRole",
  ],
  review_contribution: [
    "type",
    "contributionId",
    "disposition",
  ],
  record_source_relation: [
    "type",
    "fromSourceId",
    "toSourceId",
    "relationType",
    "note",
  ],
  withdraw_source_relation: ["type", "relationId", "note"],
  create_synthesis: [
    "type",
    "gapId",
    "supportingSummary",
    "opposingOrQualifyingSummary",
    "proposedDirection",
    "limitations",
  ],
  decide_synthesis: ["type", "proposalId", "disposition", "rationale"],
  create_content_change: [
    "type",
    "synthesisDecisionId",
    "targetKind",
    "targetId",
    "changeKind",
    "beforeSummary",
    "proposedSummary",
    "status",
    "crossTargetRationale",
    "crossTargetReviewConfirmed",
  ],
};

function assertCommandKeys(
  command: Record<string, unknown>,
  type: WorkbenchCommand["type"],
): void {
  const allowed = COMMAND_KEYS[type];
  const unexpected = Object.keys(command).find(
    (key) => !allowed.includes(key),
  );
  if (unexpected !== undefined) {
    fail(`command.${unexpected} is not supported.`);
  }
}

function text(
  value: unknown,
  label: string,
  maximum: number,
  allowEmpty = false,
): string {
  if (
    typeof value !== "string" ||
    value.length > maximum ||
    (!allowEmpty && value.trim().length === 0)
  ) {
    return fail(`${label} must be valid text of at most ${maximum} characters.`);
  }
  return value.trim();
}

function stableId(value: unknown, label: string): string {
  const parsed = text(value, label, 180);
  if (!ID_PATTERN.test(parsed)) {
    return fail(`${label} must be a lowercase stable identifier.`);
  }
  return parsed;
}

function oneOf<const Values extends readonly string[]>(
  value: unknown,
  label: string,
  values: Values,
): Values[number] {
  if (typeof value !== "string" || !values.includes(value)) {
    return fail(`${label} must be one of ${values.join(", ")}.`);
  }
  return value as Values[number];
}

function textList(
  value: unknown,
  label: string,
  maximum: number,
  minimum = 1,
): string[] {
  if (!Array.isArray(value) || value.length < minimum || value.length > 100) {
    return fail(`${label} must contain between ${minimum} and 100 entries.`);
  }
  return value.map((entry, index) =>
    text(entry, `${label}[${index}]`, maximum),
  );
}

function bool(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    return fail(`${label} must be true or false.`);
  }
  return value;
}

function nullableText(
  value: unknown,
  label: string,
  maximum: number,
): string | null {
  return value === null ? null : text(value, label, maximum);
}

function timestamp(value: unknown, label: string): string {
  const parsed = text(value, label, 64);
  if (Number.isNaN(Date.parse(parsed))) {
    return fail(`${label} must be an ISO timestamp.`);
  }
  return parsed;
}

function nextTimestamp(workspace: ResearchWorkspace): string {
  return new Date(
    Math.max(Date.now(), Date.parse(workspace.updatedAt) + 1),
  ).toISOString();
}

function newId(prefix: string): string {
  return `${prefix}.${randomUUID()}`;
}

function fingerprint(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(value), "utf8")
    .digest("hex");
}

function heads<Revision extends { revisionId: string; supersedesRevisionId: string | null }>(
  revisions: readonly Revision[],
): Revision[] {
  const parents = new Set(
    revisions
      .map((revision) => revision.supersedesRevisionId)
      .filter((id): id is string => id !== null),
  );
  return revisions.filter((revision) => !parents.has(revision.revisionId));
}

function gapHead(
  workspace: ResearchWorkspace,
  gapId: string,
): EvidenceGapRevision {
  const head = heads(
    workspace.evidenceGapRevisions.filter(
      (revision) => revision.gapId === gapId,
    ),
  )[0];
  if (head === undefined) {
    return fail(`Unknown Evidence Gap: ${gapId}.`);
  }
  return head;
}

function parseGapPolicy(command: Record<string, unknown>) {
  const scoutMode = oneOf(command.scoutMode, "scoutMode", [
    "manual_only",
    "metadata_search",
  ] as const);
  const preferredSourceTypes = textList(
    command.preferredSourceTypes,
    "preferredSourceTypes",
    80,
  ).map((sourceType) =>
    oneOf(sourceType, "preferredSourceTypes entry", SOURCE_TYPES),
  );
  const provider = oneOf(command.provider, "provider", PROVIDERS);
  const query = text(command.query, "query", 4_000, scoutMode === "manual_only");
  if (
    scoutMode === "metadata_search" &&
    (/\b(?:api[_-]?key|access[_-]?token|password|secret)\s*[:=]/i.test(
      query,
    ) ||
      /\bbearer\s+[A-Za-z0-9._~+/=-]+/i.test(query) ||
      /https?:\/\/[^/\s:@]+:[^@\s]+@/i.test(query) ||
      /\b(?:mrn|medical record number)\s*[:#=]\s*\S+/i.test(query) ||
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(query))
  ) {
    fail(
      "Literal search queries must not contain credentials, contact addresses, or patient identifiers.",
    );
  }
  let refreshIntervalDays: number | null = null;
  if (scoutMode === "metadata_search") {
    if (
      typeof command.refreshIntervalDays !== "number" ||
      !Number.isInteger(command.refreshIntervalDays) ||
      command.refreshIntervalDays < 1 ||
      command.refreshIntervalDays > 3_650
    ) {
      fail("refreshIntervalDays must be an integer from 1 through 3650.");
    }
    refreshIntervalDays = command.refreshIntervalDays;
  } else if (command.refreshIntervalDays !== null) {
    fail("Manual-only scouting must not define a refresh cadence.");
  }
  return {
    mode: scoutMode,
    preferredSourceTypes,
    preferredJurisdictions: [],
    preferredPopulations: [],
    preferredSettings: [],
    providerStrategies:
      scoutMode === "manual_only"
        ? []
        : [{ provider, query, filters: [] }],
    publicationYearFloor: null,
    includePreprints: false,
    maximumCandidates: 100,
    refreshIntervalDays,
    requireHumanScreening: true as const,
    requireRightsDecisionBeforeFullText: true as const,
  };
}

function ensureTarget(
  workspace: ResearchWorkspace,
  target: ClinicalTargetReference,
): void {
  const exists = workspace.externalReferences.clinicalTargets.some(
    (candidate) =>
      candidate.kind === target.kind && candidate.id === target.id,
  );
  if (!exists) {
    workspace.externalReferences.clinicalTargets.push(target);
  }
}

function createGap(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const gapId = newId("gap");
  const target: ClinicalTargetReference = {
    kind: oneOf(command.targetKind, "targetKind", TARGET_KINDS),
    id: stableId(command.targetId, "targetId"),
  };
  ensureTarget(workspace, target);
  workspace.evidenceGaps.push({
    id: gapId,
    createdAt: now,
    createdBy: LOCAL_ACTOR,
  });
  workspace.evidenceGapRevisions.push({
    revisionId: newId("gap-revision"),
    gapId,
    supersedesRevisionId: null,
    title: text(command.title, "title", 240),
    clinicalQuestion: text(
      command.clinicalQuestion,
      "clinicalQuestion",
      2_000,
    ),
    whyNeeded: text(command.whyNeeded, "whyNeeded", 2_000),
    targetContent: [target],
    acceptanceCriteria: textList(
      command.acceptanceCriteria,
      "acceptanceCriteria",
      800,
    ),
    scoutPolicy: parseGapPolicy(command),
    status: "open",
    resolutionNote: null,
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
    changeSummary: "Create the evidence gap in the local workbench.",
  });
}

function reviseGap(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const gapId = stableId(command.gapId, "gapId");
  const previous = gapHead(workspace, gapId);
  const status = oneOf(command.status, "status", GAP_STATUSES) as GapStatus;
  const resolutionNote =
    command.resolutionNote === null
      ? null
      : text(command.resolutionNote, "resolutionNote", 2_000);
  const final = ["resolved", "deferred", "withdrawn"].includes(status);
  if (final !== (resolutionNote !== null)) {
    fail("Final gap statuses require a resolution note; active statuses do not.");
  }
  const target: ClinicalTargetReference = {
    kind: oneOf(command.targetKind, "targetKind", TARGET_KINDS),
    id: stableId(command.targetId, "targetId"),
  };
  ensureTarget(workspace, target);
  workspace.evidenceGapRevisions.push({
    revisionId: newId("gap-revision"),
    gapId,
    supersedesRevisionId: previous.revisionId,
    title: text(command.title, "title", 240),
    clinicalQuestion: text(
      command.clinicalQuestion,
      "clinicalQuestion",
      2_000,
    ),
    whyNeeded: text(command.whyNeeded, "whyNeeded", 2_000),
    targetContent: [target],
    acceptanceCriteria: textList(
      command.acceptanceCriteria,
      "acceptanceCriteria",
      800,
    ),
    scoutPolicy: parseGapPolicy(command),
    status,
    resolutionNote,
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
    changeSummary: text(command.changeSummary, "changeSummary", 500),
  });
}

function captureCandidate(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const gapId = stableId(command.gapId, "gapId");
  let revision = gapHead(workspace, gapId);
  if (["resolved", "deferred", "withdrawn"].includes(revision.status)) {
    fail("Candidates cannot be captured for a final evidence gap.");
  }
  if (revision.status !== "candidates_found") {
    const statusRevision: EvidenceGapRevision = {
      ...revision,
      revisionId: newId("gap-revision"),
      supersedesRevisionId: revision.revisionId,
      status: "candidates_found",
      recordedAt: now,
      recordedBy: LOCAL_ACTOR,
      changeSummary: "Record that a candidate was captured.",
    };
    workspace.evidenceGapRevisions.push(statusRevision);
    revision = statusRevision;
  }

  const title = text(command.title, "title", 700);
  const citation = text(command.citation, "citation", 1_600);
  const organization = text(command.organization, "organization", 300);
  const sourceType = oneOf(command.sourceType, "sourceType", SOURCE_TYPES);
  const runId = newId("search-run");
  const metadataFingerprint = fingerprint({
    title,
    citation,
    organization,
    sourceType,
  });
  const existingCandidate = workspace.candidates.find(
    (candidate) => candidate.metadataFingerprint === metadataFingerprint,
  );
  const candidateId =
    existingCandidate?.id ?? `candidate.${metadataFingerprint}`;
  const strategy = {
    databaseOrRegistry: "manual_other",
    query: citation,
    filters: ["Manual candidate capture in the local workbench"],
  };
  workspace.searchRuns.push({
    id: runId,
    gapRevisionIds: [revision.revisionId],
    strategyVersion: "strategy.local.manual.v1",
    scoutPolicyFingerprint: fingerprint(revision.scoutPolicy),
    queries: [strategy],
    startedAt: now,
    completedAt: now,
    searchThroughDate: now.slice(0, 10),
    status: "completed",
    providerResultCountTotal: 1,
    providerRecordsInspected: 1,
    candidateCountCaptured: 1,
    toolId: "tool.local.workbench",
    toolVersion: "1",
    inputFingerprint: fingerprint({ gapId, title, citation, organization }),
    statusNote: null,
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
  });
  if (existingCandidate === undefined) {
    workspace.candidates.push({
      id: candidateId,
      searchRunId: runId,
      sourceType,
      title,
      authors: [],
      organization,
      publicationDate: null,
      doi: null,
      pmid: null,
      url: null,
      citation,
      publicationTypes: [],
      language: null,
      authoritySignals: [],
      surfacingRationale: `Manually captured for Evidence Gap ${gapId}.`,
      accessHint: "unknown",
      matchedExistingSourceId: null,
      metadataFingerprint,
      discoveredAt: now,
      recordedAt: now,
      recordedBy: LOCAL_ACTOR,
    });
  }
  workspace.candidateObservations.push({
    id: newId("candidate-observation"),
    candidateId,
    searchRunId: runId,
    provider: "manual_other",
    providerRecordId: metadataFingerprint,
    observedDoi: null,
    observedPmid: null,
    metadataFingerprint,
    observedAt: now,
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
  });
}

function screenCandidate(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const candidateId = stableId(command.candidateId, "candidateId");
  const gapId = stableId(command.gapId, "gapId");
  const disposition = oneOf(command.disposition, "disposition", [
    "include",
    "exclude",
    "duplicate",
    "awaiting_full_text",
    "rights_blocked",
  ] as const);
  const candidate = workspace.candidates.find(
    (entry) => entry.id === candidateId,
  );
  if (candidate === undefined) {
    fail(`Unknown Evidence Candidate: ${candidateId}.`);
  }
  gapHead(workspace, gapId);
  const requiresSource = ["include", "duplicate"].includes(disposition);
  const resolvedSourceId =
    command.resolvedSourceId === null
      ? null
      : stableId(command.resolvedSourceId, "resolvedSourceId");
  if (requiresSource !== (resolvedSourceId !== null)) {
    fail("Included or duplicate candidates require a resolved Source.");
  }
  if (
    resolvedSourceId !== null &&
    !workspace.externalReferences.sources.some(
      (source) => source.id === resolvedSourceId,
    )
  ) {
    fail(`Unknown Source: ${resolvedSourceId}.`);
  }
  const prior = heads(
    workspace.screeningDecisions
      .filter(
        (decision) =>
          decision.candidateId === candidateId && decision.gapId === gapId,
      )
      .map((decision) => ({
        ...decision,
        revisionId: decision.id,
        supersedesRevisionId: decision.supersedesDecisionId,
      })),
  )[0];
  workspace.screeningDecisions.push({
    id: newId("screening"),
    candidateId,
    gapId,
    supersedesDecisionId: prior?.id ?? null,
    disposition,
    resolvedSourceId,
    reason: text(command.reason, "reason", 2_000),
    reviewedAt: now,
    reviewedBy: LOCAL_ACTOR,
    recordedAt: now,
  });
}

function parsePermissions(value: unknown): SourceRightsPermissions {
  const candidate = record(value, "permissions");
  const permissionKeys = Object.keys(denyAllSourceRights);
  const unexpected = Object.keys(candidate).find(
    (key) => !permissionKeys.includes(key),
  );
  if (unexpected !== undefined) {
    fail(`permissions.${unexpected} is not supported.`);
  }
  const permissions: RightsPermissionsDto = {
    bibliographicMetadata: bool(
      candidate.bibliographicMetadata,
      "permissions.bibliographicMetadata",
    ),
    privateStorage: bool(
      candidate.privateStorage,
      "permissions.privateStorage",
    ),
    localTextExtraction: bool(
      candidate.localTextExtraction,
      "permissions.localTextExtraction",
    ),
    localStructuredIndexing: bool(
      candidate.localStructuredIndexing,
      "permissions.localStructuredIndexing",
    ),
    externalAiProcessing: bool(
      candidate.externalAiProcessing,
      "permissions.externalAiProcessing",
    ),
    derivedClinicalContent: bool(
      candidate.derivedClinicalContent,
      "permissions.derivedClinicalContent",
    ),
    projectParaphrasePublication: bool(
      candidate.projectParaphrasePublication,
      "permissions.projectParaphrasePublication",
    ),
    publicSourceTextReuse: bool(
      candidate.publicSourceTextReuse,
      "permissions.publicSourceTextReuse",
    ),
    runtimeRedistribution: bool(
      candidate.runtimeRedistribution,
      "permissions.runtimeRedistribution",
    ),
    commercialDistribution: bool(
      candidate.commercialDistribution,
      "permissions.commercialDistribution",
    ),
  };
  return permissions;
}

function parseFairUseAssessment(
  value: unknown,
): FairUseAssessmentDto | null {
  if (value === null) return null;
  const candidate = record(value, "fairUseAssessment");
  const allowed = [
    "preciseUse",
    "purposeAndCharacter",
    "natureOfWork",
    "amountAndSubstantiality",
    "marketEffect",
    "conclusion",
  ] as const;
  const unexpected = Object.keys(candidate).find(
    (key) => !allowed.includes(key as (typeof allowed)[number]),
  );
  if (unexpected !== undefined) {
    fail(`fairUseAssessment.${unexpected} is not supported.`);
  }
  return {
    preciseUse: text(
      candidate.preciseUse,
      "fairUseAssessment.preciseUse",
      1_600,
    ),
    purposeAndCharacter: text(
      candidate.purposeAndCharacter,
      "fairUseAssessment.purposeAndCharacter",
      2_000,
    ),
    natureOfWork: text(
      candidate.natureOfWork,
      "fairUseAssessment.natureOfWork",
      2_000,
    ),
    amountAndSubstantiality: text(
      candidate.amountAndSubstantiality,
      "fairUseAssessment.amountAndSubstantiality",
      2_000,
    ),
    marketEffect: text(
      candidate.marketEffect,
      "fairUseAssessment.marketEffect",
      2_000,
    ),
    conclusion: oneOf(
      candidate.conclusion,
      "fairUseAssessment.conclusion",
      ["proceed_narrowly", "do_not_proceed", "seek_legal_review"] as const,
    ),
  };
}

function recordSourceRights(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const sourceId =
    command.sourceId === null
      ? newId("source")
      : stableId(command.sourceId, "sourceId");
  const sourceLabel = text(command.sourceLabel, "sourceLabel", 300);
  const exists = workspace.externalReferences.sources.some(
    (source) => source.id === sourceId,
  );
  if (!exists) {
    if (command.sourceId !== null) {
      fail(`Unknown Source: ${sourceId}.`);
    }
    workspace.externalReferences.sources.push({ id: sourceId });
  }
  const prior = heads(
    workspace.sourceRightsDecisions
      .filter((decision) => decision.sourceId === sourceId)
      .map((decision) => ({
        ...decision,
        revisionId: decision.id,
        supersedesRevisionId: decision.supersedesDecisionId,
      })),
  )[0];
  const decisionStatus = oneOf(command.decisionStatus, "decisionStatus", [
    "default_deny",
    "permitted_with_conditions",
    "metadata_only",
    "blocked",
    "revoked",
  ] as const);
  if (decisionStatus === "revoked" && prior === undefined) {
    fail("A revocation must supersede an earlier rights decision.");
  }
  const legalBasis = oneOf(command.legalBasis, "legalBasis", [
    "unreviewed",
    "owner_authored",
    "public_domain",
    "open_license",
    "written_permission",
    "fair_use",
    "metadata_only",
  ] as const);
  const effectiveAt = timestamp(command.effectiveAt, "effectiveAt");
  const expiresAt =
    command.expiresAt === null
      ? null
      : timestamp(command.expiresAt, "expiresAt");
  const notes = text(command.notes, "notes", 2_500);
  workspace.sourceRightsDecisions.push({
    id: newId("rights"),
    sourceId,
    supersedesDecisionId: prior?.id ?? null,
    decisionStatus,
    legalBasis,
    permissions: parsePermissions(command.permissions),
    territories: textList(command.territories, "territories", 160),
    licenseLabel: nullableText(command.licenseLabel, "licenseLabel", 240),
    licenseUrl: nullableText(command.licenseUrl, "licenseUrl", 2_000),
    termsUrl: nullableText(command.termsUrl, "termsUrl", 2_000),
    attributionStatement: nullableText(
      command.attributionStatement,
      "attributionStatement",
      1_600,
    ),
    requiredNotices: textList(
      command.requiredNotices,
      "requiredNotices",
      1_200,
      0,
    ),
    nonCommercialOnly: bool(
      command.nonCommercialOnly,
      "nonCommercialOnly",
    ),
    shareAlikeRequired: bool(
      command.shareAlikeRequired,
      "shareAlikeRequired",
    ),
    thirdPartyMaterialPolicy: oneOf(
      command.thirdPartyMaterialPolicy,
      "thirdPartyMaterialPolicy",
      [
        "excluded",
        "item_level_review_required",
        "included_by_permission",
        "not_applicable",
      ] as const,
    ),
    fairUseAssessment: parseFairUseAssessment(command.fairUseAssessment),
    permissionEvidenceReferenceIds: textList(
      command.permissionEvidenceReferenceIds,
      "permissionEvidenceReferenceIds",
      180,
      0,
    ).map((referenceId, index) =>
      stableId(referenceId, `permissionEvidenceReferenceIds[${index}]`),
    ),
    reviewBasis: oneOf(command.reviewBasis, "reviewBasis", [
      "owner_attestation",
      "engineering_risk_assessment",
      "legal_counsel",
    ] as const),
    reviewedBy: LOCAL_ACTOR,
    reviewedAt: now,
    effectiveAt,
    expiresAt,
    recordedAt: now,
    notes: `Source label: ${sourceLabel}\nRationale: ${notes}`,
  });
}

function addExpertOpinion(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const gapId = stableId(command.gapId, "gapId");
  gapHead(workspace, gapId);
  const opinionId = newId("opinion");
  workspace.expertOpinions.push({
    id: opinionId,
    createdAt: now,
    createdBy: LOCAL_ACTOR,
  });
  workspace.expertOpinionRevisions.push({
    revisionId: newId("opinion-revision"),
    opinionId,
    supersedesRevisionId: null,
    evidenceGapIds: [gapId],
    relatedFormalContributionIds: [],
    statement: text(command.statement, "statement", 1_600),
    rationale: text(command.rationale, "rationale", 2_000),
    clinicalScope: text(command.clinicalScope, "clinicalScope", 1_200),
    limitations: textList(command.limitations, "limitations", 800),
    reviewStatus: "proposed",
    reviewedAt: null,
    reviewedBy: null,
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
    changeSummary: "Create a proposed expert opinion.",
  });
}

function reviewExpertOpinion(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
  reviewerRole: ReviewerRole,
): void {
  const opinionId = stableId(command.opinionId, "opinionId");
  const current = heads(
    workspace.expertOpinionRevisions.filter(
      (revision) => revision.opinionId === opinionId,
    ),
  )[0];
  if (current === undefined) {
    fail(`Unknown Expert Opinion: ${opinionId}.`);
  }
  const disposition = oneOf(command.disposition, "disposition", [
    "accepted",
    "rejected",
  ] as const);
  if (
    disposition === "accepted" &&
    !canAcceptExpertOpinion(reviewerRole)
  ) {
    fail(
      "Only an owner or clinical reviewer can accept Expert Opinion. Other reviewer roles cannot promote it into Known.",
    );
  }
  const reviewNote = text(command.reviewNote, "reviewNote", 500);
  const revisionId = newId("opinion-revision");
  workspace.expertOpinionRevisions.push({
    ...current,
    revisionId,
    supersedesRevisionId: current.revisionId,
    reviewStatus: disposition,
    reviewedAt: now,
    reviewedBy: LOCAL_ACTOR,
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
    changeSummary: reviewNote,
  });
  if (disposition === "accepted") {
    const firstGap = gapHead(workspace, current.evidenceGapIds[0]!);
    workspace.contributions.push({
      id: newId("contribution"),
      seriesId: newId("contribution-series"),
      supersedesContributionId: null,
      evidenceGapIds: [...current.evidenceGapIds],
      targetContent: [...firstGap.targetContent],
      authority: "expert_opinion",
      sourceId: null,
      citationIds: [],
      expertOpinionRevisionId: revisionId,
      role: "context",
      contributionTypes: ["context_only"],
      statement: current.statement,
      applicabilityNote: current.clinicalScope,
      sourceRole: "expert_opinion",
      generatedBy: "human",
      reviewStatus: "accepted",
      reviewedAt: now,
      reviewedBy: LOCAL_ACTOR,
      recordedAt: now,
      recordedBy: LOCAL_ACTOR,
    });
  }
}

function registerCitation(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
): void {
  const citationId = stableId(command.citationId, "citationId");
  const sourceId = stableId(command.sourceId, "sourceId");
  if (
    !workspace.externalReferences.sources.some(
      (source) => source.id === sourceId,
    )
  ) {
    fail(`Unknown Source: ${sourceId}.`);
  }
  if (
    workspace.externalReferences.citations.some(
      (citation) => citation.id === citationId,
    )
  ) {
    fail(`Citation ${citationId} is already registered.`);
  }
  const verificationState = oneOf(
    command.verificationState,
    "verificationState",
    ["unverified"] as const,
  );
  workspace.externalReferences.citations.push({
    id: citationId,
    sourceId,
    sourceSnapshotId: stableId(
      command.sourceSnapshotId,
      "sourceSnapshotId",
    ),
    verificationState,
    verifiedBy: null,
    verifiedAt: null,
  });
}

function proposeContribution(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const gapId = stableId(command.gapId, "gapId");
  const gap = gapHead(workspace, gapId);
  const sourceId = stableId(command.sourceId, "sourceId");
  if (
    !workspace.externalReferences.sources.some(
      (source) => source.id === sourceId,
    )
  ) {
    fail(`Unknown Source: ${sourceId}.`);
  }
  const citationIds = textList(command.citationIds, "citationIds", 180).map(
    (citationId) => stableId(citationId, "citationIds entry"),
  );
  const citationSet = new Set(
    workspace.externalReferences.citations.map((citation) => citation.id),
  );
  citationIds.forEach((citationId) => {
    if (!citationSet.has(citationId)) {
      fail(`Unknown Citation: ${citationId}.`);
    }
  });
  workspace.contributions.push({
    id: newId("contribution"),
    seriesId: newId("contribution-series"),
    supersedesContributionId: null,
    evidenceGapIds: [gapId],
    targetContent: [...gap.targetContent],
    authority: "formal_source",
    sourceId,
    citationIds,
    expertOpinionRevisionId: null,
    role: oneOf(command.role, "role", [
      "supports",
      "challenges",
      "qualifies",
      "context",
    ] as const),
    contributionTypes: textList(
      command.contributionTypes,
      "contributionTypes",
      80,
    ).map((type) =>
      oneOf(type, "contributionTypes entry", CONTRIBUTION_TYPES),
    ),
    statement: text(command.statement, "statement", 1_600),
    applicabilityNote: text(
      command.applicabilityNote,
      "applicabilityNote",
      1_200,
    ),
    sourceRole: oneOf(command.sourceRole, "sourceRole", [
      "primary_study",
      "evidence_synthesis",
      "guideline",
      "regulatory",
      "classification",
      "aggregator",
    ] as const),
    generatedBy: "human",
    reviewStatus: "proposed",
    reviewedAt: null,
    reviewedBy: null,
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
  });
}

function reviewContribution(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const contributionId = stableId(command.contributionId, "contributionId");
  const current = workspace.contributions.find(
    (contribution) => contribution.id === contributionId,
  );
  if (current === undefined) {
    fail(`Unknown Evidence Contribution: ${contributionId}.`);
  }
  const childExists = workspace.contributions.some(
    (contribution) =>
      contribution.supersedesContributionId === contributionId,
  );
  if (childExists) {
    fail("Only the current contribution revision can be reviewed.");
  }
  const disposition = oneOf(command.disposition, "disposition", [
    "accepted",
    "rejected",
  ] as const);
  workspace.contributions.push({
    ...current,
    id: newId("contribution"),
    supersedesContributionId: current.id,
    reviewStatus: disposition,
    reviewedAt: now,
    reviewedBy: LOCAL_ACTOR,
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
  });
}

function recordSourceRelation(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const fromSourceId = stableId(command.fromSourceId, "fromSourceId");
  const toSourceId = stableId(command.toSourceId, "toSourceId");
  const relationType = oneOf(command.relationType, "relationType", [
    "corrects",
    "retracts",
    "supersedes",
    "updates",
    "companion_to",
    "executive_summary_of",
    "translation_of",
  ] as const);
  const sourceIds = new Set(
    workspace.externalReferences.sources.map((source) => source.id),
  );
  if (!sourceIds.has(fromSourceId) || !sourceIds.has(toSourceId)) {
    fail("Source relations may reference only registered Sources.");
  }
  const supersededIds = new Set(
    workspace.sourceRelations
      .map((relation) => relation.supersedesRelationId)
      .filter((id): id is string => id !== null),
  );
  const currentRelation = workspace.sourceRelations.find(
    (relation) =>
      relation.fromSourceId === fromSourceId &&
      relation.toSourceId === toSourceId &&
      relation.relationType === relationType &&
      !supersededIds.has(relation.id),
  );
  if (currentRelation?.relationStatus === "active") {
    fail(
      "This typed Source relation is already active. Withdraw the current relation before recording a corrective-forward replacement.",
    );
  }
  workspace.sourceRelations.push({
    id: newId("source-relation"),
    fromSourceId,
    toSourceId,
    relationType,
    relationStatus: "active",
    supersedesRelationId: currentRelation?.id ?? null,
    note: text(command.note, "note", 1_200),
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
  });
}

function withdrawSourceRelation(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const relationId = stableId(command.relationId, "relationId");
  const relation = workspace.sourceRelations.find(
    (candidate) => candidate.id === relationId,
  );
  if (relation === undefined) {
    fail(`Unknown Source Relation: ${relationId}.`);
  }
  if (
    relation.relationStatus !== "active" ||
    workspace.sourceRelations.some(
      (candidate) => candidate.supersedesRelationId === relation.id,
    )
  ) {
    fail("Only the current active Source Relation can be withdrawn.");
  }
  workspace.sourceRelations.push({
    ...relation,
    id: newId("source-relation"),
    relationStatus: "withdrawn",
    supersedesRelationId: relation.id,
    note: text(command.note, "note", 1_200),
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
  });
}

function createSynthesis(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const gapId = stableId(command.gapId, "gapId");
  const currentGap = gapHead(workspace, gapId);
  const contributions = currentSynthesisEligibleContributions(
    workspace,
    gapId,
    now,
  );
  if (contributions.length === 0) {
    fail(
      "A synthesis requires at least one current accepted contribution. Accept an expert opinion or formal contribution first.",
    );
  }
  const opinionParents = new Set(
    workspace.expertOpinionRevisions
      .map((entry) => entry.supersedesRevisionId)
      .filter((id): id is string => id !== null),
  );
  const opinions = workspace.expertOpinionRevisions.filter(
    (entry) =>
      entry.evidenceGapIds.includes(gapId) &&
      entry.reviewStatus === "accepted" &&
      !opinionParents.has(entry.revisionId),
  );
  const allGapRevisionIds = new Set(
    workspace.evidenceGapRevisions
      .filter((entry) => entry.gapId === gapId)
      .map((entry) => entry.revisionId),
  );
  workspace.synthesisProposals.push({
    id: newId("synthesis"),
    evidenceGapRevisionIds: [currentGap.revisionId],
    searchRunIds: workspace.searchRuns
      .filter((run) =>
        run.gapRevisionIds.some((revisionId) =>
          allGapRevisionIds.has(revisionId),
        ),
      )
      .map((run) => run.id),
    contributionIds: contributions.map((entry) => entry.id),
    expertOpinionRevisionIds: opinions.map((entry) => entry.revisionId),
    focusedQuestion: currentGap.clinicalQuestion,
    supportingSummary: text(
      command.supportingSummary,
      "supportingSummary",
      2_000,
    ),
    opposingOrQualifyingSummary: text(
      command.opposingOrQualifyingSummary,
      "opposingOrQualifyingSummary",
      2_000,
    ),
    proposedDirection: text(
      command.proposedDirection,
      "proposedDirection",
      2_000,
    ),
    limitations: textList(command.limitations, "limitations", 800),
    unresolvedQuestions: [],
    generatedBy: "human",
    generationProvenance: null,
    pointMagnitudeExcluded: true,
    clinicalApprovalId: null,
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
  });
}

function decideSynthesis(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const proposalId = stableId(command.proposalId, "proposalId");
  const proposal = workspace.synthesisProposals.find(
    (entry) => entry.id === proposalId,
  );
  if (proposal === undefined) {
    fail(`Unknown Synthesis Proposal: ${proposalId}.`);
  }
  const disposition = oneOf(command.disposition, "disposition", [
    "accept",
    "reject",
  ] as const);
  const prior = heads(
    workspace.synthesisDecisions
      .filter((decision) => decision.proposalId === proposalId)
      .map((decision) => ({
        ...decision,
        revisionId: decision.id,
        supersedesRevisionId: decision.supersedesDecisionId,
      })),
  )[0];
  workspace.synthesisDecisions.push({
    id: newId("synthesis-decision"),
    proposalId,
    supersedesDecisionId: prior?.id ?? null,
    disposition,
    acceptedStatement:
      disposition === "accept" ? proposal.proposedDirection : null,
    rationale: text(command.rationale, "rationale", 2_000),
    resultingEvidenceGapIds: [],
    reviewedAt: now,
    reviewedBy: LOCAL_ACTOR,
    recordedAt: now,
    clinicalApprovalId: null,
  });
}

function createContentChange(
  workspace: ResearchWorkspace,
  command: Record<string, unknown>,
  now: string,
): void {
  const synthesisDecisionId = stableId(
    command.synthesisDecisionId,
    "synthesisDecisionId",
  );
  const decision = workspace.synthesisDecisions.find(
    (entry) => entry.id === synthesisDecisionId,
  );
  if (
    decision === undefined ||
    !["accept", "narrow"].includes(decision.disposition)
  ) {
    fail(
      "A content-change handoff requires an accepted or narrowed synthesis decision.",
    );
  }
  const supersededDecisionIds = new Set(
    workspace.synthesisDecisions
      .filter((candidate) => candidate.proposalId === decision.proposalId)
      .map((candidate) => candidate.supersedesDecisionId)
      .filter((id): id is string => id !== null),
  );
  const currentDecision = workspace.synthesisDecisions.find(
    (candidate) =>
      candidate.proposalId === decision.proposalId &&
      Date.parse(candidate.recordedAt) <= Date.parse(now) &&
      Date.parse(candidate.reviewedAt) <= Date.parse(now) &&
      !supersededDecisionIds.has(candidate.id),
  );
  if (currentDecision?.id !== decision.id) {
    fail(
      "A content-change handoff requires the current Synthesis Decision head; a later decision must be resolved first.",
    );
  }
  const synthesisProposal = workspace.synthesisProposals.find(
    (proposal) => proposal.id === decision.proposalId,
  );
  if (synthesisProposal === undefined) {
    fail("The accepted Synthesis Proposal no longer exists.");
  }
  const gapIds = new Set(
    synthesisProposal.evidenceGapRevisionIds
      .map(
        (revisionId) =>
          workspace.evidenceGapRevisions.find(
            (revision) => revision.revisionId === revisionId,
          )?.gapId,
      )
      .filter((id): id is string => id !== undefined),
  );
  const currentEligibleContributionIds = new Set(
    [...gapIds].flatMap((gapId) =>
      currentSynthesisEligibleContributions(
        workspace,
        gapId,
        now,
      ).map((contribution) => contribution.id),
    ),
  );
  if (
    synthesisProposal.contributionIds.some(
      (contributionId) =>
        !currentEligibleContributionIds.has(contributionId),
    )
  ) {
    fail(
      "A content-change handoff requires a fresh Synthesis because one or more contributing records are no longer current and eligible.",
    );
  }
  const target: ClinicalTargetReference = {
    kind: oneOf(command.targetKind, "targetKind", TARGET_KINDS),
    id: stableId(command.targetId, "targetId"),
  };
  ensureTarget(workspace, target);
  const synthesisTargetKeys = new Set(
    synthesisProposal.evidenceGapRevisionIds.flatMap(
      (revisionId) =>
        workspace.evidenceGapRevisions
          .find((revision) => revision.revisionId === revisionId)
          ?.targetContent.map(
            (candidate) => `${candidate.kind}:${candidate.id}`,
          ) ?? [],
    ),
  );
  const targetIsCrossTarget = !synthesisTargetKeys.has(
    `${target.kind}:${target.id}`,
  );
  let crossTargetReview: {
    rationale: string;
    reviewedAt: string;
    reviewedBy: string;
  } | null = null;
  if (targetIsCrossTarget) {
    if (command.crossTargetReviewConfirmed !== true) {
      fail(
        "A cross-target handoff requires an explicit reviewer confirmation.",
      );
    }
    crossTargetReview = {
      rationale: text(
        command.crossTargetRationale,
        "crossTargetRationale",
        2_000,
      ),
      reviewedAt: now,
      reviewedBy: LOCAL_ACTOR,
    };
  } else if (
    command.crossTargetReviewConfirmed === true ||
    (typeof command.crossTargetRationale === "string" &&
      command.crossTargetRationale.trim().length > 0)
  ) {
    fail(
      "A same-target handoff must not record an unnecessary cross-target review.",
    );
  }
  workspace.contentChangeProposals.push({
    id: newId("content-change"),
    synthesisDecisionId,
    targetContent: [target],
    changeKind: oneOf(command.changeKind, "changeKind", [
      "add",
      "modify",
      "withdraw",
      "no_change",
    ] as const),
    beforeSummary: text(
      command.beforeSummary,
      "beforeSummary",
      2_000,
      true,
    ),
    proposedSummary: text(
      command.proposedSummary,
      "proposedSummary",
      2_000,
    ),
    status: oneOf(command.status, "status", [
      "draft",
      "ready_for_authoring",
    ] as const),
    crossTargetReview,
    clinicalApprovalId: null,
    recordedAt: now,
    recordedBy: LOCAL_ACTOR,
  });
}

const ACTOR_FIELDS = new Set([
  "createdBy",
  "recordedBy",
  "reviewedBy",
  "acknowledgedBy",
]);

const stampActor = (value: unknown, actorId: string): void => {
  if (Array.isArray(value)) {
    value.forEach((entry) => stampActor(entry, actorId));
    return;
  }
  if (value === null || typeof value !== "object") return;
  const mutable = value as Record<string, unknown>;
  for (const [key, nested] of Object.entries(mutable)) {
    if (ACTOR_FIELDS.has(key) && nested === LOCAL_ACTOR) {
      mutable[key] = actorId;
    } else {
      stampActor(nested, actorId);
    }
  }
};

const stampNewCommandRecords = (
  previous: ResearchWorkspace,
  next: ResearchWorkspace,
  actorId: string,
): void => {
  const collectionPairs: Array<
    [readonly unknown[], readonly unknown[]]
  > = [
    [previous.externalReferences.sources, next.externalReferences.sources],
    [previous.externalReferences.citations, next.externalReferences.citations],
    [
      previous.externalReferences.clinicalTargets,
      next.externalReferences.clinicalTargets,
    ],
    [
      previous.externalReferences.clinicalApprovals,
      next.externalReferences.clinicalApprovals,
    ],
    [previous.citationVerificationSignals, next.citationVerificationSignals],
    [previous.evidenceGaps, next.evidenceGaps],
    [previous.evidenceGapRevisions, next.evidenceGapRevisions],
    [previous.sourceRelations, next.sourceRelations],
    [previous.sourceRightsDecisions, next.sourceRightsDecisions],
    [previous.searchRuns, next.searchRuns],
    [previous.candidates, next.candidates],
    [previous.candidateObservations, next.candidateObservations],
    [previous.screeningDecisions, next.screeningDecisions],
    [previous.contributions, next.contributions],
    [previous.expertOpinions, next.expertOpinions],
    [previous.expertOpinionRevisions, next.expertOpinionRevisions],
    [previous.synthesisProposals, next.synthesisProposals],
    [previous.synthesisDecisions, next.synthesisDecisions],
    [previous.contentChangeProposals, next.contentChangeProposals],
  ];
  for (const [before, after] of collectionPairs) {
    after
      .slice(before.length)
      .forEach((record) => stampActor(record, actorId));
  }
};

export function applyWorkbenchCommand(
  current: ResearchWorkspace,
  candidate: unknown,
  reviewerId = LOCAL_ACTOR,
  reviewerRole: ReviewerRole = "owner",
): ResearchWorkspace {
  const actorId = stableId(reviewerId, "reviewerId");
  const command = record(candidate, "command");
  const type = text(command.type, "command.type", 80);
  const workspace = structuredClone(current);
  const now = nextTimestamp(workspace);

  if (!(type in COMMAND_KEYS)) {
    fail(`Unsupported workbench command: ${type}.`);
  }
  const commandType = type as WorkbenchCommand["type"];
  assertCommandKeys(command, commandType);

  switch (commandType) {
    case "create_gap":
      createGap(workspace, command, now);
      break;
    case "revise_gap":
      reviseGap(workspace, command, now);
      break;
    case "capture_candidate":
      captureCandidate(workspace, command, now);
      break;
    case "screen_candidate":
      screenCandidate(workspace, command, now);
      break;
    case "record_source_rights":
      recordSourceRights(workspace, command, now);
      break;
    case "add_expert_opinion":
      addExpertOpinion(workspace, command, now);
      break;
    case "review_expert_opinion":
      reviewExpertOpinion(workspace, command, now, reviewerRole);
      break;
    case "register_citation":
      registerCitation(workspace, command);
      break;
    case "propose_contribution":
      proposeContribution(workspace, command, now);
      break;
    case "review_contribution":
      reviewContribution(workspace, command, now);
      break;
    case "record_source_relation":
      recordSourceRelation(workspace, command, now);
      break;
    case "withdraw_source_relation":
      withdrawSourceRelation(workspace, command, now);
      break;
    case "create_synthesis":
      createSynthesis(workspace, command, now);
      break;
    case "decide_synthesis":
      decideSynthesis(workspace, command, now);
      break;
    case "create_content_change":
      createContentChange(workspace, command, now);
      break;
  }
  stampNewCommandRecords(current, workspace, actorId);
  workspace.updatedAt = now;
  try {
    return validateResearchWorkspace(workspace);
  } catch (error) {
    throw new CommandInputError(
      error instanceof Error
        ? `The command would create an invalid research transition: ${error.message}`
        : "The command would create an invalid research transition.",
    );
  }
}

export const DEFAULT_RIGHTS_PERMISSIONS: SourceRightsPermissions = {
  ...denyAllSourceRights,
};
