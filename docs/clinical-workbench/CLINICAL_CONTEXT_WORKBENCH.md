# Clinical Context Workbench

Status: local beta implementation workstream. Authoring-only; never bundled
with the player or deployed through GitHub Pages.

## Purpose

The Clinical Context Workbench is the evidence-operations companion to the
Clinical Content Workbench. It reduces low-level literature searching and
record keeping while leaving clinical judgment, approval, and publication with
the clinician.

It is designed to:

- maintain an explicit queue of clinical questions and evidence gaps;
- run resumable, metadata-only searches for recent guidelines, systematic
  reviews, meta-analyses, and other relevant literature;
- retain the exact query, date window, provider, filters, result count, and
  tool version for every search;
- screen candidates without pretending that a search result is accepted
  evidence;
- connect accepted evidence to exact immutable Source Snapshots and Citations;
- preserve supporting, challenging, qualifying, and contextual evidence;
- record clinician opinion as clinician opinion rather than disguising it as a
  published conclusion;
- produce a short **Known versus needed** brief for each evidence gap; and
- create an auditable content-change proposal instead of directly changing or
  publishing game content.

This workstream does not change the game's Clinical Topic -> Tested Concept ->
Patient Presentation Variant -> Question Variant hierarchy. It supplies
reviewed evidence context to that existing authoring flow.

## Separation from the game

The Workbench is a separate loopback-only application. Its server binds to
`127.0.0.1`, keeps private state in ignored directories, and has no production
build or Pages deployment. The player and game-domain packages may not import
the Workbench, clinical-research, or clinical-authoring packages.

Only a separately validated and clinically approved content revision may enter
an immutable clinical release. A literature search, candidate, citation,
synthesis, or accepted Workbench review is not itself runtime content.

The repository verifies this boundary in three places:

1. dependency and tracked-path checks before tests;
2. a player-build plugin that rejects authoring/private module paths; and
3. a recursive Pages-artifact scan.

## Queue model

The application presents distinct queues because the following states must not
collapse into one another:

1. **Evidence gaps** - a precise question, why it matters, the targeted Topic,
   Concept, fact, or content item, preferred evidence types, acceptance
   criteria, and a configurable scouting cadence. The UI also derives a
   non-authoritative suggestion list from synced authoring targets that have
   no linked Evidence Gap, then prefills (but does not save) a reviewable gap
   and metadata-search strategy.
2. **Literature candidates** - one canonical bibliographic lead plus immutable
   observations recording every Search Run and Evidence Gap in which it was
   seen. DOI, PMID, and provider-record identities are collapsed without fuzzy
   title matching. Discovery does not establish relevance, authority, access
   rights, or clinical truth.
3. **Screening decisions** - append-only include, exclude, duplicate,
   awaiting-full-text, or rights-blocked decisions, each with reviewer,
   rationale, and time.
4. **Source rights** - append-only, default-deny decisions governing metadata,
   private storage, local extraction/indexing, external-AI transfer, derived
   paraphrases, source-text publication, runtime redistribution, and commercial
   distribution. A later decision supersedes rather than erases an earlier
   decision.
5. **Evidence contributions** - a concise project-authored statement explaining
   what one exact Citation contributes and whether it supports, challenges,
   qualifies, or provides context. Formal contributions require a verified
   Citation to an immutable Source Snapshot.
6. **Clinician opinions** - scoped judgments with author, rationale, and time.
   They remain visibly different from formal evidence.
7. **Synthesis review** - draft Known/Needed assessments, limitations,
   disagreements, and unresolved questions. Acceptance, narrowing, rejection,
   deferral, or a request for more evidence is append-only.
8. **Content-change proposals** - add, modify, withdraw, or no-change proposals
   linked to an accepted synthesis. They still require the ordinary clinical
   authoring, approval, compatibility, and immutable-release workflow.

Corrections, retractions, updates, translations, companions, and superseding
sources are represented as Source-to-Source relations. They never rewrite
historical Source or Citation records.

## Known versus needed

The brief is deliberately conservative and deterministic.

**Known** may summarize only reviewed Evidence Contributions and explicitly
identified clinician opinions. It preserves disagreement and labels the
evidence role. It never turns the number of matching papers, search-result
rank, journal name, or an unreviewed candidate title into a clinical
conclusion.

**Needed** reports unmet acceptance criteria, missing preferred source types,
unresolved qualifying or challenging evidence, candidates awaiting screening
or full text, rights blocks, stale searches, and explicit reviewer questions.

**Recently found** may list bibliographic metadata for new candidates, clearly
marked as unscreened. This helps the developer or clinician decide what to
inspect without presenting metadata as evidence.

## Literature scouting

The first providers are metadata-only:

- PubMed through
  [NCBI E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25497/)
  (`ESearch` followed by `ESummary`); and
