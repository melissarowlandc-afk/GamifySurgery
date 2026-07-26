import { useMemo, useState } from "react";
import { AppShell } from "./AppShell";
import {
  appendLocalCampaign,
  createPrototypePlayerView,
  getActiveCampaign,
  loadPrototypeProfile,
  savePrototypeProfile,
  type LoadedPrototypeProfile,
  type LocalPrototypeProfile,
  usePrototypeSession,
} from "./session";
import { OpeningSequence } from "./ui";

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
      ),
    [
      session.buildMode,
      session.facilityCamera,
      session.placementOrientation,
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
      patients={view.patients}
      chart={view.chart}
      facility={view.facility}
      progression={view.progression}
      roomOptions={view.roomOptions}
      selectedRoomBuild={view.selectedRoomBuild}
      staffRoles={view.staffRoles}
      messages={view.messages}
      systemNotices={session.systemNotices}
      development={view.development}
      emergencyGlp1={view.emergencyGlp1}
      campaigns={session.campaigns}
      tutorialsEnabled={session.tutorialsEnabled}
      tutorialCoachMode={session.tutorialCoachMode}
      tutorialTargetEncounterId={session.tutorialTargetEncounterId}
      tutorialStep={session.tutorialStep}
      workloadStatus={view.workloadStatus}
      announcement={session.announcement}
      onTogglePause={session.togglePause}
      onOpenPatient={session.openPatient}
      onCloseChart={session.closeChart}
      onSubmitAnswer={session.submitAnswer}
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
      placementOrientation={session.placementOrientation}
      onEnterBuildMode={session.enterBuildMode}
      onExitBuildMode={session.exitBuildMode}
      onSelectRoom={session.selectRoom}
      onSellSelectedRoom={session.sellSelectedRoom}
      onUpgradeSelectedRoom={session.upgradeSelectedRoom}
      onFacilityCameraChange={session.setFacilityCamera}
      onHireStaff={session.hireStaff}
      onDecreaseEmployeeSalary={session.decreaseEmployeeSalary}
      onIncreaseEmployeeSalary={session.increaseEmployeeSalary}
      onLevelUp={session.levelUp}
      onFastForward={session.fastForward}
      onAddMoney={session.addMoney}
      onRunEmergencyGlp1Consultation={
        session.runEmergencyGlp1Consultation
      }
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
  sequence: number;
}

interface GameLaunchState {
  mode: "game";
  loadedProfile: LoadedPrototypeProfile;
}

type LaunchState = OpeningLaunchState | GameLaunchState;

function initialLaunchState(): LaunchState {
  const loadedProfile = loadPrototypeProfile();
  return getActiveCampaign(loadedProfile.profile)
    ? {
        mode: "game",
        loadedProfile,
      }
    : {
        mode: "opening",
        profile: loadedProfile.profile,
        sequence: 0,
      };
}

export function App() {
  const [launch, setLaunch] = useState<LaunchState>(initialLaunchState);

  const requestOpening = (
    profile: LocalPrototypeProfile,
    campaignSeed?: string,
  ) => {
    setLaunch((current) => ({
      mode: "opening",
      profile,
      ...(campaignSeed ? { campaignSeed } : {}),
      sequence: current.mode === "opening" ? current.sequence + 1 : 1,
    }));
  };

  if (launch.mode === "opening") {
    return (
      <OpeningSequence
        key={launch.sequence}
        profile={launch.profile}
        campaignSeed={launch.campaignSeed}
        onBeginClinic={(founder, campaignSeed) => {
          const next = appendLocalCampaign(
            launch.profile,
            founder,
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
        onResumeCampaign={() => {
          if (!getActiveCampaign(launch.profile)) {
            return;
          }
          setLaunch({
            mode: "game",
            loadedProfile: {
              profile: launch.profile,
              notice: "Local campaign restored.",
            },
          });
        }}
      />
    );
  }

  const activeCampaign = getActiveCampaign(launch.loadedProfile.profile);
  if (!activeCampaign) {
    return (
      <OpeningSequence
        profile={launch.loadedProfile.profile}
        onBeginClinic={(founder) => {
          const next = appendLocalCampaign(
            launch.loadedProfile.profile,
            founder,
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
        onResumeCampaign={() => undefined}
      />
    );
  }

  return (
    <ActivePrototypeGame
      key={activeCampaign.campaignId}
      loadedProfile={launch.loadedProfile}
      onRequestNewCampaign={(profile) => requestOpening(profile)}
      onRequestRestart={(profile, campaignSeed) =>
        requestOpening(profile, campaignSeed)
      }
    />
  );
}
