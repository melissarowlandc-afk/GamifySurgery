import {
  PEDIATRIC_CLINIC_AUTHORING_CONCEPTS as concepts,
  PEDIATRIC_CLINIC_BATCH_MANIFEST as manifest,
  PEDIATRIC_CLINIC_CASES as cases,
  PEDIATRIC_CLINIC_CLAIMS as claims,
  PEDIATRIC_CLINIC_FAMILY_CONTEXTS as families,
  PEDIATRIC_CLINIC_QUESTIONS as questions,
  PEDIATRIC_CLINIC_SOURCES as sources,
  WITHHELD_TOPICS,
} from "./pediatric-clinic-batch";

const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const safeLink = (label: string, href: string) => `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;

/** Review artifact from current exports; no runtime admission or web retrieval. */
export function renderPediatricSamples(): string {
  const output = [
    "# Pediatric batch samples - 2026-10-08",
    "",
    `**Unapproved draft:** all authored records remain \`needs_clinician_review\`. ${manifest.authoringConceptCount} objectives (${manifest.newConceptCount} new IDs and one unchanged existing ID), ${manifest.questionVariantCount} variants. One example per objective follows.`,
    "",
    "**Key-first ordering for this review artifact only:** option A is the correct answer in every example. Runtime nodes randomize all answer choices. Agent checks and tests are not clinical approval. This batch is not assembled into an active release.",
    "",
    "Scope: child ages 5-17 matched to authored art metadata; one named parent in the same room throughout; outpatient examination, counseling and referral. No tests, wait-duration prose, sedation, pediatric MRI or procedure flows. Matching ages and fictional names are editorial values, not clinical probabilities. Legacy `approvedInstantiationProfiles` terminology does not imply clinician approval.",
    "",
  ];
  for (const concept of concepts) {
    const question = questions.find((item) => item.conceptId === concept.id)!;
    const clinicalCase = cases.find((item) => item.patientPresentationVariantId === question.patientPresentationVariantId)!;
    const family = families.find((item) => item.caseId === clinicalCase.id)!;
    const sourceIds = new Set(question.supportingEvidenceClaimIds.flatMap((id) => claims.find((claim) => claim.id === id)!.sourceIds));
    output.push(
      `## ${concept.displayName}`, "",
      `Concept: \`${concept.id}\` (${concept.identityDisposition}). Question: \`${question.id}\`.`, "",
      `**Chief complaint:** ${clinicalCase.chiefComplaint}`, "",
      `**Patient and parent:** ${clinicalCase.patientDisplayName}; age ${clinicalCase.prototypeDemographics!.ageYears}, ${clinicalCase.prototypeDemographics!.sexLabel}; ${family.parentRelationship} ${family.parentName} stays in the same room. Art: \`${family.childStillId}\`.`, "",
      `**Presentation:** ${question.patientPresentation}`, "",
      `**Question:** ${question.stem}`, "",
      "**Choices - KEY FIRST FOR REVIEW:**", "",
    );
    for (const [index, choice] of question.answerChoices.entries()) {
      output.push(`${String.fromCharCode(65 + index)}. ${choice.label}${choice.isCorrect ? " **(key)**" : ""}`, "", `Rationale: ${choice.rationale}`, "");
    }
    output.push(
      `**Explanation:** ${question.explanation}`, "",
      `**Teaching point:** ${question.teachingPoint}`, "",
      `**Claims:** ${question.supportingEvidenceClaimIds.map((id) => `\`${id}\``).join(", ")}.`, "",
      `**Sources:** ${sources.filter((source) => sourceIds.has(source.id)).map((source) => safeLink(source.id, source.officialUrl!)).join("; ")}.`, "",
    );
    const limitations = [...new Set(question.supportingEvidenceClaimIds.map((id) => claims.find((claim) => claim.id === id)!.limitation).filter(Boolean))];
    output.push("**Source and review limitations:**", "", ...limitations.map((limitation) => `- ${limitation}`), "");
  }
  output.push("## Withheld topics", "", ...WITHHELD_TOPICS.map((topic) => `- **${topic.topic}:** ${topic.reason}`), "");
  output.push("## Source catalog and attribution", "", "Full claim-source mappings, source authority and rights/access notes are in the batch's `evidence-claims.ts` and `source-catalog.ts`. Bibliographic titles identify sources; no source excerpts are reproduced.", "");
  for (const source of sources) {
    output.push(`- \`${source.id}\`: ${source.completeCitation} ${safeLink("Official source", source.officialUrl!)}. License/reuse: ${source.licenseLabel}; ${source.reuseStatus}.${source.licenseUrl ? ` ${safeLink("License", source.licenseUrl)}.` : ""}`, "");
  }
  output.push(
    "Contains public sector information licensed under the Open Government Licence v3.0, where applicable to NHS website material. Logos, third-party images and source illustrations are excluded. Metzger et al. (2021) are attributed with DOI and CC BY 4.0 license above; all question wording and evidence claims were independently authored. Scalise and Demehri (2023) carry CC BY-NC-ND 4.0; only underlying facts were checked and no article adaptation is distributed.", "",
    "Manager review must select the exact unapproved prototype manifest, preserve constrained child/art/family identities, admit the L4 runtime foundation and deduplicate the existing midline-recognition concept. Named clinician approval of exact versions remains required before clinical promotion. This is a local draft with no Git backup performed by the worker.", "",
  );
  return output.join("\n");
}
