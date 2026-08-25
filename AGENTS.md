# Repository instructions

## Clinical-content safety and provenance

Clinical content in this repository is software content, not medical advice. New
AI-assisted diagnoses, phenotypes, evidence claims, concepts, question variants,
explanations, and chart summaries must remain `needs_clinician_review` until a
named clinician explicitly approves a version. Automated tests are not clinical
approval. Draft content may be exposed only through the owner/development
preview or an explicitly unapproved prototype release.

Keep educational tier, patient acuity, facility capability, and facility
progression level as separate fields. Clinical relationships and editorial
simulation weights must also remain separate. Do not use race or ethnicity as a
disease-selection variable. Do not invent exact probabilities, thresholds,
timelines, medication rules, or demographic weights; an exact value requires a
source that directly supports that exact value.

### Source restrictions

Do not:

- upload, read, ingest, scrape, or commit proprietary textbook PDFs;
- use UpToDate, AccessSurgery, commercial question banks, paid review products,
  proprietary SCORE modules, or recalled ABSITE questions as a corpus;
- copy or closely paraphrase source prose;
- copy tables, figures, algorithms, illustrations, question stems, or answer
  explanations;
- store full article text or source excerpts in the repository;
- treat a citation as permission to copy;
- treat public web access as permission for AI ingestion when a site's terms
  prohibit automated or AI use;
- assume PubMed Central availability grants reusable rights;
- rely on inaccessible or paywalled search-result snippets; or
- create placeholder citations.

Permitted work includes reading current government guidance, suitably licensed
open-access articles, and professional-society guidelines; extracting underlying
medical facts; independently synthesizing short original statements; and
storing bibliographic metadata, atomic claim mappings, reuse status, and
external links. Copyrighted society guidance may be used for targeted factual
verification and citation without reproducing protected expression. Follow all
attribution requirements for Creative Commons material.

Every source record must include a stable ID, complete citation, organization or
journal, authors when applicable, publication year, DOI or official URL, access
date, source class, license/reuse status, intended evidence or cross-check use,
and the supported evidence-claim IDs. Record medical authority separately from
license permissiveness.

Every substantive clinical statement must be represented by an atomic,
independently written evidence claim with a stable ID, supporting source IDs,
evidence category, certainty or limitation, last-checked date, and clinical
review status. Prefer a current guideline plus an independent source for
management claims. If only one adequate source exists, record that limitation.
If adequate sources conflict, preserve the disagreement and withhold the
disputed teaching point for clinician review instead of averaging or guessing.

External clinical links must open safely in a new tab. Do not retrieve web
content or call an AI model during gameplay.

### Change discipline

Preserve stable concept IDs when only patient details or question wording
change so FSRS history remains attached to the intended concept. Create a new
concept version when the underlying clinical meaning changes materially. Keep
new clinical data replaceable without rewriting the patient generator, preserve
existing frozen encounters and saves, and do not silently promote draft content
into an approved public release.
