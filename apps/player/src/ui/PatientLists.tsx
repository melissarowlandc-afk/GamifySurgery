import { useMemo, useState } from "react";
import { PixelAvatar } from "./PixelAvatar";
import type { PatientFolder, PatientTabView } from "./types";

interface PatientListsProps {
  patients: PatientTabView[];
  onOpen: (patientId: string) => void;
  tutorialTargetEncounterId?: string | null;
  showTutorialCallout?: boolean;
}

const ACTIVE_FOLDERS: Array<{ id: PatientFolder; label: string }> = [
  { id: "waiting", label: "Waiting" },
  { id: "active", label: "Existing Patients" },
];

export function PatientLists({
  patients,
  onOpen,
  tutorialTargetEncounterId = null,
  showTutorialCallout = false,
}: PatientListsProps) {
  const [resolvedOpen, setResolvedOpen] = useState(false);
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

    return (
      <button
        className={`patient-tab patient-tab-slide${
          patient.selected ? " is-selected" : ""
        }${tutorialTarget ? " is-tutorial-target" : ""}${
          compact ? " is-compact" : ""
        }`}
        type="button"
        key={patient.id}
        onClick={() => onOpen(patient.id)}
        aria-current={patient.selected ? "page" : undefined}
        aria-describedby={tutorialCallout ? calloutId : undefined}
      >
        {tutorialCallout ? (
          <span className="tutorial-tab-callout" id={calloutId}>
            <span aria-hidden="true">-&gt;</span> Open this chart first
          </span>
        ) : null}
        <span className="patient-tab-row">
          {patient.avatar ? (
            <PixelAvatar
              avatar={patient.avatar}
              label={`${patient.name} portrait`}
              size="small"
            />
          ) : null}
          <span className="patient-tab-copy">
            <span className="patient-tab-name">
              {patient.actionRequired || patient.folder === "waiting" ? (
                <strong
                  className="action-marker"
                  aria-label="Action required"
                >
                  !
                </strong>
              ) : null}
              {patient.name}
            </span>
            <small>{patient.subtitle}</small>
            <span>{patient.statusLabel}</span>
            {patient.patienceLabel ? (
              <small>{patient.patienceLabel}</small>
            ) : null}
          </span>
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
            patients.filter((patient) => patient.folder !== "resolved")
              .length
          }{" "}
          open
        </small>
      </div>

      <div className="patient-live-folders">
        {ACTIVE_FOLDERS.map((folder) => {
          const folderPatients = patients.filter(
            (patient) => patient.folder === folder.id,
          );
          return (
            <section
              className={`patient-folder is-${folder.id}${
                folderPatients.length === 0 ? " is-empty" : ""
              }`}
              key={folder.id}
            >
              <h2>
                {folder.label}
                <span aria-label={`${folderPatients.length} charts`}>
                  {folderPatients.length}
                </span>
              </h2>
              {folderPatients.length === 0 ? (
                <p className="empty-state">No charts</p>
              ) : (
                <div className="patient-tab-stack">
                  {folderPatients.map((patient) =>
                    renderPatientTab(patient),
                  )}
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
            <small>{resolvedPatients.length} filed charts</small>
          </span>
          <span aria-hidden="true">{resolvedOpen ? "Close" : "Open"}</span>
        </button>

        <div
          className="resolved-chart-drawer"
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
        </div>
      </section>
    </nav>
  );
}
