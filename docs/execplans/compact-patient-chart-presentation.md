# Compact Patient Chart Presentation

## Goal

Make an open patient chart read like a compact paper chart on a clipboard at
laptop scale: remove redundant visible labels and repeated information, keep the
decision prompt only with its answer choices, use a genuine patient-reported
chief concern, extend column rules and shading to the bottom of the paper, and
remove avoidable vertical and horizontal dead space without shrinking the map or
desk allocation.

## Requirements

- Remove the visible `Chief complaint` and `History of present illness` labels.
  Preserve the existing visual divider and accessible section meaning without
  spending visible chart space on those implied headings.
- Render each current decision question exactly once, immediately above its
  answer-choice group. Do not repeat a decision stem or question at the bottom
  of the presentation column.
- Keep the chief concern separate from the longer presentation, but make every
  authored concern shown by active cases a short patient-reported reason for the
  visit rather than a diagnosis, medical category, chart title, referral task,
  or teaching-question label.
- Derive complaint rewrites only from facts already present in the same authored
  case/profile. Do not add symptoms, acuity, timelines, diagnoses, treatments,
  measurements, or probabilities.
- Preserve stable case, presentation, concept, question, decision-node, answer,
  evidence-claim, and source IDs. Existing frozen encounters and saves retain
  their frozen text.
- Treat AI-assisted complaint rewrites as a new presentation version awaiting
  named-clinician review. Do not silently represent rewritten presentation text
  as covered by a prior exact-version approval, and do not promote it into a
  public approved release during this task.
- Make the identity shading, presentation shading, vertical dividers, and
  decision-paper treatment reach the bottom of the chart body at desktop and
  laptop sizes, including when the active decision is short.
- Reuse or refine the existing absolute paper stack and clip decoration. Add
  only subtle texture in otherwise unused edge space; it must be noninteractive,
  pointer-transparent, and consume no layout space.
- Aggressively reduce effective titlebar, column, section, update, prompt,
  feedback, answer-list, action-bar, and portrait spacing. Keep clinical text
  readable, feedback reachable, and interactive choices at an accessible touch
  height.
- Preserve the full-desk chart priority, Management Mode, Build Mode, the
  draggable map/desk splitter, chart flip/summary, filing, question-review flag,
  tutorial anchors, answer shuffling, and phone document scrolling.

## Constraints and non-goals

- This is a presentation and authored-copy revision, not a change to clinical
  meaning, correct answers, explanations, evidence claims, scheduling, FSRS,
  simulation rules, or encounter progression.
- Do not synthesize complaint text at runtime with heuristics. The heterogeneous
  case library cannot be converted safely or naturally from a generic UI rule.
- Do not alter proprietary/source material, browse for new medical facts, or
  copy source prose. Existing case facts are the sole content boundary.
- Do not collapse the complaint and presentation into one paragraph; their
  placement and divider remain meaningful even though their visible headings
  are removed.
- Do not leave a patient-authored restatement of the teaching question at the
  end of the presentation. Remove only exact audited duplicate spans; preserve
  clinical facts and use exact pending replacement text when deletion would
  leave no useful presentation body.
- Do not reduce an enabled answer choice below a 44 CSS-pixel minimum target.
- Do not stage, commit, push, deploy, reset, clean, or delete anything. Preserve
  all unrelated Management, splitter, density, graphics, facility, screenshot,
  test, design-document, and handoff changes in the shared dirty worktree.

## Relevant repository state

- Local `beta` and `origin/beta` are both at
  `eb57bb0018e449b5ab699cb74abd09180714ba67`; the requested Management,
  splitter, density, and graphics work is present as a large shared uncommitted
  worktree and must remain intact.
- `ChartPanel.tsx` already renders a decision prompt only inside
  `DecisionStepContent`, directly before that step's `.answer-list`. Runtime
  decision stems are split for display by `splitClinicalDecisionStem`; the
  original frozen authored stem remains untouched.
- The two redundant visible labels are owned by the presentation-column markup.
  `presentationHeading` is otherwise dead display plumbing from
  `viewModels.ts` through `ChartView`.
- `chiefComplaint` is copied verbatim from the frozen case. It originates in
  `SyntheticClinicalCase` and optional approved instantiation profiles. The
  current authored library contains more than one hundred assignments with
  mixed styles, including symptom concerns, diagnoses, referral/admin phrases,
  and generic teaching-question labels.
