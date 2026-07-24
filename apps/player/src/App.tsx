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
      ),
    [
      session.selectedRoomDefinitionId,
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
      staffOptions={view.staffOptions}
      development={view.development}
      campaigns={session.campaigns}
      tutorialsEnabled={session.tutorialsEnabled}
      tutorialCoachMode={session.tutorialCoachMode}
      tutorialTargetEncounterId={session.tutorialTargetEncounterId}
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
      onPlaceRoom={session.placeRoom}
      onHireStaff={session.hireStaff}
      onLevelUp={session.levelUp}
      onFastForward={session.fastForward}
      onCreateCampaign={session.createCampaign}
      onSwitchCampaign={session.switchCampaign}
      onOpenTutorialPatient={session.openTutorialPatient}
      onDismissTutorialIntro={session.dismissTutorialIntro}
      onTutorialsEnabledChange={session.setTutorialsEnabled}
      onRestart={session.restart}
    />
  );
}
