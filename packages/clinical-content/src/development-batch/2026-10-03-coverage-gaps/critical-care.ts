import { buildFamily } from "./family-builder";
import { variants } from "./spec-utils";
import { FIRST_SIX_SOURCES } from "./source-catalog-first6";

const ARDS_PERMEABILITY = "claim.gs028d.ards.permeability-edema";
const ARDS_PBW = "claim.gs028d.ards.predicted-body-weight-ventilation";

export const CRITICAL_CARE_FAMILY = buildFamily({
  slug: "ards",
  label: "ARDS record review",
  sources: [FIRST_SIX_SOURCES.esicmArds],
  claims: [
    {
      id: ARDS_PERMEABILITY,
      statement:
        "ARDS produces inflammatory pulmonary edema through increased permeability of the alveolar-capillary barrier rather than through isolated elevation of hydrostatic pressure.",
      sourceIds: [FIRST_SIX_SOURCES.esicmArds.id],
      category: "presentation",
      certainty: "high",
      limitation:
        "The mechanism is taught as a defining principle; individual patients may have additional hydrostatic or other contributors to pulmonary edema.",
      population: "Adults with acute respiratory distress syndrome.",
    },
    {
      id: ARDS_PBW,
      statement:
        "When an adult with ARDS receives invasive ventilation, tidal-volume selection is based on predicted body weight rather than current actual body weight.",
      sourceIds: [FIRST_SIX_SOURCES.esicmArds.id],
      category: "management",
      certainty: "high",
      limitation:
        "The authored objective tests the weight basis only and does not prescribe a universal numeric tidal volume or reproduce a calculation formula.",
      population: "Adults with ARDS receiving invasive mechanical ventilation.",
    },
  ],
  concepts: [
    {
      id: "concept.ards.permeability-edema-mechanism",
      displayName: "Permeability edema in ARDS",
      learningObjective:
        "Identify increased alveolar-capillary permeability as the core mechanism of inflammatory pulmonary edema in ARDS.",
      stage: 0,
      educationalTier: 0,
      conceptType: "applied_science",
      evidenceClaimIds: [ARDS_PERMEABILITY],
      variants: variants([
        {
          slug: "pneumonia-barrier",
          complaint: "ICU record question",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, returns after recovering from pneumonia-associated ARDS treated in the hospital. The discharge record describes bilateral inflammatory pulmonary edema without primary left-heart failure.",
          stem:
            "Which pathophysiologic mechanism best explains the pulmonary edema documented during this patient's ARDS admission?",
          correct: [
            "Alveolar-capillary permeability",
            "Inflammatory injury to the alveolar-capillary barrier allows edema fluid to enter the air spaces in ARDS.",
          ],
          wrong: [
            ["Elevated pulmonary venous pressure", "Isolated hydrostatic congestion does not explain the recorded noncardiogenic inflammatory edema."],
            ["Reduced plasma oncotic pressure", "Low oncotic pressure can cause edema but is not the defining barrier injury in ARDS."],
            ["Obstructed pulmonary lymphatic flow", "Lymphatic obstruction is not the primary mechanism of this acute inflammatory syndrome."],
          ],
          explanation:
            "ARDS is permeability edema caused by inflammatory disruption of the alveolar-capillary barrier, although another edema mechanism can coexist in an individual patient.",
          claims: [ARDS_PERMEABILITY],
          ageYears: [38, 57],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "aspiration-protein-fluid",
          complaint: "Breathing recovery visit",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, follows up after an aspiration event caused ARDS requiring hospital intensive care. Cardiac evaluation did not identify acute pump failure, and the ICU note described inflammatory pulmonary edema.",
          stem:
            "Which change at the lung barrier most directly produced this patient's ARDS-associated edema?",
          correct: [
            "Alveolar-capillary permeability",
            "Barrier permeability permits inflammatory edema fluid to cross into the alveoli.",
          ],
          wrong: [
            ["Increased pulmonary capillary pressure", "The record does not support hydrostatic edema from acute cardiac pump failure."],
            ["Decreased circulating protein concentration", "A systemic oncotic-pressure problem is not the stated cause of this inflammatory lung injury."],
            ["Decreased pulmonary lymphatic drainage", "Impaired lymphatic drainage is not the defining acute barrier abnormality in ARDS."],
          ],
          explanation:
            "The inflammatory edema of ARDS reflects increased permeability across an injured alveolar-capillary barrier.",
          claims: [ARDS_PERMEABILITY],
          ageYears: [29, 64],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "pancreatitis-noncardiogenic",
          complaint: "Hospital record review",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, is seen after recovery from pancreatitis complicated by ARDS. The hospital summary distinguishes the bilateral lung edema from cardiogenic pulmonary edema.",
          stem:
            "Which mechanism supports the hospital team's classification of this patient's edema as ARDS rather than isolated cardiogenic edema?",
          correct: [
            "Inflammatory alveolar-capillary leak",
            "ARDS disrupts the alveolar-capillary barrier and produces permeability edema.",
          ],
          wrong: [
            ["Hydrostatic pulmonary venous congestion", "Hydrostatic congestion is the competing cardiogenic mechanism the record distinguishes from ARDS."],
            ["Oncotic fluid shift from hypoalbuminemia", "Reduced oncotic pressure is a different systemic edema mechanism."],
            ["Lymphatic outflow obstruction", "Lymphatic obstruction does not define the inflammatory edema of ARDS."],
          ],
          explanation:
            "An inflammatory leak across the alveolar-capillary barrier is the core edema mechanism in ARDS.",
          claims: [ARDS_PERMEABILITY],
          ageYears: [44, 62],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "sepsis-endothelial-injury",
          complaint: "Post-ICU questions",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, returns after septic shock and ARDS resolved during a hospital stay. The family asks why lung fluid accumulated despite no primary diagnosis of left-ventricular failure.",
          stem:
            "Which physiologic process best answers the family's question about this patient's ARDS-related lung edema?",
          correct: [
            "Alveolar-capillary permeability",
            "Inflammation increases permeability at the lung barrier, allowing edema fluid to enter alveoli.",
          ],
          wrong: [
            ["Pulmonary venous hydrostatic pressure", "That mechanism explains cardiogenic congestion rather than the documented inflammatory syndrome."],
            ["Plasma colloid oncotic pressure", "A fall in plasma oncotic pressure is not the defining mechanism recorded here."],
            ["Pulmonary lymphatic drainage capacity", "Reduced lymphatic drainage is not the primary cause of ARDS in this admission."],
          ],
          explanation:
            "Sepsis can injure the alveolar-capillary barrier; the resulting increased permeability produces the inflammatory pulmonary edema of ARDS.",
          claims: [ARDS_PERMEABILITY],
          ageYears: [51, 70],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
    {
      id: "concept.ards.predicted-body-weight-ventilation",
      displayName: "Predicted body weight for ARDS ventilation",
      learningObjective:
        "Use predicted body weight, not fluctuating actual weight, as the body-weight basis for ARDS tidal-volume selection.",
      stage: 0,
      educationalTier: 1,
      conceptType: "management",
      evidenceClaimIds: [ARDS_PBW],
      variants: variants([
        {
          slug: "obesity-ventilator-audit",
          complaint: "Ventilator record review",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex} with obesity returns after pneumonia-associated ARDS requiring invasive ventilation. The quality review compares the hospital's tidal-volume setting with the appropriate weight basis.",
          stem:
            "Which body-weight measure should anchor the tidal-volume review for this patient's ARDS ventilation?",
          correct: ["Predicted body weight", "ARDS tidal-volume selection uses predicted body weight rather than current actual weight."],
          wrong: [
            ["Actual admission weight", "Actual mass can overstate the ventilation basis, especially in a patient with obesity."],
            ["Post-diuresis body weight", "A later fluid-dependent weight does not replace predicted body weight for this purpose."],
            ["Adjusted dosing body weight", "A medication-dosing construct is not the specified basis for ARDS tidal-volume selection."],
          ],
          explanation:
            "Review ARDS tidal volume against predicted body weight; actual, post-diuresis, and drug-dosing weights answer different questions.",
          claims: [ARDS_PBW],
          ageYears: [42, 59],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "edema-weight-gain",
          complaint: "ICU chart follow-up",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex} returns after sepsis-associated ARDS. During intensive care, edema made the measured weight substantially higher than the pre-illness weight while invasive ventilation was underway.",
          stem:
            "Which body-weight measure should the reviewer use to assess the tidal-volume basis despite this patient's acute fluid gain?",
          correct: ["Predicted body weight", "Predicted body weight avoids tying the ventilator target to acute fluid accumulation."],
          wrong: [
            ["Edematous measured weight", "Acute fluid gain makes this actual weight unsuitable as the ARDS ventilation basis."],
            ["Estimated dry body weight", "A fluid-status estimate is not the guideline's specified basis for tidal-volume selection."],
            ["Adjusted dosing body weight", "This medication-oriented measure is not the ARDS tidal-volume basis."],
          ],
          explanation:
            "Acute edema changes scale weight but not the predicted-body-weight basis used to assess ARDS tidal volume.",
          claims: [ARDS_PBW],
          ageYears: [36, 67],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "low-actual-weight",
          complaint: "Recovery chart question",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex} is seen after aspiration-associated ARDS. The admission record notes a low actual body weight and documents invasive ventilation in the ICU.",
          stem:
            "Which body-weight measure should be used when judging whether the recorded tidal-volume strategy followed the ARDS ventilation principle?",
          correct: ["Predicted body weight", "The ARDS ventilation principle uses predicted rather than actual weight in either direction."],
          wrong: [
            ["Actual admission weight", "Low actual mass does not change the specified predicted-weight basis."],
            ["Ideal nutrition goal weight", "A nutritional target is not the ventilation measure named by the guideline."],
            ["Adjusted medication weight", "A drug-dosing weight does not define the ARDS tidal-volume basis."],
          ],
          explanation:
            "Predicted body weight anchors the tidal-volume assessment even when actual weight is unusually low.",
          claims: [ARDS_PBW],
          ageYears: [31, 55],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "after-diuresis",
          complaint: "Discharge ventilation review",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex} returns after ARDS and invasive ventilation. The hospital record contains different weights before resuscitation, during fluid accumulation, and after diuresis.",
          stem:
            "Which body-weight measure provides the consistent basis for reviewing this patient's ARDS tidal-volume selection across those fluid shifts?",
          correct: ["Predicted body weight", "Predicted body weight remains the consistent ventilation basis while actual weight changes with fluid balance."],
          wrong: [
            ["Pre-resuscitation body weight", "A measured weight before fluids is still not the specified ventilation basis."],
            ["Peak resuscitation body weight", "Fluid-loaded actual weight should not determine ARDS tidal-volume selection."],
            ["Post-diuresis body weight", "A later actual weight remains dependent on fluid balance and does not replace predicted weight."],
          ],
          explanation:
            "Predicted body weight provides the stable body-size basis used for ARDS tidal-volume selection across changing fluid states.",
          claims: [ARDS_PBW],
          ageYears: [47, 69],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
  ],
});
