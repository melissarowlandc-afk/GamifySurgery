import { clinicFeedForTutorial } from "./session/tutorialTipsIntegration";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EmployeeDiscussionPanel } from "./ui/EmployeeDiscussionPanel";
import { RoomActionMenu, type RoomMenuAnchor } from "./ui/RoomActionMenu";
import { ClinicHeadline } from "./ui/ClinicHeadline";
import type {
  EmployeeDiscussionTabView,
  EmployeeDiscussionView,
  LockedRoomBuildView,
  OwnedRoomBuildView,
} from "./ui/types";
import type { GridPoint } from "@gamify-surgery/game-domain";
import {
  FacilityCanvas,
  type BuildDoorTool,
  type FacilityCameraView,
  type FacilityViewModel,
} from "./facility";
import type { DescribeCharacterRequest } from "./facility/types";
import {
  AdvertisingPanel,
  BuildPanel,
  CampaignManager,
  CharacterQaGallery,
  ChartPanel,
  DevelopmentPanel,
  EmergencyGlp1Panel,
  EventMessageBoard,
  GoalsPanel,
  HelpDialog,
  ManagementPanel,
  PatientLists,
  QuestionReviewQueueDialog,
  ResourceBar,
  RestartDialog,
  SaveCloseDialog,
  TutorialCoach,
  WorkspaceSplitter,
  type CampaignListItemView,
  type AdvertisingView,
  type ChartView,
  type DevelopmentView,
  type ProcedureSetupRequirementView,
  type EmergencyGlp1View,
  type MessageBoardItemView,
  type MessageBoardTargetType,
  type NeedsYouItemView,
  type ClinicAlertAction,
  type ClinicAlertActionResult,
  type PatientTabView,
  type ProgressionView,
  type ResourceBarView,
  type RoomBuildOptionView,
  type SelectedRoomBuildView,
  type ServiceIncomeView,
  type StaffRoleGroupView,
  type StaffTrainingOverviewView,
} from "./ui";
import {
  cancelScheduledAnimationFrame,
  scheduleLatestAnimationFrame,
} from "./ui/animationFrameTask";
import {
  getWorkspaceStorage,
  readWorkspaceMapShare,
  writeWorkspaceMapShare,
} from "./ui/workspaceSplitPreference";
import type {
  CardinalDirection,
  RoomOrientation,
  SimulationSpeed,
} from "@gamify-surgery/game-domain";
import type {
  QuestionReviewFlag,
  QuestionReviewFlagStatus,
  PrototypeSaveResult,
  TutorialActionId,
  TutorialStepView,
} from "./session";