- Active runtime presentation IDs are stable strings, not independently
  versioned authored records. Existing package-local approval constants can list
  a presentation ID, but the release validator does not bind that ID to the
  exact complaint/presentation text or a content fingerprint. A plain text edit
  or package-version bump would therefore leave the prior approval appearing to
  cover changed wording.
- The later CSS cascade makes the front face and workspace content-sized while
  the opaque column surfaces mask the ruled paper behind them. That combination
  causes backgrounds and dividers to stop below a short final decision.
- Existing `.paper-chart-stack` and `.paper-chart-clip` elements are absolutely
  positioned and already consume no chart layout. Phone rules intentionally
  suppress the external stack/clip decoration.

## Decisions already made

- Keep a single source of decision-prompt markup in `DecisionStepContent` and
  add regression assertions for occurrence count and DOM order rather than
  moving or duplicating the question.
- Remove the unused `presentationHeading` view field after removing its visible
  heading. Use structural sections/ARIA labels or screen-reader-only text for
  semantics; no visible replacement label is needed.
- Keep `chiefComplaint` as the stable frozen-data field for save compatibility,
  but define its authoring meaning as a concise patient-reported concern.
- Add an independent case-level `patientPresentationRevision` envelope for the
  revised complaint text. It must carry a new immutable revision ID, bind to the
  case's existing `patientPresentationVariantId`, name `chiefComplaint` as the
  revised field, disclose AI assistance, and remain
  `needs_clinician_review` with no last-clinician review. The base presentation,
  concept, question, node, choice, and answer IDs do not change.
- The active release currently has no instantiation-profile complaint
  overrides. Release assembly rejects any future profile-supplied complaint
  until an explicit revision-coverage model is designed. The base case remains
  the frozen save-compatible carrier, so no runtime heuristic or reducer
  migration is required.
- Keep existing question/answer approval constants and their content versions
  unchanged. The new presentation revision has its own version namespace and is
  admitted only to the already unapproved synthetic/development-preview release.
- Perform complaint correction as authored content, one case at a time, with
  explicit mappings grounded in the corresponding presentation. Any future
  profile override requires equally explicit coverage. Do not use a
  title-case/first-person formatter or a diagnosis-to-symptom dictionary.
- Represent those mappings as an exact, reviewable pending-revision overlay at
  active-release assembly. Keep the previously reviewed source-case wording
  intact, clone only the active preview case records, and replace complaints
  from the explicit mapping before release validation. This is authored static
  content, not a runtime heuristic; it makes the changed text/version boundary
  visible in one audit table and preserves the prior source version unchanged.
- Separate UI/layout work from clinical-copy migration so layout validation
  cannot accidentally confer clinical approval. Complaint revisions remain
  owner/development-preview content until a named clinician approves the exact
  new version.
- At desktop/laptop sizes, make the front face a full-height flex surface and
  stretch the workspace, decision region/timeline, and final/current decision
  surface through the available chart body. At phone sizes, retain natural
  document height and vertical scrolling.
- Refine the existing paper/clipboard elements and pseudo-elements rather than
  adding raster art or a new layout wrapper.

## Milestones and file ownership

1. **Chart structure, density, and full-height paper surface — Terra.** Own only
   `apps/player/src/ui/ChartPanel.tsx`,
   `apps/player/src/ui/ChartPanel.test.tsx`, the chart portion of
   `apps/player/src/ui/visualComponents.test.tsx`,
   `apps/player/src/ui/types.ts`,
   `apps/player/src/session/viewModels.ts`, chart-related rules in
   `apps/player/src/styles/global.css`, and this plan's progress/discoveries.
   Remove visible labels and dead `presentationHeading` plumbing, prove one
   prompt immediately precedes its answers, compact all chart surfaces and the
   portrait, extend column treatments to the body bottom, and refine the
   no-footprint clipboard texture. Preserve clinical strings in this milestone.
   Run focused component tests, player typecheck, player build, and
   `git diff --check`. Do not edit clinical-content data, E2E, proof images,
   design docs, or the handoff.
2. **Patient-reported complaint content migration — Terra after Sol review.**
   Own the chief-complaint contract in
   `packages/clinical-content/src/schema.ts`, a narrowly scoped new exact
   presentation-revision mapping/helper and audit test under
   `packages/clinical-content/src`, the active-release assembly in
   `packages/clinical-content/src/synthetic-content.ts`, any required package
   export, focused clinical-content validation/tests, and this plan. First
   generate a complete ID/old/new/status audit table from the actual compiled
   case catalog. Keep prior source-case strings unchanged; apply exact pending
   revisions only to cloned active-preview cases. Rewrite only from facts in the same
   presentation, preserve every stable identity and question/answer mapping,
   and make the revised presentation version/review boundary explicit. If the
   current model cannot mark presentation-only revisions independently without
   falsely preserving approval, stop at that architecture boundary and report
   it to Sol instead of weakening provenance. Do not edit player UI/CSS, E2E,
   screenshots, docs outside this plan, or unrelated clinical facts.
