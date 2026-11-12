import type { QuestionQualityRevision } from './question-quality-pilot-20261028';

/** Exact owner-reviewed versions. Uses existing AuthoredClinicalRecord review fields.
 * No approval of other questions, evidence claims, concepts or finite profiles. */
export const QUESTION_QUALITY_CLINICAL_APPROVALS = [
  {
    "auditId": "A04",
    "questionVariantId": "question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2.r2",
    "contentVersion": "question-authoring.2026-10-28.v1",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-10-29"
  },
  {
    "auditId": "A08",
    "questionVariantId": "question.wound.secondary-intention-healing.v1.r2",
    "contentVersion": "question-authoring.2026-10-28.v1",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-10-29"
  },
  {
    "auditId": "A11",
    "questionVariantId": "question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r4",
    "contentVersion": "question-authoring.2026-10-29.v3",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-11-02"
  },
  {
    "auditId": "A17",
    "questionVariantId": "question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r3",
    "contentVersion": "question-authoring.2026-10-28.v2",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-10-29"
  },
  {
    "auditId": "A22",
    "questionVariantId": "question.statistics-ethics.fisher-exact.v2.r3",
    "contentVersion": "question-authoring.2026-10-28.v2",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-10-29"
  },
  {
    "auditId": "A23",
    "questionVariantId": "question.statistics-ethics.risk-ratio-odds-ratio.v4.r3",
    "contentVersion": "question-authoring.2026-10-28.v2",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-10-29"
  },
  {
    "auditId": "A27",
    "questionVariantId": "question.gs028g.laparoscopy-respiratory.co2-absorption.v2.r3",
    "contentVersion": "question-authoring.2026-10-28.v2",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-10-29"
  },
  {
    "auditId": "A28",
    "questionVariantId": "question.gs028g.merkel-cell.integrated-diagnosis.v1.r3",
    "contentVersion": "question-authoring.2026-10-28.v2",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-10-29"
  },
  {
    "auditId": "A30",
    "questionVariantId": "question.gs028g.peristomal-skin.restore-seal.v1.r4",
    "contentVersion": "question-authoring.2026-10-29.v3",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-11-02"
  },
  {
    "auditId": "A38",
    "questionVariantId": "question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r3",
    "contentVersion": "question-authoring.2026-10-28.v2",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-10-29"
  },
  {
    "auditId": "A40",
    "questionVariantId": "question.pediatric-clinic.upper-midline-lump.v1.r4",
    "contentVersion": "question-authoring.2026-10-29.v3",
    "reviewer": "Melissa Rowland (clinical sign-off)",
    "reviewedOn": "2026-11-02"
  }
] as const;

export function recordQuestionQualityClinicalApprovals(revisions: readonly QuestionQualityRevision[]): QuestionQualityRevision[] {
  return revisions.map(revision => {
    const approval = QUESTION_QUALITY_CLINICAL_APPROVALS.find(a => a.questionVariantId === revision.questionVariantId);
    if (!approval) return revision;
    if (revision.question.id !== approval.questionVariantId || revision.question.contentVersion !== approval.contentVersion)
      throw new Error('Clinical approval version binding changed: ' + approval.auditId);
    return { ...revision,
      ...(revision.ownerEditorialReview ? {ownerEditorialReview: {...revision.ownerEditorialReview, reviewedOn: approval.reviewedOn,
        note: "Superseding manager-recorded owner decision: Melissa Rowland is clinical sign-off. This exact question version is clinically approved on the recorded date; claims, concepts and profiles are not thereby approved."}} : {}),
      question: { ...revision.question, reviewStatus: 'clinically_approved', lastClinicianReview: {
        reviewer: approval.reviewer, reviewedOn: approval.reviewedOn, contentVersion: approval.contentVersion,
      }},
    };
  });
}
