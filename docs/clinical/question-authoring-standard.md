# Question authoring standard

Version: `question-authoring.2026-11-04.v14` (owner author self-review gate after N1 independent review).
Owner approved the difficulty,
option-count decisions on 2026-10-28. Clinical content,
clinical evidence claims and AI-assisted revisions remain
**`needs_clinician_review`** until a named clinician approves the exact version.
The superseding owner decision on 2026-10-28 rules out per-question correctness
collection or analytics. This standard does not clinically approve the bank or
establish measured difficulty. It applies to all questions; phase 1 is a pilot, not completion of
the whole-bank rewrite.

**Superseding owner decision, 2026-11-02:** Melissa Rowland is the named
clinical sign-off. Her eleven exact reviewed pilot versions are recorded as
`clinically_approved` using `lastClinicianReview`, with the reviewer name and
dates supplied through the manager. This approves no other version, claim,
concept or finite presentation profile.

The [bank rewrite pipeline](../execplans/question-bank-rewrite-20261102.md)
permits rewritten drafts to enter the invited beta after adversarial review,
manager acceptance and release checks, under the existing demonstration/not
clinically approved label. Owner approval can follow beta exposure and applies
to exact versions. This worker ships nothing; an author self-check never
substitutes for independent adversarial review or manager acceptance. Drafts
remain `needs_clinician_review`. The former mandatory pre-beta owner-review
hold is superseded, not silently carried forward.

**Standing owner program, 2026-11-04:** rewrite the whole bank using accumulated
owner comments and voluntary in-game flags. The owner no longer reviews pages.
Work in bounded batches, normally about forty variants: author, run advisory
lint, regenerate a key-first review-only technical packet, validate, then stop
and hand off to the manager for independent review and release. A technical
packet is not an owner-page approval gate. The [program plan](../execplans/question-bank-program-20261104.md)
records the queue and exact-version freezes. Existing owner-approved versions
remain exact unless an owner's own note requests a change; make a new draft
version rather than overwrite the approved definition. Melissa Rowland remains
the named clinical sign-off; flags are editorial direction, not clinical approval.

The [research synthesis](../research/question-writing-strategy-20261028.md),
[40-item manual audit](../research/question-cue-audit-20261028.md) and
[source records](../research/sources-question-writing-20261028.md) retain the
evidence, rights assessments and limitations. The pilot review and complete
inventory are in `docs/research`.
The [round-three/batch-one source ledger](../research/sources-question-round3-batch1-20261102.md)
records added facts, rights and a withheld source discrepancy.
The adversarial-correction ledger, `docs/research/sources-question-adversarial-20261102.md`,
records the subsequent targeted checks and atomic claims. These do not confer
clinical approval.

## The decision to test

Review six adds four requirements. A follow-up must compare a real remaining
decision, rather than offer a plainly indicated referral against unsupported
delays. Read functional outcomes against the activity actually attempted:
completed work on modified duties is different evidence from tolerating the
original task. A current reassessment may change an earlier symptom attribution;
state chronology and show the observations instead of announcing that cause.

Audit the full visible sequence, including prior answers, returned results and
feedback. Byte-preserving a later question does not preserve its difficulty if
an earlier task or explanation rehearses the same discriminator. Change the
returned item to test a distinct decision and remove its answer-specific
scaffold. Do not silently edit a frozen PASS version to solve that problem;
record any residual sequence limitation for manager review.

Do not withhold a necessary negative to avoid cueing: represented dermis alone
does not establish absence of invasion. Supply the observation needed for a
single key, then make its interpretation consequential. Report matrices need a
real planning consequence, not two restatements of the same elementary rule.

Test novelty and convergence separately. If every distractor repeats a completed
comparison while only the key introduces a new one, a reader can answer without
the data. Offer equally novel, clinically credible comparisons. Likewise, a
table's majority components must not uniquely assemble the key. Hide the
decisive row and re-attack remaining labels for a unique stain, phrase or label
match. Difficulty predictions remain qualitative and are not correctness gates.