2b. **Semantic presentation de-duplication — Terra after final proof audit.**
   Extend the exact pending overlay and schema envelope to bind revised
   presentation text as well as chief concern text. Apply only the 51 audited
   case revisions and the 30 HCC profile-specific presentation revisions;
   preserve the other 54 case presentations. Use exact delete-only
   transformations wherever a standalone question tail carries no unique fact,
   and exact source-grounded pending replacement text for the exceptional empty
   or unusably fragmentary bodies. Reject unmapped profile presentation drift.
   Keep all changed case/profile presentations `needs_clinician_review`, frozen
   source arrays unchanged, and stable clinical/question IDs intact.
3. **Responsive browser acceptance and documentation — Terra after Sol review.**
   Own a focused new chart-density E2E (or narrowly scoped chart portions of an
   existing E2E), unique `patient-chart-compact-*` native proof images under
   `artifacts/screenshots/`, chart-specific updates to `CANONICAL_DESIGN.md`,
   this plan, and an appended checkpoint in
   `docs/handoffs/CURRENT_THREAD_HANDOFF.md`. Prove laptop/compact-desktop/phone
   behavior, full-height surface geometry, prompt order/uniqueness, hidden
   labels, patient concern placement, no horizontal page overflow, and reduced
   scrolling. Do not regenerate or claim shared graphics/Management proofs.
4. **Final acceptance — Sol.** Review actual diffs, the complete complaint audit,
   review-status behavior, test evidence, and native proofs; reconcile all
   task-owned paths against the shared worktree; delegate any nontrivial fix;
   then close the bounded checkpoint without staging, committing, pushing, or
   deploying.

## Acceptance criteria

- Open chart markup contains neither visible `Chief complaint` nor visible
  `History of present illness`/`HPI & presentation` copy. Complaint and
  presentation remain visibly separated by the existing rule.
- The current decision question appears once and its prompt element precedes
  the matching answer-list element. No full stem vignette or question is
  repeated in the presentation column.
- Every active authored case/profile that can supply a chief complaint uses a
  concise patient-reported visit concern based only on its existing presentation
  facts. Generic teaching labels, diagnoses-as-headings, and administrative
  referral/category phrases fail automated audit.
- No rewritten patient concern inherits a false exact-version clinical approval;
  its status is visibly and structurally pending named-clinician review, while
  unchanged question/answer versions retain their independent existing status.
- At 1440px, 1280x720, and 1024x768, the workspace and its shaded/rule-bearing
  surfaces reach the bottom of the chart's scrolling body (within a small pixel
  tolerance) even for a short decision.
- Chart title, demographics, portrait, satisfaction, complaint, presentation,
  update, prompt, choices, feedback, and actions are measurably more compact.
  A representative early question fits with materially less scrolling at
  1280x720 and 1024x768.
- Enabled answers remain at least 44 CSS pixels high. Long answer and feedback
  copy wraps without clipping and remains reachable by scrolling.
- Paper/clipboard texture is subtle, stays behind content, captures no pointer
  events, adds no margin/padding or overflow, and remains suppressed where phone
  rules require an edge-to-edge chart.
- Chart opening still hides both mode buttons and owns the full desk; resizing
  the map/desk split changes available chart space without stretching the map.
- Summary flip, feedback acknowledgment, question flagging, answer submission,
  filing, reduced-motion behavior, and phone chart flow remain functional.

## Validation

- Focused Vitest for `ChartPanel`, visual chart markup, question adjacency, and
  clinical-text splitting.
- Clinical-content catalog/schema tests plus a complete audit that reports every
  active case/profile complaint, its presentation variant, and review state.
- Player and clinical-content workspace typechecks and production builds.
- Focused Playwright at 1440px, 1280x720, 1024x768, and representative phone
  width, including exact prompt/answer DOM order, label absence, chart/surface
  bounding boxes, enabled-choice height, page overflow, and scroll measurements.
- Native inspection of fresh uniquely named `patient-chart-compact-*` proofs.
- `git diff --check`, encoding scan on task-owned text files, and exact
  task-versus-concurrent path reconciliation.

