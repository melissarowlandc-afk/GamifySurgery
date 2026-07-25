import { useState } from "react";
import {
  FacilityCanvas,
  type FacilityCameraView,
  type FacilityViewModel,
} from "./facility";
import {
  BuildPanel,
  CampaignManager,
  ChartPanel,
  DevelopmentPanel,
  EmergencyGlp1Panel,
  EventMessageBoard,
  HelpDialog,
  PatientLists,
  ResourceBar,
  RestartDialog,
  SaveCloseDialog,
  StaffPanel,
  TutorialCoach,
  type CampaignListItemView,
  type ChartView,
  type DevelopmentView,
  type EmergencyGlp1View,
  type MessageBoardItemView,
  type MessageBoardTargetType,
  type PatientTabView,
  type ProgressionView,
  type ResourceBarView,
  type RoomBuildOptionView,
  type SelectedRoomBuildView,
  type StaffRoleGroupView,
} from "./ui";
import type { RoomOrientation } from "@gamify-surgery/game-domain";

interface AppShellProps {
  resourceBar: ResourceBarView;
  paused: boolean;
  patients: PatientTabView[];
  chart: ChartView | null;
  facility: FacilityViewModel;
  progression: ProgressionView;
  roomOptions: RoomBuildOptionView[];
  selectedRoomBuild: SelectedRoomBuildView | null;
  staffRoles: StaffRoleGroupView[];
  messages: MessageBoardItemView[];
  systemNotices: MessageBoardItemView[];
  development: DevelopmentView;
  emergencyGlp1: EmergencyGlp1View;
  campaigns: CampaignListItemView[];
  tutorialsEnabled: boolean;
  tutorialCoachMode: "intro" | "callout" | null;
  tutorialTargetEncounterId: string | null;
  workloadStatus: string;
  announcement: string;
  buildMode: boolean;
  placementOrientation: RoomOrientation;
  onTogglePause: () => void;
  onOpenPatient: (patientId: string) => void;
  onCloseChart: () => void;
  onSubmitAnswer: (choiceId: string) => void;
  onAcknowledgeTerminalFeedback: () => void;
  onToggleSummary: () => void;
  onFileChart: () => void;
  onBeginPlacement: (roomDefinitionId: string) => void;
  onCancelPlacement: () => void;
  onRotatePlacement: () => void;
  onPlaceRoom: (
    tileX: number,
    tileY: number,
    orientation?: RoomOrientation,
  ) => void;
  onEnterBuildMode: () => void;
  onExitBuildMode: () => void;
  onSelectRoom: (roomInstanceId: string) => void;
  onSellSelectedRoom: () => void;
  onUpgradeSelectedRoom: () => void;
  onFacilityCameraChange: (camera: FacilityCameraView) => void;
  onHireStaff: (staffRoleDefinitionId: string) => void;
  onDecreaseEmployeeSalary: (employeeId: string) => void;
  onIncreaseEmployeeSalary: (employeeId: string) => void;
  onLevelUp: () => void;
  onFastForward: () => void;
  onAddMoney: () => void;
  onRunEmergencyGlp1Consultation: () => void;
  onCreateCampaign: () => void;
  onSwitchCampaign: (campaignId: string) => void;
  onOpenTutorialPatient: () => void;
  onDismissTutorialIntro: () => void;
  onTutorialsEnabledChange: (enabled: boolean) => void;
  onSaveAndPause: () => boolean;
  onRestart: () => void;
}

function clampZoom(value: number): number {
  return Math.max(0.6, Math.min(2.2, Math.round(value * 10) / 10));
}

/**
 * Desktop-first composition. Simulation and rule decisions remain in the
 * domain/session layers; this component coordinates visible workspaces.
 */
