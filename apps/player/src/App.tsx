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
import { UsageProvider } from "./playtime/UsageProvider";
import { UsageNotice } from "./ui/AccountMenu";
import { QuestionFlagProvider } from "./session/QuestionFlagProvider";
import { CloudAccountProvider, downloadCloudRecovery, useCloudAccount } from "./session/cloud/CloudAccount";
import { CloudSyncCoordinator } from "./session/cloud/coordinator";
import { CloudGameSession, cloudCampaignMetadata } from "./session/cloud/gameSession";
import { importLocalCloudCampaign, profileForCloudCampaign, type LocalCloudSource } from "./session/cloud/importCampaigns";
import { CloudCampaignEntry } from "./ui/CloudCampaignEntry";
import { cloudEntryError } from "./ui/cloudEntryError";
import { AccountMenu } from "./ui/AccountMenu";
import { cloudCodec } from "./session/cloud/codecWorker";

const MobileEntryPresentation = lazy(() => import("./mobile/MobileEntryPresentation"));

interface ActivePrototypeGameProps {
  cloudSession?: CloudGameSession;
  onCloudReload?: () => Promise<void>;
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
  onCloudCampaigns,
  loadedProfile,
  onRequestNewCampaign,
  onRequestRestart,
}: ActivePrototypeGameProps) {
  const session = usePrototypeSession(loadedProfile, cloudSession);
  const cloudAccount = useCloudAccount();
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
        onRetry: () => cloudSession.coordinator.retry(),
        onUseAccountSave: async () => {
          const ok = await cloudSession.coordinator.useAccountSave(async bytes => downloadCloudRecovery(bytes));
          if (ok) await onCloudReload?.(); return ok;
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
  useEffect(() => {
    let current = true; setPreparingEntry(true);
    // Start the selected presentation and save worker during account entry.
    // The empty hash warms processing without reading a campaign or acquiring
    // a writer, so Resume still requires the existing takeover decision.
    void Promise.allSettled([preloadPrototypeShell(layout), cloudCodec.run({ kind: "hash", input: "" })]).then(() => {
      // A startup failure must still reach the normal open/recovery error path.
      if (current) setPreparingEntry(false);
    });
    return () => { current = false; };
  }, [layout, runtime]);
  const [route, setRoute] = useState<"entry" | "checking" | "cloud" | "founder">("entry");
  const [active, setActive] = useState<{ session: CloudGameSession; profile: LoadedPrototypeProfile; sequence: number } | null>(null);
  const [notice, setNotice] = useState("");
  const live = useRef(true), generation = useRef(0), current = useRef(active);
  current.current = active;
  useEffect(() => { live.current = true; return () => { live.current = false; generation.current++; }; }, []);
  const openCampaign = async (campaignId: string) => {
    const epoch = ++generation.current; setRoute("checking"); setNotice("");
    const coordinator = new CloudSyncCoordinator({ scope: { backendId: runtime.backendId, accountId: runtime.accountId, campaignId }, transport: runtime.transport, cache: runtime.cache, enabled: true });
    try {
      if (!await coordinator.open()) throw new Error(coordinator.view.failure ?? "network");
      const session = await CloudGameSession.create(coordinator, async id => { await openCampaign(id); });
      if (!live.current || epoch !== generation.current) { session.dispose(); return; }
      const metadata = session.metadata;
      const profile = profileForCloudCampaign(session.state, { ...metadata, status: "resumable" });
      setActive({ session, profile: { profile, notice: "Verified account save. Continue on this device to play." }, sequence: epoch }); setRoute("cloud");
    } catch {
      coordinator.dispose();
      if (live.current && epoch === generation.current) { setNotice("This clinic could not be opened. Your saved copies have been kept. Try again or contact the owner."); setRoute("entry"); }
    }
  };
  const enterCampaignScreen = async () => {
    const session = current.current?.session;
    if (session && route === "cloud") {
      if (!await session.durable()) { setNotice("Recovery storage could not be verified. Keep this tab open and retry."); return; }
      if (["ready", "saving"].includes(session.coordinator.view.phase) && !await session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)) return;
      session.coordinator.pause();
    }
    if (!live.current) return;
    generation.current++; setActive(null); setRoute("entry"); await cloud.refresh();
  };
  useEffect(() => {
    cloud.setCampaignNavigation(() => { void enterCampaignScreen(); });
    return () => cloud.setCampaignNavigation(null);
  }, [runtime, route]);
  const restart = async () => {
    const session = current.current?.session;
    if (!session?.canExecute) return;
    session.updateMetadata({ ...session.metadata, status: "archived" });
    if (!await session.durable() || !await session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)) return;
    if (!live.current) return;
    setNotice("Your campaign was archived and still counts toward your 2 account campaigns. Resume it or start a new campaign.");
    setActive(null); setRoute("entry"); await cloud.refresh();
  };
  if (cloud.phase === "deletion-requested" || cloud.phase === "deleted") return <CloudCampaignEntry onOpen={async () => {}} onCreate={() => {}} />;
  if (route === "checking") return <main className="cloud-entry"><h1>Checking account save…</h1><p role="status">Verifying campaign data and session status before play.</p><AccountMenu /></main>;
  if (route === "cloud" && active) return <ActivePrototypeGame key={`${active.session.coordinator.scope.campaignId}:${active.sequence}`}
    loadedProfile={active.profile} cloudSession={active.session}
    onCloudReload={() => openCampaign(active.session.coordinator.scope.campaignId)} onCloudCampaigns={() => { void enterCampaignScreen(); }}
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
  return <CloudCampaignEntry key={notice} notice={notice} preparing={preparingEntry} onOpen={openCampaign} onCreate={() => setRoute("founder")} />;
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
