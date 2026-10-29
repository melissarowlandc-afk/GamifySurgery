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
import { cloudCodec, CLOUD_WORKER_STARTUP_TIMEOUT_MS, CLOUD_WORKER_TASK_TIMEOUT_MS } from "./session/cloud/codecWorker";
import { cloudCheckDeadline, CLOUD_CHECK_TIMEOUT_MS, CLOUD_READ_TIMEOUT_MS } from "./session/cloud/checkDeadline";
import { rememberCampaignToReopen, selectCampaignToReopen, type CampaignReopenDecision } from "./session/cloud/reopenSelection";
import { openAutomaticCloudCampaign } from "./session/cloud/automaticResolution";
import { cloudCopyFamily } from "./session/cloud/copySelection";
import { retainedProgressIsNewer } from "./session/cloud/retainedCopies";
import { CloudSyncError } from "./session/cloud/transport";
import { cloudOpeningDiagnostic } from "./session/cloud/openingDiagnostic";

const MobileEntryPresentation = lazy(() => import("./mobile/MobileEntryPresentation"));

interface ActivePrototypeGameProps {
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
  cloudSession,
  onCloudReload,
  onCloudOpen,
  onCloudCampaigns,
  loadedProfile,
  onRequestNewCampaign,
  onRequestRestart,
}: ActivePrototypeGameProps) {
  const session = usePrototypeSession(loadedProfile, cloudSession);
  const cloudAccount = useCloudAccount();
  const casualMode = useCasualMode();
  useEffect(() => {
    if (!cloudSession || !cloudAccount) return;
    cloudAccount.attach(cloudSession);
    return () => cloudAccount.attach(null);
  }, [cloudSession, cloudAccount?.runtime]);
  const view = useMemo(
    () =>
      createPrototypePlayerView(
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
          if (cloudSession.needsReload || cloudSession.coordinator.view.phase === "closed" || cloudSession.coordinator.confirmed?.priorRecovery) {
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
        onKeepRecovery: async () => { downloadCloudRecovery(cloudSession.exportRecovery()); return true; },
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
      onReplayFirstShift={() => { if (cloudSession) { onCloudCampaigns?.(); return; } const saved = session.saveForFirstShiftReplay(); if (saved) onRequestNewCampaign(saved, true); }}
      onSaveAndPause={session.saveAndPause}
      onClinicAlertAction={session.runClinicAlertAction}
      onClearLocalCampaigns={session.clearLocalCampaigns}
      onRestart={() =>
        onRequestRestart(session.profile, session.state.campaignSeed)
      }
    />
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

type LaunchState = OpeningLaunchState | GameLaunchState;

function initialLaunchState(accountId: string | null): LaunchState {
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
  const [launch, setLaunch] = useState<LaunchState>(() => {
    const initial = initialLaunchState(accountId);
    if (initialCampaignId && initial.mode === "opening") {
      const restored = initial.profile.campaigns.find(row => row.campaignId === initialCampaignId)?.status === "archived" ? restoreLocalCampaign(initial.profile, initialCampaignId) : initial.profile;
      return { mode: "game", loadedProfile: { profile: selectLocalCampaign(restored, initialCampaignId), notice: "This device only. Account progress is separate." } };
    }
    return initial;
  });

  const requestOpening = (
    profile: LocalPrototypeProfile,
    campaignSeed?: string,
    initialStep: "main" | "founder" = "founder",
    guidanceEnabled?: boolean,
  ) => {
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

  if (launch.mode === "opening") {
    return (
      <OpeningSequence
        key={launch.sequence}
        profile={launch.profile}
        campaignSeed={launch.campaignSeed}
        initialStep={launch.initialStep}
        initialGuidanceEnabled={launch.guidanceEnabled}
        onBeginClinic={(founder, clinicName, campaignSeed, guidanceEnabled) => {
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
    );
  }

  const activeCampaign = getActiveCampaign(launch.loadedProfile.profile);
  if (!activeCampaign) {
    return (
      <OpeningSequence
        profile={launch.loadedProfile.profile}
        initialStep="main"
        onBeginClinic={(founder, clinicName, campaignSeed, guidanceEnabled) => {
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
      />
    );
  }

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
  const layout = usePresentationLayout();
  const [preparingEntry, setPreparingEntry] = useState(true);
  const [preparationError, setPreparationError] = useState(false), [preparationAttempt, setPreparationAttempt] = useState(0);
  useEffect(() => {
    let current = true; setPreparingEntry(true); setPreparationError(false);
    // Start the selected presentation and save worker during account entry.
    // The empty hash warms processing without reading a campaign or acquiring
    // a writer. Opening the chosen campaign reconnects its checked session.
    void cloudCheckDeadline(Promise.all([preloadPrototypeShell(layout), cloudCodec.run({ kind: "hash", input: "" })]),
      CLOUD_WORKER_STARTUP_TIMEOUT_MS + CLOUD_WORKER_TASK_TIMEOUT_MS).then(() => {
      if (current) setPreparingEntry(false);
    }, () => {
      if (current) { setPreparingEntry(false); setPreparationError(true); }
    });
    return () => { current = false; };
  }, [layout, runtime, preparationAttempt]);
  const [route, setRoute] = useState<"entry" | "checking" | "cloud" | "founder">("entry");
  const [active, setActive] = useState<{ session: CloudGameSession; profile: LoadedPrototypeProfile; sequence: number } | null>(null);
  const [notice, setNotice] = useState("");
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
  const openCampaign = async (campaignId: string) => {
    // Manual Resume and a committed automatic decision both cancel all older
    // selection reads synchronously, before any command durability await.
    stopAutomaticOpen();
    entryRequested.current = false;
    const epoch = ++generation.current;
    failedOpening.current = null;
    try { runtime.onOpeningDiagnostic?.(null); } catch { /* QA observation cannot affect play. */ }
    const previous = current.current?.session;
    previous?.coordinator.pause();
    if (previous) {
      try {
        if (!await cloudCheckDeadline(previous.durable())) {
          if (live.current && epoch === generation.current) setNotice("This browser could not save your progress. Retry after freeing storage.");
          return;
        }
      } catch {
        if (live.current && epoch === generation.current) previous.coordinator.reportLocalFailure(new CloudSyncError("processing"));
        // Keep the still-mounted owner and its accepted bytes. Unmounting it
        // while encoding is stalled would dispose the only in-memory copy.
        return;
      }
    }
    if (!live.current || epoch !== generation.current) return;
    setRoute("checking"); setNotice("");
    opening.current?.dispose(); opening.current = null;
    let coordinator: CloudSyncCoordinator | null = null, openingCancelled = false;
    let openingStage: CloudOpeningDiagnostic["stage"] = "copies";
    try {
      const session = await cloudCheckDeadline((async () => {
        coordinator = await openAutomaticCloudCampaign({ runtime, campaignId, storage: optionalLocalCloudStorage,
          cancelled: () => openingCancelled || !live.current || epoch !== generation.current });
        if (!live.current || epoch !== generation.current) throw new Error("Opening cancelled");
        opening.current = coordinator;
        openingStage = "hydrate";
        const selectedId = coordinator.scope.campaignId;
        const checkedCoordinator = coordinator;
        const created = await CloudGameSession.create(coordinator, async id => { await openCampaign(id); }, async checked => {
          if (entryRequested.current) return false;
          if (checked && checkedCoordinator.confirmed && !await retainedProgressIsNewer({ scope: checkedCoordinator.scope,
            family: await cloudCopyFamily(selectedId), codec: cloudCodec, store: runtime.entryStore,
            entries: await runtime.cache.accountEntries?.(runtime) ?? [], account: [checkedCoordinator.confirmed], storage: optionalLocalCloudStorage }, checkedCoordinator.confirmed)) return true;
          await openCampaign(selectedId); return true;
        });
        if (!live.current || epoch !== generation.current || opening.current !== coordinator) { created.dispose(); throw new Error("Opening cancelled"); }
        return created;
      })(), CLOUD_CHECK_TIMEOUT_MS + CLOUD_READ_TIMEOUT_MS, () => { openingCancelled = true; coordinator?.dispose(); });
      if (!live.current || epoch !== generation.current) { session.dispose(); return; }
      openingStage = "selection";
      await rememberCampaignToReopen(runtime, session.coordinator.scope.campaignId);
      if (!live.current || epoch !== generation.current) { session.dispose(); return; }
      opening.current = null;
      const metadata = session.metadata;
      const profile = profileForCloudCampaign(session.state, { ...metadata, status: "resumable" });
      setActive({ session, profile: { profile, notice: "Verified account save." }, sequence: epoch }); setRoute("cloud");
      // The checked local projection can play while its account upload runs.
      // Reconnection grants commands only after fresh admission/head/lease and
      // pending-copy verification; all failures remain visible in the shell.
      void session.checkpointNow("ordinary");
    } catch (error) {
      (coordinator as CloudSyncCoordinator | null)?.dispose();
      if (live.current && epoch === generation.current) {
        try { runtime.onOpeningDiagnostic?.(cloudOpeningDiagnostic(openingStage, error)); }
        catch { /* Classification-only QA diagnostics cannot replace recovery UI. */ }
        failedOpening.current = campaignId;
        setNotice("This clinic could not be opened. Your saved copies have been kept. Try again or contact the owner."); setRoute("entry");
      }
    } finally { if (opening.current === coordinator) opening.current = null; }
  };
  useEffect(() => {
    const online = () => {
      if (!live.current || currentRoute.current !== "entry" || entryRequested.current) return;
      if (failedOpening.current) void openCampaign(failedOpening.current);
      else if (attemptedAutomaticOpen.current) { attemptedAutomaticOpen.current = false; setAutomaticRetry(value => value + 1); }
    };
    window.addEventListener("online", online);
    window.addEventListener("focus", online);
    return () => { window.removeEventListener("online", online); window.removeEventListener("focus", online); };
  }, [runtime]);
  useEffect(() => {
    const offline = cloud.phase === "error" && ["network", "throttled"].includes(cloud.error ?? "");
    if (attemptedAutomaticOpen.current || preparingEntry || preparationError || route !== "entry" ||
      !offline && (cloud.phase !== "available" || !cloud.access?.enabled || cloud.access.writesEnabled === false || !cloud.access.admitted || !cloud.access.noticeAccepted)) return;
    let cancelled = false;
    const epoch = generation.current;
    // Provider/list/enrollment updates may invalidate an attempt, but may not
    // consume it or restart its deadline. No read completion can open after
    // a manual choice, route change, unmount or this bounded selection window.
    if (automaticDeadline.current === null) automaticDeadline.current = setTimeout(stopAutomaticOpen, CLOUD_CHECK_TIMEOUT_MS);
    const retry = () => {
      if (!cancelled && live.current && epoch === generation.current && !attemptedAutomaticOpen.current)
        automaticRetryTimer.current = setTimeout(() => setAutomaticRetry(value => value + 1), CLOUD_READ_TIMEOUT_MS);
    };
    void (async () => {
      try {
        if (!automaticSelection.current) {
          const request = selectCampaignToReopen(runtime, offline);
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
  }, [cloud.phase, cloud.error, cloud.access, cloud.summaries, preparingEntry, preparationError, runtime, route, automaticRetry]);
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
    setActive(null); setRoute("entry"); await cloud.refresh();
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
    setActive(null); setRoute("entry"); await cloud.refresh();
  };
  if (cloud.phase === "deletion-requested" || cloud.phase === "deleted") return <CloudCampaignEntry onOpen={async () => {}} onCreate={() => {}} />;
  if (route === "checking") return <main className="cloud-entry"><h1>Checking account save…</h1><p role="status">Verifying campaign data and session status before play.</p>
    <button type="button" className="button button-secondary" onClick={() => { void (async () => {
      stopAutomaticOpen(); entryRequested.current = true; const epoch = ++generation.current; opening.current?.dispose(); opening.current = null;
      await rememberCampaignToReopen(runtime, null);
      if (live.current && generation.current === epoch) setRoute("entry");
    })(); }}>Back to your clinics</button><AccountMenu /></main>;
  if (route === "cloud" && active) return <ActivePrototypeGame key={`${active.session.coordinator.scope.campaignId}:${active.sequence}`}
    loadedProfile={active.profile} cloudSession={active.session}
    onCloudReload={() => openCampaign(active.session.coordinator.scope.campaignId)} onCloudOpen={openCampaign} onCloudCampaigns={() => { void enterCampaignScreen(); }}
    onRequestNewCampaign={() => { void enterCampaignScreen(); }} onRequestRestart={() => { void restart(); }} />;
  if (route === "founder") return <><button type="button" className="button button-secondary" onClick={() => { void enterCampaignScreen(); }}>Back to your clinics</button><OpeningSequence profile={createFreshProfile()} initialStep="founder" onResumeCampaign={() => { setRoute("entry"); }} onRestoreCampaign={() => { setRoute("entry"); }}
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
      } catch (failure) { if (live.current && epoch === generation.current) { setNotice(cloudEntryError(failure)); setRoute("entry"); } }
    })(); }} /></>;
  return <>{preparationError ? <div role="alert" className="cloud-entry">
    <p>Clinic preparation could not finish. Your saved copies have been kept. Check your connection and retry.</p>
    <button type="button" className="button button-primary" onClick={() => setPreparationAttempt(value => value + 1)}>Retry clinic preparation</button>
    <button type="button" className="button button-secondary" onClick={() => window.location.reload()}>Reload app</button>
  </div> : null}<CloudCampaignEntry key={notice} notice={notice} preparing={preparingEntry || preparationError} onOpen={openCampaign} onCreate={() => { stopAutomaticOpen(); entryRequested.current = true; generation.current++; setRoute("founder"); }} /></>;
}

export function App() {
  const layout = usePresentationLayout();
  return (
    <>
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
    </>
  );
}
