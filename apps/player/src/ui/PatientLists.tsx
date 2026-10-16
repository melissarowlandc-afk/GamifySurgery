import { useEffect, useMemo, useRef, useState } from "react";
import { PixelAvatar } from "./PixelAvatar";
import { PixelIcon } from "./PixelIcon";
import type { EmployeeDiscussionTabView, PatientFolder, PatientTabView } from "./types";

interface PatientListsProps {
  patients: PatientTabView[];
  discussions?: EmployeeDiscussionTabView[];
  onOpenDiscussion?: (discussionId: string) => void;
  onOpen: (patientId: string) => void;
  chartHighlightRequest?: { patientId: string; requestKey: number } | null;
  tutorialTargetEncounterId?: string | null;
  showTutorialCallout?: boolean;
  availabilityGuidance?: string | null;
}

const ACTIVE_FOLDERS: Array<{ id: PatientFolder; label: string }> = [
  { id: "waiting", label: "Waiting" },
  { id: "active", label: "Existing Patients" },
];

export function PatientLists({
  patients,
  discussions = [],
  onOpenDiscussion,
  onOpen,
  chartHighlightRequest = null,
  tutorialTargetEncounterId = null,
  showTutorialCallout = false,
  availabilityGuidance = null,
}: PatientListsProps) {
  const [resolvedOpen, setResolvedOpen] = useState(false);
  const patientRows = useRef(new Map<string, HTMLButtonElement>());
  const liveFoldersRef = useRef<HTMLDivElement>(null);
  const resolvedDrawerRef = useRef<HTMLDivElement>(null);
  const highlightedFolder = patients.find((patient) => patient.id === chartHighlightRequest?.patientId)?.folder;
  useEffect(() => {
    if (!chartHighlightRequest || !highlightedFolder) return;
    if (highlightedFolder === "resolved" && !resolvedOpen) {
      setResolvedOpen(true);
      return;
    }
    const row = patientRows.current.get(chartHighlightRequest.patientId);
    const scroller = highlightedFolder === "resolved" ? resolvedDrawerRef.current : liveFoldersRef.current;
    if (!row || !scroller) return;
    // Confine scrolling to the rail; never move the desk/page or keyboard focus.
    const rowBounds = row.getBoundingClientRect();
    const railBounds = scroller.getBoundingClientRect();
    if (rowBounds.top < railBounds.top) scroller.scrollTop += rowBounds.top - railBounds.top;
    else if (rowBounds.bottom > railBounds.bottom) scroller.scrollTop += rowBounds.bottom - railBounds.bottom;
  }, [chartHighlightRequest, highlightedFolder, resolvedOpen]);
  const renderDiscussion = (discussion: EmployeeDiscussionTabView) => (
    <button type="button" key={discussion.id}
      className={`patient-tab patient-tab-slide employee-discussion-tab${discussion.selected ? " is-selected" : ""}`}
      onClick={() => onOpenDiscussion?.(discussion.id)}
      disabled={discussion.folder === "resolved"}
      aria-current={discussion.selected ? "page" : undefined}
      title={discussion.blockedReason ?? discussion.statusLabel}>
      {discussion.actionRequired ? <strong className="action-marker patient-tab-action-marker" aria-label="Action required">!</strong> : null}
      <span className="patient-tab-row">
        <PixelAvatar avatar={discussion.avatar} label={`${discussion.name} portrait`} size="small" />
        <span className="patient-tab-copy"><span className="patient-tab-name">{discussion.name}</span><small>Team discussion · {discussion.roleLabel}</small><small>{discussion.blockedReason ?? discussion.statusLabel}</small></span>
      </span>
    </button>
  );
  const resolvedPatients = useMemo(
    () =>
      patients
        .filter((patient) => patient.folder === "resolved")
        .map((patient, index) => ({ patient, index }))
        .sort((left, right) => {
          if (
            left.patient.sortKey === undefined &&
            right.patient.sortKey === undefined
          ) {
            // The domain selector already supplies newest-first resolved
            // charts; preserve that stable order when no explicit key exists.
            return left.index - right.index;
          }
          return (
            (right.patient.sortKey ?? Number.NEGATIVE_INFINITY) -
            (left.patient.sortKey ?? Number.NEGATIVE_INFINITY)
          );
        })
        .map(({ patient }) => patient),
    [patients],
  );

  const renderPatientTab = (
    patient: PatientTabView,
    compact = false,
  ) => {
    const tutorialTarget =
      patient.id === tutorialTargetEncounterId;
    const tutorialCallout = showTutorialCallout && tutorialTarget;
    const calloutId = `tutorial-patient-${patient.id}`;
    const satisfactionIcon =
      patient.satisfactionPercent >= 85
        ? "satisfactionHappy"
        : patient.satisfactionPercent >= 60
          ? "satisfactionSteady"
          : "satisfactionSad";

    return (
      <button
        className={`patient-tab patient-tab-slide${
          patient.selected ? " is-selected" : ""
        }${tutorialTarget ? " is-tutorial-target" : ""}${
          compact ? " is-compact" : ""
        }`}
        type="button"
        key={patient.id}
        ref={(row) => {
          if (row) patientRows.current.set(patient.id, row);
          else patientRows.current.delete(patient.id);
        }}
        data-patient-chart-id={patient.id}
        onClick={() => onOpen(patient.id)}
        aria-current={patient.selected ? "page" : undefined}
        aria-describedby={tutorialCallout ? calloutId : undefined}
      >
        {chartHighlightRequest?.patientId === patient.id ? (
          <span key={chartHighlightRequest.requestKey} className="patient-chart-highlight" aria-hidden="true" />
        ) : null}
        <span className="patient-tab-notch" aria-hidden="true" />
        {patient.actionRequired || patient.folder === "waiting" ? (
          <strong
            className="action-marker patient-tab-action-marker"
            aria-label="Action required"
          >
            !
          </strong>
        ) : null}
        {tutorialCallout ? (
          <span className="tutorial-tab-callout" id={calloutId}>
            <span aria-hidden="true">-&gt;</span> Open this chart first
          </span>
        ) : null}
        <span className="patient-tab-row">
          <PixelAvatar
            avatar={patient.avatar}
            label={`${patient.name} portrait`}
            size="small"
          />
          <span className="patient-tab-copy">
            <span className="patient-tab-name">{patient.name}</span>
          </span>
          <PixelIcon
            name={satisfactionIcon}
            className="patient-tab-satisfaction"
            label={`Satisfaction ${patient.satisfactionPercent}%`}
          />
        </span>
      </button>
    );
  };

  return (
    <nav
      className="patient-lists patient-tab-rail panel"
      aria-label="Patient charts"
    >
      <div className="panel-heading">
        <span>Patient charts</span>
        <small>
          {
            patients.filter((patient) => patient.folder !== "resolved").length + discussions.filter((item) => item.folder !== "resolved").length
          }{" "}
          open
        </small>
      </div>

      <div className="patient-live-folders" ref={liveFoldersRef}>
        {ACTIVE_FOLDERS.map((folder) => {
          const folderPatients = patients.filter(
            (patient) => patient.folder === folder.id,
          );
          const folderDiscussions = discussions.filter((item) => item.folder === folder.id);
          const folderCount = folderPatients.length + folderDiscussions.length;
          return (
            <section
              className={`patient-folder is-${folder.id}${
                folderCount === 0 ? " is-empty" : ""
              }`}
              key={folder.id}
            >
              <h2>
                {folder.label}
                <span aria-label={`${folderCount} charts`}>
                  {folderCount}
                </span>
              </h2>
              {folderCount === 0 ? (
                <p className={`empty-state${folder.id === "waiting" && availabilityGuidance ? " patient-availability-guidance" : ""}`}>
                  {folder.id === "waiting" && availabilityGuidance
                    ? availabilityGuidance
                    : "No charts"}
                </p>
              ) : (
                <div className="patient-tab-stack">
                  {folderPatients.map((patient) =>
                    renderPatientTab(patient),
                  )}
                  {folderDiscussions.map(renderDiscussion)}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <section className="resolved-cabinet">
        <button
          className="resolved-cabinet-button"
          type="button"
          onClick={() => setResolvedOpen((open) => !open)}
          aria-expanded={resolvedOpen}
          aria-controls="resolved-chart-drawer"
        >
          <span className="filing-cabinet-icon" aria-hidden="true">
            <span />
            <span />
          </span>
          <span>
            <strong>Resolved</strong>
            <small>{resolvedPatients.length + discussions.filter((item) => item.folder === "resolved").length} filed charts</small>
          </span>
          <span aria-hidden="true">{resolvedOpen ? "Close" : "Open"}</span>
        </button>

        <div
          className="resolved-chart-drawer"
          ref={resolvedDrawerRef}
          id="resolved-chart-drawer"
          hidden={!resolvedOpen}
        >
          <div className="resolved-drawer-heading">
            <strong>Resolved charts</strong>
            <small>Newest first</small>
          </div>
          {resolvedPatients.length === 0 ? (
            <p className="empty-state">No filed charts yet</p>
          ) : (
            <div className="patient-tab-stack is-resolved-stack">
              {resolvedPatients.map((patient) =>
                renderPatientTab(patient, true),
              )}
            </div>
          )}
          {discussions.filter((item) => item.folder === "resolved").map(renderDiscussion)}
        </div>
      </section>
    </nav>
  );
}
