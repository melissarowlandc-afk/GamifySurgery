import { PixelAvatar } from "../ui/PixelAvatar";
import { useState } from "react";
import type { EmployeeDiscussionTabView, PatientFolder, PatientTabView } from "../ui/types";

/** Metadata stays optional for old projections; the UI never guesses demographics. */
export type MobilePatientTabView = PatientTabView;
const FOLDERS: readonly { id: PatientFolder; label: string }[] = [
  { id: "waiting", label: "Waiting" },
  { id: "active", label: "Existing Patients" },
  { id: "resolved", label: "Resolved" },
];

function newestFirst<T extends { sortKey?: number }>(rows: readonly T[]): T[] {
  return rows.map((row, index) => ({ row, index })).sort((left, right) =>
    left.row.sortKey === undefined && right.row.sortKey === undefined
      ? left.index - right.index
      : (right.row.sortKey ?? -Infinity) - (left.row.sortKey ?? -Infinity) || left.index - right.index,
  ).map(({ row }) => row);
}

export function MobilePatients({ patients, discussions = [], onOpen, onOpenDiscussion,
  tutorialTargetEncounterId, availabilityGuidance }: {
  patients: MobilePatientTabView[];
  discussions?: EmployeeDiscussionTabView[];
  onOpen: (id: string) => void;
  onOpenDiscussion: (id: string) => void;
  tutorialTargetEncounterId?: string | null;
  availabilityGuidance?: string | null;
}) {
  const [resolvedOpen, setResolvedOpen] = useState(false);
  return <div className="mobile-patients" aria-label="Patient charts">
    {FOLDERS.map((folder) => {
      const rows = patients.filter((patient) => patient.folder === folder.id);
      const patientRows = folder.id === "resolved" ? newestFirst(rows) : rows;
      const teamRows = discussions.filter((discussion) => discussion.folder === folder.id);
      const count = patientRows.length + teamRows.length;
      return <section className={`mobile-patient-folder is-${folder.id}`} key={folder.id} aria-label={folder.label}>
        {folder.id === "resolved" ? <h3><button type="button" className="mobile-resolved-toggle" aria-expanded={resolvedOpen}
          aria-controls="mobile-resolved-charts" onClick={() => setResolvedOpen(open => !open)} aria-label={`Resolved, ${count} charts`}>
          <span>Resolved <span className="mobile-count">{count}</span></span><span aria-hidden="true">{resolvedOpen ? "−" : "+"}</span>
        </button></h3> : <h3>{folder.label} <span className="mobile-count">{count}</span></h3>}
        {folder.id !== "resolved" || resolvedOpen ? <div id={folder.id === "resolved" ? "mobile-resolved-charts" : undefined}>
        {!count ? <p className="mobile-empty">{folder.id === "waiting" && availabilityGuidance
          ? availabilityGuidance : folder.id === "resolved" ? "No filed charts yet" : "No charts"}</p> : null}
        <div className="mobile-card-stack">
          {patientRows.map((patient) => {
            const demographics = [patient.ageLabel, patient.sexLabel].filter(Boolean).join(" · ");
            return <button type="button" key={patient.id}
              className={`mobile-patient-card${patient.selected ? " is-selected" : ""}${patient.id === tutorialTargetEncounterId ? " is-tutorial-target" : ""}`}
              data-phone-anchor="patient" data-patient-id={patient.id} onClick={() => onOpen(patient.id)} aria-current={patient.selected ? "page" : undefined}>
              <span className="mobile-card-identity">
                <PixelAvatar avatar={patient.avatar} label={`${patient.name} portrait`} size="small" />
                <span><strong>{patient.name}</strong>{demographics ? <span>{demographics}</span> : null}</span>
                {patient.actionRequired || patient.folder === "waiting" ? <span className="mobile-attention" aria-label="Action required">!</span> : null}
              </span>
              {patient.chiefComplaint ? <span className="mobile-patient-complaint">{patient.chiefComplaint}</span> : null}
              <span className="mobile-patient-status">{patient.statusLabel}</span>
              <span className="mobile-card-meta"><span>Satisfaction {patient.satisfactionPercent}%</span><span>{patient.subtitle.replace(/\s*Satisfaction:?\s*\d+(?:\.\d+)?%\s*(?:[·|]\s*)?/i, "").replace(/\s*[·|]\s*$/, "").trim()}</span></span>
              {patient.patienceLabel ? <small>{patient.patienceLabel}</small> : null}
            </button>;
          })}
          {(folder.id === "resolved" ? newestFirst(teamRows) : teamRows).map((discussion) => <button type="button"
            className={`mobile-patient-card is-discussion${discussion.selected ? " is-selected" : ""}`} key={discussion.id}
            data-discussion-id={discussion.id} onClick={() => onOpenDiscussion(discussion.id)} disabled={discussion.folder === "resolved"}
            aria-current={discussion.selected ? "page" : undefined}>
            <span className="mobile-card-identity">
              <PixelAvatar avatar={discussion.avatar} label={`${discussion.name} portrait`} size="small" />
              <span><strong>{discussion.name}</strong><span>Team discussion · {discussion.roleLabel}</span></span>
              {discussion.actionRequired ? <span className="mobile-attention" aria-label="Action required">!</span> : null}
            </span>
            <span className="mobile-patient-status">{discussion.blockedReason ?? discussion.statusLabel}</span>
          </button>)}
        </div>
        </div> : null}
      </section>;
    })}
  </div>;
}
