import { buildFamily } from "./family-builder";
import { variants } from "./spec-utils";
import { FIRST10_SOURCES as S } from "./source-catalog-first10";

const SHIFT = "claim.gs028e.wound.collagen-iii-to-i-remodeling";

export const COLLAGEN_REMODELING_FAMILY = buildFamily({
  slug: "collagen-remodeling", label: "Wound matrix counseling",
  sources: [S.woundRemodeling],
  claims: [{
    id: SHIFT,
    statement: "Early healing tissue contains relatively more type III collagen; remodeling progressively replaces much of that matrix with type I collagen rather than reversing the sequence.",
    sourceIds: [S.woundRemodeling.id], category: "definition", certainty: "high",
    limitation: "One adequate peer-reviewed biological review supports this narrow mechanism. This describes a relative matrix change, not complete elimination of type III collagen, an exact timeline, restoration of normal skin strength, or a wound treatment recommendation.",
    population: "Adults discussing uncomplicated healing of a skin incision.",
  }],
  concepts: [{
    id: "concept.wound-healing.type-iii-to-type-i-collagen-remodeling",
    displayName: "Explain wound collagen remodeling",
    learningObjective: "Explain the shift from relatively type III-rich early wound matrix toward type I collagen during remodeling in patient-specific scar counseling.",
    stage: 0, educationalTier: 0, conceptType: "applied_science", evidenceClaimIds: [SHIFT],
    variants: variants([
      {
        slug: "maturing-incision", complaint: "Scar healing question",
        presentation: "{patientName}, a {patientAge}-year-old {patientSex}, returns to discuss an uncomplicated healed skin incision after an outside operation. The patient asks how the collagen in an early repair changes as the scar matures; there is no wound separation, redness, drainage or fever.",
        stem: "Which collagen transition best describes remodeling of this patient's uncomplicated wound?",
        correct: ["Type III toward type I", "Remodeling shifts the early type III-rich matrix toward type I collagen."],
        wrong: [["Type I toward type III", "This reverses the usual early-to-remodeling sequence."], ["Type III toward type II", "Type II is not the later collagen in the wound-remodeling sequence being discussed."], ["Type I toward type IV", "This does not describe the type III-to-type I shift in a healing skin incision."]],
        explanation: "The correct answer is “Type III toward type I.” This is a relative matrix transition during remodeling; it does not mean every type III molecule disappears or that the scar recovers normal skin strength.",
        claims: [SHIFT], ageYears: [38, 62],
      },
      {
        slug: "early-matrix-record", complaint: "Wound report review",
        presentation: "{patientName}, a {patientAge}-year-old {patientSex}, brings a research-related outside wound report describing an early repair matrix that will later become relatively richer in type I collagen. The incision is healing without drainage, separation, redness or systemic symptoms.",
        stem: "Which collagen type is relatively prominent in the earlier matrix described in this patient's report?",
        correct: ["Type 3 collagen", "The early matrix is relatively type III-rich before the remodeling shift toward type I."],
        wrong: [["Type 1 collagen", "Type I becomes relatively more prominent later; it is not the earlier type being contrasted in this report."], ["Type 2 collagen", "This is not the early collagen in the skin-wound transition being described."], ["Type 4 collagen", "This is not the early collagen in the skin-wound transition being described."]],
        explanation: "The correct answer is “Type 3 collagen.” The question identifies the earlier side of the type III-to-type I transition without assigning a calendar date to an individual wound.",
        claims: [SHIFT], ageYears: [45, 69],
      },
      {
        slug: "later-matrix-counseling", complaint: "Incision maturation",
        presentation: "{patientName}, a {patientAge}-year-old {patientSex}, discusses a well-healed outside surgical incision. The patient remembers that the early repair had relatively abundant type III collagen and asks which type becomes more prominent during subsequent remodeling. The scar is closed and symptom-free.",
        stem: "Which collagen type becomes relatively more prominent as this patient's type III-rich repair remodels?",
        correct: ["Type I collagen", "The relative collagen composition shifts toward type I during remodeling."],
        wrong: [["Type II collagen", "The later type in this wound-remodeling sequence is type I rather than type II."], ["Type III collagen", "The question asks for the later shift, rather than the type prominent in the earlier repair."], ["Type IV collagen", "The later type in this wound-remodeling sequence is type I rather than type IV."]],
        explanation: "The correct answer is “Type I collagen.” This describes the later matrix's relative composition and does not authorize a fixed healing-time or strength prediction.",
        claims: [SHIFT], ageYears: [33, 58],
      },
      {
        slug: "reversed-diagram", complaint: "Scar biology discussion",
        presentation: "{patientName}, a {patientAge}-year-old {patientSex}, brings a self-made scar-healing diagram to a clinic visit after an uncomplicated outside skin procedure. Its collagen arrow points from type I to type III as the scar matures. The closed incision has no pain, drainage, redness or separation.",
        stem: "Which replacement arrow correctly shows the collagen change during remodeling of this patient's wound?",
        correct: ["Type III to type I", "The diagram's arrow should show the usual earlier-to-later matrix transition."],
        wrong: [["Type I to type III", "This preserves the reversed direction in the patient's diagram."], ["Type II to type I", "The earlier type in this skin-repair sequence is type III rather than type II."], ["Type IV to type III", "This does not represent the type III-to-type I remodeling sequence."]],
        explanation: "The correct answer is “Type III to type I.” Correct the direction of the biological sequence without promising complete replacement or normal uninjured skin strength.",
        claims: [SHIFT], ageYears: [47, 71],
      },
    ]),
  }],
});
