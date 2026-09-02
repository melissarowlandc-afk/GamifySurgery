import { useMemo, useState } from "react";
import { AppShell } from "./AppShell";
import {
  appendLocalCampaign,
  archiveLocalCampaign,
  createPrototypePlayerView,
  getActiveCampaign,
  loadPrototypeProfile,
  restoreLocalCampaign,
  savePrototypeProfile,
  selectLocalCampaign,
  type LoadedPrototypeProfile,
  type LocalPrototypeProfile,
  usePrototypeSession,
} from "./session";
import { OpeningSequence } from "./ui";
import { AuthGate } from "./auth/AuthGate";

interface ActivePrototypeGameProps {
  loadedProfile: LoadedPrototypeProfile;
  onRequestNewCampaign: (profile: LocalPrototypeProfile) => void;
  onRequestRestart: (
    profile: LocalPrototypeProfile,
    campaignSeed: string,
  ) => void;
}

function ActivePrototypeGame({
  loadedProfile,
  onRequestNewCampaign,
  onRequestRestart,
}: ActivePrototypeGameProps) {
  const session = usePrototypeSession(loadedProfile);
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
    <AppShell
      resourceBar={view.resourceBar}
      paused={session.state.paused}
      simulationSpeed={session.state.simulationSpeed}
      patients={view.patients}
      chart={view.chart}
      facility={view.facility}
      progression={view.progression}
      roomOptions={view.roomOptions}
      selectedRoomBuild={view.selectedRoomBuild}
      staffRoles={view.staffRoles}
      messages={view.messages}
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
      buildMode={session.buildMode}
      managementMode={session.managementMode}
      buildUndoCount={session.buildUndoCount}
      buildExitBlockedReason={session.buildExitBlockedReason}
      buildExitBlockedIssues={session.buildExitBlockedIssues}
      placementOrientation={session.placementOrientation}
      onEnterBuildMode={session.enterBuildMode}
      onExitBuildMode={session.exitBuildMode}
      onEnterManagementMode={session.enterManagementMode}
      onExitManagementMode={session.exitManagementMode}
      onSelectRoom={session.selectRoom}
      onSellSelectedRoom={session.sellSelectedRoom}
      onUpgradeSelectedRoom={session.upgradeSelectedRoom}
      onPlaceDoor={session.placeDoor}
      onRemoveDoor={session.removeDoor}
      onUndoBuildAction={session.undoBuildAction}
      onFacilityCameraChange={session.setFacilityCamera}
      onHireStaff={session.hireStaff}
      onDecreaseEmployeeSalary={session.decreaseEmployeeSalary}
      onIncreaseEmployeeSalary={session.increaseEmployeeSalary}
      onFireEmployee={session.fireEmployee}
      onCollectLitter={session.collectLitter}
      onRefillWaterCooler={session.refillWaterCooler}
      onPraiseEmployee={session.praiseEmployee}
      onMoveFounder={session.moveFounder}
      onLevelUp={session.levelUp}
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
      onSaveAndPause={session.saveAndPause}
      onRestart={() =>
        onRequestRestart(session.profile, session.state.campaignSeed)
      }
    />
  );
}

interface OpeningLaunchState {
  mode: "opening";
  profile: LocalPrototypeProfile;
  campaignSeed?: string;
  initialStep: "main" | "founder";
  sequence: number;
}

interface GameLaunchState {
  mode: "game";
  loadedProfile: LoadedPrototypeProfile;
}

type LaunchState = OpeningLaunchState | GameLaunchState;

function initialLaunchState(): LaunchState {
  const loadedProfile = loadPrototypeProfile();
  return {
    mode: "opening",
    profile: loadedProfile.profile,
    initialStep: "main",
    sequence: 0,
  };
}

function AuthenticatedPrototype() {
  const [launch, setLaunch] = useState<LaunchState>(initialLaunchState);

  const requestOpening = (
    profile: LocalPrototypeProfile,
    campaignSeed?: string,
    initialStep: "main" | "founder" = "founder",
  ) => {
    setLaunch((current) => ({
      mode: "opening",
      profile,
      ...(campaignSeed ? { campaignSeed } : {}),
      initialStep,
      sequence: current.mode === "opening" ? current.sequence + 1 : 1,
    }));
  };

  const openCampaign = (
    profile: LocalPrototypeProfile,
    campaignId: string,
    notice = "Local campaign restored.",
  ) => {
    const selected = selectLocalCampaign(profile, campaignId);
    savePrototypeProfile(selected);
    setLaunch({
      mode: "game",
      loadedProfile: {
        profile: selected,
        notice,
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
        onBeginClinic={(founder, clinicName, campaignSeed) => {
          const next = appendLocalCampaign(
            launch.profile,
            founder,
            clinicName,
            Date.now(),
            campaignSeed,
          );
          const saved = savePrototypeProfile(next.profile);
          setLaunch({
            mode: "game",
            loadedProfile: {
              profile: next.profile,
              notice: saved
                ? "New clinic campaign created with fresh learning histories."
                : "New clinic campaign created, but local saving is unavailable.",
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
          savePrototypeProfile(restored);
          openCampaign(
            restored,
            campaignId,
            "Archived clinic restored with its original learning history.",
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
        onBeginClinic={(founder, clinicName) => {
          const next = appendLocalCampaign(
            launch.loadedProfile.profile,
            founder,
            clinicName,
          );
          savePrototypeProfile(next.profile);
          setLaunch({
            mode: "game",
            loadedProfile: {
              profile: next.profile,
              notice:
                "New clinic campaign created with fresh learning histories.",
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
          savePrototypeProfile(restored);
          openCampaign(restored, campaignId);
        }}
      />
    );
  }

  return (
    <ActivePrototypeGame
      key={activeCampaign.campaignId}
      loadedProfile={launch.loadedProfile}
      onRequestNewCampaign={(profile) =>
        requestOpening(profile, undefined, "founder")
      }
      onRequestRestart={(profile, campaignSeed) => {
        const archived = archiveLocalCampaign(
          profile,
          activeCampaign.campaignId,
        );
        savePrototypeProfile(archived);
        requestOpening(archived, campaignSeed, "founder");
      }}
    />
  );
}

export function App() {
  return (
    <AuthGate>
      <AuthenticatedPrototype />
    </AuthGate>
  );
}
