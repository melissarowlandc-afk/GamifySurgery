import {
  PROTOTYPE_DOMAIN_CONTEXT,
  gameReducer,
  getCurrentQuestion,
  getStaffRoleDefinition,
  type GameCommand,
  type GameState,
  type OperationReceipt,
} from "@gamify-surgery/game-domain";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  createLocalCampaign,
  getActiveCampaign,
  loadPrototypeProfile,
  savePrototypeProfile,
  type LocalPrototypeProfile,
} from "./prototypeStorage";

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
  state: GameState;
  campaigns: CampaignSummary[];
  tutorialsEnabled: boolean;
  tutorialCoachMode: "intro" | "callout" | null;
  tutorialTargetEncounterId: string | null;
  selectedRoomDefinitionId: string | null;
  summaryVisible: boolean;
  announcement: string;
  togglePause: () => void;
  openPatient: (encounterId: string) => void;
  closeChart: () => void;
  submitAnswer: (choiceId: string) => void;
  acknowledgeTerminalFeedback: () => void;
  toggleSummary: () => void;
  fileChart: () => void;
  beginPlacement: (roomDefinitionId: string) => void;
  cancelPlacement: () => void;
  placeRoom: (tileX: number, tileY: number) => void;
  hireStaff: (staffRoleDefinitionId: string) => void;
  levelUp: () => void;
  fastForward: () => void;
  addMoney: () => void;
  createCampaign: () => void;
  switchCampaign: (campaignId: string) => void;
  openTutorialPatient: () => void;
  dismissTutorialIntro: () => void;
  setTutorialsEnabled: (enabled: boolean) => void;
  restart: () => void;
}

export interface CampaignSummary {
  campaignId: string;
  name: string;
  createdAtRealMs: number;
  facilityLevel: number;
  fsrsReviewCount: number;
  active: boolean;
}

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `ui.${crypto.randomUUID()}`;
  }
  return `ui.${Date.now().toString(36)}`;
}

