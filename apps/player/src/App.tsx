import { bindProblemDiagnostics, problemDiagnostics } from "./diagnostics/problemDiagnostics";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { preloadPrototypeShell, PrototypeShell } from "./PrototypeShell";
import { getTutorialClockMultiplier } from "./session/tutorialTiming";
import {
  appendLocalCampaign,
  archiveLocalCampaign,
  createPrototypePlayerView,
  describePrototypeStorageFailure,
  getActiveCampaign,
  loadPrototypeProfile,
  restoreLocalCampaign,
  savePrototypeProfileResult,
  selectLocalCampaign,
  createFreshProfile,
  type LoadedPrototypeProfile,
  type LocalPrototypeProfile,
  usePrototypeSession,
} from "./session";
import { OpeningSequence } from "./ui";
import { ContinuousLoading } from "./ui/ContinuousLoading";
import { LoadingRest, useLoadingFlow } from "./ui/LoadingFlowContext";
import { ClinicPresentationGate } from "./ui/ClinicPresentationGate";
import { LoadingCovered, LoadingScreen, type LoadingStage } from "./ui/LoadingScreen";
import { AuthGate } from "./auth/AuthGate";
import { useAuthAccountId } from "./auth/AuthAccountContext";
import { usePresentationLayout } from "./shellPresentation";
import { UsageProvider, useCasualMode } from "./playtime/UsageProvider";
import { UsageNotice } from "./ui/AccountMenu";
import { QuestionFlagProvider } from "./session/QuestionFlagProvider";
import { CloudAccountProvider, downloadCloudRecovery, useCloudAccount, type CloudOpeningDiagnostic } from "./session/cloud/CloudAccount";
import { CloudSyncCoordinator } from "./session/cloud/coordinator";
import { CloudGameSession, cloudCampaignMetadata } from "./session/cloud/gameSession";
import { importLocalCloudCampaign, optionalLocalCloudStorage, profileForCloudCampaign, type LocalCloudSource } from "./session/cloud/importCampaigns";
import { CloudCampaignEntry } from "./ui/CloudCampaignEntry";
import { cloudEntryError } from "./ui/cloudEntryError";
import { AccountMenu } from "./ui/AccountMenu";
import { cloudCodec } from "./session/cloud/codecWorker";
import { cloudCheckDeadline, CLOUD_CHECK_TIMEOUT_MS, CLOUD_OPENING_TIMEOUT_MS, CLOUD_READ_TIMEOUT_MS } from "./session/cloud/checkDeadline";
import { rememberCampaignToReopen, selectCampaignToReopen, type CampaignReopenDecision } from "./session/cloud/reopenSelection";
import { timeCloudEntry } from "./session/cloud/entryTimings";
import { openAutomaticCloudCampaign } from "./session/cloud/automaticResolution";
import { CloudSyncError } from "./session/cloud/transport";
import { CloudCacheError } from "./session/cloud/codecCache";
import { cloudOpeningDiagnostic } from "./session/cloud/openingDiagnostic";
import { cloudOpeningProjection } from "./session/cloud/openingProjection";
import { ensureRuntimeCatalogue, RuntimeCatalogueRequired, runtimeCatalogueStatus, yieldRuntimeTask } from "./mobile/performance/runtimeCatalogue";

const MobileEntryPresentation = lazy(() => import("./mobile/MobileEntryPresentation"));

interface ActivePrototypeGameProps {
  openingCovered?: boolean;
  cloudSession?: CloudGameSession;
  onCloudReload?: () => Promise<void>;
  onCloudOpen?: (campaignId: string) => Promise<void>;
  onCloudCampaigns?: () => void;
  loadedProfile: LoadedPrototypeProfile;
  onRequestNewCampaign: (profile: LocalPrototypeProfile, guidanceEnabled?: boolean) => void;
  onRequestRestart: (
    profile: LocalPrototypeProfile,
    campaignSeed: string,
  ) => void;
}

