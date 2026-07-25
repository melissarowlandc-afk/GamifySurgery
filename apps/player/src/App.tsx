import { useMemo } from "react";
import { AppShell } from "./AppShell";
import {
  createPrototypePlayerView,
  usePrototypeSession,
} from "./session";

export function App() {
  const session = usePrototypeSession();
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
      onCreateCampaign={session.createCampaign}
      onSwitchCampaign={session.switchCampaign}
      onTutorialAction={session.performTutorialAction}
      onTutorialsEnabledChange={session.setTutorialsEnabled}
      onSaveAndPause={session.saveAndPause}
      onRestart={session.restart}
    />
  );
}