Write one narrow learning objective and one complete task before writing the
vignette. **Default to two-step reasoning: interpret raw findings, then make a
clinical decision. Residents should struggle.** A two-step label is insufficient
if either inference is supplied by the wording or the distractors are easily
dismissed. Use the closest credible errors a resident could make at this stage
of care. Routine resident items should require application or analysis: infer
a finding's meaning, compare plausible mechanisms, interpret raw results or
select a next step with explicit goals and constraints. Two-step reasoning is
useful when both steps are supported, rather than two separately scored tasks
hidden in one item. A key-features approach concentrates on a consequential
decision where a common clinical error changes the action. The public
[NBME guide](https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf),
[NABP guidance](https://nabp.pharmacy/wp-content/uploads/2024/07/NAPLEX-Item-Writing-Best-Practices-2024.pdf)
and [MCC key-features guidance](https://mcc.ca/wp-content/uploads/CDM-Guidelines.pdf)
inform these rules; the MCC document is historical. See QWE01–07 in the synthesis
for the exact source mapping and uncertainty.

The stem must pass the cover-the-options check: a knowledgeable resident can
state what decision is requested without seeing the choices. This checks task
completeness, not ease. Separate presentation and question display must still
leave the task complete. Name the patient in the clinic; show a consistent age
and sex; use a 1–5-word complaint. Retain clinically constrained profiles and
caregiver context. Educational tier, patient acuity, facility capability and
facility progression index remain separate.

Employee discussions retain their named employee and work context; they do not
become medical patients or acquire patient demographics merely to fit a
vignette template. Clinical patients still require the stated age/sex and
character consistency. Keep fictional study values visibly labelled as
constructed data without teaching their interpretation in the exhibit caption.

Basic terminology, recognition and interface tutorials may intentionally be
easy. Label the intended purpose explicitly. Do not manufacture resident-level
difficulty by obscuring a simple concept or importing an unrelated objective.
Desired difficulty remains a reviewer prediction, supported by the stated
inference and plausible errors rather than gameplay answer statistics.

The second independent review adds a stricter author check. State the resident
error being tested, the closest credible alternative, the exact observation
that separates it from the key, and the consequence of interpreting that
observation incorrectly. Counting two verbs or several laboratory values does
not establish two-step reasoning. A diagnostic label followed by a redundant
synonym is still one classification. Prefer a sequencing error, a reversible
cause, a protocol/coverage distinction, a specimen-clearance problem or a
finding that changes an otherwise reasonable plan. Supply decision-critical
protocols and criteria; withholding them creates ambiguity.

A single-rule item is not basic merely because it has a narrow concept, an
existing management companion, or a low educational tier. Review three rejected
32 such labels. Change the task so the rule competes with a credible patient
consideration: specimen/scan adequacy, a medication indication, actual response
trajectory, a conflicting target effect, or the order of treatment escalation.
State the closest error and the finding that makes it wrong. Merely supplying
several observations or requiring recall before another recall is insufficient.

Only a specifically accepted basic/onboarding role may retain
`basicRecallIntentional` and its one-line purpose in this batch. Mark that
separate decision `basicAccepted: true`. Do not relabel a returned item basic
again without independent acceptance. Review three accepts B01, B10 and B29;
accepting B29's educational role does not resolve its disputed recovery key.
The manager subsequently directs REVISE to take precedence for B29: apply the
missing post-reversal recovery-assessment criterion. Preserve the old version
for frozen encounters. Its new fairness repair may retain the accepted basic
purpose, but is not an exact-version PASS or clinical approval.
Independent review five subsequently passes the exact repaired B29 version as
accepted basic onboarding. Round six freezes B29 with B01 and B10; its editorial
PASS remains separate from clinical approval.
An underspecified protocol remains unfair at any tier. Neither basic acceptance
nor editorial PASS grants clinical approval.

An independent PASS binds the exact question version and visible case fields.
Preserve those fields while correcting adjacent returned questions. Record
`pipelinePassed: true` only for an exact independently passed version; retain
the source review and version ID. Independent review five passes 57 versions,
including the repaired B29 basic item. Round six preserves those exact versions
and the eleven exact clinical approvals while revising only the sixteen returned
items. No new draft is independently passed by an author's self-check.
Review changed preceding feedback and encounter continuity as well as the
passed task; editorial PASS remains separate from Melissa's clinical approval.

If the applied task materially changes the scored clinical objective, create an
explicit new concept version under the existing authoring metadata mechanism.
Record its previous concept ID, changed objective, clinical reason, claims and
review state. Keep the old definition and all exact question/timing/order
records for frozen encounters; do not transfer FSRS history to a different
construct. Check selection coverage separately: the existing selector requires
every concept in a multi-step case to be unseen or due. A future-due companion
can block either a new first or later objective; the selector can select either
position when the entire case is eligible. Sixteen new versions in this batch
have only paired coverage. Report that constraint and fixed-time unseen-supply
results to the manager; do not change FSRS eligibility or pretend an old
standalone assesses a new construct. The manager accepts paired-only coverage
for now; do not change selection or routing in these revision rounds. The actual
Level 5 input rebind and legacy behavioral-evidence refresh belong to the
manager in the release worktree. Authoring workers preserve those files.

Every option must answer the same complete task. Asking for a pressure study
when only the key is a study pre-filters other care plans without an inference;
use a neutral next-plan task or comparable investigations. A next-cycle QI task
should not preselect the intervention dimension and make its workload exhibit
irrelevant; ask for the comparison and require the process/control distinction.

Every choice should read like a real decision, not a critique of a wrong
answer. Remove option phrases such as "assume," "solely because," or "without
addressing" when they merely announce the error. Keep the distinguishing plan
component and move its rationale to feedback. Review earlier feedback as part
of the next task: an explanation of the current investigation should not state
the next task's keyed management answer.

The adversarial-review lesson is to test the proposed reasoning, not merely
count steps in an author's description. Use a real competing interpretation or
decision error, then check that the supplied observations resolve it. Explicitly
label safety/recognition exceptions such as an obstructed nonreducible stoma;
retain the warning signs. Manager/independent review must accept that exception
instead of calling it a hard resident item.

## Information and negatives

### Owner/tester flag lessons, 2026-11-04

The accumulated owner review-page decisions add these requirements:

- **Test important, practical decisions.** State what a surgery resident would
  actually do differently after interpreting the finding. Do not manufacture
  difficulty around an inconsequential report label or an artificial comparison.
  If the objective adds little value or duplicates a useful decision elsewhere,
  place it on the retire-or-merge proposal list for manager acceptance; do not
  delete a concept or change FSRS membership yourself.
- **Name the actual action or treatment in every option.** Replace generic
  treatment assessment, management discussion or individualized planning with
  the specific investigation, medicine, operation or referral being proposed.
  The owner's examples include Heller myotomy and PPI therapy; those examples
  are a wording lesson, not a rule that either is the key in an unspecified
  patient. Supply the criteria that distinguish credible competitors, with
  appropriate claims and sources. Do not rank equally defensible procedures
  without a supported patient-specific reason.
- **Prefer an exhibit the learner interprets.** When the objective depends on
  a tracing, scan or image, show a usable exhibit instead of a prose conclusion.
  Confirm the asset actually exists and renders; do not promise a picture that
  is absent. A new independently drawn teaching schematic must be labelled as
  constructed, supported by mapped facts and reviewed; it must not copy a
  protected figure or pretend to be a patient's real diagnostic image. Its
  description/caption must not name the diagnosis or rehearse the answer.
  Keep essential accessibility observations available without supplying the
  interpretation. A table can be appropriate when numerical comparison is the
  actual task; decorative exhibits do not raise cognitive level.
- **Delete framing that adds no decision information.** Sentences announcing
  that a diary or examination follows, or that an existing exercise program
  continues, must pass the same deletion test as clinical facts. Do not replace
  them with another teaching sentence or a task that announces the key.
- **Make the clinical story and action agree.** A reproducible defect with an
  impulse or reducible protrusion cannot be treated as reassuring evidence
  against a hernia. Distinguish a nondiagnostic resting examination from a
  dynamic examination that demonstrates a defect. Use clinically realistic
  acquisition and treatment pathways; do not make MRI a routine hernia step
  simply to add complexity. State a real residual uncertainty if additional
  testing is needed, and preserve urgency findings.
- **Ask one concrete, specific task.** Name what decision the player must make
  now and the relevant patient/site/stage. Do not ask a broad hormonal-workup
  question with several indicated screens as mutually exclusive answers.
  Abstract QI wording must identify a practical process, decision and meaningful
  outcome; complexity of labels or tables is not clinical relevance.

These rules supplement the existing raw-findings, no-cue, parallel-option and
deletion checks. Clinical realism and practical importance require human review;
a lexical lint warning or its absence cannot establish either.

The independent flag review found that substituting raw terms for a diagnosis
does not by itself create a resident application item. Before submission, name
the consequential finding and the credible error it defeats. Change that finding
in a counterfactual version: the decision should change. Require interpretation
of the actual record followed by a decision; two successive labels for a familiar
association are one recall chain. Preserve fairness when doing this.

Compare actions at the same decision stage. A request to review more information
must not compete with the treatment that may follow that review unless an actual
unresolved discrepancy is supplied. Do not make the key the only cautious or
comprehensive plan. Do not use a completed test as a disposable foil: repeating
a test can be appropriate when the protocol, sampled target or adequacy differs,
and those observations must be visible. In paired interpretations, balance the
component frequencies across all options so convergence cannot select the key.

Named instrument results may be legitimate data when the objective is interpreting
what a reported measure establishes. Identify the instrument and its limits;
do not substitute an author-written eligibility conclusion for raw eligibility
findings, reproduce a proprietary instrument, or invent a score/cutoff. A risk
screen is not a diagnosis. These applications still need independent difficulty
review; an author's two-step description grants no pipeline PASS.

Melissa Rowland is clinical sign-off; Dustin's flags are tester feedback, not
clinical approval. Check the exact flagged variant against released rewrites.
A repaired sibling does not resolve another version of the same concept.

- **No “X alone” options.** Name the competing plan. Removing the word while
  retaining an obviously incomplete caricature does not repair a distractor.
- **No generic individualized/tailored/shared-decision answer beside specific
  alternatives.** Describe the actual proposed investigation, procedure,
  referral target or care plan in every choice. Individual judgment remains
  appropriate clinical reasoning, but is not an answer-label shortcut.
- **Delete feasibility permission that previews the key.** Statements that
  transfer is immediately available, HIDA will not delay care, or the patient
  can swallow and medicines are available can rehearse the keyed rationale.
  Retain a genuine decision-critical constraint in neutral terms and compare
  actions that remain reasonable under that constraint. Apply the deletion
  test to each sentence, including preferences, case details and the task.
- **Give findings rather than authored eligibility or diagnosis conclusions.**
  Replace “meets biopsy criteria” with the measured/observed components needed
  to apply a verified rule. Replace a named rejection mechanism with the
  necessary timing, specimen and immune findings when interpretation is tested.
  A known diagnosis may still be supplied for a genuinely different management
  task. Raw detail must have adequate claim/source support; do not invent an
  ultrasound cutoff or upgrade a general patient page into a verified criterion.
- **Use clinically and anatomically credible competitors.** A shoulder-referral
  item with phrenic versus remote limb nerves is not made difficult by four
  choices. Compare real competing pathways, sites, procedures or resident
  errors. Parallel labels and a clean lint report do not establish plausibility;
  have a clinician check every distractor and the closest near-miss.
- **Make the tested decision and anatomy explicit.** Say “neck lymph node” or
  “cervical lymph node” when neck nodes are intended. State who obtained and
  interpreted a report. Describe what imaging showed at the relevant site
  instead of only saying “negative”; distinguish no correlate from a benign
  correlate or an inadequate examination. Match the grammar of every option
  to a complete task (an instruction task needs instructions, not noun fragments).

The v6 advisory linter reports exact phrases for these rules, including a
bounded shoulder/phrenic anatomical screen. It is not a clinical ontology and
does not establish that remaining nerves, choices or criteria are valid.
Wording checks may flag a legitimate constraint; disposition requires documented
human review, not an automatic rewrite. Scan all finite presentations and prior
visible feedback, while keeping post-answer rationale metadata separate.

Source and scope checks are separate. A head/neck guideline does not establish
ABSITE scope; use a permitted public ABS outline, never SCORE or recalled items.
When network is excluded, reuse recorded verified claims with their actual
access dates and limitations. Record a source-verification hold or propose
retirement if the required criterion/scope cannot be established. Such a draft
must not pass the release pipeline merely because tests pass. In particular,
the manager supersedes the earlier author retirement proposals on 2026-11-04:
**keep the exact live F14 thyroid-nodule FNA-selection version unchanged** until
a permitted source supports the exact criteria, then rewrite in a later batch.
Thyroid FNA selection remains core general-surgery content. **Keep neck-node
initial evaluation and the round-two wording-clarity repairs**; the manager
confirms it is general-surgery content. This is a scope decision, not a claim
that a public ABS outline was newly retrieved. The sixteen round-two flag
drafts are frozen while their independent review runs. Historical proposal
records remain historical; no retirement, selector or FSRS change is applied.

These lessons add no per-question correctness collection, answer-frequency
input or analytics. Quality remains assured by this standard, advisory lint,
owner/clinician review and voluntary question flags.

The owner's 2026-11-02 lesson is to prefer concrete, specific clinical details
over generic author summaries. Give the observed ultrasound components rather
than only calling a study inconclusive. Name a realistic prescribed regimen
when its components matter rather than saying a regimen is taken as prescribed.
Support named combinations and added clinical facts with atomic claims and
current permitted sources. Do not invent a dose, threshold or timeline to make
a vignette look concrete; laboratory-relative descriptions can be sufficient.

A summary label can be an authored hint, especially when it selects the next
test or action. Replace it with the observations needed for that inference,
then re-solve the item. Do not remove genuine uncertainty reported by a test,
pretend the raw findings prove more than they do, or make every normal finding
an option-specific exclusion. A diagnosis may appropriately be supplied for a
management task. Specificity must serve the tested decision and pass the
deletion test; extra detail alone does not make an item difficult.

Check the complaint, canonical patient, finite profiles, current update and
returned results together. They must describe the same patient, lesion/site,
workup stage and timeline. A duodenal ulcer must not become a gastric ulcer in
the next task. A hypothetical future response must remain conditional when the
encounter has not included that treatment. Complaints must also fit the current
constructed study setting; an unrelated retained specialty is distracting
noise, and a diagnosis in the complaint can undo careful raw findings.

If a raw report labels several regions, present observations for every offered
region and make the learner interpret them. Do not let only the key repeat a
descriptive phrase such as peripheral solid component. Preserve necessary data
such as normal nodal imaging when the misconception is that imaging excludes
microscopic disease; deleting that finding would change the decision being
tested. Avoid repeating the same negative in both presentation and update.

The owner's 2026-10-29 review extends cue review to every case detail. A neutral
task does not rescue a presentation that paraphrases the key's rationale. A
request to preserve tissue can select limited surgery; a description of an
oversized appliance opening can name the refitting action before the learner
has inferred it. Setting/availability sentences can also supply the intended
test-selection rationale. Audit preferences, goals, mechanism descriptions and
setting alongside the lead-in and options.

Apply the deletion test sentence by sentence: if deleting a sentence leaves the
decision, its single best answer and necessary patient context intact, remove
it. Required patient presentation fields still have a job; decorative clinical
sentences and permissions do not. If a sentence states or paraphrases the key's
reason, replace it with supported raw observations or change the task/options
so the resident must perform the inference. Do not simply delete a necessary
goal while retaining two defensible operations. Recheck the current evidence
and option ranking after every deletion.

Patient preferences and setting constraints may legitimately determine care.
Use them when applying that constraint is the objective, not as an unexplained
tie-breaker that makes the key obvious. If the observations do not prove an
exact mechanical defect, ask for appropriate assessment rather than assume a
specific dimension or corrective product. Never manufacture hidden findings
to make a refitting, diagnostic or management key unique.

Provide decision-critical observations, timing, relevant setting, prior workup,
resource constraints and patient goals. Withholding an interpreted label can
be legitimate: show examination findings, laboratory results, an imaging
description or a pathology panel and ask the resident to interpret them.
Withholding the information necessary to distinguish the offered alternatives
is illegitimate. Multiple defensible keys, vague goals and unsafe missing red
flags fail review even when they make an item difficult.

For each positive and negative, document its job: establish the syndrome,
distinguish a close alternative, establish safety/eligibility, or supply context.
Delete details that merely recite the reasons every distractor is wrong. A
statement such as an integrated workup excluding three offered diagnoses
replaces reasoning with elimination. Raw observations should keep several
credible alternatives initially alive, with a defensible deciding feature or
combination. Necessary normal findings and contraindication checks stay.

There is no evidence-based quota of negatives or instruction to balance their
number mechanically across diagnoses. The [NBME guide](https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf)
permits clinically purposeful negatives; our targeted review found no validated
optimal count (QWE03). Review their effect on this option set. A positive finding
can disclose the key just as readily as a negative can delete a distractor.
Avoid a pre-answer teaching sentence, diagnosis name in a diagnosis task,
named keyed test, management permission that repeats the requested action, or
an interpretive conclusion that the learner was supposed to reach. A known
diagnosis is appropriate for a management task when it is a prerequisite.

Do not relocate the answer rule from the vignette into the lead-in. Ask a
neutral, complete clinical task instead of naming the safety hazard, definitive
property, first-line rule, most-sensitive/most-specific distinction or gold
standard that the learner must infer. For example, asking which test precedes
an adrenal biopsy need not announce a “specific safety risk.” These terms can
be legitimate when the learning objective really is an explicit comparison of
that property; reviewers must decide whether the term supplies the inference.
Keep decision-critical goals, patient preferences and eligibility in the
clinical context. Removing them can create multiple defensible answers.

Review the task against the options as a separate pass. A task word or phrase
that matches only the key can reveal the answer even after the presentation is
improved. Use natural parallel labels rather than awkward synonyms or filler
to evade a lexical warning. An accepted warning needs an explanation of why
the word is necessary and gives no unfair advantage. Keep feedback-style
instructions, interpretation and teaching after the answer.

Inspect the whole visible sequence: complaint, presentation, finite profiles,
current update, exhibits, previously returned results and prior feedback.
Prior explanations may legitimately scaffold a later task; record when that
makes the later item recall rather than independent reasoning. Never expose
future results to an offline cue calculation for the current task.

## Options and rationales

Use **three or four credible options**. Never pad the set. All labels answer the
same task, use parallel grammar, comparable specificity and length, and the
same semantic category. Name all tests in the same style. Keep rationales and
causal explanations in feedback, not option labels. Avoid rhetorical absolutes,
word repetition unique to the key, a uniquely long/qualified key, grammatical
fit cues, convergence, overlapping or near-duplicate labels, and implausible
actions. True clinical absolutes may be necessary; the reviewer must justify
them. Randomize runtime choices. Review artifacts may put the key first only
when explicitly labelled **“key shown first for review only.”**

Each distractor needs an independent rationale: the common error it represents,
why someone would choose it, and the finding/goal making it less appropriate
here. Use real misconceptions, a plausible neighboring diagnosis, the right
action at the wrong stage, or a misinterpretation of the supplied data. A
factually absurd or already explicitly excluded option adds little measurement.
The nursing study by [Tarrant et al.](https://link.springer.com/article/10.1186/1472-6920-9-40)
found many nonfunctioning distractors; [Kilgour and Tayyaba](https://link.springer.com/article/10.1007/s10459-015-9652-7)
supports using a smaller credible set rather than filler. These cohorts do not
establish a surgical-resident cutoff. Distractor quality here is judged from the error it represents and clinician
review of its plausibility (QWE04–05); the game does not collect option-selection
statistics for this purpose.

Testing choices, including wrong choices, require runtime wait metadata. Keep
fixed waits out of authored prose. Retain service/result-gate alignment and
timing classification for exact choice identity and label.

Attack runtime presentation cues too: a key must not be the only plausible
testing/procedure plan with an estimate merely because its competitors lack
metadata. Use the existing placeholder profiles for all offered testing paths;
do not invent wait durations or execute new orders to repair presentation.
An estimate for a future plan is not proof that the game performs that work.
Review modality/procedure labels against the mapped profiles after reordering
options; array-position reuse can attach the wrong estimate to a distractor.

## Predicted difficulty and quality review

Question quality is assured by this authoring standard, the advisory cue linter,
owner and clinician review, and existing voluntary tester question flags.
There is no per-question correctness collection or analytics. The linter reads
authored content only and accepts no answer-statistics input. Existing game
learning and frozen-save behavior remain outside this quality-review workflow.

| Intended purpose | Reviewer prediction | Interpretation |
|---|---|---|
| Routine resident | approximately 40–65% would succeed | Authoring/review intent, not a measured gate |
| Stretch subset | approximately 25–45% would succeed | Still one defensible key with reasoning expected to distinguish preparation |
| Tutorial / foundational | explicitly labelled | Purposeful ease reviewed separately |

These percentages are owner intent for reviewers, not computed rates, release
cutoffs or calibrated performance claims. Reviewers should explain the inference
and common errors they expect to separate stronger from weaker residents.
With three/four options, guessing remains material; difficulty must come from
the decision, not ambiguity, absent critical data or implausible alternatives.

Use voluntarily supplied tester flags and comments to identify confusing
wording, giveaway cues or disputed keys. Review the exact revision and full
visible context, check the evidence, and resolve clinical disagreements.
Voluntary flags provide qualitative issues for review, not a denominator or
a performance dataset. Do not mine saves, FSRS histories, usage receipts or
flag exports to derive correctness statistics. No analytics collection,
answer-statistics report, automatic performance flag, sample rule or statistical
release gate is part of this standard.

```text
npm run clinical:lint -- --summary
npm run clinical:lint -- --json <local-authored-cue-report.json>
npm run clinical:lint:test
```

## Pre-publication checklist

- State the intended inference, audience and cognitive purpose. Keep the
  concept/version decision explicit.
- Solve the item with options covered; independently verify a single best key
  under the stated setting, goals and available resources.
- Review every negative/positive against every option. Preserve safety and
  eligibility information; remove preinterpretation and option-by-option exclusion.
- Audit the lead-in separately: no relocated decision rule, pre-answer teaching
  or unnecessary key-only task word. Explain legitimate named comparisons and
  necessary goals; do not hide information needed for one best answer.
- Apply the deletion and rationale-paraphrase tests to every case sentence,
  including patient preferences, setting permissions and mechanism descriptions.
  Document the observation that replaces each removed interpretation and
  independently re-solve the revised option set.
- Supply three/four parallel, credible choices and a temptation/ranking rationale
  for each distractor. Inspect grammar, specificity, length and repetitions.
- Check named patient, age/sex, complaint, complete separated task, profiles,
  prior feedback, randomization, waits and service/result-gate consistency.
- Map every substantive claim to atomic evidence, rights-reviewed sources,
  limitations, last-checked date and clinical-review state. AI drafts stay
  `needs_clinician_review`; tests never grant approval.
- Run advisory lint on the assembled release; document accepted flags and why.
  A clean lint result cannot detect ambiguity or validate a clinical key.
- Obtain independent clinician review of the exact wording, profile constraints,
  evidence and distractor ranking; restrict drafts to unapproved preview.
- Preserve stable concept IDs for unchanged meaning, version changed wording,
  preserve frozen encounters and legacy timing; schedule any evidence rebind.
- Review voluntary tester question flags against the exact variant and visible
  context. Resolve disputed keys with a clinician; keep difficulty labelled as
  reviewer prediction.

## Pipeline and repeated exposure

Use this standard alongside the existing workspace template and field guide;
do not add unvalidated fields to the normalized authoring schema. The versioned
pilot module demonstrates a revision manifest plus authored questions,
evidence claims and source metadata. Future authoring UI/schema work can make
inference, distractor error, negative purpose and difficulty intent structured.

`clinical:lint` is an offline advisory command, outside the build gate. It emits
rule IDs, exact fields/phrases, offsets, choice IDs, ratios and profile/context
occurrences. Heuristics cover length/qualifiers, key overlap/test aliases,
explanations/absolutes, lexical category differences, convergence, duplicates,
diagnosis disclosure and lexical negative-to-distractor matches. They neither
understand clinical exclusion nor infer measured specificity. Review false
positives; extend a small transparent alias list rather than treating it as a
medical ontology. The complete inventory includes metadata gaps explicitly.

The lead-in principle heuristic flags a small explicit vocabulary for human
review. A separate rule compares that vocabulary with explicit authored
per-option rationales only when every option has a nonconflicting reason; it
flags a principle matched in the key's reason alone. Rationale text is
post-answer metadata, never pre-answer context. Report this coverage limit:
missing reasons do not establish that the key is unique, and lexical matching
does not establish a medical rationale. Both rules are advisory.

Case-detail lint also flags explicit preservation goals, availability permissions
and a small opening/fit-mechanism vocabulary. A separate phrase rule compares
case details with the key's explicit rationale only when every option has a
consistent authored reason. It reports exact context and post-answer spans.
It cannot recognize every synonymous paraphrase or decide which observation is
decision-critical. These checks implement review prompts, not an automatic
deletion policy or a clinical judgment. Prior feedback remains separately
visible in the existing overlap review; it is not relabelled as a new vignette
sentence.

Review batches by facility entry index, tutorial sequence and case-reference
counts as labelled structural priority proxies. Voluntary tester flags and owner
review can change priority; no per-question exposure or correctness analytics
are introduced. Review all variants of a
concept together. Vary clinically meaningful evidence and error opportunities,
not just names/numbers; avoid a repeated keyed phrase or uniquely styled option
across siblings. Keep stable concept FSRS history when meaning is unchanged.
[Fraundorf et al.](https://link.springer.com/article/10.1186/s41235-023-00508-8)
supports cautious transfer-oriented practice; it does not validate FSRS or this
game's variant strategy. The game literature in QWS15 likewise does not prove
that a cue-free item improves surgical outcomes.

Remaining owner/manager decisions: stretch proportion, classification of
deliberately easy items and batch acceptance. Clinicians decide exact keys, close
distractors, necessary findings, profile eligibility, evidence sufficiency and
whether changed meaning requires a new concept version. Phase 1 claims no
resident-performance improvement.

## Review-four lessons applied in round five

The [fourth independent review](../research/question-batch1-adversarial-review4-20261102.json)
adds these checks to the existing deletion and cue-attack rules:

- A named omission can be the answer cue: "no repeat examination yet" or "no
  assisted placement attempted" tells the learner which option to select. Use
  actual chronology, catheter position or acquisition observations where they
  establish the same necessary boundary. Do not remove genuinely needed data.
- Compare real choices at the same decision stage. A uniquely complete or
  cautious key against two knowingly premature treatments is not resident-level
  discrimination. Give comparable diagnostic or care plans; put the errors
  and explanations in feedback, not in the option wording.
- A missing exported series is not proof that an acquisition was never made.
  Check acquisition/administration records before ranking retrieval against
  repeat testing. Likewise, "near post-resuscitation values" is circular if
  those observations and support trajectory are unspecified. Supply the actual
  relevant record and availability; do not turn observations into new cutoffs.
- Apply the deletion test to the entire update or exhibit. If the same key
  follows without it, change the task or remove it. When a shared passed case
  premise is frozen, a different evidence-status decision can be appropriate;
  explicitly version a changed construct and preserve the passed companion.
- Compare proposed improvement tests from the same actual baseline. Let the
  table determine the process component; avoid stale-source foils and a stated
  goal that already names the key. Define compatible denominators and separate
  counts from time totals. Plausible efficiency adaptations retain clinical
  assessment rather than advertise that an important step will be omitted.
- Review runtime wait previews as clinical presentation. A rewritten
  interpretation must not inherit biopsy waits from its former options, and a
  new testing distractor must have a preview. Append exact new timing/order
  identities while retaining all frozen records; use existing placeholder
  profiles and do not write fixed waits in prose.

New atomic mappings may reuse adequately verified existing sources offline.
Record the original access date and reuse/authority assessment; do not imply a
fresh retrieval or independent corroboration from a second ID for the same
publication. The [round-five source ledger](../research/sources-question-adversarial-r5-20261102.md)
records those distinctions. Every new question, construct and claim remains
needs_clinician_review. No correctness analytics or measured difficulty gate
is introduced.

## Review-five lessons applied in round six

The [fifth independent review](../research/question-batch1-adversarial-review5-20261102.json)
requires a separate context-variant check. Cover the options and interpret the
update using the earlier presentation. Then delete the update and try again:
if the same answer follows, the added data have not earned a scored inference.
Change the task or data so the specimen map, acquired response, interval course
or competing outcome changes what may be concluded. Preserve decision-critical
facts and all exact passed companions; do not hide an inadequate acquisition.

An update must not simply name the trigger for the next action. An anatomy word
followed by the same rehabilitation label, or a food symptom followed by the
only food test, can remain easy after cosmetic rewriting. Use the actual
relationship between observations. A technically adequate negative study and
an examination of the wrong site are different; improving function despite an
unchanged image differs from new reduction-responsive work interruption.

Keep the background care the same across options. If rehabilitation continues,
put it in shared context and compare hernia referral policies at the same scope.
Avoid the uniquely comprehensive combined plan or the only noncommittal
pathology label. Equally cautious alternatives must still be clinically distinct,
not filler. A balanced component matrix is useful only when each component
requires interpretation; inspect it for convergence, logical elimination and
near-duplicate wording rather than assuming symmetry guarantees quality.

For specimen tasks, separate represented tissue, involved tissue and tissue
not sampled. Retain valid local evidence while limiting whole-lesion claims.
An incomplete sample is not automatically useless, and a benign overlying
sample is not automatically confirmation or contradiction of a deeper lesion.
If this changes the scored objective from procedure selection to evidence
interpretation, explicitly version the construct. A shared requested procedure
can remain common to the options; wait previews must then have equal scope.

For constructed process data, require a real tradeoff or confounding problem.
Preserve denominators and comparable baselines, distinguish a proposed next
test from proof of benefit, and make more than one row or factor necessary.
Do not add decorative values or introduce gameplay analytics to target difficulty.

The [round-six response ledger](../research/question-adversarial-round6-response-20261102.md)
and [source ledger](../research/sources-question-adversarial-r6-20261102.md)
record the changed objectives, indexed notes and limits of offline source reuse.

## Owner author gate after N1 review, 2026-11-04

The owner makes this a pre-handoff requirement for every authored or revised
batch. The [N1 independent review](../research/question-new-n1-review-20261104.json)
returned two PASS, 37 REVISE and one FAIL; a clean lexical report had not
established resident difficulty or fairness. The author must manually apply
the reviewer's rubric to each new or revised exact item and record the result:

1. **Cover-the-key cue attack:** inspect wording overlap, length and specificity
   outliers, convergence, negatives eliminating options, teaching sentences,
   “alone,” generic/individualized answers and availability cues across every
   visible field and finite profile.
2. **One decision stage and category:** every option answers the same actual
   decision, with specific named investigations, medicines, procedures or plans.
3. **Two consequential steps:** interpret findings, then apply their meaning.
   An author-supplied interpretation followed by matching a label is not enough.
4. **Resident difficulty:** a PGY-2/3 should plausibly find the item moderate or
   hard because of credible competing clinical errors, not ambiguity, obscure
   unsupplied policy, decorative detail or unrelated objectives.
5. **One defensible best answer:** supply the context and supported criteria
   that resolve the closest alternative. State the counterfactual that changes
   the decision and retain source/clinical uncertainty separately.

Rewrite an item that fails before handing it off, and reapply all five checks
to the new exact version. Record concrete attacks, reasoning and repairs;
automatically assigning five successful booleans is not this manual review.
Difficulty remains a qualitative author/reviewer prediction, never a measured
correctness gate. Author self-checks confer no independent PASS or clinical
approval. Preserve exact independent PASS versions and any batch frozen while
its independent review is running; apply repairs only in the authorized lane.