export function ActivePrototypeGame({
  openingCovered = false,
  cloudSession,
  onCloudReload,
  onCloudOpen,
  onCloudCampaigns,
  loadedProfile,
  onRequestNewCampaign,
  onRequestRestart,
}: ActivePrototypeGameProps) {
  const session = usePrototypeSession(loadedProfile, cloudSession, openingCovered);
  const cloudAccount = useCloudAccount();
  const casualMode = useCasualMode();
  useEffect(() => {
    if (!cloudSession || !cloudAccount) return;
    cloudAccount.attach(cloudSession);
    return () => cloudAccount.attach(null);
  }, [cloudSession, cloudAccount?.runtime]);
  const view = useMemo(
    () =>
      (cloudSession ? cloudSession.playerView.bind(cloudSession) : createPrototypePlayerView)(
        session.state,
        session.state.openChartEncounterId,
        session.summaryVisible,
        session.selectedRoomDefinitionId,
        session.buildMode,
        session.selectedRoomInstanceId,
        session.placementOrientation,
        session.facilityCamera,
        session.questionReviewFlags,
        casualMode,
      ),
    [
      session.buildMode,
      session.facilityCamera,
      session.placementOrientation,
      session.questionReviewFlags,
      session.selectedRoomDefinitionId,
      session.selectedRoomInstanceId,
      session.state,
      session.summaryVisible,
      casualMode,
    ],
  );

  return (
    <>
    <ClinicPresentationGate campaignId={session.state.campaignId} authorized={!openingCovered && session.localPreparation === "ready" && (!cloudSession || Boolean(session.cloudSyncView?.canExecute))} onRetry={onCloudReload ? () => { void onCloudReload(); } : undefined} />
    <LoadingScreen active={session.localPreparation !== "ready"} status="Getting your device save ready…" stage="opening"
      failure={session.localPreparation === "failed" ? "Device saving could not start. Your saved copies are safe." : null} />
    <LoadingCovered active={session.localPreparation !== "ready"}>
    <PrototypeShell
      cloudSave={cloudSession && session.cloudSyncView ? {
        campaignName: cloudSession.metadata.name, view: session.cloudSyncView, writerElsewhere: Boolean(session.cloudSyncView.writerElsewhere),
        onContinue: async takeover => {
          if (cloudSession.needsReload) { await onCloudReload?.(); return false; }
          const coordinator = cloudSession.coordinator;
          if (coordinator.view.phase !== "ready" && !await coordinator.startWriter(takeover)) return false;
          if (!coordinator.resume()) return false;
          if (cloudSession.metadata.status === "archived") {
            cloudSession.updateMetadata({ ...cloudSession.metadata, status: "resumable" });
            return await cloudSession.durable() && await coordinator.checkpoint("campaign-switch");
          }
          return true;
        },
        onRetry: async () => {
          if (cloudSession.needsReload || cloudSession.coordinator.view.phase === "closed" || cloudSession.coordinator.hasPriorRecovery) {
            await onCloudReload?.(); return true;
          }
          return cloudSession.reconnect();
        },
        onUseAccountSave: async () => {
          if (!await cloudSession.durable()) return false;
          const ok = await cloudSession.coordinator.useAccountSave(async bytes => downloadCloudRecovery(bytes));
          if (ok) await onCloudReload?.(); return ok;
        },
        onKeepDevice: async () => {
          if (!await cloudSession.durable()) return false;
          const ok = await cloudSession.coordinator.keepDeviceProgress();
          if (ok) await onCloudReload?.(); return ok;
        },
        onKeepBoth: async () => {
          if (!await cloudSession.durable()) return false;
          const id = await cloudSession.coordinator.keepBothProgress();
          if (!id) return false;
          await cloudAccount?.refresh();
          await onCloudOpen?.(id); return true;
        },
        onKeepRecovery: async () => { downloadCloudRecovery(await cloudSession.exportRecoveryAsync()); return true; },
        onSaveAndClose: () => cloudSession.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT),
        onCampaigns: () => onCloudCampaigns?.(),
      } : undefined}
      resourceBar={view.resourceBar}
      paused={session.state.paused}
      simulationSpeed={session.state.simulationSpeed}
      patients={view.patients}
      chart={view.chart}
      employeeDiscussionRows={view.employeeDiscussionRows}
      employeeDiscussion={view.employeeDiscussion}
      onOpenEmployeeDiscussion={session.openEmployeeDiscussion}
      onCloseEmployeeDiscussion={session.closeEmployeeDiscussion}
      onAnswerEmployeeDiscussion={session.answerEmployeeDiscussion}
      onAcknowledgeEmployeeDiscussion={session.acknowledgeEmployeeDiscussion}
      onFileEmployeeDiscussion={session.fileEmployeeDiscussion}
      facility={{
        ...view.facility,
        blueprintRemodel: session.remodelBlueprint.active, remodelGhosts: session.remodelGhosts,
        placement: view.facility.placement ? { ...view.facility.placement, movingRoomId: session.movingRoomInstanceId ?? undefined } : null,
        realMillisecondsPerFacilityMinuteAt1x: view.facility.realMillisecondsPerFacilityMinuteAt1x /
          getTutorialClockMultiplier(session.state, session.tutorialsEnabled),
      }}
      progression={view.progression}
      roomOptions={view.roomOptions}
      ownedRooms={view.ownedRooms}
      lockedRoomOptions={view.lockedRoomOptions}
      selectedRoomBuild={view.selectedRoomBuild}
      staffRoles={view.staffRoles}
      staffTraining={view.staffTraining}
      serviceIncome={view.serviceIncome}
      messages={view.messages}
      needsYou={view.needsYou}
      systemNotices={session.systemNotices}
      questionReviewFlags={session.questionReviewFlags}
      development={view.development}
      emergencyGlp1={view.emergencyGlp1}
      advertising={view.advertising}
      campaigns={session.campaigns}
      tutorialsEnabled={session.tutorialsEnabled}
      tutorialTargetEncounterId={session.tutorialTargetEncounterId}
      tutorialStep={session.tutorialStep}
      workloadStatus={view.workloadStatus}
      patientAvailabilityGuidance={view.patientAvailabilityGuidance}
      announcement={session.announcement}
      onTogglePause={session.togglePause}
      onSimulationSpeedChange={session.setSimulationSpeed}
      onOpenPatient={session.openPatient}
      onCloseChart={session.closeChart}
      onSubmitAnswer={session.submitAnswer}
      onFlagQuestion={session.flagQuestionForReview}
      onQuestionReviewStatusChange={session.setQuestionReviewStatus}
      onAcknowledgeTerminalFeedback={
        session.acknowledgeTerminalFeedback
      }
      onToggleSummary={session.toggleSummary}
      onFileChart={session.fileChart}
      onBeginPlacement={session.beginPlacement}
      onCancelPlacement={session.cancelPlacement}
      onRotatePlacement={session.rotatePlacement}
      onPlaceRoom={session.placeRoom}
      mobileBuildActions={session.mobileBuildActions}
      buildMode={session.buildMode}
      managementMode={session.managementMode}
      buildUndoCount={session.buildUndoCount}
      buildUndoLabel={session.buildUndoLabel}
      movingRoomInstanceId={session.movingRoomInstanceId}
      remodelBlueprint={session.remodelBlueprint}
      buildExitBlockedReason={session.buildExitBlockedReason}
      buildExitBlockedIssues={session.buildExitBlockedIssues}
      placementOrientation={session.placementOrientation}
      onEnterBuildMode={session.enterBuildMode}
      onExitBuildMode={session.exitBuildMode}
      onEnterManagementMode={session.enterManagementMode}
      onExitManagementMode={session.exitManagementMode}
      onServiceAppointmentsEnabledChange={session.setServiceAppointmentsEnabled}
      onStartLaboratoryProcessing={session.startLaboratoryProcessing}
      onSelectRoom={session.selectRoom}
      onSellSelectedRoom={session.sellSelectedRoom}
      onUpgradeSelectedRoom={session.upgradeSelectedRoom}
      onUpgradeRoom={session.upgradeRoom}
      onBeginMoveSelectedRoom={session.beginMoveSelectedRoom}
      onPlaceDoor={session.placeDoor}
      onRemoveDoor={session.removeDoor}
      onUndoBuildAction={session.undoBuildAction}
      onFacilityCameraChange={session.setFacilityCamera}
      onHireStaff={session.hireStaff}
      onDecreaseEmployeeSalary={session.decreaseEmployeeSalary}
      onIncreaseEmployeeSalary={session.increaseEmployeeSalary}
      onFireEmployee={session.fireEmployee}
      onTrainEmployee={session.trainEmployee}
      onCollectLitter={session.collectLitter}
      onRefillWaterCooler={session.refillWaterCooler}
      onSeatFounderAtFrontDesk={session.seatFounderAtFrontDesk}
      onSeatFounderInChair={session.seatFounderInChair}
      onDescribeCharacter={session.describeCharacter}
      onPraiseEmployee={session.praiseEmployee}
      onMoveFounder={session.moveFounder}
      onLevelUp={session.levelUp}
      onBookInspection={session.bookInspection}
      onCancelInspection={session.cancelInspection}
      finishReportOpen={session.finishReportOpen}
      onViewFinishReport={session.openFinishReport}
      onCloseFinishReport={session.closeFinishReport}
      onFastForward={session.fastForward}
      onAddMoney={session.addMoney}
      onRunEmergencyGlp1Consultation={
        session.runEmergencyGlp1Consultation
      }
      onAdvertisingLevelChange={session.setAdvertisingLevel}
      onCreateCampaign={() => onRequestNewCampaign(session.profile)}
      onSwitchCampaign={session.switchCampaign}
      onTutorialAction={session.performTutorialAction}
      onTutorialsEnabledChange={session.setTutorialsEnabled}
      onReferencePauseLockedChange={session.setReferencePauseLocked}
      onTutorialTopicExposure={session.recordTutorialTopicExposure}
      onReplayFirstShift={async () => { if (cloudSession) { onCloudCampaigns?.(); return; } if ((await session.saveAndPauseDurably()).ok) { const saved = session.saveForFirstShiftReplay(); if (saved) onRequestNewCampaign(saved, true); } }}
      onSaveAndPause={session.saveAndPauseDurably}
      onClinicAlertAction={session.runClinicAlertAction}
      onClearLocalCampaigns={session.clearLocalCampaigns}
      onRestart={() =>
        onRequestRestart(session.profile, session.state.campaignSeed)
      }
    />
    </LoadingCovered>
    </>
  );
}

