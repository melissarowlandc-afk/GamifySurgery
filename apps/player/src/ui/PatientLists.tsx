import type { PatientFolder, PatientTabView } from "./types";

interface PatientListsProps {
  patients: PatientTabView[];
  onOpen: (patientId: string) => void;
  tutorialTargetEncounterId?: string | null;
  showTutorialCallout?: boolean;
}

const FOLDERS: Array<{ id: PatientFolder; label: string }> = [
  { id: "waiting", label: "Waiting" },
  { id: "active", label: "Active" },
  { id: "resolved", label: "Resolved" },
];

export function PatientLists({
  patients,
  onOpen,
  tutorialTargetEncounterId = null,
  showTutorialCallout = false,
}: PatientListsProps) {
  return (
    <nav className="patient-lists panel" aria-label="Patient charts">
      <div className="panel-heading">
        <span>Patient charts</span>
        <small>{patients.length} total</small>
      </div>
      {FOLDERS.map((folder) => {
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
                {folderPatients.map((patient) => {
                  const tutorialTarget =
                    showTutorialCallout &&
                    patient.id === tutorialTargetEncounterId;
                  const calloutId = `tutorial-patient-${patient.id}`;
                  return (
                    <button
                      className={`patient-tab${patient.selected ? " is-selected" : ""}${tutorialTarget ? " is-tutorial-target" : ""}`}
                      type="button"
                      key={patient.id}
                      onClick={() => onOpen(patient.id)}
                      aria-current={patient.selected ? "page" : undefined}
                      aria-describedby={
                        tutorialTarget ? calloutId : undefined
                      }
                    >
                      {tutorialTarget ? (
                        <span
                          className="tutorial-tab-callout"
                          id={calloutId}
                        >
                          <span aria-hidden="true">→</span> Open this chart
                          first
                        </span>
                      ) : null}
                      <span className="patient-tab-name">
                        {patient.actionRequired ? (
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
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </nav>
  );
}