## Progress

- [x] Read repository instructions, current handoff, dirty tree, and current
  chart/content implementation.
- [x] Complete independent read-only audits of chart layout and clinical text
  flow.
- [x] Implement and validate chart structure, density, and full-height paper.
- [x] Migrate and validate patient-reported chief concerns with provenance-safe
  review handling.
- [x] Complete responsive browser acceptance and documentation.
- [x] Remove semantic teaching-question duplicates from the 51 audited case
  presentations and all 30 HCC profile presentations; restore complete
  source-grounded narrative grammar where tail removal left a fragment.
- [x] Refresh responsive proof/documentation against the de-duplicated chart.
- [x] Complete Sol final acceptance and handoff closure.

## Discoveries

- The current runtime does not render the top-level legacy question in addition
  to `decisionSteps`; the user-visible regression risk is future duplication,
  so tests should assert both occurrence count and element order.
- `splitClinicalDecisionStem` intentionally prevents presentation prose from
  being repeated above choices. Later-step context is separately authored or a
  legacy display fallback and should remain distinct from the decision prompt.
- The largest effective density costs come from late physical-paper overrides:
  a 4.15rem titlebar, 0.75rem column/decision padding, large clinical-divider
  spacing, 1.4–1.45 text line-height, and update/answer gaps. Editing earlier
  shadowed declarations alone would have no effect.
- The avatar's outer large-size box is 104 by 128 CSS pixels even when its inner
  pixel variable is reduced at laptop widths; the outer chart-specific size must
  also be constrained.
- Short content exposes the bottom-treatment defect because the front face is
  forced back to `height: auto` late in the cascade while the column surfaces are
  opaque. A desktop flex/stretch correction can fill the body without changing
  the phone document model.
- Complaint-copy correction is not safely reducible to formatting. Examples
  such as `Reviewing an approved clinic teaching question`, `Discussing a new
  desmoid diagnosis`, and referral/category labels require individual authored
  replacements grounded in their associated patient presentation.
- The active release has no generic presentation revision/review record. A
  stable presentation ID alone cannot prove that changed complaint text is still
  the clinician-approved version, so this task will add a separate pending
  revision envelope rather than changing question approval metadata.
- The chart component now retains complaint/presentation semantics with ARIA
  labels while removing the visible section-heading rows. Raw frozen clinical
  strings remain unchanged for the dedicated provenance-safe content milestone.
- The late full-desk CSS cascade now explicitly stretches the desktop/laptop
  front face and workspace through the chart body, while a phone override keeps
  the document naturally sized and vertically scrollable. Current answer
  choices retain an explicit 44px minimum height.
- Focused chart/component/clinical-text Vitest initially passed (3 files, 17
  tests) and the player production build passed. An unrelated concurrent
  `FacilityScene.ts` missing-symbol typecheck failure existed during the first
  milestone, but the concurrent facility work resolved it before final
  acceptance; the final player typecheck passes.
- The active release supplies a chief complaint on 105 cases and on no
  instantiation profile. Milestone 2 applies one exact pending revision to
  each of those cloned release cases; the reviewed source arrays remain
  unchanged.
- Each pending envelope binds the exact revised complaint and any revised base
  or profile presentation, uses the dated
  `presentation-revision.chief-complaint-and-presentation.2026-09-01.v2`
  namespace, and uses `aiAssistedDrafting`/`reviewStatus` naming aligned with
  authored-record conventions. A later wording change requires a new revision
  ID and content version; profile complaint overrides fail release assembly
  until explicit revision coverage is designed.
- Milestone 3 exercised the ordinary persisted UI at all configured viewports.
  The focused phone run passed. Desktop, laptop, and compact-desktop exposed a
  remaining body-surface geometry mismatch: the current decision surface is
  not within the required small tolerance of the flip-stage bottom. Exact
  failures were desktop `8.80px` short (`950.81` versus `959.61`), laptop
  `32.61px` beyond (`712.22` versus `679.61`), and compact desktop `142.50px`
  beyond. The laptop and compact screenshots also show that the chart content
  flows beyond the initially visible desk body, so the correction must retain
  reachable internal scrolling rather than merely clipping the current step.
