import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  auditIntake,
  executeCommand,
  extractIntake,
  loadAuthoringContext,
  loadHealth,
  loadIntake,
  loadWorkspace,
  recoverIntakeLock,
  scanIntake,
  scoutGap,
  syncAuthoringContext,
  WorkbenchApiError,
  type IntakeStatusDto,
  type SanitizedAuthoringContextDto,
  type WorkbenchHealth,
  type WorkspaceSnapshot,
} from "./api.js";
import {
  buildEvidenceGapPrefill,
  listUncoveredAuthoringTargets,
  type SanitizedAuthoringTarget,
} from "./gap-suggestions.js";
import type {
  FairUseAssessmentDto,
  GapStatus,
  GapViewDto,
  RightsPermissionsDto,
  ScreeningDisposition,
  WorkbenchCommand,
} from "./model.js";

type QueueKey =
  | "overview"
  | "gaps"
  | "literature"
  | "rights"
  | "opinions"
  | "contributions"
  | "synthesis"
  | "intake"
  | "audit";

const QUEUES: { id: QueueKey; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "gaps", label: "Evidence gaps" },
  { id: "literature", label: "Literature" },
  { id: "rights", label: "Rights & sources" },
  { id: "opinions", label: "Expert opinions" },
  { id: "contributions", label: "Contributions" },
  { id: "synthesis", label: "Synthesis" },
  { id: "intake", label: "Intake & handoff" },
  { id: "audit", label: "Audit" },
];

const EMPTY_PERMISSIONS: RightsPermissionsDto = {
  bibliographicMetadata: false,
  privateStorage: false,
  localTextExtraction: false,
  localStructuredIndexing: false,
  externalAiProcessing: false,
  derivedClinicalContent: false,
  projectParaphrasePublication: false,
  publicSourceTextReuse: false,
  runtimeRedistribution: false,
  commercialDistribution: false,
};

const EMPTY_FAIR_USE_ASSESSMENT: FairUseAssessmentDto = {
  preciseUse: "",
  purposeAndCharacter: "",
  natureOfWork: "",
  amountAndSubstantiality: "",
  marketEffect: "",
  conclusion: "seek_legal_review",
};

const PERMISSION_LABELS: Record<keyof RightsPermissionsDto, string> = {
  bibliographicMetadata: "Bibliographic metadata",
  privateStorage: "Private storage",
  localTextExtraction: "Local text extraction",
  localStructuredIndexing: "Local structured indexing",
  externalAiProcessing: "External AI processing",
  derivedClinicalContent: "Derived clinical content",
  projectParaphrasePublication: "Project paraphrase publication",
  publicSourceTextReuse: "Public source-text reuse",
  runtimeRedistribution: "Runtime redistribution",
  commercialDistribution: "Commercial distribution",
};

const FINAL_GAP_STATUSES: GapStatus[] = [
  "resolved",
  "deferred",
  "withdrawn",
];

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function humanize(value: string): string {
  return value.replaceAll("_", " ");
}

const screeningKey = (candidateId: string, gapId: string) =>
  `${candidateId}:${gapId}`;

function formatDate(value: string | null): string {
  if (value === null) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function localDateTimeValue(date = new Date()): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

function StatusPill({ value }: { value: string }) {
  return (
    <span className={`status-pill status-${value}`}>{humanize(value)}</span>
  );
}

function QueueHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="queue-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty-state">{children}</div>;
}

