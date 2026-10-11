import { buildFamily, type ConceptSpec, type VariantSpec } from "./batch-helpers";
import { C, labelsForClaims } from "./evidence-claims";

const prep = [C.prepAdequacy, C.prepRepeat, C.prepReview];
const prepChoices: VariantSpec["choices"] = [
  { slug: "repeat", label: "Repeat prepared colonoscopy", rationale: "The supplied colonoscopy did not adequately assess the colon. Repeat examination with an improved preparation plan addresses that incomplete assessment.", claimIds: prep, timingProfileId: "timing.test.lower_endoscopy" },
  { slug: "fit", label: "Order fecal immunochemical testing", rationale: "This screening proposal does not complete the inadequately visualized colonoscopy in the supplied situation; the supported next examination is a prepared repeat.", claimIds: [C.prepAdequacy, C.prepRepeat], timingProfileId: "timing.test.basic_labs" },
  { slug: "dna", label: "Order stool DNA screening", rationale: "Changing to this screening proposal does not address the incomplete colonoscopic assessment described in the report.", claimIds: [C.prepAdequacy, C.prepRepeat], timingProfileId: "timing.test.basic_labs" },
  { slug: "ct", label: "Order abdominal CT imaging", rationale: "This proposed imaging study is not the adequately prepared repeat examination recommended for the supplied failed colonoscopy.", claimIds: [C.prepAdequacy, C.prepRepeat], timingProfileId: "timing.test.ct" },
];
const snareChoices = (primaryClaim: string): VariantSpec["choices"] => [
  { slug: "cold-snare", label: "Cold snare polypectomy", rationale: "Cold snare is the preferred technique for this accessible nonpedunculated polyp in the supplied size range.", claimIds: [primaryClaim], timingProfileId: "timing.test.clinical_procedure" },
  { slug: "hot-snare", label: "Hot snare polypectomy", rationale: "For this supplied small nonpedunculated lesion, the guideline preference is cold snare rather than this electrosurgical snare approach.", claimIds: [primaryClaim], timingProfileId: "timing.test.clinical_procedure" },
  { slug: "cold-forceps", label: "Cold biopsy forceps polypectomy", rationale: "Cold forceps are not the preferred excision method for this accessible lesion; complete resection is less reliable than the recommended approach.", claimIds: [primaryClaim, C.coldForceps], timingProfileId: "timing.test.clinical_procedure" },
  { slug: "hot-forceps", label: "Hot biopsy forceps polypectomy", rationale: "The supported approach for this lesion is cold snare. Hot biopsy forceps introduce additional resection, specimen and thermal-injury concerns rather than improving that choice.", claimIds: [primaryClaim, C.hotForceps], timingProfileId: "timing.test.clinical_procedure" },
];
const barrett = [C.barrettSurveillance, C.barrettNoAblation, C.barrettScope];
const barrettChoices: VariantSpec["choices"] = [
  { slug: "surveillance", label: "Plan endoscopic surveillance", rationale: "Established Barrett without dysplasia or a visible lesion is followed with surveillance in this suitable patient.", claimIds: [C.barrettSurveillance, C.barrettScope], timingProfileId: "timing.test.endoscopy_with_sampling" },
  { slug: "ablation", label: "Plan radiofrequency ablation", rationale: "Prophylactic ablation is not recommended for the supplied nondysplastic Barrett segment.", claimIds: [C.barrettNoAblation], timingProfileId: "timing.test.clinical_procedure" },
  { slug: "resection", label: "Plan endoscopic mucosal resection", rationale: "No visible lesion or dysplasia is supplied to change this surveillance decision to a resection plan.", claimIds: [C.barrettSurveillance, C.barrettScope], timingProfileId: "timing.test.clinical_procedure" },
  { slug: "surgery", label: "Plan surgical esophageal resection", rationale: "Major resection does not match the surveillance objective for the supplied nondysplastic findings in a suitable follow-up patient.", claimIds: [C.barrettSurveillance, C.barrettScope], timingProfileId: "timing.test.clinical_procedure" },
];
const sedation = [C.sedationDriving, C.sedationSupport, C.sedationEffects];
const sedationChoices: VariantSpec["choices"] = [
  { slug: "adult", label: "Responsible adult collection and support", rationale: "Arrange a responsible adult to collect and support the patient. This addresses the transport and support needs after sedation.", claimIds: [C.sedationDriving, C.sedationSupport] },
  { slug: "taxi", label: "Independent taxi travel and home recovery", rationale: "An unaccompanied taxi and unsupported recovery do not provide the responsible adult collection and support specified for this sedated gastroscopy.", claimIds: [C.sedationSupport] },
  { slug: "bus", label: "Independent bus travel and home recovery", rationale: "Independent travel and recovery do not meet the adult collection and support arrangement needed here.", claimIds: [C.sedationSupport] },
  { slug: "drive", label: "Independent self-driving and home recovery", rationale: "Feeling awake does not remove the sedation transport boundary. Plan a ride and responsible adult support instead of self-driving.", claimIds: sedation },
];

