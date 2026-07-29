import {
  PROTOTYPE_ALERT_DEFINITIONS,
  type PrototypeAlertCategory,
  type PrototypeAlertPriority,
} from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  gameReducer,
  getCurrentQuestion,
  getFacilityAccessValidation,
  getRoomDefinition,
  getStaffRoleDefinition,
  getDefaultDoorOffset,
  getRotatedFootprint,
  type CardinalDirection,
  type GameCommand,
  type GameState,
  type OperationReceipt,
  type RoomOrientation,
  type SimulationSpeed,
} from "@gamify-surgery/game-domain";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { FacilityCameraView } from "../facility";
import {
  loadPrototypeProfile,
  requireActiveCampaign,
  savePrototypeProfile,
  selectLocalCampaign,
  type LoadedPrototypeProfile,
  type LocalPrototypeProfile,
} from "./prototypeStorage";
import {
  createTutorialStepView,
  type TutorialActionId,
  type TutorialStepView,
} from "./tutorialViewModels";

type GameCommandInput = {
  [CommandType in GameCommand["type"]]: Omit<
    Extract<GameCommand, { type: CommandType }>,
    "operationId"
  >;
}[GameCommand["type"]];

interface ExecuteOptions {
  announceReceipt?: boolean;
  announceEvents?: boolean;
  announcementOverride?: string;
}

export interface PrototypeSession {
  profile: LocalPrototypeProfile;
  state: GameState;
  campaigns: CampaignSummary[];
  tutorialsEnabled: boolean;
  tutorialCoachMode: "intro" | "callout" | null;
  tutorialTargetEncounterId: string | null;
  tutorialStep: TutorialStepView | null;
  selectedRoomDefinitionId: string | null;
  selectedRoomInstanceId: string | null;
  placementOrientation: RoomOrientation;
  buildMode: boolean;
  buildUndoCount: number;
  buildExitBlockedReason: string | null;
  buildExitBlockedIssues: string[];
  facilityCamera: FacilityCameraView;
  summaryVisible: boolean;
  announcement: string;
  systemNotices: PrototypeSystemNotice[];
  togglePause: () => void;
  setSimulationSpeed: (speed: SimulationSpeed) => void;
  openPatient: (encounterId: string) => void;
  closeChart: () => void;
  submitAnswer: (choiceId: string) => void;
  acknowledgeTerminalFeedback: () => void;
  toggleSummary: () => void;
  fileChart: () => void;
  beginPlacement: (roomDefinitionId: string) => void;
  cancelPlacement: () => void;
  rotatePlacement: () => void;
  placeRoom: (
    tileX: number,
    tileY: number,
    orientation?: RoomOrientation,
  ) => void;
  enterBuildMode: () => void;
  exitBuildMode: () => void;
  selectRoom: (roomInstanceId: string) => void;
  sellSelectedRoom: () => void;
  upgradeSelectedRoom: () => void;
  rotateSelectedRoom: () => void;
  beginMoveSelectedRoom: () => void;
  placeDoorForSelectedRoom: (
    side: CardinalDirection,
    offset: number,
  ) => void;
  removeDoor: (doorId: string) => void;
  undoBuildAction: () => void;
  setFacilityCamera: (camera: FacilityCameraView) => void;
  hireStaff: (staffRoleDefinitionId: string) => void;
  decreaseEmployeeSalary: (employeeId: string) => void;
  increaseEmployeeSalary: (employeeId: string) => void;
  fireEmployee: (employeeId: string) => void;
  collectLitter: (litterId: string) => void;
  refillWaterCooler: () => void;
  praiseEmployee: (employeeId: string) => void;
  levelUp: () => void;
  fastForward: () => void;
  advanceTutorialResult: () => void;
  addMoney: () => void;
  runEmergencyGlp1Consultation: () => void;
  setAdvertisingLevel: (level: number) => void;
  switchCampaign: (campaignId: string) => void;
  openTutorialPatient: () => void;
  dismissTutorialIntro: () => void;
  performTutorialAction: (actionId: TutorialActionId) => void;
  setTutorialsEnabled: (enabled: boolean) => void;
  saveAndPause: () => boolean;
}

export interface PrototypeSystemNotice {
  id: string;
  definitionId: string;
  priority: PrototypeAlertPriority;
  category: PrototypeAlertCategory;
  showAttentionMarker: boolean;
  title: string;
  message: string;
  timeLabel: string;
  sortKey: number;
  persistent: boolean;
}

export interface CampaignSummary {
  campaignId: string;
  name: string;
  createdAtRealMs: number;
  facilityLevel: number;
  fsrsReviewCount: number;
  active: boolean;
  status: "resumable" | "archived";
}

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `ui.${crypto.randomUUID()}`;
  }
  return `ui.${Date.now().toString(36)}`;
}

function nextInstanceId(prefix: string, existingIds: readonly string[]): string {
  const used = new Set(existingIds);
  let sequence = existingIds.length + 1;
  let candidate = `${prefix}.${sequence}`;
  while (used.has(candidate)) {
    sequence += 1;
    candidate = `${prefix}.${sequence}`;
  }
  return candidate;
}

