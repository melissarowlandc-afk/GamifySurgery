/** Pre-handoff manual rubric failures. Historical raw definitions remain in
 * the explicit catalog, but are excluded from the executable candidate stage. */
export const QUESTION_NEW_N4_SELF_CHECK_PARKS=[
 {slug:"barrett-pathology-reclassification-before-treatment",authorVerdict:"PARK_FAILED_RESIDENT_RUBRIC",
  reason:"The reviewed no-dysplasia label directly selects surveillance. Reconciling an earlier provisional label does not create a sufficiently independent second clinical decision; resection is a weak rival without a visible target.",
  reentry:"A different supported during-procedure neoplasia/target decision, or explicit foundational-item acceptance. Do not claim this is moderate solely because two reports are displayed."},
 {slug:"ileostomy-water-replacement-after-repletion",authorVerdict:"PARK_FAILED_RESIDENT_RUBRIC",
  reason:"The supported key is a useful stewardship/rehydration rule, but the ileostomy-loss label selects it without the diary. Water versus glucose-only water repeats a component error and does not establish two consequential resident-level steps.",
  reentry:"A directly supported observation/response constraint that changes a credible competing replacement strategy. Do not invent a sodium concentration, output threshold or medication sequence."},
 {slug:"hernia-contour-leak-versus-new-skin-product",authorVerdict:"PARK_FAILED_RESIDENT_RUBRIC",
  reason:"The stem's named standing leak maps directly to the only standing-fit option. Product substitution and immediate revision are weak rivals; replacing standing with a synonym would leave the same shortcut.",
  reentry:"A supported competing appliance or operative decision whose ranking actually depends on interpreted findings. Do not choose convexity, a garment or surgery from the broad individualized-care claim."},
] as const;
