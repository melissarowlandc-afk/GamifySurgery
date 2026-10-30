import { problemDiagnostics } from "../diagnostics/problemDiagnostics";
import { AccountMenu } from "../ui/AccountMenu";
import { useAuthAccountActions } from "../auth/AuthAccountContext";
import { ProblemReportButton, TesterFeedbackForm, useTesterFeedback } from "../feedback/TesterFeedback";
import { VersionLabel } from "../appVersion";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { BuildDoorTool } from "../facility";
import { patientChartIdForCharacter } from "../facility/characterInspect";
import { MobileFacilityMap as FacilityCanvas } from "./map/MobileFacilityMap";
import type { MobileInspectorSelection, MobileMapSelection } from "./map/selection";
import { MobileInspectorSheet } from "./MobileInspectorSheet";
import type { PrototypeShellProps } from "../shellContract";
import { setPresentationPreference } from "../shellPresentation";
import { clinicFeedForTutorial } from "../session/tutorialTipsIntegration";
import type { PrototypeSaveResult } from "../session/prototypeStorage";
import { MobilePerformanceTools as MobilePrototypeTools } from "./performance/MobilePrototypeTools";
import { mobileMapIsCovered } from "./performance/presentationPolicy";
import { HELP_TOPICS } from "../ui/HelpDialog";
import { MobileHelpTopic } from "./MobileHelpTopic";
import { MobileManage } from "./manage/MobileManage";
import { QuestionReviewQueueDialog } from "../ui/QuestionReviewQueueDialog";
import { SaveFailureRecovery } from "../ui/SaveCloseDialog";
import { CloudSaveControls, cloudStatusText } from "../ui/CloudSaveControls";
import type { ClinicAlertAction, MessageBoardTargetType, NeedsYouItemView, ProcedureSetupRequirementView } from "../ui/types";
import { MobileCampaignManager, MobileRestartDialog } from "./desktopPanelAdapters";
import { MobileBuildCatalog } from "./build/MobileBuildCatalog";
import { MobileBuildRoom } from "./build/MobileBuildRoom";
import { MobileBuildControls, MobileBuildExitSheet } from "./build/MobileBuildControls";
import { useMobileBuild } from "./build/useMobileBuild";
import { MobilePatients } from "./MobilePatients";
import { MobileChart, MobileTeamDiscussion } from "./MobileChart";
import { MobileAlerts } from "./MobileAlerts";
import { MobileGoals, MobileGoalsChip } from "./MobileGoals";
import { MobileInspection, MobileFinishedGamePage } from "./MobileInspection";
import { MobileAdvertising, MobileAdvertisingChip, MobileGlp1ConsultChip, MobileGlp1ConsultInfo } from "./MobileQuickControls";
import { MobileTutorialCoach } from "./MobileTutorialCoach";
import { resolveMobileTutorialTarget, type PhoneMapFocus } from "./tutorialTargets";
import { usePhoneTutorialAnchor } from "./usePhoneTutorialAnchor";
import { phoneLocatedModel } from "./phoneMapFocus";
import { phoneAlertTarget, phoneAlertActionRoute, type PhoneAlertRoute } from "./alertNavigation";
import { MobileSheet } from "./MobileSheet";
import { MobileCashExplanation, MobileTopBar } from "./MobileTopBar";
import { useMobileNavigation, type MobileSheetId, type MobileTab } from "./navigation";
import "./mobileShell.css";
import "./mobileScreens.css";
import "./build/mobileBuild.css";
import "./mobilePolish.css";

const TABS: readonly { id: MobileTab; label: string; symbol: string }[] = [
  { id: "clinic", label: "Clinic", symbol: "⌂" },
  { id: "patients", label: "Patients", symbol: "▤" },
  { id: "alerts", label: "Alerts", symbol: "!" },
  { id: "manage", label: "Manage", symbol: "☷" },
  { id: "build", label: "Build", symbol: "+" },
];

export function mobileNeeds(props: Pick<PrototypeShellProps, "needsYou" | "systemNotices">): NeedsYouItemView[] {
  return [
    ...props.systemNotices.filter((notice) => notice.targetType === "save").slice(-1).map((notice): NeedsYouItemView => ({
      id: notice.id, kind: "save", title: "Campaign save failed", why: notice.message,
      sortKey: notice.sortKey ?? 0, timeLabel: notice.timeLabel, action: { kind: "save_and_pause" },
      actionLabel: "Retry save & pause", targetType: "save",
    })),
    ...(props.needsYou ?? []),
  ];
}

/** Existing Needs you categories already distinguish departure/payroll/save risks from setup needs. */
export const direMobileNeed = (needs: readonly NeedsYouItemView[]) =>
  needs.find((need) => need.kind === "save" || need.kind === "patient" || need.kind === "payroll");