function facilityTimeLabel(tick: number): string {
  const clock = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock;
  const minutesPerDay =
    (clock.dayEndHour - clock.dayStartHour) * 60;
  const day = Math.floor(tick / minutesPerDay) + 1;
  const minuteOfDay = tick % minutesPerDay;
  const hour24 =
    clock.dayStartHour + Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `Day ${day}, ${hour12}:${minute
    .toString()
    .padStart(2, "0")} ${hour24 >= 12 ? "PM" : "AM"}`;
}

function alertDefinition(definitionId: string) {
  return PROTOTYPE_ALERT_DEFINITIONS.find(
    (definition) => definition.id === definitionId,
  );
}

export function usePrototypeSession(
  initialLoadedProfile?: LoadedPrototypeProfile,
): PrototypeSession {
  const loadedRef = useRef<ReturnType<typeof loadPrototypeProfile> | null>(
    null,
  );
  if (loadedRef.current === null) {
    loadedRef.current = initialLoadedProfile ?? loadPrototypeProfile();
  }

  const [profile, setProfile] = useState<LocalPrototypeProfile>(
    loadedRef.current.profile,
  );
  const profileRef = useRef(profile);
  const [state, setState] = useState<GameState>(
    requireActiveCampaign(loadedRef.current.profile).state,
  );
  const stateRef = useRef(state);
  const [
    selectedRoomDefinitionId,
    setSelectedRoomDefinitionId,
  ] = useState<string | null>(null);
  const [selectedRoomInstanceId, setSelectedRoomInstanceId] =
    useState<string | null>(null);
  const [placementOrientation, setPlacementOrientation] =
    useState<RoomOrientation>(0);
  const [buildMode, setBuildMode] = useState(false);
  const [movingRoomInstanceId, setMovingRoomInstanceId] =
    useState<string | null>(null);
  const [buildUndoCount, setBuildUndoCount] = useState(0);
  const [buildExitBlockedReason, setBuildExitBlockedReason] =
    useState<string | null>(null);
  const [buildExitBlockedIssues, setBuildExitBlockedIssues] =
    useState<string[]>([]);
  const buildHistoryRef = useRef<GameState[]>([]);
  const [facilityCamera, setFacilityCamera] =
    useState<FacilityCameraView>({
      zoom: 1,
      panX: 0,
      panY: 0,
    });
  const preBuildPausedRef = useRef(true);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [acknowledgedTutorialStepIds, setAcknowledgedTutorialStepIds] =
    useState<ReadonlySet<string>>(() => new Set());
  const [announcement, setAnnouncement] = useState(loadedRef.current.notice);
  const [systemNotices, setSystemNotices] = useState<
    PrototypeSystemNotice[]
  >(() => {
    const initialState = requireActiveCampaign(
      loadedRef.current!.profile,
    ).state;
    const isNewCampaign = loadedRef.current!.notice.startsWith("New clinic");
    const definitionId = isNewCampaign
      ? "alert.system.campaign-created"
      : "alert.system.campaign-restored";
    const definition = alertDefinition(definitionId);
    return [
      {
        id: `system.initial.${initialState.campaignId}`,
        definitionId,
        priority: definition?.priority ?? "informational",
        category: definition?.category ?? "success",
        showAttentionMarker:
          definition?.showAttentionMarker ?? false,
        title:
          definition?.titleTemplate ??
          (isNewCampaign ? "New campaign" : "Campaign restored"),
        message: loadedRef.current!.notice,
        timeLabel: facilityTimeLabel(initialState.facilityTick),
        sortKey: initialState.facilityTick + 0.01,
        persistent: false,
      },
    ];
  });
  const [documentVisible, setDocumentVisible] = useState(
    () =>
      typeof document === "undefined" ||
      document.visibilityState === "visible",
  );
  const sessionIdRef = useRef(createSessionId());
  const sequenceRef = useRef(0);
  const systemNoticeSequenceRef = useRef(0);
  const saveWarningShownRef = useRef(false);
  const lastSaveSucceededRef = useRef(true);

  const publishSystemNotice = useCallback(
    (
      definitionId: string,
      messageOverride?: string,
      titleOverride?: string,
    ) => {
      const definition = alertDefinition(definitionId);
      const facilityTick = stateRef.current.facilityTick;
      const message =
        messageOverride ??
        definition?.bodyTemplate ??
        "The clinic state changed.";
      const notice: PrototypeSystemNotice = {
        id: `system.notice.${++systemNoticeSequenceRef.current}`,
        definitionId,
        priority: definition?.priority ?? "informational",
        category: definition?.category ?? "success",
        showAttentionMarker:
          definition?.showAttentionMarker ?? false,
        title:
          titleOverride ??
          definition?.titleTemplate ??
          "Clinic update",
        message,
        timeLabel: facilityTimeLabel(facilityTick),
        sortKey:
          facilityTick + systemNoticeSequenceRef.current / 10_000,
        persistent: definition?.persistent ?? false,
      };
      setSystemNotices((current) => {
        const withoutResolvedSaveFailure =
          definitionId === "alert.system.saved"
            ? current.filter(
                (item) =>
                  item.definitionId !== "alert.system.save-failed",
              )
            : current;
        const consolidated = notice.persistent
          ? withoutResolvedSaveFailure.filter(
              (item) => item.definitionId !== definitionId,
            )
          : withoutResolvedSaveFailure;
        return [...consolidated.slice(-19), notice];
      });
      setAnnouncement(message);
    },
    [],
  );

  const persistActiveState = useCallback((nextState: GameState): boolean => {
    const now = Date.now();
    const nextProfile: LocalPrototypeProfile = {
      ...profileRef.current,
      campaigns: profileRef.current.campaigns.map((campaign) =>
        campaign.campaignId === profileRef.current.activeCampaignId
          ? {
              ...campaign,
              updatedAtRealMs: now,
              state: nextState,
            }
          : campaign,
      ),
    };
    profileRef.current = nextProfile;
    setProfile(nextProfile);
    const saved = savePrototypeProfile(nextProfile);
    lastSaveSucceededRef.current = saved;
    return saved;
  }, []);

  const execute = useCallback(
    (
      commandInput: GameCommandInput,
      options: ExecuteOptions = {},
    ): OperationReceipt["status"] => {
      const operationId = `${sessionIdRef.current}.${++sequenceRef.current}`;
      const command = {
        ...commandInput,
        operationId,
      } as GameCommand;
      const previous = stateRef.current;
      const next = gameReducer(previous, command);
      stateRef.current = next;
      setState(next);

      const saved = persistActiveState(next);
      const receipt = next.operationReceipts[operationId];
      const newestEvent =
        options.announceEvents === true &&
        next.events.length > previous.events.length
          ? next.events.at(-1)
          : undefined;

      if (options.announcementOverride) {
        setAnnouncement(options.announcementOverride);
      } else if (newestEvent) {
        setAnnouncement(newestEvent.message);
      } else if (options.announceReceipt !== false && receipt) {
        setAnnouncement(receipt.message);
      }

      if (!saved && !saveWarningShownRef.current) {
        saveWarningShownRef.current = true;
        publishSystemNotice(
          "alert.system.save-failed",
          "Local saving is unavailable. Progress will last only for this browser session.",
        );
      }

      return receipt?.status ?? "rejected";
    },
    [persistActiveState, publishSystemNotice],
  );

  const executeBuildCommand = useCallback(
    (commandInput: GameCommandInput): OperationReceipt["status"] => {
      const before = stateRef.current;
      const status = execute(commandInput);
      if (status === "applied") {
        buildHistoryRef.current = [
          ...buildHistoryRef.current,
          before,
        ];
        setBuildUndoCount(buildHistoryRef.current.length);
        setBuildExitBlockedReason(null);
        setBuildExitBlockedIssues([]);
      }
      return status;
    },
    [execute],
  );

  const undoBuildAction = useCallback(() => {
    if (!buildMode || buildHistoryRef.current.length === 0) {
      setAnnouncement("There is no build action to undo.");
      return;
    }
    const previous = buildHistoryRef.current.at(-1)!;
    buildHistoryRef.current = buildHistoryRef.current.slice(0, -1);
    stateRef.current = previous;
    setState(previous);
    persistActiveState(previous);
    setBuildUndoCount(buildHistoryRef.current.length);
    setBuildExitBlockedReason(null);
    setBuildExitBlockedIssues([]);
    setSelectedRoomDefinitionId(null);
    setMovingRoomInstanceId(null);
    setAnnouncement("The last build action was undone.");
  }, [buildMode, persistActiveState]);

  useEffect(() => {
    if (!buildMode) {
      return;
    }
    const validation = getFacilityAccessValidation(state);
    const nextReason = validation.valid
      ? null
      : validation.reason ??
        "Every required room needs a valid reachable door.";
    setBuildExitBlockedReason((current) =>
      current === nextReason ? current : nextReason,
    );
    setBuildExitBlockedIssues((current) => {
      const next = validation.issues;
      return current.length === next.length &&
        current.every((issue, index) => issue === next[index])
        ? current
        : next;
    });
  }, [buildMode, state]);

  useEffect(() => {
    if (!savePrototypeProfile(profileRef.current)) {
      saveWarningShownRef.current = true;
      publishSystemNotice(
        "alert.system.save-failed",
        "Local saving is unavailable. Progress will last only for this browser session.",
      );
    }
  }, [publishSystemNotice]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === "visible";
      setDocumentVisible(visible);
      if (!visible && !stateRef.current.paused) {
        execute(
          {
            type: "SET_PAUSED",
            paused: true,
          },
          {
            announcementOverride:
              "Facility paused because this tab is no longer visible. Select Resume when you return.",
          },
        );
        publishSystemNotice(
          "alert.system.hidden-pause",
          "Game paused while the page was hidden. Resume when ready.",
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    handleVisibilityChange();
    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [execute, publishSystemNotice]);

  useEffect(() => {
    if (!documentVisible || state.paused) {
      return;
    }

    const timerId = window.setInterval(() => {
      execute(
        {
          type: "ADVANCE_TICK",
        },
        {
          announceReceipt: false,
          announceEvents: true,
        },
      );
    },
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock
      .realMillisecondsPerFacilityMinuteAt1x / state.simulationSpeed);

    return () => {
      window.clearInterval(timerId);
    };
  }, [documentVisible, execute, state.paused, state.simulationSpeed]);

  const openPatient = useCallback(
    (encounterId: string) => {
      const status = execute({
        type: "OPEN_CHART",
        encounterId,
      });
      if (status === "applied") {
        setSummaryVisible(false);
      }
    },
    [execute],
  );

  const closeChart = useCallback(() => {
    const encounterId = stateRef.current.openChartEncounterId;
    if (encounterId === null) {
      return;
    }
    const status = execute({
      type: "CLOSE_CHART",
      encounterId,
    });
    if (status === "applied") {
      setSummaryVisible(false);
    }
  }, [execute]);

  const fileChart = useCallback(() => {
    closeChart();
  }, [closeChart]);

  const submitAnswer = useCallback(
    (choiceId: string) => {
      const currentState = stateRef.current;
      const encounterId = currentState.openChartEncounterId;
      if (encounterId === null) {
        setAnnouncement("Open an action-ready chart before answering.");
        return;
      }
      const question = getCurrentQuestion(currentState, encounterId);
      if (!question) {
        setAnnouncement("This chart does not currently have a question.");
        return;
      }
      execute({
        type: "SUBMIT_ANSWER",
        encounterId,
        decisionNodeId: question.node.id,
        answerChoiceId: choiceId,
        reviewedAtMs: Date.now(),
      });
    },
    [execute],
  );

  const acknowledgeTerminalFeedback = useCallback(() => {
    const encounterId = stateRef.current.openChartEncounterId;
    if (encounterId === null) {
      return;
    }
    const encounter = stateRef.current.encounters[encounterId];
    const step =
      encounter?.steps[encounter.currentNodeIndex];
    if (step?.status === "feedback_pending") {
      execute({
        type: "ACKNOWLEDGE_DECISION_FEEDBACK",
        encounterId,
        decisionNodeId: step.decisionNodeId,
      });
      return;
    }
    execute({
      type: "ACKNOWLEDGE_TERMINAL_FEEDBACK",
      encounterId,
    });
  }, [execute]);

  const toggleSummary = useCallback(() => {
    setSummaryVisible((currentlyVisible) => {
      const nextVisible = !currentlyVisible;
      setAnnouncement(
        nextVisible ? "Learning summary opened." : "Learning summary hidden.",
      );
      return nextVisible;
    });
  }, []);

  const beginPlacement = useCallback((roomDefinitionId: string) => {
    if (!buildMode) {
      setAnnouncement("Enter Build Mode before selecting construction.");
      return;
    }
    setSelectedRoomDefinitionId(roomDefinitionId);
    setMovingRoomInstanceId(null);
    setSelectedRoomInstanceId(null);
    setPlacementOrientation(0);
    setAnnouncement(
      "Placement tool ready. Choose a clear area; add its doors separately.",
    );
  }, [buildMode]);

  const cancelPlacement = useCallback(() => {
    setSelectedRoomDefinitionId(null);
    setMovingRoomInstanceId(null);
    setPlacementOrientation(0);
    setAnnouncement("Room placement canceled.");
  }, []);

  const rotatePlacement = useCallback(() => {
    if (!selectedRoomDefinitionId) {
      setAnnouncement("Select a room before rotating it.");
      return;
    }
    setPlacementOrientation((current) =>
      ((current + 90) % 360) as RoomOrientation,
    );
    setAnnouncement("Placement rotated 90 degrees.");
  }, [selectedRoomDefinitionId]);

  const placeRoom = useCallback(
    (
      tileX: number,
      tileY: number,
      requestedOrientation?: RoomOrientation,
    ) => {
      const roomDefinitionId = selectedRoomDefinitionId;
      if (!roomDefinitionId) {
        setAnnouncement("Select a room before choosing its location.");
        return;
      }
      if (movingRoomInstanceId) {
        const status = executeBuildCommand({
          type: "MOVE_ROOM",
          roomId: movingRoomInstanceId,
          x: tileX,
          y: tileY,
        });
        if (status === "applied") {
          setSelectedRoomDefinitionId(null);
          setMovingRoomInstanceId(null);
          setSelectedRoomInstanceId(movingRoomInstanceId);
        }
        return;
      }
      const roomId = nextInstanceId(
        "room.instance",
        stateRef.current.rooms.map((room) => room.id),
      );
      const status = executeBuildCommand({
        type: "PLACE_ROOM",
        roomId,
        roomDefinitionId,
        x: tileX,
        y: tileY,
        orientation: requestedOrientation ?? placementOrientation,
      });
      if (status === "applied") {
        setSelectedRoomDefinitionId(null);
        setSelectedRoomInstanceId(roomId);
        setPlacementOrientation(0);
        setAnnouncement(
          "Room placed and selected. Add a valid zero-cost door before returning to play.",
        );
      }
    },
    [
      executeBuildCommand,
      movingRoomInstanceId,
      placementOrientation,
      selectedRoomDefinitionId,
    ],
  );

  const enterBuildMode = useCallback(() => {
    if (buildMode) {
      return;
    }
    const current = stateRef.current;
    preBuildPausedRef.current = current.paused;
    buildHistoryRef.current = [];
    setBuildUndoCount(0);
    setBuildExitBlockedReason(null);
    setBuildExitBlockedIssues([]);
    setBuildExitBlockedIssues([]);
    if (current.openChartEncounterId !== null) {
      execute(
        {
          type: "CLOSE_CHART",
          encounterId: current.openChartEncounterId,
        },
        { announceReceipt: false },
      );
      setSummaryVisible(false);
    }
    if (!stateRef.current.paused) {
      execute(
        { type: "SET_PAUSED", paused: true },
        { announceReceipt: false },
      );
    }
    setBuildMode(true);
    setSelectedRoomDefinitionId(null);
    setMovingRoomInstanceId(null);
    setSelectedRoomInstanceId(null);
    setPlacementOrientation(0);
    setAnnouncement(
      "Build Mode opened. Facility time is paused while you remodel.",
    );
  }, [buildMode, execute]);

  const exitBuildMode = useCallback(() => {
    if (!buildMode) {
      return;
    }
    const validation = getFacilityAccessValidation(stateRef.current);
    if (!validation.valid) {
      const reason =
        validation.reason ??
        "Every required room needs a valid reachable door.";
      setBuildExitBlockedReason(reason);
      setBuildExitBlockedIssues(validation.issues);
      setAnnouncement(`Cannot return to play: ${reason}`);
      return;
    }
    setBuildMode(false);
    buildHistoryRef.current = [];
    setBuildUndoCount(0);
    setBuildExitBlockedReason(null);
    setBuildExitBlockedIssues([]);
    setSelectedRoomDefinitionId(null);
    setMovingRoomInstanceId(null);
    setSelectedRoomInstanceId(null);
    setPlacementOrientation(0);
    if (!preBuildPausedRef.current && stateRef.current.paused) {
      execute(
        { type: "SET_PAUSED", paused: false },
        { announceReceipt: false },
      );
    }
    setAnnouncement(
      preBuildPausedRef.current
        ? "Build Mode closed. The clinic remains paused."
        : "Build Mode closed. Facility operations resumed.",
    );
  }, [buildMode, execute]);

  const selectRoom = useCallback((roomInstanceId: string) => {
    setSelectedRoomInstanceId(roomInstanceId);
    setSelectedRoomDefinitionId(null);
    setMovingRoomInstanceId(null);
    setAnnouncement("Room selected. Upgrade or sell it from Build Mode.");
  }, []);

  const sellSelectedRoom = useCallback(() => {
    if (!selectedRoomInstanceId) {
      setAnnouncement("Select a room to sell.");
      return;
    }
    const status = executeBuildCommand({
      type: "SELL_ROOM",
      roomId: selectedRoomInstanceId,
    });
    if (status === "applied") {
      setSelectedRoomInstanceId(null);
    }
  }, [executeBuildCommand, selectedRoomInstanceId]);

  const upgradeSelectedRoom = useCallback(() => {
    if (!selectedRoomInstanceId) {
      setAnnouncement("Select a room to upgrade.");
      return;
    }
    executeBuildCommand({
      type: "UPGRADE_ROOM",
      roomId: selectedRoomInstanceId,
    });
  }, [executeBuildCommand, selectedRoomInstanceId]);

  const rotateSelectedRoom = useCallback(() => {
    if (!selectedRoomInstanceId) {
      setAnnouncement("Select a room to rotate.");
      return;
    }
    executeBuildCommand({
      type: "ROTATE_ROOM",
      roomId: selectedRoomInstanceId,
    });
  }, [executeBuildCommand, selectedRoomInstanceId]);

  const beginMoveSelectedRoom = useCallback(() => {
    if (!selectedRoomInstanceId) {
      setAnnouncement("Select a room to move.");
      return;
    }
    const room = stateRef.current.rooms.find(
      (candidate) => candidate.id === selectedRoomInstanceId,
    );
    if (!room) {
      setAnnouncement("That room is no longer available.");
      return;
    }
    setMovingRoomInstanceId(room.id);
    setSelectedRoomDefinitionId(room.roomDefinitionId);
    setPlacementOrientation(room.orientation);
    setAnnouncement(
      "Move tool ready. Choose a clear destination for the room.",
    );
  }, [selectedRoomInstanceId]);

  const placeDoorForSelectedRoom = useCallback(
    (side: CardinalDirection, offset: number) => {
      if (!selectedRoomInstanceId) {
        setAnnouncement("Select a room before placing a door.");
        return;
      }
      executeBuildCommand({
        type: "PLACE_DOOR",
        doorId: nextInstanceId(
          "door.instance",
          stateRef.current.doors.map((door) => door.id),
        ),
        roomId: selectedRoomInstanceId,
        side,
        offset,
      });
    },
    [executeBuildCommand, selectedRoomInstanceId],
  );

  const removeDoor = useCallback(
    (doorId: string) => {
      executeBuildCommand({
        type: "REMOVE_DOOR",
        doorId,
      });
    },
    [executeBuildCommand],
  );

  const hireStaff = useCallback(
    (staffRoleDefinitionId: string) => {
      execute({
        type: "HIRE_STAFF",
        employeeId: nextInstanceId(
          "employee.instance",
          stateRef.current.employees.map((employee) => employee.id),
        ),
        staffRoleDefinitionId,
      });
    },
    [execute],
  );

  const changeEmployeeSalary = useCallback(
    (employeeId: string, direction: -1 | 1) => {
      const employee = stateRef.current.employees.find(
        (candidate) => candidate.id === employeeId,
      );
      const role = employee
        ? getStaffRoleDefinition(employee.staffRoleDefinitionId)
        : null;
      if (!employee || !role) {
        setAnnouncement("That employee is no longer available.");
        return;
      }
      const requested =
        employee.salaryPerExpenseInterval +
        direction * role.salaryAdjustmentStep;
      const salary = Math.max(
        role.minimumSalaryPerExpenseInterval,
        Math.min(role.maximumSalaryPerExpenseInterval, requested),
      );
      execute({
        type: "SET_EMPLOYEE_SALARY",
        employeeId,
        salaryPerExpenseInterval: salary,
      });
    },
    [execute],
  );

  const decreaseEmployeeSalary = useCallback(
    (employeeId: string) => changeEmployeeSalary(employeeId, -1),
    [changeEmployeeSalary],
  );
  const increaseEmployeeSalary = useCallback(
    (employeeId: string) => changeEmployeeSalary(employeeId, 1),
    [changeEmployeeSalary],
  );

  const fireEmployee = useCallback(
    (employeeId: string) => {
      execute({ type: "FIRE_EMPLOYEE", employeeId });
    },
    [execute],
  );

  const collectLitter = useCallback(
    (litterId: string) => {
      execute({ type: "COLLECT_LITTER", litterId });
    },
    [execute],
  );

  const refillWaterCooler = useCallback(() => {
    execute({ type: "REFILL_WATER_COOLER" });
  }, [execute]);

  const praiseEmployee = useCallback(
    (employeeId: string) => {
      execute({ type: "PRAISE_EMPLOYEE", employeeId });
    },
    [execute],
  );

  const levelUp = useCallback(() => {
    const status = execute({
      type: "LEVEL_UP",
    });
    if (status === "applied") {
      setSelectedRoomDefinitionId(null);
    }
  }, [execute]);

  const fastForward = useCallback(() => {
    const status = execute(
      {
        type: "DEV_FAST_FORWARD",
        tickCount:
          PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.development
            .fastForwardTickCount,
      },
      {
        announcementOverride:
          "Development fast-forward applied. Review arrivals, expenses, and patient state.",
      },
    );
    if (status === "applied") {
      publishSystemNotice(
        "alert.system.testing-mode",
        "Accelerated testing mode advanced facility time.",
      );
    }
  }, [execute, publishSystemNotice]);

  const advanceTutorialResult = useCallback(() => {
    const tutorialEncounter =
      stateRef.current.encounters[TUTORIAL_ENCOUNTER_ID];
    const pendingResult = tutorialEncounter?.pendingResult;
    if (
      tutorialEncounter?.lifecycle !== "active_pending_result" ||
      !pendingResult ||
      stateRef.current.paused
    ) {
      return;
    }

    if (
      stateRef.current.openChartEncounterId === TUTORIAL_ENCOUNTER_ID
    ) {
      execute(
        {
          type: "CLOSE_CHART",
          encounterId: TUTORIAL_ENCOUNTER_ID,
        },
        { announceReceipt: false },
      );
      setSummaryVisible(false);
    }

    const tickCount = Math.max(
      1,
      pendingResult.dueTick - stateRef.current.facilityTick,
    );
    execute(
      {
        type: "DEV_FAST_FORWARD",
        tickCount,
      },
      {
        announcementOverride:
          "The short tutorial result returned. Pixel Patient is ready in Existing Patients.",
      },
    );
  }, [execute]);

  const addMoney = useCallback(() => {
    execute(
      {
        type: "DEV_ADD_MONEY",
      },
      {
        announcementOverride: `Added $${PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.development.addMoneyAmount} for prototype testing.`,
      },
    );
  }, [execute]);

  const runEmergencyGlp1Consultation = useCallback(() => {
    if (buildMode) {
      setAnnouncement(
        "Exit Build Mode before running the emergency consultation.",
      );
      return;
    }
    execute({
      type: "RUN_EMERGENCY_GLP1_CONSULTATION",
    });
  }, [buildMode, execute]);

  const setAdvertisingLevel = useCallback(
    (level: number) => {
      if (buildMode) {
        setAnnouncement("Exit Build Mode before changing advertising.");
        return;
      }
      execute({
        type: "SET_ADVERTISING_LEVEL",
        level,
      });
    },
    [buildMode, execute],
  );

  const togglePause = useCallback(() => {
    if (buildMode) {
      setAnnouncement("Exit Build Mode before resuming facility time.");
      return;
    }
    const current = stateRef.current;
    execute({
      type: "SET_PAUSED",
      paused: !current.paused,
    });
  }, [buildMode, execute]);

  const setSimulationSpeed = useCallback(
    (speed: SimulationSpeed) => {
      execute({
        type: "SET_SIMULATION_SPEED",
        speed,
      });
    },
    [execute],
  );

  const saveAndPause = useCallback((): boolean => {
    if (!stateRef.current.paused) {
      execute(
        { type: "SET_PAUSED", paused: true },
        {
          announcementOverride:
            "Campaign saved and paused. It is safe to close this tab.",
        },
      );
      const saved = lastSaveSucceededRef.current;
      publishSystemNotice(
        saved ? "alert.system.saved" : "alert.system.save-failed",
        saved
          ? "Campaign saved and paused. It is safe to close this tab."
          : "Save failed. Keep the game open and try again.",
      );
      return saved;
    }
    const saved = persistActiveState(stateRef.current);
    publishSystemNotice(
      saved ? "alert.system.saved" : "alert.system.save-failed",
      saved
        ? "Campaign saved and paused. It is safe to close this tab."
        : "Save failed. Keep the game open and try again.",
    );
    return saved;
  }, [execute, persistActiveState, publishSystemNotice]);

  const switchCampaign = useCallback((campaignId: string) => {
    const currentProfile = profileRef.current;
    const selectedCampaign = currentProfile.campaigns.find(
      (campaign) => campaign.campaignId === campaignId,
    );
    if (!selectedCampaign || selectedCampaign.status !== "resumable") {
      setAnnouncement("That local campaign could not be found.");
      return;
    }
    if (campaignId === currentProfile.activeCampaignId) {
      setAnnouncement(`${selectedCampaign.name} is already open.`);
      return;
    }

    const nextProfile = selectLocalCampaign(
      currentProfile,
      campaignId,
    );
    profileRef.current = nextProfile;
    setProfile(nextProfile);
    stateRef.current = selectedCampaign.state;
    setState(selectedCampaign.state);
    setSelectedRoomDefinitionId(null);
    setSelectedRoomInstanceId(null);
    setMovingRoomInstanceId(null);
    setPlacementOrientation(0);
    setBuildMode(false);
    buildHistoryRef.current = [];
    setBuildUndoCount(0);
    setBuildExitBlockedReason(null);
    setFacilityCamera({ zoom: 1, panX: 0, panY: 0 });
    setSummaryVisible(false);
    const saved = savePrototypeProfile(nextProfile);
    saveWarningShownRef.current = !saved;
    publishSystemNotice(
      saved
        ? "alert.system.campaign-restored"
        : "alert.system.save-failed",
      saved
        ? `${selectedCampaign.name} opened. Its learning history is unchanged.`
        : `${selectedCampaign.name} opened, but local saving is unavailable.`,
    );
  }, [publishSystemNotice]);

  const tutorialIntroDismissed =
    profile.tutorialIntroDismissedCampaignIds.includes(state.campaignId);
  const tutorialStep = createTutorialStepView({
    state,
    tutorialsEnabled: profile.tutorialsEnabled,
    introDismissed: tutorialIntroDismissed,
    acknowledgedStepIds: acknowledgedTutorialStepIds,
    buildMode,
    selectedRoomDefinitionId,
    selectedRoomInstanceId,
    summaryVisible,
  });
  const tutorialTargetEncounter =
    tutorialStep?.patientEncounterId
      ? state.encounters[tutorialStep.patientEncounterId] ?? null
      : null;
  const tutorialCoachMode =
    tutorialStep?.id === "welcome"
      ? ("intro" as const)
      : tutorialStep?.id === "open-first-chart"
        ? ("callout" as const)
        : null;

  useEffect(() => {
    if (
      profile.tutorialsEnabled ||
      state.alertHumor.alertsTutorialAcknowledgedAtTick !== null ||
      state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID]
        ?.resolutionReason === null ||
      state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID] === undefined
    ) {
      return;
    }
    execute(
      { type: "ACKNOWLEDGE_ALERTS_TUTORIAL" },
      { announceReceipt: false, announceEvents: false },
    );
  }, [
    execute,
    profile.tutorialsEnabled,
    state.alertHumor.alertsTutorialAcknowledgedAtTick,
    state.encounters,
  ]);

  const persistTutorialProfile = useCallback(
    (
      nextProfile: LocalPrototypeProfile,
      successAnnouncement: string,
    ) => {
      profileRef.current = nextProfile;
      setProfile(nextProfile);
      const saved = savePrototypeProfile(nextProfile);
      saveWarningShownRef.current = !saved;
      setAnnouncement(
        saved
          ? successAnnouncement
          : `${successAnnouncement} Local saving is unavailable.`,
      );
    },
    [],
  );

  const dismissTutorialIntro = useCallback(() => {
    const currentProfile = profileRef.current;
    if (
      currentProfile.tutorialIntroDismissedCampaignIds.includes(
        stateRef.current.campaignId,
      )
    ) {
      return;
    }
    persistTutorialProfile(
      {
        ...currentProfile,
        tutorialIntroDismissedCampaignIds: [
          ...currentProfile.tutorialIntroDismissedCampaignIds,
          stateRef.current.campaignId,
        ],
      },
      "Tutorial introduction dismissed. The patient chart remains highlighted.",
    );
  }, [persistTutorialProfile]);

  const setTutorialsEnabled = useCallback(
    (enabled: boolean) => {
      const currentProfile = profileRef.current;
      if (currentProfile.tutorialsEnabled === enabled) {
        return;
      }
      persistTutorialProfile(
        {
          ...currentProfile,
          tutorialsEnabled: enabled,
        },
        enabled
          ? "Tutorial guidance enabled."
          : "Tutorial guidance disabled. Help remains available.",
      );
    },
    [persistTutorialProfile],
  );

  const openTutorialPatient = useCallback(() => {
    if (tutorialTargetEncounter) {
      openPatient(tutorialTargetEncounter.id);
    }
  }, [openPatient, tutorialTargetEncounter]);

  const performTutorialAction = useCallback(
    (actionId: TutorialActionId) => {
      switch (actionId) {
        case "open-first-chart":
          openPatient(TUTORIAL_ENCOUNTER_ID);
          return;
        case "focus-first-chart":
          dismissTutorialIntro();
          return;
        case "acknowledge-step":
          if (!tutorialStep) {
            return;
          }
          if (tutorialStep.id === "alerts-tour") {
            execute({ type: "ACKNOWLEDGE_ALERTS_TUTORIAL" });
          }
          setAcknowledgedTutorialStepIds((current) => {
            const key = `${stateRef.current.campaignId}:${tutorialStep.id}`;
            if (current.has(key)) {
              return current;
            }
            return new Set([...current, key]);
          });
          return;
        case "advance-first-result":
          advanceTutorialResult();
          return;
        case "open-ready-chart":
          openPatient(TUTORIAL_ENCOUNTER_ID);
          return;
        case "acknowledge-feedback":
          acknowledgeTerminalFeedback();
          if (tutorialStep) {
            setAcknowledgedTutorialStepIds((current) => {
              const key = `${stateRef.current.campaignId}:${tutorialStep.id}`;
              return current.has(key)
                ? current
                : new Set([...current, key]);
            });
          }
          return;
        case "resolve-chart":
          fileChart();
          return;
        case "open-second-chart":
          openPatient(SECOND_TUTORIAL_ENCOUNTER_ID);
          return;
        case "enter-build-mode":
          enterBuildMode();
          return;
        case "select-exam-room":
          beginPlacement("room.examination");
          return;
        case "exit-build-mode":
          exitBuildMode();
          return;
        case "level-up":
          levelUp();
          return;
      }
    },
    [
      acknowledgeTerminalFeedback,
      advanceTutorialResult,
      beginPlacement,
      closeChart,
      dismissTutorialIntro,
      enterBuildMode,
      exitBuildMode,
      fileChart,
      levelUp,
      openPatient,
      tutorialStep,
    ],
  );

  const campaigns = profile.campaigns
    .map((campaign) => ({
      campaignId: campaign.campaignId,
      name: campaign.name,
      createdAtRealMs: campaign.createdAtRealMs,
      facilityLevel: campaign.state.facilityLevel,
      fsrsReviewCount: Object.values(campaign.state.learningHistories).reduce(
        (total, history) => total + history.reviews.length,
        0,
      ),
      active: campaign.campaignId === profile.activeCampaignId,
      status: campaign.status,
    }))
    .sort(
      (left, right) =>
        Number(right.active) - Number(left.active) ||
        right.createdAtRealMs - left.createdAtRealMs,
    );

  return {
    profile,
    state,
    campaigns,
    tutorialsEnabled: profile.tutorialsEnabled,
    tutorialCoachMode,
    tutorialTargetEncounterId: tutorialTargetEncounter?.id ?? null,
    tutorialStep,
    selectedRoomDefinitionId,
    selectedRoomInstanceId,
    placementOrientation,
    buildMode,
    buildUndoCount,
    buildExitBlockedReason,
    buildExitBlockedIssues,
    facilityCamera,
    summaryVisible,
    announcement,
    systemNotices,
    togglePause,
    setSimulationSpeed,
    openPatient,
    closeChart,
    submitAnswer,
    acknowledgeTerminalFeedback,
    toggleSummary,
    fileChart,
    beginPlacement,
    cancelPlacement,
    rotatePlacement,
    placeRoom,
    enterBuildMode,
    exitBuildMode,
    selectRoom,
    sellSelectedRoom,
    upgradeSelectedRoom,
    rotateSelectedRoom,
    beginMoveSelectedRoom,
    placeDoorForSelectedRoom,
    removeDoor,
    undoBuildAction,
    setFacilityCamera,
    hireStaff,
    decreaseEmployeeSalary,
    increaseEmployeeSalary,
    fireEmployee,
    collectLitter,
    refillWaterCooler,
    praiseEmployee,
    levelUp,
    fastForward,
    advanceTutorialResult,
    addMoney,
    runEmergencyGlp1Consultation,
    setAdvertisingLevel,
    switchCampaign,
    openTutorialPatient,
    dismissTutorialIntro,
    performTutorialAction,
    setTutorialsEnabled,
    saveAndPause,
  };
}