interface OpeningLaunchState {
  mode: "opening";
  profile: LocalPrototypeProfile;
  campaignSeed?: string;
  initialStep: "main" | "founder";
  guidanceEnabled?: boolean;
  sequence: number;
}

interface GameLaunchState {
  mode: "game";
  loadedProfile: LoadedPrototypeProfile;
}

type LaunchState = OpeningLaunchState | GameLaunchState | { mode: "preparing" };

function initialLaunchState(accountId: string | null): OpeningLaunchState {
  const loadedProfile = loadPrototypeProfile(accountId);
  return {
    mode: "opening",
    profile: loadedProfile.profile,
    initialStep: "main",
    sequence: 0,
  };
}

export function AuthenticatedPrototype({ initialCampaignId }: { initialCampaignId?: string } = {}) {
  const accountId = useAuthAccountId();
  const flow = useLoadingFlow(), manualEntry = useRef(false);
  const loadLaunch = (): LaunchState => { try {
    const initial = initialLaunchState(accountId);
    if (initialCampaignId && initial.mode === "opening") {
      const restored = initial.profile.campaigns.find(row => row.campaignId === initialCampaignId)?.status === "archived" ? restoreLocalCampaign(initial.profile, initialCampaignId) : initial.profile;
      return { mode: "game", loadedProfile: { profile: selectLocalCampaign(restored, initialCampaignId), notice: "This device only. Account progress is separate." } };
    }
    return initial;
  } catch (error) { if (error instanceof RuntimeCatalogueRequired) return { mode: "preparing" }; throw error; } };
  const [launch, setLaunch] = useState<LaunchState>(loadLaunch);
  const [catalogue, setCatalogue] = useState<"ready" | "preparing" | "failed">(() => runtimeCatalogueStatus().indexed ? "preparing" : "ready");
  const [localRecovery, setLocalRecovery] = useState<"checking" | "ready" | "failed">(() => typeof indexedDB === "undefined" ? "ready" : "checking");
  const [localRecoveryAttempt, setLocalRecoveryAttempt] = useState(0);
  useEffect(() => {
    // The native chooser uses frozen save data and the compact index. Warm the
    // synchronous local command path after paint, alongside journal recovery.
    let cancelled = false;
    if (runtimeCatalogueStatus().indexed) setCatalogue("preparing");
    void (runtimeCatalogueStatus().indexed ? yieldRuntimeTask() : Promise.resolve()).then(() => {
      if (!cancelled) return ensureRuntimeCatalogue();
    }).then(() => {
      if (cancelled) return;
      const loaded = preparingProfile ? loadLaunch() : null;
      if (loaded?.mode === "preparing") { setCatalogue("failed"); return; }
      if (loaded) setLaunch(current => current.mode === "preparing" ? loaded : current);
      setCatalogue("ready");
    }).catch(error => { if (!cancelled) { problemDiagnostics.error("local-catalogue-open", error); setCatalogue("failed"); } });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, localRecoveryAttempt]);
  const preparingProfile = launch.mode === "preparing";
  useEffect(() => {
    if (typeof indexedDB === "undefined" || launch.mode === "preparing") return;
    let cancelled = false; setLocalRecovery("checking");
    const profile = launch.mode === "game" ? launch.loadedProfile.profile : launch.profile;
    void cloudCheckDeadline(import("./session/localProfileJournal").then(module => module.recoverLocalProfile(profile, accountId))).then(profile => {
      if (cancelled) return;
      setLaunch(current => current.mode === "preparing" ? current : current.mode === "game" ? { ...current, loadedProfile: { ...current.loadedProfile, profile } } : { ...current, profile });
      setLocalRecovery("ready");
    }).catch(error => { if (!cancelled) { problemDiagnostics.error("local-journal-open", error); setLocalRecovery("failed"); } });
    return () => { cancelled = true; };
    // The validated chooser may paint early, but every campaign/storage action
    // remains gated until this exact recovery pass and catalogue warm finish.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, localRecoveryAttempt, preparingProfile]);

  const requestOpening = (
    profile: LocalPrototypeProfile,
    campaignSeed?: string,
    initialStep: "main" | "founder" = "founder",
    guidanceEnabled?: boolean,
  ) => {
    manualEntry.current = true;
    setLaunch((current) => ({
      mode: "opening",
      profile,
      ...(campaignSeed ? { campaignSeed } : {}),
      initialStep,
      ...(guidanceEnabled === undefined ? {} : { guidanceEnabled }),
      sequence: current.mode === "opening" ? current.sequence + 1 : 1,
    }));
  };

  const openCampaign = (
    profile: LocalPrototypeProfile,
    campaignId: string,
    notice = "Local campaign restored.",
  ) => {
    flow?.begin("hydrate");
    const selected = selectLocalCampaign(profile, campaignId);
    const saved = savePrototypeProfileResult(selected, accountId);
    setLaunch({
      mode: "game",
      loadedProfile: {
        profile: selected,
        notice: saved.ok ? notice : `${notice} ${describePrototypeStorageFailure(saved.failure)}`,
      },
    });
  };

  const localCandidates = launch.mode === "opening" ? launch.profile.campaigns.filter(row => row.status === "resumable") : [];
  const localActiveId = launch.mode === "opening" ? getActiveCampaign(launch.profile)?.campaignId : undefined;
  const automaticLocalId = localCandidates.find(row => row.campaignId === localActiveId)?.campaignId ?? (localCandidates.length === 1 ? localCandidates[0]!.campaignId : undefined);
  const automaticLocal = Boolean(flow && !manualEntry.current && launch.mode === "opening" && automaticLocalId);
  useEffect(() => {
    if (automaticLocal && catalogue === "ready" && localRecovery === "ready" && launch.mode === "opening") openCampaign(launch.profile, automaticLocalId!);
  }, [automaticLocal, automaticLocalId, catalogue, localRecovery, launch]);

  if (catalogue === "failed") return <LoadingScreen status="Opening your clinic data…" stage="opening"
    failure="Clinic data could not load. Your saved copies are safe." onRetry={() => setLocalRecoveryAttempt(n => n + 1)} />;
  if (launch.mode === "preparing") return <LoadingScreen status="Opening your device save…" stage="opening" />;
  if (localRecovery === "failed" || (localRecovery !== "ready" && launch.mode !== "opening")) return <LoadingScreen status="Opening your device save…" stage="checking"
    failure={localRecovery === "failed" ? "Your device save could not be read. Your copies are safe." : null}
    onRetry={() => setLocalRecoveryAttempt(n => n + 1)} />;
  if (launch.mode === "opening") {
    return (
      <>
      <LoadingScreen active={catalogue !== "ready" || localRecovery !== "ready" || automaticLocal} phase="selection" status="Finding your clinic…" />
      <LoadingRest ready={catalogue === "ready" && localRecovery === "ready" && !automaticLocal} />
      <OpeningSequence
        key={launch.sequence}
        profile={launch.profile}
        campaignReady={catalogue === "ready" && localRecovery === "ready"}
        campaignSeed={launch.campaignSeed}
        initialStep={launch.initialStep}
        initialGuidanceEnabled={launch.guidanceEnabled}
        onBeginClinic={(founder, clinicName, campaignSeed, guidanceEnabled) => {
          flow?.begin("hydrate");
          const next = appendLocalCampaign(
            launch.profile,
            founder,
            clinicName,
            Date.now(),
            campaignSeed,
            guidanceEnabled,
          );
          const saved = savePrototypeProfileResult(next.profile, accountId);
          setLaunch({
            mode: "game",
            loadedProfile: {
              profile: next.profile,
              notice: saved.ok
                ? "New clinic campaign created with fresh learning histories."
                : `New clinic campaign created, but ${describePrototypeStorageFailure(saved.failure)}`,
            },
          });
        }}
        onResumeCampaign={(campaignId) => {
          openCampaign(launch.profile, campaignId);
        }}
        onRestoreCampaign={(campaignId) => {
          const restored = restoreLocalCampaign(
            launch.profile,
            campaignId,
          );
          const saved = savePrototypeProfileResult(restored, accountId);
          openCampaign(
            restored,
            campaignId,
            saved.ok
              ? "Archived clinic restored with its original learning history."
              : `Archived clinic restored, but ${describePrototypeStorageFailure(saved.failure)}`,
          );
        }}
      />
      </>
    );
  }

  const activeCampaign = getActiveCampaign(launch.loadedProfile.profile);
  if (!activeCampaign) {
    return (
      <> <LoadingRest />
      <OpeningSequence
        profile={launch.loadedProfile.profile}
        campaignReady={catalogue === "ready"}
        initialStep="main"
        onBeginClinic={(founder, clinicName, campaignSeed, guidanceEnabled) => {
          flow?.begin("hydrate");
          const next = appendLocalCampaign(
            launch.loadedProfile.profile,
            founder,
            clinicName,
            Date.now(),
            campaignSeed,
            guidanceEnabled,
          );
          const saved = savePrototypeProfileResult(next.profile, accountId);
          setLaunch({
            mode: "game",
            loadedProfile: {
              profile: next.profile,
              notice: saved.ok
                ? "New clinic campaign created with fresh learning histories."
                : `New clinic campaign created, but ${describePrototypeStorageFailure(saved.failure)}`,
            },
          });
        }}
        onResumeCampaign={(campaignId) =>
          openCampaign(launch.loadedProfile.profile, campaignId)
        }
        onRestoreCampaign={(campaignId) => {
          const restored = restoreLocalCampaign(
            launch.loadedProfile.profile,
            campaignId,
          );
          const saved = savePrototypeProfileResult(restored, accountId);
          openCampaign(
            restored,
            campaignId,
            saved.ok
              ? "Local campaign restored."
              : `Archived clinic restored, but ${describePrototypeStorageFailure(saved.failure)}`,
          );
        }}
      /> </>
    );
  }

  if (catalogue !== "ready") return <LoadingScreen status="Preparing your clinic…" stage="opening" />;
  return (
    <ActivePrototypeGame
      key={activeCampaign.campaignId}
      loadedProfile={launch.loadedProfile}
      onRequestNewCampaign={(profile, guidanceEnabled) =>
        requestOpening(profile, undefined, "founder", guidanceEnabled)
      }
      onRequestRestart={(profile, campaignSeed) => {
        const archived = archiveLocalCampaign(
          profile,
          activeCampaign.campaignId,
        );
        savePrototypeProfileResult(archived, accountId);
        requestOpening(archived, campaignSeed, "founder");
      }}
    />
  );
}

export function AccountCampaignRouter() {
  const cloud = useCloudAccount();
  if (!cloud) return <AuthenticatedPrototype />;
  return <CloudCampaignRouter />;
}

function CloudCampaignRouter() {
  const cloud = useCloudAccount()!, { runtime } = cloud;
  const casualMode = useCasualMode();
  const flow = useLoadingFlow();
  const [entryReadiness, setEntryReadiness] = useState<"preparing" | "ready" | "interaction">("preparing");
  const [automaticSettled, setAutomaticSettled] = useState(false), [selectionFailure, setSelectionFailure] = useState(false);
  const layout = usePresentationLayout();
  const [preparingEntry, setPreparingEntry] = useState(true);
  const [preparationError, setPreparationError] = useState(false), [preparationAttempt, setPreparationAttempt] = useState(0);
  useEffect(() => {
    let current = true; setPreparingEntry(true); setPreparationError(false);
    // Start the selected presentation and save worker during account entry.
    // The empty hash warms processing without reading a campaign or acquiring
    // a writer. Opening the chosen campaign reconnects its checked session.
    // Warm processing in the background. A queued codec task is not a reason to
    // lock an already listed Resume row; the actual open owns verification.
    void timeCloudEntry("worker-warm", () => cloudCheckDeadline(cloudCodec.run({ kind: "hash", input: "" }))).catch(error => problemDiagnostics.error("codec-warm", error));
    void cloudCheckDeadline(timeCloudEntry("shell-prepare", () => preloadPrototypeShell(layout)),
      CLOUD_CHECK_TIMEOUT_MS).then(() => {
      if (current) setPreparingEntry(false);
    }, () => {
      if (current) { setPreparingEntry(false); setPreparationError(true); }
    });
    return () => { current = false; };
  }, [layout, runtime, preparationAttempt]);
  const [route, setRoute] = useState<"entry" | "checking" | "cloud" | "founder">("entry");
  const [active, setActive] = useState<{ session: CloudGameSession; profile: LoadedPrototypeProfile; sequence: number } | null>(null);
  const [notice, setNotice] = useState("");
  const [openingFailure, setOpeningFailure] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>("checking");
  const live = useRef(true), generation = useRef(0), current = useRef(active);
  const opening = useRef<CloudSyncCoordinator | null>(null);
  const failedOpening = useRef<string | null>(null), currentRoute = useRef(route);
  const entryRequested = useRef(false);
  const attemptedAutomaticOpen = useRef(false);
  const automaticDeadline = useRef<ReturnType<typeof setTimeout> | null>(null), automaticRetryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const automaticSelection = useRef<Promise<CampaignReopenDecision> | null>(null);
  const [automaticRetry, setAutomaticRetry] = useState(0);
  const stopAutomaticOpen = () => {
    attemptedAutomaticOpen.current = true;
    setAutomaticSettled(true);
    if (automaticDeadline.current !== null) clearTimeout(automaticDeadline.current);
    if (automaticRetryTimer.current !== null) clearTimeout(automaticRetryTimer.current);
    automaticDeadline.current = null; automaticRetryTimer.current = null;
  };
  current.current = active; currentRoute.current = route;
  useEffect(() => { live.current = true; return () => { live.current = false; generation.current++; opening.current?.dispose(); }; }, []);
  useEffect(() => () => {
    if (automaticDeadline.current !== null) clearTimeout(automaticDeadline.current);
    if (automaticRetryTimer.current !== null) clearTimeout(automaticRetryTimer.current);
    automaticDeadline.current = null; automaticRetryTimer.current = null;
  }, []);
  const tryOpenCampaign = async (campaignId: string, automatic = false): Promise<boolean> => {
    // Manual Resume and a committed automatic decision both cancel all older
    // selection reads synchronously, before any command durability await.
    stopAutomaticOpen();
    const previous = current.current?.session;
    const mountedSelection = Boolean(automatic && previous?.coordinator.view.localDurable && previous.coordinator.view.phase !== "closed");
    if (!mountedSelection) flow?.begin("copies");
    entryRequested.current = false;
    const epoch = ++generation.current;
    failedOpening.current = null; setOpeningFailure(null); setSelectionFailure(false); setLoadingStage("checking");
    try { runtime.onOpeningDiagnostic?.(null); } catch { /* QA observation cannot affect play. */ }
    if (!mountedSelection) { previous?.coordinator.pause(); setRoute("checking"); }
    if (previous) {
      try {
        if (!await cloudCheckDeadline(previous.durable())) {
          if (live.current && epoch === generation.current) {
            failedOpening.current = campaignId;
            setOpeningFailure("This browser could not save your progress. Your saved copies are safe.");
          }
          return false;
        }
      } catch {
        if (live.current && epoch === generation.current) {
          failedOpening.current = campaignId;
          previous.coordinator.reportLocalFailure(new CloudSyncError(previous.coordinator.journal ? "storage" : "processing"));
          setOpeningFailure("Your clinic could not finish opening. Your saved copies are safe.");
        }
        // Keep the still-mounted owner and its accepted bytes. Unmounting it
        // while encoding is stalled would dispose the only in-memory copy.
        return false;
      }
    }
    if (!live.current || epoch !== generation.current) return false;
    if (!mountedSelection) { setRoute("checking"); setNotice(""); }
    opening.current?.dispose(); opening.current = null;
    let coordinator: CloudSyncCoordinator | null = null, openingCancelled = false;
    let openingStage: CloudOpeningDiagnostic["stage"] = "copies";
    try {
      const session = await cloudCheckDeadline((async () => {
        for (let attempt = 0; attempt < 3; attempt++) {
        coordinator = await timeCloudEntry("open-copies", () => openAutomaticCloudCampaign({ runtime, campaignId, storage: optionalLocalCloudStorage, onlineOnly: mountedSelection,
          cancelled: () => openingCancelled || !live.current || epoch !== generation.current }));
        if (!live.current || epoch !== generation.current) throw new Error("Opening cancelled");
        opening.current = coordinator;
        openingStage = "hydrate";
        if (!mountedSelection && live.current && epoch === generation.current) setLoadingStage("opening");
        const selectedId = coordinator.scope.campaignId;
        let created: CloudGameSession;
        try {
        // Only a verified online replacement crosses the mounted owner boundary.
        // An outage keeps the same shell, journal and engine; cold/manual opens
        // continue to offer the existing verified offline fallback.
        if (mountedSelection) {
          if (coordinator.playingVerifiedLocal) throw new CloudSyncError("network");
          previous!.coordinator.pause();
          if (!await previous!.durable()) throw new CloudSyncError("storage");
          if (await coordinator.journalChangedSinceOpen()) throw new CloudCacheError("conflict");
        }
        created = await timeCloudEntry("open-hydrate", () => CloudGameSession.create(coordinator!, async id => { await openCampaign(id); }, async checked => {
          if (entryRequested.current) return false;
          // Checked same-head authority does not need another scan of retained
          // copies. Full selection remains at open/reopen or changed authority.
          if (checked) return true;
          return tryOpenCampaign(selectedId, true);
        }, { initialProjection: state => cloudOpeningProjection(state, runtime.accountId, casualMode) })); } catch (error) {
          coordinator.dispose();
          if (error instanceof CloudCacheError && error.reason === "conflict" && attempt < 2) continue;
          throw error;
        }
        if (!live.current || epoch !== generation.current || opening.current !== coordinator) { created.dispose(); throw new Error("Opening cancelled"); }
        return created;
        }
        throw new CloudCacheError("conflict");
      })(), CLOUD_OPENING_TIMEOUT_MS, () => { openingCancelled = true; coordinator?.dispose(); });
      if (!live.current || epoch !== generation.current) { session.dispose(); return false; }
      openingStage = "selection";
      await timeCloudEntry("active-marker", () => rememberCampaignToReopen(runtime, session.coordinator.scope.campaignId));
      if (!live.current || epoch !== generation.current) { session.dispose(); return false; }
      opening.current = null;
      const metadata = session.metadata;
      const profile = profileForCloudCampaign(session.state, { ...metadata, status: "resumable" });
      setActive({ session, profile: { profile, notice: "Verified account save." }, sequence: epoch }); setRoute("cloud");
      // The checked local projection can play while its account upload runs.
      // Reconnection grants commands only after fresh admission/head/lease and
      // pending-copy verification; all failures remain visible in the shell.
      void session.checkpointNow("ordinary");
      return true;
    } catch (error) {
      (coordinator as CloudSyncCoordinator | null)?.dispose();
      if (live.current && epoch === generation.current) {
        try { runtime.onOpeningDiagnostic?.(cloudOpeningDiagnostic(openingStage, error)); }
        catch { /* Classification-only QA diagnostics cannot replace recovery UI. */ }
        try { problemDiagnostics.error(`campaign-open:${openingStage}:${cloudOpeningDiagnostic(openingStage, error).code}`, error); }
        catch { /* Problem reports are best effort and never block recovery UI. */ }
        if (!mountedSelection) {
          failedOpening.current = campaignId;
          setNotice("This clinic could not be opened. Your saved copies have been kept. Try again or contact the owner.");
          setOpeningFailure("This clinic could not be opened. Your saved copies are safe.");
        }
      }
      return false;
    } finally { if (opening.current === coordinator) opening.current = null; }
  };
  const openCampaign = async (campaignId: string): Promise<void> => { await tryOpenCampaign(campaignId); };
  useEffect(() => {
    const online = () => {
      const failedCheck = currentRoute.current === "checking" && failedOpening.current !== null;
      if (!live.current || (currentRoute.current !== "entry" && !failedCheck) || entryRequested.current) return;
      if (failedOpening.current) void openCampaign(failedOpening.current);
      else if (attemptedAutomaticOpen.current) { attemptedAutomaticOpen.current = false; setAutomaticRetry(value => value + 1); }
    };
    window.addEventListener("online", online);
    window.addEventListener("focus", online);
    return () => { window.removeEventListener("online", online); window.removeEventListener("focus", online); };
  }, [runtime]);
  useEffect(() => {
    const offline = cloud.phase === "error" && ["network", "throttled"].includes(cloud.error ?? "");
    if (attemptedAutomaticOpen.current || preparingEntry || preparationError || route !== "entry" || flow && entryReadiness === "preparing" ||
      !offline && (cloud.phase !== "available" || !cloud.access?.enabled || cloud.access.writesEnabled === false || !cloud.access.admitted || !cloud.access.noticeAccepted)) return;
    let cancelled = false;
    const epoch = generation.current;
    // Provider/list/enrollment updates may invalidate an attempt, but may not
    // consume it or restart its deadline. No read completion can open after
    // a manual choice, route change, unmount or this bounded selection window.
    if (automaticDeadline.current === null) automaticDeadline.current = setTimeout(() => { stopAutomaticOpen(); if (flow) setSelectionFailure(true); }, CLOUD_CHECK_TIMEOUT_MS);
    const retry = () => {
      if (!cancelled && live.current && epoch === generation.current && !attemptedAutomaticOpen.current)
        automaticRetryTimer.current = setTimeout(() => setAutomaticRetry(value => value + 1), CLOUD_READ_TIMEOUT_MS);
    };
    void (async () => {
      try {
        if (!automaticSelection.current) {
          const request = timeCloudEntry("reopen-select", () => selectCampaignToReopen(runtime, offline, Boolean(flow)));
          automaticSelection.current = request;
          void request.finally(() => { if (automaticSelection.current === request) automaticSelection.current = null; }).catch(() => {});
        }
        const decision = await automaticSelection.current;
        if (cancelled || !live.current || generation.current !== epoch || attemptedAutomaticOpen.current) return;
        if (decision.kind === "open") await openCampaign(decision.campaignId);
        else if (decision.kind === "list") stopAutomaticOpen();
        else retry();
      } catch { retry(); /* Temporary IDB/access failure is not a no-campaign decision. */ }
    })();
    return () => { cancelled = true; if (automaticRetryTimer.current !== null) clearTimeout(automaticRetryTimer.current); automaticRetryTimer.current = null; };
  }, [cloud.phase, cloud.error, cloud.access, cloud.summaries, preparingEntry, preparationError, runtime, route, automaticRetry, entryReadiness]);
  const enterCampaignScreen = async () => {
    stopAutomaticOpen();
    entryRequested.current = true;
    const epoch = ++generation.current;
    const session = current.current?.session;
    if (session && route === "cloud") {
      if (!await session.durable()) { setNotice("Recovery storage could not be verified. Keep this tab open and retry."); return; }
      if (["ready", "saving"].includes(session.coordinator.view.phase) && !await session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)) return;
      session.coordinator.pause();
    }
    await rememberCampaignToReopen(runtime, null);
    if (!live.current || generation.current !== epoch) return;
    setActive(null); setEntryReadiness("preparing"); setRoute("entry"); await cloud.refresh();
  };
  useEffect(() => {
    cloud.setCampaignNavigation(() => { void enterCampaignScreen(); });
    cloud.setCampaignOpening?.(openCampaign);
    return () => { cloud.setCampaignNavigation(null); cloud.setCampaignOpening?.(null); };
  }, [runtime, route]);
  const restart = async () => {
    const session = current.current?.session;
    if (!session?.canExecute) return;
    entryRequested.current = true;
    session.updateMetadata({ ...session.metadata, status: "archived" });
    if (!await session.durable() || !await session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)) return;
    if (!live.current) return;
    stopAutomaticOpen(); await rememberCampaignToReopen(runtime, null);
    setNotice("Your campaign was archived and still counts toward your 2 account campaigns. Resume it or start a new campaign.");
    setActive(null); setEntryReadiness("preparing"); setRoute("entry"); await cloud.refresh();
  };
  if (cloud.phase === "deletion-requested" || cloud.phase === "deleted") return <><LoadingRest /><CloudCampaignEntry onOpen={async () => {}} onCreate={() => {}} /></>;
  if (route === "checking" || route === "cloud") return <>
    <LoadingCovered active={route === "checking"}>
      {active ? <ActivePrototypeGame key={`${active.session.coordinator.scope.campaignId}:${active.sequence}`}
        openingCovered={route === "checking"}
        loadedProfile={active.profile} cloudSession={active.session}
        onCloudReload={() => openCampaign(active.session.coordinator.scope.campaignId)} onCloudOpen={openCampaign} onCloudCampaigns={() => { void enterCampaignScreen(); }}
        onRequestNewCampaign={() => { void enterCampaignScreen(); }} onRequestRestart={() => { void restart(); }} /> : null}
    </LoadingCovered>
    <LoadingScreen active={route === "checking"} status={loadingStage === "opening" ? "Opening your clinic…" : "Checking your account save…"}
      stage={loadingStage} failure={openingFailure} actionLabel={active ? "Return to your clinic" : "Back to your clinics"} onRetry={() => { void (async () => {
        stopAutomaticOpen(); const epoch = ++generation.current; opening.current?.dispose(); opening.current = null;
        // A previous owner may still hold uncommitted bytes. Returning to that
        // mounted clinic exposes its recovery controls without releasing it.
        if (current.current) { entryRequested.current = false; setOpeningFailure(null); setRoute("cloud"); return; }
        entryRequested.current = true;
        await rememberCampaignToReopen(runtime, null);
        if (live.current && generation.current === epoch) { setOpeningFailure(null); setEntryReadiness("preparing"); setRoute("entry"); }
      })(); }} />
  </>;
  if (route === "founder") return <><LoadingRest /><button type="button" className="button button-secondary" onClick={() => { void enterCampaignScreen(); }}>Back to your clinics</button><OpeningSequence profile={createFreshProfile()} initialStep="founder" onResumeCampaign={() => { setEntryReadiness("preparing"); setRoute("entry"); }} onRestoreCampaign={() => { setEntryReadiness("preparing"); setRoute("entry"); }}
    onBeginClinic={(founder, name, seed, guidance) => { void (async () => {
      const epoch = ++generation.current;
      try {
        const created = appendLocalCampaign(createFreshProfile(), founder, name, Date.now(), seed, guidance);
        const serializedState = serializeGameState(created.campaign.state), campaign = cloudCampaignMetadata(created.profile);
        const source: LocalCloudSource = { id: `created:${campaign.campaignId}`, sourceKey: `created:${campaign.campaignId}`, unowned: false,
          campaign, serializedState, bytes: new TextEncoder().encode(serializedState).length, facilityLevel: created.campaign.state.facilityLevel, error: null };
        await runtime.entryStore.create(`created:${campaign.campaignId}`, source);
        await importLocalCloudCampaign(source, name, runtime.transport, runtime.entryStore);
        if (live.current && epoch === generation.current) { await cloud.refresh(); if (live.current && epoch === generation.current) await openCampaign(campaign.campaignId); }
      } catch (failure) { if (live.current && epoch === generation.current) { setNotice(cloudEntryError(failure)); setEntryReadiness("preparing"); setRoute("entry"); } }
    })(); }} /></>;
  const offlineSelection = cloud.phase === "error" && ["network", "throttled"].includes(cloud.error ?? "");
  const entryWait = Boolean(flow && !entryRequested.current && !automaticSettled && (entryReadiness !== "interaction" || offlineSelection));
  return <>
    <LoadingScreen active={entryWait || Boolean(flow && entryReadiness === "preparing") || selectionFailure} phase="selection" status="Finding your clinic…"
      failure={selectionFailure ? "Your clinics could not be checked. Your saved copies are safe." : null}
      onRetry={() => { attemptedAutomaticOpen.current = false; setAutomaticSettled(false); setSelectionFailure(false); setAutomaticRetry(n => n + 1); }} />
    <LoadingRest ready={!entryWait && !selectionFailure && !preparingEntry && entryReadiness !== "preparing"} />
    <CloudCampaignEntry key={notice} onOpeningStateChange={setEntryReadiness} notice={notice} preparing={preparingEntry || preparationError} preparationFailure={preparationError}
    onRetryPreparation={() => setPreparationAttempt(value => value + 1)} onOpen={openCampaign}
    onCreate={() => { stopAutomaticOpen(); entryRequested.current = true; generation.current++; setRoute("founder"); }} /></>;
}

export function App() {
  const layout = usePresentationLayout();
  useEffect(() => problemDiagnostics.source("layout", () => ({ layout })), [layout]);
  useEffect(() => bindProblemDiagnostics(window, document), []);
  return (
    <ContinuousLoading>
      {layout === "phone" ? <Suspense fallback={null}><MobileEntryPresentation /></Suspense> : null}
      <AuthGate>
        <UsageProvider>
          <QuestionFlagProvider>
            <CloudAccountProvider>
            <UsageNotice />
            <AccountCampaignRouter />
            </CloudAccountProvider>
          </QuestionFlagProvider>
        </UsageProvider>
      </AuthGate>
    </ContinuousLoading>
  );
}
