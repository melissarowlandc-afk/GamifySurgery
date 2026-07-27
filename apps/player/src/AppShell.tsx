import { useEffect, useState } from "react";
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
  GoalsPanel,
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
import type {
  CardinalDirection,
  RoomOrientation,
  SimulationSpeed,
} from "@gamify-surgery/game-domain";
import type {
  TutorialActionId,
  TutorialStepView,
} from "./session";

interface AppShellProps {
  resourceBar: ResourceBarView;
  paused: boolean;
  simulationSpeed: SimulationSpeed;
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
  tutorialStep: TutorialStepView | null;
  workloadStatus: string;
  announcement: string;
  buildMode: boolean;
  buildUndoCount: number;
  buildExitBlockedReason: string | null;
  placementOrientation: RoomOrientation;
  onTogglePause: () => void;
  onSimulationSpeedChange: (speed: SimulationSpeed) => void;
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
  onRotateSelectedRoom: () => void;
  onBeginMoveSelectedRoom: () => void;
  onPlaceDoorForSelectedRoom: (
    side: CardinalDirection,
    offset: number,
  ) => void;
  onRemoveDoor: (doorId: string) => void;
  onUndoBuildAction: () => void;
  onFacilityCameraChange: (camera: FacilityCameraView) => void;
  onHireStaff: (staffRoleDefinitionId: string) => void;
  onDecreaseEmployeeSalary: (employeeId: string) => void;
  onIncreaseEmployeeSalary: (employeeId: string) => void;
  onCollectLitter: (litterId: string) => void;
  onRefillWaterCooler: () => void;
  onPraiseEmployee: (employeeId: string) => void;
  onLevelUp: () => void;
  onFastForward: () => void;
  onAddMoney: () => void;
  onRunEmergencyGlp1Consultation: () => void;
  onCreateCampaign: () => void;
  onSwitchCampaign: (campaignId: string) => void;
  onTutorialAction: (actionId: TutorialActionId) => void;
  onTutorialsEnabledChange: (enabled: boolean) => void;
  onSaveAndPause: () => boolean;
  onRestart: () => void;
}

function clampZoom(value: number): number {
  return Math.max(0.1, Math.min(2.5, Math.round(value * 10) / 10));
}

/**
 * Desktop-first composition. Simulation and rule decisions remain in the
 * domain/session layers; this component coordinates visible workspaces.
 */
