import { FacilityCanvas, type FacilityViewModel } from "./facility";
import {
  BuildPanel,
  CampaignManager,
  ChartPanel,
  DevelopmentPanel,
  GoalsPanel,
  PatientLists,
  ResourceBar,
  RestartDialog,
  type CampaignListItemView,
  type ChartView,
  type DevelopmentView,
  type PatientTabView,
  type ProgressionView,
  type ResourceBarView,
  type RoomBuildOptionView,
  type StaffHireOptionView,
} from "./ui";

interface AppShellProps {
  resourceBar: ResourceBarView;
  paused: boolean;
  patients: PatientTabView[];
  chart: ChartView | null;
  facility: FacilityViewModel;
  progression: ProgressionView;
  roomOptions: RoomBuildOptionView[];
  staffOptions: StaffHireOptionView[];
  development: DevelopmentView;
  campaigns: CampaignListItemView[];
  workloadStatus: string;
  announcement: string;
  onTogglePause: () => void;
  onOpenPatient: (patientId: string) => void;
  onCloseChart: () => void;
  onSubmitAnswer: (choiceId: string) => void;
  onAcknowledgeTerminalFeedback: () => void;
  onToggleSummary: () => void;
  onFileChart: () => void;
  onBeginPlacement: (roomDefinitionId: string) => void;
  onCancelPlacement: () => void;
  onPlaceRoom: (tileX: number, tileY: number) => void;
  onHireStaff: (staffRoleDefinitionId: string) => void;
  onLevelUp: () => void;
  onFastForward: () => void;
  onCreateCampaign: () => void;
  onSwitchCampaign: (campaignId: string) => void;
  onRestart: () => void;
}

/**
 * Responsive composition only. Simulation state and transitions are supplied
 * by the parent so the React and Phaser layers cannot invent gameplay rules.
 */
export function AppShell({
  resourceBar,
  paused,
  patients,
  chart,
  facility,
  progression,
  roomOptions,
  staffOptions,
  development,
  campaigns,
  workloadStatus,
  announcement,
  onTogglePause,
  onOpenPatient,
  onCloseChart,
  onSubmitAnswer,
  onAcknowledgeTerminalFeedback,
  onToggleSummary,
  onFileChart,
  onBeginPlacement,
  onCancelPlacement,
  onPlaceRoom,
  onHireStaff,
  onLevelUp,
  onFastForward,
  onCreateCampaign,
  onSwitchCampaign,
  onRestart,
}: AppShellProps) {
  return (
    <div className="game-shell">
      <ResourceBar
        view={resourceBar}
        paused={paused}
        onTogglePause={onTogglePause}
      />

      <main className="game-grid">
        <div className="left-column">
          <PatientLists patients={patients} onOpen={onOpenPatient} />
        </div>

        <div className="center-column">
          <section className="facility-frame" aria-labelledby="facility-title">
            <div className="panel-heading">
              <span id="facility-title">{facility.facilityTitle}</span>
              <small>
                {facility.placement
                  ? `Place ${facility.placement.displayName}`
                  : paused
                    ? "Facility paused"
                    : "Facility operating"}
              </small>
            </div>
            <div className="facility-host">
              <FacilityCanvas
                viewModel={facility}
                onPlaceRoom={onPlaceRoom}
              />
            </div>
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
          </section>
        </div>

        <div className="right-column">
          <GoalsPanel
            view={progression}
            paused={paused}
            workloadStatus={workloadStatus}
            onLevelUp={onLevelUp}
          />
          <BuildPanel
            roomOptions={roomOptions}
            staffOptions={staffOptions}
            onSelectRoom={onBeginPlacement}
            onCancelPlacement={onCancelPlacement}
            onHireStaff={onHireStaff}
          />
          <DevelopmentPanel
            view={development}
            onFastForward={onFastForward}
          />
        </div>
      </main>

      <footer className="footer-bar">
        <span>
          Synthetic local prototype · no real patient information · no data
          leaves this browser
        </span>
        <div className="footer-actions">
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
