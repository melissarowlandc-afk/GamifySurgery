import type { EvidenceClaim } from "./pilot-schema";

export type QuestionFlagRound2EvidenceClaim = EvidenceClaim & {basisClaimIds:string[];verificationScope:string};
/** Independently written offline applications; source access dates are not advanced. */
export const QUESTION_FLAG_ROUND2_CLAIMS: QuestionFlagRound2EvidenceClaim[] = [
  {
    "contentVersion": "question-flags-round2.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf2.fixed-volume-peak-plateau-pattern",
    "statement": "At unchanged tidal volume, inspiratory flow and PEEP, a matched increase in peak and plateau pressure with an unchanged peak-to-plateau difference supports increased elastic pressure requirements rather than an isolated increase in airway resistance.",
    "sourceIds": [
      "source.gs028g.jimenez-ventilation-2024"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The explicitly controlled or reported adult retrospective profiles in the round-two question-flag drafts.",
    "limitation": "Qualitative physical application of the recorded diaphragm/compliance relation. It is not a newly verified ventilator algorithm, universal diagnosis or instruction to choose settings; the question explicitly supplies the acquisition controls.",
    "basisClaimIds": [
      "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance",
      "claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact2"
    ],
    "verificationScope": "Offline application/physical inference from previously recorded claims. No source was newly retrieved; source access dates and reuse restrictions remain unchanged. Clinician/source-alignment review is pending."
  },
  {
    "contentVersion": "question-flags-round2.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf2.qualitative-co2-acid-base-pattern",
    "statement": "In the supplied qualitative record, higher arterial CO2 with lower pH and unchanged bicarbonate supports a respiratory CO2-load interpretation rather than a new primary fixed-acid process.",
    "sourceIds": [
      "source.jcm.laparoscopic-anesthesia-review.2020",
      "source.jroboticsurg.pneumoperitoneum-acid-base-study.2026"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The explicitly controlled or reported adult retrospective profiles in the round-two question-flag drafts.",
    "limitation": "A case-specific acid-base inference, not a numeric compensation rule, exclusion of every mixed disorder, or proof that peritoneal absorption is the sole cause in every operation.",
    "basisClaimIds": [
      "claim.gs028e.laparoscopy.co2-load-respiratory-acidemia",
      "claim.gs028e.laparoscopy.peritoneal-co2-uptake"
    ],
    "verificationScope": "Offline application/physical inference from previously recorded claims. No source was newly retrieved; source access dates and reuse restrictions remain unchanged. Clinician/source-alignment review is pending."
  },
  {
    "contentVersion": "question-flags-round2.evidence.2026-11-04.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "lastCheckedOn": "2026-11-04",
    "id": "claim.qf2.sleep-questionnaire-domain-interpretation",
    "statement": "A STOP-Bang OSA-probability report and an Epworth daytime-sleepiness report address different targets; a reassuring sleepiness report does not establish absence of OSA or turn a probability screen into a confirmed diagnosis.",
    "sourceIds": [
      "source.sasm.osa-screening.2016"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "applicablePopulation": "The explicitly controlled or reported adult retrospective profiles in the round-two question-flag drafts.",
    "limitation": "Uses names and reported outputs only, without questionnaire items, scoring implementation, numeric cutoffs or diagnostic-study thresholds. The domain application requires anaesthesia/source-alignment review; no fresh verification is claimed.",
    "basisClaimIds": [
      "claim.gs028d.osa.validated-screen"
    ],
    "verificationScope": "Offline application/physical inference from previously recorded claims. No source was newly retrieved; source access dates and reuse restrictions remain unchanged. Clinician/source-alignment review is pending."
  }
];