export function AppShell({
  resourceBar,
  paused,
  patients,
  chart,
  facility,
  progression,
  roomOptions,
  selectedRoomBuild,
  staffRoles,
  messages,
  systemNotices,
  development,
  emergencyGlp1,
  campaigns,
  tutorialsEnabled,
  tutorialCoachMode,
  tutorialTargetEncounterId,
  workloadStatus,
  announcement,
  buildMode,
  placementOrientation,
  onTogglePause,
  onOpenPatient,
  onCloseChart,
  onSubmitAnswer,
  onAcknowledgeTerminalFeedback,
  onToggleSummary,
  onFileChart,
  onBeginPlacement,
  onCancelPlacement,
  onRotatePlacement,
  onPlaceRoom,
  onEnterBuildMode,
  onExitBuildMode,
  onSelectRoom,
  onSellSelectedRoom,
  onUpgradeSelectedRoom,
  onFacilityCameraChange,
  onHireStaff,
  onDecreaseEmployeeSalary,
  onIncreaseEmployeeSalary,
  onLevelUp,
  onFastForward,
  onAddMoney,
  onRunEmergencyGlp1Consultation,
  onCreateCampaign,
  onSwitchCampaign,
  onOpenTutorialPatient,
  onDismissTutorialIntro,
  onTutorialsEnabledChange,
  onSaveAndPause,
  onRestart,
}: AppShellProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const tutorialTargetName =
    patients.find(
      (patient) => patient.id === tutorialTargetEncounterId,
    )?.name ?? "the first patient";
  const camera = facility.camera ?? { zoom: 1, panX: 0, panY: 0 };

  const handleMessageAction = (
    _itemId: string,
    target?: { type: MessageBoardTargetType; id?: string },
  ) => {
    if (target?.type === "patient" && target.id) {
      onOpenPatient(target.id);
      return;
    }
    if (target?.type === "room" && target.id) {
      if (!buildMode) {
        onEnterBuildMode();
      }
      onSelectRoom(target.id);
      return;
    }
    if (target?.type === "employee") {
      document
        .querySelector<HTMLElement>(".staff-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (target?.type === "goal") {
      const goals = document.querySelector<HTMLDetailsElement>(
        ".resource-goals",
      );
      if (goals) {
        goals.open = true;
        goals.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      return;
    }
    if (target?.type === "emergency_glp1") {
      document
        .querySelector<HTMLElement>(".emergency-glp1-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className={`game-shell${buildMode ? " is-build-mode" : ""}`}>
      <ResourceBar
        view={resourceBar}
        paused={paused}
        onTogglePause={onTogglePause}
        endControls={
          <SaveCloseDialog onSaveAndPause={onSaveAndPause} />
        }
      />

      <main className="game-grid game-grid-workspaces">
        <aside className="left-column patient-rail-column">
          {!buildMode ? (
            <>
              <EmergencyGlp1Panel
                view={emergencyGlp1}
                onConsult={onRunEmergencyGlp1Consultation}
              />
              <PatientLists
                patients={patients}
                onOpen={onOpenPatient}
                tutorialTargetEncounterId={tutorialTargetEncounterId}
                showTutorialCallout={
                  tutorialCoachMode === "callout" && !helpOpen
                }
              />
            </>
          ) : (
            <section className="panel build-mode-instructions">
              <span className="eyebrow">Build Mode</span>
              <h2>Remodel while time is paused</h2>
              <p>
                Use the tools on the right. Room doors must meet a connected
                hallway path back to the Front Desk.
              </p>
            </section>
          )}
          <DevelopmentPanel
            view={development}
            paused={paused}
            tutorialsEnabled={tutorialsEnabled}
            onFastForward={onFastForward}
            onAddMoney={onAddMoney}
            onTogglePause={onTogglePause}
            onRestart={onRestart}
            onTutorialsEnabledChange={onTutorialsEnabledChange}
          />
        </aside>

        <section
          className={`center-column clinic-workspace${
            chart ? " has-open-chart" : ""
          }`}
        >
          <section className="facility-frame" aria-labelledby="facility-title">
            <div className="panel-heading facility-heading">
              <span id="facility-title">{facility.facilityTitle}</span>
              <div className="facility-heading-actions">
                <button
                  className="text-button"
                  type="button"
                  onClick={() =>
                    onFacilityCameraChange({
                      ...camera,
                      zoom: clampZoom(camera.zoom - 0.2),
                    })
                  }
                  aria-label="Zoom facility out"
                >
                  Zoom -
                </button>
                <strong>{Math.round(camera.zoom * 100)}%</strong>
                <button
                  className="text-button"
                  type="button"
                  onClick={() =>
                    onFacilityCameraChange({
                      ...camera,
                      zoom: clampZoom(camera.zoom + 0.2),
                    })
                  }
                  aria-label="Zoom facility in"
                >
                  Zoom +
                </button>
                <button
                  className="text-button"
                  type="button"
                  onClick={() =>
                    onFacilityCameraChange({
                      zoom: 1,
                      panX: 0,
                      panY: 0,
                    })
                  }
                >
                  Center
                </button>
              </div>
            </div>
            <div className="facility-host">
              <FacilityCanvas
                viewModel={facility}
                onPlaceRoom={onPlaceRoom}
                onSelectRoom={onSelectRoom}
                onCameraChange={onFacilityCameraChange}
              />
            </div>
          </section>

          {!buildMode ? (
            <ChartPanel
              chart={chart}
              onClose={onCloseChart}
              onSubmitAnswer={onSubmitAnswer}
              onAcknowledgeTerminalFeedback={
                onAcknowledgeTerminalFeedback
              }
              onToggleSummary={onToggleSummary}
              onFileChart={onFileChart}
            />
          ) : null}
        </section>

        <aside className="right-column operations-column">
          <BuildPanel
            buildMode={buildMode}
            cashLabel={resourceBar.moneyLabel}
            roomOptions={roomOptions}
            selectedRoom={selectedRoomBuild}
            placementOrientation={placementOrientation}
            onEnterBuildMode={onEnterBuildMode}
            onExitBuildMode={onExitBuildMode}
            onSelectRoom={onBeginPlacement}
            onCancelPlacement={onCancelPlacement}
            onRotatePlacement={onRotatePlacement}
            onUpgradeSelectedRoom={onUpgradeSelectedRoom}
            onSellSelectedRoom={onSellSelectedRoom}
          />

          {!buildMode ? (
            <>
              <StaffPanel
                roles={staffRoles}
                onHire={onHireStaff}
                onDecreaseSalary={onDecreaseEmployeeSalary}
                onIncreaseSalary={onIncreaseEmployeeSalary}
              />
              <EventMessageBoard
                items={[...messages, ...systemNotices]}
                onAction={handleMessageAction}
                mode="ticker"
              />
            </>
          ) : null}
        </aside>
      </main>

      <TutorialCoach
        visible={tutorialCoachMode === "intro" && !helpOpen && !buildMode}
        patientName={tutorialTargetName}
        onOpenPatient={onOpenTutorialPatient}
        onDismiss={onDismissTutorialIntro}
      />

      <footer className="footer-bar">
        <div className="footer-status">
          <strong>
            {paused ? "Facility paused" : "Facility operating"}
          </strong>
          <span>{workloadStatus}</span>
          {progression.canLevelUp ? (
            <button
              className="button button-primary"
              type="button"
              onClick={onLevelUp}
              disabled={buildMode}
            >
              Advance to {progression.nextLevelLabel}
            </button>
          ) : progression.prototypeComplete ? (
            <strong className="prototype-complete">
              Level 1 complete — Level 2 is locked in this prototype.
            </strong>
          ) : null}
        </div>
        <div className="footer-actions">
          <HelpDialog
            paused={paused}
            onTogglePause={onTogglePause}
            onOpenChange={setHelpOpen}
          />
          <CampaignManager
            campaigns={campaigns}
            onCreateCampaign={onCreateCampaign}
            onSwitchCampaign={onSwitchCampaign}
          />
          <RestartDialog
            paused={paused}
            onTogglePause={onTogglePause}
            onRestart={onRestart}
          />
        </div>
      </footer>

      <p className="screen-reader-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