- Fresh, unique native captures exist as
  `patient-chart-compact-desktop.png` (1440x1000),
  `patient-chart-compact-laptop.png` (1280x720),
  `patient-chart-compact-compact-desktop.png` (1024x768), and
  `patient-chart-compact-phone.png` (Pixel 7 logical 412x839). Native
  inspection confirms labels are absent, the patient-voice concern is present,
  one prompt appears with its choices, and the phone sheet is naturally
  scrollable with no intrusive clipboard decoration. Desktop/laptop/compact
  captures should not be accepted as final proofs until the body geometry is
  corrected and this focused spec passes.
- The corrective layout boundary is the legacy stacked-decision cascade: its
  desktop bottom padding created the exact 8.8px desktop gap, while its later
  compact auto-height grid let the active step outgrow the lower row. At
  desktop sizes, the live decision now fills the stack's padded-box height and
  scrolls internally; at the compact two-row breakpoint, the late bounded grid
  row definition is restored. Phone rules remain outside that correction and
  retain natural document scrolling.
- Post-correction focused E2E passed at every configured viewport. Exact
  current-surface bottoms now equal the chart body bottom: desktop
  `959.609375`, laptop `679.609375`, and compact desktop `720.8125` CSS px.
  The compact first-row identity and presentation surfaces end at
  `550.71875`, above the lower decision row as intended. All checks retained
  zero horizontal overflow and 44px enabled answer targets.
- Terra's sequential post-correction browser validation passed one focused case
  in each project (desktop, laptop, compact desktop, and phone); focused chart
  component tests passed 13 tests. Sol then independently reran the focused
  browser spec sequentially: desktop 1 passed in 16.0s, laptop 1 passed in
  13.0s, compact desktop 1 passed in 14.0s, and phone 1 passed in 12.1s.
  Sol reviewed the CSS/markup/E2E changes and the refreshed native proofs.
- Final integrated validation passed player chart/visual/clinical-text Vitest
  (3 files, 17 tests), all clinical-content Vitest (40 files, 264 tests), player
  and clinical-content typechecks, the player production build (298 modules;
  existing large-chunk advisory only), repository boundary/launcher checks,
  `git diff --check`, and the task-owned encoding scan.
- Initial native-proof review exposed a semantic gap that DOM prompt-count
  checks could not detect: 51 of 105 active cases retained a standalone
  authored restatement of the teaching decision at the end of `presentation`.
  Ten HCC cases also had three profile-specific presentation overrides apiece,
  for 30 runtime profile revisions. Independent exact-source audit classified
  the final corrections as 45 direct deletion/punctuation repairs and six
  source-grounded composed replacements. The other 54 case presentations add
  clinical context and remain byte-identical.
- Eight v2 literal final presentations became grammatical fragments after their
  audited question tail was removed. Their exact pending replacements now use
  only source-grounded state verbs; the narrative quality cue also recognizes
  declarative `presents`, `has`, `have`, and `had` backgrounds.
- Presentation-revision schema validation now requires the canonical revised
  case-field sequence and independently rejects duplicate profile revision
  record IDs, preventing duplicate values from masquerading as complete
  coverage without changing the literal mapping audit tables.
- The refreshed four-project browser proof verifies the first active chart's
  presentation contains its COPD context but neither the audited exact teaching
  tail nor a rendered question-mark tail. The concern still appears once and
  the sole decision prompt remains immediately before the randomized answer
  list. Desktop, laptop, compact desktop, and phone each passed one focused
  sequential case; all retained zero horizontal overflow, 44px enabled answers,
  flush desktop/laptop/lower-compact paper bodies, and phone natural scrolling
  with the absolute decoration suppressed.
- Sol's final integrated run passed all clinical-content Vitest (40 files, 269
  tests), focused chart/visual/clinical-text Vitest (3 files, 17 tests), player
  and clinical-content typechecks, the 298-module player production build
  (existing large-chunk advisory only), and repository boundary/launcher
  checks. Sol independently reran the final semantic/geometry browser proof:
  desktop 1/1 in 19.1s, laptop 1/1 in 15.0s, compact desktop 1/1 in 14.6s, and
  phone 1/1 in 13.8s, then inspected all four resulting native proofs.

## Exact next action

Owner: review/playtest the compact chart and name any concrete layout or copy
correction. The v2 exact source-to-final bindings cover 105 patient-voice
concerns, 51 base presentation de-duplications, and 30 HCC profile presentation
revisions while 54 base presentations remain unchanged. All AI-assisted copy
stays `needs_clinician_review` in `synthetic_unapproved_prototype`; a named
clinician must approve that exact version before approved public release. Say
**"push to GitHub"** when this validated local checkpoint should be backed up;
no staging, commit, push, or deployment occurred in this task.
