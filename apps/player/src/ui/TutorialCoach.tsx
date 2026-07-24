interface TutorialCoachProps {
  visible: boolean;
  patientName: string;
  onOpenPatient: () => void;
  onDismiss: () => void;
}

export function TutorialCoach({
  visible,
  patientName,
  onOpenPatient,
  onDismiss,
}: TutorialCoachProps) {
  if (!visible) {
    return null;
  }

  return (
    <aside
      className="tutorial-coach"
      role="region"
      aria-labelledby="tutorial-coach-title"
    >
      <span className="eyebrow">First shift · Step 1</span>
      <h2 id="tutorial-coach-title">Open your first patient chart</h2>
      <p>
        Patients arrive in the <strong>Waiting</strong> folder. Open{" "}
        <strong>{patientName}</strong> to read the presentation and make the
        first clinical decision.
      </p>
      <p className="tutorial-coach-note">
        Facility time continues while this guide is visible. Pause whenever
        you want more time.
      </p>
      <div className="tutorial-coach-actions">
        <button
          className="button button-primary"
          type="button"
          onClick={onOpenPatient}
        >
          Open first chart
        </button>
        <button
          className="text-button"
          type="button"
          onClick={onDismiss}
        >
          Show me where
        </button>
      </div>
    </aside>
  );
}
