import {
  VARIETY3_AUTHORING_CONCEPTS as concepts, VARIETY3_BATCH_MANIFEST as manifest,
  VARIETY3_CASES as cases, VARIETY3_ADULT_CONTEXTS as adults, VARIETY3_QUESTIONS as questions,
  VARIETY3_CLAIMS as claims, VARIETY3_SOURCES as sources, VARIETY3_STATEMENT_MAPPINGS as mappings,
  VARIETY3_TIMING_ENTRIES as timings, WITHHELD_DISAGREEMENTS, WITHHELD_TOPICS, EXCLUDED_SOURCE_CHECKS,
} from "./variety3-batch";

const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const safeLink = (label: string, href: string) => `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
const ids = (values: readonly string[]) => values.map(id => `\`${id}\``).join(", ");

/** Exact current exports, all twenty variants; no runtime admission or retrieval. */
export function renderVariety3Samples(): string {
  const out = [
    "# Variety-3 batch samples - 2026-10-10", "",
    `**Unapproved draft:** ${manifest.newConceptCount} new concepts, ${manifest.questionVariantCount} variants, ${manifest.evidenceClaimCount} atomic claims and ${manifest.sourceCount} sources. Every authored record remains \`needs_clinician_review\`. Tests and agent checks are not clinical approval.`, "",
    "**KEY FIRST FOR REVIEW ONLY:** option A is the key in every example below. Runtime-shaped nodes set `shuffleAnswers: true`; an admitted runtime must randomize all choices. This standalone batch is not registered in any release or global timing registry.", "",
    "Scope: adult clinic recognition, counseling and review of outside ASC/endoscopy plans, at existing Level 1-3 release points. These can add variety at Level 4 through ordinary progression after manager admission. No Level 5 setting, executable procedure service or test-result flow is introduced. Wait hooks use existing placeholder profiles and must be admitted with the cases; no duration is authored in case prose. Art-matched ages and fictional names are editorial values, not demographic disease weights. `approvedInstantiationProfiles` is a legacy structural name, not clinician approval.", "",
  ];
  for (const concept of concepts) {
    out.push(`## ${concept.displayName}`, "", `Concept: \`${concept.id}\`. Earliest level: ${concept.earliestFacilityStage}. Educational tier: ${concept.educationalTier}.`, "", `Objective: ${concept.learningObjective}`, "");
    for (const question of questions.filter(item => item.conceptId === concept.id)) {
      const item = cases.find(candidate => candidate.patientPresentationVariantId === question.patientPresentationVariantId)!;
      const adult = adults.find(candidate => candidate.caseId === item.id)!;
      const mapping = mappings.find(candidate => candidate.questionVariantId === question.id)!;
      const timing = timings.find(candidate => candidate.caseId === item.id)!;
      const sourceIds = new Set(question.supportingEvidenceClaimIds.flatMap(id => claims.find(claim => claim.id === id)!.sourceIds));
      out.push(
        `### ${question.id}`, "", `Case: \`${item.id}\`. Art: \`${adult.patientStillId}\`. Age ${adult.prototypeDemographics.ageYears}, ${adult.prototypeDemographics.sexLabel}.`, "",
        `**Chief complaint:** ${item.chiefComplaint}`, "", `**Presentation:** ${question.patientPresentation}`, "",
        `**Question:** ${question.stem}`, "", "**Choices - KEY FIRST FOR REVIEW:**", "",
      );
      for (const [index, choice] of question.answerChoices.entries()) {
        const choiceTiming = timing.classification.kind === "test_choices" ? timing.classification.choices.find(entry => entry.choiceId === choice.id)!.timing : { kind: "no_test" as const };
        const hook = choiceTiming.kind === "test" ? `\`${choiceTiming.timingProfileId}\` (runtime placeholder estimate; no fixed prose duration)` : "no test";
        out.push(`${String.fromCharCode(65 + index)}. ${choice.label}${choice.isCorrect ? " **(key)**" : ""}`, "", `Rationale: ${choice.rationale}`, "", `Label length: ${choice.label.length} characters. Wait hook: ${hook}. Claims: ${ids(mapping.choices[index]!.labelAndRationale)}.`, "");
      }
      out.push(`**Explanation:** ${question.explanation}`, "", `**Teaching point:** ${question.teachingPoint}`, "",
        "**Field-level claim mapping:**", "", `- Presentation: ${ids(mapping.presentation)}.`, `- Task: ${ids(mapping.stem)}.`, `- Explanation: ${ids(mapping.explanation)}.`, `- Teaching point: ${ids(mapping.teachingPoint)}.`, "",
        `**Sources:** ${sources.filter(source => sourceIds.has(source.id)).map(source => safeLink(source.id, source.officialUrl!)).join("; ")}.`, "");
    }
  }
  out.push("## Withheld extensions and source exclusions", "",
    ...[...WITHHELD_DISAGREEMENTS, ...WITHHELD_TOPICS, ...EXCLUDED_SOURCE_CHECKS].map(item => `- **${item.topic}:** ${item.reason}`), "",
    "## Atomic evidence claims", "", "Each statement is independently worded. Certainty is editorial evidence assessment, not clinician sign-off. Limitations and population boundaries remain attached to the exact claim version.", "");
  for (const claim of claims) out.push(`### ${claim.id}`, "", claim.statement, "",
    `Category: ${claim.evidenceCategory}; certainty: ${claim.certainty}; last checked: ${claim.lastCheckedOn}; review: ${claim.reviewStatus}.`, "",
    `Population: ${claim.applicablePopulation}`, "", `Limitation: ${claim.limitation}`, "", `Sources: ${ids(claim.sourceIds)}.`, "");
  out.push("## Complete sources and attribution", "", "Bibliographic titles identify sources; no source excerpts, full text, tables or algorithms are reproduced. Authority and reuse permission are assessed separately.", "");
  for (const source of sources) out.push(`### ${source.id}`, "", source.completeCitation, "",
    `${safeLink("Official source", source.officialUrl!)}${source.doi ? `; ${safeLink("DOI", `https://doi.org/${source.doi}`)}` : ""}${source.licenseUrl ? `; ${safeLink("License", source.licenseUrl)}` : ""}.`, "",
    `Authority: ${source.authorityAssessment}`, "", `Class/use: ${source.sourceClass} / ${source.usageRole}. Accessed ${source.accessedOn} via ${source.accessMethod}.`, "",
    `License: ${source.licenseLabel}. Reuse status: ${source.reuseStatus}. ${source.reuseNotes}`, "", `Supported claims: ${ids(source.evidenceClaimIds)}.`, "");
  out.push(
    "Contains public sector information licensed under the Open Government Licence v3.0, where applicable to the NHS website sources. Third-party material, logos, source figures and algorithms are excluded. Hernández-Granados et al. (2021), Sexton and Kuruvilla (2024), and Calderwood et al. (2023) are attributed above with DOI and their respective Creative Commons licenses. Hoang et al. (2019) is credited with CC BY-NC-ND 4.0; only underlying facts were checked, with no article adaptation distributed.", "",
    "Source: CDC, NIDDK/NIH and the named NHS organizations for their respective underlying factual guidance. Links and attribution do not imply endorsement by CDC, HHS, NIH, the United States Government, the NHS or any society. All question wording is original software content awaiting named clinician review.", "",
    "Manager handoff: select an exact unapproved prototype manifest only after review, preserve constrained adult/art profiles, and admit companion timing entries if cases are selected. No runtime integration, Git checkpoint or publication was performed by this worker.", "",
  );
  return out.join("\n");
}