- optional [Crossref REST metadata](https://www.crossref.org/documentation/retrieve-metadata/rest-api/access-and-authentication/)
  search or DOI enrichment.

Declared preferred source types drive the Needed checklist and reviewer
priority; they are not silently converted into a clinical-authority score.
For uncovered authoring targets, the Workbench can prefill an auditable PubMed
strategy using [PubMed's documented search filters](https://pubmed.ncbi.nlm.nih.gov/help/)
for guideline publication types,
`systematic[sb]`, and meta-analysis publication type. The reviewer may edit
that literal strategy before saving it. Publication types, dates,
organizations, and identifiers remain screening signals rather than accepted
evidence.

The local server can check due Evidence Gaps when it starts and at a bounded
interval while it remains open. A gap may also be scouted manually. Every run
is immutable, rate-limited, and auditable. Repeated DOI, PMID, or exact
provider-record matches reuse one Candidate while appending a run-specific
Candidate Observation. Screening remains independent for each Evidence Gap.
Conflicting DOI/PMID mappings fail closed as a partial run instead of merging
two publications. A failed or partial provider call remains visible and may be
retried; it never replaces an earlier run.

Before network scouting, the operator must set
`CLINICAL_SCOUT_CONTACT_EMAIL`. This identifies the tool to NCBI and Crossref
and is not committed. `NCBI_API_KEY` is optional; the system works within the
lower unauthenticated rate limit when it is absent. The project operator should
follow NCBI's current tool/email registration guidance in addition to including
the values in requests. No paid service is required or authorized.

The scout stores bibliographic metadata, provider identifiers, links,
publication types, language, and deterministic metadata fingerprints. It does not store
abstracts, full text, search-result snippets, or authenticated URLs. Provider
artifacts, when retained for audit, remain in ignored local storage.

Manual actions use a server-resolved reviewer identity, never an identity
supplied by a browser command. Set `CLINICAL_WORKBENCH_REVIEWER_ID` and
`CLINICAL_WORKBENCH_REVIEWER_ROLE` in ignored local environment configuration
when more than the default single-user owner profile is needed. Automated
metadata runs retain their separate automation actor. Only the `owner` and
`clinical_reviewer` roles may accept a clearly labeled Expert Opinion into
Known. Developers, rights reviewers, and administrators may propose or reject
an opinion, but cannot promote it into Known.

The Workbench must keep the
[NCBI disclaimer and copyright notice](https://www.ncbi.nlm.nih.gov/About/disclaimer.html)
visible near PubMed-derived results. NCBI specifically warns that PubMed
abstracts may contain copyrighted material; this pipeline avoids that issue by
not requesting or storing abstracts.

## Private document intake

Legitimately obtained source files belong only under:

```text
.private-clinical-data/clinical-research/source-intake/
  inbox/
  staging/
  rights-blocked/
  processed/
  duplicates/
  quarantine/
  extracted/
  manifests/
  provider-discovery/
```

Intake uses streaming size checks and SHA-256 identity, byte-based format
sniffing, a single-writer lock, per-file checkpoints, atomic destination
writes, and immutable extraction identities. It never silently overwrites or
deletes input. Parsing reads the same verified file-handle identity used for
the bounded read rather than reopening an arbitrary browser-supplied path.
An abandoned lock can be recovered only through the explicit stale-lock
recovery utility after its owner process is confirmed gone; the original lock
and a recovery audit record are retained instead of deleted.

The current Workbench enforces a 25 MiB per-file pilot ceiling. Image-only PDFs
remain in an explicit `ocr_required` outcome and do not count as extracted
coverage. Lightweight queue refreshes validate the manifest structure only;
the operator starts a separate deep integrity audit when every retained
artifact should be rehashed.

PDF and DOCX parsing runs on an isolated worker event loop with a hard deadline,
V8 memory/stack limits, page/block caps, and a total extracted-character cap.
The current defaults allow at most 2,000 PDF pages, 20,000 DOCX blocks,
12,000,000 extracted characters, 45 seconds, and a 256 MiB old-generation
heap. Parent-side validation applies the same structural and output limits to
injected adapters. Parser errors are reduced to stable generic codes so source
text or local paths do not leak into the UI.

This remains a local bounded-ingestion control, not an operating-system
malware sandbox or permission to bulk-load arbitrary files. Use legitimately
obtained, trusted sources; begin with one chapter; and review limits and
resource behavior before admitting multiple textbooks.

Metadata discovery may precede a rights decision. Storing bytes, extracting or
indexing text, sending content to an external AI service, and publishing
derived/source material are separate permissions. The code blocks each
operation unless the applicable effective decision permits it. Permission to
process a source is not clinical approval.

No PHI may enter the intake path. Commercial question-bank stems,
explanations, and answer choices must not be ingested, committed, or republished
without documented rights. The intended practice-question workflow stores the
owner's original paraphrase of the educational takeaway plus a private source
reference, then drafts new clinically reviewed content.

## Human and automation responsibilities

Automation may:

- maintain search cadence and exact query history;
- retrieve and deduplicate bibliographic metadata;
- flag stale searches, missing evidence types, disagreements, retractions, and
  rights blocks;
- organize approved contributions into a concise deterministic brief; and
- prepare draft synthesis and content-change records.

The clinician must:

- decide whether the question and acceptance criteria are appropriate;
- obtain and read the relevant source where needed;
- verify every exact Citation and project-authored contribution;
- resolve or preserve clinical disagreements;
- identify which statements are expert opinion;
- approve, narrow, reject, or defer a synthesis; and
- separately approve any clinical content before publication.

There is no unrestricted runtime AI generation. This beta contains no paid
model integration and never sends source text to an external model.

## Recommended first pilot

Use one bounded chapter or guideline area and approximately 5-10 Clinical
Topics:

1. create Topic shells and a small number of precise Evidence Gaps;
2. run metadata scouting and screen a limited candidate set;
3. register one or two legitimately obtained exact Source Snapshots;
4. add verified Citations and Evidence Contributions;
5. record disagreements and one clinician opinion where useful;
6. inspect the Known-versus-needed briefs;
7. prepare, review, and either accept or reject one synthesis;
8. create a proposed authoring change without publishing it; and
9. audit the immutable history, inspect an earlier revision, and append a
   corrective-forward revision without rewriting that history.

Only after this round trip is understandable and useful should the project
scale to several textbooks or broad curriculum coverage.
