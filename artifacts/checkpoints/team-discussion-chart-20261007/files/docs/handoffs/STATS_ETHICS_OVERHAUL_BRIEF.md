# Statistics and ethics question overhaul — brief for Codex

Prepared by Claude Code, 2026-10-07, from an owner brainstorming session.
Scope: the GS-028 batch in
`packages/clinical-content/src/development-batch/2026-09-29-statistics-ethics/`
(28 concepts / 112 variants). All records stay `needs_clinician_review`.

## Owner decisions (2026-10-07)

1. Some statistics questions may be **patient-facing**; methods questions move
   to colleague settings.
2. Ethics questions may be **embedded in multi-step clinical cases**.
3. Claude Code owns the **layout change** (done; see below).
4. **No wrong-answer consequences**: no narrative "what happened" outcomes for
   wrong ethics or statistics picks.

## Already done (Claude Code, presentation only)

Team discussions now render through the patient chart sheet (`ChartPanel`)
instead of the old single-column `EmployeeDiscussionPanel` layout:

- Header: portrait, employee name, role, the case `chiefComplaint` in the
  complaint slot, status pill, close.
- Left column: the scenario (`presentation`). Right column: question and
  answer grid (1–4 keys).
- After answering, the question stays visible. The answer rows show
  "Your answer ✕" / "Correct answer", and the feedback card appears directly
  beneath them. The feedback body is the node `explanation` (or the frozen
  answer's explanation), with no added prefix.
- The separate "Discussion summary" page is gone. On the final step, the
  feedback card's **File discussion** button acknowledges and files in one
  click. Earlier steps show **Continue**.
- No domain, content, scheduling, FSRS, or save-format changes.

Files: `apps/player/src/ui/EmployeeDiscussionPanel.tsx` (now an adapter onto
`ChartPanel`), `ui/ChartPanel.tsx` (subject kind, subtitle, file-label
override), `ui/types.ts`, `session/viewModels.ts`
(`employeeDiscussionView`), and `session/usePrototypeSession.ts`
(acknowledge → file).

## Problems in the current content

1. **Patient charts carrying research-methods homework.** Nine statistics
   topics (study design, bias/confounding, sensitivity/specificity, PPV and
   prevalence, RR vs OR, ARR/NNT, p-value, CI, errors/power) are ordinary
   patient encounters. `statistics-qi.ts` prefixes each one with "During a
   stable research-literacy follow-up, {patientName} reads a fictional
   report…". A surgical patient analyzing study tables does not make sense.
2. **The explanation is concatenated by code.** `draft()` in `statistics-qi.ts`
   and `variant()` in `ethics.ts` build `explanation` as
   "lesson + Correct answer: X + rationale + every distractor: rationale".
   `learningSummary` is then all explanations joined again. In the chart this
   reads as one dense paragraph, and it repeats the answer tags the UI
   already shows.
3. **Choice rationales do not reach runtime.** Per-choice rationales exist only
   on the authoring question records (`distractorRationale`). The runtime
   `SyntheticClinicalCase` answer choices carry only
   `id/label/isCorrect/serviceRequest`, so the UI cannot show "why not your
   pick" next to that choice.
4. **Data written as prose, not shown.** For example, "90 positive and 10
   negative results among 100 reference-positive samples" should be a 2×2
   table. Board-style statistics items give an exhibit.
5. **"Fictional" in nearly every stem.** That breaks immersion. The disclaimer
   belongs on a UI label ("Teaching dataset") and in the source/claim
   metadata, not in the prose.
6. **Test-selection items are repetitive and leak the answer.** The same
   distractor set recurs across variants. Several stems name the answer's
   setup (for example, "reviews a planned Wilcoxon rank-sum analysis… which
   feature supports rank-sum?"). Keywords such as "paired" and "independent"
   cue the key without testing the concept.
7. **Some ethics "patients" are bystanders or the story is about staff.**
   Examples: overhearing staff in an elevator, a neighbor employee browsing a
   chart, impaired-colleague scenarios. Each encounter also ends after a
   single ethics question.

## Requested content work

### A. Give every topic a natural setting

- **Patient-facing** (ordinary patient chart, named patient with age/sex,
  short complaint), where a real patient would raise the number:
  - PPV/prevalence: "My screening result was positive, so I have it?"
  - Sensitivity/specificity: "Does a negative test rule it out?"
  - ARR/RRR/NNT: "The ad said this halves my risk."
  - Risk numbers inside a consent discussion.
- **Colleague / journal club** (`participant.kind: "employee_discussion"`):
  test selection, study design, bias/confounding, RR vs OR naming, p-value,
  CI, type I/II error and power, PDSA, QI measures.
- Remove the "research-literacy follow-up" framing entirely.
- **Open issue:** the owner rule is that general stats/ethics appear from the
  beginning (level 1). Employee discussions currently require a hired GLP-1
  NP. Moving more topics to colleagues must not drop early supply. Propose
  how early methods topics reach the player (for example, other staff roles,
  or keeping some as patient-facing) before moving them.

### B. Embed ethics in multi-step clinical cases

- Use the existing multi-node case support (`FamilySpec.pairing` /
  multi-node `CaseSpec`). Example: step 1 arranges a qualified interpreter;
  step 2 is the actual hernia management decision. Error disclosure can
  follow a clinical step.
- Rewrite staff-centered stories so the patient is the subject, or move them
  to team discussions.
- Keep stable concept IDs when only wording or patient details change; create
  a new concept version only when the clinical meaning changes. Existing
  frozen encounters and saves must keep working.

### C. Structured fields (needed for the next UI pass)

1. **Per-choice rationale at runtime.** Carry each choice's rationale into the
   frozen case answer choice (for example, `rationale` on the runtime answer
   choice). This allows "why not your pick" and a per-choice reveal under
   "Show all choices".
2. **`teachingPoint`** per decision node: 1–2 original sentences. This is the
   takeaway shown first in the feedback card.
3. **`exhibit`** per case or node, kept small and typed:
   - `table`: caption, column headers, row headers, cells (for example, a
     2×2 table)
   - `keyValue`: labelled values (group risks, a CI, p)
   - `abstract`: a short original study summary with its numbers
   The UI will label exhibits as teaching data; prose should not say
   "fictional".
4. Stop generating the concatenated `explanation` and `learningSummary` for
   new versions. Keep `explanation` populated as a fallback, because older
   frozen saves and the current feedback card read it.

Agree the exact field names and schema location with Claude before
implementing UI-facing shapes, or propose them in the handoff. Claude will
render the exhibit card (story column) and the restructured feedback card on
both patient charts and team discussions once the data exists.

### D. Writing rules for the rewrite

- The stem must never name or describe the key's method; the exhibit carries
  the data.
- Vary distractors across variants; keep parallel grammar, comparable length
  and the same semantic category (AGENTS.md).
- Chief complaints are 1–5 words. Present the named patient in clinic; avoid
  "A patient with…"; never repeat the complaint sentence in the presentation.
- Each question states its task completely on its own.
- Humor stays on bureaucracy, mascots and project names; never on language,
  disability or patients.
- No invented clinical numbers. Numbers in exhibits are teaching datasets
  only. Every substantive statement keeps its atomic claim, sources and
  review status.

## Acceptance

- No ordinary patient encounter carries a research-literacy or "reads a
  fictional report" framing.
- Each statistics topic is classified patient-facing or colleague, with
  level-1 availability preserved or the gap explicitly reported.
- Ethics variants are either embedded in a multi-step clinical case or
  rewritten so the patient is the subject.
- New versions carry runtime per-choice rationale, `teachingPoint`, and, for
  quantitative items, an `exhibit`.
- Stable concept IDs and frozen saves are preserved; all new records are
  `needs_clinician_review`; content, admission and reducer tests pass.