export function AppShell({
  resourceBar,
  paused,
  simulationSpeed,
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
  tutorialStep,
  workloadStatus,
  announcement,
  buildMode,
  buildUndoCount,
  buildExitBlockedReason,
  placementOrientation,
  onTogglePause,
  onSimulationSpeedChange,
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
  onRotateSelectedRoom,
  onBeginMoveSelectedRoom,
  onPlaceDoorForSelectedRoom,
  onRemoveDoor,
  onUndoBuildAction,
  onFacilityCameraChange,
  onHireStaff,
  onDecreaseEmployeeSalary,
  onIncreaseEmployeeSalary,
  onCollectLitter,
  onRefillWaterCooler,
  onPraiseEmployee,
  onLevelUp,
  onFastForward,
  onAddMoney,
  onRunEmergencyGlp1Consultation,
  onCreateCampaign,
  onSwitchCampaign,
  onTutorialAction,
  onTutorialsEnabledChange,
  onSaveAndPause,
  onRestart,
}: AppShellProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [locatedPatientId, setLocatedPatientId] = useState<string | null>(
    null,
  );
  const [praiseCandidateId, setPraiseCandidateId] = useState<
    string | null
  >(null);
  const camera = facility.camera ?? { zoom: 1, panX: 0, panY: 0 };

  useEffect(() => {
    if (!locatedPatientId) {
      return;
    }
    const timer = window.setTimeout(() => {
      setLocatedPatientId(null);
    }, 2_500);
    return () => window.clearTimeout(timer);
  }, [locatedPatientId]);

  const openAndLocatePatient = (patientId: string) => {
    setLocatedPatientId(patientId);
    onOpenPatient(patientId);
  };
  const praiseCandidate = praiseCandidateId
    ? facility.staff.find(
        (employee) => employee.instanceId === praiseCandidateId,
      )
    : null;

  const handleMessageAction = (
    _itemId: string,
    target?: { type: MessageBoardTargetType; id?: string },
  ) => {
    if (target?.type === "patient" && target.id) {
      openAndLocatePatient(target.id);
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
      document
        .querySelector<HTMLElement>(".goals-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }
    if (target?.type === "emergency_glp1") {
      document
        .querySelector<HTMLElement>(".emergency-glp1-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      className={`game-shell${buildMode ? " is-build-mode" : ""}${
        chart ? " has-open-chart" : ""
      }`}
    >
      <ResourceBar
        view={resourceBar}
        paused={paused}
        pauseLocked={buildMode}
        simulationSpeed={simulationSpeed}
        onTogglePause={onTogglePause}
        onSimulationSpeedChange={onSimulationSpeedChange}
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
                onOpen={openAndLocatePatient}
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
                Use the construction tools on the desk. Place a room
                footprint, then select it to add zero-cost doors and validate
                access.
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
                      zoom: clampZoom(camera.zoom - 0.1),
                    })
                  }
                  disabled={camera.zoom <= 0.1}
                  aria-label="Zoom facility out"
                  title="Zoom out"
                >
                  −
                </button>
                <strong>{Math.round(camera.zoom * 100)}%</strong>
                <button
                  className="text-button"
                  type="button"
                  onClick={() =>
                    onFacilityCameraChange({
                      ...camera,
                      zoom: clampZoom(camera.zoom + 0.1),
                    })
                  }
                  disabled={camera.zoom >= 2.5}
                  aria-label="Zoom facility in"
                  title="Zoom in"
                >
                  +
                </button>
              </div>
            </div>
            <div className="facility-host">
              <FacilityCanvas
                viewModel={{
                  ...facility,
                  selectedPatientInstanceId: locatedPatientId,
                }}
                onPlaceRoom={onPlaceRoom}
                onSelectRoom={onSelectRoom}
                onCollectLitter={onCollectLitter}
                onRefillWaterCooler={onRefillWaterCooler}
                onPraiseEmployee={setPraiseCandidateId}
                onCameraChange={onFacilityCameraChange}
              />
            </div>
            {praiseCandidate ? (
              <div
                className="map-interaction-menu"
                role="dialog"
                aria-label={`Interact with ${praiseCandidate.displayName}`}
              >
                <strong>{praiseCandidate.displayName}</strong>
                <span>{praiseCandidate.roleDisplayName}</span>
                <div>
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => {
                      onPraiseEmployee(praiseCandidate.instanceId);
                      setPraiseCandidateId(null);
                    }}
                  >
                    Praise Employee
                  </button>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => setPraiseCandidateId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
            {paused ? (
              <div
                className={`facility-pause-indicator${
                  buildMode ? " is-build-mode" : ""
                }`}
                role="status"
              >
                <strong>
                  {buildMode ? "BUILD MODE" : "GAME PAUSED"}
                </strong>
                <span>
                  {buildMode
                    ? "Facility time is stopped while you remodel."
                    : "Patients and facility time are waiting for you."}
                </span>
              </div>
            ) : null}
          </section>

          <section
            className={`desk-workspace${chart ? " has-chart" : ""}${
              buildMode ? " is-build-desk" : ""
            }`}
            aria-label={buildMode ? "Construction desk" : "Clinical desk"}
          >
            <div className="desk-surface-details" aria-hidden="true">
              <span className="desk-pencil" />
              <span className="desk-paper-corner" />
            </div>
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
              onRotateSelectedRoom={onRotateSelectedRoom}
              onBeginMoveSelectedRoom={onBeginMoveSelectedRoom}
              onPlaceDoorForSelectedRoom={
                onPlaceDoorForSelectedRoom
              }
              onRemoveDoor={onRemoveDoor}
              onUndoBuildAction={onUndoBuildAction}
              undoCount={buildUndoCount}
              exitBlockedReason={buildExitBlockedReason}
            />
            {!buildMode ? (
              chart ? (
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
              ) : (
                <div className="empty-desk-message">
                  <span className="empty-desk-paper" aria-hidden="true" />
                  <strong>Clinical desk</strong>
                  <span>Open a patient chart to place it here.</span>
                </div>
              )
            ) : null}
          </section>
        </section>

        <aside className="right-column operations-column">
          <GoalsPanel
            view={progression}
            onLevelUp={onLevelUp}
          />

          <StaffPanel
            roles={staffRoles}
            onHire={onHireStaff}
            onDecreaseSalary={onDecreaseEmployeeSalary}
            onIncreaseSalary={onIncreaseEmployeeSalary}
          />

          {!buildMode ? (
            <EventMessageBoard
              items={[...messages, ...systemNotices]}
              onAction={handleMessageAction}
              mode="ticker"
              maximumVisibleItems={7}
            />
          ) : null}
        </aside>
      </main>

      <TutorialCoach
        step={helpOpen ? null : tutorialStep}
        onAction={onTutorialAction}
        onDisableTutorials={() => onTutorialsEnabledChange(false)}
      />

      <footer className="footer-bar">
        <div className="footer-status">
          <strong>
            {paused ? "Facility paused" : "Facility operating"}
          </strong>
          <span>{workloadStatus}</span>
          {progression.prototypeComplete ? (
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