export function usePrototypeSession(): PrototypeSession {
  const loadedRef = useRef<ReturnType<typeof loadPrototypeProfile> | null>(
    null,
  );
  if (loadedRef.current === null) {
    loadedRef.current = loadPrototypeProfile();
  }

  const [profile, setProfile] = useState<LocalPrototypeProfile>(
    loadedRef.current.profile,
  );
  const profileRef = useRef(profile);
  const [state, setState] = useState<GameState>(
    getActiveCampaign(loadedRef.current.profile).state,
  );
  const stateRef = useRef(state);
  const [
    selectedRoomDefinitionId,
    setSelectedRoomDefinitionId,
  ] = useState<string | null>(null);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [announcement, setAnnouncement] = useState(loadedRef.current.notice);
  const [documentVisible, setDocumentVisible] = useState(
    () =>
      typeof document === "undefined" ||
      document.visibilityState === "visible",
  );
  const sessionIdRef = useRef(createSessionId());
  const sequenceRef = useRef(0);
  const saveWarningShownRef = useRef(false);

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
    return savePrototypeProfile(nextProfile);
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
        setAnnouncement(
          "Local saving is unavailable. Progress will last only for this browser session.",
        );
      }

      return receipt?.status ?? "rejected";
    },
    [persistActiveState],
  );

  useEffect(() => {
    if (!savePrototypeProfile(profileRef.current)) {
      saveWarningShownRef.current = true;
      setAnnouncement(
        "Local saving is unavailable. Progress will last only for this browser session.",
      );
    }
  }, []);

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
  }, [execute]);

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
    }, 1_000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [documentVisible, execute, state.paused]);

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
    setSelectedRoomDefinitionId(roomDefinitionId);
    setAnnouncement(
      "Room placement started. Choose a clear facility area.",
    );
  }, []);

  const cancelPlacement = useCallback(() => {
    setSelectedRoomDefinitionId(null);
    setAnnouncement("Room placement canceled.");
  }, []);

  const placeRoom = useCallback(
    (tileX: number, tileY: number) => {
      const roomDefinitionId = selectedRoomDefinitionId;
      if (!roomDefinitionId) {
        setAnnouncement("Select a room before choosing its location.");
        return;
      }
      const status = execute({
        type: "PLACE_ROOM",
        roomId: `room.instance.${stateRef.current.rooms.length + 1}`,
        roomDefinitionId,
        x: tileX,
        y: tileY,
      });
      if (status === "applied") {
        setSelectedRoomDefinitionId(null);
      }
    },
    [execute, selectedRoomDefinitionId],
  );

  const hireStaff = useCallback(
    (staffRoleDefinitionId: string) => {
      const role = getStaffRoleDefinition(staffRoleDefinitionId);
      execute({
        type: "HIRE_STAFF",
        employeeId: `employee.instance.${stateRef.current.employees.length + 1}`,
        staffRoleDefinitionId,
        displayName: role
          ? `Clinic ${role.displayName}`
          : "Clinic employee",
      });
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
    execute(
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

  const togglePause = useCallback(() => {
    const current = stateRef.current;
    execute({
      type: "SET_PAUSED",
      paused: !current.paused,
    });
  }, [execute]);

  const activateNewCampaign = useCallback(
    (announcementText: string, campaignSeed?: string) => {
      const currentProfile = profileRef.current;
      const campaign = createLocalCampaign(
        currentProfile.nextCampaignNumber,
        new Set(
          currentProfile.campaigns.map(
            (existingCampaign) => existingCampaign.campaignId,
          ),
        ),
        Date.now(),
        campaignSeed,
      );
      const nextProfile: LocalPrototypeProfile = {
        ...currentProfile,
        activeCampaignId: campaign.campaignId,
        nextCampaignNumber: currentProfile.nextCampaignNumber + 1,
        campaigns: [
          ...currentProfile.campaigns.map((existingCampaign) => ({
            ...existingCampaign,
            status: "archived" as const,
          })),
          campaign,
        ],
      };
      profileRef.current = nextProfile;
      setProfile(nextProfile);
      stateRef.current = campaign.state;
      setState(campaign.state);
      setSelectedRoomDefinitionId(null);
      setSummaryVisible(false);
      const saved = savePrototypeProfile(nextProfile);
      saveWarningShownRef.current = !saved;
      setAnnouncement(
        saved
          ? announcementText
          : `${announcementText} Local saving is unavailable.`,
      );
    },
    [],
  );

  const createCampaign = useCallback(() => {
    activateNewCampaign(
      "New clinic campaign created with fresh learning histories.",
    );
  }, [activateNewCampaign]);

  const switchCampaign = useCallback((campaignId: string) => {
    const currentProfile = profileRef.current;
    const selectedCampaign = currentProfile.campaigns.find(
      (campaign) => campaign.campaignId === campaignId,
    );
    if (!selectedCampaign) {
      setAnnouncement("That local campaign could not be found.");
      return;
    }
    if (campaignId === currentProfile.activeCampaignId) {
      setAnnouncement(`${selectedCampaign.name} is already open.`);
      return;
    }

    const nextProfile: LocalPrototypeProfile = {
      ...currentProfile,
      activeCampaignId: campaignId,
      campaigns: currentProfile.campaigns.map((campaign) => ({
        ...campaign,
        status:
          campaign.campaignId === campaignId
            ? ("active" as const)
            : ("archived" as const),
      })),
    };
    profileRef.current = nextProfile;
    setProfile(nextProfile);
    stateRef.current = selectedCampaign.state;
    setState(selectedCampaign.state);
    setSelectedRoomDefinitionId(null);
    setSummaryVisible(false);
    const saved = savePrototypeProfile(nextProfile);
    saveWarningShownRef.current = !saved;
    setAnnouncement(
      saved
        ? `${selectedCampaign.name} opened. Its learning history is unchanged.`
        : `${selectedCampaign.name} opened, but local saving is unavailable.`,
    );
  }, []);

  const restart = useCallback(() => {
    activateNewCampaign(
      "Fresh clinic campaign started. The previous campaign remains available in Campaigns.",
      stateRef.current.campaignSeed,
    );
  }, [activateNewCampaign]);

  const tutorialTargetEncounter =
    Object.values(state.encounters).find(
      (encounter) =>
        encounter.arrivalClass === "tutorial" &&
        encounter.lifecycle === "waiting_unopened" &&
        encounter.firstOpenedAtTick === null,
    ) ?? null;
  const anyChartHasBeenOpened = Object.values(state.encounters).some(
    (encounter) => encounter.firstOpenedAtTick !== null,
  );
  const tutorialIntroDismissed =
    profile.tutorialIntroDismissedCampaignIds.includes(state.campaignId);
  const tutorialCoachMode =
    !profile.tutorialsEnabled ||
    anyChartHasBeenOpened ||
    tutorialTargetEncounter === null
      ? null
      : tutorialIntroDismissed
        ? ("callout" as const)
        : ("intro" as const);

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
    }))
    .sort(
      (left, right) =>
        Number(right.active) - Number(left.active) ||
        right.createdAtRealMs - left.createdAtRealMs,
    );

  return {
    state,
    campaigns,
    tutorialsEnabled: profile.tutorialsEnabled,
    tutorialCoachMode,
    tutorialTargetEncounterId: tutorialTargetEncounter?.id ?? null,
    selectedRoomDefinitionId,
    summaryVisible,
    announcement,
    togglePause,
    openPatient,
    closeChart,
    submitAnswer,
    acknowledgeTerminalFeedback,
    toggleSummary,
    fileChart: closeChart,
    beginPlacement,
    cancelPlacement,
    placeRoom,
    hireStaff,
    levelUp,
    fastForward,
    addMoney,
    createCampaign,
    switchCampaign,
    openTutorialPatient,
    dismissTutorialIntro,
    setTutorialsEnabled,
    restart,
  };
}