export default function MobileShell(props: PrototypeShellProps) {
  const account = useAuthAccountActions();
  const setShellOwnsSignOut = account?.setShellOwnsSignOut;
  useEffect(() => {
    setShellOwnsSignOut?.(true);
    return () => setShellOwnsSignOut?.(false);
  }, [setShellOwnsSignOut]);
  const feedback = useTesterFeedback();
  const shellRef = useRef<HTMLDivElement>(null);
  const [alertFocus, setAlertFocus] = useState<PhoneMapFocus | null>(null);
  const [mapSelection, setMapSelection] = useState<MobileInspectorSelection | null>(null);
  const [doorTool, setDoorTool] = useState<BuildDoorTool>(null);
  const build = useMobileBuild(props, doorTool, setDoorTool);
  const [pendingTab, setPendingTab] = useState<MobileTab | null>(null);
  const [pendingTutorialGoals, setPendingTutorialGoals] = useState(false);
  const [setupAction, setSetupAction] = useState<NonNullable<ProcedureSetupRequirementView["action"]> | null>(null);
  const [highlightedEmployee, setHighlightedEmployee] = useState<string | null>(null);
  const [highlightedRole, setHighlightedRole] = useState<string | null>(null);
  const [requestedTraining, setRequestedTraining] = useState<{ employeeId: string; requestKey: number } | null>(null);
  const manageDetailBack = useRef<(() => void) | null>(null);
  const registerManageBack = useCallback((handler: (() => void) | null) => { manageDetailBack.current = handler; }, []);
  const inspectionDetailBack = useRef<(() => void) | null>(null);
  const registerInspectionBack = useCallback((handler: (() => void) | null) => { inspectionDetailBack.current = handler; }, []);
  const [mapHint, setMapHint] = useState<{ text: string } | null>(null);
  const [roomToOpen, setRoomToOpen] = useState<string | null>(null);
  const [failures, setFailures] = useState<Record<string, string>>({});
  const [helpTopic, setHelpTopic] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const [saveResult, setSaveResult] = useState<PrototypeSaveResult | null>(null);
  const [cloudCloseRequest, setCloudCloseRequest] = useState(0);
  const [cloudSaveBusy, setCloudSaveBusy] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [previewRequests, setPreviewRequests] = useState<{ campaignId?: string; ids: readonly string[] }>({ campaignId: props.facility.campaignId, ids: [] });
  const previewRoomIds = previewRequests.campaignId === props.facility.campaignId ? previewRequests.ids : [];
  const requestRoomPreview = useCallback((id: string) => setPreviewRequests(current => {
    const ids = current.campaignId === props.facility.campaignId ? current.ids : [];
    return ids.includes(id) ? current : { campaignId: props.facility.campaignId, ids: [...ids, id] };
  }), [props.facility.campaignId]);
  const historyLimit = props.mobileBuildActions?.setHistoryLimit;
  useEffect(() => { historyLimit?.(true); return () => historyLimit?.(false); }, [historyLimit]);
  const hostRef = useRef<HTMLDivElement>(null);
  const resumeAfterHelp = useRef(false);
  const helpActive = useRef(false);
  const reviewActive = useRef(false);
  const resumeAfterReview = useRef(false);
  const latest = useRef(props);
  latest.current = props;
  useEffect(() => problemDiagnostics.source("shell", () => ({ layout: "phone", buildMode: latest.current.buildMode,
    managementMode: latest.current.managementMode, paused: latest.current.paused, speed: latest.current.simulationSpeed,
    facilityLevel: latest.current.campaigns.find(c => c.active)?.facilityLevel ?? 0 })), []);

  const previousModes = useRef({ build: props.buildMode, manage: props.managementMode });

  const closeHelp = () => {
    helpActive.current = false;
    setHelpOpen(false);
    props.onReferencePauseLockedChange?.(false);
    if (resumeAfterHelp.current && props.paused && !props.buildMode && !props.managementMode) props.onTogglePause();
    resumeAfterHelp.current = false;
  };
  const { navigator, state: navigation } = useMobileNavigation(props.buildMode ? "build" : props.managementMode ? "manage" : "clinic", (sheet) => {
    const nativeDialog = typeof document === "undefined" ? null : document.querySelector<HTMLDialogElement>(".mobile-shell dialog[open]");
    if (nativeDialog) { nativeDialog.dispatchEvent(new Event("cancel", { cancelable: true })); return false; }
    const nestedDialog = typeof document === "undefined" ? null : document.querySelector<HTMLElement>(".mobile-shell .dialog-backdrop [aria-modal='true']");
    const cancel = nestedDialog?.querySelector<HTMLButtonElement>(".dialog-actions button");
    if (cancel) { cancel.click(); return false; }
    if ((sheet === "goals" || sheet === "inspection") && inspectionDetailBack.current) { inspectionDetailBack.current(); return false; }
    if (sheet === "chart" && props.chart) { props.onCloseChart(); return false; }
    if (sheet === "discussion" && props.employeeDiscussion) { props.onCloseEmployeeDiscussion?.(); return false; }
    if (sheet === "build" && props.buildMode) return true;
    if (sheet === "manage" && props.managementMode) {
      if (manageDetailBack.current) manageDetailBack.current();
      else props.onExitManagementMode();
      return false;
    }
    if (sheet === "help") closeHelp();
    return true;
  });
  const top = navigation.sheets.at(-1);
  const needs = mobileNeeds(props);
  const dire = direMobileNeed(needs);
  const feed = clinicFeedForTutorial([...props.messages, ...props.systemNotices.filter((notice) => notice.targetType !== "save")], props.tutorialStep);
  const waitingCount = props.patients.filter((patient) => patient.folder === "waiting").length +
    (props.employeeDiscussionRows ?? []).filter((discussion) => discussion.folder === "waiting").length;
  const campaignId = props.campaigns.find((campaign) => campaign.active)?.campaignId;
  const query = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const showTools = import.meta.env.DEV && (query.get("prototype-tools") === "1" ||
    (query.get("prototype-tools") !== "0" && typeof window !== "undefined" && window.navigator.webdriver));

  useEffect(() => {
    // Enable notch insets only while the phone presentation is mounted.
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const original = viewport?.content;
    if (!viewport || original === undefined || original.includes("viewport-fit=")) return;
    const mobile = `${original}, viewport-fit=cover`;
    viewport.content = mobile;
    return () => { if (viewport.content === mobile) viewport.content = original; };
  }, []);

  const activateTab = (tab: MobileTab) => {
    setPendingTab(null);
    navigator.selectTab(tab);
    if (tab === "build" && !props.buildMode) props.onEnterBuildMode();
    if (tab === "manage" && !props.managementMode) props.onEnterManagementMode();
  };
  const requestTab = (tab: MobileTab) => {
    setPendingTutorialGoals(false);
    if (tab === "build") build.exitDoors();
    if (top === "help") closeHelp();
    if (props.buildMode && tab !== "build") {
      setPendingTab(tab); build.done(); return;
    }
    if (props.managementMode && tab !== "manage") {
      setPendingTab(tab); props.onExitManagementMode(); return;
    }
    if (props.chart) {
      setPendingTab(tab); props.onCloseChart(); return;
    }
    if (props.employeeDiscussion) {
      setPendingTab(tab); props.onCloseEmployeeDiscussion?.(); return;
    }
    activateTab(tab);
  };
  const requestTutorialTab = (tab: MobileTab) => {
    requestTab(tab);
    if (tab === "clinic" && (props.tutorialStep?.target === "goals" || props.tutorialStep?.target === "level-up")) {
      setPendingTutorialGoals(true);
    }
  };
  useEffect(() => {
    if (!pendingTutorialGoals || pendingTab !== null || props.buildMode || props.managementMode || props.chart || props.employeeDiscussion ||
      navigation.tab !== "clinic" || navigation.sheets.includes("chart") || navigation.sheets.includes("discussion")) return;
    setPendingTutorialGoals(false); navigator.open("goals");
  }, [pendingTutorialGoals, pendingTab, props.buildMode, props.managementMode, props.chart, props.employeeDiscussion, navigation.tab, navigation.sheets, navigator]);

  useEffect(() => {
    if (props.chart) navigator.open("chart");
    else navigator.dismiss("chart");
  }, [props.chart?.id, navigator]);
  useEffect(() => {
    if (props.employeeDiscussion) navigator.open("discussion");
    else navigator.dismiss("discussion");
  }, [props.employeeDiscussion?.id, navigator]);
  useEffect(() => {
    const previous = previousModes.current;
    previousModes.current = { build: props.buildMode, manage: props.managementMode };
    if (props.buildMode && !previous.build && navigator.getSnapshot().tab !== "build") navigator.selectTab("build");
    if (props.managementMode && !previous.manage && navigator.getSnapshot().tab !== "manage") navigator.selectTab("manage");
    if (!props.buildMode) setDoorTool(null);
    if ((previous.build && !props.buildMode) || (previous.manage && !props.managementMode)) {
      if (pendingTab === null && !props.chart && !props.employeeDiscussion) navigator.selectTab("clinic");
    }
    if (pendingTab !== null && !props.buildMode && !props.managementMode && !props.chart && !props.employeeDiscussion) {
      setPendingTab(null); activateTab(pendingTab);
    }
  }, [props.buildMode, props.managementMode, props.chart, props.employeeDiscussion, pendingTab, navigator]);
  useEffect(() => {
    if (!setupAction) return;
    const tab = setupAction.target === "room" ? "build" : "manage";
    // Match desktop's staged setup navigation: exit, wait for new props, enter,
    // then apply the placement/highlight. Never enter twice in one effect pass.
    if (tab === "build") {
      if (props.managementMode) { props.onExitManagementMode(); return; }
      if (!props.buildMode) { navigator.selectTab(tab); props.onEnterBuildMode(); return; }
    } else {
      if (props.buildMode) { props.onExitBuildMode(); return; }
      if (!props.managementMode) { navigator.selectTab(tab); props.onEnterManagementMode(); return; }
    }
    navigator.selectTab(tab);
    if (setupAction.target === "room") { setDoorTool(null); props.onBeginPlacement(setupAction.id); }
    else setHighlightedRole(setupAction.id);
    setSetupAction(null);
  }, [setupAction, props.buildMode, props.managementMode]);
  useEffect(() => {
    if (roomToOpen && props.buildMode) {
      props.onSelectRoom(roomToOpen); setDoorTool(null); navigator.open("room"); setRoomToOpen(null);
    }
  }, [roomToOpen, props.buildMode]);
  useEffect(() => {
    if (!props.selectedRoomBuild || !props.buildMode) navigator.dismiss("room");
  }, [props.selectedRoomBuild, props.buildMode, navigator]);
  useEffect(() => { setFailures({}); setRequestedTraining(null); }, [campaignId]);
  useEffect(() => { setMapSelection(null); navigator.dismiss("inspector"); }, [campaignId, props.buildMode, navigator]);
  useEffect(() => { setMapHint(null); }, [campaignId, props.buildMode]);
  useEffect(() => {
    if (!mapHint) return;
    const timer = window.setTimeout(() => setMapHint(null), 1_800);
    return () => window.clearTimeout(timer);
  }, [mapHint]);
  useEffect(() => () => {
    // Rotation/layout changes can unmount Help; do not leave its reference lock behind.
    if (helpActive.current) {
      latest.current.onReferencePauseLockedChange?.(false);
      if (resumeAfterHelp.current && latest.current.paused && !latest.current.buildMode && !latest.current.managementMode) latest.current.onTogglePause();
    }
    if (reviewActive.current && resumeAfterReview.current && latest.current.paused && !latest.current.buildMode && !latest.current.managementMode) latest.current.onTogglePause();
  }, []);

  // A refused open keeps the patient list visible. Session projections own these sheets.
  const openPatient = (id: string) => { props.onOpenPatient(id); };
  const openDiscussion = (id: string) => { props.onOpenEmployeeDiscussion?.(id); };
  const openRoom = (id: string) => {
    if (!props.buildMode) { setRoomToOpen(id); requestTab("build"); return; }
    props.onSelectRoom(id); setDoorTool(null); navigator.open("room");
  };
  const selectMapTarget = (selection: MobileMapSelection | null) => {
    setMapHint(null);
    if (selection?.kind === "character") {
      const chartId = patientChartIdForCharacter(selection.character, props.facility);
      // The shared lists exclude pre-check-in patients; filed rows stay inspection-only on the map.
      if (chartId && props.patients.some(patient => patient.id === chartId && patient.folder !== "resolved")) {
        setMapSelection(null); navigator.dismiss("inspector"); openPatient(chartId); return;
      }
    }
    let hint: string | null = null;
    if (selection?.kind === "floor") {
      // The scene owns floor movement; lawn is rejected without a command.
      if (!selection.accepted) hint = "No walkable route, or the founder is doing required work.";
    } else if (selection?.kind === "chair") {
      const { roomInstanceId, location, seatId, occupied } = selection.chair;
      const accepted = !occupied && (seatId ? props.onSeatFounderInChair?.(roomInstanceId, location, seatId)
        : props.onSeatFounderInChair?.(roomInstanceId, location));
      if (!accepted) hint = occupied ? "Seat occupied." : "Seat unavailable, or the founder is doing required work.";
    } else if (selection?.kind === "front-desk") {
      if (!props.onSeatFounderAtFrontDesk?.()) hint = "Front Desk unavailable, or the founder is doing required work.";
    } else if (selection?.kind === "environment") {
      if (selection.action === "collect-litter" && selection.id) props.onCollectLitter?.(selection.id);
      else props.onRefillWaterCooler?.();
    } else {
      if (selection?.kind === "room" && selection.moveAccepted === false) {
        hint = "No walkable route, or the founder is doing required work.";
      }
      setMapSelection(selection);
      if (selection) navigator.open("inspector"); else navigator.dismiss("inspector");
      if (hint) setMapHint({ text: hint });
      return;
    }
    setMapSelection(null); navigator.dismiss("inspector");
    if (hint) setMapHint({ text: hint });
  };
  const navigateAlert = (route: PhoneAlertRoute | null) => {
    if (!route) return;
    if (route.kind === "patient") { if (route.id) openPatient(route.id); else requestTab("patients"); }
    if (route.kind === "room") { if (route.id) openRoom(route.id); else requestTab("build"); }
    if (route.kind === "sheet") navigator.open(route.sheet);
    if (route.kind === "map") { setAlertFocus({ ...route.focus, key: `${route.focus.key}:${Date.now()}` }); requestTab("clinic"); }
    if (route.kind === "tab") {
      if (route.employeeId) setHighlightedEmployee(route.employeeId);
      if (route.roleId) setHighlightedRole(route.roleId);
      if (route.training && route.employeeId) setRequestedTraining(previous => ({ employeeId: route.employeeId!, requestKey: (previous?.requestKey ?? 0) + 1 }));
      if (route.definitionId) setSetupAction({ target: "room", id: route.definitionId, label: "Build" });
      else requestTab(route.tab);
    }
  };
  const handleTarget = (target?: { type: MessageBoardTargetType; id?: string }) => {
    if (target) navigateAlert(phoneAlertTarget(target.type, target.id));
  };
  const runAction = async (id: string, action: ClinicAlertAction) => {
    if (action.kind === "save_and_pause" && props.cloudSave) { await props.cloudSave.onSaveAndClose(); return; }
    const result = action.kind === "save_and_pause" ? await props.onSaveAndPause() :
      props.onClinicAlertAction?.(action) ?? { ok: false, reason: "This action is unavailable in this preview." };
    if (action.kind === "save_and_pause") setSaveResult(result as PrototypeSaveResult);
    setFailures((current) => {
      const next = { ...current };
      if (result.ok) delete next[id]; else next[id] = "reason" in result && result.reason ? result.reason : "The action could not be applied. Keep this tab open and retry.";
      return next;
    });
    if (!result.ok) return;
    navigateAlert(phoneAlertActionRoute(action));
  };
  const showHelp = () => {
    helpActive.current = true;
    resumeAfterHelp.current = !props.paused;
    setHelpTopic(null); setHelpOpen(true);
    props.onReferencePauseLockedChange?.(true);
    if (!props.paused) props.onTogglePause();
    navigator.replaceTop("help");
  };
  const showSave = async () => {
    if (props.cloudSave) { navigator.dismiss("more"); setCloudCloseRequest(value => value + 1); return; }
    setSaveResult(await props.onSaveAndPause()); setConfirmClear(false); navigator.replaceTop("save");
  };
  const panel = (id: MobileSheetId): { title: string; kind?: "bottom"; content: ReactNode } | null => {
    switch (id) {
      case "inspector": return null;
      case "patients": return { title: "Patients", content: <MobilePatients patients={props.patients} discussions={props.employeeDiscussionRows}
        onOpenDiscussion={openDiscussion} onOpen={openPatient} tutorialTargetEncounterId={props.tutorialTargetEncounterId}
        availabilityGuidance={props.patientAvailabilityGuidance} /> };
      case "chart": return props.chart ? { title: "Patient chart", content: <MobileChart chart={props.chart}
        onClose={props.onCloseChart} onSubmitAnswer={props.onSubmitAnswer} onFlagQuestion={props.onFlagQuestion}
        onAcknowledgeTerminalFeedback={props.onAcknowledgeTerminalFeedback} onToggleSummary={props.onToggleSummary} onFileChart={props.onFileChart} /> } : null;
      case "discussion": return props.employeeDiscussion ? { title: "Team discussion", content: <MobileTeamDiscussion discussion={props.employeeDiscussion} onFlagQuestion={props.onFlagQuestion}
        onClose={props.onCloseEmployeeDiscussion ?? (() => {})} onAnswer={props.onAnswerEmployeeDiscussion ?? (() => {})}
        onAcknowledge={props.onAcknowledgeEmployeeDiscussion ?? (() => {})} onFile={props.onFileEmployeeDiscussion ?? (() => {})} /> } : null;
      case "alerts": return { title: "Alerts", content: <><MobileAlerts key={campaignId} items={feed} needs={needs} failures={failures}
        onNeedAction={(need) => runAction(need.id, need.action)} onFeedAction={(item) => {
          if (item.action) runAction(item.id, item.action);
          else if (item.targetType) handleTarget({ type: item.targetType, id: item.targetId });
        }} /><MobileGlp1ConsultInfo view={props.emergencyGlp1} /></> };
      case "manage": return { title: "Manage", content: <MobileManage {...props} highlightedEmployeeId={highlightedEmployee}
        competitionTutorial={{ campaignId: props.facility.campaignId ?? "", enabled: props.tutorialsEnabled }}
        highlightedRoleId={highlightedRole} requestedTraining={requestedTraining} onDetailBackChange={registerManageBack}
        onSetupAction={(action) => setSetupAction({ ...action, label: action.target === "room" ? "Build" : "Hire" })} /> };
      case "build": return { title: "Build", kind: "bottom", content: <MobileBuildCatalog props={props}
        onPreviewRoom={requestRoomPreview}
        onChoose={(id) => { build.start(); setDoorTool(null); navigator.selectTab("clinic"); props.onBeginPlacement(id); }} onOpenRoom={openRoom}
        onDoors={() => { props.onCancelPlacement(); setDoorTool("place"); navigator.selectTab("clinic"); }} onSetup={setSetupAction} /> };
      case "room": return props.selectedRoomBuild && props.buildMode ? { title: props.selectedRoomBuild.displayName, kind: "bottom",
        content: <MobileBuildRoom props={props} room={props.selectedRoomBuild}
          onMove={() => { build.start(); setDoorTool(null); navigator.selectTab("clinic"); props.onBeginMoveSelectedRoom?.(); }}
          onDoors={() => { props.onCancelPlacement(); navigator.selectTab("clinic"); setDoorTool("place"); }} /> } : null;
      case "goals": return { title: "Goals", content: <MobileGoals view={props.progression} onLevelUp={props.onLevelUp} onBookInspection={props.onBookInspection} onCancelInspection={props.onCancelInspection}
        onViewFinishReport={props.onViewFinishReport} onShowInspection={props.progression.inspection ? () => navigator.open("inspection") : undefined}
        onDetailBackChange={registerInspectionBack} onSetupAction={setSetupAction} /> };
      case "inspection": return props.progression.inspection ? { title: "Inspection", content: <MobileInspection view={props.progression.inspection}
        onBook={props.onBookInspection} onCancel={props.onCancelInspection} onViewFinish={props.onViewFinishReport} onDetailBackChange={registerInspectionBack} /> } : null;
      case "cash": return { title: "Money", kind: "bottom", content: <MobileCashExplanation view={props.resourceBar} /> };
      case "feedback": return feedback ? { title: "Send feedback", kind: "bottom", content:
        <TesterFeedbackForm transport={feedback} level={props.campaigns.find(campaign => campaign.active)?.facilityLevel ??
          Number(props.progression.facilityLevelLabel.match(/\d+/)?.[0] ?? 0)} shell="phone" onCancel={() => navigator.closeTop()} /> } : null;
      case "advertising": return { title: "Advertising", kind: "bottom", content: <MobileAdvertising view={props.advertising} onLevelChange={props.onAdvertisingLevelChange} /> };
      case "emergency": return { title: "GLP-1 consult", kind: "bottom", content: <MobileGlp1ConsultInfo view={props.emergencyGlp1} /> };
      case "help": { const topic = HELP_TOPICS.find((topic) => topic.id === helpTopic);
        return { title: "Help", content: <>
          <p>The facility is paused while Help is open.</p>
          <VersionLabel />
          {topic ? <><MobileHelpTopic topic={topic} /><button type="button" onClick={() => setHelpTopic(null)}>All topics</button></>
            : <nav className="mobile-menu" aria-label="Help topics">{HELP_TOPICS.map((topic) => <button type="button" key={topic.id} onClick={() => setHelpTopic(topic.id)}>{topic.title}</button>)}</nav>}
          <button type="button" onClick={() => { navigator.closeTop(); props.onTutorialsEnabledChange(true); }}>Show guidance here</button>
          {props.onReplayFirstShift ? <button type="button" onClick={() => { navigator.closeTop(); props.onReplayFirstShift?.(); }}>Replay first shift in a new clinic</button> : null}
        </> }; }
      case "save": return { title: "Save & Close", content: saveResult ? <>
        <h3>{saveResult.ok ? "Safe to close this tab" : "Keep this tab open"}</h3>
        {saveResult.ok ? <p>Your clinic is saved and paused. Close this browser tab or window whenever you are ready.</p>
          : <SaveFailureRecovery result={saveResult} confirmClear={confirmClear} onRequestClear={() => setConfirmClear(true)}
            onCancelClear={() => setConfirmClear(false)} onConfirmClear={() => props.onClearLocalCampaigns()} />}
        <button type="button" onClick={showSave}>Retry save & pause</button>
        <button type="button" onClick={() => navigator.closeTop()}>Return to paused clinic</button>
      </> : <button type="button" onClick={showSave}>Save &amp; Close</button> };
      case "tools": return { title: "Prototype tools", content: showTools ? <MobilePrototypeTools view={props.development}
        paused={props.paused} tutorialsEnabled={props.tutorialsEnabled} onFastForward={props.onFastForward} onAddMoney={props.onAddMoney}
        onTogglePause={props.onTogglePause} onRestart={props.onRestart} onRestartOpenChange={setRestartOpen} onTutorialsEnabledChange={props.onTutorialsEnabledChange} /> : <p>Prototype tools are unavailable in this build.</p> };
      case "more": return { title: "More", kind: "bottom", content: <div className="mobile-menu">
        <ProblemReportButton shell="phone" level={props.campaigns.find(campaign => campaign.active)?.facilityLevel ?? 0} />
        <button type="button" onClick={showHelp}>Help</button>
        {feedback ? <button type="button" onClick={() => navigator.open("feedback")}>Send feedback</button> : null}
        <AccountMenu />
        <VersionLabel />
        <MobileCampaignManager campaigns={props.campaigns} accountMode={Boolean(props.cloudSave)} onCreateCampaign={props.onCreateCampaign} onSwitchCampaign={props.onSwitchCampaign} />
        <MobileRestartDialog paused={props.paused} accountMode={Boolean(props.cloudSave)} onTogglePause={props.onTogglePause} onRestart={props.onRestart} onOpenChange={setRestartOpen} />
        <button type="button" onClick={() => navigator.replaceTop("goals")}>Goals</button>
        {props.progression.inspection ? <button type="button" onClick={() => navigator.replaceTop("inspection")}>Inspection</button> : null}
        {props.progression.inspection?.finish && props.onViewFinishReport ? <button type="button" onClick={props.onViewFinishReport}>View finish report</button> : null}
        <button type="button" onClick={() => navigator.replaceTop("emergency")}>GLP-1 consult info</button>
        <button type="button" onClick={() => navigator.replaceTop("advertising")}>Advertising</button>
        <button type="button" onClick={() => navigator.replaceTop("tools")}>Prototype tools</button>
        {query.get("question-review") === "1" ? <QuestionReviewQueueDialog flags={props.questionReviewFlags} paused={props.paused}
          onTogglePause={props.onTogglePause} onStatusChange={props.onQuestionReviewStatusChange} onOpenChange={(open) => {
            if (open) resumeAfterReview.current = !props.paused;
            else resumeAfterReview.current = false;
            reviewActive.current = open; setReviewOpen(open);
          }} /> : null}
        <fieldset><legend>Layout on this device</legend><div className="mobile-layout-switch">
          <button type="button" aria-pressed="true" onClick={() => setPresentationPreference("phone")}>Phone layout</button>
          <button type="button" aria-pressed="false" onClick={() => setPresentationPreference("desktop")}>Desktop layout</button>
        </div></fieldset>
        <button type="button" onClick={showSave}>Save &amp; Close</button>
        {props.resourceBar.contentNoticeLabel ? <p role="note">{props.resourceBar.contentNoticeLabel}</p> : null}
      </div> };
    }
  };
  const visiblePanel = top ? panel(top) : null;
  const coachStep = helpOpen || reviewOpen || restartOpen || top === "more" || top === "save" || top === "tools" || top === "feedback" ? null : props.tutorialStep;
  const tutorialTarget = resolveMobileTutorialTarget(coachStep, { sheet: top, buildMode: props.buildMode });
  const tutorialTab = usePhoneTutorialAnchor(shellRef, coachStep, tutorialTarget, top);
  const mapFocus = top === undefined || top === "inspector" ? tutorialTarget?.mapFocus ?? alertFocus : null;

  return <div className="mobile-shell" ref={shellRef}>
    <MobileTopBar {...props} referenceLocked={helpOpen || reviewOpen || restartOpen || props.finishReportOpen || Boolean(props.cloudSave && !props.cloudSave.view.canExecute)} onCash={() => navigator.open("cash")} onMore={() => navigator.open("more")}
      referenceLockReason={props.cloudSave && !props.cloudSave.view.canExecute ? cloudStatusText(props.cloudSave.view) ?? "Check your account save before resuming." : undefined}
      cloudStatus={props.cloudSave ? <CloudSaveControls save={props.cloudSave} closeRequest={cloudCloseRequest}
        showCloseButton={false} blockedNoticePlacement="inline" onBusyChange={setCloudSaveBusy} /> : undefined} />
    <main className="mobile-content" aria-label="Clinic workspace">
      <div className="mobile-workspace" style={{ "--mobile-build-control-height": `${build.controlsHeight}px` } as CSSProperties}>
      <div className="mobile-map" data-phone-anchor="map" ref={hostRef} style={props.buildMode ? { bottom: build.controlsHeight } : undefined}>
        <FacilityCanvas viewModel={phoneLocatedModel({ ...props.facility, buildDoorTool: doorTool }, mapFocus)} focus={mapFocus} style={{ height: "100%", border: 0 }}
          mobileMapCovered={mobileMapIsCovered(navigation.tab, visiblePanel ? visiblePanel.kind ?? "full" : null, restartOpen || reviewOpen)}
          mobileFacilityLevel={props.campaigns.find(campaign => campaign.active)?.facilityLevel ?? 0} mobilePreviewRoomIds={previewRoomIds}
          mobileBuild={build.map} onPlaceRoom={props.onPlaceRoom} onSelectRoom={openRoom} onRequestRoomUpgrade={openRoom} onPlaceDoor={props.onPlaceDoor} onRemoveDoor={props.onRemoveDoor}
          onCollectLitter={props.onCollectLitter} onRefillWaterCooler={props.onRefillWaterCooler} onSeatFounderAtFrontDesk={props.onSeatFounderAtFrontDesk}
          onSeatFounderInChair={props.onSeatFounderInChair} onDescribeCharacter={props.onDescribeCharacter}
          onPraiseEmployee={props.onPraiseEmployee} onMoveFounder={props.onMoveFounder}
          onMobileSelection={selectMapTarget} />
      </div>
      <div className="mobile-map-chips">
        <MobileGoalsChip key={`goals:${props.facility.campaignId}`} view={props.progression} onLevelUp={props.onLevelUp} onShowGoals={() => navigator.open("goals")} />
        <MobileAdvertisingChip view={props.advertising} onOpen={() => navigator.open("advertising")} />
        <MobileGlp1ConsultChip key={`consult:${props.facility.campaignId}`} view={props.emergencyGlp1} onConsult={props.onRunEmergencyGlp1Consultation}
          blockedReason={props.buildMode ? "Exit Build Mode before running the emergency consultation." : undefined} />
        {dire ? <div className="mobile-dire-banner" role="status"><strong>Needs you · {dire.title}</strong>
          <button type="button" onClick={() => runAction(dire.id, dire.action)}>{dire.actionLabel}</button>
          {failures[dire.id] ? <p>{failures[dire.id]}</p> : null}</div> : null}
      </div>
      {mapHint ? <p className="mobile-map-toast" role="status">{mapHint.text}</p> : null}
      {props.buildMode && build.doorNotice ? <div className="mobile-map-toast mobile-door-toast" role="status">
        <span>{build.doorNotice.text}{build.doorNotice.undo ? " · " : ""}</span>
        {build.doorNotice.undo ? <button type="button" aria-label="Undo door removal" disabled={!props.buildUndoCount} onClick={build.undo}>Undo</button> : null}
      </div> : null}
      {props.buildMode ? <MobileBuildControls props={props} build={build} onCatalog={() => { build.exitDoors(); navigator.selectTab("build"); }} /> : null}
      {visiblePanel ? <MobileSheet key={top} title={visiblePanel.title} kind={visiblePanel.kind} onClose={() => navigator.closeTop()}>{visiblePanel.content}</MobileSheet> : null}
      {props.buildMode && props.buildExitBlockedReason && build.exitOpen ? <MobileBuildExitSheet props={props} onClose={build.closeExit} /> : null}
      {top === "inspector" && mapSelection ? <MobileInspectorSheet selection={mapSelection} facility={props.facility} ownedRooms={props.ownedRooms}
        onDescribeCharacter={props.onDescribeCharacter} onPraiseEmployee={props.onPraiseEmployee}
        onSeatFounderAtFrontDesk={props.onSeatFounderAtFrontDesk}
        onOpenRoom={openRoom} onOpenPatient={openPatient} onClose={() => navigator.closeTop()} /> : null}
      </div>
      <MobileTutorialCoach step={coachStep} targetTab={tutorialTab} chartScreen={top === "chart" || top === "discussion"}
        navigationLabel={tutorialTab === "clinic" && (coachStep?.target === "goals" || coachStep?.target === "level-up") ? "Goals" : undefined}
        targetLabel={tutorialTarget?.label} onNavigate={requestTutorialTab} onAction={props.onTutorialAction}
        onDisableTutorials={() => props.onTutorialsEnabledChange(false)} onTopicExposure={props.onTutorialTopicExposure} />
    </main>
    <footer className="mobile-navigation">
      <nav className="mobile-tab-bar" aria-label="Clinic tabs">
        {TABS.map((tab) => { const badge = tab.id === "patients" ? waitingCount : tab.id === "alerts" ? needs.length : 0;
          return <button type="button" key={tab.id} aria-current={(props.buildMode ? "build" : navigation.tab) === tab.id ? "page" : undefined}
            data-mobile-tab={tab.id} data-mobile-tutorial-target={tutorialTab === tab.id ? "true" : undefined}
            disabled={restartOpen || reviewOpen}
            aria-label={`${tab.label}${badge ? `, ${badge} ${tab.id === "patients" ? "waiting" : "Needs you"}` : ""}`} onClick={() => requestTab(tab.id)}>
            <span className="mobile-tab-symbol" aria-hidden="true">{tab.symbol}</span><span>{tab.label}</span>
            {badge ? <span className="mobile-tab-badge" aria-hidden="true">{badge}</span> : null}
          </button>; })}
      </nav>
      <div className="mobile-session-strip">
        <div className="mobile-session-links" hidden={Boolean(visiblePanel) || restartOpen || reviewOpen} role="group" aria-label="Session actions">
          {account?.message ? <p className="mobile-session-error" role="alert">{account.message}</p> : null}
          <div className="mobile-session-row">
            <button type="button" className="mobile-session-link" aria-label="Save & Close" disabled={Boolean(props.cloudSave) && cloudSaveBusy}
              onClick={showSave}>Save &amp; Close</button>
            {account ? <button type="button" className="mobile-session-link" aria-label="Sign out" disabled={account.pending}
              onClick={() => void account.signOut()}>{account.pending ? "Signing out…" : "Sign out"}</button> : null}
          </div>
        </div>
      </div>
    </footer>
    <p className="screen-reader-only" role="status" aria-live="polite">{props.announcement}</p>
    {props.finishReportOpen && props.progression.inspection && props.onCloseFinishReport ? <MobileFinishedGamePage
      key={props.progression.inspection.finish?.report.runId} inspection={props.progression.inspection}
      onKeepPlaying={props.onCloseFinishReport} onStartNewCampaign={props.onCreateCampaign} /> : null}
  </div>;
}