interface AppShellProps {
  resourceBar: ResourceBarView;
  paused: boolean;
  simulationSpeed: SimulationSpeed;
  patients: PatientTabView[];
  chart: ChartView | null;
  employeeDiscussionRows?: EmployeeDiscussionTabView[];
  employeeDiscussion?: EmployeeDiscussionView | null;
  onOpenEmployeeDiscussion?: (id: string) => void;
  onCloseEmployeeDiscussion?: () => void;
  onAnswerEmployeeDiscussion?: (id: string) => void;
  onAcknowledgeEmployeeDiscussion?: () => void;
  onFileEmployeeDiscussion?: () => void;
  facility: FacilityViewModel;
  progression: ProgressionView;
  roomOptions: RoomBuildOptionView[];
  ownedRooms?: OwnedRoomBuildView[];
  lockedRoomOptions?: LockedRoomBuildView[];
  selectedRoomBuild: SelectedRoomBuildView | null;
  staffRoles: StaffRoleGroupView[];
  staffTraining?: StaffTrainingOverviewView | null;
  serviceIncome: ServiceIncomeView;
  messages: MessageBoardItemView[];
  needsYou?: NeedsYouItemView[];
  onClinicAlertAction?: (action: ClinicAlertAction) => ClinicAlertActionResult;
  systemNotices: MessageBoardItemView[];
  questionReviewFlags: QuestionReviewFlag[];
  development: DevelopmentView;
  emergencyGlp1: EmergencyGlp1View;
  advertising: AdvertisingView;
  campaigns: CampaignListItemView[];
  tutorialsEnabled: boolean;
  tutorialTargetEncounterId: string | null;
  tutorialStep: TutorialStepView | null;
  workloadStatus: string;
  patientAvailabilityGuidance?: string | null;
  announcement: string;
  buildMode: boolean;
  managementMode: boolean;
  buildUndoCount: number;
  buildUndoLabel?: string | null;
  movingRoomInstanceId?: string | null;
  buildExitBlockedReason: string | null;
  buildExitBlockedIssues: string[];
  placementOrientation: RoomOrientation;
  onTogglePause: () => void;
  onSimulationSpeedChange: (speed: SimulationSpeed) => void;
  onOpenPatient: (patientId: string) => void;
  onCloseChart: () => void;
  onSubmitAnswer: (choiceId: string) => void;
  onFlagQuestion: (decisionNodeId: string) => void;
  onQuestionReviewStatusChange: (
    flagId: string,
    status: QuestionReviewFlagStatus,
  ) => void;
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
  ) => boolean;
  onEnterBuildMode: () => void;
  onExitBuildMode: () => void;
  onEnterManagementMode: () => void;
  onExitManagementMode: () => void;
  onServiceAppointmentsEnabledChange: (enabled: boolean) => void;
  onStartLaboratoryProcessing: () => void;
  onSelectRoom: (roomInstanceId: string) => void;
  onSellSelectedRoom: (roomId: string, saleConfirmationToken?: string) => void;
  onUpgradeSelectedRoom: () => void;
  onUpgradeRoom?: (roomId: string) => void;
  onBeginMoveSelectedRoom?: () => void;
  onPlaceDoor: (
    roomId: string,
    side: CardinalDirection,
    offset: number,
  ) => void;
  onRemoveDoor: (doorId: string) => void;
  onUndoBuildAction: () => void;
  onFacilityCameraChange: (camera: FacilityCameraView) => void;
  onHireStaff: (staffRoleDefinitionId: string) => void;
  onDecreaseEmployeeSalary: (employeeId: string) => void;
  onIncreaseEmployeeSalary: (employeeId: string) => void;
  onFireEmployee: (employeeId: string) => void;
  onTrainEmployee?: (employeeId: string) => void;
  onCollectLitter: (litterId: string) => void;
  onRefillWaterCooler: () => void;
  onSeatFounderAtFrontDesk: () => boolean;
  onSeatFounderInChair: (roomInstanceId: string, location: GridPoint, seatId?: string) => boolean;
  onDescribeCharacter?: DescribeCharacterRequest;
  onPraiseEmployee: (employeeId: string) => void;
  onMoveFounder: (destination: GridPoint) => boolean;
  onLevelUp: () => void;
  onFastForward: () => void;
  onAddMoney: () => void;
  onRunEmergencyGlp1Consultation: () => void;
  onAdvertisingLevelChange: (level: number) => void;
  onCreateCampaign: () => void;
  onSwitchCampaign: (campaignId: string) => void;
  onTutorialAction: (actionId: TutorialActionId) => void;
  onTutorialsEnabledChange: (enabled: boolean) => void;
  onReplayFirstShift?: () => void;
  onReferencePauseLockedChange?: (locked: boolean) => void;
  onTutorialTopicExposure?: (topicIds: readonly string[]) => void;
  onSaveAndPause: () => PrototypeSaveResult;
  onClearLocalCampaigns: () => boolean;
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
  employeeDiscussionRows = [],
  employeeDiscussion = null,
  onOpenEmployeeDiscussion = () => {},
  onCloseEmployeeDiscussion = () => {},
  onAnswerEmployeeDiscussion = () => {},
  onAcknowledgeEmployeeDiscussion = () => {},
  onFileEmployeeDiscussion = () => {},
  facility,
  progression,
  roomOptions,
  ownedRooms = [],
  lockedRoomOptions = [],
  selectedRoomBuild,
  staffRoles,
  staffTraining = null,
  serviceIncome,
  messages,
  needsYou = [],
  onClinicAlertAction,
  systemNotices,
  questionReviewFlags,
  development,
  emergencyGlp1,
  advertising,
  campaigns,
  tutorialsEnabled,
  tutorialTargetEncounterId,
  tutorialStep,
  workloadStatus,
  patientAvailabilityGuidance = null,
  announcement,
  buildMode,
  managementMode,
  buildUndoCount,
  buildUndoLabel = null,
  movingRoomInstanceId = null,
  buildExitBlockedReason,
  buildExitBlockedIssues,
  placementOrientation,
  onTogglePause,
  onSimulationSpeedChange,
  onOpenPatient,
  onCloseChart,
  onSubmitAnswer,
  onFlagQuestion,
  onQuestionReviewStatusChange,
  onAcknowledgeTerminalFeedback,
  onToggleSummary,
  onFileChart,
  onBeginPlacement,
  onCancelPlacement,
  onRotatePlacement,
  onPlaceRoom,
  onEnterBuildMode,
  onExitBuildMode,
  onEnterManagementMode,
  onExitManagementMode,
  onServiceAppointmentsEnabledChange,
  onStartLaboratoryProcessing,
  onSelectRoom,
  onSellSelectedRoom,
  onUpgradeSelectedRoom,
  onUpgradeRoom,
  onBeginMoveSelectedRoom,
  onPlaceDoor,
  onRemoveDoor,
  onUndoBuildAction,
  onFacilityCameraChange,
  onHireStaff,
  onDecreaseEmployeeSalary,
  onIncreaseEmployeeSalary,
  onFireEmployee,
  onTrainEmployee,
  onCollectLitter,
  onRefillWaterCooler,
  onSeatFounderAtFrontDesk,
  onSeatFounderInChair,
  onDescribeCharacter,
  onPraiseEmployee,
  onMoveFounder,
  onLevelUp,
  onFastForward,
  onAddMoney,
  onRunEmergencyGlp1Consultation,
  onAdvertisingLevelChange,
  onCreateCampaign,
  onSwitchCampaign,
  onTutorialAction,
  onTutorialsEnabledChange,
  onReplayFirstShift,
  onReferencePauseLockedChange,
  onTutorialTopicExposure,
  onSaveAndPause,
  onClearLocalCampaigns,
  onRestart,
}: AppShellProps) {
  const clinicWorkspaceRef = useRef<HTMLElement>(null);
  const [workspaceMapShare, setWorkspaceMapShare] = useState(() =>
    readWorkspaceMapShare(getWorkspaceStorage()),
  );
  const [helpOpen, setHelpOpen] = useState(false);
  const [questionReviewQueueOpen, setQuestionReviewQueueOpen] =
    useState(false);
  const [locatedPatientId, setLocatedPatientId] = useState<string | null>(
    null,
  );
  const [praiseCandidateId, setPraiseCandidateId] = useState<
    string | null
  >(null);
  // Build Mode room menu: opened by clicking a room (map, My Rooms or a
  // message), anchored to the rectangle the map reports for that room.
  const [roomMenuOpen, setRoomMenuOpen] = useState(false);
  const [selectedRoomRect, setSelectedRoomRect] =
    useState<RoomMenuAnchor | null>(null);
  const facilityHostRef = useRef<HTMLDivElement>(null);
  const [buildDoorTool, setBuildDoorTool] =
    useState<BuildDoorTool>(null);
  const [waterCoolerHighlightKey, setWaterCoolerHighlightKey] =
    useState(0);
  const [highlightedStaffRoleId, setHighlightedStaffRoleId] =
    useState<string | null>(null);
  const [highlightedEmployeeId, setHighlightedEmployeeId] =
    useState<string | null>(null);
  const [requestedTipTraining, setRequestedTipTraining] = useState<{ employeeId: string; requestKey: number } | null>(null);
  useEffect(() => {
    if (!managementMode) setRequestedTipTraining(null);
  }, [managementMode]);
  const [advertisingHighlightKey, setAdvertisingHighlightKey] =
    useState(0);
  const [highlightedLitterId, setHighlightedLitterId] =
    useState<string | null>(null);
  const [pendingProcedureSetupAction, setPendingProcedureSetupAction] = useState<NonNullable<ProcedureSetupRequirementView["action"]> | null>(null);
  const messageActionFrameRef = useRef<number | null>(null);
  const [clinicActionFailures, setClinicActionFailures] = useState<Record<string, string>>({});
  const dailyRoutineHighlightTipRef = useRef<string | null>(null);
  const activeCampaignId =
    campaigns.find((campaign) => campaign.active)?.campaignId ?? null;
  const camera = facility.camera ?? { zoom: 1, panX: 0, panY: 0 };
  useEffect(() => { setClinicActionFailures({}); }, [activeCampaignId]);
  const developmentToolPreference = new URLSearchParams(
    window.location.search,
  ).get("prototype-tools");
  const showDevelopmentTools =
    import.meta.env.DEV &&
    (developmentToolPreference === "1" ||
      (developmentToolPreference !== "0" &&
        window.navigator.webdriver));
  const showCharacterQa =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("visual-qa") ===
      "characters";
  const showQuestionReviewQueue =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("question-review") ===
      "1";

  useEffect(() => {
    writeWorkspaceMapShare(getWorkspaceStorage(), workspaceMapShare);
  }, [workspaceMapShare]);

  useEffect(() => {
    if (!locatedPatientId) {
      return;
    }
    const timer = window.setTimeout(() => {
      setLocatedPatientId(null);
    }, 2_500);
    return () => window.clearTimeout(timer);
  }, [locatedPatientId]);

  useEffect(
    () => () => {
      cancelScheduledAnimationFrame(messageActionFrameRef);
    },
    [activeCampaignId],
  );

  useEffect(() => {
    if (!buildMode) {
      setBuildDoorTool(null);
      setRoomMenuOpen(false);
    }
  }, [buildMode]);

  useEffect(() => {
    const action = pendingProcedureSetupAction;
    if (!action) return;
    if (action.target === "room") {
      if (managementMode) {
        onExitManagementMode();
        return;
      }
      if (!buildMode) {
        onEnterBuildMode();
        return;
      }
      onBeginPlacement(action.id);
      setPendingProcedureSetupAction(null);
      return;
    }
    if (buildMode) {
      onExitBuildMode();
      return;
    }
    if (!managementMode) {
      onEnterManagementMode();
      return;
    }
    setHighlightedStaffRoleId(null);
    scheduleLatestAnimationFrame(messageActionFrameRef, () => {
      setHighlightedStaffRoleId(action.id);
    });
    setPendingProcedureSetupAction(null);
  }, [buildMode, managementMode, onBeginPlacement, onEnterBuildMode, onEnterManagementMode, onExitBuildMode, onExitManagementMode, pendingProcedureSetupAction]);

  useEffect(() => {
    if (waterCoolerHighlightKey === 0) {
      return;
    }
    const timer = window.setTimeout(() => {
      setWaterCoolerHighlightKey(0);
    }, 4_000);
    return () => window.clearTimeout(timer);
  }, [waterCoolerHighlightKey]);

  useEffect(() => {
    if (!highlightedStaffRoleId) {
      return;
    }
    const timer = window.setTimeout(() => {
      setHighlightedStaffRoleId(null);
    }, 4_000);
    return () => window.clearTimeout(timer);
  }, [highlightedStaffRoleId]);

  useEffect(() => {
    if (!highlightedEmployeeId) {
      return;
    }
    const timer = window.setTimeout(() => {
      setHighlightedEmployeeId(null);
    }, 4_000);
    return () => window.clearTimeout(timer);
  }, [highlightedEmployeeId]);

  useEffect(() => {
    if (advertisingHighlightKey === 0) {
      return;
    }
    const timer = window.setTimeout(() => {
      setAdvertisingHighlightKey(0);
    }, 4_000);
    return () => window.clearTimeout(timer);
  }, [advertisingHighlightKey]);

  useEffect(() => {
    if (!highlightedLitterId) {
      return;
    }
    const timer = window.setTimeout(() => {
      setHighlightedLitterId(null);
    }, 4_000);
    return () => window.clearTimeout(timer);
  }, [highlightedLitterId]);

  useEffect(() => {
    if (dailyRoutineHighlightTipRef.current === tutorialStep?.id) return;
    dailyRoutineHighlightTipRef.current = tutorialStep?.id ?? null;
    if (tutorialStep?.id === "sendout-water") {
      setWaterCoolerHighlightKey((current) => current + 1);
    }
    if (tutorialStep?.id === "sendout-trash" && facility.litterItems?.[0]) {
      setHighlightedLitterId(facility.litterItems[0].instanceId);
    }
  }, [tutorialStep?.id]);

  const openAndLocatePatient = (patientId: string) => {
    setLocatedPatientId(patientId);
    onOpenPatient(patientId);
  };
  const praiseCandidate = praiseCandidateId
    ? facility.staff.find(
        (employee) => employee.instanceId === praiseCandidateId,
      )
    : null;

  const placementActive = roomOptions.some((room) => room.selected);
  const roomMenuVisible =
    buildMode && roomMenuOpen && !buildDoorTool && !placementActive;
  const openRoomMenu = (roomInstanceId: string) => {
    onSelectRoom(roomInstanceId);
    setBuildDoorTool(null);
    setRoomMenuOpen(true);
  };
  // After a new room lands, the Doors tool turns on so its walls light up.
  const placeRoomAndArmDoors = (
    tileX: number,
    tileY: number,
    orientation?: RoomOrientation,
  ): boolean => {
    const placingNewRoom =
      !movingRoomInstanceId &&
      roomOptions.some(
        (room) => room.selected && room.id !== "room.hallway",
      );
    const placed = onPlaceRoom(tileX, tileY, orientation);
    if (placed) {
      setRoomMenuOpen(false);
      if (placingNewRoom) {
        setBuildDoorTool("place");
      }
    }
    return placed;
  };

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
      setRoomMenuOpen(true);
      return;
    }
    if (target?.type === "employee" && target.id) {
      if (!managementMode) {
        onEnterManagementMode();
      }
      setHighlightedEmployeeId(target.id);
      scheduleLatestAnimationFrame(messageActionFrameRef, () => {
        const employeeElement = [
          ...document.querySelectorAll<HTMLElement>(
            "[data-employee-id]",
          ),
        ].find(
          (element) => element.dataset.employeeId === target.id,
        );
        employeeElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        employeeElement?.focus({ preventScroll: true });
      });
      return;
    }
    if (target?.type === "staff_role" && target.id) {
      if (!managementMode) {
        onEnterManagementMode();
      }
      setHighlightedStaffRoleId(target.id);
      scheduleLatestAnimationFrame(messageActionFrameRef, () => {
        const roleElement = [
          ...document.querySelectorAll<HTMLElement>(
            "[data-staff-role-id]",
          ),
        ].find(
          (element) => element.dataset.staffRoleId === target.id,
        );
        roleElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        const hireButton =
          roleElement?.querySelector<HTMLButtonElement>(
            "[data-staff-role-hire]:not(:disabled)",
          );
        (hireButton ?? roleElement)?.focus({ preventScroll: true });
      });
      return;
    }
    if (target?.type === "water_cooler") {
      setWaterCoolerHighlightKey((current) => current + 1);
      document
        .querySelector<HTMLElement>(".facility-host")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (target?.type === "advertising") {
      setAdvertisingHighlightKey((current) => current + 1);
      scheduleLatestAnimationFrame(messageActionFrameRef, () => {
        const advertisingElement =
          document.querySelector<HTMLElement>(
            "[data-advertising-control]",
          );
        advertisingElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        const adjustmentButton =
          advertisingElement?.querySelector<HTMLButtonElement>(
            "[data-advertising-adjust]:not(:disabled)",
          );
        (adjustmentButton ?? advertisingElement)?.focus({
          preventScroll: true,
        });
      });
      return;
    }
    if (target?.type === "litter") {
      const litterId =
        target.id ?? facility.litterItems?.[0]?.instanceId ?? null;
      setHighlightedLitterId(litterId);
      document
        .querySelector<HTMLElement>(".facility-host")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (target?.type === "build_mode") {
      if (target.id) {
        setPendingProcedureSetupAction({ target: "room", id: target.id, label: "Build" });
        return;
      }
      if (!buildMode) {
        onEnterBuildMode();
      }
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
    if (target?.type === "money") {
      document.querySelector<HTMLElement>(".resource-money-value")?.scrollIntoView({ block: "nearest" });
    }
  };

  const clinicNeeds: NeedsYouItemView[] = [
    ...systemNotices.filter((notice) => notice.targetType === "save").slice(-1).map((notice): NeedsYouItemView => ({
      id: notice.id, kind: "save", title: "Campaign save failed", why: notice.message,
      sortKey: notice.sortKey ?? 0, timeLabel: notice.timeLabel,
      action: { kind: "save_and_pause" }, actionLabel: "Retry save & pause", targetType: "save",
    })),
    ...needsYou,
  ];
  const clinicFeed = clinicFeedForTutorial([...messages, ...systemNotices.filter((notice) => notice.targetType !== "save")], tutorialStep);
  const runClinicAction = (id: string, action: ClinicAlertAction) => {
    const result = onClinicAlertAction?.(action) ?? (action.kind === "save_and_pause"
      ? (() => { const saved = onSaveAndPause(); return { ok: saved.ok, reason: saved.ok ? undefined : "The save failed. Keep this tab open and retry." }; })()
      : { ok: false, reason: "This action is unavailable in this preview." });
    setClinicActionFailures((current) => {
      const next = { ...current };
      if (result.ok) delete next[id]; else next[id] = result.reason ?? "The action could not be applied.";
      return next;
    });
    if (!result.ok) return;
    if (action.kind === "place_room") setPendingProcedureSetupAction({ target: "room", id: action.definitionId, label: "Build" });
    if (action.kind === "restore_access") handleMessageAction(id, { type: "room", id: action.roomId });
    if (action.kind === "open_chart") setLocatedPatientId(action.encounterId);
    if (action.kind === "show_goals") handleMessageAction(id, { type: "goal" });
    if (action.kind === "train_employee") {
      handleMessageAction(id, { type: "employee", id: action.employeeId });
      setRequestedTipTraining((previous) => ({ employeeId: action.employeeId, requestKey: (previous?.requestKey ?? 0) + 1 }));
    }
  };

  return (
    <div
      className={`game-shell${buildMode ? " is-build-mode" : ""}${
        managementMode ? " is-management-mode" : ""
      }${
        chart ? " has-open-chart" : ""
      }`}
    >
      <div className="game-display-title">Stitchin&apos; Time</div>
      <ResourceBar
        headline={<ClinicHeadline key={activeCampaignId} items={clinicFeed} needs={clinicNeeds} />}
        view={resourceBar}
        paused={paused}
        buildMode={buildMode}
        managementMode={managementMode}
        pauseLocked={buildMode || managementMode}
        simulationSpeed={simulationSpeed}
        onTogglePause={onTogglePause}
        onSimulationSpeedChange={onSimulationSpeedChange}
        endControls={
          <SaveCloseDialog
            onSaveAndPause={onSaveAndPause}
            onClearLocalCampaigns={onClearLocalCampaigns}
          />
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
                discussions={employeeDiscussionRows}
                onOpenDiscussion={onOpenEmployeeDiscussion}
                onOpen={openAndLocatePatient}
                tutorialTargetEncounterId={tutorialTargetEncounterId}
                availabilityGuidance={patientAvailabilityGuidance}
              />
              <AdvertisingPanel
                view={advertising}
                highlighted={advertisingHighlightKey > 0}
                onDecrease={() =>
                  onAdvertisingLevelChange(advertising.currentLevel - 1)
                }
                onIncrease={() =>
                  onAdvertisingLevelChange(advertising.currentLevel + 1)
                }
              />
            </>
          ) : (
            <section className="panel build-mode-instructions">
              <span className="eyebrow">Build Mode</span>
              <h2>Remodel while time is paused</h2>
              <p>
                Pick a room in New Rooms and place it, then use Doors to
                click an emphasized wall. Click any room on the map to
                upgrade, move or sell it.
              </p>
            </section>
          )}
          {showDevelopmentTools ? (
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
          ) : null}
        </aside>

        <section
          ref={clinicWorkspaceRef}
          className={`center-column clinic-workspace${
            chart ? " has-open-chart" : ""
          }`}
          style={
            {
              "--workspace-map-track": `${workspaceMapShare}fr`,
              "--workspace-desk-track": `${1 - workspaceMapShare}fr`,
            } as CSSProperties
          }
        >
          <section className="facility-frame" aria-label="Facility map">
            <div className="facility-host" ref={facilityHostRef}>
              <div
                className="facility-zoom-overlay"
                role="group"
                aria-label="Facility map zoom"
              >
                <button
                  className="facility-zoom-button"
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
                <output aria-live="polite">
                  {Math.round(camera.zoom * 100)}%
                </output>
                <button
                  className="facility-zoom-button"
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
              <span
                className="facility-tutorial-anchor is-entrance"
                data-tutorial-anchor="facility-entrance"
              />
              <span
                className="facility-tutorial-anchor is-surface"
                data-tutorial-anchor="facility-surface"
              />
              <FacilityCanvas
                viewModel={{
                  ...facility,
                  buildDoorTool,
                  selectedPatientInstanceId: locatedPatientId,
                  alertPins: clinicNeeds.slice(0, 3).flatMap((item) => item.pin ? [{ id: item.id, title: item.title, actionLabel: item.actionLabel, target: item.pin }] : []),
                  ...(facility.waterCooler
                    ? {
                        waterCooler: {
                          ...facility.waterCooler,
                          highlighted: waterCoolerHighlightKey > 0,
                        },
                      }
                    : {}),
                  ...(facility.litterItems
                    ? {
                        litterItems: facility.litterItems.map(
                          (litter) => ({
                            ...litter,
                            highlighted:
                              litter.instanceId ===
                              highlightedLitterId,
                          }),
                        ),
                      }
                    : {}),
                }}
                onPlaceRoom={placeRoomAndArmDoors}
                onSelectRoom={openRoomMenu}
                onPlaceDoor={onPlaceDoor}
                onRemoveDoor={onRemoveDoor}
                onRequestRoomUpgrade={openRoomMenu}
                onSelectedRoomRectChange={setSelectedRoomRect}
                onAlertPinAction={(id) => { const item = clinicNeeds.slice(0, 3).find((candidate) => candidate.id === id); if (item) runClinicAction(id, item.action); }}
                onCollectLitter={onCollectLitter}
                onRefillWaterCooler={onRefillWaterCooler}
                onSeatFounderAtFrontDesk={onSeatFounderAtFrontDesk}
                onSeatFounderInChair={onSeatFounderInChair}
                onDescribeCharacter={onDescribeCharacter}
                onPraiseEmployee={setPraiseCandidateId}
                onMoveFounder={onMoveFounder}
                onCameraChange={onFacilityCameraChange}
              />
              {roomMenuVisible && selectedRoomBuild ? (
                <RoomActionMenu
                  room={selectedRoomBuild}
                  anchor={selectedRoomRect}
                  containerRef={facilityHostRef}
                  onUpgrade={onUpgradeSelectedRoom}
                  onMove={() => {
                    setRoomMenuOpen(false);
                    onBeginMoveSelectedRoom?.();
                  }}
                  onDoors={() => {
                    setRoomMenuOpen(false);
                    setBuildDoorTool("place");
                  }}
                  onSell={onSellSelectedRoom}
                  onClose={() => setRoomMenuOpen(false)}
                  endoscopySetupRequirements={progression.endoscopySetupRequirements}
                  onEndoscopySetupAction={setPendingProcedureSetupAction}
                />
              ) : null}
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
            {paused && !buildMode && !managementMode ? (
              <div
                className="facility-pause-indicator"
                role="status"
              >
                <strong>GAME PAUSED</strong>
                <span>Patients and facility time are waiting for you.</span>
              </div>
            ) : null}
          </section>

          <WorkspaceSplitter
            workspaceRef={clinicWorkspaceRef}
            mapShare={workspaceMapShare}
            onMapShareChange={setWorkspaceMapShare}
          />

          <section
            className={`desk-workspace${chart ? " has-chart" : ""}${
              buildMode ? " is-build-desk" : ""
            }${managementMode ? " is-management-desk" : ""}`}
            aria-label={
              buildMode
                ? "Construction desk"
                : managementMode
                  ? "Management desk"
                  : "Clinical desk"
            }
          >
            <div className="desk-surface-details" aria-hidden="true">
              <span className="desk-pencil" />
              <span className="desk-paper-corner" />
            </div>
            <BuildPanel
              buildMode={buildMode}
              showInactiveTrigger={!chart && !managementMode}
              cashLabel={resourceBar.moneyLabel}
              roomOptions={roomOptions}
              ownedRooms={ownedRooms}
              lockedRoomOptions={lockedRoomOptions}
              selectedRoomId={roomMenuVisible ? selectedRoomBuild?.id ?? null : null}
              placementOrientation={placementOrientation}
              movingRoomName={
                movingRoomInstanceId
                  ? ownedRooms.find((room) => room.id === movingRoomInstanceId)
                      ?.displayName ?? null
                  : null
              }
              onEnterBuildMode={onEnterBuildMode}
              onExitBuildMode={onExitBuildMode}
              onSelectRoom={(roomDefinitionId) => {
                setRoomMenuOpen(false);
                onBeginPlacement(roomDefinitionId);
              }}
              onCancelPlacement={onCancelPlacement}
              onRotatePlacement={onRotatePlacement}
              onUpgradeRoom={(roomId) => onUpgradeRoom?.(roomId)}
              onOpenRoom={openRoomMenu}
              buildDoorTool={buildDoorTool}
              onBuildDoorToolChange={setBuildDoorTool}
              onUndoBuildAction={onUndoBuildAction}
              undoCount={buildUndoCount}
              undoLabel={buildUndoLabel}
              exitBlockedReason={buildExitBlockedReason}
              exitBlockedIssues={buildExitBlockedIssues}
              endoscopySetupRequirements={progression.endoscopySetupRequirements}
              onEndoscopySetupAction={setPendingProcedureSetupAction}
            />
            <ManagementPanel
              managementMode={managementMode}
              showInactiveTrigger={!chart && !employeeDiscussion && !buildMode}
              roles={staffRoles}
              staffTraining={staffTraining}
              serviceIncome={serviceIncome}
              highlightedRoleId={highlightedStaffRoleId}
              highlightedEmployeeId={highlightedEmployeeId}
              requestedTraining={requestedTipTraining}
              onEnterManagementMode={onEnterManagementMode}
              onExitManagementMode={onExitManagementMode}
              onHire={onHireStaff}
              onDecreaseSalary={onDecreaseEmployeeSalary}
              onIncreaseSalary={onIncreaseEmployeeSalary}
              onFire={onFireEmployee}
              onTrain={onTrainEmployee}
              onSetupAction={(action) => setPendingProcedureSetupAction({ label: action.target === "room" ? "Build" : "Hire", target: action.target, id: action.id })}
              onAppointmentsEnabledChange={onServiceAppointmentsEnabledChange}
              onStartLaboratoryProcessing={onStartLaboratoryProcessing}
            />
            {employeeDiscussion ? (
              <EmployeeDiscussionPanel discussion={employeeDiscussion}
                onClose={onCloseEmployeeDiscussion} onAnswer={onAnswerEmployeeDiscussion}
                onAcknowledge={onAcknowledgeEmployeeDiscussion} onFile={onFileEmployeeDiscussion} />
            ) : chart ? (
              <ChartPanel
                chart={chart}
                onClose={onCloseChart}
                onSubmitAnswer={onSubmitAnswer}
                onFlagQuestion={onFlagQuestion}
                onAcknowledgeTerminalFeedback={
                  onAcknowledgeTerminalFeedback
                }
                onToggleSummary={onToggleSummary}
                onFileChart={onFileChart}
              />
            ) : !buildMode && !managementMode ? (
              <div className="empty-desk-message">
                <strong>Clinical desk</strong>
                <span>Open a patient chart to place it here.</span>
              </div>
            ) : null}
          </section>
        </section>

        <aside className="right-column operations-column">
          {progression.facilityLevelLabel === "Level 0" ? <p className="first-shift-goal-note">Finish both introductory visits and connect an Examination Room to graduate. Mistakes still count as completed visits.</p> : null}
          <GoalsPanel
            view={progression}
            onLevelUp={onLevelUp}
            onProcedureSetupAction={setPendingProcedureSetupAction}
          />

            <EventMessageBoard
              key={activeCampaignId}
              items={clinicFeed}
              needsYou={clinicNeeds}
              compact={buildMode}
              failures={clinicActionFailures}
              onNeedAction={(item) => runClinicAction(item.id, item.action)}
              onAction={(id, target) => { const item = clinicFeed.find((candidate) => candidate.id === id); if (item?.action) runClinicAction(id, item.action); else handleMessageAction(id, target); }}
              mode="ticker"
              maximumVisibleItems={7}
            />
        </aside>
      </main>

      <TutorialCoach
        step={helpOpen || questionReviewQueueOpen ? null : tutorialStep?.id === "place-exam-room-door" && buildMode && buildDoorTool === "place"
          ? { ...tutorialStep, body: "Doors is ready. Click an eligible shared wall. Four walls alone remain a storage decision." }
          : tutorialStep}
        onAction={onTutorialAction}
        onDisableTutorials={() => onTutorialsEnabledChange(false)}
        onTopicExposure={onTutorialTopicExposure}
      />

      <footer className="footer-bar">
        <div className="footer-status">
          <strong>
            {paused ? "Facility paused" : "Facility operating"}
          </strong>
          <span>{workloadStatus}</span>
          {progression.prototypeComplete ? (
            <strong className="prototype-complete">
              {progression.facilityLevelLabel} complete — Level 4 is a preview in this prototype.
            </strong>
          ) : null}
        </div>
        {resourceBar.contentNoticeLabel ? (
          <p className="footer-content-notice" role="note">
            {resourceBar.contentNoticeLabel}
          </p>
        ) : null}
        <div className="footer-actions">
          <HelpDialog
            paused={paused}
            onTogglePause={onTogglePause}
            onOpenChange={(open) => { setHelpOpen(open); onReferencePauseLockedChange?.(open); }}
            onShowGuidance={() => onTutorialsEnabledChange(true)}
            onReplayFirstShift={onReplayFirstShift}
          />
          {showQuestionReviewQueue ? (
            <QuestionReviewQueueDialog
              flags={questionReviewFlags}
              paused={paused}
              onTogglePause={onTogglePause}
              onStatusChange={onQuestionReviewStatusChange}
              onOpenChange={setQuestionReviewQueueOpen}
            />
          ) : null}
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
      {showCharacterQa ? (
        <CharacterQaGallery facility={facility} />
      ) : null}
    </div>
  );
}