export function App() {
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot | null>(null);
  const [health, setHealth] = useState<WorkbenchHealth | null>(null);
  const [intake, setIntake] = useState<IntakeStatusDto | null>(null);
  const [authoringContext, setAuthoringContext] =
    useState<SanitizedAuthoringContextDto | null>(null);
  const [intakeAssignments, setIntakeAssignments] = useState<
    Record<string, string>
  >({});
  const [intakeScope, setIntakeScope] = useState(
    "Clinician-authorized local evidence review for Gamify Surgery.",
  );
  const [intakeLockRecoveryReason, setIntakeLockRecoveryReason] =
    useState("");
  const [acknowledgeNoPhi, setAcknowledgeNoPhi] = useState(false);
  const [acknowledgeRights, setAcknowledgeRights] = useState(false);
  const [acknowledgeLocalProcessing, setAcknowledgeLocalProcessing] =
    useState(false);
  const [activeQueue, setActiveQueue] = useState<QueueKey>("overview");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("Loading local workspace…");
  const [error, setError] = useState<string | null>(null);

  const [editingGapId, setEditingGapId] = useState("");
  const [gapTitle, setGapTitle] = useState("");
  const [gapQuestion, setGapQuestion] = useState("");
  const [gapWhy, setGapWhy] = useState("");
  const [gapCriteria, setGapCriteria] = useState("");
  const [gapStatus, setGapStatus] = useState<GapStatus>("open");
  const [gapResolution, setGapResolution] = useState("");
  const [targetKind, setTargetKind] = useState("other");
  const [targetId, setTargetId] = useState("target.local.unassigned");
  const [scoutMode, setScoutMode] = useState<"manual_only" | "metadata_search">(
    "manual_only",
  );
  const [preferredTypes, setPreferredTypes] = useState(
    "clinical_guideline, systematic_review, journal_article",
  );
  const [provider, setProvider] = useState("pubmed");
  const [scoutQuery, setScoutQuery] = useState("");
  const [refreshDays, setRefreshDays] = useState("90");

  const [candidateGapId, setCandidateGapId] = useState("");
  const [candidateTitle, setCandidateTitle] = useState("");
  const [candidateCitation, setCandidateCitation] = useState("");
  const [candidateOrganization, setCandidateOrganization] = useState("");
  const [candidateSourceType, setCandidateSourceType] =
    useState("journal_article");
  const [screeningState, setScreeningState] = useState<
    Record<
      string,
      {
        disposition: ScreeningDisposition;
        sourceId: string;
        reason: string;
      }
    >
  >({});

  const [rightsSourceId, setRightsSourceId] = useState("");
  const [rightsLabel, setRightsLabel] = useState("");
  const [rightsStatus, setRightsStatus] = useState("default_deny");
  const [rightsBasis, setRightsBasis] = useState("unreviewed");
  const [rightsPermissions, setRightsPermissions] =
    useState<RightsPermissionsDto>(EMPTY_PERMISSIONS);
  const [territories, setTerritories] = useState("Local project workspace");
  const [licenseLabel, setLicenseLabel] = useState("");
  const [licenseUrl, setLicenseUrl] = useState("");
  const [termsUrl, setTermsUrl] = useState("");
  const [attribution, setAttribution] = useState("");
  const [requiredNotices, setRequiredNotices] = useState("");
  const [permissionEvidenceReferenceIds, setPermissionEvidenceReferenceIds] =
    useState("");
  const [fairUseAssessment, setFairUseAssessment] =
    useState<FairUseAssessmentDto>(EMPTY_FAIR_USE_ASSESSMENT);
  const [nonCommercial, setNonCommercial] = useState(false);
  const [shareAlike, setShareAlike] = useState(false);
  const [thirdPartyPolicy, setThirdPartyPolicy] = useState("excluded");
  const [reviewBasis, setReviewBasis] = useState(
    "engineering_risk_assessment",
  );
  const [effectiveAt, setEffectiveAt] = useState(localDateTimeValue());
  const [expiresAt, setExpiresAt] = useState("");
  const [rightsNotes, setRightsNotes] = useState("");
  const [relationFrom, setRelationFrom] = useState("");
  const [relationTo, setRelationTo] = useState("");
  const [relationType, setRelationType] = useState("updates");
  const [relationNote, setRelationNote] = useState("");
  const [relationWithdrawalNotes, setRelationWithdrawalNotes] = useState<
    Record<string, string>
  >({});

  const [opinionGapId, setOpinionGapId] = useState("");
  const [opinionStatement, setOpinionStatement] = useState("");
  const [opinionRationale, setOpinionRationale] = useState("");
  const [opinionScope, setOpinionScope] = useState("");
  const [opinionLimits, setOpinionLimits] = useState("");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const [citationId, setCitationId] = useState("");
  const [citationSourceId, setCitationSourceId] = useState("");
  const [citationSnapshotId, setCitationSnapshotId] = useState("");
  const [contributionGapId, setContributionGapId] = useState("");
  const [contributionSourceId, setContributionSourceId] = useState("");
  const [contributionCitationIds, setContributionCitationIds] = useState("");
  const [contributionRole, setContributionRole] = useState("supports");
  const [contributionTypes, setContributionTypes] =
    useState("teaching_point");
  const [contributionStatement, setContributionStatement] = useState("");
  const [contributionApplicability, setContributionApplicability] =
    useState("");
  const [contributionSourceRole, setContributionSourceRole] =
    useState("primary_study");

  const [synthesisGapId, setSynthesisGapId] = useState("");
  const [supportingSummary, setSupportingSummary] = useState("");
  const [opposingSummary, setOpposingSummary] = useState("");
  const [proposedDirection, setProposedDirection] = useState("");
  const [synthesisLimits, setSynthesisLimits] = useState("");
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>(
    {},
  );
  const [handoffDecisionId, setHandoffDecisionId] = useState("");
  const [handoffTargetKind, setHandoffTargetKind] = useState("other");
  const [handoffTargetId, setHandoffTargetId] = useState("");
  const [handoffKind, setHandoffKind] = useState("modify");
  const [handoffBefore, setHandoffBefore] = useState("");
  const [handoffProposed, setHandoffProposed] = useState("");
  const [handoffStatus, setHandoffStatus] = useState("draft");
  const [handoffCrossTargetRationale, setHandoffCrossTargetRationale] =
    useState("");
  const [handoffCrossTargetReviewed, setHandoffCrossTargetReviewed] =
    useState(false);

  const view = snapshot?.view ?? null;
  const gapById = useMemo(
    () => new Map(view?.gaps.map((gap) => [gap.id, gap]) ?? []),
    [view],
  );
  const uncoveredAuthoringTargets = useMemo(
    () => listUncoveredAuthoringTargets(authoringContext, view?.gaps ?? []),
    [authoringContext, view],
  );

  async function refresh(message?: string): Promise<void> {
    setBusy(true);
    setError(null);
    try {
      const [workspace, currentHealth, intakeStatus, context] = await Promise.all([
        loadWorkspace(),
        loadHealth(),
        loadIntake().catch(() => null),
        loadAuthoringContext().catch(() => null),
      ]);
      setSnapshot(workspace);
      setHealth(currentHealth);
      setIntake(intakeStatus);
      setAuthoringContext(context);
      if (intakeStatus) {
        const defaultRightsId =
          workspace.view.sourceRights.find(
            (entry) =>
              entry.decisionId &&
              entry.privateStoragePermitted &&
              entry.localProcessingPermitted,
          )?.decisionId ?? "";
        setIntakeAssignments((current) =>
          Object.fromEntries(
            intakeStatus.inboxFilenames.map((filename) => [
              filename,
              current[filename] ?? defaultRightsId,
            ]),
          ),
        );
      }
      const firstGap = workspace.view.gaps[0]?.id ?? "";
      setCandidateGapId((value) => value || firstGap);
      setOpinionGapId((value) => value || firstGap);
      setContributionGapId((value) => value || firstGap);
      setSynthesisGapId((value) => value || firstGap);
      setNotice(message ?? "Saved locally.");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The local workbench could not be loaded.",
      );
      setNotice("Local workspace unavailable.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function runCommand(
    command: WorkbenchCommand,
    successMessage: string,
  ): Promise<boolean> {
    if (snapshot === null || busy) return false;
    setBusy(true);
    setError(null);
    try {
      setSnapshot(await executeCommand(command, snapshot.etag));
      setNotice(successMessage);
      return true;
    } catch (caught) {
      if (caught instanceof WorkbenchApiError && caught.status === 409) {
        await refresh("A newer revision was loaded; review before retrying.");
        return false;
      }
      setError(
        caught instanceof Error ? caught.message : "The change was not saved.",
      );
      setNotice("Change not saved.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function runScout(gapId: string): Promise<void> {
    if (snapshot === null || busy) return;
    setBusy(true);
    setError(null);
    try {
      setSnapshot(await scoutGap(gapId, snapshot.etag));
      setNotice("Scouting run recorded locally.");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The scouting request failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function runIntakeScan(): Promise<void> {
    if (
      snapshot === null ||
      intake === null ||
      busy ||
      !acknowledgeNoPhi ||
      !acknowledgeRights ||
      !acknowledgeLocalProcessing
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await scanIntake(
        snapshot.etag,
        intake.inboxFilenames.map((filename) => ({
          filename,
          rightsDecisionId: intakeAssignments[filename] ?? "",
        })),
        intakeScope,
      );
      setIntake(result.status);
      setNotice("Private inbox scan checkpointed.");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "The intake scan failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function runIntakeExtraction(): Promise<void> {
    if (busy || snapshot === null) return;
    setBusy(true);
    setError(null);
    try {
      const result = await extractIntake(snapshot.etag);
      setIntake(result.status);
      setNotice("Queued local extraction completed.");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The local extraction failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function runIntakeAudit(): Promise<void> {
    if (busy || snapshot === null) return;
    setBusy(true);
    setError(null);
    try {
      const status = await auditIntake(snapshot.etag);
      setIntake(status);
      setNotice(
        status.integrityAuditStatus === "passed"
          ? "Deep private-artifact integrity audit passed."
          : "Deep private-artifact integrity audit found issues.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The private-artifact integrity audit failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function runIntakeLockRecovery(): Promise<void> {
    if (
      busy ||
      snapshot === null ||
      intakeLockRecoveryReason.trim().length < 4
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const status = await recoverIntakeLock(
        snapshot.etag,
        intakeLockRecoveryReason.trim(),
      );
      setIntake(status);
      setIntakeLockRecoveryReason("");
      setNotice(
        "Abandoned private-intake lock archived with a recovery record.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The stale-lock recovery failed safely.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function runAuthoringSync(): Promise<void> {
    if (snapshot === null || busy) return;
    setBusy(true);
    setError(null);
    try {
      setSnapshot(await syncAuthoringContext(snapshot.etag));
      setAuthoringContext(await loadAuthoringContext());
      setNotice("Sanitized authoring references appended.");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The authoring-context sync failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  function resetGapForm(): void {
    setEditingGapId("");
    setGapTitle("");
    setGapQuestion("");
    setGapWhy("");
    setGapCriteria("");
    setGapStatus("open");
    setGapResolution("");
    setTargetKind("other");
    setTargetId("target.local.unassigned");
    setScoutMode("manual_only");
    setPreferredTypes(
      "clinical_guideline, systematic_review, journal_article",
    );
    setProvider("pubmed");
    setScoutQuery("");
    setRefreshDays("90");
  }

  function editGap(gap: GapViewDto): void {
    const strategy = gap.scoutPolicy.providerStrategies[0];
    const hasAutomatedProvider =
      strategy?.provider === "pubmed" || strategy?.provider === "crossref";
    setEditingGapId(gap.id);
    setGapTitle(gap.title);
    setGapQuestion(gap.clinicalQuestion);
    setGapWhy(gap.whyNeeded);
    setGapCriteria(gap.acceptanceCriteria.join("\n"));
    setGapStatus(gap.status);
    setGapResolution(gap.resolutionNote ?? "");
    setTargetKind(gap.targetContent[0]?.kind ?? "other");
    setTargetId(gap.targetContent[0]?.id ?? "target.local.unassigned");
    setScoutMode(
      gap.scoutPolicy.mode === "manual_only" || !hasAutomatedProvider
        ? "manual_only"
        : "metadata_search",
    );
    setPreferredTypes(gap.scoutPolicy.preferredSourceTypes.join(", "));
    setProvider(hasAutomatedProvider ? strategy.provider : "pubmed");
    setScoutQuery(hasAutomatedProvider ? strategy.query : "");
    setRefreshDays(String(gap.scoutPolicy.refreshIntervalDays ?? 90));
    document.getElementById("gap-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function prefillGapFromAuthoringTarget(
    target: SanitizedAuthoringTarget,
  ): void {
    const prefill = buildEvidenceGapPrefill(target);
    setEditingGapId("");
    setGapTitle(prefill.title);
    setGapQuestion(prefill.clinicalQuestion);
    setGapWhy(prefill.whyNeeded);
    setGapCriteria(prefill.acceptanceCriteria.join("\n"));
    setGapStatus("open");
    setGapResolution("");
    setTargetKind(prefill.targetKind);
    setTargetId(prefill.targetId);
    setScoutMode("metadata_search");
    setPreferredTypes(prefill.preferredSourceTypes.join(", "));
    setProvider(prefill.provider);
    setScoutQuery(prefill.query);
    setRefreshDays(String(prefill.refreshIntervalDays));
    document.getElementById("gap-form")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  async function submitGap(event: FormEvent): Promise<void> {
    event.preventDefault();
    const shared = {
      title: gapTitle,
      clinicalQuestion: gapQuestion,
      whyNeeded: gapWhy,
      acceptanceCriteria: splitLines(gapCriteria),
      targetKind: targetKind as WorkbenchCommand & never,
      targetId,
      scoutMode,
      preferredSourceTypes: splitLines(preferredTypes),
      provider: provider as WorkbenchCommand & never,
      query: scoutMode === "manual_only" ? "" : scoutQuery,
      refreshIntervalDays:
        scoutMode === "manual_only" ? null : Number(refreshDays),
    };
    const command: WorkbenchCommand = editingGapId
      ? ({
          type: "revise_gap",
          gapId: editingGapId,
          ...shared,
          status: gapStatus,
          resolutionNote: FINAL_GAP_STATUSES.includes(gapStatus)
            ? gapResolution
            : null,
          changeSummary: "Revise the evidence gap in the local workbench.",
        } as WorkbenchCommand)
      : ({ type: "create_gap", ...shared } as WorkbenchCommand);
    if (
      await runCommand(
        command,
        editingGapId ? "Gap revision appended." : "Evidence gap created.",
      )
    ) {
      resetGapForm();
    }
  }

  async function submitCandidate(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (
      await runCommand(
        {
          type: "capture_candidate",
          gapId: candidateGapId,
          title: candidateTitle,
          citation: candidateCitation,
          organization: candidateOrganization,
          sourceType:
            candidateSourceType as Extract<
              WorkbenchCommand,
              { type: "capture_candidate" }
            >["sourceType"],
        },
        "Unscreened candidate metadata captured.",
      )
    ) {
      setCandidateTitle("");
      setCandidateCitation("");
      setCandidateOrganization("");
    }
  }

  async function submitScreening(
    candidateId: string,
    gapId: string,
  ): Promise<void> {
    const state = screeningState[screeningKey(candidateId, gapId)] ?? {
      disposition: "exclude",
      sourceId: "",
      reason: "",
    };
    const candidate = view?.candidates.find((entry) => entry.id === candidateId);
    if (
      candidate === undefined ||
      !candidate.gapIds.includes(gapId)
    ) return;
    await runCommand(
      {
        type: "screen_candidate",
        candidateId,
        gapId,
        disposition:
          state.disposition === "unscreened" ? "exclude" : state.disposition,
        resolvedSourceId: ["include", "duplicate"].includes(state.disposition)
          ? state.sourceId || null
          : null,
        reason: state.reason,
      },
      "Screening decision appended.",
    );
  }

  async function submitRights(event: FormEvent): Promise<void> {
    event.preventDefault();
    const command: WorkbenchCommand = {
      type: "record_source_rights",
      sourceId: rightsSourceId || null,
      sourceLabel: rightsLabel,
      decisionStatus:
        rightsStatus as Extract<
          WorkbenchCommand,
          { type: "record_source_rights" }
        >["decisionStatus"],
      legalBasis:
        rightsBasis as Extract<
          WorkbenchCommand,
          { type: "record_source_rights" }
        >["legalBasis"],
      permissions: rightsPermissions,
      territories: splitLines(territories),
      licenseLabel: licenseLabel || null,
      licenseUrl: licenseUrl || null,
      termsUrl: termsUrl || null,
      attributionStatement: attribution || null,
      requiredNotices: splitLines(requiredNotices),
      nonCommercialOnly: nonCommercial,
      shareAlikeRequired: shareAlike,
      thirdPartyMaterialPolicy:
        thirdPartyPolicy as Extract<
          WorkbenchCommand,
          { type: "record_source_rights" }
        >["thirdPartyMaterialPolicy"],
      fairUseAssessment:
        rightsBasis === "fair_use" ? fairUseAssessment : null,
      permissionEvidenceReferenceIds: splitLines(
        permissionEvidenceReferenceIds,
      ),
      reviewBasis:
        reviewBasis as Extract<
          WorkbenchCommand,
          { type: "record_source_rights" }
        >["reviewBasis"],
      effectiveAt: new Date(effectiveAt).toISOString(),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      notes: rightsNotes,
    };
    if (await runCommand(command, "Rights decision appended.")) {
      setRightsSourceId("");
      setRightsLabel("");
      setRightsPermissions(EMPTY_PERMISSIONS);
      setLicenseLabel("");
      setLicenseUrl("");
      setTermsUrl("");
      setAttribution("");
      setRequiredNotices("");
      setPermissionEvidenceReferenceIds("");
      setFairUseAssessment(EMPTY_FAIR_USE_ASSESSMENT);
      setRightsNotes("");
    }
  }

  async function submitRelation(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (
      await runCommand(
        {
          type: "record_source_relation",
          fromSourceId: relationFrom,
          toSourceId: relationTo,
          relationType:
            relationType as Extract<
              WorkbenchCommand,
              { type: "record_source_relation" }
            >["relationType"],
          note: relationNote,
        },
        "Source relation recorded.",
      )
    ) {
      setRelationNote("");
    }
  }

  async function withdrawRelation(relationId: string): Promise<void> {
    const note = relationWithdrawalNotes[relationId]?.trim() ?? "";
    if (!note) {
      setError("A corrective-forward withdrawal note is required.");
      return;
    }
    if (
      await runCommand(
        {
          type: "withdraw_source_relation",
          relationId,
          note,
        },
        "Source relation withdrawn by a new immutable record.",
      )
    ) {
      setRelationWithdrawalNotes((current) => {
        const next = { ...current };
        delete next[relationId];
        return next;
      });
    }
  }

  async function submitOpinion(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (
      await runCommand(
        {
          type: "add_expert_opinion",
          gapId: opinionGapId,
          statement: opinionStatement,
          rationale: opinionRationale,
          clinicalScope: opinionScope,
          limitations: splitLines(opinionLimits),
        },
        "Proposed expert opinion appended.",
      )
    ) {
      setOpinionStatement("");
      setOpinionRationale("");
      setOpinionScope("");
      setOpinionLimits("");
    }
  }

  async function reviewOpinion(
    opinionId: string,
    disposition: "accepted" | "rejected",
  ): Promise<void> {
    await runCommand(
      {
        type: "review_expert_opinion",
        opinionId,
        disposition,
        reviewNote: reviewNotes[opinionId] ?? "",
      },
      `Expert opinion ${disposition}.`,
    );
  }

  async function submitCitation(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (
      await runCommand(
        {
          type: "register_citation",
          citationId,
          sourceId: citationSourceId,
          sourceSnapshotId: citationSnapshotId,
          verificationState: "unverified",
        },
        "External citation reference registered.",
      )
    ) {
      setCitationId("");
      setCitationSnapshotId("");
    }
  }

  async function submitContribution(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (
      await runCommand(
        {
          type: "propose_contribution",
          gapId: contributionGapId,
          sourceId: contributionSourceId,
          citationIds: splitLines(contributionCitationIds),
          role:
            contributionRole as Extract<
              WorkbenchCommand,
              { type: "propose_contribution" }
            >["role"],
          contributionTypes: splitLines(contributionTypes),
          statement: contributionStatement,
          applicabilityNote: contributionApplicability,
          sourceRole:
            contributionSourceRole as Extract<
              WorkbenchCommand,
              { type: "propose_contribution" }
            >["sourceRole"],
        },
        "Formal contribution proposed.",
      )
    ) {
      setContributionStatement("");
      setContributionApplicability("");
    }
  }

  async function reviewContribution(
    contributionId: string,
    disposition: "accepted" | "rejected",
  ): Promise<void> {
    await runCommand(
      { type: "review_contribution", contributionId, disposition },
      `Contribution ${disposition}.`,
    );
  }

  async function submitSynthesis(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (
      await runCommand(
        {
          type: "create_synthesis",
          gapId: synthesisGapId,
          supportingSummary,
          opposingOrQualifyingSummary: opposingSummary,
          proposedDirection,
          limitations: splitLines(synthesisLimits),
        },
        "Human synthesis proposal appended.",
      )
    ) {
      setSupportingSummary("");
      setOpposingSummary("");
      setProposedDirection("");
      setSynthesisLimits("");
    }
  }

  async function decideSynthesis(
    proposalId: string,
    disposition: "accept" | "reject",
  ): Promise<void> {
    await runCommand(
      {
        type: "decide_synthesis",
        proposalId,
        disposition,
        rationale: decisionNotes[proposalId] ?? "",
      },
      `Synthesis ${disposition === "accept" ? "accepted" : "rejected"}.`,
    );
  }

  async function submitHandoff(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (
      await runCommand(
        {
          type: "create_content_change",
          synthesisDecisionId: handoffDecisionId,
          targetKind:
            handoffTargetKind as Extract<
              WorkbenchCommand,
              { type: "create_content_change" }
            >["targetKind"],
          targetId: handoffTargetId,
          changeKind:
            handoffKind as Extract<
              WorkbenchCommand,
              { type: "create_content_change" }
            >["changeKind"],
          beforeSummary: handoffBefore,
          proposedSummary: handoffProposed,
          status:
            handoffStatus as Extract<
              WorkbenchCommand,
              { type: "create_content_change" }
            >["status"],
          crossTargetRationale: handoffCrossTargetRationale,
          crossTargetReviewConfirmed: handoffCrossTargetReviewed,
        },
        "Authoring handoff created; no approval or publication occurred.",
      )
    ) {
      setHandoffProposed("");
      setHandoffBefore("");
      setHandoffCrossTargetRationale("");
      setHandoffCrossTargetReviewed(false);
    }
  }

  if (view === null || snapshot === null) {
    return (
      <main className="loading-shell">
        <section className="loading-card" aria-live="polite">
          <span className="brand-mark">CC</span>
          <h1>Clinical Context Workbench</h1>
          <p>{error ?? notice}</p>
          {error ? (
            <button type="button" onClick={() => void refresh()}>
              Try again
            </button>
          ) : (
            <span className="loading-bar" />
          )}
        </section>
      </main>
    );
  }

  const counts: Record<QueueKey, number | null> = {
    overview: null,
    gaps: view.gaps.filter((gap) => !FINAL_GAP_STATUSES.includes(gap.status))
      .length,
    literature: view.candidates.reduce(
      (total, candidate) =>
        total +
        candidate.screenings.filter(
          (screening) => screening.disposition === "unscreened",
        ).length,
      0,
    ),
    rights: view.sourceRights.filter(
      (rights) =>
        rights.decisionStatus === "implicit_default_deny" ||
        rights.decisionStatus === "default_deny",
    ).length,
    opinions: view.expertOpinions.filter(
      (opinion) => opinion.reviewStatus === "proposed",
    ).length,
    contributions: view.contributions.filter(
      (contribution) => contribution.reviewStatus === "proposed",
    ).length,
    synthesis: view.syntheses.filter(
      (proposal) => proposal.disposition === "pending",
    ).length,
    intake:
      (intake?.inboxFilenames.length ?? 0) +
      (intake?.entries.filter((entry) =>
        ["queued", "extracting", "rights_blocked", "quarantined"].includes(
          entry.status,
        ),
      ).length ?? 0),
    audit: view.audit.length,
  };

  const gapOptions = view.gaps.map((gap) => (
    <option value={gap.id} key={gap.id}>
      {gap.title}
    </option>
  ));
  const sourceOptions = view.sourceRights.map((source) => (
    <option value={source.sourceId} key={source.sourceId}>
      {source.label}
    </option>
  ));

  const overview = (
    <>
      <QueueHeader
        eyebrow="Canonical research workspace"
        title="Known versus needed"
        description="Derived server-side from accepted contributions and accepted expert opinions. Candidate metadata is never promoted into Known."
      />
      <div className="metric-grid">
        <article className="metric-card metric-attention">
          <span>Active gaps</span>
          <strong>{counts.gaps}</strong>
          <small>Current append-only gap heads</small>
        </article>
        <article className="metric-card">
          <span>Unscreened</span>
          <strong>{counts.literature}</strong>
          <small>Metadata candidates awaiting humans</small>
        </article>
        <article className="metric-card">
          <span>Accepted contributions</span>
          <strong>
            {
              view.contributions.filter(
                (entry) => entry.reviewStatus === "accepted",
              ).length
            }
          </strong>
          <small>The only formal evidence eligible for Known</small>
        </article>
        <article className="metric-card">
          <span>Review queue</span>
          <strong>
            {(counts.opinions ?? 0) +
              (counts.contributions ?? 0) +
              (counts.synthesis ?? 0)}
          </strong>
          <small>Human decisions still required</small>
        </article>
      </div>
      <section className="panel brief-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Deterministic projection</p>
            <h3>Research brief</h3>
          </div>
          <span className="revision-label">
            revision {snapshot.revision.slice(0, 8)}
          </span>
        </div>
        <div className="brief-list">
          {snapshot.briefs.map((brief) => (
            <article className="brief-item" key={brief.evidenceGapId}>
              <header>
                <StatusPill value={brief.gapStatus} />
                <h4>{brief.title}</h4>
                <p>{brief.clinicalQuestion}</p>
              </header>
              <div className="brief-columns">
                <div>
                  <h5>Known</h5>
                  {brief.known.length === 0 ? (
                    <p className="muted">
                      No accepted formal contribution or accepted expert
                      opinion is current.
                    </p>
                  ) : (
                    <ul>
                      {brief.known.map((item) => (
                        <li key={item.id}>
                          <strong>{humanize(item.kind)}:</strong>{" "}
                          {item.statement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h5>Needed</h5>
                  <p>{brief.needed.whyNeeded}</p>
                  <ul>
                    {[...brief.needed.acceptanceCriteria, ...brief.needed.openWork].map(
                      (item) => (
                        <li key={item}>{item}</li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );

  const gaps = (
    <>
      <QueueHeader
        eyebrow="Queue 01"
        title="Evidence gaps"
        description="Every edit appends a linked revision. Scouting policy, target reference, query, provider, and cadence remain explicit."
      />
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Deterministic suggestions</p>
            <h3>Authoring targets without a research gap</h3>
          </div>
          <span className="revision-label">
            {uncoveredAuthoringTargets.length} uncovered
          </span>
        </div>
        <p className="microcopy">
          Suggestions use only the validated local authoring target index.
          They do not assert that evidence is absent. Prefilling creates no
          record until you review and submit the Evidence Gap.
        </p>
        {authoringContext === null ? (
          <EmptyState>
            Load a validated local authoring workspace to derive target-level
            suggestions without typing stable IDs.
          </EmptyState>
        ) : uncoveredAuthoringTargets.length === 0 ? (
          <EmptyState>
            Every synced authoring target is linked to at least one Evidence
            Gap.
          </EmptyState>
        ) : (
          <div className="queue-list">
            {uncoveredAuthoringTargets.slice(0, 30).map((target) => (
              <article className="queue-card compact-card" key={`${target.kind}:${target.id}`}>
                <div>
                  <StatusPill value={target.kind} />
                  <h4>{target.label}</h4>
                  <p className="microcopy">{target.id}</p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => prefillGapFromAuthoringTarget(target)}
                >
                  Prefill evidence gap
                </button>
              </article>
            ))}
            {uncoveredAuthoringTargets.length > 30 ? (
              <p className="microcopy">
                Showing the first 30 of {uncoveredAuthoringTargets.length}.
                Add a gap or narrow the authoring workspace before expanding
                the queue.
              </p>
            ) : null}
          </div>
        )}
      </section>
      <section className="two-column">
        <form className="panel editor-panel" id="gap-form" onSubmit={(event) => void submitGap(event)}>
          <div className="panel-heading">
            <h3>{editingGapId ? "Append gap revision" : "Create gap"}</h3>
          </div>
          <Field label="Title"><input required value={gapTitle} onChange={(e) => setGapTitle(e.target.value)} /></Field>
          <Field
            label="Clinical question"
            hint="Keep this population-level and de-identified. It stays local; only the separate literal search query is sent to a metadata provider."
          >
            <textarea required rows={3} value={gapQuestion} onChange={(e) => setGapQuestion(e.target.value)} />
          </Field>
          <Field label="Why needed"><textarea required rows={3} value={gapWhy} onChange={(e) => setGapWhy(e.target.value)} /></Field>
          <Field label="Acceptance criteria" hint="One per line"><textarea required rows={3} value={gapCriteria} onChange={(e) => setGapCriteria(e.target.value)} /></Field>
          <div className="form-grid">
            <Field label="Target kind">
              <select value={targetKind} onChange={(e) => setTargetKind(e.target.value)}>
                <option value="other">Other</option><option value="clinical_topic_revision">Topic revision</option><option value="structured_fact">Structured fact</option><option value="tested_concept">Tested concept</option>
              </select>
            </Field>
            <Field label="Target stable ID"><input required value={targetId} onChange={(e) => setTargetId(e.target.value)} /></Field>
          </div>
          <Field label="Preferred source types" hint="Comma-separated canonical source types"><input required value={preferredTypes} onChange={(e) => setPreferredTypes(e.target.value)} /></Field>
          <div className="form-grid">
            <Field label="Scout mode">
              <select value={scoutMode} onChange={(e) => setScoutMode(e.target.value as "manual_only" | "metadata_search")}>
                <option value="manual_only">Manual only</option><option value="metadata_search">Metadata search</option>
              </select>
            </Field>
            <Field
              label="Automated metadata provider"
              hint="This beta automates PubMed and Crossref only. Registry and other-source results enter through manual candidate capture."
            >
              <select disabled={scoutMode === "manual_only"} value={provider} onChange={(e) => setProvider(e.target.value)}>
                <option value="pubmed">PubMed</option><option value="crossref">Crossref</option>
              </select>
            </Field>
          </div>
          {scoutMode === "metadata_search" ? (
            <>
              <Field
                label="Literal search query"
                hint="Use a general clinical question only. Never enter patient identifiers, question-bank text, authenticated URLs, credentials, or secrets."
              >
                <textarea
                  required
                  value={scoutQuery}
                  onChange={(e) => setScoutQuery(e.target.value)}
                />
              </Field>
              <Field label="Refresh cadence (days)"><input required type="number" min="1" max="3650" value={refreshDays} onChange={(e) => setRefreshDays(e.target.value)} /></Field>
            </>
          ) : <p className="microcopy">Safe default: no provider, query, cadence, or automatic request.</p>}
          {editingGapId ? (
            <>
              <Field label="Status">
                <select value={gapStatus} onChange={(e) => setGapStatus(e.target.value as GapStatus)}>
                  {["open","scouting","candidates_found","awaiting_review","resolved","deferred","withdrawn"].map((status) => <option value={status} key={status}>{humanize(status)}</option>)}
                </select>
              </Field>
              {FINAL_GAP_STATUSES.includes(gapStatus) ? <Field label="Resolution note"><textarea required value={gapResolution} onChange={(e) => setGapResolution(e.target.value)} /></Field> : null}
            </>
          ) : null}
          <div className="form-actions">
            <button className="primary-button" disabled={busy} type="submit">{editingGapId ? "Append revision" : "Create gap"}</button>
            {editingGapId ? <button type="button" onClick={resetGapForm}>Cancel</button> : null}
          </div>
        </form>
        <div className="queue-list">
          {view.gaps.map((gap) => {
            const brief = snapshot.briefs.find((entry) => entry.evidenceGapId === gap.id);
            const due = brief?.searchStatus.nextRefreshDueAt;
            const isDue = due !== null && due !== undefined && Date.parse(due) <= Date.now();
            return (
              <article className="panel queue-card" key={gap.id}>
                <div className="card-topline"><StatusPill value={gap.status} /><StatusPill value={gap.scoutPolicy.mode} /><span className="revision-label">rev {gap.revisionCount}</span></div>
                <h3>{gap.title}</h3><p>{gap.clinicalQuestion}</p>
                <blockquote><strong>Needed:</strong> {gap.whyNeeded}</blockquote>
                <p className="microcopy">Target {gap.targetContent.map((target) => `${target.kind}:${target.id}`).join(", ")}</p>
                <div className="card-actions">
                  <button type="button" onClick={() => editGap(gap)}>Revise</button>
                  {gap.scoutPolicy.mode !== "manual_only" ? (
                    <button type="button" disabled={busy || health?.scouting.enabled !== true} onClick={() => void runScout(gap.id)}>
                      {isDue ? "Scout due" : "Scout gap"}
                    </button>
                  ) : null}
                </div>
                {gap.scoutPolicy.mode !== "manual_only" && health?.scouting.enabled !== true ? <p className="microcopy">Scouting policy is saved, but no trusted coordinator is configured.</p> : null}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );

  const literature = (
    <>
      <QueueHeader eyebrow="Queue 02" title="Literature candidates" description="Candidates are metadata leads, never Known. A source is registered separately, then a human records one of every canonical screening dispositions." />
      <div className="provider-notice">
        Provider metadata may be incomplete and does not imply endorsement or reuse permission. Verify each source and review the{" "}
        <a href="https://pubmed.ncbi.nlm.nih.gov/disclaimer/" target="_blank" rel="noreferrer">PubMed disclaimer and copyright guidance</a>.
      </div>
      <section className="two-column">
        <form className="panel editor-panel" onSubmit={(event) => void submitCandidate(event)}>
          <h3>Capture unscreened metadata</h3>
          <Field label="Gap"><select required value={candidateGapId} onChange={(e) => setCandidateGapId(e.target.value)}>{gapOptions}</select></Field>
          <Field label="Title"><input required value={candidateTitle} onChange={(e) => setCandidateTitle(e.target.value)} /></Field>
          <Field
            label="Citation metadata"
            hint="Bibliographic metadata only. Do not paste an abstract, textbook passage, question-bank stem, explanation, PHI, credentials, or authenticated URL."
          >
            <textarea required value={candidateCitation} onChange={(e) => setCandidateCitation(e.target.value)} />
          </Field>
          <Field label="Authoring organization"><input required value={candidateOrganization} onChange={(e) => setCandidateOrganization(e.target.value)} /></Field>
          <Field label="Source type"><select value={candidateSourceType} onChange={(e) => setCandidateSourceType(e.target.value)}><option value="journal_article">Journal article</option><option value="systematic_review">Systematic review</option><option value="meta_analysis">Meta-analysis</option><option value="clinical_guideline">Clinical guideline</option><option value="professional_guidance">Professional guidance</option><option value="other">Other</option></select></Field>
          <button className="primary-button" disabled={busy || view.gaps.length === 0} type="submit">Capture candidate</button>
        </form>
        <div className="queue-list">
          {view.candidates.length === 0 ? (
            <EmptyState>No candidates captured.</EmptyState>
          ) : view.candidates.map((candidate) => (
            <article className="panel queue-card" key={candidate.id}>
              <div className="card-topline">
                <StatusPill value={candidate.sourceType} />
                <span className="revision-label">metadata only</span>
              </div>
              <h3>{candidate.title}</h3>
              <p>{candidate.citation}</p>
              <p className="microcopy">
                {candidate.organization} · observed for {candidate.gapIds.length} evidence gap{candidate.gapIds.length === 1 ? "" : "s"}
              </p>
              {candidate.screenings.map((screening) => {
                const key = screeningKey(candidate.id, screening.gapId);
                const state = screeningState[key] ?? {
                  disposition: "exclude" as ScreeningDisposition,
                  sourceId: "",
                  reason: "",
                };
                return (
                  <section className="candidate-gap-review" key={key}>
                    <div className="card-topline">
                      <strong>{gapById.get(screening.gapId)?.title ?? screening.gapId}</strong>
                      <StatusPill value={screening.disposition} />
                    </div>
                    {screening.disposition === "unscreened" ? (
                      <>
                        <Field label="Disposition">
                          <select
                            value={state.disposition}
                            onChange={(event) =>
                              setScreeningState((current) => ({
                                ...current,
                                [key]: {
                                  ...state,
                                  disposition: event.target.value as ScreeningDisposition,
                                },
                              }))
                            }
                          >
                            <option value="include">Include</option>
                            <option value="exclude">Exclude</option>
                            <option value="duplicate">Duplicate</option>
                            <option value="awaiting_full_text">Awaiting full text</option>
                            <option value="rights_blocked">Rights blocked</option>
                          </select>
                        </Field>
                        {["include", "duplicate"].includes(state.disposition) ? (
                          <Field label="Resolved Source">
                            <select
                              required
                              value={state.sourceId}
                              onChange={(event) =>
                                setScreeningState((current) => ({
                                  ...current,
                                  [key]: { ...state, sourceId: event.target.value },
                                }))
                              }
                            >
                              <option value="">Select registered Source</option>
                              {sourceOptions}
                            </select>
                          </Field>
                        ) : null}
                        <Field label="Human screening reason">
                          <textarea
                            required
                            value={state.reason}
                            onChange={(event) =>
                              setScreeningState((current) => ({
                                ...current,
                                [key]: { ...state, reason: event.target.value },
                              }))
                            }
                          />
                        </Field>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            void submitScreening(candidate.id, screening.gapId)
                          }
                        >
                          Record decision for this gap
                        </button>
                      </>
                    ) : (
                      <blockquote>{screening.reason}</blockquote>
                    )}
                  </section>
                );
              })}
            </article>
          ))}
        </div>
      </section>
    </>
  );

  const rights = (
    <>
      <QueueHeader eyebrow="Queue 03" title="Rights, Sources & currentness" description="Register or supersede a Source decision with operation-specific grants. Every permission defaults false; external AI, public reuse, runtime, and commercial rights are never inferred." />
      <section className="two-column">
        <div>
          <form className="panel editor-panel nonsticky" onSubmit={(event) => void submitRights(event)}>
            <h3>Append rights decision</h3>
            <Field label="Source"><select value={rightsSourceId} onChange={(e) => { setRightsSourceId(e.target.value); const selected=view.sourceRights.find((entry)=>entry.sourceId===e.target.value); if(selected) setRightsLabel(selected.label); }}><option value="">Register new Source</option>{sourceOptions}</select></Field>
            <Field label="Source label"><input required value={rightsLabel} onChange={(e) => setRightsLabel(e.target.value)} /></Field>
            <div className="form-grid"><Field label="Decision"><select value={rightsStatus} onChange={(e) => setRightsStatus(e.target.value)}><option value="default_deny">Default deny</option><option value="metadata_only">Metadata only</option><option value="permitted_with_conditions">Permitted with conditions</option><option value="blocked">Blocked</option><option value="revoked">Revoked</option></select></Field><Field label="Legal basis"><select value={rightsBasis} onChange={(e) => setRightsBasis(e.target.value)}><option value="unreviewed">Unreviewed</option><option value="metadata_only">Metadata only</option><option value="owner_authored">Owner authored</option><option value="public_domain">Public domain</option><option value="open_license">Open license</option><option value="written_permission">Written permission</option><option value="fair_use">Fair use assessment</option></select></Field></div>
            <div className="permission-checkboxes">
              {(Object.keys(PERMISSION_LABELS) as (keyof RightsPermissionsDto)[]).map((permission) => <label className="check-field" key={permission}><input type="checkbox" checked={rightsPermissions[permission]} onChange={(e) => setRightsPermissions((current) => ({...current,[permission]:e.target.checked}))}/><span>{PERMISSION_LABELS[permission]}</span></label>)}
            </div>
            <Field label="Territories" hint="One per line"><textarea required value={territories} onChange={(e) => setTerritories(e.target.value)} /></Field>
            <div className="form-grid">
              <Field label="License label" hint="Required for open-license decisions">
                <input required={rightsBasis === "open_license"} value={licenseLabel} onChange={(e) => setLicenseLabel(e.target.value)} />
              </Field>
              <Field label="License URL" hint="Required for open-license decisions">
                <input required={rightsBasis === "open_license"} type="url" value={licenseUrl} onChange={(e) => setLicenseUrl(e.target.value)} />
              </Field>
            </div>
            <Field label="Terms URL" hint="Optional public terms or permission conditions">
              <input type="url" value={termsUrl} onChange={(e) => setTermsUrl(e.target.value)} />
            </Field>
            <Field label="Attribution statement" hint="Required for open-license decisions">
              <textarea required={rightsBasis === "open_license"} value={attribution} onChange={(e) => setAttribution(e.target.value)} />
            </Field>
            <Field label="Required notices" hint="One stable notice per line">
              <textarea value={requiredNotices} onChange={(e) => setRequiredNotices(e.target.value)} />
            </Field>
            <Field
              label="Permission evidence reference IDs"
              hint="One lowercase stable ID per line. Required for written permission; store evidence privately and reference it here."
            >
              <textarea
                required={rightsBasis === "written_permission"}
                value={permissionEvidenceReferenceIds}
                onChange={(e) => setPermissionEvidenceReferenceIds(e.target.value)}
              />
            </Field>
            {rightsBasis === "fair_use" ? (
              <fieldset className="rights-assessment">
                <legend>Human fair-use assessment</legend>
                <p className="microcopy">
                  Record the reviewer&apos;s narrow, use-specific four-factor analysis. The workbench does not make or infer a legal conclusion.
                </p>
                <Field label="Precise proposed use">
                  <textarea required value={fairUseAssessment.preciseUse} onChange={(e) => setFairUseAssessment((current) => ({ ...current, preciseUse: e.target.value }))} />
                </Field>
                <Field label="Purpose and character">
                  <textarea required value={fairUseAssessment.purposeAndCharacter} onChange={(e) => setFairUseAssessment((current) => ({ ...current, purposeAndCharacter: e.target.value }))} />
                </Field>
                <Field label="Nature of the work">
                  <textarea required value={fairUseAssessment.natureOfWork} onChange={(e) => setFairUseAssessment((current) => ({ ...current, natureOfWork: e.target.value }))} />
                </Field>
                <Field label="Amount and substantiality">
                  <textarea required value={fairUseAssessment.amountAndSubstantiality} onChange={(e) => setFairUseAssessment((current) => ({ ...current, amountAndSubstantiality: e.target.value }))} />
                </Field>
                <Field label="Market effect">
                  <textarea required value={fairUseAssessment.marketEffect} onChange={(e) => setFairUseAssessment((current) => ({ ...current, marketEffect: e.target.value }))} />
                </Field>
                <Field label="Reviewer conclusion">
                  <select value={fairUseAssessment.conclusion} onChange={(e) => setFairUseAssessment((current) => ({ ...current, conclusion: e.target.value as FairUseAssessmentDto["conclusion"] }))}>
                    <option value="seek_legal_review">Seek legal review</option>
                    <option value="do_not_proceed">Do not proceed</option>
                    <option value="proceed_narrowly">Proceed narrowly</option>
                  </select>
                </Field>
              </fieldset>
            ) : null}
            <div className="form-grid"><Field label="Effective at"><input type="datetime-local" required value={effectiveAt} onChange={(e) => setEffectiveAt(e.target.value)} /></Field><Field label="Expires at"><input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} /></Field></div>
            <div className="form-grid"><Field label="Review basis"><select value={reviewBasis} onChange={(e) => setReviewBasis(e.target.value)}><option value="engineering_risk_assessment">Engineering risk assessment</option><option value="owner_attestation">Owner attestation</option><option value="legal_counsel">Legal counsel</option></select></Field><Field label="Third-party material"><select value={thirdPartyPolicy} onChange={(e) => setThirdPartyPolicy(e.target.value)}><option value="excluded">Excluded</option><option value="item_level_review_required">Item review required</option><option value="included_by_permission">Included by permission</option><option value="not_applicable">Not applicable</option></select></Field></div>
            <label className="check-field"><input type="checkbox" checked={nonCommercial} onChange={(e)=>setNonCommercial(e.target.checked)}/><span>Non-commercial only</span></label><label className="check-field"><input type="checkbox" checked={shareAlike} onChange={(e)=>setShareAlike(e.target.checked)}/><span>Share-alike required</span></label>
            <Field label="Rationale and conditions"><textarea required rows={4} value={rightsNotes} onChange={(e) => setRightsNotes(e.target.value)} /></Field>
            <button className="primary-button" disabled={busy} type="submit">Append rights decision</button>
          </form>
          <form className="panel editor-panel nonsticky relation-form" onSubmit={(event) => void submitRelation(event)}>
            <h3>Record Source relation</h3>
            <p className="microcopy">Direction matters: put the newer correcting, retracting, superseding, or updating Source first, then the affected earlier Source.</p>
            <Field label="From Source"><select required value={relationFrom} onChange={(e)=>setRelationFrom(e.target.value)}><option value="">Select</option>{sourceOptions}</select></Field>
            <Field label="Relation"><select value={relationType} onChange={(e)=>setRelationType(e.target.value)}>{["corrects","retracts","supersedes","updates","companion_to","executive_summary_of","translation_of"].map((type)=><option value={type} key={type}>{humanize(type)}</option>)}</select></Field>
            <Field label="To Source"><select required value={relationTo} onChange={(e)=>setRelationTo(e.target.value)}><option value="">Select</option>{sourceOptions}</select></Field>
            <Field label="Note"><textarea required value={relationNote} onChange={(e)=>setRelationNote(e.target.value)}/></Field>
            <button disabled={busy || view.sourceRights.length < 2} type="submit">Record relation</button>
          </form>
        </div>
        <div className="queue-list">
          {view.sourceRights.length === 0 ? (
            <EmptyState>No Sources registered.</EmptyState>
          ) : (
            view.sourceRights.map((source) => (
              <article className="panel queue-card" key={source.sourceId}>
                <div className="card-topline">
                  <StatusPill value={source.decisionStatus} />
                  {source.legalBasis ? (
                    <StatusPill value={source.legalBasis} />
                  ) : null}
                  <span className="revision-label">{source.sourceId}</span>
                </div>
                <h3>{source.label}</h3>
                <div className="permission-grid">
                  {(Object.keys(source.permissions) as (keyof RightsPermissionsDto)[]).map((permission) => (
                    <span className={source.permissions[permission] ? "yes" : "no"} key={permission}>
                      {PERMISSION_LABELS[permission]}
                    </span>
                  ))}
                </div>
                <blockquote>{source.notes}</blockquote>
                {source.decisionId ? (
                  <details>
                    <summary>Review record and conditions</summary>
                    <p className="microcopy">
                      Reviewed by {source.reviewedBy} using {humanize(source.reviewBasis ?? "unrecorded")} · territories: {source.territories.join("; ")}
                    </p>
                    {source.termsUrl ? <p>Terms reference: <code>{source.termsUrl}</code></p> : null}
                    {source.licenseLabel ? <p>License: {source.licenseLabel}</p> : null}
                    {source.attributionStatement ? <p>Attribution: {source.attributionStatement}</p> : null}
                    {source.requiredNotices.length > 0 ? <p>Required notices: {source.requiredNotices.join("; ")}</p> : null}
                    {source.permissionEvidenceReferenceIds.length > 0 ? (
                      <p>Permission evidence references: {source.permissionEvidenceReferenceIds.join(", ")}</p>
                    ) : null}
                    {source.fairUseAssessment ? (
                      <div>
                        <p><strong>Human conclusion:</strong> {humanize(source.fairUseAssessment.conclusion)}</p>
                        <p><strong>Precise use:</strong> {source.fairUseAssessment.preciseUse}</p>
                        <p><strong>Purpose and character:</strong> {source.fairUseAssessment.purposeAndCharacter}</p>
                        <p><strong>Nature of work:</strong> {source.fairUseAssessment.natureOfWork}</p>
                        <p><strong>Amount and substantiality:</strong> {source.fairUseAssessment.amountAndSubstantiality}</p>
                        <p><strong>Market effect:</strong> {source.fairUseAssessment.marketEffect}</p>
                      </div>
                    ) : null}
                  </details>
                ) : null}
                <p className="microcopy">
                  Effective {formatDate(source.effectiveAt)} · reviewed {formatDate(source.reviewedAt)}
                </p>
                <button type="button" onClick={() => { setRightsSourceId(source.sourceId); setRightsLabel(source.label); setRightsPermissions(source.permissions); document.querySelector(".editor-panel")?.scrollIntoView({ behavior: "smooth" }); }}>
                  Supersede
                </button>
              </article>
            ))
          )}
          {view.sourceRelations.map((relation) => (
            <article className="panel queue-card" key={relation.id}>
              <div className="card-topline">
                <StatusPill value={relation.relationType} />
                <StatusPill value={relation.relationStatus} />
              </div>
              <p>
                {relation.fromSourceId}{" "}
                <strong>{humanize(relation.relationType)}</strong>{" "}
                {relation.toSourceId}
              </p>
              <blockquote>{relation.note}</blockquote>
              {relation.relationStatus === "active" ? (
                <>
                  <Field label="Corrective-forward withdrawal note">
                    <textarea
                      required
                      value={relationWithdrawalNotes[relation.id] ?? ""}
                      onChange={(event) =>
                        setRelationWithdrawalNotes((current) => ({
                          ...current,
                          [relation.id]: event.target.value,
                        }))
                      }
                    />
                  </Field>
                  <button
                    className="danger-button"
                    type="button"
                    disabled={
                      busy ||
                      !(relationWithdrawalNotes[relation.id]?.trim())
                    }
                    onClick={() => void withdrawRelation(relation.id)}
                  >
                    Withdraw relation
                  </button>
                </>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </>
  );

  const opinions = (
    <>
      <QueueHeader eyebrow="Queue 04" title="Expert opinions" description="Opinion remains a distinct authority. Only an owner or clinical reviewer may accept it into Known; other roles may propose opinions without promoting them as evidence." />
      <section className="two-column">
        <form className="panel editor-panel" onSubmit={(event)=>void submitOpinion(event)}><h3>Propose opinion</h3><Field label="Gap"><select required value={opinionGapId} onChange={(e)=>setOpinionGapId(e.target.value)}>{gapOptions}</select></Field><Field label="Statement"><textarea required value={opinionStatement} onChange={(e)=>setOpinionStatement(e.target.value)}/></Field><Field label="Rationale"><textarea required value={opinionRationale} onChange={(e)=>setOpinionRationale(e.target.value)}/></Field><Field label="Clinical scope"><textarea required value={opinionScope} onChange={(e)=>setOpinionScope(e.target.value)}/></Field><Field label="Limitations" hint="One per line"><textarea required value={opinionLimits} onChange={(e)=>setOpinionLimits(e.target.value)}/></Field><button className="primary-button" disabled={busy} type="submit">Propose opinion</button></form>
        <div className="queue-list">{view.expertOpinions.length===0?<EmptyState>No opinions recorded.</EmptyState>:view.expertOpinions.map((opinion)=><article className="panel queue-card" key={opinion.id}><div className="card-topline"><StatusPill value={opinion.reviewStatus}/><span className="revision-label">rev {opinion.revisionCount}</span></div><h3>{opinion.statement}</h3><p>{opinion.rationale}</p><blockquote><strong>Scope:</strong> {opinion.clinicalScope}<br/><strong>Limits:</strong> {opinion.limitations.join("; ")}</blockquote>{opinion.reviewStatus==="proposed"?<><Field label="Review note"><textarea value={reviewNotes[opinion.id]??""} onChange={(e)=>setReviewNotes((current)=>({...current,[opinion.id]:e.target.value}))}/></Field>{health?.reviewerCapabilities.canAcceptExpertOpinion !== true?<p className="microcopy">Your current reviewer role cannot accept this opinion into Known; an owner or clinical reviewer must perform that action.</p>:null}<div className="card-actions"><button className="positive-button" disabled={busy || health?.reviewerCapabilities.canAcceptExpertOpinion !== true} type="button" onClick={()=>void reviewOpinion(opinion.id,"accepted")}>Accept</button><button className="danger-button" disabled={busy} type="button" onClick={()=>void reviewOpinion(opinion.id,"rejected")}>Reject</button></div></>:null}</article>)}</div>
      </section>
    </>
  );

  const contributions = (
    <>
      <QueueHeader eyebrow="Queue 05" title="Evidence contributions" description="Formal contributions require a registered Source, citation references, and rights for derived clinical content. Only current accepted contributions enter Known." />
      <section className="two-column">
        <div>
          <form className="panel editor-panel nonsticky" onSubmit={(event)=>void submitCitation(event)}><h3>Register unverified citation</h3><p className="microcopy">Manual browser entry cannot attest that a snapshot or locator was human verified. Verified citations enter only through the validated authoring-context bridge.</p><Field label="Citation stable ID"><input required value={citationId} onChange={(e)=>setCitationId(e.target.value)}/></Field><Field label="Source"><select required value={citationSourceId} onChange={(e)=>setCitationSourceId(e.target.value)}><option value="">Select</option>{sourceOptions}</select></Field><Field label="External snapshot stable ID"><input required value={citationSnapshotId} onChange={(e)=>setCitationSnapshotId(e.target.value)}/></Field><button disabled={busy} type="submit">Register unverified reference</button></form>
          <form className="panel editor-panel nonsticky relation-form" onSubmit={(event)=>void submitContribution(event)}><h3>Propose formal contribution</h3><Field label="Gap"><select required value={contributionGapId} onChange={(e)=>setContributionGapId(e.target.value)}>{gapOptions}</select></Field><Field label="Source"><select required value={contributionSourceId} onChange={(e)=>setContributionSourceId(e.target.value)}><option value="">Select</option>{sourceOptions}</select></Field><Field label="Citation IDs" hint="Comma-separated; acceptance requires human-verified references"><input required value={contributionCitationIds} onChange={(e)=>setContributionCitationIds(e.target.value)}/></Field><div className="form-grid"><Field label="Role"><select value={contributionRole} onChange={(e)=>setContributionRole(e.target.value)}><option value="supports">Supports</option><option value="challenges">Challenges</option><option value="qualifies">Qualifies</option><option value="context">Context</option></select></Field><Field label="Source role"><select value={contributionSourceRole} onChange={(e)=>setContributionSourceRole(e.target.value)}><option value="primary_study">Primary study</option><option value="evidence_synthesis">Evidence synthesis</option><option value="guideline">Guideline</option><option value="regulatory">Regulatory</option><option value="classification">Classification</option><option value="aggregator">Aggregator</option></select></Field></div><Field label="Contribution types" hint="Comma-separated"><input required value={contributionTypes} onChange={(e)=>setContributionTypes(e.target.value)}/></Field><Field label="Statement"><textarea required value={contributionStatement} onChange={(e)=>setContributionStatement(e.target.value)}/></Field><Field label="Applicability"><textarea required value={contributionApplicability} onChange={(e)=>setContributionApplicability(e.target.value)}/></Field><button className="primary-button" disabled={busy} type="submit">Propose contribution</button></form>
        </div>
        <div className="queue-list">
          <article className="panel queue-card"><h3>Citation reference index</h3>{view.citations.length===0?<p className="muted">No external citation references.</p>:<ul>{view.citations.map((citation)=><li key={citation.id}><code>{citation.id}</code> · {citation.verificationState}</li>)}</ul>}</article>
          {view.contributions.length===0?<EmptyState>No contributions recorded.</EmptyState>:view.contributions.map((entry)=><article className="panel queue-card" key={entry.id}><div className="card-topline"><StatusPill value={entry.authority}/><StatusPill value={entry.role}/><StatusPill value={entry.reviewStatus}/></div><h3>{entry.statement}</h3><p>{entry.applicabilityNote}</p><p className="microcopy">{entry.sourceRole} · {entry.citationIds.length} citation(s)</p>{entry.reviewStatus==="proposed"?<div className="card-actions"><button className="positive-button" disabled={busy} type="button" onClick={()=>void reviewContribution(entry.id,"accepted")}>Accept</button><button className="danger-button" disabled={busy} type="button" onClick={()=>void reviewContribution(entry.id,"rejected")}>Reject</button></div>:null}</article>)}
        </div>
      </section>
    </>
  );

  const synthesis = (
    <>
      <QueueHeader eyebrow="Queue 06" title="Synthesis review & authoring handoff" description="Human proposals use current accepted contributions. Decisions confer no clinical approval. A separate Content Change Proposal is only a handoff to authoring." />
      <section className="two-column">
        <div>
          <form className="panel editor-panel nonsticky" onSubmit={(event)=>void submitSynthesis(event)}><h3>Create human synthesis</h3><Field label="Gap"><select required value={synthesisGapId} onChange={(e)=>setSynthesisGapId(e.target.value)}>{gapOptions}</select></Field><Field label="Supporting summary"><textarea required value={supportingSummary} onChange={(e)=>setSupportingSummary(e.target.value)}/></Field><Field label="Opposing or qualifying summary"><textarea required value={opposingSummary} onChange={(e)=>setOpposingSummary(e.target.value)}/></Field><Field label="Proposed direction"><textarea required value={proposedDirection} onChange={(e)=>setProposedDirection(e.target.value)}/></Field><Field label="Limitations" hint="One per line"><textarea required value={synthesisLimits} onChange={(e)=>setSynthesisLimits(e.target.value)}/></Field><button className="primary-button" disabled={busy} type="submit">Queue proposal</button></form>
          <form className="panel editor-panel nonsticky relation-form" onSubmit={(event)=>void submitHandoff(event)}><h3>Create authoring handoff</h3><p className="microcopy">This does not approve or publish clinical content. The target should normally match the selected synthesis Gap.</p><Field label="Accepted synthesis decision"><select required value={handoffDecisionId} onChange={(e)=>setHandoffDecisionId(e.target.value)}><option value="">Select</option>{view.syntheses.filter((entry)=>entry.decisionId!==null&&["accept","narrow"].includes(entry.disposition)).map((entry)=><option key={entry.decisionId} value={entry.decisionId!}>{entry.focusedQuestion}</option>)}</select></Field><div className="form-grid"><Field label="Target kind"><select value={handoffTargetKind} onChange={(e)=>setHandoffTargetKind(e.target.value)}><option value="other">Other</option><option value="clinical_topic_revision">Topic revision</option><option value="structured_fact">Structured fact</option><option value="tested_concept">Tested concept</option></select></Field><Field label="Target ID"><input required value={handoffTargetId} onChange={(e)=>setHandoffTargetId(e.target.value)}/></Field></div><div className="form-grid"><Field label="Change kind"><select value={handoffKind} onChange={(e)=>setHandoffKind(e.target.value)}><option value="add">Add</option><option value="modify">Modify</option><option value="withdraw">Withdraw</option><option value="no_change">No change</option></select></Field><Field label="Handoff status"><select value={handoffStatus} onChange={(e)=>setHandoffStatus(e.target.value)}><option value="draft">Draft</option><option value="ready_for_authoring">Ready for authoring</option></select></Field></div><Field label="Before summary"><textarea value={handoffBefore} onChange={(e)=>setHandoffBefore(e.target.value)}/></Field><Field label="Proposed summary"><textarea required value={handoffProposed} onChange={(e)=>setHandoffProposed(e.target.value)}/></Field><Field label="Cross-target rationale" hint="Leave blank when the target is declared by the synthesis Gap"><textarea value={handoffCrossTargetRationale} onChange={(e)=>setHandoffCrossTargetRationale(e.target.value)}/></Field><label className="check-field"><input type="checkbox" checked={handoffCrossTargetReviewed} onChange={(e)=>setHandoffCrossTargetReviewed(e.target.checked)}/><span>I explicitly reviewed and approve this cross-target handoff rationale.</span></label><button disabled={busy} type="submit">Create handoff</button></form>
        </div>
        <div className="queue-list">
          {view.syntheses.length===0?<EmptyState>No synthesis proposals.</EmptyState>:view.syntheses.map((entry)=><article className="panel queue-card" key={entry.id}><div className="card-topline"><StatusPill value={entry.disposition}/><span className="revision-label">{entry.contributionCount} contributions · {entry.opinionCount} opinions</span></div><h3>{entry.focusedQuestion}</h3><p><strong>Support:</strong> {entry.supportingSummary}</p><p><strong>Qualification:</strong> {entry.opposingOrQualifyingSummary}</p><blockquote>{entry.proposedDirection}</blockquote>{entry.disposition==="pending"?<><Field label="Decision rationale"><textarea value={decisionNotes[entry.id]??""} onChange={(e)=>setDecisionNotes((current)=>({...current,[entry.id]:e.target.value}))}/></Field><div className="card-actions"><button className="positive-button" disabled={busy} type="button" onClick={()=>void decideSynthesis(entry.id,"accept")}>Accept</button><button className="danger-button" disabled={busy} type="button" onClick={()=>void decideSynthesis(entry.id,"reject")}>Reject</button></div></>:<p className="microcopy">Decision: {entry.decisionRationale}</p>}</article>)}
          {view.contentChangeProposals.map((entry)=><article className="panel queue-card" key={entry.id}><div className="card-topline"><StatusPill value={entry.status}/><StatusPill value={entry.changeKind}/></div><h3>Authoring handoff</h3><p>{entry.proposedSummary}</p>{entry.crossTargetReview?<blockquote><strong>Reviewed cross-target rationale:</strong> {entry.crossTargetReview.rationale}<br/><span className="microcopy">Reviewed by {entry.crossTargetReview.reviewedBy} · {formatDate(entry.crossTargetReview.reviewedAt)}</span></blockquote>:null}<p className="microcopy">No clinical approval conferred · target {entry.targetContent.map((target)=>`${target.kind}:${target.id}`).join(", ")}</p></article>)}
        </div>
      </section>
    </>
  );

  const intakeRightsOptions = view.sourceRights.filter(
    (entry) =>
      entry.decisionId !== null &&
      entry.privateStoragePermitted &&
      entry.localProcessingPermitted,
  );
  const intakeQueue = (
    <>
      <QueueHeader
        eyebrow="Queue 07"
        title="Private intake & authoring handoff"
        description="Process legitimately obtained local sources through explicit current rights, or append the safe IDs and labels from a validated Clinical Content workspace. No source text is returned to this browser."
      />
      <section className="two-column">
        <div className="panel editor-panel nonsticky">
          <h3>Private source inbox</h3>
          <p className="provider-notice">
            Place files manually in the fixed ignored
            <code> .private-clinical-data/clinical-research/source-intake/inbox </code>
            directory. Paths cannot be selected through this interface.
            Commercial question-bank content and PHI are prohibited. Each file
            is capped at{" "}
            {intake === null
              ? "25 MiB"
              : `${Math.floor(intake.maximumSourceBytes / (1024 * 1024))} MiB`}{" "}
            for this pilot.
          </p>
          {intake?.intakeLockPresent ? (
            <div className="error-banner" role="alert">
              <div>
                <strong>Private intake is locked.</strong>
                <p>
                  If no extraction is running and the Workbench previously
                  crashed, explain the recovery. The server will recover only
                  an old lock whose process is confirmed gone, and will archive
                  the original lock instead of deleting it.
                </p>
                <textarea
                  aria-label="Stale-lock recovery reason"
                  placeholder="Why is this lock known to be abandoned?"
                  value={intakeLockRecoveryReason}
                  onChange={(event) =>
                    setIntakeLockRecoveryReason(event.target.value)
                  }
                />
              </div>
              <button
                type="button"
                disabled={
                  busy || intakeLockRecoveryReason.trim().length < 4
                }
                onClick={() => void runIntakeLockRecovery()}
              >
                Archive abandoned lock
              </button>
            </div>
          ) : null}
          {intake === null ? (
            <EmptyState>Private intake status is unavailable.</EmptyState>
          ) : intake.unsafeInboxEntryCount > 0 ? (
            <div className="error-banner" role="alert">
              Remove links, subdirectories, or unsafe names from the inbox
              before scanning.
            </div>
          ) : intake.inboxFilenames.length === 0 ? (
            <EmptyState>The fixed private inbox is empty.</EmptyState>
          ) : (
            <>
              {intake.inboxFilenames.map((filename) => (
                <Field
                  key={filename}
                  label={filename}
                  hint="Only a current decision permitting private storage and local extraction may be selected."
                >
                  <select
                    required
                    value={intakeAssignments[filename] ?? ""}
                    onChange={(event) =>
                      setIntakeAssignments((current) => ({
                        ...current,
                        [filename]: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select source rights</option>
                    {intakeRightsOptions.map((rights) => (
                      <option
                        key={rights.decisionId}
                        value={rights.decisionId ?? ""}
                      >
                        {rights.label} · {rights.decisionId}
                      </option>
                    ))}
                  </select>
                </Field>
              ))}
              <Field label="Intake scope">
                <textarea
                  required
                  value={intakeScope}
                  onChange={(event) => setIntakeScope(event.target.value)}
                />
              </Field>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={acknowledgeNoPhi}
                  onChange={(event) =>
                    setAcknowledgeNoPhi(event.target.checked)
                  }
                />
                I confirm these files contain no PHI or identifiable patient
                information.
              </label>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={acknowledgeRights}
                  onChange={(event) =>
                    setAcknowledgeRights(event.target.checked)
                  }
                />
                I considered copyright, licensing, and third-party material.
              </label>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={acknowledgeLocalProcessing}
                  onChange={(event) =>
                    setAcknowledgeLocalProcessing(event.target.checked)
                  }
                />
                I authorize this explicitly rights-gated local storage and
                processing.
              </label>
              <button
                className="primary-button"
                type="button"
                disabled={
                  busy ||
                  !acknowledgeNoPhi ||
                  !acknowledgeRights ||
                  !acknowledgeLocalProcessing ||
                  intake.inboxFilenames.some(
                    (filename) => !intakeAssignments[filename],
                  )
                }
                onClick={() => void runIntakeScan()}
              >
                Scan and checkpoint inbox
              </button>
            </>
          )}
          <div className="form-actions">
            <button
              type="button"
              disabled={
                busy ||
                !intake?.entries.some((entry) =>
                  ["queued", "extracting"].includes(entry.status),
                )
              }
              onClick={() => void runIntakeExtraction()}
            >
              Extract queued files locally
            </button>
            <button type="button" disabled={busy} onClick={() => void refresh()}>
              Refresh status
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void runIntakeAudit()}
            >
              Run deep integrity audit
            </button>
          </div>
        </div>
        <div className="queue-list">
          <article className="panel queue-card">
            <div className="card-topline">
              <StatusPill
                value={authoringContext ? "available" : "not_available"}
              />
              <span className="revision-label">
                Safe identifiers and labels only
              </span>
            </div>
            <h3>Clinical Content authoring context</h3>
            {authoringContext ? (
              <>
                <p>
                  {authoringContext.sources.length} sources ·{" "}
                  {authoringContext.citations.length} human-verified citations
                  · {authoringContext.topicRevisions.length} topic revisions ·{" "}
                  {authoringContext.structuredFacts.length} facts ·{" "}
                  {authoringContext.testedConcepts.length} concepts
                </p>
                <p className="microcopy">
                  Workspace {authoringContext.authoringWorkspaceId}, updated{" "}
                  {formatDate(authoringContext.authoringWorkspaceUpdatedAt)}.
                  Narratives, claim values, source locators, notes, and source
                  text are excluded from this bridge.
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAuthoringSync()}
                >
                  Append new safe references
                </button>
              </>
            ) : (
              <p className="muted">
                Compile a validated authoring workspace first with{" "}
                <code>npm run clinical:workbook:compile</code>.
              </p>
            )}
          </article>
          <article className="panel queue-card">
            <div className="card-topline">
              <StatusPill
                value={intake?.integrityAuditStatus ?? "not_run"}
              />
              <span className="revision-label">
                {intake?.integrityAuditIssueCount === null ||
                intake?.integrityAuditIssueCount === undefined
                  ? "Deep artifact audit not run this session"
                  : `${intake.integrityAuditIssueCount} integrity issue(s)`}
              </span>
            </div>
            <h3>Intake history</h3>
            {intake?.entries.length ? (
              intake.entries
                .slice()
                .reverse()
                .map((entry) => (
                  <div className="intake-entry" key={entry.id}>
                    <div className="card-topline">
                      <StatusPill value={entry.status} />
                      <span className="revision-label">
                        {Math.ceil(entry.sizeBytes / 1024)} KiB
                      </span>
                    </div>
                    <strong>{entry.originalFilename}</strong>
                    <p className="microcopy">
                      {entry.detectedMediaType ?? "Type not opened"} ·{" "}
                      {entry.extractionOutcome === "ocr_required"
                        ? "OCR required before coverage review"
                        : entry.parserId ?? "No extraction artifact"}
                    </p>
                    {entry.errorMessage ? (
                      <p className="muted">{entry.errorMessage}</p>
                    ) : null}
                  </div>
                ))
            ) : (
              <p className="muted">No private intake records yet.</p>
            )}
          </article>
        </div>
      </section>
    </>
  );

  const audit = (
    <><QueueHeader eyebrow="Append-only history" title="Audit trail" description="A server-derived view of canonical record additions. Content-addressed workspace revisions remain on local ignored storage."/><section className="panel audit-panel"><div className="audit-list">{view.audit.map((entry)=><article className="audit-entry" key={entry.id}><span className="audit-node"/><div><div className="card-topline"><StatusPill value={entry.action}/><time>{formatDate(entry.at)}</time></div><p>{entry.summary}</p><code>{entry.entityType} · {entry.entityId}</code></div></article>)}</div></section></>
  );

  const content: Record<QueueKey, ReactNode> = {
    overview,
    gaps,
    literature,
    rights,
    opinions,
    contributions,
    synthesis,
    intake: intakeQueue,
    audit,
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">CC</span><div><strong>Clinical Context</strong><span>Local workbench</span></div></div>
        <nav aria-label="Workbench queues">{QUEUES.map((queue,index)=><button className={activeQueue===queue.id?"active":""} key={queue.id} type="button" onClick={()=>setActiveQueue(queue.id)}><span className="nav-index">{String(index).padStart(2,"0")}</span><span>{queue.label}</span>{counts[queue.id]===null?null:<strong>{counts[queue.id]}</strong>}</button>)}</nav>
        <div className="local-only-card"><span className="local-dot"/><div><strong>Local only</strong><span>127.0.0.1:4174</span><span>{health?.reviewer.id ?? "reviewer.local.owner"} · {humanize(health?.reviewer.role ?? "owner")}</span></div></div>
      </aside>
      <div className="workspace-shell">
        <header className="topbar"><div><span className="mobile-label">{QUEUES.find((queue)=>queue.id===activeQueue)?.label}</span><strong>{view.label}</strong></div><div className="save-state" aria-live="polite"><span className={busy?"sync-dot syncing":"sync-dot"}/><span>{busy?"Saving locally…":notice}</span></div></header>
        <main className="workspace-main">{error?<div className="error-banner" role="alert"><span>{error}</span><button type="button" onClick={()=>setError(null)}>Dismiss</button></div>:null}{content[activeQueue]}</main>
      </div>
    </div>
  );
}
