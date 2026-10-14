export const CLINICAL_CONTENT_NOTICE = "Demonstration content — not clinically approved or medical advice";
export function ClinicalContentNotice() {
  return <p className="beta-clinical-notice" role="note">{CLINICAL_CONTENT_NOTICE}</p>;
}