const specs: ConceptSpec[] = [
  {
    id: "concept.variety3.inadequate-bowel-prep-repeat-colonoscopy", displayName: "Complete an inadequately prepared colonoscopy",
    learningObjective: "Select an adequately prepared repeat colonoscopy when the whole-colon examination cannot support the intended assessment, with review of preparation failure rather than a fixed repeat timetable.",
    educationalTier: 0, conceptType: "management", earliestFacilityStage: 2, evidenceClaimIds: prep,
    variants: [
      {
        slug: "prep-incomplete-drink", patientName: "David Parker", artProfile: "man55", chiefComplaint: "Colonoscopy follow-up",
        findings: "David brings an outside screening-colonoscopy report. Retained stool prevented an adequate view throughout the colon despite attempted cleaning, and the endoscopist states that the examination cannot support a standard screening assessment. David did not finish the preparation because the instructions were unclear. He remains suitable for another examination.",
        stem: "Which next examination should complete David Parker's screening assessment after a colonoscopy with inadequate whole-colon visualization?",
        choices: prepChoices,
        explanation: "Arrange an adequately prepared repeat colonoscopy and review why the preparation was incomplete. The poor view does not establish a reassuring complete examination. The treating team should individualize preparation and scheduling rather than infer a universal repeat deadline from this question.",
        teachingPoint: "An inadequate examination needs a completion plan, with improved preparation rather than assumed screening completeness.",
        evidence: { presentation: prep, stem: [C.prepAdequacy, C.prepRepeat], explanation: prep, teachingPoint: prep },
      },
      {
        slug: "prep-poor-cleansing-report", patientName: "Margaret Collins", artProfile: "woman71", chiefComplaint: "Screening report review",
        findings: "Margaret's outside colonoscopy report documents poor cleansing in all examined segments after washing. It does not provide an adequate colonic assessment or a standard screening interval. She reports difficulty following the preparation plan and asks how the incomplete evaluation should be completed. The clinician confirms that repeat colonoscopy remains appropriate for her.",
        stem: "Which examination should complete Margaret Collins's evaluation after her entire colonoscopy was inadequately prepared?",
        choices: prepChoices,
        explanation: "The supported next examination is a repeat colonoscopy with adequate preparation. Clarify the prior difficulties and improve the repeat plan. This case does not supply an adequate distal examination or justify substituting a routine screening interval for completion.",
        teachingPoint: "A report that cannot support an adequate assessment should lead to a prepared repeat, not an assumed completed screen.",
        evidence: { presentation: prep, stem: [C.prepAdequacy, C.prepRepeat], explanation: prep, teachingPoint: [C.prepAdequacy, C.prepRepeat] },
      },
    ],
  },
  {
    id: "concept.variety3.small-polyp-cold-snare-selection", displayName: "Choose cold snare for a small colorectal polyp",
    learningObjective: "Choose cold snare for a supplied accessible 4 mm or 7 mm nonpedunculated colorectal polyp without invasive features in an outside endoscopic removal plan.",
    educationalTier: 1, conceptType: "management", earliestFacilityStage: 2,
    evidenceClaimIds: [C.snareDiminutive, C.snareSmall, C.coldForceps, C.hotForceps],
    variants: [
      {
        slug: "snare-four-mm", patientName: "Thomas Reed", artProfile: "man61", chiefComplaint: "Polyp removal planning",
        findings: "Thomas reviews a planned outside endoscopic polyp removal. The diagnostic report documents an accessible 4 mm nonpedunculated colorectal polyp that has not yet been removed, without features suspicious for invasion. The treating endoscopist has selected it for removal. Thomas asks which technique fits this lesion.",
        stem: "Which removal technique best fits Thomas Reed's accessible 4 mm nonpedunculated colorectal polyp without invasive features?",
        choices: snareChoices(C.snareDiminutive),
        explanation: "Cold snare is the guideline-preferred method for this supplied diminutive nonpedunculated polyp. Forceps excision is not the preferred substitute, and hot biopsy forceps carry additional resection and thermal concerns.",
        teachingPoint: "Choose cold snare for the supplied accessible diminutive nonpedunculated colorectal polyp.",
        evidence: { presentation: [C.snareDiminutive], stem: [C.snareDiminutive], explanation: [C.snareDiminutive, C.coldForceps, C.hotForceps], teachingPoint: [C.snareDiminutive] },
      },
      {
        slug: "snare-seven-mm", patientName: "Patricia Adams", artProfile: "woman48", chiefComplaint: "Colorectal polyp question",
        findings: "Patricia brings photographs and a report for an upcoming outside polypectomy. They describe an accessible 7 mm sessile colorectal polyp, without a stalk or features suggesting invasion. The treating endoscopist has selected the lesion for removal. She asks about the planned technique.",
        stem: "Which removal technique is preferred for Patricia Adams's accessible 7 mm nonpedunculated colorectal polyp without invasive features?",
        choices: snareChoices(C.snareSmall),
        explanation: "Cold snare is preferred for the supplied small nonpedunculated lesion. The technique choice follows the documented size and nonpedunculated appearance of this accessible polyp.",
        teachingPoint: "Use the lesion's supplied size and morphology to choose the appropriate small-polyp technique.",
        evidence: { presentation: [C.snareSmall], stem: [C.snareSmall], explanation: [C.snareSmall], teachingPoint: [C.snareSmall] },
      },
    ],
  },
  {
    id: "concept.variety3.nondysplastic-barrett-surveillance", displayName: "Plan surveillance for nondysplastic Barrett",
    learningObjective: "Select endoscopic surveillance rather than prophylactic eradication for established nondysplastic Barrett in a suitable patient without a visible neoplastic lesion.",
    educationalTier: 1, conceptType: "management", earliestFacilityStage: 2, evidenceClaimIds: barrett,
    variants: [
      {
        slug: "barrett-nondysplastic-followup", patientName: "Charles Miller", artProfile: "man64", chiefComplaint: "Barrett follow-up planning",
        findings: "Charles reviews a completed outside gastroscopy and biopsy assessment. It documents an established 3 cm Barrett segment with no dysplasia and no visible neoplastic lesion. This is not an irregular Z-line alone. He is suitable for follow-up and possible treatment if future findings change, and asks about the overall follow-up strategy.",
        stem: "Which follow-up strategy best fits Charles Miller's established Barrett esophagus without dysplasia or a visible neoplastic lesion?",
        choices: barrettChoices,
        explanation: "Choose endoscopic surveillance for this suitable patient with established nondysplastic Barrett. Prophylactic ablation is not recommended for the supplied findings. A surveillance decision does not imply zero cancer risk or set a universal examination interval.",
        teachingPoint: "Nondysplastic Barrett generally calls for surveillance in a suitable patient rather than prophylactic eradication.",
        evidence: { presentation: [C.barrettSurveillance, C.barrettScope], stem: [C.barrettSurveillance, C.barrettScope], explanation: barrett, teachingPoint: [C.barrettSurveillance, C.barrettNoAblation] },
      },
      {
        slug: "barrett-patient-asks-ablation", patientName: "Nancy Wilson", artProfile: "woman60", chiefComplaint: "Barrett treatment question",
        findings: "Nancy asks whether an established 4 cm Barrett segment should be removed preemptively. Her completed outside assessment found no dysplasia and no visible lesion requiring resection. She remains suitable for surveillance and for treatment if a future assessment warrants it. The discussion concerns the overall plan, not a specific interval.",
        stem: "Which overall follow-up plan best fits Nancy Wilson's established nondysplastic Barrett segment without a visible lesion?",
        choices: barrettChoices,
        explanation: "Endoscopic surveillance is appropriate for the supplied nondysplastic segment and follow-up suitability. The absence of dysplasia does not support prophylactic ablation. Surveillance details require an individualized plan rather than a fixed schedule supplied by this question.",
        teachingPoint: "Separate nondysplastic Barrett surveillance from treatment pathways for dysplasia or visible neoplasia.",
        evidence: { presentation: [C.barrettSurveillance, C.barrettScope], stem: [C.barrettSurveillance, C.barrettScope], explanation: barrett, teachingPoint: barrett },
      },
    ],
  },
  {
    id: "concept.variety3.endoscopic-sedation-escort-planning", displayName: "Arrange adult support after endoscopic sedation",
    learningObjective: "Plan responsible adult collection and support after sedated gastroscopy rather than self-driving or unaccompanied travel and recovery.",
    educationalTier: 0, conceptType: "disposition", earliestFacilityStage: 2, evidenceClaimIds: sedation,
    variants: [
      {
        slug: "sedation-discharge-ride", patientName: "George Harris", artProfile: "man67", chiefComplaint: "Gastroscopy transport planning",
        findings: "George is preparing for an outside gastroscopy with sedation. He planned to drive himself home because he expects to feel awake after the procedure. A responsible adult is available to collect him and stay with him for the recovery period required by the endoscopy team. He asks which arrangement to book.",
        stem: "Which transport and home-support arrangement should George Harris plan after gastroscopy with sedation?",
        choices: sedationChoices,
        explanation: "Arrange collection and support by a responsible adult. Sedation can affect reactions and judgment despite subjective wakefulness, so self-driving is not the immediate postprocedure plan.",
        teachingPoint: "Plan adult collection and support after sedation; feeling awake does not establish driving readiness.",
        evidence: { presentation: [C.sedationDriving, C.sedationSupport], stem: [C.sedationDriving, C.sedationSupport], explanation: sedation, teachingPoint: sedation },
      },
      {
        slug: "sedation-unaccompanied-taxi", patientName: "Carol Foster", artProfile: "woman67", chiefComplaint: "Sedation discharge questions",
        findings: "Carol is attending a preprocedure review for outside gastroscopy with sedation. She proposes taking a taxi alone and recovering at home without help. Her sister can instead collect her and provide the support requested by the endoscopy team. Carol expects to feel alert and asks which travel plan fits the sedation arrangements.",
        stem: "Which discharge travel and home-support plan should Carol Foster choose for her sedated gastroscopy?",
        choices: sedationChoices,
        explanation: "Her sister's collection and support meet the responsible-adult arrangement for this planned sedated gastroscopy. A taxi alone does not supply that support. Subjective alertness does not remove residual sedation effects on judgment and reactions.",
        teachingPoint: "An available ride alone is different from the adult collection and support needed after sedated gastroscopy.",
        evidence: { presentation: [C.sedationSupport, C.sedationEffects], stem: [C.sedationDriving, C.sedationSupport], explanation: sedation, teachingPoint: [C.sedationSupport] },
      },
    ],
  },
];
export const ENDOSCOPY_FAMILY = buildFamily(specs, labelsForClaims);
